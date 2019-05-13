const express = require('express');

const initClassRouter = require('./schoolClass');
const initCategoryRouter = require('./category');
const initStudentRouter = require('./student');
const initBlockRouter = require('./block');
const controller = require('../controller');

module.exports = (app, dbs) => {
    //todo: authenticate
    app.post('/api/uploadStudents', (res, req) => {
        controller.uploadStudents(res, req, dbs);
    });

    //todo: authenticate
    app.post('/api/initBlocks', (res, req) => {
        controller.initBlocks(res, req, dbs);
    });

    app.use('/api/classes', initClassRouter(express.Router(), dbs));
    app.use('/api/categories', initCategoryRouter(express.Router(), dbs));
    app.use('/api/students', initStudentRouter(express.Router(), dbs));
    app.use('/api/blocks', initBlockRouter(express.Router(), dbs));

    return app;
};