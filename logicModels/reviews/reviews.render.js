const checkLogin = require("../../utils/checkLogin");

// GET /products/:id/reviews - صفحة تقييمات عطر معين
exports.getReviewsRender = (req, res) => {
    res.render("shop/reviews", { 
        ...checkLogin(req, res), 
        perfumeId: req.params.id 
    });
};