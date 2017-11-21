var fs = require('fs');
var DBS = require('../dbs');
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
                var tileset = "";
                fs.writeFile(resource.dir + "/tileset.json", tileset, function(error) {

                });
                DBS.Instance.collection('oulu').update({ "_id": new Mongo.ObjectID(resource._id) }, { $set: { "location": point } });
            }
        })
        .catch(function (error) {
            console.log("Error while fetching from Google API: " + error.message);
        });
};

module.exports = Geocoder;