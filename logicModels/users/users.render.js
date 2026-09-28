const checkLogin = require("../../utils/checkLogin");

// GET /profile - صفحة الملف الشخصي
exports.getProfileRender = (req, res) => {
    res.render("user/profile", checkLogin(req, res));
};

// GET /profile/edit - صفحة تعديل البيانات
exports.getEditProfileRender = (req, res) => {
    res.render("user/edit-profile", checkLogin(req, res));
};

// GET /admin/users - صفحة إدارة المستخدمين (أدمن)
exports.getAdminUsersRender = (req, res) => {
    res.render("admin/users", checkLogin(req, res));
};