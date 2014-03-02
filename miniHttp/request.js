/***
 *
 *
 *
 * @constructor
 */
function Request() {

    /***
     * Body is a text string
     * @type {string}
     */
    this.body = '';

    /***
     * Stores the headers
     *
     * Notes:
     *   - We parse the headers inside the server's request processing
     *
     * @type {object}
     */
    this.headers = {};


    // Set by the server
    this.method = '';

    // Set by the server
    this.path = '';
}

exports.Request = Request;

