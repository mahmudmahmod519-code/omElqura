const router = require("express").Router();

router.use('/api/v1', require('./users.apis.js'));
router.use('/', require('./users.render.js'));

module.exports = router;