module.exports = function(mongoose) {

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

    return {
        'Node': Node,
        'Command': Command
    };
};
