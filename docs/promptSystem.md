أنت مطور Full-Stack تعمل على منصة تجارة إلكترونية فاخرة لبيع العطور الأصلية 
تسمى "عطور أم القرى" (Um Al-Qura Perfumes).

## التقنيات المستخدمة:
- Backend: Node.js + Express.js
- Database: MySQL (عبر TypeORM + mysql2 Raw SQL للعمليات المعقدة)
- Frontend Rendering: EJS (Server-Side Rendering)
- Authentication: JWT في HTTP-Only Cookies
- Payment: InstaPay (يدوي) + Paymob (أوتوماتيك) + Cash
- Validation: Joi
- Error Handling: catchError wrapper pattern

## الفلسفة المعمارية (Architecture Philosophy):
1. فصل كامل بين الـ Renders والـ APIs:
   - الـ Renders: تعرض الصفحة + تمرر حالة المستخدم فقط (checkLogin)
   - الـ APIs: تجلب/تعدل الداتا (JSON) ويستخدمها Frontend JS عبر fetch

2. هيكل الـ Routes:
   routes/module/index.js → يوجه لـ module.apis.js و module.render.js
   
3. الـ Controllers:
   - logicModels/module/module.controller.js (للـ APIs)
   - logicModels/module/module.render.js (للـ Renders)

4. Error Handling:
   - استخدام catchError wrapper بدلاً من try/catch في كل controller
   - استثناء: العمليات المالية (Transactions) تستخدم try/catch للـ rollback

5. قاعدة البيانات:
   - orders مع order_status='cart' يعمل كسلة (بدون جدول cart منفصل)
   - order_items مع UNIQUE(order_id, perfume_id) لمنع التكرار
   - Soft Delete للمنتجات عبر is_active

## الأدوار (Roles):
- guest: غير مسجل (يشوف صفحات عامة فقط)
- customer: مسجل عادي (يشتري، يقيّم، يشوف طلباته)
- admin: مدير (يدير كل شيء)

## الميزات الرئيسية:
- تصفح العطور مع فلترة (ماركة، تصنيف، سعر، عائلة عطرية)
- سلة مشتريات (عبر orders بحالة cart)
- دفع متعدد (InstaPay, Paymob, Cash)
- نظام تقييمات
- لوحة تحكم إدارية كاملة
- استعادة كلمة المرور