const express = require('express');

const initSchoolClassRouter = require('./schoolClass');
const initAthleteRouter = require('./athlete');

module.exports = (app, dbs) => {
    const athleteRouter = initAthleteRouter(express.Router(), dbs);
    const schoolClassRouter = initSchoolClassRouter(express.Router(), dbs);

    app.use('/api/schoolclass', schoolClassRouter);
    app.use('/api/athlete', athleteRouter);

    return app;
};