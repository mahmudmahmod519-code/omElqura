module.exports=(app)=>{
    app.use('/', require('./static/index.js'));
    app.use('/perfumes', require('./perfume/index.js'));
    app.use('/categories', require('./categories/index.js'));
    app.use('/brands', require('./brands/index.js'));
    app.use('/orders', require('./orders/index.js'));
    app.use('/reviews', require('./reviews/index.js'));
    app.use('/auth', require('./auth/index.js'));
    app.use('/users', require('./users/index.js'));
    app.use('/', require('./errors/index.js'));
}

