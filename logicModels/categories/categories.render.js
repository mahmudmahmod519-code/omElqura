const checkLogin = require("../../utils/checkLogin");

// GET /categories/admin - صفحة إدارة التصنيفات
exports.getAdminCategoriesRender = (req, res) => {
    res.render("admin/categories", checkLogin(req, res));
};

// GET /categories/:slug - صفحة منتجات تصنيف معين
exports.getCategoryProductsRender = (req, res) => {
    res.render("shop/category-products", { 
        ...checkLogin(req, res), 
        categorySlug: req.params.slug 
    });
};