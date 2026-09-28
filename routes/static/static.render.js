const router = require("express").Router();
const renderController = require("../../logicModels/static/static.render.js");
const catchError = require("../../utils/catchError");

// GET / - الصفحة الرئيسية
router.get(
    '/',
    catchError(renderController.getHomeRender)
);

// GET /about-us - من نحن
router.get(
    '/about-us',
    catchError(renderController.getAboutRender)
);

// GET /contact-us - اتصل بنا
router.get(
    '/contact-us',
    catchError(renderController.getContactRender)
);

// GET /faq - الأسئلة الشائعة
router.get(
    '/faq',
    catchError(renderController.getFaqRender)
);

// GET /privacy - سياسة الخصوصية
router.get(
    '/privacy',
    catchError(renderController.getPrivacyRender)
);

// GET /terms - الشروط والأحكام
router.get(
    '/terms',
    catchError(renderController.getTermsRender)
);

// GET /refund - سياسة الاسترجاع
router.get(
    '/refund',
    catchError(renderController.getRefundRender)
);

module.exports = router;