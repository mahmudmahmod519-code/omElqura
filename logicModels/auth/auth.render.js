const checkLogin = require("../../utils/checkLogin");

// GET /auth/login - صفحة تسجيل الدخول
exports.getLoginRender = (req, res) => {
    // إذا كان مسجل دخول بالفعل، حوّله للصفحة الرئيسية
    if (req.user) {
        return res.redirect('/');
    }
    res.render("auth/login", checkLogin(req, res));
};

// GET /auth/register - صفحة التسجيل
exports.getRegisterRender = (req, res) => {
    if (req.user) {
        return res.redirect('/');
    }
    res.render("auth/register", checkLogin(req, res));
};

// GET /auth/forgot-password - صفحة نسيت كلمة المرور
exports.getForgotPasswordRender = (req, res) => {
    res.render("auth/forgot-password", checkLogin(req, res));
};

// GET /auth/reset-password/:token - صفحة إعادة تعيين كلمة المرور
exports.getResetPasswordRender = (req, res) => {
    res.render("auth/reset-password", { 
        ...checkLogin(req, res), 
        token: req.params.token 
    });
};