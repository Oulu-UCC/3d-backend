var express = require('express');
var bodyParser = require('body-parser');

var router = express.Router();
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: true });

router.get('/', function(req, res) {
    var street = req.query.street;
    var building = req.query.number;
});

module.exports = router;