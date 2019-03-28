const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

const SchoolClass = mongoose.model('SchoolClass', new mongoose.Schema({
    name: String,
    teacher: String
}, {versionKey: false}), 'classes');


router.get('/', (req, res) => {
    const c = {};
    if (req.query.name) {
        c['name'] = req.query.name;
    }
    SchoolClass.find(c, (err, data) => {
        if (!err) {
            res.json(data)
        } else {
            console.error(err);
            res.status(400).send();
        }
    });
});

router.get('/:id', (req, res) => {
    SchoolClass.findById(req.params.id, (err, data) => {
        if (!err) {
            res.json(data);
        } else {
            console.error(err);
            res.status(404).send();
        }
    });
});

router.post('/', (req, res) => {
    const json = req.body;
    SchoolClass.create(json, err => {
        if (err) res.status(500).send();
        else res.status(204).send();
    });
});

router.put('/:id', (req, res) => {
    const json = req.body;
    SchoolClass.findOneAndUpdate({ _id: req.params.id }, json, err => {
        if (!err) {
            res.status(204).send()
        } else {
            console.error(err);
            res.status(404).send();
        }
    });
});

router.delete('/:id', (req, res) => {
    SchoolClass.findOneAndDelete({ _id: req.params.id }, err => {
        if (!err) {
            res.status(204).send()
        } else {
            console.error(err);
            res.status(404).send();
        }
    });
});

module.exports = router;
