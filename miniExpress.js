/**
 * Created by adi on 19/12/13.
 */


// Our base app handler
var appHandler = require('./miniExpress/appHandler');


// Register all the middlewares
appHandler.static = require('./miniExpress/middlewares/static');
appHandler.json = require('./miniExpress/middlewares/json');
appHandler.bodyParser = require('./miniExpress/middlewares/bodyParser');
appHandler.cookieParser = require('./miniExpress/middlewares/cookieParser');
appHandler.urlencoded = require('./miniExpress/middlewares/urlencoded');

module.exports = appHandler;