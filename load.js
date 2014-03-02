/***
 *
 *  Stress test our server with X concurrent requests
 *
 *  Use the loadServer.js as the server
 *
 **/


var http = require('http');

var NUMBER_OF_REQUESTS = 10000;


var _requestOptions = {
    hostname: 'localhost',
    port: 3333,
    path: '/a-random-path',
    method: 'GET'
};

var _results = {completed: 0, failed: 0};

var _pending = [];

function queueRequest(idx) {
    console.log('queued', idx);

    var req = http.request(_requestOptions, function(res) {
        res.on('data', function() {
            console.log("Completed:", idx);
            _results.completed += 1;
        });
    });


    req.on('error', function(e) {
        console.log("Failed", idx);
        _results.failed += 1;
    });

    req.end();

    _pending.push(idx);
}


console.log("Queuing " + NUMBER_OF_REQUESTS + " requests");
for (var i = 0; i < NUMBER_OF_REQUESTS; i++) {
    queueRequest(i);
}