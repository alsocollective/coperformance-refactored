var websocket = {
	tcp: null,
	startServer: function(httpserver) {
		websocket.io = require('socket.io')(httpserver.server);
		httpserver.start();
		websocket.views.init();
	},
	views: {
		init: function() {
			websocket.io.sockets.on('connection', function(socket) {
				socket.emit('news', {
					hello: 'world'
				});
				socket.on('my other event', function(data) {
					console.log(data);
				});
				console.log('a user connected');
			});
		}
	},
	setTcp: function(tcp) {
		websocket.tcp = tcp;
	}
}

exports.socket = websocket;