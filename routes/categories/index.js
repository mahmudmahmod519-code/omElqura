const router = require("express").Router();

router.use('/api/v1', require('./categories.apis.js'));
router.use('/', require('./categories.render.js'));

module.exports = router;