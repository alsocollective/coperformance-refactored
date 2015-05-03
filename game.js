var game = {
	init: function(socket) {
		console.log("\n\n\n---------");
		console.log("game start")
		// game.socket = socket;
		game.planets = {
			"mars": new game.planetproto("mars"),
			"earth": new game.planetproto("earth")
		}
		console.log("---------\n\n\n")
	},
	planetproto: function(name) {
		var name = name,
			occupationProto = function(name) {
				var name = name,
					list = {},
					count = function() {
						return 0;
					},
					checkForUser = function(cookie) {
						if (list[cookie]) {
							return list[cookie];
						}
						return false;
					}
					// Continue writting the function for the user lists...
			},
			allList = {
				list: {

				},
				remove: function(cookie) {

				},
				add: function(cookie) {

					// allList.list =
				},
				count: function() {

					return 0;
				}
			},
			activeMatch = {
				list: {},
				interval: null,
				init: function() {
					// activeMatch.interval = setInterval(activeMatch.search, 1000);
				},
				search: function() {
					if (activeMatch.list === {}) return false;
					console.log(name);
					for (var property in activeMatch.list) {
						console.log(activeMatch.list[property])
					}
				},
				add: function(cookie) {

				},
				remove: function(cookie) {

				},
				update: function(cookie, value) {

				}
			}
		activeMatch.init();
		// console.log(that);


	}
}

exports.game = game;