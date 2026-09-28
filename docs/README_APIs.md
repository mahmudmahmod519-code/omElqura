# 📜 توثيق واجهات البرمجة (APIs) والصفحات (### Renders) - عطور أم القرى

هذا المستند يوثق جميع نقاط النهاية (Endpoints) والصفحات المعروضة (Server-Side ### Rendering) في المنصة.

---

## 🔐 1. المصادقة (Auth)

### API
#### http method: POST
#### name: register
#### role: guest
#### desciption by arabic: إنشاء حساب مستخدم جديد (عميل) وحفظ البيانات مشفرة في قاعدة البيانات.
--------

### API
#### http method: POST
#### name: login
#### role: guest
#### desciption by arabic: تسجيل دخول المستخدم، التحقق من البيانات، وإصدار JWT في HTTP-Only Cookie.
--------

### API
#### http method: POST
#### name: logout
#### role: *
#### desciption by arabic: تسجيل خروج المستخدم وحذف الـ Cookie الخاص بالجلسة.
--------

### API
#### http method: POST
#### name: forgotPassword
#### role: guest
#### desciption by arabic: استقبال البريد الإلكتروني، توليد رمز استعادة (Token)، وإرساله عبر البريد الإلكتروني.
--------

### API
#### http method: POST
#### name: resetPassword
#### role: guest
#### desciption by arabic: التحقق من رمز الاستعادة وتحديث كلمة المرور الجديدة في قاعدة البيانات.
--------

### RENDER
#### page: /auth/login
#### name: login_render
#### role: guest
#### description: صفحة تسجيل الدخول تحتوي على حقول البريد وكلمة المرور ورابط "نسيت كلمة المرور" و "إنشاء حساب".
---------

### RENDER
#### page: /auth/register
#### name: register_render
#### role: guest
#### description: صفحة إنشاء حساب جديد تحتوي على حقول الاسم، البريد، الهاتف، وكلمة المرور.
---------

### RENDER
#### page: /auth/forgot-password
#### name: forgot_password_render
#### role: guest
#### description: صفحة إدخال البريد الإلكتروني لاستلام رابط استعادة كلمة المرور.
---------

### RENDER
#### page: /auth/reset-password/:token
#### name: reset_password_render
#### role: guest
#### description: صفحة إدخال كلمة المرور الجديدة وتأكيدها بعد التحقق من الرمز.
---------

---

## 👤 2. المستخدمين (Users)

### API
#### http method: GET
#### name: getUsers
#### role: admin
#### desciption by arabic: جلب قائمة بجميع المستخدمين المسجلين في النظام مع إمكانية البحث والفلترة.
--------

### API
#### http method: PUT
#### name: updateUserRole
#### role: admin
#### desciption by arabic: تغيير دور مستخدم معين (من customer إلى admin أو العكس).
--------

### API
#### http method: GET
#### name: getProfile
#### role: customer
#### desciption by arabic: جلب بيانات الملف الشخصي للمستخدم الحالي المسجل دخوله.
--------

### API
#### http method: PUT
#### name: updateProfile
#### role: customer
#### desciption by arabic: تحديث بيانات المستخدم (الاسم، رقم الهاتف، العنوان).
--------

### API
#### http method: PUT
#### name: changePassword
#### role: customer
#### desciption by arabic: تغيير كلمة المرور الحالية بعد التحقق من كلمة المرور القديمة.
--------

### RENDER
#### page: /profile
#### name: userProfile_render
#### role: customer
#### description: صفحة الملف الشخصي تعرض بيانات المستخدم الحالية وزر لتعديل البيانات وسجل الطلبات.
---------

### RENDER
#### page: /profile/edit
#### name: editProfile_render
#### role: customer
#### description: صفحة نموذج (Form) لتعديل الاسم، رقم الهاتف، والعنوان.
---------

### RENDER
#### page: /admin/users
#### name: admin_users_render
#### role: admin
#### description: صفحة لوحة تحكم الإدارة لعرض جدول جميع المستخدمين مع أزرار لتعديل الأدوار أو الحظر.
---------

---

## 🏷️ 3. التصنيفات والماركات (Categories & Brands)

### API
#### http method: GET
#### name: getCategories
#### role: *
#### desciption by arabic: جلب جميع التصنيفات (بما في ذلك التصنيفات الفرعية) لعرضها في القوائم.
--------

### API
#### http method: POST
#### name: createCategory
#### role: admin
#### desciption by arabic: إضافة تصنيف جديد (اسم، slug، وتصنيف أب اختياري).
--------

### API
#### http method: PUT
#### name: updateCategory
#### role: admin
#### desciption by arabic: تحديث بيانات تصنيف موجود.
--------

### API
#### http method: DELETE
#### name: deleteCategory
#### role: admin
#### desciption by arabic: حذف تصنيف (سيتم تعيين parent_id للأبناء إلى NULL بسبب قيود قاعدة البيانات).
--------

*(نفس الـ ### APIs السابقة تنطبق على Brands مع استبدال Category بـ Brand)*

### RENDER
#### page: /categories/:slug
#### name: category_products_render
#### role: *
#### description: صفحة تعرض جميع العطور التابعة لتصنيف معين مع أدوات الفلترة (السعر، الماركة).
---------

### RENDER
#### page: /admin/categories
#### name: admin_categories_render
#### role: admin
#### description: صفحة إدارة التصنيفات والماركات (إضافة، تعديل، حذف).
---------

---

## 🧴 4. العطور (Perfumes)

### API
#### http method: GET
#### name: getPerfumes
#### role: *
#### desciption by arabic: جلب قائمة العطور مع دعم البحث النصي، الفلترة (حسب السعر، الماركة، العائلة العطرية)، والترقيم (Pagination).
--------

### API
#### http method: GET
#### name: getPerfumeById
#### role: *
#### desciption by arabic: جلب تفاصيل عطر واحد محدد بواسطة الـ ID الخاص به، بما في ذلك متوسط التقييمات.
--------

### API
#### http method: POST
#### name: createPerfume
#### role: admin
#### desciption by arabic: إضافة عطر جديد إلى المتجر مع تحديد الماركة، التصنيف، السعر، والمخزون.
--------

### API
#### http method: PUT
#### name: updatePerfume
#### role: admin
#### desciption by arabic: تحديث بيانات عطر موجود (السعر، المخزون، الوصف، إلخ).
--------

### API
#### http method: DELETE
#### name: deletePerfume
#### role: admin
#### desciption by arabic: حذف عطر من المتجر (Soft Delete عبر تغيير is_active إلى false).
--------

### RENDER
#### page: /products
#### name: perfumes_list_render
#### role: *
#### description: الصفحة الرئيسية لعرض جميع العطور مع شريط جانبي للفلترة وأزرار الترقيم.
---------

### RENDER
#### page: /products/:id
#### name: perfume_details_render
#### role: *
#### description: صفحة تفاصيل العطر الواحد، تعرض الصور، الوصف، النوتات العطرية، السعر، زر "إضافة للسلة"، وأحدث 3 تقييمات.
---------

### RENDER
#### page: /admin/products
#### name: admin_perfumes_render
#### role: admin
#### description: صفحة لوحة التحكم لإدارة المنتجات (عرض جدول، إضافة، تعديل، حذف).
---------

---

## 🛒 5. الطلبات والسلة (Orders & Cart)

### API
#### http method: POST
#### name: addToOrder
#### role: customer
#### desciption by arabic: إضافة عطر إلى سلة المشتريات (ينشئ order بحالة 'cart' إذا لم يوجد، أو يزداد الكمية إذا كان العطر موجوداً).
--------

### API
#### http method: PUT
#### name: updateOrderItem
#### role: customer
#### desciption by arabic: تحديث كمية عطر معين داخل السلة الحالية أو حذفه.
--------

### API
#### http method: POST
#### name: checkout
#### role: customer
#### desciption by arabic: تحويل حالة السلة من 'cart' إلى 'pending_approval' وبدء عملية الدفع (InstaPay, Paymob, أو Cash).
--------

### API
#### http method: POST
#### name: uploadReceipt
#### role: customer
#### desciption by arabic: رفع صورة إيصال الدفع اليدوي (مخصص لطلبات InstaPay).
--------

### API
#### http method: GET
#### name: getMyOrders
#### role: customer
#### desciption by arabic: جلب سجل جميع الطلبات السابقة للمستخدم الحالي مع تفاصيل كل طلب.
--------

### API
#### http method: GET
#### name: getAllOrders
#### role: admin
#### desciption by arabic: جلب جميع طلبات العملاء في النظام للمراجعة والمتابعة.
--------

### API
#### http method: PUT
#### name: approveOrder
#### role: admin
#### desciption by arabic: موافقة الأدمن على الطلب (يدوياً لـ Cash/InstaPay)، مما يغير الحالة إلى 'processing' ويخصم الكمية من المخزون.
--------

### API
#### http method: POST
#### name: paymobWebhook
#### role: system
#### desciption by arabic: استقبال إشعار تلقائي من Paymob لتحديث حالة الدفع وخصم المخزون أوتوماتيكياً عند نجاح العملية.
--------

### RENDER
#### page: /cart
#### name: cart_render
#### role: customer
#### description: صفحة سلة المشتريات تعرض العناصر المضافة، إمكانية تعديل الكميات، والمبلغ الإجمالي مع زر "إتمام الشراء".
---------

### RENDER
#### page: /orders/:id/payment
#### name: payment_render
#### role: customer
#### description: صفحة اختيار طريقة الدفع وعرض تعليمات InstaPay أو زر الدفع عبر Paymob.
---------

### RENDER
#### page: /orders/:id/upload-receipt
#### name: upload_receipt_render
#### role: customer
#### description: صفحة مخصصة لرفع صورة تحويل InstaPay كإثبات للدفع.
---------

### RENDER
#### page: /profile/orders
#### name: order_history_render
#### role: customer
#### description: صفحة سجل الطلبات تعرض حالة كل طلب (قيد المراجعة، تم الشحن، إلخ).
---------

### RENDER
#### page: /admin/orders
#### name: admin_orders_render
#### role: admin
#### description: صفحة لوحة التحكم لعرض جميع الطلبات، مراجعة إيصالات الدفع، وأزرار الموافقة أو الرفض.
---------

---

## ⭐ 6. التقييمات (Reviews)

### API
#### http method: POST
#### name: createReview
#### role: customer
#### desciption by arabic: إضافة تقييم جديد (من 1 إلى 5 نجوم) وتعليق على عطر معين.
--------

### API
#### http method: GET
#### name: getPerfumeReviews
#### role: *
#### desciption by arabic: جلب جميع التقييمات المعتمدة لعطر محدد.
--------

### API
#### http method: PUT
#### name: updateReviewStatus
#### role: admin
#### desciption by arabic: الموافقة على تقييم أو إخفاؤه (is_approved) من قبل الإدارة.
--------

### API
#### http method: DELETE
#### name: deleteReview
#### role: admin
#### desciption by arabic: حذف تقييم مخالف نهائياً من قاعدة البيانات.
--------

### RENDER
#### page: /products/:id/reviews
#### name: reviews_render
#### role: *
#### description: صفحة تعرض كل تقييمات عطر معين مع إمكانية إضافة تقييم جديد للمستخدمين المسجلين.
---------

---

## 🏠 7. الصفحات العامة (Static Pages)

### RENDER
#### page: /
#### name: home_render
#### role: *
#### description: الصفحة الرئيسية للموقع، تعرض العطور المميزة (Best Sellers) وأحدث الإضافات مع شريط بحث سريع.
---------

### RENDER
#### page: /about-us
#### name: about_render
#### role: *
#### description: صفحة "من نحن" تعرض قصة المتجر ورسالته.
---------

### RENDER
#### page: /contact-us
#### name: contact_render
#### role: *
#### description: صفحة "اتصل بنا" تحتوي على نموذج تواصل ومعلومات المتجر.
---------

### RENDER
#### page: /faq
#### name: faq_render
#### role: *
#### description: صفحة الأسئلة الشائعة حول الشحن، الدفع، والمنتجات.
---------

### RENDER
#### page: /privacy
#### name: privacy_render
#### role: *
#### description: صفحة سياسة الخصوصية.
---------

### RENDER
#### page: /terms
#### name: terms_render
#### role: *
#### description: صفحة الشروط والأحكام.
---------

### RENDER
#### page: /refund
#### name: refund_render
#### role: *
#### description: صفحة سياسة الاستبدال والاسترجاع.
---------
