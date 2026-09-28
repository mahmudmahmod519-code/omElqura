const router = require("express").Router();
const apiController = require("../../logicModels/brands/brands.controller.js");
const auth = require("../../middlewares/auth");
const roles = require("../../middlewares/roles");
const catchError = require("../../utils/catchError");
const validate = require("../../middlewares/validate");
const uploadMiddleware = require("../../middlewares/upload");
const { createBrandSchema, updateBrandSchema, idParamSchema } = require("../../utils/validation");

// GET /brands/api/v1 - جلب جميع الماركات
router.get(
    '/',
    catchError(apiController.getBrands)
);

// POST /brands/api/v1 - إضافة ماركة جديدة (أدمن فقط)
router.post(
    '/',
    auth,
    roles('admin'),
    uploadMiddleware.single('logo'),
    validate(createBrandSchema),
    catchError(apiController.createBrand)
);

// PUT /brands/api/v1/:id - تحديث ماركة (أدمن فقط)
router.put(
    '/:id',
    auth,
    roles('admin'),
    uploadMiddleware.single('logo'),
    validate(idParamSchema),
    validate(updateBrandSchema),
    catchError(apiController.updateBrand)
);

// DELETE /brands/api/v1/:id - حذف ماركة (أدمن فقط)
router.delete(
    '/:id',
    auth,
    roles('admin'),
    validate(idParamSchema),
    catchError(apiController.deleteBrand)
);

module.exports = router;