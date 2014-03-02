/***
 * Simple server for our load testing
 * Check out load.js for more info
 */


var express = require('./miniExpress');

var app = express();


app.use(function(req, res, next) {

    // Always answer with 200 OK and the request body
    res.send(200, "DONE");
    console.log("OK");
});


// Use port 3333 to listen
console.log("Starting load server on port 3333");
app.listen(3333);

