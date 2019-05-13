const ObjectID = require("mongodb").ObjectID;

module.exports = (router, dbs) => {
    router.get("/", (req, res) => {
        const query = {};
        if (req.query.hasOwnProperty("startNumber")) {
            query["startNumber"] = parseInt(req.query.startNumber);
        }
        if (req.query.hasOwnProperty("firstname")) {
            query["firstname"] = req.query.firstname;
        }
        if (req.query.hasOwnProperty("surname")) {
            query["surname"] = req.query.surname;
        }
        if (req.query.hasOwnProperty("yearOfBirth")) {
            query["yearOfBirth"] = parseInt(req.query.yearOfBirth);
        }
        if (req.query.hasOwnProperty("classId")) {
            query["classId"] = parseInt(req.query.classId);
        }
        if (req.query.hasOwnProperty("categoryId")) {
            query["categoryId"] = parseInt(req.query.categoryId);
        }
        if (req.query.hasOwnProperty("state")) {
            query["run.state"] = parseInt(req.query.state);
        }

        const query2 = {};
        if (req.query.hasOwnProperty("distance")) {
            query2["distance"] = parseInt(req.query.distance);
        }

        dbs.db.collection("students").aggregate([
            {$match: query},
            {$sort: {startNumber: 1}},
            {
                $lookup: {
                    from: "categories",
                    let: {pCatId: "$categoryId"},
                    pipeline: [
                        {$match: {$expr: {$eq: ["$categoryId", "$$pCatId"]}}},
                        {
                            $project: {
                                _id: 0,
                                distance: 1
                            }
                        }
                    ],
                    as: "categories"
                }
            },
            {$replaceRoot: {newRoot: {$mergeObjects: ["$$ROOT", {$arrayElemAt: ["$categories", 0]}]}}},
            {$match: query2},
            {$project: {categories: 0}}
        ]).toArray((err, data) => {
            if (!err) {
                res.json(data);
            } else {
                console.error(err);
                res.status(500).send();
            }
        });
    });

    router.get("/noBlock", (req, res) => {
        const query = {};
        if (req.query.hasOwnProperty("distance")) {
            query["distance"] = parseInt(req.query.distance);
        }
        dbs.db.collection("students").aggregate([
            {$match: {"run.blockId": 0}},
            {$sort: {startNumber: 1}},
            {
                $lookup: {
                    from: "categories",
                    let: {pCatId: "$categoryId"},
                    pipeline: [
                        {$match: {$expr: {$eq: ["$categoryId", "$$pCatId"]}}},
                        {
                            $project: {
                                _id: 0,
                                distance: 1
                            }
                        }
                    ],
                    as: "categories"
                }
            },
            {$replaceRoot: {newRoot: {$mergeObjects: ["$$ROOT", {$arrayElemAt: ["$categories", 0]}]}}},
            {$match: query},
            {$project: {categories: 0}}
        ]).toArray((err, data) => {
            if (!err) {
                res.json(data);
            } else {
                console.error(err);
                res.status(500).send();
            }
        });
    });

    // router.get("/ranked", (req, res) => {
    //     dbs.db.collection("students").aggregate([
    //         {
    //             $sort: {
    //                 state: 1,
    //                 time: 1,
    //             }
    //         },
    //         {
    //             $group: {
    //                 _id: "$category",
    //                 athlete: {
    //                     $push: {
    //                         number: "$number",
    //                         firstname: "$firstname",
    //                         surname: "$surname",
    //                         year: "$year",
    //                         schoolClass: "$schoolClass",
    //                         state: "$state",
    //                         time: "$time",
    //                     }
    //                 }
    //             }
    //         },
    //         {
    //             $lookup: {
    //                 from: "categories",
    //                 localField: "_id",
    //                 foreignField: "name",
    //                 as: "category"
    //             }
    //         },
    //         {
    //             $replaceRoot: {newRoot: {$mergeObjects: [{$arrayElemAt: ["$category", 0]}, "$$ROOT"]}}
    //         },
    //         {
    //             $sort: {
    //                 age: 1,
    //                 sex: 1,
    //             }
    //         },
    //         {
    //             $project: {
    //                 _id: 0,
    //                 age: 0,
    //                 sex: 0,
    //                 category: 0
    //             }
    //         }
    //     ]).toArray((err, data) => {
    //         if (!err) {
    //             res.json(data);
    //         } else {
    //             console.error(err);
    //             res.status(500).send();
    //         }
    //     });
    // });

    // router.get("/run", (req, res) => {
    //     dbs.db.collection("run").aggregate([
    //         {
    //             $unwind: "$athlete"
    //         },
    //         {
    //             $lookup: {
    //                 from: "athlete",
    //                 localField: "athlete",
    //                 foreignField: "number",
    //                 as: "concreteAthlete"
    //             }
    //         },
    //         {
    //             $replaceRoot: {newRoot: {$mergeObjects: [{$arrayElemAt: ["$concreteAthlete", 0]}, "$$ROOT"]}}
    //         },
    //         {
    //             $group: {
    //                 _id: {
    //                     block: "$block",
    //                     distance: "$distance",
    //                     startTime: "$startTime"
    //                 },
    //                 athlete: {
    //                     $push: {
    //                         number: "$number",
    //                         firstname: "$firstname",
    //                         surname: "$surname",
    //                         year: "$year",
    //                         schoolClass: "$schoolClass",
    //                         category: "$category"
    //                     }
    //                 }
    //             }
    //         },
    //         {
    //             $sort: {
    //                 "_id.block": 1
    //             }
    //         }
    //     ]).toArray((err, data) => {
    //         if (!err) {
    //             res.json(data);
    //         } else {
    //             console.error(err);
    //             res.status(500).send();
    //         }
    //     });
    // });

    router.get("/:id", (req, res) => {
        const id = req.params.id;
        dbs.db.collection("students").findOne({_id: new ObjectID(id)}, (err, data) => {
            if (!err) {
                res.json(data);
            } else {
                console.error(err);
                res.status(500).send();
            }
        });
    });

    //todo authenticate
    router.post("/", (req, res) => {
        const json = req.body;
        dbs.dbAdmin.collection("students").insertOne(json, (err, data) => {
            if (!err) {
                console.log(`created student ${json.firstname} ${json.surname} with id ${json._id}`);
                res.status(204).send()
            } else {
                console.error(`failed creating student ${json.firstname} ${json.surname}`);
                res.status(500).send();
            }
        });
    });

    //todo authenticate
    router.put("/:id", (req, res) => {
        const id = req.params.id;
        const json = req.body;
        dbs.dbAdmin.collection("students").updateOne({_id: new ObjectID(id)}, {"$set": json}, (err, data) => {
            if (!err) {
                console.log(`updated student ${id}`);
                res.status(204).send()
            } else {
                console.log(`failed updating student ${id}`);
                res.status(500).send();
            }
        });
    });

    //todo authenticate
    router.delete("/:id", (req, res) => {
        const id = req.params.id;
        dbs.dbAdmin.collection("students").deleteOne({_id: new ObjectID(id)}, (err, data) => {
            if (!err) {
                console.log(`deleted student ${id}`);
                res.status(204).send()
            } else {
                console.log(`failed deleting student ${id}`);
                res.status(500).send();
            }
        });
    });

    return router;
};
