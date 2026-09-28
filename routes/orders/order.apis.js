const router = require("express").Router();
const apiController = require("../../logicModels/orders/orders.controller.js");
const authMiddleware = require("../../middlewares/auth");
const roleMiddleware = require("../../middlewares/roles");
const catchError = require("../../utils/catchError");
const validate = require("../../middlewares/validate");
const uploadMiddleware = require("../../middlewares/upload");
const { 
    addToOrderSchema, 
    checkoutSchema, 
    idParamSchema,
    updateOrderStatusSchema 
} = require("../../utils/validation");

// ==========================================
// ✅ APIs للعميل (محمية)
// ==========================================

// POST /orders/api/v1/add-to-cart - إضافة عطر للسلة
router.post(
    '/add-to-cart',
    authMiddleware,
    validate(addToOrderSchema),
    catchError(apiController.addToOrder)
);

// PUT /orders/api/v1/update-item/:id - تحديث كمية عنصر في السلة
router.put(
    '/update-item/:id',
    authMiddleware,
    validate(idParamSchema),
    catchError(apiController.updateOrderItem)
);

// DELETE /orders/api/v1/remove-item/:id - حذف عنصر من السلة
router.delete(
    '/remove-item/:id',
    authMiddleware,
    validate(idParamSchema),
    catchError(apiController.removeOrderItem)
);

// POST /orders/api/v1/checkout - إتمام الشراء
router.post(
    '/checkout',
    authMiddleware,
    validate(checkoutSchema),
    catchError(apiController.checkout)
);

// POST /orders/api/v1/:id/upload-receipt - رفع إيصال الدفع (InstaPay)
router.post(
    '/:id/upload-receipt',
    authMiddleware,
    validate(idParamSchema),
    uploadMiddleware.single('receipt'),
    catchError(apiController.uploadReceipt)
);

// GET /orders/api/v1/my-orders - جلب طلبات المستخدم الحالي
router.get(
    '/my-orders',
    authMiddleware,
    catchError(apiController.getMyOrders)
);

// ==========================================
// ✅ APIs للأدمن (محمية بـ admin)
// ==========================================

// GET /orders/api/v1/admin/all - جلب جميع الطلبات
router.get(
    '/admin/all',
    authMiddleware,
    roleMiddleware('admin'),
    catchError(apiController.getAllOrders)
);

// PUT /orders/api/v1/admin/:id/approve - موافقة على طلب
router.put(
    '/admin/:id/approve',
    authMiddleware,
    roleMiddleware('admin'),
    validate(idParamSchema),
    catchError(apiController.approveOrder)
);

// PUT /orders/api/v1/admin/:id/reject - رفض طلب
router.put(
    '/admin/:id/reject',
    authMiddleware,
    roleMiddleware('admin'),
    validate(idParamSchema),
    catchError(apiController.rejectOrder)
);

// PUT /orders/api/v1/admin/:id/status - تحديث حالة الطلب
router.put(
    '/admin/:id/status',
    authMiddleware,
    roleMiddleware('admin'),
    validate(idParamSchema),
    validate(updateOrderStatusSchema),
    catchError(apiController.updateOrderStatus)
);

// ==========================================
// ✅ Webhook (بدون auth - للنظام فقط)
// ==========================================

// POST /orders/api/v1/webhook/paymob - Webhook من Paymob
router.post(
    '/webhook/paymob',
    catchError(apiController.paymobWebhook)
);

module.exports = router;