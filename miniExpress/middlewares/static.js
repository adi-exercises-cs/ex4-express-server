var path = require('path');
var fs = require('fs');

var CONTENT_TYPES = {
    '.txt': 'text/plain',
    '.html': 'text/html',
    '.css': 'text/css',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif'
};


function staticHandler(resourcePath) {


    function handler(req, res, next) {

        // Only respond to get requests
        if ('get' !== req.method) {
            next();
            return;
        }


        // Join the request path with the
        var localPath = path.join(resourcePath, req.url);

        // Test if we tried to traverse outside of the resource dir
        if (path.relative(resourcePath, localPath).indexOf('..') > -1) {
            next();
            return;
        }

        fs.exists(localPath, function(exists) {

            if (!exists) {
                next();
                return;
            }


            // get extension
            var ext = path.extname(localPath);

            // Set the right content type
            res.set('Content-Type', CONTENT_TYPES[ext] || 'application/octet-stream');

            fs.readFile(localPath, "binary", function(error, bodyData) {
                if (error) {
                    res.send(500);
                } else {
                    res.send(200, bodyData);
                }
            });

        });


    }


    return handler;
}


module.exports = staticHandler;
