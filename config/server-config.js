const express = require('express');

module.exports=(app)=>{
    const cookieParser = require('cookie-parser');
    const path = require('path');
    require('dotenv').config();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    app.use(express.static(path.join(__dirname, "../public"),{
        maxAge: process.env.NODE_ENV === 'production' ?  365 * 24 * 60 * 60 * 1000 : 0,
        immutable: process.env.NODE_ENV === 'production',
        etag: true,
        lastModified: true
    }));

    app.use("/uploads", express.static(path.join(__dirname, '../public/uploads')));

    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '../views'));

}