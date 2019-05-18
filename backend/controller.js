// const ObjectID = require("mongodb").ObjectID;
const moment = require('moment');
const formidable = require('formidable');
const FileReader = require('filereader');

function uploadStudents(req, res, dbs) {
    const form = new formidable.IncomingForm();
    let getLocDist = (loc) => {
        switch (loc[0]) {
            case "D":
                // dorf
                return 3;
            case "V":
                //brüel
                return 2;
            default:
                return 1;
        }
    };
    form.parse(req, (err, fields, files) => {
        if (err) {
            console.error(err);
            res.status(500).send();
        } else {
            const file = files.csv;
            const reader = new FileReader();
            reader.onload = () => {
                const students = [];
                const classes = {};
                let counter = 1;
                const lines = reader.result.split(/\r?\n/);
                for (let i = 1; i < lines.length - 1; i++) {
                    const attr = lines[i].split(';');
                    if (attr[0] === "") continue;
                    const classId = attr[0];
                    const loc = attr[1].substr(11);

                    if (!classes.hasOwnProperty(classId)) {
                        classes[classId] = {
                            classId: classId,
                            teacher: attr[2],
                            loc: loc,
                            locDist: getLocDist(loc)
                        };
                    }

                    const dateOfBirth = moment(attr[5], "DD.MM.YYYY");
                    const year = dateOfBirth.year();
                    //todo change current year
                    const age = 2019 - year;
                    const category = `${attr[6].toLowerCase()}${age < 7 ? 7 : age > 16 ? 16 : age}`;
                    students.push({
                        startNumber: counter,
                        firstname: attr[4],
                        surname: attr[3],
                        yearOfBirth: year,
                        categoryId: category,
                        classId: classId,
                        run: {
                            blockId: 0,
                            track: 0,
                            state: 3,
                            time: 0,
                        }
                    });
                    counter += 1;
                }


                Promise.all([
                    new Promise(() => dbs.dbAdmin.collection('classes')
                        .insertMany(Object.values(classes), (err, data) => {
                            if (!err) {
                                console.log(`uploaded all classes`);
                            } else {
                                console.log(`failed uploading classes`);
                            }
                        })),
                    new Promise(() => dbs.dbAdmin.collection('students')
                        .insertMany(students, (err, data) => {
                            if (!err) {
                                console.log(`uploaded all students`);
                            } else {
                                console.log(`failed uploading students`);
                            }
                        }))
                ])
                    .then(() => res.status(204).send())
                    .catch(() => res.status(500).send())
            };
            reader.readAsText(file)
        }
    });
}

function initBlocks(req, res, dbs) {
    //todo flexible sort
    dbs.dbAdmin.collection("students").aggregate([
        {
            $lookup: {
                from: "classes",
                let: {pClassId: "$classId"},
                pipeline: [
                    {$match: {$expr: {$eq: ["$classId", "$$pClassId"]}}},
                    {
                        $project: {
                            _id: 0,
                            classId: 0
                        }
                    }
                ],
                as: "classes"
            }
        },
        {
            $lookup: {
                from: "categories",
                let: {pCatId: "$categoryId"},
                pipeline: [
                    {$match: {$expr: {$eq: ["$categoryId", "$$pCatId"]}}},
                    {
                        $project: {
                            _id: 0,
                            categoryId: 0
                        }
                    }
                ],
                as: "categories"
            }
        },
        {
            $replaceRoot: {
                newRoot: {
                    $mergeObjects: [
                        "$$ROOT",
                        {$arrayElemAt: ["$categories", 0]},
                        {$arrayElemAt: ["$classes", 0]}
                    ]
                }
            }
        },
        {
            $project: {
                categories: 0,
                classes: 0,
            }
        },
        {
            $sort: {
                categoryAge: 1,
                sex: 1,
                startNumber: 1,
            }
        },
        {
            $group: {
                _id: {
                    distance: "$distance",
                    locDist: "$locDist",
                    teacher: "$teacher",
                },
                students: {
                    $push: "$_id"
                }
            }
        },
        {
            $sort: {
                "_id.distance": 1
            }
        },
        {
            $group: {
                _id: {
                    locDist: "$_id.locDist",
                    teacher: "$_id.teacher",
                },
                distances: {
                    $push: {
                        distance: "$_id.distance",
                        students: "$students",
                    }
                }
            }
        },
        {
            $sort: {
                "_id.locDist": -1,
                "_id.teacher": 1,
            }
        }
    ]).toArray((err, data) => {
        if (!err) {
            //todo simplify zimezone summer/winter
            const timeManager = new TimeManager(2,
                "2019-05-24 09:30:00",
                "2019-05-24 11:40:00",
                "2019-05-24 13:30:00");
            const blockCounter = new Counter(1);
            const blocks = [];
            let blockId, startTime;
            data.forEach(item => {
                const teacher = item._id.teacher;
                const locDist = item._id.locDist;
                item.distances.forEach(d => {
                    const distance = d.distance;
                    let track = 1;
                    d.students.forEach(studentId => {
                        if (track === 1) {
                            blockId = blockCounter.get();
                            startTime = timeManager.get();
                            blocks.push({
                                blockId: blockId,
                                startTime: startTime,
                                distance: distance,
                                teacher: teacher,
                                locDist: locDist,
                            })
                        }
                        new Promise(() => {
                            dbs.dbAdmin.collection('students').updateOne({_id: studentId}, {
                                $set: {
                                    "run.blockId": blockId,
                                    "run.track": track,
                                    "run.state": 1,
                                }
                            }, (err, data) => {
                                if (!err) {
                                    console.log(`updated student ${studentId}`);
                                } else {
                                    console.log(`failed updating ${studentId}`);
                                }
                            });
                        });
                        track = (track % 4) + 1;
                    });
                    // blockCounter.get();
                });
                // blockCounter.get(5)
            });
            dbs.dbAdmin.collection('blocks').insertMany(blocks, (err, data) => {
                if (!err) {
                    console.log(`created blocks`);
                    res.status(204).send();
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