/**
 * Script that fetches geo information for documents
 * in MongoDB, also creating tilesets for them
 */

var axios = require('axios');
var Mongo = require('mongodb');
var MongoClient = Mongo.MongoClient;

const MONGO_PORT = process.env.MONGO_PORT || 27017;
// Gives some wrong old key :(
//const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_API_KEY = "AIzaSyDOe9dKqs4SncEEOg5hAFDULxOlkGcsu6Y";
const mongo_url = 'mongodb://localhost:' + MONGO_PORT + '/city';

// Going through all docs in database
MongoClient.connect(mongo_url)
    .then(function (db) {
        console.log("Connected successfully to MongoDB");
        db.collection('oulu').find().toArray()
            .then(function (docs) {
                // Work with data
                docs.forEach(function (doc, index) {
                    var resource = doc;
                    if (resource.location == null) {
                        // Location is unknown, try to fetch from Google API
                        var address = resource.street + ' ' + resource.number + ', Oulu';
                        address = address.replace(/\s/g, "+");
                        var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=" + GOOGLE_API_KEY;
                        axios.get(url)
                            .then(function (response) {
                                if (response.status == 200) {
                                    db.collection('oulu').update({ "_id": new Mongo.ObjectID(resource._id) }, { $set: { "location": response.data.results[0].geometry.location } })
                                        .then(function () {
                                            // Last one
                                            if (index == (docs.length - 1)) db.close();
                                        });
                                }
                            })
                            .catch(function (error) {
                                console.log("Error while fetching from Google API: " + error.message);
                            });
                    }
                });
            })
            .catch(function (error) {
                console.log("Error while searcihng the collection " + error.err);
                db.close();
            })
    })
    .catch(function (error) {
        console.log("Connection failure! " + error.err);
    });
