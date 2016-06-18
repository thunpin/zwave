var tools = require('./tools.js');
var ZWave = require('openzwave-shared');
var zwave = new ZWave({
    Logging: false,
    ConfigPath: 'config'
});

var COMMAND_CLASS_SWITCH_MULTILEVEL = 38

var nodes = [];

// connect to device
zwave.connect(process.env.ZWV_DEVICE);


// just initialize your busines rule after this handler was executed
zwave.on('scan complete', function() {})

zwave.on('node available', function(nodeid, nodeinfo) {
    tools.log('node available', nodeinfo)
    nodes[nodeid] = nodeinfo
    nodes[nodeid]['classes'] = {}
    nodes[nodeid]['ready'] = false
})

zwave.on('node ready', function(nodeid, nodeinfo) {
    tools.log('node ready', {nodeId: nodeid}, nodeinfo)
    nodes[nodeid]['ready'] = true

    for (commandclass in nodes[nodeid]['classes']) {
        if (commandclass == COMMAND_CLASS_SWITCH_MULTILEVEL) {
            zwave.enablePoll(nodeid, commandclass)
            break
        }
    }
})

zwave.on('value added', function(nodeid, commandclass, value){
    tools.log(
        'value added',
        {nodeId: nodeid},
        {command: commandclass},
        {value: value})

    if (!nodes[nodeid]['classes'][commandclass]) {
        nodes[nodeid]['classes'][commandclass] = {};
    }
    nodes[nodeid]['classes'][commandclass][value.index] = value;
})

zwave.on('value changed', function(nodeid, commandclass, value){
    tools.log(
        'value changed',
        {nodeId: nodeid},
        {command: commandclass},
        {value: value})

    nodes[nodeid]['classes'][commandclass][value.index] = value;
})

zwave.on('value refreshed', function(nodeid, commandclass, value){
    tools.log(
        'value refreshed',
        {nodeId: nodeid},
        {command: commandclass},
        {valueid: value})  
})

zwave.on('value removed', function(nodeid, commandclass, index) {
    if (nodes[nodeid]['classes'][commandclass] &&
        nodes[nodeid]['classes'][commandclass][index]) {

        delete nodes[nodeid]['classes'][commandclass][index];
    }
});




// driver handlers
// ===============
zwave.on('driver ready', function(homeid) {
    console.log('scanning homeid=0x%s...', homeid.toString(16))
});

zwave.on('driver failed', function() {
    console.log('failed to start driver')
    zwave.disconnect()
    process.exit()
});
// END driver handlers
// ===============


process.on('SIGINT', function() {
    console.log('disconnecting...')
    zwave.disconnect('/dev/ttyUSB0')
    process.exit()
});