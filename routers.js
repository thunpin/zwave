var adding = false;
var reseting = false;

var ADD_WAITING_TIME = 1000 * 60 * 1;
var RESET_WAITING_TIME = 1000 * 60 * 5;

function parseResult(result) {
    return {
        class_id: result.class_id,
        index: result.index,
        type: result.type,
        genre: result.genre,
        label: result.label,
        units: result.units,
        read_only: result.read_only,
        write_only: result.write_only,
        is_polled: result.is_polled,
        min: result.min,
        max: result.max,
        value: result.value,
    };
}

module.exports = function(app, zwave, nodes) {

    app.get('/reset', function(req, res) {
        if (!reseting) {
            try {
                setTimeout(function() {
                    reseting = false;
                }, RESET_WAITING_TIME);
                reseting = true;
                zwave.hardReset();
            } catch (err) {
                console.log(err);
            }
        }

        res.send("reseting....");
    });

    app.get('/nodes', function(req, res) {
        var result = [];

        for (var key in nodes) {
            var node = nodes[key];
            var value = {
                id: node.id,
                manufacturerid: node.manufacturerid,
                producttype: node.producttype,
                name: node.name,
                ready: node.ready
            };
            result.push(value);
        }

        res.send(result);
    });

    app.get('/nodes/length', function(req, res) {
        res.send({
            length: nodes.length
        });
    });

    app.get('/nodes/add', function(req, res) {
        if (!adding) {
            setTimeout(function() {
                adding = false;
            }, ADD_WAITING_TIME);
            adding = true;
            zwave.addNode(false);
        }
        res.send("adding...");
    });

    app.get('/node/:nodeid', function(req, res) {
        nodeid = req.params.nodeid;
        if (nodes[nodeid]) {
            var node = nodes[nodeid];
            var value = {
                id: node.id,
                manufacturerid: node.manufacturerid,
                producttype: node.producttype,
                name: node.name,
                ready: node.ready
            };
            res.send(value);
        } else {
            res.send("ops!");
        }
    });

    app.get('/node/:nodeid/rename/:name', function(req, res) {
        nodeid = req.params.nodeid;
        if (nodes[nodeid]) {
            name = req.params.name;
            zwave.setNodeName(nodeid, name);
            console.log(zwave.refreshNodeInfo(nodeid));
            res.send("renamed");
        } else {
            res.send("ops!");
        }
    });

    app.get('/node/:nodeid/status', function(req, res) {
        nodeid = req.params.nodeid;
        if (nodes[nodeid]) {
            node = nodes[nodeid];

            var result = [];
            for (var status in nodes[nodeid].classes) {
                for (var key in nodes[nodeid].classes[status]) {
                    var st = nodes[nodeid].classes[status][key];
                    result.push(parseResult(st));
                }
            }

            res.send(result);
        } else {
            res.send("ops!");
        }
    });

    app.get('/node/:nodeid/status/:status', function(req, res) {
        nodeid = req.params.nodeid;
        status = req.params.status;
        if (nodes[nodeid] && nodes[nodeid].classes[status]) {
            node = nodes[nodeid];
            var result = [];
            for (var key in nodes[nodeid].classes[status]) {
                var st = nodes[nodeid].classes[status][key];
                result.push(parseResult(st));
            }
            res.send(result);
        } else {
            res.send("ops!");
        }
    });

    app.get('/node/:nodeid/status/:status/:index', function(req, res) {
        nodeid = req.params.nodeid;
        status = req.params.status;
        index = req.params.index;
        if (nodes[nodeid] &&
            nodes[nodeid].classes[status] &&
            nodes[nodeid].classes[status][index]) {

            node = nodes[nodeid];
            res.send(parseResult(nodes[nodeid].classes[status][index]));
        } else {
            console.log(nodes[nodeid].classes[status]);
            res.send("ops!");
        }
    });

    // change to post
    app.get('/node/:nodeid/command/:command/:instance/:value', function(req, res) {
        nodeid = req.params.nodeid;
        command = req.params.command;
        instance = req.params.instance;
        value = req.params.value;
        index = 0;

        if (nodes[nodeid] &&
            nodes[nodeid].classes[command] &&
            nodes[nodeid].classes[command][index]) {

            node = nodes[nodeid];
            // trick to boolean
            if (value == 'false') {
                value = false;
            }

            // app.zwave.setValue(nodeid, commandclass, instance, index, value);
            console.log(nodeid, command, instance, index, value)
            zwave.setValue(nodeid, command, instance, index, value);
            res.send("executed");
        } else {
            console.log(nodes[nodeid].classes[command]);
            res.send("ops!");
        }
    });
};
