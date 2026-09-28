const router = require("express").Router();
const apiController = require("../../logicModels/reviews/reviews.controller.js");
const auth = require("../../middlewares/auth");
const roles = require("../../middlewares/roles");
const catchError = require("../../utils/catchError");
const validate = require("../../middlewares/validate");
const { 
    createReviewSchema, 
    updateReviewSchema, 
    idParamSchema 
} = require("../../utils/validation");

// ==========================================
// ✅ APIs عامة
// ==========================================

// GET /reviews/api/v1/perfume/:perfumeId - جلب تقييمات عطر معين
router.get(
    '/perfume/:perfumeId',
    validate(idParamSchema),
    catchError(apiController.getPerfumeReviews)
);

// ==========================================
// ✅ APIs للعميل (محمية)
// ==========================================

// POST /reviews/api/v1 - إضافة تقييم جديد
router.post(
    '/',
    auth,
    validate(createReviewSchema),
    catchError(apiController.createReview)
);

// PUT /reviews/api/v1/:id - تحديث تقييم المستخدم
router.put(
    '/:id',
    auth,
    validate(idParamSchema),
    validate(updateReviewSchema),
    catchError(apiController.updateReview)
);

// DELETE /reviews/api/v1/:id - حذف تقييم المستخدم
router.delete(
    '/:id',
    auth,
    validate(idParamSchema),
    catchError(apiController.deleteReview)
);

// ==========================================
// ✅ APIs للأدمن
// ==========================================

// PUT /reviews/api/v1/admin/:id/status - تحديث حالة التقييم (موافقة/رفض)
router.put(
    '/admin/:id/status',
    auth,
    roles('admin'),
    validate(idParamSchema),
    catchError(apiController.updateReviewStatus)
);

// DELETE /reviews/api/v1/admin/:id - حذف تقييم (أدمن)
router.delete(
    '/admin/:id',
    auth,
    roles('admin'),
    validate(idParamSchema),
    catchError(apiController.adminDeleteReview)
);

module.exports = router;