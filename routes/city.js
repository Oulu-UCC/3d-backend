var express = require('express');
var bodyParser = require('body-parser');

var MongoClient = require('mongodb').MongoClient;

var router = express.Router();
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: true });
const MONGO_PORT = process.env.MONGO_PORT || 27017;
const mongo_url = 'mongodb://localhost:' + MONGO_PORT + '/city';

/*
    GET request by address
*/
router.get('/address', function (req, res) {
    var street = req.query.street;
    var building = parseInt(req.query.number);
    var format = req.query.format;

    MongoClient.connect(mongo_url)
        .then(function (db) {
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
                    res.status(500).send("Internal server error");
                    db.close();
                })
        })
        .catch(function (error) {
            console.log("Connection failure! " + error.err);
            res.status(500).send("Internal server error");
        });
});

/*
    GET request by geo coordinates
*/
router.get('/geo', function (req, res) {
    // Need values in radians
    // * Math.PI / 180
    var lat = parseFloat(req.query.lat);
    var lng = parseFloat(req.query.lng);
    var radius = parseFloat(req.query.radius);
    if (lat != null && lng != null && radius != null) {
        MongoClient.connect(mongo_url)
            .then(function (db) {
                var angularRadius = radius / 6371000; // Divide by Earth radius in meters, assuming that radius in meters
                db.collection('oulu').find( { "location": { $geoWithin: { $centerSphere: [ [ lng, lat ], angularRadius ] } } } ).toArray()
                    .then(function (docs) {
                        res.status(200).send({ data: docs });
                        db.close();
                    })
                    .catch(function (error) {
                        res.status(500).send("Internal server error");
                        db.close();
                    })
            })
            .catch(function (error) {
                console.log("Connection failure! " + error.err);
                res.status(500).send("Internal server error");
            });
    }
    else {
        res.status(400).send("Bad request");
    }
});

module.exports = router;