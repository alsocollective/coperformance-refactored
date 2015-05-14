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


				// we test to see if the user has a cookie,
				// if not we give him an id
				// if they do we take their id and set it as our user  id
				var re = new RegExp("id=");
				if (!re.test(socket.handshake.headers.cookie)) {
					socket.emit('setup', {
						cookie: socket.id
					});
				} else {
					// we have an id so we set it to the socket id
					var id = socket.handshake.headers.cookie.match(/id=(.*);/);
					if (id === null) {
						id = socket.handshake.headers.cookie.match(/id=(.*)/);
					}
					socket.id = id[1];
				}

				socket.on('joinPlanet', function(data) {
					console.log(data);
					var occupation = websocket.game.planets.mars.allList.add(data.id);

				});

				socket.on('planet', function(data) {
					console.log("\n\n\n\n")
					console.log(data);

					websocket.tcp.send.planet(0, {
						"x": 0,
						"y": 1
					}, 10);
				})

				socket.on('paired', function(data) {
					console.log("\n\n");
					console.log(data);
					websocket.tcp.send.pairing(0, {
						"x": 0,
						"y": 1
					});
				})

				socket.on('sendRandom', function() {
					var data = setInterval(websocket.tcp.send.sendRandom, 100);
				})

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
					console.log(data);
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
	},
	setGame: function(game) {
		websocket.game = game;
	}

}

exports.socket = websocket;