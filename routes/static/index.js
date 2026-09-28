const router = require("express").Router();

router.use('/', require('./static.render.js'));

module.exports = router;