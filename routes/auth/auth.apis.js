const router = require("express").Router();
const apiController = require("../../logicModels/auth/auth.controller.js");
const auth = require("../../middlewares/auth");
const catchError = require("../../utils/catchError");
const validate = require("../../middlewares/validate");
const { 
    registerSchema, 
    loginSchema, 
    forgetPasswordSchema, 
    resetPasswordSchema 
} = require("../../utils/validation");

// ==========================================
// ✅ APIs للـ Guest (بدون مصادقة)
// ==========================================

// POST /auth/api/v1/register - إنشاء حساب جديد
router.post(
    '/register',
    validate(registerSchema),
    catchError(apiController.register)
);

// POST /auth/api/v1/login - تسجيل الدخول
router.post(
    '/login',
    validate(loginSchema),
    catchError(apiController.login)
);

// POST /auth/api/v1/forgot-password - نسيت كلمة المرور
router.post(
    '/forgot-password',
    validate(forgetPasswordSchema),
    catchError(apiController.forgotPassword)
);

// POST /auth/api/v1/reset-password/:token - إعادة تعيين كلمة المرور
router.post(
    '/reset-password/:token',
    validate(resetPasswordSchema),
    catchError(apiController.resetPassword)
);

// POST /auth/api/v1/logout - تسجيل الخروج (محمي)
router.post(
    '/logout',
    auth,
    catchError(apiController.logout)
);

module.exports = router;