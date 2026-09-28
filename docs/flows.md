# flow business logic

## auth

### auth flow
```bash

Guest يدخل /auth/login
    ↓
يدخل email + password
    ↓
POST /auth/api/v1/login
    ↓
Backend يتحقق من البيانات
    ↓
يولد JWT ويحفظه في HTTP-Only Cookie
    ↓
يرجع user data للـ Frontend
    ↓
Frontend يحدث الـ UI (يظهر زر Profile + Logout)

```

### سيناريوهات
- ✅ Login ناجح → cookie + redirect
- ❌ Login فاشل → رسالة خطأ
- 🔑 Forgot Password → email برابط → reset password
- 🚪 Logout → حذف cookie


-------------------------------


## perfume

### customer *

```bash
User يدخل /perfumes
    ↓
Frontend يعمل fetch لـ /perfumes/api/v1
    ↓
Backend يرجع list + pagination
    ↓
Frontend يعرض العطور
    ↓
User يضغط على عطر
    ↓
يذهب لـ /perfumes/:id
    ↓
Frontend يعمل fetch لـ /perfumes/api/v1/:id
    ↓
يعرض التفاصيل + زر "Add to Cart"
```

### admin

```bash
Admin يدخل /perfumes/admin
    ↓
يشوف جدول العطور
    ↓
يضغط "إضافة" → /perfumes/admin/create
    ↓
يملأ الفورم + يرفع صورة
    ↓
POST /perfumes/api/v1
    ↓
Backend يحفظ في DB
```


--------------------------------------
## orders

### add to cart
```bash
Customer يضغط "Add to Cart"
    ↓
POST /orders/api/v1/add-to-cart
    ↓
Backend:
  1. يبحث عن order بـ status='cart' للمستخدم
  2. لو مش موجود → ينشئ order جديد
  3. يجيب سعر العطر من DB
  4. يعمل INSERT في order_items
     (ON DUPLICATE KEY UPDATE لو العطر موجود)
  5. يحدث total_amount في orders
    ↓
يرجع success + order_id
```

### تحديث السله

```bash
Customer يعدل كمية في /orders/cart
    ↓
PUT /orders/api/v1/update-item/:id
    ↓
Backend:
  1. يتحقق أن العنصر للمستخدم
  2. يحدث quantity + total_price
  3. يحدث total_amount في orders
```

### Checkout

```bash
Customer يضغط "Checkout"
    ↓
POST /orders/api/v1/checkout
    ↓
Backend:
  1. يتحقق السلة مش فاضية
  2. يغير order_status من 'cart' لـ 'pending_approval'
  3. يحفظ payment_method
    ↓
يرجع redirectUrl
    ↓
لو InstaPay → /orders/:id/upload-receipt
لو Paymob → يفتح Iframe
لو Cash → صفحة نجاح
```

### webhook (paymob)

```bash
Paymob يبعت POST لـ /orders/api/v1/webhook/paymob
    ↓
Backend:
  1. يتحقق من HMAC signature
  2. يبحث عن order بـ paymob_order_id
  3. لو نجح:
     - payment_status = 'approved'
     - order_status = 'processing'
     - يخصم stock_quantity من perfumes
  4. لو فشل:
     - payment_status = 'rejected'
     - order_status = 'cart' (يرجع سلة)
```

###  موافقة الأدمن (InstaPay/Cash):

```bash
Admin يشوف الطلب في /orders/admin
    ↓
يراجع إيصال الدفع
    ↓
يضغط "موافقة"
    ↓
PUT /orders/api/v1/admin/:id/approve
    ↓
Backend:
  1. payment_status = 'approved'
  2. order_status = 'processing'
  3. يخصم stock_quantity
```

------------------------------------

## reviews

### customer
```bash
Customer يدخل /perfumes/:id/reviews
    ↓
يشوف التقييمات (GET /reviews/api/v1/perfume/:id)
    ↓
يكتب تقييم جديد
    ↓
POST /reviews/api/v1
    ↓
Backend:
  1. يتحقق مش قيّم قبل كده (UNIQUE constraint)
  2. يحفظ التقييم
    ↓
يرجع success
```

