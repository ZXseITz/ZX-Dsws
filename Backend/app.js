const express = require('express');
const path = require('path');
const logger = require('morgan');

const schoolClassRouter = require('./routes/schoolClass');

const app = express();
const mongoose = require('mongoose');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/schoolclass', schoolClassRouter);

mongoose.connect('mongodb://localhost:27017/dsws');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

app.listen(8001, () => console.log('Listening on port 8001.'));