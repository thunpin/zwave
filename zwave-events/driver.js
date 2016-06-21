module.exports = function(zwave, tools) {

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

};
