/**
 * Created by adi on 23/02/14.
 */

function jsonHandler(resourcePath) {

    /**
     * Checks if the request body contains a json-structured string, and parses it accordingly.
     * @param req
     * @param res
     * @param next
     */
    function handler(req, res, next) {
        if (!req.is('json')) {
            next();
            return;
        }


        if (req.body === undefined) {
            if (req.is("json")) {
                throw new Error("json error: No body in a json type request");
            }
        } else {
            if (req.body.length > 0) {
                //Parse the json into an object
                try {
                    var jsonObj = JSON.parse(req.body.toString().trim());
                    //put the JSON object into req.body
                    req.body = jsonObj;
                } catch (e) {
                    throw new Error("json error: " + e);
                }
            }
        }
        next();
    }


    return handler;
}


module.exports = jsonHandler;