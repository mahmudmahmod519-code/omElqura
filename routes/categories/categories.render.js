const router = require("express").Router();
const renderController = require("../../logicModels/categories/categories.render.js");
const authMiddleware = require("../../middlewares/auth");
const roleMiddleware = require("../../middlewares/roles");
const catchError = require("../../utils/catchError");
const validate = require("../../middlewares/validate");
const { idParamSchema } = require("../../utils/validation");

// GET /categories - صفحة عرض التصنيفات (للأدمن)
router.get(
    '/admin',
    authMiddleware,
    roleMiddleware('admin'),
    catchError(renderController.getAdminCategoriesRender)
);

// GET /categories/:slug - صفحة منتجات تصنيف معين
router.get(
    '/:slug',
    catchError(renderController.getCategoryProductsRender)
);

module.exports = router;