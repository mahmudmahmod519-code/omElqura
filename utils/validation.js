const Joi = require('joi');

/**
 * جميع مخططات التحقق (Validation Schemas) لمنصة عطور أم القرى
 * متوافقة مع هيكل قاعدة البيانات المحدد (MySQL + TypeORM/Raw SQL)
 */

// ==================== 1. Auth & User Schemas ====================

const registerSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(100)
        .required()
        .trim()
        .pattern(/^[\u0600-\u06FFa-zA-Z\s]+$/)
        .messages({
            'string.min': 'الاسم يجب أن يكون على الأقل 3 أحرف',
            'string.max': 'الاسم يجب أن لا يتجاوز 100 حرف',
            'string.pattern.base': 'الاسم يجب أن يحتوي على أحرف فقط (عربي أو إنجليزي)',
            'any.required': 'الاسم مطلوب'
        }),
    email: Joi.string()
        .email()
        .required()
        .trim()
        .lowercase()
        .max(150)
        .messages({
            'string.email': 'البريد الإلكتروني غير صحيح',
            'any.required': 'البريد الإلكتروني مطلوب',
            'string.max': 'البريد الإلكتروني يجب أن لا يتجاوز 150 حرف'
        }),
    password: Joi.string()
        .min(8)
        .max(255)
        .required()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .messages({
            'string.min': 'كلمة المرور يجب أن تكون على الأقل 8 أحرف',
            'string.pattern.base': 'كلمة المرور يجب أن تحتوي على حرف كبير، حرف صغير، رقم، ورمز خاص',
            'any.required': 'كلمة المرور مطلوبة'
        }),
    password_confirmation: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .messages({
            'any.only': 'تأكيد كلمة المرور غير متطابق',
            'any.required': 'تأكيد كلمة المرور مطلوب'
        }),
    phone: Joi.string()
        .trim()
        .length(11)
        .pattern(/^(010|011|012|015)[0-9]{8}$/)
        .allow('', null)
        .messages({
            'string.pattern.base': 'رقم الهاتف يجب أن يكون رقم مصري صحيح (مثل: 01012345678)',
            'string.length': 'رقم الهاتف يجب أن يكون 11 رقم'
        }),
    address: Joi.string()
        .max(500)
        .trim()
        .allow('', null)
        .messages({
            'string.max': 'العنوان يجب أن لا يتجاوز 500 حرف'
        })
});

const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .trim()
        .lowercase()
        .messages({
            'string.email': 'البريد الإلكتروني غير صحيح',
            'any.required': 'البريد الإلكتروني مطلوب'
        }),
    password: Joi.string()
        .required()
        .messages({
            'any.required': 'كلمة المرور مطلوبة'
        })
});

const forgetPasswordSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .trim()
        .lowercase()
        .messages({
            'string.email': 'البريد الإلكتروني غير صحيح',
            'any.required': 'البريد الإلكتروني مطلوب'
        })
});

const resetPasswordSchema = Joi.object({
    token: Joi.string()
        .required()
        .trim()
        .messages({
            'any.required': 'رمز استعادة كلمة المرور مطلوب'
        }),
    new_password: Joi.string()
        .min(8)
        .max(255)
        .required()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .messages({
            'string.min': 'كلمة المرور الجديدة يجب أن تكون على الأقل 8 أحرف',
            'string.pattern.base': 'كلمة المرور يجب أن تحتوي على حرف كبير، حرف صغير، رقم، ورمز خاص',
            'any.required': 'كلمة المرور الجديدة مطلوبة'
        }),
    confirm_password: Joi.string()
        .valid(Joi.ref('new_password'))
        .required()
        .messages({
            'any.only': 'تأكيد كلمة المرور غير متطابق',
            'any.required': 'تأكيد كلمة المرور مطلوب'
        })
});

const changePasswordSchema = Joi.object({
    current_password: Joi.string()
        .required()
        .messages({
            'any.required': 'كلمة المرور الحالية مطلوبة'
        }),
    new_password: Joi.string()
        .min(8)
        .max(255)
        .required()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .messages({
            'string.min': 'كلمة المرور الجديدة يجب أن تكون على الأقل 8 أحرف',
            'string.pattern.base': 'كلمة المرور يجب أن تحتوي على حرف كبير، حرف صغير، رقم، ورمز خاص',
            'any.required': 'كلمة المرور الجديدة مطلوبة'
        }),
    confirm_password: Joi.string()
        .valid(Joi.ref('new_password'))
        .required()
        .messages({
            'any.only': 'تأكيد كلمة المرور غير متطابق',
            'any.required': 'تأكيد كلمة المرور مطلوب'
        })
});

const updateProfileSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(100)
        .trim()
        .pattern(/^[\u0600-\u06FFa-zA-Z\s]+$/)
        .messages({
            'string.min': 'الاسم يجب أن يكون على الأقل 3 أحرف',
            'string.pattern.base': 'الاسم يجب أن يحتوي على أحرف فقط'
        }),
    phone: Joi.string()
        .trim()
        .length(11)
        .pattern(/^(010|011|012|015)[0-9]{8}$/)
        .allow('', null)
        .messages({
            'string.pattern.base': 'رقم الهاتف يجب أن يكون رقم مصري صحيح'
        }),
    address: Joi.string()
        .max(500)
        .trim()
        .allow('', null)
});

const createAdminSchema = Joi.object({
    name: Joi.string().min(3).max(100).required().trim().messages({
        'string.min': 'الاسم يجب أن يكون على الأقل 3 أحرف',
        'any.required': 'الاسم مطلوب'
    }),
    email: Joi.string().email().required().trim().lowercase().messages({
        'string.email': 'البريد الإلكتروني غير صحيح',
        'any.required': 'البريد الإلكتروني مطلوب'
    }),
    password: Joi.string().min(8).max(255).required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).messages({
        'string.pattern.base': 'كلمة المرور يجب أن تحتوي على حرف كبير، حرف صغير، رقم، ورمز خاص',
        'any.required': 'كلمة المرور مطلوبة'
    }),
    phone: Joi.string().length(11).trim().pattern(/^(010|011|012|015)[0-9]{8}$/).allow('', null).messages({
        'string.pattern.base': 'رقم الهاتف يجب أن يكون رقم مصري صحيح'
    })
});

// ==================== 2. Category & Brand Schemas ====================

const createCategorySchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .required()
        .trim()
        .messages({
            'string.min': 'اسم التصنيف يجب أن يكون على الأقل حرفين',
            'string.max': 'اسم التصنيف يجب أن لا يتجاوز 100 حرف',
            'any.required': 'اسم التصنيف مطلوب'
        }),
    slug: Joi.string()
        .max(100)
        .trim()
        .allow('', null)
        .messages({
            'string.max': 'الـ Slug يجب أن لا يتجاوز 100 حرف'
        }),
    parent_id: Joi.number()
        .integer()
        .positive()
        .allow(null)
        .messages({
            'number.base': 'معرف التصنيف الأب يجب أن يكون رقم',
            'number.positive': 'معرف التصنيف الأب يجب أن يكون رقم موجب'
        })
});

const updateCategorySchema = Joi.object({
    name: Joi.string().min(2).max(100).trim(),
    slug: Joi.string().max(100).trim().allow('', null),
    parent_id: Joi.number().integer().positive().allow(null),
    is_active: Joi.boolean()
});

const createBrandSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .required()
        .trim()
        .messages({
            'string.min': 'اسم الماركة يجب أن يكون على الأقل حرفين',
            'string.max': 'اسم الماركة يجب أن لا يتجاوز 100 حرف',
            'any.required': 'اسم الماركة مطلوب'
        }),
    slug: Joi.string().max(100).trim().allow('', null),
    logo_url: Joi.string().uri().max(255).allow('', null).messages({
        'string.uri': 'رابط الشعار غير صحيح'
    })
});

const updateBrandSchema = Joi.object({
    name: Joi.string().min(2).max(100).trim(),
    slug: Joi.string().max(100).trim().allow('', null),
    logo_url: Joi.string().uri().max(255).allow('', null),
    is_active: Joi.boolean()
});

// ==================== 3. Perfume Schemas ====================

const createPerfumeSchema = Joi.object({
    brand_id: Joi.number().integer().positive().required().messages({
        'number.base': 'معرف الماركة يجب أن يكون رقم',
        'any.required': 'معرف الماركة مطلوب'
    }),
    category_id: Joi.number().integer().positive().required().messages({
        'number.base': 'معرف التصنيف يجب أن يكون رقم',
        'any.required': 'معرف التصنيف مطلوب'
    }),
    name: Joi.string().min(2).max(150).required().trim().messages({
        'string.min': 'اسم العطر يجب أن يكون على الأقل حرفين',
        'any.required': 'اسم العطر مطلوب'
    }),
    slug: Joi.string().max(150).trim().allow('', null),
    description: Joi.string().max(2000).trim().allow('', null),
    price: Joi.number().precision(2).min(0).max(100000).required().messages({
        'number.base': 'السعر يجب أن يكون رقم',
        'number.min': 'السعر يجب أن يكون 0 على الأقل',
        'any.required': 'السعر مطلوب'
    }),
    stock_quantity: Joi.number().integer().min(0).default(0).messages({
        'number.base': 'الكمية يجب أن تكون رقم',
        'number.min': 'الكمية لا يمكن أن تكون أقل من 0'
    }),
    image_url: Joi.string().uri().max(255).allow('', null).messages({
        'string.uri': 'رابط الصورة غير صحيح'
    }),
    fragrance_family: Joi.string().max(50).trim().allow('', null),
    concentration: Joi.string().valid('Parfum', 'EDP', 'EDT', 'Cologne').allow('', null).messages({
        'any.only': 'نوع التركيز يجب أن يكون واحداً من: Parfum, EDP, EDT, Cologne'
    }),
    is_best_seller: Joi.boolean().default(false)
});

