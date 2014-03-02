var util = require('util');

function Response(httpResponse) {
    this._base = httpResponse;

    // Did we send any data?
    this.dataSent = false;
}

var DEFAULT_STATUS_RESPONSES = {
    200: 'OK',
    404: 'Not Found',
    500: 'Internal Server Error'
};


Response.prototype = {

    status: function(statusCode) {
        this._base.status = statusCode;
        this._base.reason = DEFAULT_STATUS_RESPONSES[statusCode];
        return this;
    },


    /***
     * Set the header value
     *
     * set('molsh','dolsh'}
     *
     * set({molsh:'dolsh'})
     *
     * @param name
     * @param value
     */
    set: function(name, value) {
        var newHeaders = {};

        if (typeof name === 'string') {
            newHeaders[name] = value;
        } else {
            newHeaders = name;
        }

        var headers = {};

        // Convert to lowercase
        for (var k in newHeaders) {
            headers[k.toLowerCase()] = newHeaders[k];
        }

        // Update our headers
        this._base.headers = util._extend(this._base.headers, headers);
    },

    /***
     * Get a header
     * @param headerName
     * @returns {*}
     */
    'get': function(headerName) {
        return this._base.headers[headerName.toLowerCase()];
    },


    send: function(status, body) {

        // Handle the case we have no status code
        if (typeof status !== "number") {
            body = status;
            status = 200;
        }

        // Set the status
        this.status(status);

        var typeOfBody = typeof body;

        switch (typeOfBody) {
            case 'undefined':
                body = DEFAULT_STATUS_RESPONSES[status];
                break;
            case 'object':
                // Set the content type
                this.set('Content-Type', 'application/json');
                body = JSON.stringify(body);
                break;

            default:
                // Convert to string
                body = String(body);
        }


        // Mark that we sent some data
        this.dataSent = true;
        this._base.end(body);
    },


    json: function(status, body) {
        // Handle the case we have no status code
        if (typeof status !== "number") {
            body = status;
            status = 200;
        }

        body = JSON.stringify(body || {});
        this.set('content-type', 'application/json');

        // Send to client using send
        return this.send(status, body);
    },


    cookie: function(key, value) {
        this.set('Set-Cookie', (key + '=' + value));
    }


};


exports.Response = Response;