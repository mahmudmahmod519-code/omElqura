const AppDataSource = require("../../config/data-source");
const Order = require("../../models/Order.entity.js");
const OrderItem = require("../../models/OrderItem.entity.js");
const Perfume = require("../../models/Perfume.entity.js");

// ==========================================
// ✅ APIs للعميل
// ==========================================

// POST /add-to-cart - إضافة عطر للسلة
exports.addToOrder = async (req, res) => {
    const userId = req.user.id;
    const { perfume_id, quantity } = req.body;

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        // 1. هل المستخدم عنده order بحالة 'cart'؟
        const existingOrder = await queryRunner.query(
            `SELECT id FROM orders WHERE user_id = ? AND order_status = 'cart' LIMIT 1`,
            [userId]
        );

        let orderId;
        if (existingOrder.length === 0) {
            const insertResult = await queryRunner.query(
                `INSERT INTO orders (user_id, order_status, total_amount) VALUES (?, 'cart', 0)`,
                [userId]
            );
            orderId = insertResult.insertId;
        } else {
            orderId = existingOrder[0].id;
        }

        // 2. جلب سعر ومخزون العطر
        const perfumeData = await queryRunner.query(
            `SELECT price, stock_quantity FROM perfumes WHERE id = ? AND is_active = TRUE`,
            [perfume_id]
        );

        if (perfumeData.length === 0) throw new Error("العطر غير متاح");
        if (perfumeData[0].stock_quantity < quantity) throw new Error("الكمية غير متوفرة في المخزون");

        const unitPrice = parseFloat(perfumeData[0].price);
        const totalPrice = unitPrice * quantity;

        // 3. INSERT أو UPDATE (ON DUPLICATE KEY UPDATE)
        await queryRunner.query(
            `INSERT INTO order_items (order_id, perfume_id, quantity, unit_price, total_price)
             VALUES (?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE 
                quantity = quantity + VALUES(quantity),
                total_price = (quantity + VALUES(quantity)) * VALUES(unit_price)`,
            [orderId, perfume_id, quantity, unitPrice, totalPrice]
        );

        // 4. تحديث الإجمالي
        await queryRunner.query(
            `UPDATE orders 
             SET total_amount = (SELECT COALESCE(SUM(total_price), 0) FROM order_items WHERE order_id = ?)
             WHERE id = ?`,
            [orderId, orderId]
        );

        await queryRunner.commitTransaction();
        res.json({ success: true, message: "تمت الإضافة للسلة", order_id: orderId });

    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
    } finally {
        await queryRunner.release();
    }
};

// PUT /update-item/:id - تحديث كمية عنصر
exports.updateOrderItem = async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        // التحقق من أن العنصر ينتمي لسلة المستخدم
        const [item] = await queryRunner.query(
            `SELECT oi.*, o.user_id, o.order_status 
             FROM order_items oi 
             JOIN orders o ON o.id = oi.order_id 
             WHERE oi.id = ? AND o.user_id = ? AND o.order_status = 'cart'`,
            [id, userId]
        );

        if (!item) throw new Error("العنصر غير موجود أو لا ينتمي لسلة المستخدم");

        if (quantity <= 0) {
            // حذف العنصر
            await queryRunner.query(`DELETE FROM order_items WHERE id = ?`, [id]);
        } else {
            // التحقق من المخزون
            const perfume = await queryRunner.query(
                `SELECT stock_quantity FROM perfumes WHERE id = ?`,
                [item.perfume_id]
            );

            if (perfume[0].stock_quantity < quantity) {
                throw new Error("الكمية المطلوبة غير متوفرة في المخزون");
            }

            await queryRunner.query(
                `UPDATE order_items 
                 SET quantity = ?, total_price = ? * quantity 
                 WHERE id = ?`,
                [quantity, item.unit_price, id]
            );
        }

        // تحديث الإجمالي
        await queryRunner.query(
            `UPDATE orders 
             SET total_amount = (SELECT COALESCE(SUM(total_price), 0) FROM order_items WHERE order_id = ?)
             WHERE id = ?`,
            [item.order_id, item.order_id]
        );

        await queryRunner.commitTransaction();
        res.json({ success: true, message: "تم تحديث السلة" });

    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
    } finally {
        await queryRunner.release();
    }
};

