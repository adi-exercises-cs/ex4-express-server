/***
 * @fileOverview
 *
 * The router class handles routing and matching requests
 *
 */


/***
 *
 *
 * @constructor
 */
function Router() {

    /***
     * List of handlers
     * @type {Array}
     * @private
     */
    this._handlers = [];
}

var KEYS_REGEXP = /:[\w]+/ig;


Router.prototype = {

    /***
     *
     *
     *
     * @param {String|Function} path
     * @param {Function=}       callback
     * @param {String=}         method
     * @param {Boolean=}        mount
     */
    register: function(path, callback, method, mount) {

        if (!method) {
            method = '*';
        }

        // Make sure method is in lower case
        method = method.toLowerCase();

        // Handle the case of resource = func.
        if (!callback) {
            callback = path;
            path = '/';
        }

        // Make sure mount is boolean
        mount = !!mount;

        // Test if we already have the given path in our handlers
        // http://mdn.beonex.com/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/filter.html
        var handler = this._handlers.filter(function(h) {
            return h.path === path && h.method === method && h.mount === mount;
        })[0];

        // if we don't have this handler already, generate it
        if (!handler) {
            handler = this._generateHandler(path, method, mount);
        }

        // Add our callback to the callback list
        handler.callbacks.push(callback);

    },


    /***
     * Generates a handler structure
     *
     * Example:
     *
     *  { path: '/user/:id',
     *    method: 'get',
     *    callbacks: [molshFunc, dolshFunc],
     *    keys: [{ name: 'id', optional: false }],
     *    regexp: /^\/user\/(?:([^\/]+?))\/?$/i }
     *
     * @param path
     * @param method
     * @param mount
     * @private
     */
    _generateHandler: function(path, method, mount) {

        var h = {
            path: path,
            method: method,
            callbacks: [],
            keys: [],
            mount: mount
        };

        // our simple regex
        var re = '^' + path;

        // If we're not mounting, match to the end of the request
        if (!mount) {
            re += '$';
        }

        if (path === '/' && mount) {
            re = '.*';
        }

        // Handle the stupid keys
        re = re.replace(KEYS_REGEXP, function(matchKey) {

            // remove the : from the start of the matchkey
            var name = matchKey.substr(1);

            h.keys.push({'name': name});

            // Return a group match for the regexp
            return '(?:([^/]+?))';
        });


        // Set the regexp after we processed it
        h.regexp = new RegExp(re, 'i');

        // Push into the handlers lists
        this._handlers.push(h);

        return h;
    },

    /***
     * Route the request and handle exceptions/not found errors
     * @param request
     * @param response
     */
    route: function(request, response) {

        var matcher = new Matcher(request, this._handlers);

        // Step 1: get the first match to our path
        var handler = matcher.next();

        // Only if we have any match to our request
        if (handler) {
            function next() {
                var nextHandler = matcher.next();

                if (nextHandler) {
                    try {
                        nextHandler(request, response, next);
                    } catch (e) {
                        // Handle 500 errors here, like a boss :P
                        response.send(500, "Internal Server Error\n\n" + String(e));
                    }

                } else {
                    // Step 3: Handle errors / not found / no data was sent issues
                    if (!response.dataSent) {
                        response.send(404);
                    }
                }
            }

            try {

                // Step 2: invoke it with the right next function (use our saved index)
                handler(request, response, next);
            } catch (e) {
                // Handle 500 errors here, like a boss :P
                response.send(500, "Internal Server Error\n\n" + String(e));
            }

        }


    },


    /***
     * Returns a dict from method to a list of handlers
     */
    routes: function() {
        var result = {};


        this._handlers.forEach(function(handler) {

            // Skip global handlers
            if (handler.method === '*') {
                return;
            }

            // get the list
            var list = result[handler.method];

            // Create it if it's missing
            if (!list) {
                list = result[handler.method] = [];
            }

            list.push(handler);
        });

        return result;
    }


};


/*********************************************************************************
 * Matcher helper class
 *********************************************************************************/

function Matcher(request, handlers) {

    this._request = request;
    this._handlers = handlers;

    this._handlerIdx = -1;
    this._callbackIdx = -1;
}


Matcher.prototype = {
    next: function() {

        // Try to get the next callback first
        var c = this._nextCallback();

        if (!c) {
            // If we don't have the callback, progress to the next handler
            this._nextHandler();

            // Get the next callback for it
            c = this._nextCallback();
        }

        // Return the callback or nothing
        return c;
    },


    /***
     * Get the next callback
     *
     * Notes:
     * - we update the callback index AFTER we call this method.
     * @private
     */
    _nextCallback: function() {
        this._callbackIdx += 1;

        return this._callback(this._handlerIdx, this._callbackIdx);
    },

    _nextHandler: function() {
        this._handlerIdx += 1;

        // get the next handler
        var nextHandler = this._handler(this._handlerIdx);

        while (nextHandler) {

            var m = this._match(nextHandler, this._request.path, this._request.method);

            if (m) {

                // Add the matched keys to the request
                this._updateRequestParams(nextHandler, m);
                // Fix the request url if we used the mount option
                this._updateRequestUrl(nextHandler, m);


                // clear the callback index
                this._callbackIdx = -1;
                return nextHandler;
            }

            // Go to the next handler
            this._handlerIdx += 1;
            nextHandler = this._handler(this._handlerIdx);
        }

        return null;
    },


    _updateRequestParams: function(handler, matches) {

        matches = matches.slice(1);

        var params = {};

        for (var i = 0; i < matches.length; i++) {
            // Store the matches by the index
            var paramValue = params[i] = matches[i];

            // get the key from the handler keys
            var key = handler.keys[i];

            // If we have the key, store the params by the key
            if (key) {
                params[key.name] = paramValue;
            }

        }

        this._request.params = params;
    },

    _updateRequestUrl: function(handler, matches) {
        // do nothing if our handler is not mounted
        if (!handler.mount) {
            return;
        }

        // Remove the mount point from the url
        this._request.url = this._request.path.replace(handler.path, '/');
    },

    _match: function(handler, path, method) {

        if (handler.method !== '*' && handler.method !== method) {
            return null;
        }

        return path.match(handler.regexp);
    },

    /***
     * Return the handler from the given idx
     * @param idx
     * @private
     */
    _handler: function(idx) {
        return this._handlers[idx];
    },

    /***
     * Return the callback in the given handler position
     * @param handlerIdx
     * @param callbackIdx
     * @private
     */
    _callback: function(handlerIdx, callbackIdx) {
        var h = this._handler(handlerIdx);
        if (!h) {
            return null;
        }

        return h.callbacks[callbackIdx];
    }

};

// Export our router
exports.Router = Router;