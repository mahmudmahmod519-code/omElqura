const router = require("express").Router();
const renderController = require("../../logicModels/orders/orders.render.js");
const authMiddleware = require("../../middlewares/auth");
const roleMiddleware = require("../../middlewares/roles");
const catchError = require("../../utils/catchError");
const validate = require("../../middlewares/validate");
const { idParamSchema } = require("../../utils/validation");

// ==========================================
// ✅ صفحات العميل (محمية)
// ==========================================

// GET /orders/cart - صفحة السلة
router.get(
    '/cart',
    authMiddleware,
    catchError(renderController.getCartRender)
);

// GET /orders/:id/payment - صفحة الدفع
router.get(
    '/:id/payment',
    authMiddleware,
    validate(idParamSchema),
    catchError(renderController.getPaymentRender)
);

// GET /orders/:id/upload-receipt - صفحة رفع الإيصال
router.get(
    '/:id/upload-receipt',
    authMiddleware,
    validate(idParamSchema),
    catchError(renderController.getUploadReceiptRender)
);

// GET /profile/orders - سجل الطلبات
router.get(
    '/profile/orders',
    authMiddleware,
    catchError(renderController.getOrderHistoryRender)
);

// ==========================================
// ✅ صفحات الأدمن
// ==========================================

// GET /orders/admin - صفحة إدارة الطلبات
router.get(
    '/admin',
    authMiddleware,
    roleMiddleware('admin'),
    catchError(renderController.getAdminOrdersRender)
);

module.exports = router;