### admin

```bash
Admin يشوف التقييمات
    ↓
يخفي/يحذف تقييم مخالف
    ↓
PUT /reviews/api/v1/admin/:id/status
أو DELETE /reviews/api/v1/admin/:id
```

---------------------------------

## users

### customer

```bash
Customer يدخل /users/profile
    ↓
يشوف بياناته (GET /users/api/v1/profile)
    ↓
يعدل بياناته
    ↓
PUT /users/api/v1/profile
    ↓
Backend يحدث البيانات
```

### admin

```bash
Admin يدخل /users/admin/users
    ↓
يشوف كل المستخدمين
    ↓
يغير دور مستخدم
    ↓
PUT /users/api/v1/admin/:id/role
    ↓
Backend:
  1. يتحقق الأدمن مش بيغير دوره هو
  2. يحدث role
```




===========================================

# 📊 2. عدد الصفحات (Pages Count)

## إجمالي الصفحات: 22 صفحة

```bash
|----|----------|--------------------|----------------------------|
|    |النوع     |الصفحة              |المسار                      |
|----|----------|--------------------|----------------------------|
|1   |Static    |الرئيسية            |/                           |
|2   |Static    |من نحن              |/about-us                   |
|3   |Static    |اتصل بنا            |/contact-us                 |
|4   |Static    |الأسئلة الشائعة     |/faq                        |
|5   |Static    |الخصوصية            |/privacy                    |
|6   |Static    |الشروط              |/terms                      |
|7   |Static    |الاسترجاع            |/refund                     |
|8   |Auth      |تسجيل الدخول        |/auth/login                 |
|9   |Auth      |التسجيل             |/auth/register              |
|10  |Auth      |نسيت كلمة المرور    |/auth/forgot-password       |
|11  |Auth      |إعادة التعيين       |/auth/reset-password/:token |
|12  |Shop      |قائمة العطور        |/perfumes                   |
|13  |Shop      |تفاصيل عطر          |/perfumes/:id               |
|14  |Shop      |تصنيف معين          |/categories/:slug           |
|15  |Shop      |تقييمات عطر         |/perfumes/:id/reviews       |
|16  |User      |الملف الشخصي        |/users/profile              |
|17  |User      |تعديل الملف         |/users/profile/edit         |
|18  |Orders    |السلة               |/orders/cart                |
|19  |Orders    |الدفع               |/orders/:id/payment         |
|20  |Orders    |رفع إيصال           |/orders/:id/upload-receipt  |
|21  |Orders    |سجل الطلبات         |/orders/profile/orders      |
|22  |Errors    |404 / 500           |  -                         |
|-----------------------------------------------------------------|
```
======================================================

# 3. وصف تفصيلي لكل صفحة

## الصفحات العامة (Static Pages)

1. الصفحة الرئيسية /
- مين يدخلها: الجميع (guest, customer, admin)
- الهدف: عرض العطور المميزة (Best Sellers) وأحدث الإضافات
- ماذا يفعل: يتصفح العطور، يضغط على عطر للتفاصيل، يسجل دخول
- الـ APIs المستخدمة: GET /perfumes/api/v1?is_best_seller=true

2. من نحن /about-us
- مين يدخلها: الجميع
- الهدف: تعريف بالمتجر ورسالته
- ماذا يفعل: يقرأ فقط (صفحة ثابتة)

3. اتصل بنا /contact-us
- مين يدخلها: الجميع
- الهدف: معلومات التواصل
- ماذا يفعل: يقرأ معلومات الاتصال

4. الأسئلة الشائعة /faq
- مين يدخلها: الجميع
- الهدف: الإجابة على الأسئلة المتكررة
- ماذا يفعل: يقرأ الأسئلة (Accordion)

5. الخصوصية/الشروط/الاسترجاع
- مين يدخلها: الجميع
- الهدف: معلومات قانونية
- ماذا يفعل: يقرأ فقط

## صفحات المصادقة (Auth Pages)
8. تسجيل الدخول /auth/login

