var util = require('util');

function Response(socket) {
    this._socket = socket;

    this._body = '';

    // Set default headers here
    this.headers = {
        // Set the date
        'date': (new Date()).toISOString(),
        // Set the connection
        'connection': 'Keep-Alive',

        'content-type': 'text/html'
    };

}

Response.prototype = {

    status: 200,
    reason: 'OK',

    writeHeaders: function(status, reason, headers) {
        this.status = status;
        this.headers = util._extend(this.headers, headers);

        this.reason = reason;
    },

    write: function(data) {
        this._body += data;
    },


    end: function(data) {
        if (data) {
            this.write(data);
        }

        // Update our content length
        this.headers['content-length'] = this._body.length;


        // output buffer
        var buff = this._renderStatus();
        buff += this._renderHeaders();
        buff += this._body;

        this._socket.write(buff, 'binary');
    },

    _renderStatus: function() {
        return "HTTP/1.1 " + this.status + ' ' + this.reason + '\r\n';
    },

    _renderHeaders: function() {
        var out = "";


        for (var header in this.headers) {
            if (this.headers.hasOwnProperty(header)) {
                out += header + ": " + this.headers[header] + '\r\n';
            }
        }

        return (out + '\r\n');
    }

};


exports.Response = Response;