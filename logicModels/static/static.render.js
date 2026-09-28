const checkLogin = require("../../utils/checkLogin");

// GET / - الصفحة الرئيسية
exports.getHomeRender = (req, res) => {
    res.render("static/home", checkLogin(req, res));
};

// GET /about-us - من نحن
exports.getAboutRender = (req, res) => {
    res.render("static/about", checkLogin(req, res));
};

// GET /contact-us - اتصل بنا
exports.getContactRender = (req, res) => {
    res.render("static/contact", checkLogin(req, res));
};

// GET /faq - الأسئلة الشائعة
exports.getFaqRender = (req, res) => {
    res.render("static/faq", checkLogin(req, res));
};

// GET /privacy - سياسة الخصوصية
exports.getPrivacyRender = (req, res) => {
    res.render("static/privacy", checkLogin(req, res));
};

// GET /terms - الشروط والأحكام
exports.getTermsRender = (req, res) => {
    res.render("static/terms", checkLogin(req, res));
};

// GET /refund - سياسة الاسترجاع
exports.getRefundRender = (req, res) => {
    res.render("static/refund", checkLogin(req, res));
};