- مين يدخلها: guest فقط (لو مسجل يتحول للرئيسية)
- الهدف: تسجيل الدخول
- ماذا يفعل: يدخل email + password → يحصل على JWT cookie
- الـ API: POST /auth/api/v1/login

9. التسجيل /auth/register

- مين يدخلها: guest فقط
- الهدف: إنشاء حساب جديد
- ماذا يفعل: يملأ الاسم، الإيميل، الهاتف، كلمة المرور
- الـ API: POST /auth/api/v1/register

10. نسيت كلمة المرور /auth/forgot-password

- مين يدخلها: guest
- الهدف: طلب رابط استعادة
- ماذا يفعل: يدخل إيميله → يستلم رابط على الإيميل
- الـ API: POST /auth/api/v1/forgot-password

11. إعادة التعيين /auth/reset-password/:token

- مين يدخلها: guest (عبر الرابط من الإيميل)
- الهدف: تعيين كلمة مرور جديدة
- ماذا يفعل: يدخل كلمة المرور الجديدة
- الـ API: POST /auth/api/v1/reset-password/:token

## 🛍️ صفحات المتجر (Shop Pages)
12. قائمة العطور /perfumes

- مين يدخلها: الجميع
- الهدف: تصفح كل العطور
- ماذا يفعل: 
-     يفلتر (ماركة، تصنيف، سعر، عائلة عطرية)
-     يبحث
-     يتصفح الصفحات (Pagination)
-     يضيف للسلة (لو مسجل)
- الـ APIs: GET /perfumes/api/v1 + GET /categories/api/v1 + GET /brands/api/v1

13. تفاصيل عطر /perfumes/:id

- مين يدخلها: الجميع
- الهدف: عرض تفاصيل عطر واحد
- ماذا يفعل:
-     يشوف الصور، الوصف، السعر، المخزون
-     يشوف آخر 3 تقييمات
-     يضيف للسلة (لو مسجل)
-     يذهب لصفحة التقييمات الكاملة
- الـ APIs: GET /perfumes/api/v1/:id + GET /reviews/api/v1/perfume/:id

14. تصنيف معين /categories/:slug

- مين يدخلها: الجميع
- الهدف: عرض عطور تصنيف محدد
- ماذا يفعل: نفس صفحة قائمة العطور لكن مفلتر على التصنيف
- الـ API: GET /perfumes/api/v1?category_id=X

15. تقييمات عطر /perfumes/:id/reviews

- مين يدخلها: الجميع (يشوف)، customer فقط (يضيف)
- الهدف: عرض كل التقييمات
- ماذا يفعل:
-     يشوف كل التقييمات
-     يضيف تقييم جديد (لو مسجل)
-     يعدل/يحذف تقييمه (لو صاحب التقييم)
- الـ APIs: GET /reviews/api/v1/perfume/:id + POST /reviews/api/v1

## 👤 صفحات المستخدم (User Pages)
16. الملف الشخصي /users/profile

- مين يدخلها: customer فقط
- الهدف: عرض بيانات المستخدم
- ماذا يفعل: يشوف بياناته، يذهب للتعديل، يشوف طلباته
- الـ API: GET /users/api/v1/profile

17. تعديل الملف /users/profile/edit

- مين يدخلها: customer فقط
- الهدف: تحديث البيانات
- ماذا يفعل: يعدل الاسم، الهاتف، العنوان، كلمة المرور
- الـ APIs: PUT /users/api/v1/profile + PUT /users/api/v1/change-password

21. سجل الطلبات /orders/profile/orders

- مين يدخلها: customer فقط
- الهدف: عرض الطلبات السابقة
- ماذا يفعل: يشوف حالة كل طلب وتفاصيله
- الـ API: GET /orders/api/v1/my-orders

## 🛒 صفحات الطلبات (Orders Pages)
18. السلة /orders/cart

- مين يدخلها: customer فقط
- الهدف: عرض محتويات السلة
- ماذا يفعل:
-     يشوف العناصر المضافة
-     يعدل الكميات
-     يحذف عناصر
-     يضغط "إتمام الشراء"
- الـ APIs: GET /orders/api/v1/my-orders?status=cart + PUT /orders/api/v1/update-item/:id + DELETE /orders/api/v1/remove-item/:id + POST /orders/api/v1/checkout

