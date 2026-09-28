const AppDataSource = require("../../config/data-source");
const Brand = require("../../models/Brand.entity.js");

// GET /api/v1 - جلب جميع الماركات
exports.getBrands = async (req, res) => {
    const brandRepo = AppDataSource.getRepository(Brand);
    
    const brands = await brandRepo.find({
        where: { is_active: true },
        order: { name: "ASC" }
    });

    res.json({
        status: "success",
        data: brands
    });
};

// POST /api/v1 - إضافة ماركة جديدة
exports.createBrand = async (req, res) => {
    const { name, slug } = req.body;
    
    const brandRepo = AppDataSource.getRepository(Brand);
    
    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, '-');
    const logo_url = req.file ? `/uploads/${req.file.filename}` : null;
    
    const newBrand = brandRepo.create({
        name,
        slug: finalSlug,
        logo_url
    });

    const saved = await brandRepo.save(newBrand);
    
    res.json({ 
        status: "success", 
        message: "تم إضافة الماركة بنجاح", 
        data: saved 
    });
};

// PUT /api/v1/:id - تحديث ماركة
exports.updateBrand = async (req, res) => {
    const { id } = req.params;
    const { name, slug, is_active } = req.body;
    
    const brandRepo = AppDataSource.getRepository(Brand);
    
    const updateData = {};
    if (name) updateData.name = name;
    if (slug) updateData.slug = slug;
    if (is_active !== undefined) updateData.is_active = is_active;
    if (req.file) updateData.logo_url = `/uploads/${req.file.filename}`;

    await brandRepo.update(id, updateData);
    
    res.json({ 
        status: "success", 
        message: "تم تحديث الماركة بنجاح" 
    });
};

// DELETE /api/v1/:id - حذف ماركة
exports.deleteBrand = async (req, res) => {
    const { id } = req.params;
    const brandRepo = AppDataSource.getRepository(Brand);
    
    await brandRepo.update(id, { is_active: false });
    
    res.json({ 
        status: "success", 
        message: "تم حذف الماركة بنجاح" 
    });
};