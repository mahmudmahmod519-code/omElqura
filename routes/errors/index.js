const router = require("express").Router();
const errorController = require("../../logicModels/errors/error.render.js");
const checkLogin = require("../../utils/checkLogin");

// 404 - صفحة غير موجودة
router.use((req, res) => {
    res.status(404).render("errors/404", checkLogin(req, res));
});

// 500 - خطأ في السيرفر (يُستخدم عبر catchError)
router.use((err, req, res, next) => {
    console.error("❌ Server Error:", err);
    res.status(500).render("errors/500", {
        message: "خطأ في السيرفر",
        ...checkLogin(req, res)
    });
});

module.exports = router;