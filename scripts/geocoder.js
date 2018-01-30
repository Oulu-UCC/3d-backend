var Mongo = require('mongodb');
var axios = require('axios');
var path = require('path');
var fs = require('fs');

var DBS = require('../dbs');
var TileGenerator = require('./tilegen');

var Geocoder = {};

const GOOGLE_API_KEY = "AIzaSyDOe9dKqs4SncEEOg5hAFDULxOlkGcsu6Y";

/**
 * Update resource with GEO data.
 * @param {object} resource - Resource document.
 */
Geocoder.CheckResource = function (resource) {
    var coordinates = resource.location.coordinates;
    var latlng = coordinates[1] + ',' + coordinates[0];
    var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latlng + "&key=" + GOOGLE_API_KEY;
    var request = axios.get(url)
        .then(function (response) {
            if (response.status == 200) {
                // Generate tile
                var tileset = TileGenerator.MakeTile(resource);
                fs.writeFile(path.dirname(__dirname) + "/data" + resource.dir + "/tileset.json", JSON.stringify(tileset, null, 4), (err) => {
                    if (err != null) console.log("Error while writing tile .json: " + err);
                });
                // Update resource with coordinates
                var address = response.data.results[0].formatted_address
                DBS.Instance.collection('oulu').update({ "_id": new Mongo.ObjectID(resource._id) }, { $set: { "street": address } });
            }
        })
        .catch(function (error) {
            console.log("Error while fetching from Google API: " + error.message);
        });
};

module.exports = Geocoder;