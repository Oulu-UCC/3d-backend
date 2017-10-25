// Injecting environment variables
require('dotenv').config();

var path = require('path');
var express = require('express');
var cors = require('cors');
var compression = require('compression');
var serveStatic = require('serve-static');
const PORT = process.env.PORT || 8003;

const app = express();
app.use(compression());
app.use(cors());

// Define routes
app.use(require('./routes'));

// Serve tilesets
app.use(serveStatic(path.join(__dirname, 'data'), {
    index: false
}));

const server = app.listen(PORT, function () {
    console.log('3D backend is running on http://localhost:' + PORT);
});