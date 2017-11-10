var express = require('express');
var bodyParser = require('body-parser');

var MongoClient = require('mongodb').MongoClient;

var router = express.Router();
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: true });
const MONGO_PORT = process.env.MONGO_PORT || 27017;
const mongo_url = 'mongodb://localhost:' + MONGO_PORT + '/city';

/*
    GET construction by address
*/
router.get('/', function (req, res) {
    var street = req.query.street;
    var building = req.query.number;
    var format = req.query.format;

    MongoClient.connect(mongo_url)
        .then(function (db) {
            console.log("Connected successfully to MongoDB");
            var filter = {};
            if (street != null && street != '') filter["street"] = street;
            if (building != null && building > 0) filter["number"] = building;
            if (format != null && format != '') filter["resources"] = { "type": format };
            db.collection('oulu').find(filter).toArray()
                .then(function (docs) {
                    res.status(200).send({ data: docs });
                    db.close();
                })
                .catch(function (error) {
                    res.status(500).send("Database error");
                    db.close();
                })
        })
        .catch(function (error) {
            console.log("Connection failure! " + error.err);
        });
});

module.exports = router;