19. الدفع /orders/:id/payment

- مين يدخلها: customer (صاحب الطلب)
- الهدف: اختيار طريقة الدفع
- ماذا يفعل: يختار InstaPay/Paymob/Cash
- الـ API: POST /orders/api/v1/checkout

20. رفع إيصال /orders/:id/upload-receipt

- مين يدخلها: customer (صاحب الطلب بـ InstaPay)
- الهدف: رفع صورة التحويل
- ماذا يفعل: يرفع صورة الإيصال
- الـ API: POST /orders/api/v1/:id/upload-receipt

## 🔧 صفحات الأدمن (Admin Pages)
1. Admin Dashboard /admin/dashboard

- مين يدخلها: admin فقط
- الهدف: نظرة عامة على المتجر
- ماذا يفعل: يشوف إحصائيات (عدد الطلبات، المبيعات، المستخدمين)

2. إدارة العطور /perfumes/admin

- مين يدخلها: admin فقط
- الهدف: CRUD العطور
- ماذا يفعل: يضيف، يعدل، يحذف عطور
- الـ APIs: كل APIs العطور للأدمن

3. إدارة التصنيفات/الماركات

- مين يدخلها: admin فقط
- الهدف: CRUD التصنيفات والماركات

4. إدارة الطلبات /orders/admin

- مين يدخلها: admin فقط
- الهدف: مراجعة الطلبات
- ماذا يفعل:
-     يشوف كل الطلبات
-     يراجع إيصالات InstaPay
-     يوافق/يرفض الطلبات
-     يحدّث حالة الشحن
- الـ APIs: GET /orders/api/v1/admin/all + PUT /orders/api/v1/admin/:id/approve

5. إدارة المستخدمين /users/admin/users

- مين يدخلها: admin فقط
- الهدف: إدارة المستخدمين
- ماذا يفعل: يشوف المستخدمين، يغير أدوارهم
===========================================

# user flow

## guest
```bash
يدخل الموقع (/)
    ↓
يتصفح الصفحة الرئيسية (Best Sellers)
    ↓
يذهب لصفحات (About|      FAQ|        Privacy|       Terms|         Refund|         Contact)
    ↓
يذهب لـ /perfumes (قائمة العطور)
    ↓
يفلتر ويبحث
    ↓
يدخل على /perfumes/:id (تفاصيل عطر)
    ↓
يضغط "Add to Cart"
    ↓
⚠️ يظهر له "Please Login"
    ↓
يذهب لـ /auth/login
    ↓
يسجل دخول أو ينشئ حساب جديد
    ↓
يتحول لـ Customer Flow ↓
```

## customer

```bash

يسجل دخول (/auth/login)
    ↓
يدخل الموقع (/)
    ↓
يشوف: Login button → Profile button + Cart button
    ↓
يتصفح العطور (/perfumes)
    ↓
يدخل على عطر (/perfumes/:id)
    ↓
يضيف للسلة (Add to Order) ✅
    ↓
يذهب للسلة (/orders/cart)
    ↓
يعدل الكميات أو يحذف عناصر
    ↓
يضغط "Checkout"
    ↓
يختار طريقة الدفع:
    ├── InstaPay → يرفع إيصال (/orders/:id/upload-receipt)
    ├── Paymob → يدفع مباشرة (Iframe)
    └── Cash → يطلب عند الاستلام
    ↓
يذهب لـ /orders/profile/orders (سجل الطلبات)
    ↓
يشوف حالة طلبه (Pending/Processing/Shipped)
    ↓
يذهب لـ /users/profile
    ↓
يعدل بياناته أو كلمة المرور
    ↓
يذهب لـ /perfumes/:id/reviews
    ↓
يكتب تقييم على عطر اشتراه
    ↓
يسجل خروج (Logout)
```

