var express = require('express');
var tools = require('./tools');
var request = require('request');

var uri = 'https://zwave-web.herokuapp.com'

function verifyWebCommands(zwave) {
    var options = {
        uri: uri + '/commands/read',
        method: 'GET',
        json: {}
    };

    tools.log("READ COMMANDS", options);
    request(options, function(error, response, commands) {
        tools.log("READ COMMANDS RESULT", commands);
        if (commands) {
            for (var key in commands) {
                command = commands[key];
                if (command.type == 'rename') {
                    zwave.setNodeName(command.nodeid, command.name);
                } else {
                    nodeid = command.value.nodeid;
                    cmd = command.value.command;
                    instance = command.value.instance;
                    index = command.value.index;
                    value = command.value.value;

                    console.log(nodeid, cmd, instance, index, value);
                    zwave.setValue(nodeid, cmd, instance, index, value);
                }
            }
        }
    });
}

module.exports = function(zwave) {

    var nodes = {};

    // import node driver events
    require('./zwave-events/driver')(zwave);

    // import node related events
    require('./zwave-events/node')(zwave, nodes);

    // just initialize your busines rule after this handler was executed
    zwave.on('scan complete', function() {
        setInterval(function() {
            verifyWebCommands(zwave)
        }, 10000);

        var app = express();

        require('./routers')(app, zwave, nodes);

        app.listen(3000, function() {
            tools.logTitle('zwave REST listening on port 3000!');
        });
    });

};
