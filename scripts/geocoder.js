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
    var address = resource.street + ' ' + resource.number + ', Oulu';
    address = address.replace(/\s/g, "+");
    var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=" + GOOGLE_API_KEY;
    var request = axios.get(url)
        .then(function (response) {
            if (response.status == 200) {
                var geometry = response.data.results[0].geometry;
                var point = {
                    "type": "Point",
                    "coordinates": [geometry.location.lng, geometry.location.lat]
                };
                // Looking for gltf model
                var gltf = resource.resources.find((element) => {
                    if (element.format == "gltf") return true;
                });
                // If we have gltf model, create a tileset
                if (gltf != null) {
                    var url = resource.dir + "/" + gltf.filename;
                    var tileset = TileGenerator.MakeTileset(url, geometry.viewport.northeast, geometry.viewport.southwest);
                    fs.writeFile(path.dirname(__dirname) + "/data" + resource.dir + "/tileset.json", JSON.stringify(tileset, null, 4), null);
                }
                // Update resource with coordinates
                DBS.Instance.collection('oulu').update({ "_id": new Mongo.ObjectID(resource._id) }, { $set: { "location": point } });
            }
        })
        .catch(function (error) {
            console.log("Error while fetching from Google API: " + error.message);
        });
};

module.exports = Geocoder;