## admin
```bash
يسجل دخول بحساب admin
    ↓
يدخل /admin/dashboard
    ↓
يشوف الإحصائيات
    ↓
يذهب لإدارة العطور (/perfumes/admin)
    ├── يضيف عطر جديد
    ├── يعدل عطر
    └── يحذف عطر (Soft Delete)
    ↓
يذهب لإدارة التصنيفات (/categories/admin)
    ├── يضيف تصنيف
    ├── يعدل تصنيف
    └── يحذف تصنيف
    ↓
يذهب لإدارة الماركات (/brands/admin)
    ├── يضيف ماركة
    ├── يعدل ماركة
    └── يحذف ماركة
    ↓
يذهب لإدارة الطلبات (/orders/admin)
    ├── يشوف كل الطلبات
    ├── يراجع إيصالات InstaPay
    ├── يوافق على طلب (يخصم المخزون)
    ├── يرفض طلب
    └── يحدّث حالة الشحن
    ↓
يذهب لإدارة المستخدمين (/users/admin/users)
    ├── يشوف المستخدمين
    └── يغير أدوارهم
    ↓
يذهب لإدارة التقييمات
    ├── يخفي تقييم مخالف
    └── يحذف تقييم
```


====================================


# Scenarios


## ✅ Scenario 1: شراء ناجح عبر Paymob


```bash
1. Customer يضيف عطور للسلة
2. يضغط Checkout → يختار Paymob
3. Backend يتكلم مع Paymob API → يأخذ payment_key
4. Frontend يفتح Iframe → العميل يدفع
5. Paymob يبعت Webhook → Backend يحدث الطلب + يخصم المخزون
6. Customer يشوف الطلب في سجله بحالة "Processing"
7. Admin يشوف الطلب ويحدّث الحالة لـ "Shipped"
```


## ✅ Scenario 2: شراء عبر InstaPay
```bash
1. Customer يضيف للسلة
2. Checkout → يختار InstaPay
3. Backend يغير الحالة لـ pending_approval
4. Customer يحوّل المبلغ ويرفع إيصال
5. Admin يراجع الإيصال ويوافق
6. Backend يخصم المخزون
```



## Scenario 3: فشل الدفع
```bash
1. Customer يحاول الدفع عبر Paymob
2. الدفع يفشل (رصيد غير كافٍ)
3. Webhook يرجع بـ success=false
4. Backend يرجع الطلب لحالة 'cart'
5. Customer يقدر يحاول تاني
```


## 🛑 Scenario 4: مخزون غير كافٍ
```bash
1. Customer يضيف عطر للسلة (مخزون = 5)
2. Customer آخر يشتري آخر 5 قطع
3. Customer الأول يحاول Checkout
4. Backend يرفض: "الكمية غير متوفرة"
5. Customer يعدل السلة
```


## ️ Scenario 5: سلة مهجورة (Cron Job)
```bash
1. Customer يضيف للسلة ويغادر الموقع
2. بعد 24 ساعة
3. Cron Job يشتغل (كل يوم 12 منتصف الليل)
4. يحذف كل orders بـ status='cart' عمرها > 24 ساعة
5. order_items تتمسح أوتوماتيك (CASCADE)
```


## Scenario 6: استعادة كلمة المرور
```bash
1. User ينسى كلمة المرور
2. يدخل /auth/forgot-password → يدخل إيميله
3. Backend يولد reset_token ويحفظه + expiry (ساعة)
4. يرسل إيميل بالرابط
5. User يضغط الرابط → /auth/reset-password/:token
6. يدخل كلمة مرور جديدة
7. Backend يتحقق من الرمز + الصلاحية → يحدث كلمة المرور
```

## ⚔️ Scenario 7: Admin يغير دور User
```bash
1. Admin يدخل /users/admin/users
2. يضغط "تغيير دور" على مستخدم
3. Backend يتحقق:
   - الأدمن مش بيغير دوره هو (أمان)
   - الدور الجديد valid (admin/customer)
4. يحدث role في DB
5. لو المستخدم كان online → الـ JWT القديم لسه شغال
   (يفضل نفس الدور لحد ما يعمل logout/login)
```

