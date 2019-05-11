const express = require('express');

const initClassRouter = require('./schoolClass');
const initCategoryRouter = require('./category');
const initStudentRouter = require('./student');
const initBlockRouter = require('./block');
const controller = require('../controller');

module.exports = (app, dbs) => {

    //todo: authenticate
    app.post('/api/upload', (res, req) => {
        controller.upload(res, req, dbs);
    });

    //todo: authenticate
    app.post('/api/blockOrder', (res, req) => {
        controller.blockOrder(res, req, dbs);
    });

    app.use('/api/classes', initClassRouter(express.Router(), dbs));
    app.use('/api/categories', initCategoryRouter(express.Router(), dbs));
    app.use('/api/students', initStudentRouter(express.Router(), dbs));
    app.use('/api/blocks', initBlockRouter(express.Router(), dbs));

    return app;
};