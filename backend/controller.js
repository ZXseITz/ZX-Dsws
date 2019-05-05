const moment = require("moment");
const formidable = require('formidable');
const FileReader = require('filereader');

function upload(req, res, dbs) {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        if (err) {
            console.error(err);
            res.status(500).send();
        } else {
            const csv = files.csv;
            const reader = new FileReader();
            reader.onload = () => {
                const list = [];
                let counter = 1;
                const lines = csv.split(/\r?\n/);
                for (let i = 1; i < lines.length - 1; i++) {
                    const attr = lines[i].split(';');
                    if (attr[0] === "") continue;
                    const dateOfBirth = moment(attr[5], "DD.MM.YYYY");
                    const year = dateOfBirth.year();
                    //todo change current year
                    const age = 2019 - year;
                    const category = `${attr[6].toLowerCase()}${age < 7 ? 7 : age > 16 ? 16 : age}`;
                    list.push({
                        number: counter,
                        firstname: attr[4],
                        surname: attr[3],
                        year: year,
                        schoolClass: attr[0].substr(1),
                        category: category,
                        state: 1,
                        time: 0.0
                    });
                    counter += 1;
                }

                dbs.dbAdmin.collection('athlete').insertMany(list, (err, data) => {
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
}

function runOrder(req, res, dbs) {
    dbs.dbAdmin.collection('athlete').aggregate([
        {
            $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: 'name',
                as: 'concreteCategory'
            }
        },
        {
            $replaceRoot: {newRoot: {$mergeObjects: [{$arrayElemAt: ["$concreteCategory", 0]}, "$$ROOT"]}}
        },
        {
            $project: {
                concreteCategory: 0
            }
        },
        {
            $sort: {
                distance: 1,
                schoolClass: 1,
                sex: 1,
                number: 1,
            }
        },
        {
            $group: {
                _id: '$distance',
                athlete: {
                    $push: '$number'
                }
            }
        },
        {
            $sort: {
                _id: 1,
            }
        }
    ]).toArray((err, data) => {
        if (!err) {
            const items = [];
            let item = {
                block: 0,
            };
            data.forEach(distance => {
                item = {
                    distance: distance._id,
                    block: item.block + 1,
                    startTime: moment.now(),
                    athlete: []
                };
                distance.athlete.forEach(a => {
                    if (item.athlete.length === 4) {
                        items.push(item);
                        item = {
                            distance: distance._id,
                            block: item.block + 1,
                            startTime: moment.now(),
                            athlete: []
                        }
                    }
                    item.athlete.push(a)
                });
                if (item.athlete.length > 0) {
                    items.push(item);
                }
            });
            dbs.dbAdmin.collection('run').insertMany(items, (dberr, dbres) => {
                if (!dberr) {
                    console.log(`created run order`);
                    res.status(204).send()
                } else {
                    console.log(`failed creating run order`);
                    res.status(500).send();
                }
            });
        } else {
            console.error(err);
            res.status(500).send();
        }
    });
}

module.exports = {
    'upload': upload,
    'runOrder': runOrder,
};