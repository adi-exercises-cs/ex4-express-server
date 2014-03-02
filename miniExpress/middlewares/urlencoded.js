/**
 * Created by adi on 23/02/14.
 */

var parse = require('querystring').parse;

function urlencodedHandler(resourcePath) {

    /**
     * parses body data that was sent from a form (expecting 'application/x-www-form-urlencoded')
     * @param req
     * @param res
     * @param next
     */
    function handler(req, res, next) {
        if (req.is('application/x-www-form-urlencoded')) {
            req.body = parse(req.body);
        }
        next();
    }

    return handler;
}

module.exports = urlencodedHandler;/**
 * Created by adi on 23/02/14.
 */
