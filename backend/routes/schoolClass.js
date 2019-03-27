const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

const SchoolClass = mongoose.model('SchoolClass', new mongoose.Schema({
    name: String,
    teacher: String
}, {versionKey: false}), 'classes');


router.get('/', (req, res, next) => {
    const query = SchoolClass.find();
    query.exec()
        .then(data => res.json(data))
        .catch(err => console.error(err));
});

router.post('/', (req, res, next) => {
    const json = req.body;
    SchoolClass.create(json, err => {
        if (err) res.status(500).send();
        else res.status(204).send();
    });
});

module.exports = router;
