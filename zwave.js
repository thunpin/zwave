var express = require('express');
var tools = require('./tools')

module.exports = function(zwave) {

    var nodes = [];

    // import node driver events
    require('./zwave-events/driver')(zwave);

    // import node related events
    require('./zwave-events/node')(zwave, nodes);

    // just initialize your busines rule after this handler was executed
    zwave.on('scan complete', function() {
        var app = express();

        require('./routers')(app, zwave, nodes);

        app.listen(3000, function() {
            tools.logTitle('zwave REST listening on port 3000!');
        });
    });

};;
