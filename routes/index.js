var express = require('express');
var router = express.Router();

router.use('/oulu/api/city', require('./city'));

module.exports = router;