// config/data-source.js
require("reflect-metadata"); // يجب أن يكون هذا السطر في أعلى الملف دائماً
const { DataSource } = require("typeorm");
require("dotenv").config();

const AppDataSource = new DataSource({
    type: "mysql", // سيستخدم mysql2 تلقائياً لأنها مثبتة
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "um_al_qura",
    
    // هنا نحدد مسار ملفات الـ Entity بصيغة JS
    entities: [__dirname + "/../models/*.entity.js"],
    
    synchronize: false, // ⚠️ اجعله false دائماً في الإنتاج لمنع مسح البيانات
    logging: process.env.NODE_ENV === "development", // عرض استعلامات SQL في التطوير
});

module.exports = AppDataSource;