const checkLogin = require("../../utils/checkLogin");

// GET /orders/cart - صفحة السلة
exports.getCartRender = (req, res) => {
    res.render("shop/cart", checkLogin(req, res));
};

// GET /orders/:id/payment - صفحة الدفع
exports.getPaymentRender = (req, res) => {
    res.render("checkout/payment", { 
        ...checkLogin(req, res), 
        orderId: req.params.id 
    });
};

// GET /orders/:id/upload-receipt - صفحة رفع الإيصال
exports.getUploadReceiptRender = (req, res) => {
    res.render("checkout/upload-receipt", { 
        ...checkLogin(req, res), 
        orderId: req.params.id 
    });
};

// GET /profile/orders - سجل الطلبات
exports.getOrderHistoryRender = (req, res) => {
    res.render("user/order-history", checkLogin(req, res));
};

// GET /orders/admin - صفحة إدارة الطلبات (أدمن)
exports.getAdminOrdersRender = (req, res) => {
    res.render("admin/orders", checkLogin(req, res));
};