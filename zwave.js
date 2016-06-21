var express = require('express');
var tools = require('./tools.js');

module.exports = function(app, zwave) {

    var nodes = [];

    // import node driver events
    require('./zwave-events/driver.js')(zwave, tools);

    // import node related events
    require('./zwave-events/node.js')(zwave, tools, nodes);

    // just initialize your busines rule after this handler was executed
    zwave.on('scan complete', function() {
        var app = express();

        require('./routers.js')(app, zwave, nodes);

        app.listen(3000, function() {
            tools.logTitle('zwave REST listening on port 3000!');
        });
    });

};;
