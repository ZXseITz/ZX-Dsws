const express = require('express');
const router = express.Router();

const mongoose = require("mongoose");

const schoolClassSchema = new mongoose.Schema({
    name: String,
    teacher: String
});

const SchoolClass = mongoose.model('SchoolClass', schoolClassSchema, 'classes');

router.get('/', (req, res, next) => {
    const query = SchoolClass.find();
    query.exec()
        .then(data => res.json(data))
        .catch(err => console.error(err));
});

module.exports = router;