=========================

# 🏗️ 7. هيكل المشروع النهائي

```bash
um-al-qura-perfumes/
├── config/
│   ├── omElqura.pdf
│   ├── server-config.js
│   └── data-source.js          # TypeORM DataSource
├── logicModels/                # Controllers (Business Logic)
│   ├── auth/
│   │   ├── auth.controller.js
│   │   └── auth.render.js
│   ├── users/
│   │   ├── users.controller.js
│   │   └── users.render.js
│   ├── categories/
│   ├── brands/
│   ├── perfumes/
│   ├── orders/
│   ├── reviews/
│   ├── static/
│   └── errors/
├── middleware/
│   ├── auth.js       # JWT verification
│   ├── roles.js       # Admin check
│   ├── validate.js             # Joi validation wrapper
│   └── upload.js     # Multer
├── models/                     # TypeORM Entities
│   ├── User.entity.js
│   ├── Perfume.entity.js
│   ├── Order.entity.js
│   ├── OrderItem.entity.js
│   ├── Category.entity.js
│   ├── Brand.entity.js
│   └── Review.entity.js
├── routes/
│   ├── auth/
│   │   ├── index.js
│   │   ├── auth.apis.js
│   │   └── auth.render.js
│   ├── users/
│   ├── categories/
│   ├── brands/
│   ├── perfumes/
│   ├── orders/
│   ├── reviews/
│   ├── static/
│   ├── errors/
│   └── index.js
├── utils/
│   ├── catchError.js           # Error wrapper
│   ├── checkLogin.js           # User state for renders
│   ├── remove_password.js
│   ├── mailer.js
│   └── cronJobs.js
│   └── validation.js           # Joi schemas
├── views/
│   ├── partials/
│   │   ├── header.ejs
│   │   ├── footer.ejs
│   │   └── navbar.ejs
│   ├── auth/
│   ├── shop/
│   ├── user/
│   ├── admin/
│   ├── checkout/
│   ├── static/
│   └── errors/
├── public/
│   ├──assests 
│   │  ├── css/
│   │  ├── js/
│   │  └── images/
│   └── uploads/
├── .env
├── server.js
└── README.md
```

=================================

# 📝 8. ملاحظات تقنية مهمة
## 🔒 الأمان:

    JWT في HTTP-Only Cookies (مقاوم لـ XSS)
    Bcrypt لكلمات المرور (10 rounds)
    HMAC verification للـ Webhook
    Validation بـ Joi لكل المدخلات
    SQL Injection محمي عبر TypeORM + Parameterized Queries

## 💾 قاعدة البيانات:

    Soft Delete للمنتجات (is_active)
    CASCADE للحذف في order_items و reviews
    RESTRICT لحذف brands/categories لو فيها منتجات
    UNIQUE constraints لمنع التكرار

## ⚡ الأداء:

    Connection Pool لـ MySQL
    Indexes على الأعمدة المستخدمة في الفلترة
    Pagination لكل الـ lists
    Raw SQL للعمليات المعقدة (Transactions)

##  Frontend:

    EJS للـ SSR
    Fetch API للـ AJAX calls
    Bootstrap للتصميم
    RTL support للعربية

======================

# 9. Checklist للإطلاق (Launch Checklist)

-   جميع الـ APIs تعمل وتُرجع JSON صحيح
-   جميع الـ Renders تعرض الصفحات بشكل صحيح
-   checkLogin يمرر حالة المستخدم لكل Render
-   catchError يمسك الأخطاء ويعرض 500
-   authMiddleware يحمي الـ routes المطلوبة
-   roleMiddleware يمنع غير الأدمن من لوحة التحكم
-   Validation يعمل على كل المدخلات
-   Transactions تعمل في العمليات المالية
-   Webhook Paymob يستقبل ويحدث الطلبات
-   Cron Job ينظف السلات المهجورة
-   رفع الصور يعمل (Multer)
-   JWT Cookies تُحفظ وتُقرأ بشكل صحيح
-   صفحات 404 و 500 تعمل
-   التصميم RTL ومتجاوب (Responsive)