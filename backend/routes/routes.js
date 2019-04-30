const express = require('express');

const initSchoolClassRouter = require('./schoolClass');
const initCategoryRouter = require('./categories');
const initAthleteRouter = require('./athlete');

module.exports = (app, dbs) => {
    app.use('/api/schoolclass', initSchoolClassRouter(express.Router(), dbs));
    app.use('/api/categories', initCategoryRouter(express.Router(), dbs));
    app.use('/api/athlete', initAthleteRouter(express.Router(), dbs));

    return app;
};