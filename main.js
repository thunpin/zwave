var tools = require('./tools');

var device = process.env.ZWV_DEVICE;
if (!device || device === '') {
    tools.log('ERROR', 'configure environement variable ZWV_DEVICE');
    process.exit(1);
}

var ZWave = require('openzwave-shared');
var zwave = new ZWave({
    Logging: false
});

require('./zwave')(zwave);

zwave.connect(device);

process.on('SIGINT', function() {
    zwave.disconnect(device);
    process.exit();
});
