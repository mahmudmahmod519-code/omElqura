const checkLogin = require("../../utils/checkLogin");

// GET /brands/admin - صفحة إدارة الماركات
exports.getAdminBrandsRender = (req, res) => {
    res.render("admin/brands", checkLogin(req, res));
};