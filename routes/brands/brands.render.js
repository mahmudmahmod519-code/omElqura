const router = require("express").Router();
const renderController = require("../../logicModels/brands/brands.render.js");
const auth = require("../../middlewares/auth");
const roles = require("../../middlewares/roles");
const catchError = require("../../utils/catchError");

// GET /brands/admin - صفحة إدارة الماركات
router.get(
    '/admin',
    auth,
    roles('admin'),
    catchError(renderController.getAdminBrandsRender)
);

module.exports = router;