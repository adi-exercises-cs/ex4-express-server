/**
 * Created by adi on 23/02/14.
 */

function cookieParserHandler(resourcePath) {

    /**
     * Parses the Cookie header field and populates req.cookies with an object keyed by the cookie names.
     * @param req
     * @param res
     * @param next
     */
    function handler(req, res, next) {
        //get the cookie header from the request
        var cookieStr = req.headers['cookie'];

        if (cookieStr !== undefined) {
            // Split into two distinct key-value pairs
            var cookies = cookieStr.split(';');
            var pair = {};

            for (var i = 0; i < cookies.length; i++) {
                cookies[i].trim();

                if (cookies[i].length > 0) {
                    //Split into a key-value pair
                    pair = cookies[i].split('=');

                    if (pair.length !== 2) {
                        throw new Error('cookieParser error: illegal cookie header');
                    }

                    var key = pair[0].trim();
                    var value = pair[1].trim();

                    //Populate req.cookies:
                    req.cookies[key] = value;
                }
            }
        }
        next();


    }


    return handler;
}


module.exports = cookieParserHandler;