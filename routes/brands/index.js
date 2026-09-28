const router = require("express").Router();

router.use('/api/v1', require('./brands.apis.js'));
router.use('/', require('./brands.render.js'));

module.exports = router;