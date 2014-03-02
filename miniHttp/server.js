/***
 * @fileOverview
 *
 * Our "mini" HTTP server implementation
 *
 *
 */


var util = require('util');
var net = require('net');
var Socket = net.Socket;
var Request = require('./request').Request;
var Response = require('./response').Response;

var END_OF_HEADERS = '\r\n\r\n';
/***
 *
 * @param {Function} requestCallback
 * @extends {net.Server}
 * @constructor
 */
function Server(requestCallback) {
    var self = this;

    // Call the super constructor, and pass the request callback to it
    net.Server.call(this);

    // Register our callback to the request event (We emit it when we finished parsing the request)
    this.on('request', requestCallback);

    // Handle when someone connects to the server
    this.on('connection', connectionCallback);
    // Simple error handling
    this.on('error', function(err) {
        console.log('Error in server: ', err);
        if (err.code === 'EADDRINUSE') {
            console.log('Address in use. Retrying...');
            setTimeout(function() {
                self.close();
                self.listen(self.port, "localhost");
            }, 1000);
        }
    });
}

// Inherit from net.Server
util.inherits(Server, net.Server);


/***
 * This callback is called when a new connection is made
 *
 *
 * @param {Socket} socket
 */
function connectionCallback(socket) {
    // As a callback function of Server, `this` is the server instance
    var _server = this;

    // Set timeout on the socket
    socket.setTimeout(2 * 60 * 1000); // 2 minute timeout

    // Handle a timeout on the socket, and close the connection
    socket.on('timeout', function() {
        socket.destroy();
    });

    // Handle client side socket errors
    socket.addListener('error', function(e) {
        _server.emit('clientError', e, this);
    });


    // Handling request life cycle

    //
    var _request = null;

    /****
     * Handling a new data buffer.
     *
     * When we enter this function, we're either in "Getting a new request" mode or
     * "Getting body of current request" mode
     *
     *
     *
     *
     *
     * @param dataBuffer
     */
    function dataHandler(dataBuffer) {
        // if we don't have a request, that means this is a new request,
        // so we need to initialize it

        // Convert our buffer to string
        var dataBuff = dataBuffer.toString();

        try {


            if (!_request) {
                // Create a new request
                _request = new Request();

                // Split headers and body
                var parts = dataBuff.split(END_OF_HEADERS, 2 /* We only want the first two parts */);

                var headers = parts[0];
                var body = parts[1] || '';

                // Parse the headers
                parseHeaders(_request, headers);

                // Set the initial raw body data
                _request.body = body;

            } else {
                // If we have a request, we append the new body content
                _request.body += dataBuff;
            }

            // TODO: if we don't have the content-length header, die with a terrible error
            if (!('content-length' in _request.headers)) {
                // ERROR here
                throw "No content length";
            }

            // Now the last steps
            // See if we've completed the request

            if (_request.body.length >= Number(_request.headers['content-length'])) {
                // If our body's length is bigger than the content length
                dispatchRequest();

                // Clean up
                _request = null;
            }

        } catch (err) {
            handleError(err);
        }
    }

    /***
     * Here we pass the request and a new response object to the application layer
     */
    function dispatchRequest() {
        if (!_request) {
            // Why are we even here?
            return;
        }

        var response = new Response(socket);

        // Emit to the application layer
        _server.emit('request', _request, response);
    }

    /**
     * This method does two things:
     * - Writes a 500 response with the error back to the client
     * - Emit the 'error' event with the err param
     * @param err
     */
    function handleError(err) {

        var response = new Response(socket);

        // Set status and reason
        response.status = 500;
        response.reason = "Server Error";

        // Set the response content to be our error
        response.write(String(err));

        response.end();

        // Emit to the application layer
        _server.emit('error', err);
    }

    function parseHeaders(request, headers) {
        // Split our headers
        headers = headers.split('\r\n');

        // Parse the request line
        var requestLine = headers.shift().split(' ');

        request.method = requestLine[0].toLowerCase();
        request.path = requestLine[1];


        for (var i = 0; i < headers.length; i++) {
            var header = headers[i].split(':');

            var key = header[0].trim().toLowerCase();
            var value = header[1].trim().toLowerCase();

            request.headers[key] = value;
        }

        if (!('content-length' in request.headers)) {
            request.headers['content-length'] = 0;
        }

    }


    // Register data handler
    socket.on('data', dataHandler);

}


/**
 *
 * @param {Function} requestCallback
 * @returns {Server}
 */
function createServer(requestCallback) {
    return new Server(requestCallback);
}


// exports
exports.Server = Server;
exports.createServer = createServer;
