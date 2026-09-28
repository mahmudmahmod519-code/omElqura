const router = require("express").Router();
const renderController = require("../../logicModels/auth/auth.render.js");
const catchError = require("../../utils/catchError");

// GET /auth/login - صفحة تسجيل الدخول
router.get(
    '/login',
    catchError(renderController.getLoginRender)
);

// GET /auth/register - صفحة التسجيل
router.get(
    '/register',
    catchError(renderController.getRegisterRender)
);

// GET /auth/forgot-password - صفحة نسيت كلمة المرور
router.get(
    '/forgot-password',
    catchError(renderController.getForgotPasswordRender)
);

// GET /auth/reset-password/:token - صفحة إعادة تعيين كلمة المرور
router.get(
    '/reset-password/:token',
    catchError(renderController.getResetPasswordRender)
);

module.exports = router;