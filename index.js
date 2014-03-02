/***
 * @fileOverview
 *
 * A test for our code
 *
 *
 *
 */


/*********************************************************************************
 * Responses
 *********************************************************************************/

// Send back the request method
function methodResponse(req, res, next) {
    res.send(200, req.method);
}


function paramResponse(listOfParams) {

    return function(req, res, next) {

        var out = '';

        for (var i = 0; i < listOfParams.length; i++) {
            var p = listOfParams[i];

            out += p + '=' + req.param(p) + '\n';
        }

        res.send(200, out.trim());
    };
}

function cookieResponse(cookieName) {

    return function(req, res, next) {
        res.send(200, req.cookies[cookieName]);
    };
}

function jsonResponse(req, res, next) {
    res.json({json: true});
}

function sillyResponse(content) {

    return function(req, res, next) {
        res.send(content);
    };
}

function skipResponse(req, res, next) {
    next();
}


function errorResponse(status, content) {

    return function(req, res, next) {
        res.send(status, content);
    };
}


/*********************************************************************************
 * Test server
 *********************************************************************************/



var express = require('./miniExpress');
var app = express();

// Use the static middleware
app.use(express.static(__dirname + '/www'));
app.use('/test/static', express.static(__dirname + '/www'));

// Parse cookies
app.use(express.cookieParser());

// Parse body requests
app.use(express.bodyParser());

// Register our test endpoints
app.get('/test/get', methodResponse);
app.post('/test/post', methodResponse);
app.put('/test/put', methodResponse);
app.delete('/test/delete', methodResponse);


app.post('/test/params/:id/:action', paramResponse(['id', 'action']));
app.post('/test/qs', paramResponse(['id', 'action']));
app.post('/test/body/json', paramResponse(['id', 'action']));
app.post('/test/body/urlencoded', paramResponse(['id', 'action']));

app.get('/test/response/json', jsonResponse);
app.get('/test/cookie', cookieResponse('monster'));

// Test that we use the next to go to the next callback inline
app.get('/test/next', skipResponse);
app.get('/test/next', sillyResponse('yay!'));

app.get('/test/error/404', errorResponse(404, 'boo!'));
app.get('/test/error/500', errorResponse(500, 'boo!'));

// This should return 404;
app.get('/test/error/skip', skipResponse);

console.log('Starting our server on port 8080');
// start our server
app.listen(8080);






