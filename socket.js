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
			websocket.io.set('close timeout', 60);
			websocket.io.set('heartbeat timeout', 60);
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

			websocket.io.set('authorization', function(handshakeData, accept) {
				console.log("\n\n\n");
				console.log(handshakeData.headers.cookie.split(" ")[1].split("=")[1]);
				console.log("\n\n\n");
				console.log(accept);
				console.log("\n\n\n");

				// if (handshakeData.headers.cookie) {

				// 	handshakeData.cookie = cookie.parse(handshakeData.headers.cookie);

				// 	handshakeData.sessionID = connect.utils.parseSignedCookie(handshakeData.cookie['express.sid'], 'secret');

				// 	if (handshakeData.cookie['express.sid'] == handshakeData.sessionID) {
				// 		return accept('Cookie is invalid.', false);
				// 	}

				// } else {
				// 	return accept('No cookie transmitted.', false);
				// }

				// accept(null, true);
			});
		}
	},
	setTcp: function(tcp) {
		websocket.tcp = tcp;
	}
}

exports.socket = websocket;