/***
 * @fileOverview
 *
 * Our base app handler
 *
 *
 */

var http = require('../miniHttp');

// Require our request/response wrappers
var Request = require('./request').Request;
var Response = require('./response').Response;

// The router class handles registering/routing the requests
var Router = require('./router').Router;


function appHandler() {

    var _server = false;

    var _router = new Router();

    // This needs to return a function that could handle requests


    /*********************************************************************************
     * Handler registration and handling
     *********************************************************************************/


    /***
     * Our main handler.
     *
     * Here we get the request and response objects from the miniHttp Server, we wrap them with our versions of
     * The Request/Response classes and pass them through the routing system
     *
     * @param httpRequest
     * @param httpResponse
     */
    function app(httpRequest, httpResponse) {

        // Wrap request and response
        var request = new Request(httpRequest);
        var response = new Response(httpResponse);

        // Route it, bitch!
        _router.route(request, response);
    }


    /***
     * Register a handler
     *
     * @param resource
     * @param handler
     */
    app.use = function(resource, handler) {
        _router.register(resource, handler, '*', true);
    };


    ['get', 'post', 'delete', 'put'].forEach(function(method) {

        app[method] = function(resource, handler) {
            _router.register(resource, handler, method);
        };

    });


    // Define the routes getter
    Object.defineProperty(app, 'routes', {
        get: function() {
            return _router.routes();
        }
    });

    /*********************************************************************************
     * Utility methods
     *********************************************************************************/


    /***
     * Starts a new server
     * @param port
     */
    app.listen = function(port) {
        _server = http.createServer(app);
        _server.listen(port);
        return _server;
    };

    /***
     * Close our server if we have one
     */
    app.close = function() {
        if (!_server) {
            return;
        }

        _server.close();
    };

    // For debugging purposes
    app._router = _router;

    return app;
}


module.exports = appHandler;