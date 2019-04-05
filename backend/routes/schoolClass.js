// const SchoolClass = mongoose.model('SchoolClass', new mongoose.Schema({
//     name: String,
//     teacher: String
// }, {versionKey: false}), 'classes');

module.exports = (router, dbs) => {
    router.get('/', (req, res) => {
        const q = {};
        if (req.query.name) {
            q['name'] = req.query.name;
        }
        dbs.db.collection('schoolClass').find(q).toArray((err, data) => {
            if (!err) {
                res.json(data)
            } else {
                console.error(err);
                res.status(500).send();
            }
        });
    });

    router.get('/:id', (req, res) => {
        dbs.db.collection('schoolClass').findOne({'_id': req.params.id}, (err, data) => {
            if (!err) {
                res.json(data)
            } else {
                console.error(err);
                res.status(500).send();
            }
        });
    });

    //todo authenticate
    router.post('/', (req, res) => {
        const json = req.body;
        dbs.dbAdmin.collection('schoolClass').insertOne(json, (err, data) => {
            if (!err) {
                console.log(`created school class ${json.name} with id ${data.id}`);
                res.status(204).send()
            } else {
                console.error(`failed creating school class ${json.name}`);
                res.status(500).send();
            }
        });
    });

    //todo authenticate
    router.put('/:id', (req, res) => {
        const id = req.params.id;
        const json = req.body;
        dbs.dbAdmin.collection('schoolClass').updateOne({_id: id}, json, (err, data) => {
            if (!err) {
                console.log(`updated school class ${id}`);
                res.status(204).send()
            } else {
                console.error(`failed updating school class ${id}`);
                res.status(500).send();
            }
        });
    });

    //todo authenticate
    router.delete('/:id', (req, res) => {
        const id = req.params.id;
        dbs.dbAdmin.collection('schoolClass').deleteOne({_id: id}, (err, data) => {
            if (!err) {
                console.log(`deleted school class ${id}`);
                res.status(204).send()
            } else {
                console.error(`failed deleting school class ${id}`);
                res.status(500).send();
            }
        });
    });

    return router;
};
