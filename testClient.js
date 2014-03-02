/***
 * @fileOverview
 *
 * A tiny test library to test our server
 *
 */

var http = require('http');

var data = "";

for (var i = 0; i < 20; i++) {
    //data += data + String(i);
}


var options = {
    hostname: 'localhost',
    port: 3333,
    path: '/grandmaNme.jpg?molsh=dolsh&grolsh=molsh',
    method: 'GET',
    headers: {
        'Content-length': 0
    }
};


var req = http.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
        console.log('BODY: ' + chunk);
    });
});

req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
});

// write data to request body
req.end();