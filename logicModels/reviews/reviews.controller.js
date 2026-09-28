const AppDataSource = require("../../config/data-source");
const Review = require("../../models/Review.entity.js");

// ==========================================
// ✅ APIs عامة
// ==========================================

// GET /perfume/:perfumeId - جلب تقييمات عطر معين
exports.getPerfumeReviews = async (req, res) => {
    const { perfumeId } = req.params;

    const reviews = await AppDataSource.query(
        `SELECT r.*, u.name as user_name
         FROM reviews r
         JOIN users u ON u.id = r.user_id
         WHERE r.perfume_id = ? AND r.is_approved = TRUE
         ORDER BY r.created_at DESC`,
        [perfumeId]
    );

    // حساب متوسط التقييم
    const [avgResult] = await AppDataSource.query(
        `SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews
         FROM reviews
         WHERE perfume_id = ? AND is_approved = TRUE`,
        [perfumeId]
    );

    res.json({ 
        status: "success", 
        data: reviews,
        summary: {
            avg_rating: parseFloat(avgResult.avg_rating || 0).toFixed(1),
            total_reviews: parseInt(avgResult.total_reviews)
        }
    });
};

// ==========================================
// ✅ APIs للعميل
// ==========================================

// POST / - إضافة تقييم جديد
exports.createReview = async (req, res) => {
    const userId = req.user.id;
    const { perfume_id, rating, comment } = req.body;

    const reviewRepo = AppDataSource.getRepository(Review);

    // التحقق من عدم وجود تقييم سابق
    const existingReview = await reviewRepo.findOne({
        where: { user_id: userId, perfume_id }
    });

    if (existingReview) {
        return res.status(400).json({ 
            status: "error", 
            message: "لقد قمت بتقييم هذا العطر بالفعل" 
        });
    }

    const newReview = reviewRepo.create({
        user_id: userId,
        perfume_id,
        rating,
        comment: comment || null,
        is_approved: true
    });

    const saved = await reviewRepo.save(newReview);

    res.json({ 
        status: "success", 
        message: "تم إضافة التقييم بنجاح", 
        data: saved 
    });
};

// PUT /:id - تحديث تقييم المستخدم
exports.updateReview = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const { rating, comment } = req.body;

    const reviewRepo = AppDataSource.getRepository(Review);
    const review = await reviewRepo.findOne({
        where: { id, user_id: userId }
    });

    if (!review) {
        return res.status(404).json({ 
            status: "error", 
            message: "التقييم غير موجود أو لا ينتمي لك" 
        });
    }

    const updateData = {};
    if (rating) updateData.rating = rating;
    if (comment !== undefined) updateData.comment = comment;

    await reviewRepo.update(id, updateData);

    res.json({ status: "success", message: "تم تحديث التقييم بنجاح" });
};

// DELETE /:id - حذف تقييم المستخدم
exports.deleteReview = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const reviewRepo = AppDataSource.getRepository(Review);
    const review = await reviewRepo.findOne({
        where: { id, user_id: userId }
    });

    if (!review) {
        return res.status(404).json({ 
            status: "error", 
            message: "التقييم غير موجود أو لا ينتمي لك" 
        });
    }

    await reviewRepo.delete(id);

    res.json({ status: "success", message: "تم حذف التقييم بنجاح" });
};

// ==========================================
// ✅ APIs للأدمن
// ==========================================

// PUT /admin/:id/status - تحديث حالة التقييم
exports.updateReviewStatus = async (req, res) => {
    const { id } = req.params;
    const { is_approved } = req.body;

    const reviewRepo = AppDataSource.getRepository(Review);
    await reviewRepo.update(id, { is_approved });

    res.json({ status: "success", message: "تم تحديث حالة التقييم" });
};

// DELETE /admin/:id - حذف تقييم (أدمن)
exports.adminDeleteReview = async (req, res) => {
    const { id } = req.params;

    const reviewRepo = AppDataSource.getRepository(Review);
    await reviewRepo.delete(id);

    res.json({ status: "success", message: "تم حذف التقييم بنجاح" });
};