const updatePerfumeSchema = Joi.object({
    brand_id: Joi.number().integer().positive(),
    category_id: Joi.number().integer().positive(),
    name: Joi.string().min(2).max(150).trim(),
    slug: Joi.string().max(150).trim().allow('', null),
    description: Joi.string().max(2000).trim().allow('', null),
    price: Joi.number().precision(2).min(0).max(100000),
    stock_quantity: Joi.number().integer().min(0),
    image_url: Joi.string().uri().max(255).allow('', null),
    fragrance_family: Joi.string().max(50).trim().allow('', null),
    concentration: Joi.string().valid('Parfum', 'EDP', 'EDT', 'Cologne').allow('', null),
    is_best_seller: Joi.boolean(),
    is_active: Joi.boolean()
});

const searchPerfumesSchema = Joi.object({
    q: Joi.string().optional().max(100).trim().allow('', null),
    category_id: Joi.number().integer().positive().optional(),
    brand_id: Joi.number().integer().positive().optional(),
    min_price: Joi.number().min(0).max(100000).optional(),
    max_price: Joi.number().min(0).max(100000).optional(),
    fragrance_family: Joi.string().trim().allow('', null).optional(),
    concentration: Joi.string().valid('Parfum', 'EDP', 'EDT', 'Cologne').optional(),
    is_best_seller: Joi.boolean().optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(12),
    sort_by: Joi.string().valid('created_at', 'price', 'name').default('created_at'),
    sort_order: Joi.string().valid('ASC', 'DESC', 'asc', 'desc').default('DESC')
}).unknown(true);

// ==================== 4. Order Schemas (السلة والدفع) ====================

const addToOrderSchema = Joi.object({
    perfume_id: Joi.number().integer().positive().required().messages({
        'number.base': 'معرف العطر يجب أن يكون رقم',
        'any.required': 'معرف العطر مطلوب'
    }),
    quantity: Joi.number().integer().min(1).max(10).default(1).messages({
        'number.base': 'الكمية يجب أن تكون رقم',
        'number.min': 'الكمية يجب أن تكون 1 على الأقل',
        'number.max': 'لا يمكن إضافة أكثر من 10 قطع من نفس العطر'
    })
});

const checkoutSchema = Joi.object({
    payment_method: Joi.string()
        .valid('instapay', 'paymob', 'cash')
        .required()
        .messages({
            'any.only': 'طريقة الدفع يجب أن تكون: instapay, paymob, أو cash',
            'any.required': 'طريقة الدفع مطلوبة'
        }),
    notes: Joi.string().max(500).trim().allow('', null).messages({
        'string.max': 'الملاحظات يجب أن لا تتجاوز 500 حرف'
    })
});

const updateOrderStatusSchema = Joi.object({
    order_status: Joi.string()
        .valid('pending_approval', 'processing', 'shipped', 'delivered', 'cancelled')
        .optional(),
    payment_status: Joi.string()
        .valid('pending', 'approved', 'rejected')
        .optional(),
    notes: Joi.string().max(500).trim().allow('', null)
});

// ==================== 5. Review Schemas ====================

const createReviewSchema = Joi.object({
    perfume_id: Joi.number().integer().positive().required().messages({
        'number.base': 'معرف العطر يجب أن يكون رقم',
        'any.required': 'معرف العطر مطلوب'
    }),
    rating: Joi.number().integer().min(1).max(5).required().messages({
        'number.base': 'التقييم يجب أن يكون رقم',
        'number.min': 'التقييم يجب أن يكون 1 على الأقل',
        'number.max': 'التقييم يجب أن لا يتجاوز 5',
        'any.required': 'التقييم مطلوب'
    }),
    comment: Joi.string().max(1000).trim().allow('', null).messages({
        'string.max': 'التعليق يجب أن لا يتجاوز 1000 حرف'
    })
});

const updateReviewSchema = Joi.object({
    rating: Joi.number().integer().min(1).max(5),
    comment: Joi.string().max(1000).trim().allow('', null)
});

// ==================== 6. Common Schemas ====================

const idParamSchema = Joi.object({
    id: Joi.number().integer().positive().required().messages({
        'number.base': 'المعرف يجب أن يكون رقم',
        'number.positive': 'المعرف يجب أن يكون رقم موجب',
        'any.required': 'المعرف مطلوب'
    })
});

module.exports = {
    // Auth & User
    registerSchema, loginSchema, forgetPasswordSchema, resetPasswordSchema,
    changePasswordSchema, updateProfileSchema, createAdminSchema,
    
    // Categories & Brands
    createCategorySchema, updateCategorySchema, createBrandSchema, updateBrandSchema,
    
    // Perfumes
    createPerfumeSchema, updatePerfumeSchema, searchPerfumesSchema,
    
    // Orders
    addToOrderSchema, checkoutSchema, updateOrderStatusSchema,
    
    // Reviews
    createReviewSchema, updateReviewSchema,
    
    // Common
    idParamSchema
};