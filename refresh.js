// database/refresh.js
const AppDataSource = require("../config/data-source");

async function refreshDatabase() {
    try {
        await AppDataSource.initialize();
        console.log("✅ Connected to database");

        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();

        console.log("🗑️ Clearing existing data...");

        // مسح البيانات بترتيب عكسي (بسبب Foreign Keys)
        await queryRunner.query("SET FOREIGN_KEY_CHECKS = 0;");
        await queryRunner.query("TRUNCATE TABLE reviews;");
        await queryRunner.query("TRUNCATE TABLE order_items;");
        await queryRunner.query("TRUNCATE TABLE orders;");
        await queryRunner.query("TRUNCATE TABLE perfumes;");
        await queryRunner.query("TRUNCATE TABLE categories;");
        await queryRunner.query("TRUNCATE TABLE brands;");
        await queryRunner.query("TRUNCATE TABLE users;");
        await queryRunner.query("SET FOREIGN_KEY_CHECKS = 1;");

        console.log("✅ Database cleared");

        await queryRunner.release();
        await AppDataSource.destroy();

        // تشغيل seed
        console.log("🌱 Running seed...");
        require("./seed");

    } catch (error) {
        console.error("❌ Error refreshing database:", error);
        process.exit(1);
    }
}

refreshDatabase();