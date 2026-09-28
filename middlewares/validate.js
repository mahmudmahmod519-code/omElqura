const validate = (schema) => {
    return (req, res, next) => {
        // نتحقق من الـ body والـ params والـ query
        const { error } = schema.validate({
            ...req.body,
            ...req.params,
            ...req.query
        }, { abortEarly: false }); // abortEarly: false عشان يرجع كل الأخطاء مرة واحدة

        if (error) {
            // استخراج رسائل الخطأ باللغة العربية
            const errors = error.details.map(detail => detail.message);
            return res.status(400).json({ 
                success: false, 
                message: 'بيانات غير صالحة', 
                errors: errors 
            });
        }
        
        next();
    };
};

module.exports = validate;