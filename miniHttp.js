/***
 * @fileOverview
 *
 * miniHttp module implementation
 *
 */

var server = require('./miniHttp/server');

exports.Server = server.Server;
exports.createServer = server.createServer;