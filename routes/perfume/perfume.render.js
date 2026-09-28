// routes/perfumeRender.js - مسارات الصفحات فقط
const express = require("express");
const router = express.Router();
const renders = require("../../logicModels/perfume/perfume.render.js");

const auth = require("../../middlewares/auth");
const roles = require("../../middlewares/roles");
const catchError = require("../../utils/catchError");
const validate = require("../../middlewares/validate");
const { idParamSchema } = require("../../utils/validation");

// ✅ كل الـ Renders تستخدم catchError + checkLogin داخل الـ controller
router.get("/admin",auth, roles('admin'), catchError(renders.getAdminPerfumesRender));
router.get("/admin/create",auth, roles('admin'), catchError(renders.getCreatePerfumeRender));
router.get("/admin/:id/edit",auth, roles('admin'), validate(idParamSchema), catchError(renders.getEditPerfumeRender));

// صفحات عامة (للجميع)
router.get("/", catchError(renders.getPerfumesListRender));
router.get("/:id", validate(idParamSchema), catchError(renders.getPerfumeDetailsRender));

module.exports = router;