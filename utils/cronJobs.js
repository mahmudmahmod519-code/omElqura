const cron = require('node-cron');
const AppDataSource = require('../config/data-source');

cron.schedule('0 0 * * *', async () => {
    console.log('🕒 بدء مهمة تنظيف السلات المهجورة...');

    try {
        const result = await AppDataSource.query(
            `DELETE FROM orders 
             WHERE order_status = 'cart' 
             AND created_at < NOW() - INTERVAL 24 HOUR`
        );

        console.log(`✅ تم تنظيف ${result.affectedRows || 0} سلة مهجورة بنجاح.`);
    } catch (error) {
        console.error('❌ خطأ في مهمة الـ Cron Job:', error);
    }
});

console.log('✅ Cron Jobs تم تشغيلها بنجاح');
