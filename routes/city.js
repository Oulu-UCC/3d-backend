var express = require('express');
var bodyParser = require('body-parser');
var Mongo = require('mongodb');

var DBS = require('../dbs');
var Geocoder = require('../scripts/geocoder');

var router = express.Router();
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: true });

/**
 * GET request by address
 */
router.get('/address', function (req, res) {
    var street = req.query.street;
    var building = parseInt(req.query.number);
    var format = req.query.format;

    var filter = {};
    if (street != null && street != '') filter["street"] = street;
    if (building != null && building > 0) filter["number"] = building;
    if (format != null && format != '') filter["resources"] = { "type": format };

    DBS.Instance.collection('oulu').find(filter).toArray()
        .then(function (docs) {
            res.status(200).send({ data: docs });
        })
        .catch(function (error) {
            res.status(500).send("Internal server error");
        });
});

/**
 * POST request by id of object
 * To do a check of object
 */
router.post('/:id', function (req, res) {
    var id = req.params.id;

    DBS.Instance.collection('oulu').findOne({ "_id": new Mongo.ObjectID(id) })
        .then(function (doc) {
            if (doc != null) {
                Geocoder.CheckResource(doc);
                res.status(200).send("Check completed!");
            }
            else {
                res.status(404).send("Resource not found");
            }
        })
        .catch(function (error) {
            res.status(500).send("Internal server error");
        });
});

/**
 * GET request by geo coordinates
 */
router.get('/geo', function (req, res) {
    var lat = parseFloat(req.query.lat);
    var lng = parseFloat(req.query.lng);
    var radius = parseFloat(req.query.radius);

    if (lat != null && lng != null && radius != null) {
        var angularRadius = radius / 6371000; // Divided by Earth radius in meters, assuming that radius in meters
        DBS.Instance.collection('oulu').find({ "location": { $geoWithin: { $centerSphere: [[lng, lat], angularRadius] } } }).toArray()
            .then(function (docs) {
                res.status(200).send({ data: docs });
            })
            .catch(function (error) {
                res.status(500).send("Internal server error");
            });
    }
    else {
        res.status(400).send("Bad request");
    }
});

module.exports = router;