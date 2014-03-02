/**
 * Created by adi on 23/02/14.
 */

var json = require('./json');
var urlEncoded = require('./urlencoded');


function bodyParserHandler(resourcePath) {

    /**
     * Runs the json middleware or the urlEncoded middleware according to the type
     * @param req
     * @param res
     * @param next
     */
    function handler(req, res, next) {
        var _json = json();
        var _urlEncoded = urlEncoded();
        if (req.is('json')) {
            _json(req, res, next);
        } else if (req.is('application/x-www-form-urlencoded')) {
            _urlEncoded(req, res, next);
        } else {
            next();
        }


    }

    return handler;
}

module.exports = bodyParserHandler;