module.exports = (...roles) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ status: "error", message: "غير مصرح - يجب تسجيل الدخول" });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ status: "error", message: "لا تملك صلاحية لهذا" });
        }
        next();
    };
};