// DELETE /remove-item/:id - حذف عنصر من السلة
exports.removeOrderItem = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const [item] = await queryRunner.query(
            `SELECT oi.*, o.user_id, o.order_status 
             FROM order_items oi 
             JOIN orders o ON o.id = oi.order_id 
             WHERE oi.id = ? AND o.user_id = ? AND o.order_status = 'cart'`,
            [id, userId]
        );

        if (!item) throw new Error("العنصر غير موجود");

        await queryRunner.query(`DELETE FROM order_items WHERE id = ?`, [id]);

        await queryRunner.query(
            `UPDATE orders 
             SET total_amount = (SELECT COALESCE(SUM(total_price), 0) FROM order_items WHERE order_id = ?)
             WHERE id = ?`,
            [item.order_id, item.order_id]
        );

        await queryRunner.commitTransaction();
        res.json({ success: true, message: "تم حذف العنصر من السلة" });

    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
    } finally {
        await queryRunner.release();
    }
};

// POST /checkout - إتمام الشراء
exports.checkout = async (req, res) => {
    const userId = req.user.id;
    const { payment_method, notes } = req.body;

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const [orders] = await queryRunner.query(
            `SELECT id, total_amount FROM orders WHERE user_id = ? AND order_status = 'cart' LIMIT 1`,
            [userId]
        );

        if (orders.length === 0) throw new Error("السلة فارغة أو غير موجودة");

        const orderId = orders[0].id;

        const [items] = await queryRunner.query(
            `SELECT COUNT(*) as count FROM order_items WHERE order_id = ?`,
            [orderId]
        );

        if (items[0].count === 0) throw new Error("لا يمكن إتمام طلب فارغ");

        await queryRunner.query(
            `UPDATE orders 
             SET order_status = 'pending_approval', 
                 payment_method = ?, 
                 payment_status = 'pending',
                 notes = ?,
                 updated_at = NOW()
             WHERE id = ?`,
            [payment_method, notes || null, orderId]
        );

        await queryRunner.commitTransaction();

        const redirectUrl = payment_method === 'instapay' 
            ? `/orders/${orderId}/upload-receipt` 
            : `/orders/${orderId}/payment`;

        res.json({ 
            success: true, 
            message: "تم إنشاء الطلب بنجاح", 
            order_id: orderId,
            redirectUrl 
        });

    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
    } finally {
        await queryRunner.release();
    }
};

// POST /:id/upload-receipt - رفع إيصال الدفع
exports.uploadReceipt = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    if (!req.file) throw new Error("يجب رفع صورة الإيصال");

    const payment_proof = `/uploads/${req.file.filename}`;

    const orderRepo = AppDataSource.getRepository(Order);
    const order = await orderRepo.findOne({
        where: { id, user_id: userId, order_status: 'pending_approval' }
    });

    if (!order) throw new Error("الطلب غير موجود أو غير مصرح");

    await orderRepo.update(id, { payment_proof });

    res.json({ success: true, message: "تم رفع الإيصال بنجاح" });
};

// GET /my-orders - جلب طلبات المستخدم
exports.getMyOrders = async (req, res) => {
    const userId = req.user.id;

    const orders = await AppDataSource.query(
        `SELECT o.*, 
                GROUP_CONCAT(
                    CONCAT(p.name, ' (', oi.quantity, ')') 
                    SEPARATOR ', '
                ) as items_summary
         FROM orders o
         LEFT JOIN order_items oi ON oi.order_id = o.id
         LEFT JOIN perfumes p ON p.id = oi.perfume_id
         WHERE o.user_id = ? AND o.order_status != 'cart'
         GROUP BY o.id
         ORDER BY o.created_at DESC`,
        [userId]
    );

    res.json({ status: "success", data: orders });
};

// ==========================================
// ✅ APIs للأدمن
// ==========================================

// GET /admin/all - جلب جميع الطلبات
exports.getAllOrders = async (req, res) => {
    const orders = await AppDataSource.query(
        `SELECT o.*, u.name as user_name, u.email as user_email
         FROM orders o
         JOIN users u ON u.id = o.user_id
         WHERE o.order_status != 'cart'
         ORDER BY o.created_at DESC`
    );

    res.json({ status: "success", data: orders });
};

// PUT /admin/:id/approve - موافقة على طلب
exports.approveOrder = async (req, res) => {
    const { id } = req.params;

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        await queryRunner.query(
            `UPDATE orders 
             SET payment_status = 'approved', 
                 order_status = 'processing' 
             WHERE id = ?`,
            [id]
        );

        // خصم المخزون
        await queryRunner.query(
            `UPDATE perfumes p
             INNER JOIN order_items oi ON oi.perfume_id = p.id
             SET p.stock_quantity = p.stock_quantity - oi.quantity
             WHERE oi.order_id = ?`,
            [id]
        );

        await queryRunner.commitTransaction();
        res.json({ success: true, message: "تمت الموافقة على الطلب وخصم المخزون" });

    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
    } finally {
        await queryRunner.release();
    }
};

