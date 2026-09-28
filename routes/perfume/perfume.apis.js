// routes/perfumeApi.js - مسارات الـ APIs فقط
const express = require("express");
const router = express.Router();
const apiController = require("../../logicModels/perfume/perfume.controller.js");
const auth = require("../../middlewares/auth");
const roles = require("../../middlewares/roles");
const catchError = require("../../utils/catchError");
const validate = require("../../middlewares/validate");
const uploadMiddleware = require("../../middlewares/upload");
const { createPerfumeSchema, updatePerfumeSchema, idParamSchema, searchPerfumesSchema } = require("../../utils/validation");

// ✅ APIs عامة
router.get("/", validate(searchPerfumesSchema), catchError(apiController.getPerfumes));
router.get("/:id", validate(idParamSchema), catchError(apiController.getPerfumeById));

// ✅ APIs للأدمن فقط
router.post(
    "/",
    auth, roles('admin'),
    uploadMiddleware.single('image'),
    validate(createPerfumeSchema),
    catchError(apiController.createPerfume)
);

router.put(
    "/:id",
    auth, roles('admin'),
    uploadMiddleware.single('image'),
    validate(updatePerfumeSchema),
    catchError(apiController.updatePerfume)
);

router.delete(
    "/:id",
    auth, roles('admin'),
    validate(idParamSchema),
    catchError(apiController.deletePerfume)
);

module.exports = router;