var http = {

	init: function() {
		console.log("http starting")
		http.connect = require('connect');
		http.staticServer = require('serve-static');
		http.http = require('http');

		http.app = http.connect().use(http.staticServer(__dirname + "/http"));
		http.server = http.http.createServer(http.app);
	},
	start: function() {
		http.server.listen(8080);
		console.log("http server starting on port 8080")
	}
}

exports.http = http;