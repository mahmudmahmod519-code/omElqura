const router = require("express").Router();

router.use('/api/v1', require('./reviews.apis.js'));
router.use('/', require('./reviews.render.js'));

module.exports = router;