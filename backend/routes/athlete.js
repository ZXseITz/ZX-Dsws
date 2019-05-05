const ObjectID = require('mongodb').ObjectID;

module.exports = (router, dbs) => {
    router.get('/', (req, res) => {
        const q = {};
        if (req.query.number) {
            q['number'] = req.query.number;
        }
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
            number: 1
        }).toArray((err, data) => {
            if (!err) {
                res.json(data);
            } else {
                console.error(err);
                res.status(500).send();
            }
        });
    });

    router.get('/ranked', (req, res) => {
        dbs.db.collection('athlete').aggregate([
            {
                $sort: {
                    state: 1,
                    time: 1,
                }
            },
            {
                $group: {
                    _id: '$category',
                    athlete: {
                        $push: {
                            number: '$number',
                            firstname: '$firstname',
                            surname: '$surname',
                            year: '$year',
                            schoolClass: '$schoolClass',
                            state: '$state',
                            time: '$time',
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: '_id',
                    foreignField: 'name',
                    as: 'category'
                }
            },
            {
                $replaceRoot: {newRoot: {$mergeObjects: [{$arrayElemAt: ["$category", 0]}, "$$ROOT"]}}
            },
            {
                $sort: {
                    age: 1,
                    sex: 1,
                }
            },
            {
                $project: {
                    _id: 0,
                    age: 0,
                    sex: 0,
                    category: 0
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

    router.get('/run', (req, res) => {
        dbs.db.collection('run').aggregate([
            {
                $unwind: '$athlete'
            },
            {
                $lookup: {
                    from: 'athlete',
                    localField: 'athlete',
                    foreignField: 'number',
                    as: 'concreteAthlete'
                }
            },
            {
                $replaceRoot: {newRoot: {$mergeObjects: [{$arrayElemAt: ["$concreteAthlete", 0]}, "$$ROOT"]}}
            },
            {
                $group: {
                    _id: {
                        block: '$block',
                        distance: '$distance',
                        startTime: '$startTime'
                    },
                    athlete: {
                        $push: {
                            number: '$number',
                            firstname: '$firstname',
                            surname: '$surname',
                            year: '$year',
                            schoolClass: '$schoolClass',
                            category: '$category'
                        }
                    }
                }
            },
            {
                $sort: {
                    '_id.block': 1
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
