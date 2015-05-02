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

			// websocket.io.set('close timeout', 60);
			// websocket.io.set('heartbeat timeout', 60);
			websocket.io.sockets.on('connection', function(socket) {

				console.log(socket.handshake.headers.cookie.split("sessionid=")[1].split(";")[0]);

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

				//New Emit for TouchTap
				socket.on('touchtap', function(data) {
					//console.log()
					data = {
						"data": data,
						"id": socket.id
					}
					websocket.io.emit('touchtap', data);
				})
			});
		}
	},


	setTcp: function(tcp) {
		websocket.tcp = tcp;
	}
}

exports.socket = websocket;