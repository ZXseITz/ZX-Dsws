const formidable = require('formidable');
const FileReader = require('filereader');
const upload = require('../upload');

// const Athlete = mongoose.model('Athlete', new mongoose.Schema({
//     firstname: String,
//     surname: String,
//     year: Number,
//     schoolClass: String,
//     category: String,
//     distance: Number,
//     time: Number,
// }, {versionKey: false}), 'athlete');

module.exports = (router, dbs) => {
    router.get('/', (req, res) => {
        const q = {};
        if (req.query.firstname) {
            q['firstname'] = req.query.firstname;
        }
        if (req.query.surname) {
            q['surname'] = req.query.surname;
        }
        if (req.query.sex) {
            q['sex'] = req.query.sex;
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

        dbs.db.collection('athlete').find(q).toArray((err, data) => {
            if (!err) {
                res.json(data);
            } else {
                console.error(err);
                res.status(500).send();
            }
        });
    });

    router.get('/:id', (req, res) => {
        dbs.db.collection('athlete').findOne({_id: req.params.id}, (err, data) => {
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
        dbs.dbAdmin.collection('athlete').insertOne(json, (err, data) => {
            if (!err) {
                console.log(`created athlete ${json.firstname} ${json.surname} with id ${data.id}`);
                res.status(204).send()
            } else {
                console.error(`failed creating athlete ${json.firstname} ${json.surname}`);
                res.status(500).send();
            }
        });
    });

    router.put('/:id', (req, res) => {
        const id = req.params.id;
        dbs.dbAdmin.collection('athlete').updateOne({ _id: id }, json, (err, data) => {
            if (!err) {
                console.log(`updated athlete ${id}`);
                res.status(204).send()
            } else {
                console.log(`failed updating athlete ${id}`);
                res.status(500).send();
            }
        });
    });

    router.delete('/:id', (req, res) => {
        const id = req.params.id;
        dbs.dbAdmin.collection('athlete').deleteOne({ _id: id }, (err, data) => {
            if (!err) {
                console.log(`deleted athlete ${id}`);
                res.status(204).send()
            } else {
                console.log(`failed deleting athlete ${id}`);
                res.status(500).send();
            }
        });
    });

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
                            console.log(`uploaded all athlete ${json}`);
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
};
