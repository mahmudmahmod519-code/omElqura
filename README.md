# عطور أم القرى (Um Al-Qura Perfumes)

منصة تجارة إلكترونية فاخرة متخصصة في بيع العطور الأصلية، مبنية بهندسة **Server-Side Rendering (SSR)** باستخدام **Node.js** و**Express.js** و**EJS**. تهدف المنصة إلى تقديم تجربة شراء سلسة وأنيقة مع نظام إدارة متكامل للإدارة والمستخدمين، مع التركيز على الأمان وسهولة الاستخدام.

---

## 📋 جدول المحتويات

- [الميزات](#-الميزات)
- [هيكل قاعدة البيانات](#-هيكل-قاعدة-البيانات--mysql)
- [الـ Middlewares](#-الـ-middlewares)
- [الأدوات المساعدة (Utilities)](#-الأدوات-المساعدة-utilities)
- [هيكل مجلدات الـ Views (EJS)](#-هيكل-مجلدات-الـ-views-ejs)
- [المسارات وواجهات الـ API](#-المسارات-وواجهات-الـ-api)
- [متغيرات البيئة](#-متغيرات-البيئة-envexample)
- [التثبيت والتشغيل](#-التثبيت-والتشغيل)

---

## 🚀 الميزات

### الميزات الحالية (مرحلة MVP)

- **المصادقة وإدارة الجلسات**
  - تسجيل حساب جديد (Signup)
  - تسجيل الدخول (Signin)
  - استعادة كلمة المرور (Password Reset Flow) باستخدام JWT وCookies من نوع HTTP-Only
  - تشفير كلمات المرور باستخدام Bcrypt

- **تصفح المنتجات والفلترة**
  - البحث النصي عن المنتجات
  - التصفية حسب الفئة (Category)
  - فلترة حسب نطاق السعر (Min / Max Price)
  - نظام التصفح بالصفحات (Pagination)

- **نظام الشراء المباشر لمنتج واحد عبر InstaPay**
  - إنشاء رابط دفع InstaPay
  - عرض معرف التاجر (Merchant Handle)
  - رفع صورة إيصال الدفع (Payment Receipt Screenshot)

- **لوحة تحكم الإدارة (Admin Dashboard)**
  - إدارة المنتجات (إضافة، تعديل، حذف)
  - إدارة المستخدمين والأدوار (Admin / Customer)
  - تتبع المبيعات والمنتجات الأكثر مبيعًا

- **بوابة الملف الشخصي للمستخدم**
  - تعديل البيانات الشخصية والعنوان
  - عرض سجل الطلبات السابقة

### 🔮 الميزات القادمة (المرحلة الثانية)

- نظام سلة التسوق متعددة المنتجات (Multi-Item Shopping Cart)
- دمج بوابة دفع آلية (Paymob لبطاقات الائتمان والمحافظ الإلكترونية)
- مساعد ذكي (AI Chatbot) لتوصيات العطور
- محرك جدولة المهام والرسائل التسويقية (Cron Jobs + Email Marketing) للنشرات البريدية وتحديثات المخزون

---

## 🗄️ هيكل قاعدة البيانات (MySQL)

### جدول `users`

| العمود        | النوع          | الوصف                              |
|---------------|----------------|------------------------------------|
| `id`          | INT (PK)       | المعرف الفريد                      |
| `name`        | VARCHAR(100)   | الاسم الكامل                       |
| `email`       | VARCHAR(150)   | البريد الإلكتروني (Unique)         |
| `password`    | VARCHAR(255)   | كلمة المرور المشفرة (Bcrypt)       |
| `phone`       | VARCHAR(20)    | رقم الهاتف                         |
| `address`     | TEXT           | العنوان                            |
| `role`        | ENUM           | الدور: `admin` أو `customer`       |
| `reset_token` | VARCHAR(255)   | رمز استعادة كلمة المرور            |
| `created_at`  | TIMESTAMP      | تاريخ الإنشاء                      |

### جدول `categories`

| العمود   | النوع          | الوصف                    |
|----------|----------------|--------------------------|
| `id`     | INT (PK)       | المعرف الفريد            |
| `name`   | VARCHAR(100)   | اسم الفئة                |
| `slug`   | VARCHAR(100)   | المعرف النصي للفئة       |

### جدول `products`

| العمود           | النوع          | الوصف                              |
|------------------|----------------|------------------------------------|
| `id`             | INT (PK)       | المعرف الفريد                      |
| `category_id`    | INT (FK)       | معرف الفئة                         |
| `name`           | VARCHAR(150)   | اسم المنتج                         |
| `description`    | TEXT           | وصف المنتج                         |
| `price`          | DECIMAL(10,2)  | السعر                              |
| `image_url`      | VARCHAR(255)   | رابط صورة المنتج                   |
| `is_in_stock`    | BOOLEAN        | حالة التوفر                        |
| `is_best_seller` | BOOLEAN        | هل هو من الأكثر مبيعًا             |
| `created_at`     | TIMESTAMP      | تاريخ الإضافة                      |

### جدول `orders`

| العمود           | النوع          | الوصف                                      |
|------------------|----------------|--------------------------------------------|
| `id`             | INT (PK)       | المعرف الفريد                              |
| `user_id`        | INT (FK)       | معرف المستخدم                              |
| `product_id`     | INT (FK)       | معرف المنتج                                |
| `total_amount`   | DECIMAL(10,2)  | المبلغ الإجمالي                            |
| `payment_status` | ENUM           | حالة الدفع: `pending` / `approved` / `rejected` |
| `payment_proof`  | VARCHAR(255)   | مسار صورة إيصال الدفع                      |
| `created_at`     | TIMESTAMP      | تاريخ الطلب                                |

---

## 🛡️ الـ Middlewares

| الملف                  | الوظيفة                                                                 |
|------------------------|-------------------------------------------------------------------------|
| `authMiddleware.js`    | التحقق من صحة JWT الموجود في الـ HTTP-Only Cookie، وإرفاق بيانات المستخدم بـ `req.user` |
| `roleMiddleware.js`    | التحكم في الوصول حسب الدور (`isAdmin`) — يمنع المستخدمين غير المصرح لهم من الوصول إلى مسارات الإدارة |
| `uploadMiddleware.js`  | إعداد Multer لرفع الصور (صور المنتجات وإيصالات الدفع) مع تحديد أنواع الملفات المسموح بها والحدود |
| `errorHandler.js`      | معالج أخطاء عام يلتقط الاستثناءات ويعرض صفحات أخطاء مناسبة (بما في ذلك 404) |

---

## 🧰 الأدوات المساعدة (Utilities)

| الملف           | الوظيفة                                                                 |
|-----------------|-------------------------------------------------------------------------|
| `db.js`         | إنشاء Connection Pool لقاعدة بيانات MySQL باستخدام `mysql2/promise`     |
| `jwt.js`        | توليد والتحقق من رموز JWT (Access Tokens)                               |
| `mailer.js`     | إعداد Nodemailer لإرسال رسائل البريد الإلكتروني (استعادة كلمة المرور، الإشعارات...) |
| `cronJobs.js`   | جدولة المهام الخلفية باستخدام `node-cron` (مثل تنظيف الرموز المنتهية أو الإشعارات) |

---

## 📂 هيكل مجلدات الـ Views (EJS)

```
views/
├── layouts/
│   ├── main.ejs              # التخطيط الرئيسي للموقع
│   └── admin.ejs             # تخطيط لوحة التحكم
├── auth/
│   ├── login.ejs
│   ├── register.ejs
│   ├── forgot-password.ejs
│   └── reset-password.ejs
├── shop/
│   ├── index.ejs             # الصفحة الرئيسية / قائمة المنتجات
│   ├── product-details.ejs
│   └── category.ejs
├── user/
│   ├── profile.ejs
│   ├── edit-profile.ejs
│   └── order-history.ejs
├── admin/
│   ├── dashboard.ejs
│   ├── products.ejs
│   ├── product-form.ejs
│   ├── users.ejs
│   └── orders.ejs
├── partials/
│   ├── header.ejs
│   ├── footer.ejs
│   ├── navbar.ejs
│   └── alerts.ejs
├── error/
│   ├── 404.ejs
│   └── 500.ejs
└── checkout/
    ├── payment.ejs           # صفحة الدفع عبر InstaPay
    └── upload-receipt.ejs
```

---

## 🛣️ المسارات وواجهات الـ API

### مسارات المصادقة (`/auth/*`)

| Method | المسار                        | الوصف                              |
|--------|-------------------------------|------------------------------------|
| GET    | `/auth/register`              | عرض صفحة التسجيل                   |
| POST   | `/auth/register`              | إنشاء حساب جديد                    |
| GET    | `/auth/login`                 | عرض صفحة تسجيل الدخول              |
| POST   | `/auth/login`                 | تسجيل الدخول وإصدار JWT            |
| POST   | `/auth/logout`                | تسجيل الخروج وحذف الـ Cookie       |
| GET    | `/auth/forgot-password`       | عرض نموذج نسيان كلمة المرور        |
| POST   | `/auth/forgot-password`       | إرسال رابط استعادة كلمة المرور     |
| GET    | `/auth/reset-password/:token` | عرض نموذج إعادة تعيين كلمة المرور  |
| POST   | `/auth/reset-password/:token` | تحديث كلمة المرور                  |

### المسارات العامة والمنتجات (`/*` و `/products/*`)

| Method | المسار                        | الوصف                                      |
|--------|-------------------------------|--------------------------------------------|
| GET    | `/`                           | الصفحة الرئيسية مع قائمة المنتجات          |
| GET    | `/products`                   | قائمة المنتجات مع دعم البحث والفلاتر والتصفح |
| GET    | `/products/:id`               | تفاصيل منتج معين                           |
| GET    | `/categories/:slug`           | منتجات فئة معينة                           |

### مسارات الطلبات والدفع (`/orders/*`)

| Method | المسار                        | الوصف                                      |
|--------|-------------------------------|--------------------------------------------|
| POST   | `/orders/create`              | إنشاء طلب جديد وتوليد رابط InstaPay        |
| GET    | `/orders/:id/payment`         | عرض صفحة الدفع وإرشادات InstaPay           |
| POST   | `/orders/:id/upload-receipt`  | رفع صورة إيصال الدفع                       |
| GET    | `/orders/my-orders`           | عرض طلبات المستخدم الحالي                  |

### مسارات الملف الشخصي (`/profile/*`)

| Method | المسار                        | الوصف                              |
|--------|-------------------------------|------------------------------------|
| GET    | `/profile`                    | عرض الملف الشخصي                   |
| GET    | `/profile/edit`               | عرض نموذج تعديل البيانات           |
| PUT    | `/profile`                    | تحديث البيانات الشخصية والعنوان    |
| GET    | `/profile/orders`             | سجل الطلبات                        |

### مسارات لوحة التحكم (`/admin/*`) — محمية بـ `authMiddleware` + `roleMiddleware`

| Method | المسار                        | الوصف                              |
|--------|-------------------------------|------------------------------------|
| GET    | `/admin/dashboard`            | لوحة التحكم الرئيسية               |
| GET    | `/admin/products`             | إدارة المنتجات                     |
| GET    | `/admin/products/create`      | نموذج إضافة منتج                   |
| POST   | `/admin/products`             | إنشاء منتج جديد                    |
| GET    | `/admin/products/:id/edit`    | نموذج تعديل منتج                   |
| PUT    | `/admin/products/:id`         | تحديث منتج                         |
| DELETE | `/admin/products/:id`         | حذف منتج                           |
| GET    | `/admin/users`                | إدارة المستخدمين                   |
| PUT    | `/admin/users/:id/role`       | تغيير دور مستخدم                   |
| GET    | `/admin/orders`               | عرض ومتابعة الطلبات                |
| PUT    | `/admin/orders/:id/status`    | تحديث حالة الدفع (موافقة / رفض)    |

---

## 🔐 متغيرات البيئة (`.env.example`)

```env
# Server
PORT=3000
NODE_ENV=development

# Database (MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_db_password
DB_NAME=um_al_qura_perfumes

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# InstaPay
INSTAPAY_HANDLE=@umalqura_perfumes
INSTAPAY_LINK=https://instapay.com.eg/...

# SMTP / Nodemailer
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
MAIL_FROM="عطور أم القرى <noreply@umalqura.com>"

# Uploads
UPLOAD_PATH=./public/uploads
MAX_FILE_SIZE=5242880
```

---

## ⚙️ التثبيت والتشغيل

### المتطلبات الأساسية

- Node.js (الإصدار 18 أو أحدث)
- MySQL (الإصدار 8 أو أحدث)
- npm أو yarn

### خطوات التثبيت

```bash
# 1. استنساخ المستودع
git clone https://github.com/your-username/um-al-qura-perfumes.git
cd um-al-qura-perfumes

# 2. تثبيت الاعتماديات
npm install

# 3. إعداد ملف البيئة
cp .env.example .env
# ثم قم بتحرير ملف .env وإدخال القيم الصحيحة

# 4. إنشاء قاعدة البيانات وتشغيل الـ Migrations / الـ Schema
mysql -u root -p < database/schema.sql
# أو استخدم أي أداة إدارة قواعد بيانات لتنفيذ ملف schema.sql

# 5. تشغيل السيرفر في وضع التطوير
npm run dev

# أو في وضع الإنتاج
npm start
```

بعد التشغيل، يمكن الوصول إلى التطبيق عبر:

```
http://localhost:3000
```

---

## 📁 هيكل المشروع المقترح

```
um-al-qura-perfumes/
├── config/
├── controllers/
├── middlewares/
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   ├── uploadMiddleware.js
│   └── errorHandler.js
├── models/                  # أو استخدام الاستعلامات المباشرة
├── public/
│   ├── css/
│   ├── js/
│   └── uploads/
├── routes/
│   ├── auth.js
│   ├── products.js
│   ├── orders.js
│   ├── profile.js
│   └── admin.js
├── utils/
│   ├── db.js
│   ├── jwt.js
│   ├── mailer.js
│   └── cronJobs.js
├── views/
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── README.md
```

---

## 📝 ملاحظات تقنية

- يتم تخزين JWT داخل **HTTP-Only Cookies** لزيادة الأمان ضد هجمات XSS.
- جميع كلمات المرور تُشفّر باستخدام **Bcrypt** قبل التخزين.
- رفع الملفات يتم عبر **Multer** مع التحقق من نوع الملف والحجم.
- يتم استخدام **Connection Pool** من `mysql2/promise` لتحسين الأداء والاستقرار.
- التصميم يدعم اللغة العربية بشكل كامل (RTL).

---

**عطور أم القرى** — تجربة عطرية فاخرة تليق بذوقك.
```
```








## userflow

1. guest
home(page)->fqs,content-us,about-us,privacy,cookies,terms,refund (buttons to pages)->admin (button to page )not show -> login (button)-> Perfumes(filter(cateogryes+name+price+family+brand)+pageination+search)(page) -> perfume one(page) -> add order(please login)(action)

2. auth
login(page)-> forgetpassword(button to page)+signup(button to page)

3. customer
home(page)->login (button)+profile(button)+card(button)-> orders history(button to page) + card(page) + reviews(button to page)-> update orderItem and quantity (action)-> checkout and create order  useinstapay or paymob or pay local (action)-> perfumes(page) -> perfume one +reviews 3(page)-> reviews(page) or add to order(action)

profile(page)->setting(button)+resetpass(button to page)+forgetpass(button to page)+logout(button action)+updateaccount(button to page)



4. admin
home(page)->dashboard(page)->crud perfumes,delete update get create(admin) users,crud cateogryes,crud brand,get update(instpay,cashe) orders,delete get update reviews (pages)


## database
users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    role ENUM('admin', 'customer') DEFAULT 'customer',
    reset_token VARCHAR(255) DEFAULT NULL,
    reset_token_expiry DATETIME DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



categories
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    parent_id INT DEFAULT NULL,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


perfumes
CREATE TABLE perfumes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    brand_id INT NOT NULL,
    category_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    image_url VARCHAR(255),
    fragrance_family VARCHAR(50),
    concentration VARCHAR(20),
    is_best_seller BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE RESTRICT,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

orders
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    
    -- هنا السحر: الحالة تبدأ بـ 'cart'
    order_status ENUM('cart', 'pending_approval', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'cart',
    
    payment_method ENUM('instapay', 'paymob', 'cash') DEFAULT 'cash',
    payment_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    
    paymob_order_id VARCHAR(100) DEFAULT NULL,
    paymob_transaction_id VARCHAR(100) DEFAULT NULL,

    payment_proof VARCHAR(255) DEFAULT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


order_items
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    perfume_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL, -- سعر العطر وقت الإضافة
    total_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (perfume_id) REFERENCES perfumes(id) ON DELETE CASCADE,
    UNIQUE(order_id, perfume_id) -- يمنع تكرار نفس العطر في نفس الطلب، ويزيد الكمية
);



brand
CREATE TABLE brands (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    logo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

reviews
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    perfume_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (perfume_id) REFERENCES perfumes(id) ON DELETE CASCADE,
    UNIQUE(user_id, perfume_id)
);

## handle order with payment


body(perfumeid,quantity)
add to card(action,api POST)
1- check found perfuem
1-get orders for this user id when order status cart (found order)
  if not found create order and order item add perfume id in it
2-get from orders the order item id by select on id order in order item table and perfuem id (found order item with perfuem)
  if not found insert order item with order id and perfume id
3- increament the quantity in order item and total_price with unity price(old)*quantity
```bash
┌─────────────────────────────────────────┐
│ المستخدم ضغط "Add to Order" على عطر X  │
└──────────────┬──────────────────────────┘
               ▼
┌─────────────────────────────────────────┐
│ السؤال 1: هل المستخدم ده عنده order    │
│ حالته 'cart' بالفعل؟                   │
└──────────────┬──────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
      لا               نعم
       │                │
       ▼                ▼
┌──────────────┐  ┌──────────────────────┐
│ اعمل INSERT │  │ السؤال 2: هل العطر X │
│ order جديد  │  │ موجود بالفعل في      │
│ حالته cart  │  │ order_items للـ       │
│ واحفظ الـ   │  │ order ده؟             │
│ order_id    │  └──────────┬───────────┘
└──────┬───────┘             │
       │             ┌───────┴────────┐
       │            لا               نعم
       │             │                │
       │             ▼                ▼
       │     ┌──────────────┐  ┌──────────────────┐
       │     │ INSERT في    │  │ UPDATE quantity  │
       │     │ order_items  │  │ = quantity + 1   │
       │     │ بكمية = 1    │  │ (زود الكمية بس) │
       │     └──────┬───────┘  └────────┬─────────┘
       │            │                   │
       └────────────┴───────────────────┘
                    │
                    ▼
       ┌──────────────────────────────────┐
       │ الخطوة الأخيرة:                  │
       │ UPDATE orders SET total_amount   │
       │ = مجموع كل order_items           │
       └──────────────────────────────────┘
```

```js
// POST /orders/add-to-cart
exports.addToOrder = async (req, res) => {
    const userId = req.user.id;
    const perfumeId = req.body.perfume_id;
    const quantity = req.body.quantity || 1;

    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        // ✅ الخطوة 1: هل المستخدم عنده order بحالة 'cart'؟
        let [orders] = await conn.query(
            `SELECT id FROM orders 
             WHERE user_id = ? AND order_status = 'cart' 
             LIMIT 1`,
            [userId]
        );

        let orderId;

        if (orders.length === 0) {
            // ❌ مفيش order → اعمل واحد جديد
            const [result] = await conn.query(
                `INSERT INTO orders (user_id, order_status, total_amount) 
                 VALUES (?, 'cart', 0)`,
                [userId]
            );
            orderId = result.insertId;
        } else {
            // ✅ موجود → خد الـ id بتاعه
            orderId = orders[0].id;
        }

        // ✅ الخطوة 2: احصل على سعر العطر الحالي من جدول perfumes
        const [perfumes] = await conn.query(
            `SELECT price, stock_quantity FROM perfumes WHERE id = ? AND is_active = TRUE`,
            [perfumeId]
        );

        if (perfumes.length === 0) {
            throw new Error('العطر غير متاح');
        }

        if (perfumes[0].stock_quantity < quantity) {
            throw new Error('الكمية غير متوفرة في المخزون');
        }

        const unitPrice = perfumes[0].price;
        const totalPrice = unitPrice * quantity;

        // ✅ الخطوة 3: حاول إضافة العطر للـ order_items
        // 💡 السحر هنا: INSERT ... ON DUPLICATE KEY UPDATE
        // لو العطر موجود بالفعل (بفضل UNIQUE constraint)، زود الكمية فقط
        await conn.query(
            `INSERT INTO order_items 
                (order_id, perfume_id, quantity, unit_price, total_price)
             VALUES (?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE 
                quantity = quantity + VALUES(quantity),
                total_price = (quantity + VALUES(quantity)) * VALUES(unit_price)`,
            [orderId, perfumeId, quantity, unitPrice, totalPrice]
        );

        // ✅ الخطوة 4: احسب الإجمالي الجديد للـ order
        await conn.query(
            `UPDATE orders 
             SET total_amount = (
                 SELECT COALESCE(SUM(total_price), 0) 
                 FROM order_items 
                 WHERE order_id = ?
             )
             WHERE id = ?`,
            [orderId, orderId]
        );

        await conn.commit();
        res.json({ success: true, message: 'تمت الإضافة للسلة', order_id: orderId });

    } catch (error) {
        await conn.rollback();
        res.status(400).json({ success: false, message: error.message });
    } finally {
        conn.release();
    }
};
```



add checkout paymob(api)
```bash
┌──────────────────────────────────────────────┐
│ 1. العميل يضغط "Checkout"                   │
│    → order_status يتحول من 'cart'           │
│      إلى 'pending_approval'                 │
└──────────────┬───────────────────────────────┘
               ▼
┌──────────────────────────────────────────────┐
│ 2. Backend يتكلم مع Paymob API             │
│    → يأخذ payment_key                      │
│    → يحفظه في جدول جديد (payments) أو     │
│      في العمود notes بتاع orders            │
└──────────────┬───────────────────────────────┘
               ▼
┌──────────────────────────────────────────────┐
│ 3. Frontend يفتح Paymob Iframe             │
│    → العميل يدخل بيانات الكارت             │
│    → يدفع                                  │
└──────────────┬───────────────────────────────┘
               ▼
┌──────────────────────────────────────────────┐
│ 4. Paymob يبعت Webhook للسيرفر بتاعك       │
│    POST /webhook/paymob                    │
│    → فيه: هل الدفع نجح؟                   │
│           رقم العملية                     │
│           المبلغ                          │
└──────────────┬───────────────────────────────┘
               ▼
┌──────────────────────────────────────────────┐
│ 5. السيرفر بتاعك يحدث الداتا بيز:          │
│    ✅ لو نجح:                              │
│       - payment_status = 'approved'        │
│       - order_status = 'processing'        │
│       - يخصم stock_quantity من perfumes    │
│    ❌ لو فشل:                              │
│       - payment_status = 'rejected'        │
│       - order_status = 'cart' (يرجع سلة)   │
└──────────────────────────────────────────────┘
```



add checkout instabay or cash(api)
```js
// POST /orders/checkout
exports.checkoutOrder = async (req, res) => {
    const userId = req.user.id;
    const { payment_method } = req.body; // 'cash' أو 'instapay'

    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        // 1. ابحث عن سلة المستخدم
        const [orders] = await conn.query(
            `SELECT id, total_amount FROM orders WHERE user_id = ? AND order_status = 'cart' LIMIT 1`,
            [userId]
        );

        if (orders.length === 0) {
            return res.status(400).json({ success: false, message: 'السلة فارغة أو غير موجودة' });
        }

        const orderId = orders[0].id;

        // 2. تحقق من أن السلة تحتوي على منتجات فعلياً
        const [items] = await conn.query(
            `SELECT COUNT(*) as count FROM order_items WHERE order_id = ?`,
            [orderId]
        );

        if (items[0].count === 0) {
            return res.status(400).json({ success: false, message: 'لا يمكن إتمام طلب فارغ' });
        }

        // 3. تحديث حالة الطلب
        await conn.query(
            `UPDATE orders 
             SET order_status = 'pending_approval', 
                 payment_method = ?, 
                 payment_status = 'pending',
                 updated_at = NOW()
             WHERE id = ?`,
            [payment_method, orderId]
        );

        await conn.commit();
        
        // توجيه المستخدم بناءً على طريقة الدفع
        const redirectUrl = payment_method === 'instapay' 
            ? `/orders/${orderId}/upload-receipt` 
            : `/orders/${orderId}/success`;

        res.json({ success: true, message: 'تم إنشاء الطلب بنجاح', redirectUrl });

    } catch (error) {
        await conn.rollback();
        res.status(500).json({ success: false, message: 'حدث خطأ أثناء إتمام الطلب' });
    } finally {
        conn.release();
    }
};

// PUT /admin/orders/:id/approve
exports.approveOrder = async (req, res) => {
    const orderId = req.params.id;
    const conn = await db.getConnection();

    try {
        await conn.beginTransaction();

        // 1. تحديث حالة الطلب والدفع
        await conn.query(
            `UPDATE orders 
             SET payment_status = 'approved', 
                 order_status = 'processing' 
             WHERE id = ?`,
            [orderId]
        );

        // 2. خصم المخزون (Stock Deduction)
        await conn.query(
            `UPDATE perfumes p
             INNER JOIN order_items oi ON oi.perfume_id = p.id
             SET p.stock_quantity = p.stock_quantity - oi.quantity
             WHERE oi.order_id = ?`,
            [orderId]
        );

        await conn.commit();
        res.json({ success: true, message: 'تمت الموافقة على الطلب وخصم المخزون' });

    } catch (error) {
        await conn.rollback();
        res.status(500).json({ success: false, message: 'فشل في الموافقة على الطلب' });
    } finally {
        conn.release();
    }
};
```


webhook(action,api POST)
1- check hmfc
2- status webhook
3 update order status
```js
// routes/webhook.js
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../utils/db');
const { verifyHmac } = require('../utils/paymob');

// ⚠️ مهم: الـ webhook لازم يكون بدون authMiddleware
// عشان Paymob يقدر يوصله (مش هيبعت JWT)
router.post('/paymob', async (req, res) => {
    try {
        // ✅ الخطوة 1: تحقق من HMAC Signature (أمان)
        if (!verifyHmac(req)) {
            console.error('❌ HMAC verification failed');
            return res.status(401).send('Invalid signature');
        }

        const { obj } = req.body;
        const isSuccess = obj.success;
        const paymobOrderId = obj.order?.id?.toString();
        const transactionId = obj.transaction_id?.toString();
        const amount = obj.amount_cents / 100; // Paymob بيبعت المبلغ بالـ cents
        const errorMessage = obj.data_message;
        const cardLastFour = obj.source_data?.pan;
        const cardBrand = obj.source_data?.type;

        console.log('📩 Webhook received:', { 
            isSuccess, paymobOrderId, amount, errorMessage 
        });

        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            // ✅ الخطوة 2: ابحث عن الـ order عن طريق paymob_order_id
            const [orders] = await conn.query(
                `SELECT id, user_id, order_status, payment_status 
                 FROM orders 
                 WHERE paymob_order_id = ? 
                 LIMIT 1`,
                [paymobOrderId]
            );

            if (orders.length === 0) {
                console.error('❌ Order not found for paymob_order_id:', paymobOrderId);
                return res.status(404).send('Order not found');
            }

            const order = orders[0];

            // ✅ الخطوة 3: Idempotency Check
            // لو الدفع اتسجل قبل كده، متعملش حاجة تاني
            if (order.payment_status === 'approved' && isSuccess) {
                console.log('⚠️ Payment already processed, skipping');
                return res.status(200).send('Already processed');
            }

            // ✅ الخطوة 4: تحديث حالة الدفع والطلب
            if (isSuccess) {
                // ✅ الدفع نجح
                await conn.query(
                    `UPDATE orders 
                     SET payment_status = 'approved',
                         order_status = 'processing',
                         paymob_transaction_id = ?,
                         notes = CONCAT(COALESCE(notes, ''), 
                                 '\n[Paymob] Paid via ', COALESCE(?, 'card'),
                                 ' ending in ', COALESCE(?, '****'),
                                 ' at ', NOW())
                     WHERE id = ?`,
                    [transactionId, cardBrand, cardLastFour, order.id]
                );

                // ✅ خصم الكمية من المخزون
                await conn.query(
                    `UPDATE perfumes p
                     INNER JOIN order_items oi ON oi.perfume_id = p.id
                     SET p.stock_quantity = p.stock_quantity - oi.quantity
                     WHERE oi.order_id = ?`,
                    [order.id]
                );

                console.log('✅ Payment approved for order:', order.id);
            } else {
                // ❌ الدفع فشل
                await conn.query(
                    `UPDATE orders 
                     SET payment_status = 'rejected',
                         order_status = 'cart',  -- يرجع سلة عشان العميل يحاول تاني
                         notes = CONCAT(COALESCE(notes, ''), 
                                 '\n[Paymob] Failed: ', COALESCE(?, 'Unknown error'),
                                 ' at ', NOW())
                     WHERE id = ?`,
                    [errorMessage, order.id]
                );

                console.log('❌ Payment failed for order:', order.id);
            }

            await conn.commit();
            res.status(200).send('OK');

        } catch (dbError) {
            await conn.rollback();
            console.error('Database error:', dbError);
            res.status(500).send('Database error');
        } finally {
            conn.release();
        }

    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
```
```js
const crypto = require('crypto');

const verifyHmac = (req) => {
    const hmacSecret = process.env.PAYMOB_HMAC_SECRET;
    
    // Paymob بيبعت الـ signature في الـ query string أو الـ body
    const receivedSignature = req.query.hmac || req.body.hmac;
    if (!receivedSignature) return false;

    // بناء الـ message من البيانات اللي Paymob بعتها
    const values = [
        req.body.amount_cents,
        req.body.created_at,
        req.body.currency,
        req.body.error_occured,
        req.body.has_parent_transaction,
        req.body.id,
        req.body.integration_id,
        req.body.is_3d_secure,
        req.body.is_auth,
        req.body.is_capture,
        req.body.is_refunded,
        req.body.is_standalone_payment,
        req.body.is_voided,
        req.body.order?.id,
        req.body.owner,
        req.body.pending,
        req.body.source_data?.pan,
        req.body.source_data?.sub_type,
        req.body.source_data?.type,
        req.body.success,
    ];

    const combinedString = values.map(v => String(v)).join('');
    const hashed = crypto
        .createHmac('sha512', hmacSecret)
        .update(combinedString)
        .digest('hex');

    return hashed === receivedSignature;
};

module.exports = { verifyHmac };
```


cron-job (every day 12 hour clock check state order and date order is after more 24 hour)-> to delete orders status is cart 

```js


const cron = require('node-cron');
const db = require('./db'); // تأكد من مسار ملف الاتصال بقاعدة البيانات

// الجدولة: تشغيل كل يوم في الساعة 12:00 منتصف الليل (0 0 * * *)
// أو كل ساعة للتحقق (0 * * * *)
cron.schedule('0 0 * * *', async () => {
    console.log('🕒 بدء مهمة تنظيف السلات المهجورة...');
    
    const conn = await db.getConnection();
    try {
        // حذف الطلبات التي حالتها 'cart' ومر على إنشائها أكثر من 24 ساعة
        // ملاحظة: بسبب ON DELETE CASCADE في order_items، سيتم حذف العناصر تلقائياً
        const [result] = await conn.query(`
            DELETE FROM orders 
            WHERE order_status = 'cart' 
            AND created_at < NOW() - INTERVAL 24 HOUR
        `);

        console.log(`✅ تم تنظيف ${result.affectedRows} سلة مهجورة بنجاح.`);
    } catch (error) {
        console.error('❌ خطأ في مهمة الـ Cron Job:', error);
    } finally {
        conn.release();
    }
});

console.log('✅ Cron Jobs تم تشغيلها بنجاح');
```
