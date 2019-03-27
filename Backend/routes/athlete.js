const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

const Athlete = mongoose.model('Athlete', new mongoose.Schema({
    firstname: String,
    surname: String,
    sex: String,
    schoolClass: String,
    category: String,
    distance: Number,
    time: Number,
}, {versionKey: false}), 'athlete');

router.get('/', (req, res) => {
    const c = {};
    if (req.query.firstname) {
        c['firstname'] = req.query.firstname;
    } else if (req.query.surname) {
        c['surname'] = req.query.surname;
    } else if (req.query.sex) {
        c['sex'] = req.query.sex;
    } else if (req.query.schoolClass) {
        c['schoolClass'] = req.query.schoolClass;
    } else if (req.query.distance) {
        c['distance'] = req.query.distance;
    } else if (req.query.category) {
        c['category'] = req.query.category;
    }

    Athlete.find(c, (err, data) => {
        if (!err) {
            res.json(data);
        } else {
            console.error(err);
            res.status(500).send();
        }
    });
});

router.get('/:id', (req, res) => {
    Athlete.findById(req.params.id, (err, data) => {
        if (!err) {
            res.json(data);
        } else {
            console.error(err);
            res.status(500).send();
        }
    });
});

router.post('/', (req, res) => {
    const json = req.body;
    Athlete.create(json, err => {
        if (err) res.status(500).send();
        else res.status(204).send();
    });
});

router.update('/:id', (req, res) => {
    Athlete.findOneAndUpdate({ _id: req.params.id }, json, (err) => {
        if (!err) {
            res.status(204).send()
        } else {
            console.error(err);
            res.status(500).send();
        }
    });
});

router.delete('/:id', (req, res) => {
    Athlete.findOneAndDelete({ _id: req.params.id }, err => {
        if (!err) {
            res.status(204).send()
        } else {
            console.error(err);
            res.status(500).send();
        }
    });
});

module.exports = router;