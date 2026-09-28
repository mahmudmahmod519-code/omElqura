const express = require("express");
const app = express();

// global configration server
require('./config/server-config')(app);

//trafic
require('./routes/index')(app);

function runServer(){
    const AppDataSource = require("./config/data-source");

    AppDataSource.initialize()
        .then(() => {
            console.log("✅ Data Source has been initialized successfully!");

            // 2. بدء السيرفر فقط بعد نجاح الاتصال
            const PORT = process.env.PORT || 3000;
            app.listen(PORT, () => {
                console.log(`🚀 Server is running on http://localhost:${PORT}`);
            });
        })
        .catch((error) => {
            console.error("❌ Error during Data Source initialization:", error);
            process.exit(1); // إيقاف التطبيق إذا فشل الاتصال بقاعدة البيانات
        });
}

runServer();