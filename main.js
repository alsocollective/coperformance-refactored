var app = {
	init: function() {
		console.log("starting server:");
		if (http) {
			http.init();
		}
		if (socket) {
			socket.startServer(http);
		}
		// if (tcp) {
		// 	tcp.init()
		// }
	}
};

http = require('./http').http;
tcp = require('./tcp').tcp;
socket = require('./socket').socket;
users = require('./users').users

app.init();