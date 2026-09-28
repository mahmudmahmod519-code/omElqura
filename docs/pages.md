
# pages

## 📌 Template لكل صفحة:

```bash
PAGE: [اسم الصفحة]
PATH: [المسار]
ROLE: [مين يدخلها]
PURPOSE: [الهدف]
STATE: [checkLogin data]
APIS: [الـ APIs المستخدمة]
UI COMPONENTS: [المكونات]
STATES: [loading/empty/error/success]
ACTIONS: [الإجراءات المتاحة]
REDIRECTS: [التوجيهات]
```


-------


### الصفحه الرأيسيه
```bash
PAGE: Home Page
PATH: /
ROLE: * (الجميع)
PURPOSE: عرض العطور المميزة وأحدث الإضافات
STATE: { currentUser, login, status }
APIS: 
  - GET /perfumes/api/v1?is_best_seller=true&limit=6
  - GET /perfumes/api/v1?sort_by=created_at&limit=8
UI COMPONENTS:
  - Hero section مع CTA
  - Best Sellers grid
  - Latest perfumes grid
  - Features section (شحن، أصالة، استرجاع)
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


### من نحن
```bash
PAGE: About Us
PATH: /about-us
ROLE: *
PURPOSE: تعريف بالمتجر ورسالته
STATE: { currentUser, login, status }
APIS: لا يوجد (صفحة ثابتة)
UI COMPONENTS:
  - قصة المتجر
  - الرسالة والرؤية
  - لماذا نحن (مميزات)
UI: نص + أيقونات
ACTIONS: لا يوجد
```


### اتصل بنا

```bash
PAGE: Contact Us
PATH: /contact-us
ROLE: *
PURPOSE: معلومات التواصل
STATE: { currentUser, login, status }
APIS: لا يوجد
UI COMPONENTS:
  - معلومات الاتصال (إيميل، هاتف، عنوان)
  - أوقات العمل
  - روابط السوشيال ميديا
ACTIONS: لا يوجد
```


### الاسأله الشائعه

```bash
PAGE: FAQ
PATH: /faq
ROLE: *
PURPOSE: الإجابة على الأسئلة المتكررة
STATE: { currentUser, login, status }
APIS: لا يوجد
UI COMPONENTS:
  - Accordion مع الأسئلة والأجوبة
ACTIONS: فتح/غلق الأسئلة
```

========================================

## 5-7. Privacy / Terms / Refund


```bash
PAGE: [Privacy/Terms/Refund]
PATH: /[privacy/terms/refund]
ROLE: *
PURPOSE: معلومات قانونية
STATE: { currentUser, login, status }
APIS: لا يوجد
UI COMPONENTS: نص منسق
ACTIONS: لا يوجد
```

------------------

### تسجيل الدخول

```bash
PAGE: Login
PATH: /auth/login
ROLE: guest فقط
PURPOSE: تسجيل دخول المستخدم
STATE: { currentUser: undefined, login: false, status: 'success' }
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



### التسجيل

```bash
PAGE: Register
PATH: /auth/register
ROLE: guest فقط
PURPOSE: إنشاء حساب جديد
STATE: { currentUser: undefined, login: false }
APIS: POST /auth/api/v1/register
UI COMPONENTS:
  - Form: name, email, phone, password, password_confirmation
  - Submit button
  - Link: "لديك حساب؟ سجل دخول"
STATES: idle/loading/error/success
ACTIONS: Submit → إنشاء حساب → حفظ cookie → redirect
REDIRECTS: / (عند النجاح)
```


## نسيت كلمة المرور

```bash
PAGE: Forgot Password
PATH: /auth/forgot-password
ROLE: guest
PURPOSE: طلب رابط استعادة
STATE: { currentUser: undefined, login: false }
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



##  إعادة تعيين كلمة المرور

```bash
PAGE: Reset Password
PATH: /auth/reset-password/:token
ROLE: guest
PURPOSE: تعيين كلمة مرور جديدة
STATE: { currentUser: undefined, login: false, token: req.params.token }
APIS: POST /auth/api/v1/reset-password/:token
UI COMPONENTS:
  - Form: new_password, confirm_password
  - Submit button
STATES: idle/loading/error/success
REDIRECTS: /auth/login (عند النجاح)
```



## قائمة العطور

```bash
PAGE: Perfumes List
PATH: /perfumes
ROLE: *
PURPOSE: تصفح كل العطور مع الفلترة
STATE: { currentUser, login, status }
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


## تفاصيل عطر

```bash
PAGE: Perfume Details
PATH: /perfumes/:id
ROLE: *
PURPOSE: عرض تفاصيل عطر واحد
STATE: { currentUser, login, status, perfumeId: req.params.id }
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


## تصنيف معين

```bash
PAGE: Category Products
PATH: /categories/:slug
ROLE: *
PURPOSE: عرض عطور تصنيف محدد
STATE: { currentUser, login, status, categorySlug: req.params.slug }
APIS:
  - GET /categories/api/v1 (للحصول على category_id من slug)
  - GET /perfumes/api/v1?category_id=X
