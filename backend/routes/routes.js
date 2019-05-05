const express = require('express');

const initSchoolClassRouter = require('./schoolClass');
const initCategoryRouter = require('./categories');
const initAthleteRouter = require('./athlete');
const controller = require('../controller');

module.exports = (app, dbs) => {

    //todo: authenticate
    app.post('/api/upload', (res, req) => {
        controller.upload(res, req, dbs);
    });

    //todo: authenticate
    app.post('/api/runOrder', (res, req) => {
        controller.runOrder(res, req, dbs);
    });

    app.use('/api/schoolclass', initSchoolClassRouter(express.Router(), dbs));
    app.use('/api/categories', initCategoryRouter(express.Router(), dbs));
    app.use('/api/athlete', initAthleteRouter(express.Router(), dbs));

    return app;
};