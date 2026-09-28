const AppDataSource = require("../../config/data-source");
const User = require("../../models/User.entity.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailer = require("../../utils/mailer");
const crypto = require("crypto");
const { MoreThan } = require("typeorm");

// ==========================================
// ✅ APIs للـ Guest
// ==========================================

// POST /register - إنشاء حساب جديد
exports.register = async (req, res) => {
    const { name, email, password, phone, address } = req.body;

    const userRepo = AppDataSource.getRepository(User);

    // التحقق من عدم وجود البريد مسبقاً
    const existingUser = await userRepo.findOne({ where: { email } });
    if (existingUser) {
        return res.status(400).json({ 
            status: "error", 
            message: "البريد الإلكتروني مسجل بالفعل" 
        });
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = userRepo.create({
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        address: address || null,
        role: 'customer'
    });

    const saved = await userRepo.save(newUser);

    // إنشاء JWT وتعيينه في HTTP-Only Cookie
    const token = jwt.sign({ id: saved.id, email: saved.email, role: saved.role });
    
    res.cookie('session_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 أيام
    });

    res.json({ 
        status: "success", 
        message: "تم إنشاء الحساب بنجاح", 
        data: { id: saved.id, name: saved.name, email: saved.email, role: saved.role } 
    });
};

// POST /login - تسجيل الدخول
exports.login = async (req, res) => {
    const { email, password } = req.body;

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { email } });

    if (!user) {
        return res.status(401).json({ 
            status: "error", 
            message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" 
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ 
            status: "error", 
            message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" 
        });
    }

    // إنشاء JWT
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role });
    
    res.cookie('session_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 أيام
    });

    res.json({ 
        status: "success", 
        message: "تم تسجيل الدخول بنجاح", 
        data: { id: user.id, name: user.name, email: user.email, role: user.role } 
    });
};

// POST /forgot-password - نسيت كلمة المرور
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { email } });

    if (!user) {
        // لا نكشف عن وجود البريد من عدمه (أمان)
        return res.json({ 
            status: "success", 
            message: "إذا كان البريد مسجلاً، سيتم إرسال رابط الاستعادة" 
        });
    }

    // توليد رمز استعادة
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // ساعة واحدة

    await userRepo.update(user.id, {
        reset_token: resetToken,
        reset_token_expiry: resetTokenExpiry
    });

    // إرسال البريد الإلكتروني
    const resetLink = `${process.env.BASE_URL}/auth/reset-password/${resetToken}`;
    await mailer.sendEmail({
        to: email,
        subject: "استعادة كلمة المرور - عطور أم القرى",
        html: `
            <h2>مرحباً ${user.name}</h2>
            <p>تم طلب استعادة كلمة المرور. اضغط على الرابط التالي:</p>
            <a href="${resetLink}">استعادة كلمة المرور</a>
            <p>هذا الرابط صالح لمدة ساعة واحدة.</p>
            <p>إذا لم تطلب هذا، تجاهل هذه الرسالة.</p>
        `
    });

    res.json({ 
        status: "success", 
        message: "إذا كان البريد مسجلاً، سيتم إرسال رابط الاستعادة" 
    });
};

// POST /reset-password/:token - إعادة تعيين كلمة المرور
exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { new_password } = req.body;

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ 
        where: { 
            reset_token: token,
            reset_token_expiry: MoreThan(new Date())
        }
    });

    if (!user) {
        return res.status(400).json({ 
            status: "error", 
            message: "رمز الاستعادة غير صالح أو منتهي الصلاحية" 
        });
    }

    // تشفير كلمة المرور الجديدة
    const hashedPassword = await bcrypt.hash(new_password, 10);

    await userRepo.update(user.id, {
        password: hashedPassword,
        reset_token: null,
        reset_token_expiry: null
    });

    res.json({ 
        status: "success", 
        message: "تم تحديث كلمة المرور بنجاح" 
    });
};

// POST /logout - تسجيل الخروج
exports.logout = async (req, res) => {
    res.clearCookie('session_token');
    res.json({ status: "success", message: "تم تسجيل الخروج بنجاح" });
};