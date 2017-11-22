var TileGenerator = {};

/**
 * Update resource with GEO data.
 * @param {string} contentUrl - The path to a resource.
 * @param {object} northEast - The coordinates of northwest bounds corner.
 * @param {object} southWest - The coordinates of southeast bounds corner.
 * @returns {object} Tileset object.
 */
TileGenerator.MakeTileset = function (contentUrl, northEast, southWest) {
    var west = southWest.lng * Math.PI / 180.0;
    var south = southWest.lat * Math.PI / 180.0;
    var east = northEast.lng * Math.PI / 180.0;
    var north = northEast.lat * Math.PI / 180.0;
    var tileset = {
        "asset": {
            "version": "1.0"
        },
        "properties": {
            "Longitude": {
                "minimum": west,
                "maximum": east
            },
            "Latitude": {
                "minimum": south,
                "maximum": north
            },
            "Height": {
                "minimum": 1,
                "maximum": 420
            }
        },
        "geometricError": 500,
        "root": {
            "transform": [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ],
            "boundingVolume": {
                "region": [
                    west,
                    south,
                    east,
                    north,
                    0,
                    42
                ]
            },
            "geometricError": 100,
            "refine": "ADD",
            "content": {
                "url": contentUrl
            },
            "children": []
        }
    };
    return tileset;
};

module.exports = TileGenerator;