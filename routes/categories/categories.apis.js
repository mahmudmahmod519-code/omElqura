const router = require("express").Router();
const apiController = require("../../logicModels/categories/categories.controller.js");
const auth = require("../../middlewares/auth");
const roles = require("../../middlewares/roles");
const catchError = require("../../utils/catchError");
const validate = require("../../middlewares/validate");
const { createCategorySchema, updateCategorySchema, idParamSchema } = require("../../utils/validation");

// GET /categories/api/v1 - جلب جميع التصنيفات
router.get(
    '/',
    catchError(apiController.getCategories)
);

// POST /categories/api/v1 - إضافة تصنيف جديد (أدمن فقط)
router.post(
    '/',
    auth,
    roles('admin'),
    validate(createCategorySchema),
    catchError(apiController.createCategory)
);

// PUT /categories/api/v1/:id - تحديث تصنيف (أدمن فقط)
router.put(
    '/:id',
    auth,
    roles('admin'),
    validate(idParamSchema),
    validate(updateCategorySchema),
    catchError(apiController.updateCategory)
);

// DELETE /categories/api/v1/:id - حذف تصنيف (أدمن فقط)
router.delete(
    '/:id',
    auth,
    roles('admin'),
    validate(idParamSchema),
    catchError(apiController.deleteCategory)
);

module.exports = router;