// PUT /admin/:id/reject - رفض طلب
exports.rejectOrder = async (req, res) => {
    const { id } = req.params;

    await AppDataSource.getRepository(Order).update(id, {
        payment_status: 'rejected',
        order_status: 'cancelled'
    });

    res.json({ success: true, message: "تم رفض الطلب" });
};

// PUT /admin/:id/status - تحديث حالة الطلب
exports.updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { order_status, payment_status, notes } = req.body;

    const updateData = {};
    if (order_status) updateData.order_status = order_status;
    if (payment_status) updateData.payment_status = payment_status;
    if (notes) updateData.notes = notes;

    await AppDataSource.getRepository(Order).update(id, updateData);

    res.json({ success: true, message: "تم تحديث حالة الطلب" });
};

// ==========================================
// ✅ Webhook (Paymob)
// ==========================================

// POST /webhook/paymob
exports.paymobWebhook = async (req, res) => {
    const crypto = require("crypto");

    // 1. التحقق من HMAC
    const hmacSecret = process.env.PAYMOB_HMAC_SECRET;
    const receivedSignature = req.query.hmac || req.body.hmac;

    if (!receivedSignature) {
        return res.status(401).send("Invalid signature");
    }

    const values = [
        req.body.amount_cents,
        req.body.created_at,
        req.body.currency,
        req.body.error_occured,
        req.body.has_parent_transaction,
        req.body.id,
        req.body.integration_id,
        req.body.is_3d_secure,
        req.body.is_auth,
        req.body.is_capture,
        req.body.is_refunded,
        req.body.is_standalone_payment,
        req.body.is_voided,
        req.body.order?.id,
        req.body.owner,
        req.body.pending,
        req.body.source_data?.pan,
        req.body.source_data?.sub_type,
        req.body.source_data?.type,
        req.body.success,
    ];

    const combinedString = values.map(v => String(v)).join('');
    const hashed = crypto.createHmac('sha512', hmacSecret).update(combinedString).digest('hex');

    if (hashed !== receivedSignature) {
        return res.status(401).send("Invalid signature");
    }

    // 2. معالجة الـ Webhook
    const { obj } = req.body;
    const isSuccess = obj.success;
    const paymobOrderId = obj.order?.id?.toString();
    const transactionId = obj.transaction_id?.toString();
    const errorMessage = obj.data_message;
    const cardLastFour = obj.source_data?.pan;
    const cardBrand = obj.source_data?.type;

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const [orders] = await queryRunner.query(
            `SELECT id, user_id, order_status, payment_status 
             FROM orders 
             WHERE paymob_order_id = ? 
             LIMIT 1`,
            [paymobOrderId]
        );

        if (orders.length === 0) {
            return res.status(404).send("Order not found");
        }

        const order = orders[0];

        // Idempotency Check
        if (order.payment_status === 'approved' && isSuccess) {
            return res.status(200).send("Already processed");
        }

        if (isSuccess) {
            await queryRunner.query(
                `UPDATE orders 
                 SET payment_status = 'approved',
                     order_status = 'processing',
                     paymob_transaction_id = ?,
                     notes = CONCAT(COALESCE(notes, ''), 
                             '\n[Paymob] Paid via ', COALESCE(?, 'card'),
                             ' ending in ', COALESCE(?, '****'),
                             ' at ', NOW())
                 WHERE id = ?`,
                [transactionId, cardBrand, cardLastFour, order.id]
            );

            // خصم المخزون
            await queryRunner.query(
                `UPDATE perfumes p
                 INNER JOIN order_items oi ON oi.perfume_id = p.id
                 SET p.stock_quantity = p.stock_quantity - oi.quantity
                 WHERE oi.order_id = ?`,
                [order.id]
            );
        } else {
            await queryRunner.query(
                `UPDATE orders 
                 SET payment_status = 'rejected',
                     order_status = 'cart',
                     notes = CONCAT(COALESCE(notes, ''), 
                             '\n[Paymob] Failed: ', COALESCE(?, 'Unknown error'),
                             ' at ', NOW())
                 WHERE id = ?`,
                [errorMessage, order.id]
            );
        }

        await queryRunner.commitTransaction();
        res.status(200).send("OK");

    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
    } finally {
        await queryRunner.release();
    }
};