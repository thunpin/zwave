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
		value: result.value
	};
}

module.exports.init = function(app) {
	app.get('/reset', function (req, res) {
		if (!reseting) {
			try {
				setTimeout(function(){reseting = false;}, RESET_WAITING_TIME);
				reseting = true;
				app.zwave.hardReset();  
			} catch (err) {
				console.log(err);
			}
		}
		
		res.send("reseting....");
	});

	app.get('/nodes', function (req, res) {
		var result = [];

		for (var key in app.nodes) {
			var node = app.nodes[key];
			var value = {
				id: node.id,
				manufacturerid: node.manufacturerid,
				producttype: node.producttype,
				name: node.name
			};
			result.push(value);
		}

		res.send(result);
	});

	app.get('/nodes/length', function (req, res) {
		res.send({length:app.nodes.length});
	});

	app.get('/nodes/add', function (req, res) {
		if (!adding) {
			setTimeout(function(){adding = false;}, ADD_WAITING_TIME);
			adding = true;
			app.zwave.addNode(false);
		}
		res.send("adding...");
	});

	app.get('/nodes/:nodeid/status', function (req, res) {
		nodeid = req.params.nodeid;
		if (app.nodes[nodeid]) {
			node = app.nodes[nodeid];

			var result = [];
			for (var status in app.nodes[nodeid].classes) {
				for (var key in app.nodes[nodeid].classes[status]) {
					var st = app.nodes[nodeid].classes[status][key];
					result.push(parseResult(st));
				}
			}

			res.send(result);
		} else {
			res.send("ops!");
		}
	});

	app.get('/nodes/:nodeid/status/:status', function (req, res) {
		nodeid = req.params.nodeid;
		status = req.params.status;
		if (app.nodes[nodeid] && app.nodes[nodeid].classes[status]) {
			node = app.nodes[nodeid];
			var result = [];
			for (var key in app.nodes[nodeid].classes[status]) {
				var st = app.nodes[nodeid].classes[status][key];
				result.push(parseResult(st));
			}
			res.send(result);
		} else {
			res.send("ops!");
		}
	});

	app.get('/nodes/:nodeid/status/:status/:index', function (req, res) {
		nodeid = req.params.nodeid;
		status = req.params.status;
		index = req.params.index;
		if (app.nodes[nodeid] && 
			app.nodes[nodeid].classes[status] && 
			app.nodes[nodeid].classes[status][index]) {

			node = app.nodes[nodeid];
			res.send(parseResult(app.nodes[nodeid].classes[status][index]));
		} else {
			console.log(app.nodes[nodeid].classes[status]);
			res.send("ops!");
		}
	});

	// change to post
	app.get('/nodes/:nodeid/command/:command/:index/:value', function (req, res) {
		nodeid = req.params.nodeid;
		command = req.params.command;
		index = req.params.index;
		value = req.params.value;
		if (app.nodes[nodeid] && 
			app.nodes[nodeid].classes[command] && 
			app.nodes[nodeid].classes[command][index]) {

			node = app.nodes[nodeid];
			// trick to boolean
			if (value == 'false') {
				value = false;
			}

			// app.zwave.setValue(nodeid, commandclass, instance, index, value);
			app.zwave.setValue(nodeid, command, 1, index, value);
			res.send("executed");
		} else {
			console.log(app.nodes[nodeid].classes[command]);
			res.send("ops!");
		}
	});
};