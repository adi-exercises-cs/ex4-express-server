/***
 * Our lovely test suite
 *
 *
 **/

var querystring = require("querystring");
var assert = require('assert');
var http = require('http');

/*********************************************************************************
 * Helper methods
 *********************************************************************************/

function assertHeader(headerName, headerValue) {
    return function(res) {
        assert.equal(res.headers[headerName], headerValue);
    };
}

function methodTest(path, method) {
    responseTest(path, 200, method, method);
}

function staticTest(path, contentType) {
    responseTest(path, 200, false, 'get', assertHeader('content-type', contentType));
}

/***
 *
 * @param path
 * @param status
 * @param {String=} body
 * @param {String=} method
 * @param {Function=} testFunc
 * @param {Function=} prepareFunc
 * @param {Object=} headers
 *
 *
 */
function responseTest(path, status, body, method, testFunc, prepareFunc, headers) {
    console.log("Testing ", path);


    var opts = {
        hostname: 'localhost',
        port: 8080,
        path: path,
        method: method,
        headers: headers || {}
    };


    var req = http.request(opts, function(res) {

        assert.equal(status, res.statusCode, path + ": expected " + status + " but got " + res.statusCode);

        res.setEncoding('utf8');
        res.on('data', function(bodyData) {

            if (body) {
                assert.equal(body, bodyData, "Body mismatch for " + path);
            }

            if (testFunc) {
                testFunc(res, bodyData);
            }

            console.log("SUCCESS: ", path);
        });
    });

    req.on('error', function(err) {
        console.log(err);
    });

    // Call the preparation function
    if (prepareFunc) {
        prepareFunc(req);
    }

    req.end();
}


function cookieTest(path, cookieName, cookieValue) {
    var h = {'cookie': cookieName + '=' + cookieValue};

    responseTest(path, 200, cookieValue, 'get', false, false, h);
}

/***
 *
 * @param path
 * @param params check the params as result
 * @param {String=} body
 * @param {String=} contentType
 */
function testParams(path, params, body, contentType) {

    var h = {'Content-Type': contentType};

    if (body) {
        h['Content-Length'] = body.length;
    }

    responseTest(path, 200, params, 'post', false, function(req) {
        if (body) {
            console.log("Sending body", path, body);
            req.write(body);
        }
    }, h);
}


function jsonTest(path, response) {
    responseTest(path, 200, JSON.stringify(response), 'get', assertHeader('content-type', 'application/json'));
}


/*********************************************************************************
 * Tests
 *********************************************************************************/


//// Test methods
methodTest('/test/get', 'get');
methodTest('/test/post', 'post');
methodTest('/test/put', 'put');
methodTest('/test/delete', 'delete');

// Test static
staticTest('profile.html', 'text/html');
staticTest('grandmaNme.jpg', 'image/jpeg');
staticTest('features.txt', 'text/plain');

staticTest('/test/static/profile.html', 'text/html');
staticTest('/test/static/grandmaNme.jpg', 'image/jpeg');
staticTest('/test/static/features.txt', 'text/plain');


// Test for 404
responseTest('test-for-non-existant-file.html', 404, 'Not Found');


// Test cookies
cookieTest('/test/cookie', 'monster', 'cookie');

// Test json response
jsonTest('/test/response/json', {json: true});

// Test params

var baseR = {id: 'idTest', action: 'actionTest'};

var r = 'id=idTest\naction=actionTest';

// Url params
testParams('/test/params/idTest/actionTest', r);
//
// Query string params
testParams('/test/qs?id=idTest&action=actionTest', r);

//// Json body
testParams('/test/body/json', r, JSON.stringify(baseR), 'application/json');

// Form body
testParams('/test/body/urlencoded', r, querystring.stringify(baseR), 'application/x-www-form-urlencoded');

// Test that we use the next to go to the next callback inline
responseTest('/test/next', 200, 'yay!');

// Test errors:
responseTest('/test/error/404', 404, 'boo!');
responseTest('/test/error/500', 500, 'boo!');

// This should return 404;
responseTest('/test/error/skip', 404, 'Not Found');
