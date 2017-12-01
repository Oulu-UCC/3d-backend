var express = require('express');
var winston = require('winston');
var router = express.Router();

// Configure the logger
/*winston.loggers.add('city', {
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
});*/

winston.loggers.add('city', {
    format: winston.format.combine(
        winston.format.label({ label: 'City' }),
        winston.format.timestamp(),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console({
            colorize: true,
            timestamp: true
        }),
        new winston.transports.File({
            filename: './logs/city.log',
            options: {
                flags: 'w'
            }
        })
    ]
});

router.use('/oulu/api/city', require('./city'));

module.exports = router;