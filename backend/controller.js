const ObjectID = require("mongodb").ObjectID;
const moment = require('moment');
const formidable = require('formidable');
const FileReader = require('filereader');

function uploadStudents(req, res, dbs) {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        if (err) {
            console.error(err);
            res.status(500).send();
        } else {
            const file = files.csv;
            const reader = new FileReader();
            reader.onload = () => {
                const list = [];
                let counter = 1;
                const lines = reader.result.split(/\r?\n/);
                for (let i = 1; i < lines.length - 1; i++) {
                    const attr = lines[i].split(';');
                    if (attr[0] === "") continue;
                    const dateOfBirth = moment(attr[5], "DD.MM.YYYY");
                    const year = dateOfBirth.year();
                    //todo change current year
                    const age = 2019 - year;
                    const category = `${attr[6].toLowerCase()}${age < 7 ? 7 : age > 16 ? 16 : age}`;
                    list.push({
                        startNumber: counter,
                        firstname: attr[4],
                        surname: attr[3],
                        yearOfBirth: year,
                        classId: attr[0].substr(1),
                        categoryId: category,
                        run: {
                            blockId: 0,
                            track: 0,
                            state: 3,
                            time: 0,
                        }
                    });
                    counter += 1;
                }

                dbs.dbAdmin.collection('students').insertMany(list, (err, data) => {
                    if (!err) {
                        console.log(`uploaded all students`);
                        res.status(204).send()
                    } else {
                        console.log(`failed uploading students`);
                        res.status(500).send();
                    }
                })
            };
            reader.readAsText(file)
        }
    });
}

function initBlocks(req, res, dbs) {
    //todo flexible sort
    dbs.dbAdmin.collection('students').aggregate([
        {
            $lookup: {
                from: 'categories',
                let: {pCatId: '$categoryId'},
                pipeline: [
                    {$match: {$expr: {$eq: ["$categoryId", "$$pCatId"]}}},
                    {
                        $project: {
                            _id: 0,
                            categoryId: 0
                        }
                    }
                ],
                as: 'category'
            }
        },
        {
            $replaceRoot: {newRoot: {$mergeObjects: [{$arrayElemAt: ["$category", 0]}, "$$ROOT"]}}
        },
        {
            $project: {
                category: 0
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
                students: {
                    $push: '$_id'
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
            //todo simplify zimezone summer/winter
            const timeManager = new TimeManager(2,
                "2019-05-24 09:30:00",
                "2019-05-24 11:40:00",
                "2019-05-24 13:30:00");
            const blockCounter = new Counter(1);
            let blockId, startTime, track;
            data.forEach(distance => {
                track = 1;
                distance.students.forEach(studentId => {
                    if (track === 1) {
                        blockId = blockCounter.get();
                        startTime = timeManager.get();
                        items.push({
                            blockId: blockId,
                            startTime: startTime,
                            distance: distance._id,
                        });
                    }
                    dbs.dbAdmin.collection("students").updateOne({_id: studentId}, {
                        "$set": {
                            "run.blockId": blockId,
                            "run.track": track
                        }
                    }, (dberr, dbres) => {
                        if (!dberr) {
                            console.log(`updated run for student ${studentId}`);
                        } else {
                            console.log(`failed updating run for student ${studentId}`);
                        }
                    });
                    track = (track % 4) + 1;
                });
                // add space for hot fixes
                blockCounter.get(5)
            });
            dbs.dbAdmin.collection('blocks').insertMany(items, (dberr, dbres) => {
                if (!dberr) {
                    console.log(`created blocks`);
                    res.status(204).send()
                } else {
                    console.log(`failed creating blocks`);
                    res.status(500).send();
                }
            });
        } else {
            console.error(err);
            res.status(500).send();
        }
    });
}

class Counter {
    constructor(start = 0) {
        this.count = start;
    }

    get(i = 1) {
        const result = this.count;
        this.count = result + i;
        return result;
    }
}

class TimeManager {
    constructor(interval, start, lunchStart, lunchEnd) {
        this.interval = interval;
        this.time = Date.parse(start);
        this.morning = true;
        this.lunch1 = Date.parse(lunchStart);
        this.lunch2 = Date.parse(lunchEnd);
    }

    get() {
        const result = new Date(this.time);
        this.time = this.time + this.interval * 60000;
        if (this.morning && this.lunch1 - this.time < 0) {
            this.time = this.lunch2;
            this.morning = false;
        }
        return result;
    }
}

module.exports = {
    'uploadStudents': uploadStudents,
    'initBlocks': initBlocks,
};