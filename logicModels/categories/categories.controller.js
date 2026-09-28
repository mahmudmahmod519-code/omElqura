const AppDataSource = require("../../config/data-source");
const Category = require("../../models/Category.entity.js");

// GET /api/v1 - جلب جميع التصنيفات
exports.getCategories = async (req, res) => {
    const categoryRepo = AppDataSource.getRepository(Category);
    
    const categories = await categoryRepo.find({
        relations: ["parent"],
        order: { name: "ASC" }
    });

    res.json({
        status: "success",
        data: categories
    });
};

// POST /api/v1 - إضافة تصنيف جديد
exports.createCategory = async (req, res) => {
    const { name, slug, parent_id } = req.body;
    
    const categoryRepo = AppDataSource.getRepository(Category);
    
    // توليد slug تلقائياً إذا لم يتم إرساله
    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, '-');
    
    const newCategory = categoryRepo.create({
        name,
        slug: finalSlug,
        parent_id: parent_id || null
    });

    const saved = await categoryRepo.save(newCategory);
    
    res.json({ 
        status: "success", 
        message: "تم إضافة التصنيف بنجاح", 
        data: saved 
    });
};

// PUT /api/v1/:id - تحديث تصنيف
exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, slug, parent_id, is_active } = req.body;
    
    const categoryRepo = AppDataSource.getRepository(Category);
    
    const updateData = {};
    if (name) updateData.name = name;
    if (slug) updateData.slug = slug;
    if (parent_id !== undefined) updateData.parent_id = parent_id;
    if (is_active !== undefined) updateData.is_active = is_active;

    await categoryRepo.update(id, updateData);
    
    res.json({ 
        status: "success", 
        message: "تم تحديث التصنيف بنجاح" 
    });
};

// DELETE /api/v1/:id - حذف تصنيف
exports.deleteCategory = async (req, res) => {
    const { id } = req.params;
    const categoryRepo = AppDataSource.getRepository(Category);
    
    await categoryRepo.update(id, { is_active: false });
    
    res.json({ 
        status: "success", 
        message: "تم حذف التصنيف بنجاح" 
    });
};