// tools.js contains functions to help the developer like: create log board,
// format text.
var _CONSOLE_SIZE = 80
module.exports = {
	logTitle: function(title) {
		console.log("=".repeat(_CONSOLE_SIZE))
		if (title.length < _CONSOLE_SIZE) {
			spaces = Math.round((_CONSOLE_SIZE - title.length) / 2)
			console.log(" ".repeat(spaces) + title)
		} else {
			console.log(title)
		}
		console.log("=".repeat(_CONSOLE_SIZE))
	},
	logBottom: function() {
		console.log("-".repeat(_CONSOLE_SIZE))	
	},
	log: function(title, args_content) {
		module.exports.logTitle(title)
		if (arguments.length > 1) {
			for (var i = 1; i < arguments.length; i++) {
				console.log(arguments[i])
			}
		}
		module.exports.logBottom()
	}
}