const ObjectID = require('mongodb').ObjectID;

module.exports = (router, dbs) => {
    router.get('/', (req, res) => {
        const query = {};
        if (req.query.hasOwnProperty('classId')) {
            query['classId'] = req.query.classId
        }
        if (req.query.hasOwnProperty('teacher')) {
            query['teacher'] = req.query.teacher
        }
        if (req.query.hasOwnProperty('loc')) {
            query['loc'] = req.query.loc
        }
        if (req.query.hasOwnProperty('locDist')) {
            query['locDist'] = req.query.locDist
        }
        dbs.db.collection('classes').find(query).sort({
            classId: 1
        }).toArray((err, data) => {
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
        dbs.dbAdmin.collection('classes').insertOne(json, (err, data) => {
            if (!err) {
                console.log(`created class ${json.classId} with id ${json._id}`);
                res.status(204).send()
            } else {
                console.error(`failed creating class ${json.classId}`);
                res.status(500).send();
            }
        });
    });

    //todo authenticate
    router.put('/:id', (req, res) => {
        const id = req.params.id;
        const json = req.body;
        dbs.dbAdmin.collection('classes').updateOne({_id: new ObjectID(id)}, {'$set': json}, (err, data) => {
            if (!err) {
                console.log(`updated class ${id}`);
                res.status(204).send()
            } else {
                console.log(`failed updating class ${id}`);
                res.status(500).send();
            }
        });
    });

    //todo authenticate
    router.delete('/:id', (req, res) => {
        const id = req.params.id;
        dbs.dbAdmin.collection('classes').deleteOne({_id: new ObjectID(id)}, (err, data) => {
            if (!err) {
                console.log(`deleted class ${id}`);
                res.status(204).send()
            } else {
                console.log(`failed deleting class ${id}`);
                res.status(500).send();
            }
        });
    });

    return router;
};
