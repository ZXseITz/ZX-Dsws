const ObjectID = require('mongodb').ObjectID;

module.exports = (router, dbs) => {
    router.get('/', (req, res) => {
        const query = {};
        if (req.query.hasOwnProperty('categoryId')) {
            query['categoryId'] = req.query.categoryId
        }
        if (req.query.hasOwnProperty('categoryAge')) {
            query['categoryAge'] = req.query.categoryAge
        }
        if (req.query.hasOwnProperty('sex')) {
            query['sex'] = req.query.sex
        }
        dbs.db.collection('categories').find(query).sort({
            categoryAge: 1,
            sex: 1
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
        dbs.dbAdmin.collection('categories').insertOne(json, (err, data) => {
            if (!err) {
                console.log(`created category ${json.name} with id ${json._id}`);
                res.status(204).send()
            } else {
                console.error(`failed creating category ${json.name}`);
                res.status(500).send();
            }
        });
    });

    //todo authenticate
    router.put('/:id', (req, res) => {
        const id = req.params.id;
        const json = req.body;
        dbs.dbAdmin.collection('categories').updateOne({_id: new ObjectID(id)}, {'$set': json}, (err, data) => {
            if (!err) {
                console.log(`updated category ${id}`);
                res.status(204).send()
            } else {
                console.log(`failed updating category ${id}`);
                res.status(500).send();
            }
        });
    });

    //todo authenticate
    router.delete('/:id', (req, res) => {
        const id = req.params.id;
        dbs.dbAdmin.collection('categories').deleteOne({_id: new ObjectID(id)}, (err, data) => {
            if (!err) {
                console.log(`deleted category ${id}`);
                res.status(204).send()
            } else {
                console.log(`failed deleting category ${id}`);
                res.status(500).send();
            }
        });
    });

    return router;
};
