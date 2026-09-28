const router = require("express").Router();

router.use('/api/v1', require('./auth.apis.js'));
router.use('/', require('./auth.render.js'));

module.exports = router;