if (!process.env.ZWV_DEVICE || process.env.ZWV_DEVICE === '') {
	throw "configure environement variable ZWV_DEVICE";
}

var express = require('express');
var ZWave = require('openzwave-shared');
var tools = require('./tools.js');
var routes = require('./routers.js');
var mongoose = require('mongoose');

var COMMAND_CLASS_SWITCH_MULTILEVEL = 38;

var app = express();
var zwave = new ZWave({Logging: false});
mongoose.connect('mongodb://localhost/test');
var nodes = {};


// define Node schema
var nodeSchema = mongoose.Schema({
    id: Number,
	manufacturer: String,
	genre: String,
	manufacturerid: String,
	product: String,
	producttype: String,
	productid: String,
	type: String,
	name: String,
	loc: String,
	ready: Boolean,
	withRange: Boolean
});
var Node = mongoose.model('node', nodeSchema);
var commandSchema = mongoose.Schema({ 
	value_id: String,
	node_id: Number,
	class_id: Number,
	type: String,
	genre: String,
	instance: Number,
	index: Number,
	label: String,
	units: String,
	help: String,
	read_only: Boolean,
	write_only: Boolean,
	is_polled: Boolean,
	min: Number,
	max: Number,
	value: Number 
 });
var Command = mongoose.model('command', commandSchema);


app.nodes = nodes;
app.zwave = zwave;
zwave.connect(process.env.ZWV_DEVICE);
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


// just initialize your busines rule after this handler was executed
zwave.on('scan complete', function() {
	routes.init(app);

	app.listen(3000, function () {
	  tools.logTitle('zwave REST listening on port 3000!');
	});
});


// node events
// ===========
zwave.on('node added', function(nodeid) {
	tools.log('node added', {nodeid:nodeid});
	node = new Node({
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
	tools.log('node ready', {nodeId: nodeid}, nodeinfo);
	
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

zwave.on('value added', function(nodeid, commandclass, value){
	tools.log(
		'value added',
		{nodeId: nodeid},
		{command: commandclass},
		{value: value});

	if (!nodes[nodeid].classes[commandclass]) {
		nodes[nodeid].classes[commandclass] = {};
	}

	if (nodes[nodeid].genre != 'system') {
		intensity = 10;
		zwave.enablePoll(nodeid, commandclass, intensity);
	} else {
		zwave.disablePoll(nodeid, commandclass);
	}
	command = new Command(value);
	command.save();
	nodes[nodeid].classes[commandclass][value.index] = value;
});

zwave.on('value changed', function(nodeid, commandclass, value){
	tools.log(
		'value changed',
		{nodeId: nodeid},
		{command: commandclass},
		{value: value});

	nodes[nodeid].ready = true;
	command = new Command(value);
	command.save();
	nodes[nodeid].classes[commandclass][value.index] = command;
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

process.on('SIGINT', function() {
	zwave.disconnect(process.env.ZWV_DEVICE);
	process.exit();
});