const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const logger = require('morgan');

const schoolClassRouter = require('./routes/schoolClass');
const athleteRouter = require('./routes/athlete');

const app = express();
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/schoolclass', schoolClassRouter);
app.use('/api/athlete', athleteRouter);

mongoose.connect('mongodb://localhost:27017/dsws');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

app.listen(8001, () => console.log('Listening on port 8001.'));