const jwt = require("jsonwebtoken");
const AppDataSource = require("../config/data-source");
const User = require("../models/User.entity.js");

module.exports = async (req, res, next) => {
    let token = req.cookies?.session_token;

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        // For API routes, return JSON; for render routes, redirect
        if (req.path.startsWith('/api/')) {
            return res.status(401).json({ status: "error", message: "غير مصرح - يجب تسجيل الدخول" });
        }
        return res.redirect("/auth/login");
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if (!decode) {
            if (req.path.startsWith('/api/')) {
                return res.status(401).json({ status: "error", message: "جلسة غير صالحة" });
            }
            return res.redirect("/auth/login");
        }

        const UserRepo = AppDataSource.getRepository(User);
        req.user = await UserRepo.findOne({ where: { id: decode.id } });

        if (!req.user) {
            if (req.path.startsWith('/api/')) {
                return res.status(401).json({ status: "error", message: "المستخدم غير موجود" });
            }
            return res.redirect("/auth/login");
        }

        next();
    } catch (ex) {
        console.error("Auth middleware error:", ex.message);
        if (req.path.startsWith('/api/')) {
            return res.status(401).json({ status: "error", message: "جلسة غير صالحة" });
        }
        return res.redirect("/auth/login");
    }
};
