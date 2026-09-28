const router = require("express").Router();
const apiController = require("../../logicModels/users/users.controller.js");
const auth = require("../../middlewares/auth");
const roles = require("../../middlewares/roles");
const catchError = require("../../utils/catchError");
const validate = require("../../middlewares/validate");
const { 
    idParamSchema, 
    updateProfileSchema, 
    changePasswordSchema 
} = require("../../utils/validation");

// ==========================================
// ✅ APIs للعميل (محمية)
// ==========================================

// GET /users/api/v1/profile - جلب بيانات الملف الشخصي
router.get(
    '/profile',
    auth,
    catchError(apiController.getProfile)
);

// PUT /users/api/v1/profile - تحديث البيانات الشخصية
router.put(
    '/profile',
    auth,
    validate(updateProfileSchema),
    catchError(apiController.updateProfile)
);

// PUT /users/api/v1/change-password - تغيير كلمة المرور
router.put(
    '/change-password',
    auth,
    validate(changePasswordSchema),
    catchError(apiController.changePassword)
);

// ==========================================
// ✅ APIs للأدمن (محمية بـ admin)
// ==========================================

// GET /users/api/v1/admin/all - جلب جميع المستخدمين
router.get(
    '/admin/all',
    auth,
    roles('admin'),
    catchError(apiController.getAllUsers)
);

// PUT /users/api/v1/admin/:id/role - تغيير دور مستخدم
router.put(
    '/admin/:id/role',
    auth,
    roles('admin'),
    validate(idParamSchema),
    catchError(apiController.updateUserRole)
);

module.exports = router;