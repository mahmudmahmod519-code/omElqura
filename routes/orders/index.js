const router = require("express").Router();

router.use('/api/v1', require('./order.apis.js'));
router.use('/', require('./order.render.js'));

module.exports = router;