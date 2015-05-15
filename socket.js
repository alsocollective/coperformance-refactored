var websocket = {
	socketCodes: {},
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
					console.log("initial Connect");
					socket.emit('setup', {
						cookie: socket.id
					});
				} else {
					// we have an id so we set it to the socket id
					console.log("reconnect");
					var id = socket.handshake.headers.cookie.match(/id=([a-z A-Z 0-9 \-\_]*)/);
					console.log(id[1]);
					if (id === null) {
						id = socket.handshake.headers.cookie.match(/id=(.*)/);
					}
					socket.id = id[1];
				}

				socket.on('joinPlanet', function(data, responce) {
					var job = websocket.game.planets[data.planet].allList.add(socket.id);
					console.log(job);
					socket.emit("makeOccupation", job)
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


				socket.on('pair', function(data) {

					console.log("requesting pair code");
					var syncCode = ("" + Math.random()).substring(2, 6);
					while (syncCode in websocket.socketCodes) {
						syncCode = ("" + Math.random()).substring(2, 6);
					}
					var sockt = socket;
					//websocket.socketCodes[syncCode] = [websocket.io.sockets.sockets[socket.id], null];
					websocket.socketCodes[syncCode] = [sockt, null];

					socket.syncCode = syncCode;


					console.log("returning sync code " + syncCode);

					socket.emit("sync", syncCode);


				});

				socket.on('syncpair', function(code) {

					if (code != "") {

						console.log("received 'syncpair' with code " + code);

						if (code in websocket.socketCodes) {
							//TODO some how send the data of the users to the tcp
							var sockt = socket; //websocket.io.sockets.sockets[socket.id];
							console.log("FOUND CODE '" + code + "' IN LIST ");
							websocket.socketCodes[code][1] = sockt;

							//console.log(" SOCKET CODES ");
							//console.log(socketCodes);

							websocket.socketCodes[code][0].emit("pairsuccess", "1");
							websocket.socketCodes[code][1].emit("pairsuccess", "2");
							// websocket.tcp.send.pairing(planet, location, occupation);

						}

					}



				});

				//New Emit for TouchTap
				socket.on('touchtap', function(data) {
					console.log(data);
					var planet = 0,
						location = {
							"x": data.x,
							"y": data.y
						},
						occupation = 0

					if (data.planet == "earth") {
						planet = 1
					}
					if (data.occupation == "nature") {
						occupation = 1
					}
					websocket.tcp.send.planet(planet, location, data.percent, occupation)
					// console.log(data);
					// data = {
					// 	"data": data,
					// 	"id": socket.id
					// }
					// websocket.io.emit('touchtap', data);
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