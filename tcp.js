var tcp = {
	lib: {},
	tcp: null,
	socket: null,

	init: function() {
		tcp.lib.StringDecoder = require('string_decoder').StringDecoder;
		tcp.lib.net = require('net');
		tcp.lib.decoder = new tcp.lib.StringDecoder('utf8');
		tcp.setupTCP();

		// setInterval(tcp.send.beat, 500);
		tcp.tcp.listen(5000, function() {
			console.log('TCP running at port 5000\n');
		});
	},


	setupTCP: function() {
		tcp.tcp = tcp.lib.net.createServer(function(socket) {
			tcp.recive.connect();
			socket.on('end', tcp.recive.end);
			socket.on('data', tcp.recive.data);
			socket.on('error', tcp.recive.error);
			tcp.socket = socket;
		});
	},


	recive: {
		connect: function() {
			console.log('connected TCP');
			console.log("connection message -- some one connected");
		},
		end: function() {
			console.log('disconnected TCP');
			tcp.socket = null;
		},
		data: function(data) {
			var msg = tcp.lib.decoder.write(data);
			console.log(JSON.parse(msg));
		},
		error: function(error) {
			console.log(error);
		}
	},


	send: {
		beat: function() {
			if (!tcp.socket) {
				console.log("no app.socket")
				return false;
			}
			console.log("beat");
			var str = JSON.stringify({
				title: 'test',
				msg: 'did you get it ?'
			}) + "\n";

			tcp.socket.write(str + "\n");
		},

		planet: function(planet, location, percent, occupation) {
			if (!tcp.socket) {
				console.log("no app.socket")
				return false;
			}
			var str = JSON.stringify({
				type: 'planet',
				planet: planet,
				x: location.x,
				y: location.y,
				percent: percent,
				occupation: occupation
			})
			tcp.socket.write(str + "\n");
		},

		pairing: function(planet, location, occupation) {
			if (!tcp.socket) {
				console.log("no app.socket")
				return false;
			}
			var str = JSON.stringify({
				type: 'paring',
				planet: planet,
				x: location.x,
				y: location.y
			})
			tcp.socket.write(str + "\n");
		},

		sendRandom: function() {
			if (!tcp.socket) {
				console.log("no app.socket")
				return false;
			}
			var planet = Math.floor(Math.random() * 2),
				location = {
					x: Math.random(),
					y: Math.random()
				},
				percent = Math.random();

			if (Math.random() > 0.5) {
				var str = JSON.stringify({
					type: 'paring',
					planet: planet,
					x: location.x,
					y: location.y
				})
			} else {
				var str = JSON.stringify({
					type: 'planet',
					planet: planet,
					x: location.x,
					y: location.y,
					percent: percent
				})
			}
			tcp.socket.write(str + "\n");
		}


	}
}

exports.tcp = tcp;