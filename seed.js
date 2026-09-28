// database/seed.js
const AppDataSource = require("./config/data-source");
const bcrypt = require("bcrypt");

async function seedDatabase() {
    try {
        await AppDataSource.initialize();
        console.log("✅ Connected to database");

        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();

        // ============================================
        // 1. إنشاء المستخدمين
        // ============================================
        console.log("👥 Creating users...");
        
        const adminPassword = await bcrypt.hash("Admin@123", 10);
        const customerPassword = await bcrypt.hash("Customer@123", 10);

        await queryRunner.query(`
            INSERT INTO users (name, email, password, phone, address, role) VALUES
            ('مدير النظام', 'admin@umalqura.com', ?, '01000000000', 'مكة المكرمة، السعودية', 'admin'),
            ('أحمد محمد', 'ahmed@test.com', ?, '01012345678', 'القاهرة، مصر', 'customer'),
            ('فاطمة علي', 'fatma@test.com', ?, '01098765432', 'الرياض، السعودية', 'customer'),
            ('محمد عبدالله', 'mohamed@test.com', ?, '01111111111', 'جدة، السعودية', 'customer'),
            ('نورة سعد', 'noura@test.com', ?, '01222222222', 'الدمام، السعودية', 'customer')
        `, [adminPassword, customerPassword, customerPassword, customerPassword, customerPassword]);

        // ============================================
        // 2. إنشاء الماركات
        // ============================================
        console.log("🏷️ Creating brands...");
        
        await queryRunner.query(`
            INSERT INTO brands (name, slug, logo_url) VALUES
            ('Dior', 'dior', '/uploads/brands/dior.png'),
            ('Chanel', 'chanel', '/uploads/brands/chanel.png'),
            ('Tom Ford', 'tom-ford', '/uploads/brands/tom-ford.png'),
            ('Arabian Oud', 'arabian-oud', '/uploads/brands/arabian-oud.png'),
            ('Gucci', 'gucci', '/uploads/brands/gucci.png'),
            ('Versace', 'versace', '/uploads/brands/versace.png'),
            ('Yves Saint Laurent', 'ysl', '/uploads/brands/ysl.png'),
            ('Lancôme', 'lancome', '/uploads/brands/lancome.png')
        `);

        // ============================================
        // 3. إنشاء التصنيفات
        // ============================================
        console.log("📂 Creating categories...");
        
        await queryRunner.query(`
            INSERT INTO categories (name, slug, parent_id) VALUES
            ('رجالي', 'men', NULL),
            ('نسائي', 'women', NULL),
            ('للجنسين', 'unisex', NULL),
            ('صيفي', 'summer', 1),
            ('شتوي', 'winter', 1),
            ('رسمي', 'formal', 1),
            ('زهري', 'floral', 2),
            ('شرقي', 'oriental', 2),
            ('منعش', 'fresh', 3)
        `);

        // ============================================
        // 4. إنشاء العطور
        // ============================================
        console.log("🧴 Creating perfumes...");
        
        await queryRunner.query(`
            INSERT INTO perfumes 
            (brand_id, category_id, name, slug, description, price, stock_quantity, image_url, fragrance_family, concentration, is_best_seller, is_active) VALUES
            -- عطور رجالية
            (1, 1, 'Dior Sauvage EDP', 'dior-sauvage-edp', 'عطر رجالي فاخر بنفحات خشبية منعشة من الكالابريان بيرغاموت والفلفل، مع قاعدة من الأمبروكسان والفانيليا', 450.00, 50, '/uploads/perfumes/sauvage.jpg', 'woody', 'EDP', TRUE, TRUE),
            (1, 1, 'Dior Homme Intense', 'dior-homme-intense', 'عطر رجالي أنيق بنفحات iris والفانيليا، مثالي للمناسبات الرسمية', 520.00, 30, '/uploads/perfumes/dior-homme.jpg', 'woody', 'EDP', FALSE, TRUE),
            (2, 1, 'Bleu de Chanel', 'bleu-de-chanel', 'عطر رجالي منعش وجذاب بنفحات الحمضيات والأرز', 480.00, 40, '/uploads/perfumes/bleu-chanel.jpg', 'fresh', 'EDP', TRUE, TRUE),
            (3, 1, 'Tom Ford Oud Wood', 'tom-ford-oud-wood', 'عطر فاخر بنفحات العود والخشب، مثالي للشتاء', 850.00, 20, '/uploads/perfumes/oud-wood.jpg', 'woody', 'EDP', TRUE, TRUE),
            (5, 1, 'Gucci Guilty Pour Homme', 'gucci-guilty-men', 'عطر رجالي عصري بنفحات اللافندر والليمون', 380.00, 35, '/uploads/perfumes/gucci-guilty.jpg', 'fresh', 'EDT', FALSE, TRUE),
            (6, 1, 'Versace Eros', 'versace-eros', 'عطر رجالي قوي بنفحات النعناع والفانيليا', 420.00, 45, '/uploads/perfumes/versace-eros.jpg', 'oriental', 'EDP', TRUE, TRUE),
            
            -- عطور نسائية
            (2, 2, 'Chanel No. 5', 'chanel-no-5', 'عطر نسائي أسطوري بنفحات الياسمين والورد', 650.00, 25, '/uploads/perfumes/chanel-no5.jpg', 'floral', 'Parfum', TRUE, TRUE),
            (2, 2, 'Coco Mademoiselle', 'coco-mademoiselle', 'عطر نسائي أنيق بنفحات البرتقال والباتشولي', 580.00, 30, '/uploads/perfumes/coco-mademoiselle.jpg', 'floral', 'EDP', TRUE, TRUE),
            (7, 2, 'YSL Black Opium', 'ysl-black-opium', 'عطر نسائي جذاب بنفحات القهوة والفانيليا', 520.00, 35, '/uploads/perfumes/black-opium.jpg', 'oriental', 'EDP', TRUE, TRUE),
            (8, 2, 'Lancôme La Vie Est Belle', 'lancome-la-vie-est-belle', 'عطر نسائي سعيد بنفحات iris والبرالين', 490.00, 40, '/uploads/perfumes/la-vie-est-belle.jpg', 'floral', 'EDP', FALSE, TRUE),
            (3, 2, 'Tom Ford Black Orchid', 'tom-ford-black-orchid', 'عطر نسائي فاخر بنفحات الأوركيد السوداء والتوابل', 780.00, 15, '/uploads/perfumes/black-orchid.jpg', 'oriental', 'Parfum', TRUE, TRUE),
            
            -- عطور يونيسكس
            (4, 3, 'Arabian Oud Resala', 'arabian-oud-resala', 'عطر شرقي فاخر بنفحات العود والمسك', 920.00, 20, '/uploads/perfumes/resala.jpg', 'oriental', 'Parfum', TRUE, TRUE),
            (4, 3, 'Arabian Oud Kalemat', 'arabian-oud-kalemat', 'عطر شرقي دافئ بنفحات العسل والعنبر', 680.00, 25, '/uploads/perfumes/kalemat.jpg', 'oriental', 'EDP', FALSE, TRUE),
            (3, 3, 'Tom Ford Tobacco Vanille', 'tom-ford-tobacco-vanille', 'عطر دافئ بنفحات التبغ والفانيليا', 890.00, 18, '/uploads/perfumes/tobacco-vanille.jpg', 'oriental', 'EDP', TRUE, TRUE)
        `);

        // ============================================
        // 5. إنشاء بعض الطلبات التجريبية
        // ============================================
        console.log("🛒 Creating orders...");
        
        // طلب مكتمل
        await queryRunner.query(`
            INSERT INTO orders (user_id, total_amount, order_status, payment_method, payment_status, created_at) VALUES
            (2, 930.00, 'delivered', 'paymob', 'approved', '2026-09-01 10:30:00'),
            (3, 650.00, 'shipped', 'instapay', 'approved', '2026-09-10 14:20:00'),
            (4, 450.00, 'processing', 'cash', 'pending', '2026-09-20 09:15:00')
        `);

        // عناصر الطلب الأول
        await queryRunner.query(`
            INSERT INTO order_items (order_id, perfume_id, quantity, unit_price, total_price) VALUES
            (1, 1, 2, 450.00, 900.00),
            (1, 3, 1, 480.00, 480.00),
            (2, 7, 1, 650.00, 650.00),
            (3, 1, 1, 450.00, 450.00)
        `);

        // ============================================
        // 6. إنشاء بعض التقييمات
        // ============================================
        console.log("⭐ Creating reviews...");
        
        await queryRunner.query(`
            INSERT INTO reviews (user_id, perfume_id, rating, comment, is_approved) VALUES
            (2, 1, 5, 'عطر رائع وثباته ممتاز، أنصح به بشدة', TRUE),
            (3, 1, 4, 'عطر جميل لكن السعر مرتفع قليلاً', TRUE),
            (4, 7, 5, 'عطر نسائي فاخر جداً، رائحته تدوم طويلاً', TRUE),
            (2, 4, 5, 'عطر العود هذا تحفة فنية، مثالي للشتاء', TRUE),
            (3, 12, 4, 'عطر شرقي أصيل، جودة عالية', TRUE),
            (4, 9, 5, 'Black Opium عطر جذاب جداً، حصلت على الكثير من المجاملات', TRUE)
        `);

        console.log("✅ Seed data created successfully!");
        
        await queryRunner.release();
        await AppDataSource.destroy();
        
    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    }
}

seedDatabase();