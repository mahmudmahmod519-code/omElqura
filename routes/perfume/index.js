const router=require("express").Router();

router.use('/api/v1', require('./perfume.apis.js'));
router.use('/', require('./perfume.render.js'));



module.exports =router;

