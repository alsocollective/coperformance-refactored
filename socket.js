var websocket = {
	tcp: null,
	startServer: function(httpserver) {
		websocket.io = require('socket.io')(httpserver.server);
		httpserver.start();
		websocket.views.init();
	},
	views: {
		init: function() {
			// websocket.io.set("log level", 4);
			// websocket.io.set("close timeout", 3000);
			// websocket.io.set("log level", 4);

			websocket.io.sockets.on('connection', function(socket) {
				socket.emit('news', {
					hello: 'world'
				});
				socket.on('my other event', function(data) {
					console.log(data);
				});

				socket.on('diagdatain', function(data) {
					console.log("d in \t" + socket.id + "\t" + data.x + "\t" + new Date())
					data = {
						"data": data,
						"id": socket.id
					}
					websocket.io.emit('diagdata', data);
				})


			});
		}
	},
	setTcp: function(tcp) {
		websocket.tcp = tcp;
	}
}

exports.socket = websocket;