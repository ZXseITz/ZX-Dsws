const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const initDatabases = require('./dbs');
const initRoutes = require('./routes/routes');

const port = 8001;
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.static(path.join(__dirname, 'public')));

initDatabases().then(dbs => {
    initRoutes(app, dbs).listen(port, () => console.log(`Listening on port ${port}`));
}).catch(err => {
    console.error("Webservice could not connect to database");
});
