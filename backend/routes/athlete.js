const ObjectID = require('mongodb').ObjectID;
const formidable = require('formidable');
const FileReader = require('filereader');
const upload = require('../upload');

module.exports = (router, dbs) => {
    router.get('/', (req, res) => {
        const q = {};
        if (req.query.firstname) {
            q['firstname'] = req.query.firstname;
        }
        if (req.query.surname) {
            q['surname'] = req.query.surname;
        }
        if (req.query.year) {
            q['year'] = req.query.year;
        }
        if (req.query.schoolClass) {
            q['schoolClass'] = req.query.schoolClass;
        }
        if (req.query.distance) {
            q['distance'] = req.query.distance;
        }
        if (req.query.category) {
            q['category'] = req.query.category;
        }

        dbs.db.collection('athlete').find(q).sort({
            schoolClass: 1,
            surname: 1,
            firstname: 1,
        }).toArray((err, data) => {
            if (!err) {
                res.json(data);
            } else {
                console.error(err);
                res.status(500).send();
            }
        });
    });

    router.get('/grouped', (req, res) => {
        dbs.db.collection('athlete').aggregate([
            {
                $group: {
                    _id: {
                        category: '$category',
                        distance: '$distance',
                    },
                    athlete: {
                        $push: {
                            firstname: '$firstname',
                            surname: '$surname',
                            year: '$year',
                            schoolClass: '$schoolClass',
                            time: '$time',
                        }
                    }
                }
            }
        ]).toArray((err, data) => {
            if (!err) {
                res.json(data);
            } else {
                console.error(err);
                res.status(500).send();
            }
        });
    });

    router.get('/:id', (req, res) => {
        const id = req.params.id;
        dbs.db.collection('athlete').findOne({_id: new ObjectID(id)}, (err, data) => {
            if (!err) {
                res.json(data);
            } else {
                console.error(err);
                res.status(500).send();
            }
        });
    });

    //todo authenticate
    router.post('/', (req, res) => {
        const json = req.body;
        dbs.dbAdmin.collection('athlete').insertOne(json, (err, data) => {
            if (!err) {
                console.log(`created athlete ${json.firstname} ${json.surname} with id ${json._id}`);
                res.status(204).send()
            } else {
                console.error(`failed creating athlete ${json.firstname} ${json.surname}`);
                res.status(500).send();
            }
        });
    });

    //todo authenticate
    router.post('/upload', (req, res) => {
        const form = new formidable.IncomingForm();
        form.parse(req, (err, fields, files) => {
            if (err) {
                console.error(err);
                res.status(500).send();
            } else {
                const csv = files.csv;
                const reader = new FileReader();
                reader.onload = () => {
                    const json = upload.register(reader.result);
                    // console.log(json);
                    dbs.dbAdmin.collection('athlete').insertMany(json, (err, data) => {
                        if (!err) {
                            console.log(`uploaded all athlete`);
                            res.status(204).send()
                        } else {
                            console.log(`failed uploading athlete`);
                            res.status(500).send();
                        }
                    })
                };
                reader.readAsText(csv)
            }
        });
    });

    //todo authenticate
    router.put('/:id', (req, res) => {
        const id = req.params.id;
        const json = req.body;
        dbs.dbAdmin.collection('athlete').updateOne({_id: new ObjectID(id)}, {'$set': json}, (err, data) => {
            if (!err) {
                console.log(`updated athlete ${id}`);
                res.status(204).send()
            } else {
                console.log(`failed updating athlete ${id}`);
                res.status(500).send();
            }
        });
    });

    //todo authenticate
    router.delete('/:id', (req, res) => {
        const id = req.params.id;
        dbs.dbAdmin.collection('athlete').deleteOne({_id: new ObjectID(id)}, (err, data) => {
            if (!err) {
                console.log(`deleted athlete ${id}`);
                res.status(204).send()
            } else {
                console.log(`failed deleting athlete ${id}`);
                res.status(500).send();
            }
        });
    });

    return router;
};
