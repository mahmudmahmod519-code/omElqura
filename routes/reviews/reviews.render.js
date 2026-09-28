const router = require("express").Router();
const renderController = require("../../logicModels/reviews/reviews.render.js");
const catchError = require("../../utils/catchError");
const validate = require("../../middlewares/validate");
const { idParamSchema } = require("../../utils/validation");

// GET /products/:id/reviews - صفحة تقييمات عطر معين
router.get(
    '/products/:id/reviews',
    validate(idParamSchema),
    catchError(renderController.getReviewsRender)
);

module.exports = router;