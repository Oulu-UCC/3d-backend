var gm = require('gm').subClass({ imageMagick: true });
var path = require('path');

var ImageEngine = {};

/**
 * Convert image to other format using GM.
 * @param {object} img - Texture object from resource.
 * @param {string} output - Format of result.
 * @returns {Promise} Promise of process.
 */
ImageEngine.ConvertImage = function (img, output) {
    return new Promise((resolve, reject) => {
        var directory = path.dirname(__dirname) + "/data";
        var inputPath = img.url;
        var parsed = path.parse(inputPath);
        parsed.ext = "." + output;
        delete parsed.base;
        var outputPath = path.format(parsed);
        gm(directory + inputPath).write(directory + outputPath, function (error) {
            if (error) reject(error);
            var newTexture = img;
            newTexture.format = output;
            newTexture.filename = parsed.name + "." + output;
            newTexture.url = parsed.dir + "/" + newTexture.filename;
            resolve(newTexture);
        });
    })
};

module.exports = ImageEngine;