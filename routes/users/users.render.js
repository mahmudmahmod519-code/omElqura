const router = require("express").Router();
const renderController = require("../../logicModels/users/users.render.js");
const auth = require("../../middlewares/auth");
const roles = require("../../middlewares/roles");
const catchError = require("../../utils/catchError");

// GET /profile - صفحة الملف الشخصي
router.get(
    '/profile',
    auth,
    catchError(renderController.getProfileRender)
);

// GET /profile/edit - صفحة تعديل البيانات
router.get(
    '/profile/edit',
    auth,
    catchError(renderController.getEditProfileRender)
);

// GET /admin/users - صفحة إدارة المستخدمين (أدمن)
router.get(
    '/admin/users',
    auth,
    roles('admin'),
    catchError(renderController.getAdminUsersRender)
);

module.exports = router;