UI COMPONENTS: نفس قائمة العطور لكن مفلتر
ACTIONS: نفس قائمة العطور
```


## تقييمات عطر

```bash
PAGE: Perfume Reviews
PATH: /perfumes/:id/reviews
ROLE: * (يشوف)، customer (يضيف)
PURPOSE: عرض كل التقييمات
STATE: { currentUser, login, status, perfumeId: req.params.id }
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



## الملف الشخصي

```bash
PAGE: User Profile
PATH: /users/profile
ROLE: customer فقط
PURPOSE: عرض بيانات المستخدم
STATE: { currentUser, login: true, status }
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


##  تعديل الملف الشخصي

```bash
PAGE: Edit Profile
PATH: /users/profile/edit
ROLE: customer فقط
PURPOSE: تحديث البيانات
STATE: { currentUser, login: true }
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



## السلة

```bash
PAGE: Cart
PATH: /orders/cart
ROLE: customer فقط
PURPOSE: عرض محتويات السلة
STATE: { currentUser, login: true }
APIS:
  - GET /orders/api/v1/my-orders?status=cart (أو API مخصص للسلة)
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


## الدفع

```bash
PAGE: Payment
PATH: /orders/:id/payment
ROLE: customer (صاحب الطلب)
PURPOSE: اختيار طريقة الدفع
STATE: { currentUser, login: true, orderId: req.params.id }
APIS: POST /orders/api/v1/checkout
UI COMPONENTS:
  - Order summary
  - Payment method selection (InstaPay/Paymob/Cash)
  - Paymob Iframe (لو اختار Paymob)
  - Submit button
STATES: idle/loading/success/error
ACTIONS: اختيار طريقة دفع → POST → redirect
```


## رفع إيصال الدفع

```bash
PAGE: Upload Receipt
PATH: /orders/:id/upload-receipt
ROLE: customer (صاحب الطلب بـ InstaPay)
PURPOSE: رفع صورة التحويل
STATE: { currentUser, login: true, orderId: req.params.id }
APIS: POST /orders/api/v1/:id/upload-receipt
UI COMPONENTS:
  - Order info
  - InstaPay instructions (merchant handle)
  - File upload input
  - Submit button
STATES: idle/loading/success/error
REDIRECTS: /orders/profile/orders (عند النجاح)
```



##  سجل الطلبات

```bash
PAGE: Order History
PATH: /orders/profile/orders
ROLE: customer فقط
PURPOSE: عرض الطلبات السابقة
STATE: { currentUser, login: true }
APIS: GET /orders/api/v1/my-orders
UI COMPONENTS:
  - Orders list (رقم الطلب، التاريخ، المبلغ، الحالة، طريقة الدفع)
  - Order details expandable
  - Status badges (pending/processing/shipped/delivered/cancelled)
STATES: loading/empty/error/success
ACTIONS: عرض التفاصيل
```

## . إدارة العطور (أدمن)
```bash
PAGE: Admin Perfumes
PATH: /perfumes/admin
ROLE: admin فقط
PURPOSE: CRUD العطور
STATE: { currentUser: admin, login: true }
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

## إدارة التصنيفات والماركات
```bash
PAGE: Admin Categories/Brands
PATH: /categories/admin أو /brands/admin
ROLE: admin فقط
PURPOSE: CRUD التصنيفات/الماركات
STATE: { currentUser: admin, login: true }
APIS: GET/POST/PUT/DELETE للـ categories أو brands
UI COMPONENTS:
  - Table مع الأعمدة المناسبة
  - Add/Edit forms (modal أو page)
  - Delete confirmation
ACTIONS: CRUD كامل
```

## إدارة الطلبات
```bash
PAGE: Admin Orders
PATH: /orders/admin
ROLE: admin فقط
PURPOSE: مراجعة وإدارة الطلبات
STATE: { currentUser: admin, login: true }
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

##  إدارة المستخدمين
```bash
PAGE: Admin Users
PATH: /users/admin/users
ROLE: admin فقط
PURPOSE: إدارة المستخدمين
STATE: { currentUser: admin, login: true }
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

## لوحة التحكم
```bash
PAGE: Admin Dashboard
PATH: /admin/dashboard
ROLE: admin فقط
PURPOSE: نظرة عامة على المتجر
STATE: { currentUser: admin, login: true }
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

## صفحات الأخطاء
```bash
PAGE: 404 Not Found
PATH: * (catch-all)
ROLE: *
PURPOSE: صفحة غير موجودة
STATE: { currentUser, login, status }
UI COMPONENTS:
  - "404" كبير
  - "الصفحة غير موجودة"
  - زر العودة للرئيسية
ACTIONS: العودة للرئيسية

PAGE: 500 Server Error
PATH: error handler
ROLE: *
PURPOSE: خطأ في السيرفر
STATE: { currentUser, login, status, message }
UI COMPONENTS:
  - "500" كبير
  - "خطأ في السيرفر"
  - تفاصيل الخطأ (في development فقط)
  - زر العودة للرئيسية
ACTIONS: العودة للرئيسية
```
