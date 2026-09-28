# عطور أم القرى - promptPages.md
# دليل شامل لجميع الصفحات + User Flow + Prompts لـ Google Stitch

---

## 📋 جدول المحتويات

1. [نظرة عامة على المشروع](#نظرة-عامة-على-المشروع)
2. [نظام التصميم (Design System)](#نظام-التصميم)
3. [تدفقات المستخدم (User Flows)](#تدفقات-المستخدم)
4. [Prompts لكل صفحة (Google Stitch)](#prompts-لكل-صفحة)
5. [الأخطاء المكتشفة أثناء الديباج](#الأخطاء-المكتشفة-أثناء-الديباج)
6. [هيكل قاعدة البيانات](#هيكل-قاعدة-البيانات)
7. [هيكل المشروع](#هيكل-المشروع)

---

## نظرة عامة على المشروع

**الاسم:** عطور أم القرى (Um Al-Qura Perfumes)
**النوع:** منصة تجارة إلكترونية فاخرة لبيع العطور الأصلية
**التقنيات:**
- Backend: Node.js + Express.js
- Database: MySQL (TypeORM + Raw SQL)
- Frontend: EJS (Server-Side Rendering)
- Auth: JWT في HTTP-Only Cookies
- Payment: InstaPay (يدوي) + Paymob (أوتوماتيك) + Cash
- Validation: Joi

**الأدوار:**
- `guest`: غير مسجل (صفحات عامة فقط)
- `customer`: مسجل عادي (شراء، تقييم، متابعة طلبات)
- `admin`: مدير (إدارة كل شيء)

---

## نظام التصميم

### الألوان
| الاسم | القيمة | الاستخدام |
|-------|---------|-----------|
| Primary | `#0A1F44` (Deep Navy Blue) | الخلفية الرئيسية، الأزرار |
| Secondary/Accent | `#D4B896` (Soft Gold) | الأزرار، التفاصيل الفاخرة |
| Background | `#F8F6F2` (Off-White) | خلفية الصفحات |
| Text on Dark | `#FFFFFF` | النص على الخلفية الداكنة |
| Text on Light | `#0A1F44` | النص على الخلفية الفاتحة |
| Success | `#2E7D32` | رسائل النجاح |
| Error | `#C62828` | رسائل الخطأ |
| Warning | `#F9A825` | التحذيرات |

### الخط
- خط عربي عصري أنيق (Tajawal أو Cairo أو IBM Plex Sans Arabic)

### الاتجاه
- Full RTL في كل شيء

### الأسلوب العام
- Modern Luxury (فاخر عصري)
- Clean, spacious, elegant
- Soft shadows, rounded corners معتدلة (12-16px)
- High-end product photography feel

### تأثيرات الحركة
- السرعة: 300ms – 450ms
- Easing: ease-out أو cubic-bezier(0.22, 1, 0.36, 1)
- الأزرار: scale(1.03) + ظل ذهبي أقوى عند الـ hover
- بطاقات المنتجات: translateY(-6px) + ظل أعمق عند الـ hover
- الصور: scale(1.05) خفيف جداً داخل الحاوية عند الـ hover
- تحميل الصفحة: fade-in + حركة صاعدة خفيفة (staggered)
- الـ Modals والـ Dropdowns: fade + scale من 0.95

### التجاوب (Responsive)
- Mobile-first
- Breakpoints: Mobile (<768px) | Tablet (768-1024px) | Desktop (>1024px)
- على الموبايل: Sidebar يتحول إلى Drawer أو Bottom Sheet

---

## تدفقات المستخدم

### Guest Flow
```
/ → /perfumes → /perfumes/:id → Add to Cart → "يجب تسجيل الدخول" → /auth/login أو /auth/register
```

### Customer Flow
```
Login → / → /perfumes → إضافة للسلة → /orders/cart → Checkout →
├── InstaPay → /orders/:id/upload-receipt
├── Paymob → /orders/:id/payment (Iframe)
└── Cash → نجاح مباشر
→ /orders/profile/orders → /users/profile → تقييمات → Logout
```

### Admin Flow
```
Login → /admin/dashboard → إدارة المنتجات / التصنيفات / الماركات / الطلبات / المستخدمين
```

---

## Prompts لكل صفحة

### 1. الصفحة الرئيسية `/` done
```
PAGE: Home Page
PATH: /
ROLE: * (الجميع)
PURPOSE: عرض العطور المميزة وأحدث الإضافات
APIS:
  - GET /perfumes/api/v1?is_best_seller=true&limit=6
  - GET /perfumes/api/v1?sort_by=created_at&limit=8
UI COMPONENTS:
  - Hero section مع CTA "تسوق الآن"
  - Best Sellers grid (6 بطاقات)
  - Latest perfumes grid
  - Features section (شحن، أصالة، استرجاع)
  - Navbar + Footer
STATES:
  - loading: spinner
  - empty: "لا توجد منتجات حالياً"
  - error: "فشل في تحميل المنتجات"
  - success: عرض المنتجات
ACTIONS:
  - Guest: تصفح، بحث، تسجيل دخول
  - Customer: إضافة للسلة
  - Admin: نفس الـ customer + زر admin panel
REDIRECTS:
  - /auth/login (لو guest ضغط Add to Cart)
  - /perfumes/:id (عند الضغط على عطر)
```

### 2. من نحن `/about-us`done
```
PAGE: About Us
PATH: /about-us
ROLE: *
PURPOSE: تعريف بالمتجر ورسالته
APIS: لا يوجد (صفحة ثابتة)
UI COMPONENTS:
  - قصة المتجر
  - الرسالة والرؤية
  - لماذا نحن (مميزات)
STATES: لا يوجد
ACTIONS: لا يوجد
```

### 3. اتصل بنا `/contact-us`done
```
PAGE: Contact Us
PATH: /contact-us
ROLE: *
PURPOSE: معلومات التواصل
APIS: لا يوجد
UI COMPONENTS:
  - معلومات الاتصال (إيميل، هاتف، عنوان)
  - أوقات العمل
  - روابط السوشيال ميديا
  - فورم تواصل بسيط
STATES: لا يوجد
ACTIONS: إرسال رسالة
```

### 4. الأسئلة الشائعة `/faq`done
```
PAGE: FAQ
PATH: /faq
ROLE: *
PURPOSE: الإجابة على الأسئلة المتكررة
APIS: لا يوجد
UI COMPONENTS:
  - Accordion مع الأسئلة والأجوبة
STATES: لا يوجد
ACTIONS: فتح/غلق الأسئلة
```

### 5. سياسة الخصوصية `/privacy`done
```
PAGE: Privacy Policy
PATH: /privacy
ROLE: *
PURPOSE: معلومات قانونية
APIS: لا يوجد
UI COMPONENTS: نص منسق
STATES: لا يوجد
ACTIONS: لا يوجد
```

### 6. الشروط والأحكام `/terms`done
```
PAGE: Terms & Conditions
PATH: /terms
ROLE: *
PURPOSE: معلومات قانونية
APIS: لا يوجد
UI COMPONENTS: نص منسق
STATES: لا يوجد
ACTIONS: لا يوجد
```

### 7. سياسة الاسترجاع `/refund`done
```
PAGE: Refund Policy
PATH: /refund
ROLE: *
PURPOSE: معلومات قانونية
APIS: لا يوجد
UI COMPONENTS: نص منسق
STATES: لا يوجد
ACTIONS: لا يوجد
```

### 8. تسجيل الدخول `/auth/login`done
```
PAGE: Login
PATH: /auth/login
ROLE: guest فقط
PURPOSE: تسجيل دخول المستخدم
APIS: POST /auth/api/v1/login
UI COMPONENTS:
  - Form: email, password
  - Submit button
  - Links: "نسيت كلمة المرور"، "إنشاء حساب"
STATES:
  - idle: الفورم فاضي
  - loading: spinner على الزر
  - error: رسالة خطأ تحت الفورم
  - success: redirect للرئيسية
ACTIONS:
  - Submit → POST API → حفظ cookie → redirect
  - Link → /auth/forgot-password
  - Link → /auth/register
REDIRECTS:
  - / (عند النجاح)
  - Redirect تلقائي للرئيسية لو مسجل بالفعل
```

### 9. إنشاء حساب `/auth/register`done
```
PAGE: Register
PATH: /auth/register
ROLE: guest فقط
PURPOSE: إنشاء حساب جديد
APIS: POST /auth/api/v1/register
UI COMPONENTS:
  - Form: name, email, phone, password, password_confirmation
  - Submit button
  - Link: "لديك حساب؟ سجل دخول"
STATES: idle/loading/error/success
ACTIONS: Submit → إنشاء حساب → حفظ cookie → redirect
REDIRECTS: / (عند النجاح)
```

### 10. نسيت كلمة المرور `/auth/forgot-password`done
```
PAGE: Forgot Password
PATH: /auth/forgot-password
ROLE: guest
PURPOSE: طلب رابط استعادة
APIS: POST /auth/api/v1/forgot-password
UI COMPONENTS:
  - Form: email
  - Submit button
STATES:
  - idle
  - loading
  - success: "تم إرسال الرابط للبريد" (دائماً نفس الرسالة للأمان)
ACTIONS: Submit → إرسال إيميل
```

### 11. إعادة تعيين كلمة المرور `/auth/reset-password/:token`done
```
PAGE: Reset Password
PATH: /auth/reset-password/:token
ROLE: guest
PURPOSE: تعيين كلمة مرور جديدة
APIS: POST /auth/api/v1/reset-password/:token
UI COMPONENTS:
  - Form: new_password, confirm_password
  - Submit button
STATES: idle/loading/error/success
REDIRECTS: /auth/login (عند النجاح)
```

### 12. قائمة العطور `/perfumes` done
```
PAGE: Perfumes List
PATH: /perfumes
ROLE: *
PURPOSE: تصفح كل العطور مع الفلترة
APIS:
  - GET /perfumes/api/v1 (مع query params)
  - GET /categories/api/v1 (للـ filter dropdown)
  - GET /brands/api/v1 (للـ filter dropdown)
UI COMPONENTS:
  - Sidebar: Filters (category, brand, price range, family, concentration)
  - Search bar
  - Sort dropdown
  - Products grid
  - Pagination
STATES: loading/empty/error/success
ACTIONS:
  - Guest: تصفح، فلترة، بحث
  - Customer: + إضافة للسلة
  - Admin: + أزرار تعديل/حذف
REDIRECTS: /perfumes/:id
```

### 13. تفاصيل عطر `/perfumes/:id`done
```
PAGE: Perfume Details
PATH: /perfumes/:id
ROLE: *
PURPOSE: عرض تفاصيل عطر واحد
APIS:
  - GET /perfumes/api/v1/:id
  - GET /reviews/api/v1/perfume/:id (آخر 3 تقييمات)
UI COMPONENTS:
  - Image gallery
  - Name, brand, category
  - Price, stock status
  - Description, fragrance family, concentration
  - Smell notes
  - Add to Cart button
  - Last 3 reviews preview
  - Link to full reviews
STATES: loading/empty(404)/error/success
ACTIONS:
  - Guest: "Please Login" عند Add to Cart
  - Customer: إضافة للسلة
  - Admin: أزرار تعديل/حذف
REDIRECTS:
  - /auth/login (لو guest)
  - /perfumes/:id/reviews
```

### 14. تصنيف `/categories/:slug`
```
PAGE: Category Products
PATH: /categories/:slug
ROLE: *
PURPOSE: عرض عطور تصنيف محدد
APIS:
  - GET /categories/api/v1 (للحصول على category_id من slug)
  - GET /perfumes/api/v1?category_id=X
UI COMPONENTS: نفس قائمة العطور لكن مفلتر
ACTIONS: نفس قائمة العطور
```

### 15. تقييمات عطر `/perfumes/:id/reviews`
```
PAGE: Perfume Reviews
PATH: /perfumes/:id/reviews
ROLE: * (يشوف)، customer (يضيف)
PURPOSE: عرض كل التقييمات
APIS:
  - GET /reviews/api/v1/perfume/:id (كل التقييمات + average)
  - POST /reviews/api/v1 (لإضافة تقييم - customer فقط)
UI COMPONENTS:
  - Average rating display
  - Reviews list
  - Add review form (customer فقط)
  - Edit/Delete buttons (صاحب التقييم فقط)
STATES: loading/empty/error/success
ACTIONS:
  - Guest: يشوف فقط
  - Customer: يضيف/يعدل/يحذف تقييمه
  - Admin: يخفي/يحذف أي تقييم
```

### 16. الملف الشخصي `/users/profile`
```
PAGE: User Profile
PATH: /users/profile
ROLE: customer فقط
PURPOSE: عرض بيانات المستخدم
APIS: GET /users/api/v1/profile
UI COMPONENTS:
  - User info display (name, email, phone, address)
  - Edit button
  - Change password button
  - Orders history link
  - Logout button
ACTIONS:
  - Edit → /users/profile/edit
  - Orders → /orders/profile/orders
  - Logout → POST /auth/api/v1/logout
REDIRECTS: /auth/login (لو مش مسجل)
```

### 17. تعديل الملف الشخصي `/users/profile/edit`
```
PAGE: Edit Profile
PATH: /users/profile/edit
ROLE: customer فقط
PURPOSE: تحديث البيانات
APIS:
  - GET /users/api/v1/profile (لجلب البيانات الحالية)
  - PUT /users/api/v1/profile (للتحديث)
  - PUT /users/api/v1/change-password
UI COMPONENTS:
  - Form: name, phone, address
  - Password change form (separate)
  - Submit buttons
STATES: idle/loading/success/error
REDIRECTS: /users/profile (عند النجاح)
```

### 18. السلة `/orders/cart`done
```
PAGE: Cart
PATH: /orders/cart
ROLE: customer فقط
PURPOSE: عرض محتويات السلة
APIS:
  - GET /orders/api/v1/my-orders?status=cart
  - PUT /orders/api/v1/update-item/:id
  - DELETE /orders/api/v1/remove-item/:id
  - POST /orders/api/v1/checkout
UI COMPONENTS:
  - Cart items list (صورة، اسم، سعر، quantity input، حذف)
  - Total amount
  - Checkout button
  - Empty cart message
STATES:
  - loading
  - empty: "السلة فاضية" + link للتصفح
  - error
  - success
ACTIONS:
  - تعديل الكمية → PUT API
  - حذف عنصر → DELETE API
  - Checkout → POST → redirect حسب طريقة الدفع
REDIRECTS:
  - /orders/:id/upload-receipt (InstaPay)
  - /orders/:id/payment (Paymob)
  - /orders/profile/orders (Cash)
```

### 19. الدفع `/orders/:id/payment`
```
PAGE: Payment
PATH: /orders/:id/payment
ROLE: customer (صاحب الطلب)
PURPOSE: اختيار طريقة الدفع
APIS: POST /orders/api/v1/checkout
UI COMPONENTS:
  - Order summary
  - Payment method selection (InstaPay/Paymob/Cash)
  - Paymob Iframe (لو اختار Paymob)
  - Submit button
STATES: idle/loading/success/error
ACTIONS: اختيار طريقة دفع → POST → redirect
```

### 20. رفع إيصال الدفع `/orders/:id/upload-receipt`
```
PAGE: Upload Receipt
PATH: /orders/:id/upload-receipt
ROLE: customer (صاحب الطلب بـ InstaPay)
PURPOSE: رفع صورة التحويل
APIS: POST /orders/api/v1/:id/upload-receipt
UI COMPONENTS:
  - Order info
  - InstaPay instructions (merchant handle)
  - File upload input
  - Submit button
STATES: idle/loading/success/error
REDIRECTS: /orders/profile/orders (عند النجاح)
```

### 21. سجل الطلبات `/orders/profile/orders`
```
PAGE: Order History
PATH: /orders/profile/orders
ROLE: customer فقط
PURPOSE: عرض الطلبات السابقة
APIS: GET /orders/api/v1/my-orders
UI COMPONENTS:
  - Orders list (رقم الطلب، التاريخ، المبلغ، الحالة، طريقة الدفع)
  - Order details expandable
  - Status badges (pending/processing/shipped/delivered/cancelled)
STATES: loading/empty/error/success
ACTIONS: عرض التفاصيل
```

### 22. إدارة العطور `/perfumes/admin`
```
PAGE: Admin Perfumes
PATH: /perfumes/admin
ROLE: admin فقط
PURPOSE: CRUD العطور
APIS:
  - GET /perfumes/api/v1 (كل العطور بما فيها المحذوفة)
  - POST/PUT/DELETE /perfumes/api/v1
UI COMPONENTS:
  - Table: صورة، اسم، ماركة، سعر، مخزون، حالة
  - Add button
  - Edit/Delete buttons per row
  - Success/Error alerts
STATES: loading/empty/error/success
ACTIONS: إضافة، تعديل، حذف
REDIRECTS:
  - /perfumes/admin/create
  - /perfumes/admin/:id/edit
```

### 23. إضافة عطر `/perfumes/admin/create`
```
PAGE: Create Perfume
PATH: /perfumes/admin/create
ROLE: admin فقط
PURPOSE: إضافة عطر جديد
APIS: POST /perfumes/api/v1
UI COMPONENTS:
  - Form: name, brand_id, category_id, price, stock_quantity, description, fragrance_family, concentration, image upload
  - Submit button
STATES: idle/loading/success/error
REDIRECTS: /perfumes/admin (عند النجاح)
```

### 24. تعديل عطر `/perfumes/admin/:id/edit`
```
PAGE: Edit Perfume
PATH: /perfumes/admin/:id/edit
ROLE: admin فقط
PURPOSE: تعديل عطر موجود
APIS:
  - GET /perfumes/api/v1/:id (لجلب البيانات الحالية)
  - PUT /perfumes/api/v1/:id
UI COMPONENTS:
  - Form: name, brand_id, category_id, price, stock_quantity, description, fragrance_family, concentration, image upload
  - Submit button
STATES: idle/loading/success/error
REDIRECTS: /perfumes/admin (عند النجاح)
```

### 25. إدارة التصنيفات `/categories/admin`
```
PAGE: Admin Categories
PATH: /categories/admin
ROLE: admin فقط
PURPOSE: CRUD التصنيفات
APIS: GET/POST/PUT/DELETE /categories/api/v1
UI COMPONENTS:
  - Table مع الأعمدة المناسبة
  - Add/Edit forms (modal أو page)
  - Delete confirmation
ACTIONS: CRUD كامل
```

### 26. إدارة الماركات `/brands/admin`
```
PAGE: Admin Brands
PATH: /brands/admin
ROLE: admin فقط
PURPOSE: CRUD الماركات
APIS: GET/POST/PUT/DELETE /brands/api/v1
UI COMPONENTS:
  - Table مع الأعمدة المناسبة
  - Add/Edit forms (modal أو page)
  - Delete confirmation
ACTIONS: CRUD كامل
```

### 27. إدارة الطلبات `/orders/admin`
```
PAGE: Admin Orders
PATH: /orders/admin
ROLE: admin فقط
PURPOSE: مراجعة وإدارة الطلبات
APIS:
  - GET /orders/api/v1/admin/all
  - PUT /orders/api/v1/admin/:id/approve
  - PUT /orders/api/v1/admin/:id/reject
  - PUT /orders/api/v1/admin/:id/status
UI COMPONENTS:
  - Table: رقم الطلب، العميل، المبلغ، طريقة الدفع، حالة الدفع، حالة الطلب
  - View receipt button (InstaPay)
  - Approve/Reject buttons
  - Status update dropdown
STATES: loading/empty/error/success
ACTIONS:
  - مراجعة إيصال
  - موافقة/رفض
  - تحديث حالة الشحن
```

### 28. إدارة المستخدمين `/users/admin/users`
```
PAGE: Admin Users
PATH: /users/admin/users
ROLE: admin فقط
PURPOSE: إدارة المستخدمين
APIS:
  - GET /users/api/v1/admin/all
  - PUT /users/api/v1/admin/:id/role
UI COMPONENTS:
  - Table: اسم، إيميل، هاتف، دور، تاريخ الإنشاء
  - Search/Filter
  - Pagination
  - Role change dropdown
ACTIONS: تغيير دور مستخدم
```

### 29. لوحة التحكم `/admin/dashboard`
```
PAGE: Admin Dashboard
PATH: /admin/dashboard
ROLE: admin فقط
PURPOSE: نظرة عامة على المتجر
APIS:
  - GET /orders/api/v1/admin/all (للإحصائيات)
  - GET /perfumes/api/v1 (للإحصائيات)
  - GET /users/api/v1/admin/all (للإحصائيات)
UI COMPONENTS:
  - Stats cards (إجمالي الطلبات، المبيعات، المستخدمين، المنتجات)
  - Recent orders table
  - Best sellers chart
  - Low stock alerts
STATES: loading/error/success
```

### 30. صفحات الأخطاء
```
PAGE: 404 Not Found
PATH: * (catch-all)
ROLE: *
PURPOSE: صفحة غير موجودة
UI COMPONENTS:
  - "404" كبير
  - "الصفحة غير موجودة"
  - زر العودة للرئيسية
ACTIONS: العودة للرئيسية

PAGE: 500 Server Error
PATH: error handler
ROLE: *
PURPOSE: خطأ في السيرفر
UI COMPONENTS:
  - "500" كبير
  - "خطأ في السيرفر"
  - تفاصيل الخطأ (في development فقط)
  - زر العودة للرئيسية
ACTIONS: العودة للرئيسية
```

---

## الأخطاء المكتشفة أثناء الديباج

### 🔴 أخطاء حرجة (Critical)

#### 1. خطأ في مسار الـ Entities في data-source.js
**الملف:** `config/data-source.js` سطر 15
```javascript
// ❌ خطأ
entities: [__dirname + "../models/*.entity.js"],

// ✅ صحيح
entities: [__dirname + "/../models/*.entity.js"],
```
**التأثير:** التطبيق لن يتمكن من العثور على الـ Entities ولن يعمل.

#### 2. خطأ في middleware المصادقة
**الملف:** `middlewares/auth.js` سطر 13
```javascript
// ❌ خطأ
if(!token)return res.redirect("/auth");

// ✅ صحيح
if(!token)return res.redirect("/auth/login");
```

#### 3. خطأ في middleware المصادقة - عدم إرسال response
**الملف:** `middlewares/auth.js` سطر 25
```javascript
// ❌ خطأ - الطلب يعلق
}catch(ex){
    console.log(ex);
}

// ✅ صحيح
}catch(ex){
    console.log(ex);
    return res.status(401).json({ status: "error", message: "غير مصرح" });
}
```

#### 4. خطأ في middleware الأدوار
**الملف:** `middlewares/roles.js` سطر 5
```javascript
// ❌ خطأ
if(!roles.includes(req.user.roles))return res.status(403).json({ success: true, message: "لا تملك صلاحيه لهاذا" });

// ✅ صحيح
if(!roles.includes(req.user.role))return res.status(403).json({ success: false, message: "لا تملك صلاحيه لهاذا" });
```

#### 5. خطأ في middleware رفع الملفات
**الملف:** `middlewares/upload.js` سطر 12
```javascript
// ❌ خطأ
if(file.mimetype.startsWith("image"))cb(null,uploadDir)

// ✅ صحيح
if(file.mimetype.startsWith("image/"))cb(null,uploadDir)
```

#### 6. خطأ في أمان رفع الملفات - Path Traversal
**الملف:** `middlewares/upload.js` سطر 16
```javascript
// ❌ خطأ - يمكن أن يسبب path traversal
cb(null,`${Date.now()}-${file.originalname}`);

// ✅ صحيح
const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
cb(null,`${Date.now()}-${sanitizedName}`);
```

#### 7. خطأ في server-config.js - استخدام express بدون require
**الملف:** `config/server-config.js`
```javascript
// ❌ خطأ - express غير معرف
app.use(express.json());

// ✅ صحيح
const express = require('express');
app.use(express.json());
```

#### 8. خطأ في mailer.js - دالة غير موجودة
**الملف:** `utils/mailer.js`
```javascript
// ❌ خطأ - الـ controller يستدعي sendEmail لكن الملف يصدر isAuthenticated
module.exports = isAuthenticated;

// ✅ صحيح - يجب إضافة دالة sendEmail
```

#### 9. خطأ في cronJobs.js - متغير غير معرف
**الملف:** `utils/cronJobs.js` سطر 8
```javascript
// ❌ خطأ
const conn = await db.getConnection();

// ✅ صحيح
const AppDataSource = require("../config/data-source");
const conn = await AppDataSource.getConnection();
```

#### 10. خطأ في payment.js - axios غير مثبت
**الملف:** `utils/payment.js` سطر 1
```javascript
// ❌ خطأ - axios غير موجود في package.json
const axios = require('axios');

// ✅ صحيح - يجب تثبيت axios أو استخدام fetch
```

#### 11. خطأ في users.controller.js - bcryptjs غير مثبت
**الملف:** `logicModels/users/users.controller.js` سطر 3
```javascript
// ❌ خطأ
const bcrypt = require("bcryptjs");

// ✅ صحيح
const bcrypt = require("bcrypt");
```

#### 12. خطأ في auth.controller.js - استعلام إعادة تعيين كلمة المرور
**الملف:** `logicModels/auth/auth.controller.js` سطر 150
```javascript
// ❌ خطأ - لا يتحقق من انتهاء الصلاحية
const user = await userRepo.findOne({ 
    where: { 
        reset_token: token,
        reset_token_expiry: new Date()
    }
});

// ✅ صحيح
const { MoreThan } = require("typeorm");
const user = await userRepo.findOne({ 
    where: { 
        reset_token: token,
        reset_token_expiry: MoreThan(new Date())
    }
});
```

#### 13. خطأ في remove_password.js - اسم العمود خاطئ
**الملف:** `utils/remove_password.js` سطر 6
```javascript
// ❌ خطأ
const {password_hash,...rest}=data;

// ✅ صحيح
const {password,...rest}=data;
```

#### 14. خطأ في perfume.controller.js - SQL Injection
**الملف:** `logicModels/perfume/perfume.controller.js` سطر 23
```javascript
// ❌ خطأ - sort_by يمكن أن يسبب SQL Injection
.orderBy(`perfume.${sort_by}`, sort_order)

// ✅ صحيح
const allowedSortColumns = ['created_at', 'price', 'name'];
const safeSortBy = allowedSortColumns.includes(sort_by) ? sort_by : 'created_at';
.orderBy(`perfume.${safeSortBy}`, sort_order === 'ASC' ? 'ASC' : 'DESC')
```

#### 15. خطأ في views - لا توجد ملفات EJS
**المشكلة:** مجلد `views/` موجود لكن لا يحتوي على أي ملفات EJS.
**التأثير:** التطبيق لن يتمكن من عرض أي صفحة.

### 🟡 أخطاء متوسطة (Medium)

#### 16. خطأ في orders.controller.js - Webhook Paymob
**الملف:** `logicModels/orders/orders.controller.js` سطر 368-486
- التحقق من HMAC غير صحيح
- بنية البيانات غير صحيحة
- يجب مراجعة وتصحيح كامل للـ webhook

#### 17. خطأ في orders.controller.js - تحديث السلة
**الملف:** `logicModels/orders/orders.controller.js` سطر 116
```javascript
// ❌ خطأ - ترتيب العمليات قد يسبب مشكلة
SET quantity = ?, total_price = quantity * ?

// ✅ صحيح
SET quantity = ?, total_price = ? * quantity
```

#### 18. خطأ في securityLogger.js - تسجيل بيانات حساسة
**الملف:** `middlewares/securityLogger.js`
- يسجل الـ headers والـ body كاملة
- قد يسجل كلمات مرور أو tokens

#### 19. خطأ في helmet.js - غير مفعل
**الملف:** `middlewares/helmet.js`
- الملف موجود لكن غير مفعل في server-config.js
- يجب تفعيله للأمان

#### 20. خطأ في checkLogin.js - console.log
**الملف:** `utils/checkLogin.js` سطر 4
```javascript
// ❌ خطأ - يجب إزالته في الإنتاج
console.log(req.baseUrl);
```

---

## هيكل قاعدة البيانات

### الجداول

#### users
| العمود | النوع | الوصف |
|--------|-------|-------|
| id | int (PK) | المعرف |
| name | varchar(100) | الاسم |
| email | varchar(150) | البريد (فريد) |
| password | varchar(255) | كلمة المرور (مشفرة) |
| phone | varchar(20) | الهاتف |
| address | text | العنوان |
| role | enum('admin','customer') | الدور |
| reset_token | varchar(255) | رمز الاستعادة |
| reset_token_expiry | datetime | انتهاء صلاحية الرمز |
| created_at | timestamp | تاريخ الإنشاء |

#### perfumes
| العمود | النوع | الوصف |
|--------|-------|-------|
| id | int (PK) | المعرف |
| brand_id | int (FK) | الماركة |
| category_id | int (FK) | التصنيف |
| name | varchar(150) | الاسم |
| slug | varchar(150) | الرابط (فريد) |
| description | text | الوصف |
| price | decimal(10,2) | السعر |
| stock_quantity | int | المخزون |
| image_url | varchar(255) | رابط الصورة |
| fragrance_family | varchar(50) | العائلة العطرية |
| concentration | varchar(20) | التركيز |
| is_best_seller | boolean | الأكثر مبيعاً |
| is_active | boolean | نشط |
| created_at | timestamp | تاريخ الإنشاء |

#### orders
| العمود | النوع | الوصف |
|--------|-------|-------|
| id | int (PK) | المعرف |
| user_id | int (FK) | المستخدم |
| total_amount | decimal(10,2) | الإجمالي |
| order_status | enum | حالة الطلب |
| payment_method | enum | طريقة الدفع |
| payment_status | enum | حالة الدفع |
| paymob_order_id | varchar(100) | معرف Paymob |
| paymob_transaction_id | varchar(100) | معاملة Paymob |
| payment_proof | varchar(255) | إيصال الدفع |
| notes | text | ملاحظات |
| created_at | timestamp | تاريخ الإنشاء |
| updated_at | timestamp | تاريخ التحديث |

#### order_items
| العمود | النوع | الوصف |
|--------|-------|-------|
| id | int (PK) | المعرف |
| order_id | int (FK) | الطلب |
| perfume_id | int (FK) | العطر |
| quantity | int | الكمية |
| unit_price | decimal(10,2) | سعر الوحدة |
| total_price | decimal(10,2) | السعر الإجمالي |

#### reviews
| العمود | النوع | الوصف |
|--------|-------|-------|
| id | int (PK) | المعرف |
| user_id | int (FK) | المستخدم |
| perfume_id | int (FK) | العطر |
| rating | int | التقييم (1-5) |
| comment | text | التعليق |
| is_approved | boolean | معتمد |
| created_at | timestamp | تاريخ الإنشاء |

#### categories
| العمود | النوع | الوصف |
|--------|-------|-------|
| id | int (PK) | المعرف |
| name | varchar(100) | الاسم |
| slug | varchar(100) | الرابط (فريد) |
| parent_id | int (FK) | التصنيف الأب |
| is_active | boolean | نشط |
| created_at | timestamp | تاريخ الإنشاء |

#### brands
| العمود | النوع | الوصف |
|--------|-------|-------|
| id | int (PK) | المعرف |
| name | varchar(100) | الاسم |
| slug | varchar(100) | الرابط (فريد) |
| logo_url | varchar(255) | رابط الشعار |
| created_at | timestamp | تاريخ الإنشاء |

---

## هيكل المشروع

```
um-al-qura-perfumes/
├── config/
│   ├── server-config.js
│   └── data-source.js
├── logicModels/
│   ├── auth/
│   │   ├── auth.controller.js
│   │   └── auth.render.js
│   ├── users/
│   │   ├── users.controller.js
│   │   └── users.render.js
│   ├── categories/
│   │   ├── categories.controller.js
│   │   └── categories.render.js
│   ├── brands/
│   │   ├── brands.controller.js
│   │   └── brands.render.js
│   ├── perfume/
│   │   ├── perfume.controller.js
│   │   └── perfume.render.js
│   ├── orders/
│   │   ├── orders.controller.js
│   │   └── orders.render.js
│   ├── reviews/
│   │   ├── reviews.controller.js
│   │   └── reviews.render.js
│   ├── static/
│   │   └── static.render.js
│   └── errors/
├── middlewares/
│   ├── auth.js
│   ├── roles.js
│   ├── validate.js
│   ├── upload.js
│   ├── helmet.js
│   └── securityLogger.js
├── models/
│   ├── User.entity.js
│   ├── Perfume.entity.js
│   ├── Order.entity.js
│   ├── OrderItem.entity.js
│   ├── Category.entity.js
│   ├── Brand.entity.js
│   └── Review.entity.js
├── routes/
│   ├── index.js
│   ├── auth/
│   ├── users/
│   ├── categories/
│   ├── brands/
│   ├── perfume/
│   ├── orders/
│   ├── reviews/
│   ├── static/
│   └── errors/
├── utils/
│   ├── catchError.js
│   ├── checkLogin.js
│   ├── remove_password.js
│   ├── mailer.js
│   ├── cronJobs.js
│   ├── payment.js
│   └── validation.js
├── views/
│   ├── partials/
│   ├── auth/
│   ├── shop/
│   ├── user/
│   ├── admin/
│   ├── checkout/
│   ├── static/
│   └── errors/
├── public/
│   ├── assests/
│   └── uploads/
├── .env
├── server.js
└── package.json
```

---

## ملاحظات للـ Google Stitch

### ترتيب التوليد
1. **Design System أولاً:** Navbar, Footer, Buttons, Cards, Colors
2. **الصفحات الثابتة:** Home, About, Contact, FAQ, Privacy, Terms, Refund
3. **صفحات المصادقة:** Login, Register, Forgot Password, Reset Password
4. **صفحات المتجر:** Perfumes List, Perfume Details, Category, Reviews
5. **صفحات المستخدم:** Profile, Edit Profile, Order History
6. **صفحات الطلبات:** Cart, Payment, Upload Receipt
7. **صفحات الأدمن:** Dashboard, Admin Perfumes, Admin Categories, Admin Brands, Admin Orders, Admin Users
8. **صفحات الأخطاء:** 404, 500

### المكونات المشتركة
- Navbar (Sticky + blur عند التمرير)
- Footer
- أزرار Soft Gold الأساسية
- بطاقات المنتجات
- رسائل الخطأ والنجاح
- حالات Loading / Empty / Error

### الحالات المطلوبة لكل صفحة
- Loading: Skeleton shimmer بلون Soft Gold
- Empty: رسالة واضحة + زر إجراء
- Error: رسالة خطأ + زر إعادة المحاولة
- Success: عرض البيانات

---

## نهاية المستند

**ملاحظة:** هذا المستند يحتوي على جميع المعلومات المطلوبة لإنشاء الموقع باستخدام Google Stitch. تأكد من إصلاح الأخطاء المذكورة في قسم "الأخطاء المكتشفة" قبل البدء في التطوير.
