var parse = require('url').parse;


function Request(httpRequest) {


    // The router will set the params
    this.params = {};


    // Set the body to be the http request body
    this.body = httpRequest.body;

    // Empty cookies store, will be populated by the cookie parser
    this.cookies = {};

    this.headers = httpRequest.headers;

    var parsedUrl = parse(httpRequest.path, true);

    this.path = parsedUrl.pathname;

    this.query = parsedUrl.query;

    this.method = httpRequest.method;

    this.host = this.header('host').split(':')[0];

    // Sorry, no support for SSL in our whimpy server
    this.protocol = 'http';

    // Our router will override this in case we need to remove some of the path
    this.url = this.path;
}


Request.prototype = {

    /**
     * Get a param from params/query/body
     * @param name
     */
    param: function(name) {

        if (this.params && this.params.hasOwnProperty(name)) {
            return this.params[name];
        }

        if (this.body && this.body.hasOwnProperty(name)) {
            return this.body[name];
        }

        if (this.query && this.query.hasOwnProperty(name)) {
            return this.query[name];
        }

        return false;
    },


    /***
     * Get a header
     * @param headerName
     * @returns {*}
     */
    'get': function(headerName) {
        return this.headers[headerName.toLowerCase()];
    },


    header: function(headerName) {
        return this.get(headerName);
    },

    /***
     * Test the content type for the request
     * @param contentType
     */
    is: function(contentType) {
        var ct = this.header('Content-Type') || '';

        // Match and return boolean result
        return !!ct.match(new RegExp(contentType, 'i'));

    }
};


exports.Request = Request;