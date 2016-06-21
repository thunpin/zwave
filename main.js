if (!process.env.ZWV_DEVICE || process.env.ZWV_DEVICE === '') {
    throw "configure environement variable ZWV_DEVICE";
}

var ZWave = require('openzwave-shared');
var zwave = new ZWave({Logging: false});

require('./zwave.js')(zwave);

zwave.connect(process.env.ZWV_DEVICE);

process.on('SIGINT', function() {
    zwave.disconnect(process.env.ZWV_DEVICE);
    process.exit();
});
