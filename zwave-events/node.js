var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var models = require('../model')(mongoose);
var tools = require('../tools');

module.exports = function(zwave) {

    // node events
    // ===========
    zwave.on('node added', function(nodeid) {
        tools.log('node added', {
            nodeid: nodeid
        });
        node = new models.Node({
            id: nodeid,
            manufacturer: '',
            genre: '',
            manufacturerid: '',
            product: '',
            producttype: '',
            productid: '',
            type: '',
            name: '',
            loc: '',
            ready: false,
            withRange: false
        });
        node.save();

        node.classes = {};
        nodes[nodeid] = node;
    });

    zwave.on('node ready', function(nodeid, nodeinfo) {
        tools.log('node ready', {
            nodeId: nodeid
        }, nodeinfo);

        node = nodes[nodeid];

        // update node
        node.manufacturer = nodeinfo.manufacturer;
        node.manufacturerid = nodeinfo.manufacturerid;
        node.product = nodeinfo.product;
        node.producttype = nodeinfo.producttype;
        node.productid = nodeinfo.productid;
        node.type = nodeinfo.type;
        node.name = nodeinfo.name;
        node.loc = nodeinfo.loc;
        node.ready = true;

        nodes[nodeid] = node;

        node.save();
    });

    zwave.on('value added', function(nodeid, commandclass, value) {
        tools.log(
            'value added', {
                nodeId: nodeid
            }, {
                command: commandclass
            }, {
                value: value
            });

        if (!nodes[nodeid].classes[commandclass]) {
            nodes[nodeid].classes[commandclass] = {};
        }

        if (nodes[nodeid].genre != 'system') {
            intensity = 10;
            zwave.enablePoll(nodeid, commandclass, intensity);
        } else {
            zwave.disablePoll(nodeid, commandclass);
        }
        command = new models.Command(value);
        command.save();
        nodes[nodeid].classes[commandclass][value.index] = value;
    });

    zwave.on('value changed', function(nodeid, commandclass, value) {
        tools.log(
            'value changed', {
                nodeId: nodeid
            }, {
                command: commandclass
            }, {
                value: value
            });

        nodes[nodeid].ready = true;
        command = new models.Command(value);
        command.save();
        nodes[nodeid].classes[commandclass][value.index] = command;
    });

    zwave.on('value refreshed', function(nodeid, commandclass, value) {
        tools.log(
            'value refreshed', {
                nodeId: nodeid
            }, {
                command: commandclass
            }, {
                valueid: value
            });
    });

    zwave.on('value removed', function(nodeid, commandclass, index) {
        if (nodes[nodeid].classes[commandclass] &&
            nodes[nodeid].classes[commandclass][index]) {

            delete nodes[nodeid].classes[commandclass][index];
        }
    });

    zwave.on('notification', function(nodeid, notif) {
        tools.logTitle('notification');
        switch (notif) {
            case 0:
                console.log('node%d: message complete', nodeid);
                break;
            case 1:
                console.log('node%d: timeout', nodeid);
                nodes[nodeid].ready = false;
                nodes[nodeid].save();
                break;
            case 2:
                console.log('node%d: nop', nodeid);
                break;
            case 3:
                console.log('node%d: node awake', nodeid);
                break;
            case 4:
                console.log('node%d: node sleep', nodeid);
                break;
            case 5:
                console.log('node%d: node dead', nodeid);
                nodes[nodeid].ready = false;
                nodes[nodeid].save();
                break;
            case 6:
                console.log('node%d: node alive', nodeid);
                break;
            default:
                console.log('node%d: %d', nodeid, notif);
                break;
        }
        tools.logBottom();
    });
};
