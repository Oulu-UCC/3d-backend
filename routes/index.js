var express = require('express');
var winston = require('winston');
var router = express.Router();

winston.loggers.add('city', {
    console: {
        colorize: true,
        timestamp: true,
        label: 'City'
    },
    file: {
        filename: './logs/city.log',
        options: {
            flags: 'w'
        }
    }
});

router.use('/oulu/api/city', require('./city'));

module.exports = router;