const ObjectID = require('mongodb').ObjectID;

module.exports = (router, dbs) => {
    router.get('/', (req, res) => {
        const query = {};
        if (req.query.hasOwnProperty('blockId')) {
            query['blockId'] = req.query.blockId
        }
        dbs.db.collection('blocks').aggregate([
            { $lookup: {
                    from: "students",
                    let: { pBlockId: "$blockId"},
                    pipeline: [
                        { $match: { $expr: { $eq: ["$run.blockId", "$$pBlockId"]}}},
                    ],
                    as: "students"
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

    //todo authenticate
    router.post('/', (req, res) => {
        const json = req.body;
        dbs.dbAdmin.collection('blocks').insertOne(json, (err, data) => {
            if (!err) {
                console.log(`created block ${json.blockId} with id ${json._id}`);
                res.status(204).send()
            } else {
                console.error(`failed creating block ${json.blockId}`);
                res.status(500).send();
            }
        });
    });

    //todo authenticate
    router.put('/:id', (req, res) => {
        const id = req.params.id;
        const json = req.body;
        dbs.dbAdmin.collection('blocks').updateOne({_id: new ObjectID(id)}, {'$set': json}, (err, data) => {
            if (!err) {
                console.log(`updated block ${id}`);
                res.status(204).send()
            } else {
                console.log(`failed updating block ${id}`);
                res.status(500).send();
            }
        });
    });

    //todo authenticate
    router.delete('/:id', (req, res) => {
        const id = req.params.id;
        dbs.dbAdmin.collection('blocks').deleteOne({_id: new ObjectID(id)}, (err, data) => {
            if (!err) {
                console.log(`deleted block ${id}`);
                res.status(204).send()
            } else {
                console.log(`failed deleting block ${id}`);
                res.status(500).send();
            }
        });
    });

    return router;
};