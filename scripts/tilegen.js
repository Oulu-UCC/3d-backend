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

/**
 * Update resource with GEO data.
 * Calculations of bounds are taken from http://janmatuschek.de/LatitudeLongitudeBoundingCoordinates
 * @param {object} building - Building object stored in database and for which we generate tile file.
 * @returns {object} Tileset object.
 */
TileGenerator.MakeTile = function (building) {
    var angularRadius = 20.0 / 6371000.0; 
    var longitude = building.location.coordinates[0] * Math.PI / 180.0;
    var latitude = building.location.coordinates[1] * Math.PI / 180.0;
    var latMin = latitude - angularRadius;
    var latMax = latitude + angularRadius;
    //var latT = Math.asin(Math.sin(latitude) / Math.cos(angularRadius));
    var longDelta = Math.asin(Math.sin(angularRadius) / Math.cos(latitude));
    var longMin = longitude - longDelta;
    var longMax = longitude + longDelta;

    /*var b3dm = building.resources.find((element, index, array) => {
        if (element.format == "b3dm") {
            return true;
        }
    });*/
    var filename = building.resources[0].filename.slice(0, -3) + "b3dm";

    var tileset = {
        "asset": {
            "version": "1.0"
        },
        "properties": {
            "Longitude": {
                "minimum": longMin,
                "maximum": longMax
            },
            "Latitude": {
                "minimum": latMin,
                "maximum": latMax
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
                    longMin,
                    latMin,
                    longMax,
                    latMax,
                    0,
                    42
                ]
            },
            "geometricError": 100,
            "refine": "ADD",
            "content": {
                "url": filename
            },
            "children": []
        }
    };

    return tileset;
};

module.exports = TileGenerator;