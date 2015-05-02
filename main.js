var app = {
	init: function() {
		if (http) {
			http.init();
		}
		if (socket) {
			socket.startServer(http);
		}
		// if (tcp) {
		// 	tcp.init()
		// }
		if (game && socket) {
			game.init(socket);
		}
	}
};

http = require('./http').http;
tcp = require('./tcp').tcp;
socket = require('./socket').socket;
users = require('./users').users
game = require('./game').game
app.init();