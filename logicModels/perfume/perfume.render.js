// controllers/perfumeRenderController.js
const checkLogin = require("../../utils/checkLogin");

// كل الـ Renders بتعمل نفس الحاجة: تعرض الصفحة + تمرر حالة المستخدم
exports.getAdminPerfumesRender = (req, res) => {
    res.render("admin/perfumes", checkLogin(req, res));
};

exports.getCreatePerfumeRender = (req, res) => {
    res.render("admin/perfume-form", { ...checkLogin(req, res), isEdit: false });
};

exports.getEditPerfumeRender = (req, res) => {
    res.render("admin/perfume-form", { ...checkLogin(req, res), isEdit: true, perfumeId: req.params.id });
};

exports.getPerfumesListRender = (req, res) => {
    res.render("shop/perfumes", checkLogin(req, res));
};

exports.getPerfumeDetailsRender = (req, res) => {
    res.render("shop/perfume-details", { ...checkLogin(req, res), perfumeId: req.params.id });
};