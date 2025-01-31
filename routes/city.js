var express = require('express');
var bodyParser = require('body-parser');
var Mongo = require('mongodb');
var winston = require('winston');

var DBS = require('../dbs');
var Geocoder = require('../scripts/geocoder');
var ImageEngine = require('../scripts/imagengine');

var router = express.Router();
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: true });
var logger = winston.loggers.get('city');

/**
 * GET request by address
 */
router.get('/address', function (req, res) {
    var street = req.query.street;
    var building = parseInt(req.query.number);
    var format = req.query.format;

    logger.info('/address - GET', { street: street, number: building, format: format });

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
 * GET request by id of object
 * To do a check of object
 */
router.get('/:id', function (req, res) {
    var id = req.params.id;

    logger.info('/:id - GET', { id: id });

    DBS.Instance.collection('oulu').findOne({ "_id": new Mongo.ObjectID(id) })
        .then(function (doc) {
            if (doc != null) {
                res.status(200).send({
                    data: doc
                });
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
 * POST request by id of object
 * To do a check of object
 */
/*router.post('/:id', function (req, res) {
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
});*/

/**
 * GET request by geo coordinates
 */
router.get('/geo', function (req, res) {
    var lat = parseFloat(req.query.lat);
    var lng = parseFloat(req.query.lng);
    var radius = parseFloat(req.query.radius);

    logger.info('/geo - GET', { lat: lat, lng: lng, radius: radius });

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

/**
 * POST request by id of object
 * To do a conversion of object
 */
/*router.get('/convert', function (req, res) {
    var id = req.query.id;
    var format = req.query.out;

    DBS.Instance.collection('oulu').findOne({ "_id": new Mongo.ObjectID(id) })
        .then(function (doc) {
            if (doc != null) {
                // Looking for gltf model
                doc.resources.forEach(function (element, index) {
                    var target = element.textures.find((texture) => {
                        if (texture.format == format) return true;
                    });
                    if (element.textures.length > 0 && target == null) {
                        ImageEngine.ConvertImage(element.textures[0], format)
                            .then(function (newTexture) {
                                newTexture.uploaded = new Date(Date.now()).toISOString();
                                var updateResource = "resources." + index + ".textures";
                                DBS.Instance.collection('oulu').update({ "_id": new Mongo.ObjectID(id) }, { $push: { [updateResource]: newTexture } });
                            })
                            .catch(function (error) {
                                console.log("Could not convert image: " + error);
                                res.status(500).send("Internal server error");
                            });
                    }
                });
                res.status(200).send("Check completed!");
            }
            else {
                res.status(404).send("Resource not found");
            }
        })
        .catch(function (error) {
            res.status(500).send("Internal server error");
        });
});*/

module.exports = router;