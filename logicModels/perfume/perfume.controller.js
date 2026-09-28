// controllers/perfumeApiController.js
const AppDataSource = require("../../config/data-source");
const Perfume = require("../../models/Perfume.entity.js");

// GET /api/perfumes - جلب قائمة العطور (للـ Frontend JS)
exports.getPerfumes = async (req, res) => {
    const { page = 1, limit = 12, q, brand_id, category_id, min_price, max_price, sort_by = "created_at", sort_order = "DESC" } = req.query;
    
    // Whitelist allowed sort columns to prevent SQL injection
    const allowedSortColumns = ['created_at', 'price', 'name'];
    const safeSortBy = allowedSortColumns.includes(sort_by) ? sort_by : 'created_at';
    const safeSortOrder = sort_order === 'ASC' ? 'ASC' : 'DESC';
    
    const perfumeRepo = AppDataSource.getRepository(Perfume);
    
    const queryBuilder = perfumeRepo.createQueryBuilder("perfume")
        .leftJoinAndSelect("perfume.brand", "brand")
        .leftJoinAndSelect("perfume.category", "category")
        .where("perfume.is_active = :isActive", { isActive: true });

    if (q) queryBuilder.andWhere("perfume.name LIKE :q", { q: `%${q}%` });
    if (brand_id) queryBuilder.andWhere("perfume.brand_id = :brand_id", { brand_id });
    if (category_id) queryBuilder.andWhere("perfume.category_id = :category_id", { category_id });
    if (min_price) queryBuilder.andWhere("perfume.price >= :min_price", { min_price });
    if (max_price) queryBuilder.andWhere("perfume.price <= :max_price", { max_price });

    queryBuilder
        .orderBy(`perfume.${safeSortBy}`, safeSortOrder)
        .skip((page - 1) * limit)
        .take(limit);

    const [perfumes, total] = await queryBuilder.getManyAndCount();

    res.json({
        status: "success",
        data: perfumes,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages: Math.ceil(total / limit)
        }
    });
};

// GET /api/perfumes/:id - جلب عطر واحد
exports.getPerfumeById = async (req, res) => {
    const { id } = req.params;
    const perfumeRepo = AppDataSource.getRepository(Perfume);
    
    const perfume = await perfumeRepo.findOne({
        where: { id, is_active: true },
        relations: ["brand", "category"]
    });

    if (!perfume) {
        return res.status(404).json({ status: "error", message: "العطر غير موجود" });
    }

    res.json({ status: "success", data: perfume });
};

// POST /api/admin/perfumes - إضافة عطر
exports.createPerfume = async (req, res) => {
    const { name, brand_id, category_id, price, stock_quantity, description, fragrance_family, concentration } = req.body;
    
    const slug = name.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, '-') + '-' + Date.now();
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const perfumeRepo = AppDataSource.getRepository(Perfume);
    const newPerfume = perfumeRepo.create({
        name, slug, brand_id, category_id, price,
        stock_quantity: stock_quantity || 0,
        description, image_url, fragrance_family, concentration
    });

    const saved = await perfumeRepo.save(newPerfume);
    res.json({ status: "success", message: "تم إضافة العطر بنجاح", data: saved });
};

// PUT /api/admin/perfumes/:id - تحديث عطر
exports.updatePerfume = async (req, res) => {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    if (req.file) {
        updateData.image_url = `/uploads/${req.file.filename}`;
    }

    const perfumeRepo = AppDataSource.getRepository(Perfume);
    await perfumeRepo.update(id, updateData);
    
    res.json({ status: "success", message: "تم تحديث العطر بنجاح" });
};

// DELETE /api/admin/perfumes/:id - حذف عطر (Soft Delete)
exports.deletePerfume = async (req, res) => {
    const { id } = req.params;
    const perfumeRepo = AppDataSource.getRepository(Perfume);
    
    await perfumeRepo.update(id, { is_active: false });
    res.json({ status: "success", message: "تم حذف العطر بنجاح" });
};