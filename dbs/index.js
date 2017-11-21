var MongoClient = require('mongodb').MongoClient;

const MONGO_PORT = process.env.MONGO_PORT || 27017;
const mongo_url = 'mongodb://localhost:' + MONGO_PORT + '/city';

var MongoInstance;
const options = {
    poolSize: 10
};

module.exports = {
    EstablishConnection: function () {
        return new Promise((resolve, reject) => {
            MongoClient.connect(mongo_url, options)
                .then(function (db) {
                    MongoInstance = db;
                    module.exports.Instance = MongoInstance;
                    resolve();
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    },
    /*Instance: function() {
        return MongoInstance;
    }*/
}