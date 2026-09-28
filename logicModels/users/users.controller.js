const AppDataSource = require("../../config/data-source");
const User = require("../../models/User.entity.js");
const bcrypt = require("bcrypt");

// ==========================================
// ✅ APIs للعميل
// ==========================================

// GET /profile - جلب بيانات الملف الشخصي
exports.getProfile = async (req, res) => {
    const userId = req.user.id;

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
        where: { id: userId },
        select: ["id", "name", "email", "phone", "address", "role", "created_at"]
    });

    if (!user) {
        return res.status(404).json({ status: "error", message: "المستخدم غير موجود" });
    }

    res.json({ status: "success", data: user });
};

// PUT /profile - تحديث البيانات الشخصية
exports.updateProfile = async (req, res) => {
    const userId = req.user.id;
    const { name, phone, address } = req.body;

    const userRepo = AppDataSource.getRepository(User);
    
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;

    await userRepo.update(userId, updateData);

    res.json({ status: "success", message: "تم تحديث البيانات بنجاح" });
};

// PUT /change-password - تغيير كلمة المرور
exports.changePassword = async (req, res) => {
    const userId = req.user.id;
    const { current_password, new_password } = req.body;

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { id: userId } });

    if (!user) {
        return res.status(404).json({ status: "error", message: "المستخدم غير موجود" });
    }

    const isMatch = await bcrypt.compare(current_password, user.password);
    if (!isMatch) {
        return res.status(400).json({ 
            status: "error", 
            message: "كلمة المرور الحالية غير صحيحة" 
        });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    await userRepo.update(userId, { password: hashedPassword });

    res.json({ status: "success", message: "تم تغيير كلمة المرور بنجاح" });
};

// ==========================================
// ✅ APIs للأدمن
// ==========================================

// GET /admin/all - جلب جميع المستخدمين
exports.getAllUsers = async (req, res) => {
    const { page = 1, limit = 20, q, role } = req.query;

    const userRepo = AppDataSource.getRepository(User);
    
    const queryBuilder = userRepo.createQueryBuilder("user")
        .select(["user.id", "user.name", "user.email", "user.phone", "user.role", "user.created_at"]);

    if (q) {
        queryBuilder.andWhere("user.name LIKE :q OR user.email LIKE :q", { q: `%${q}%` });
    }
    if (role) {
        queryBuilder.andWhere("user.role = :role", { role });
    }

    queryBuilder
        .orderBy("user.created_at", "DESC")
        .skip((page - 1) * limit)
        .take(limit);

    const [users, total] = await queryBuilder.getManyAndCount();

    res.json({
        status: "success",
        data: users,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages: Math.ceil(total / limit)
        }
    });
};

// PUT /admin/:id/role - تغيير دور مستخدم
exports.updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!['admin', 'customer'].includes(role)) {
        return res.status(400).json({ 
            status: "error", 
            message: "الدور يجب أن يكون admin أو customer" 
        });
    }

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { id } });

    if (!user) {
        return res.status(404).json({ status: "error", message: "المستخدم غير موجود" });
    }

    // منع الأدمن من تغيير دوره الخاص (أمان)
    if (parseInt(id) === req.user.id) {
        return res.status(400).json({ 
            status: "error", 
            message: "لا يمكنك تغيير دورك الخاص" 
        });
    }

    await userRepo.update(id, { role });

    res.json({ status: "success", message: "تم تحديث دور المستخدم بنجاح" });
};