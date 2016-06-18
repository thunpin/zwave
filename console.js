if (!process.env.ZWV_DEVICE || process.env.ZWV_DEVICE === '') {
    throw "configure environement variable ZWV_DEVICE";
}

var tools = require('./tools.js');
var ZWave = require('openzwave-shared');
var zwave = new ZWave({
    Logging: false
});

var COMMAND_CLASS_SWITCH_MULTILEVEL = 38;

var nodes = [];

// connect to device
zwave.connect(process.env.ZWV_DEVICE);


// just initialize your busines rule after this handler was executed
zwave.on('scan complete', function() {
    // zwave.setValue(nodeid, commandclass, instance, index, value);
    // zwave.setValue(2, 38, 1, 0, 0);
    
    // Add a new device to the ZWave controller
    // zwave.addNode(false);


    // zwave.hardReset();
});


// node events
// ===========

zwave.on('node added', function(nodeid){
    tools.log('node added', {nodeid:nodeid});
    nodes[nodeid] = {
        manufacturer: '',
        manufacturerid: '',
        product: '',
        producttype: '',
        productid: '',
        type: '',
        name: '',
        loc: '',
        classes: {},
        ready: false,
    };
});

zwave.on('node ready', function(nodeid, nodeinfo) {
    tools.log('node ready', {nodeId: nodeid}, nodeinfo);
    
    node = nodes[nodeid]

    // update node
    node.manufacturer = nodeinfo.manufacturer
    node.manufacturerid = nodeinfo.manufacturerid
    node.product = nodeinfo.product
    node.producttype = nodeinfo.producttype
    node.productid = nodeinfo.productid
    node.type = nodeinfo.type
    node.name = nodeinfo.name
    node.loc = nodeinfo.loc
    node.ready = true

    nodes[nodeid] = node

    for (var commandclass in node.classes) {
        if (commandclass == COMMAND_CLASS_SWITCH_MULTILEVEL) {
            zwave.enablePoll(nodeid, commandclass);
            break;
        }
    }
});

zwave.on('polling enabled/disabled', function(nodeid){
    tools.log('polling enabled/disabled', {nodeId: nodeid}, data);
});

zwave.on('node event', function(nodeid, data) {
    tools.log('node event', {nodeId: nodeid}, data);
});

zwave.on('value added', function(nodeid, commandclass, value){
    tools.log(
        'value added',
        {nodeId: nodeid},
        {command: commandclass},
        {value: value});

    if (!nodes[nodeid].classes[commandclass]) {
        nodes[nodeid].classes[commandclass] = {};
    }
    nodes[nodeid].classes[commandclass][value.index] = value;
});

zwave.on('value changed', function(nodeid, commandclass, value){
    tools.log(
        'value changed',
        {nodeId: nodeid},
        {command: commandclass},
        {value: value});

    nodes[nodeid].classes[commandclass][value.index] = value;
});

zwave.on('value refreshed', function(nodeid, commandclass, value){
    tools.log(
        'value refreshed',
        {nodeId: nodeid},
        {command: commandclass},
        {valueid: value});
});

zwave.on('value removed', function(nodeid, commandclass, index) {
    if (nodes[nodeid].classes[commandclass] &&
        nodes[nodeid].classes[commandclass][index]) {

        delete nodes[nodeid].classes[commandclass][index];
    }
});


zwave.on('notification', function(nodeid, notif) {
    tools.logTitle('notification')
    switch (notif) {
    case 0:
        console.log('node%d: message complete', nodeid);
        break;
    case 1:
        console.log('node%d: timeout', nodeid);
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
        break;
    case 6:
        console.log('node%d: node alive', nodeid);
        break;
    default:
        console.log('node%d: %d', nodeid, notif);
        break;
    }
    tools.logBottom()
});



// driver handlers
// ===============
zwave.on('driver ready', function(homeid) {
    console.log('scanning homeid=0x%s...', homeid.toString(16));
});

zwave.on('driver failed', function() {
    console.log('failed to start driver');
    zwave.disconnect();
    process.exit();
});
// END driver handlers
// ===============


process.on('SIGINT', function() {
    console.log('disconnecting...');
    zwave.disconnect('/dev/ttyUSB0');
    process.exit();
});