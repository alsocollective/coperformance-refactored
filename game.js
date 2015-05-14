var game = {
	init: function(socket) {
		game.socket = socket;
		console.log("\n\n\n---------");
		console.log("game start")
		// game.socket = socket;
		game.planets = {
			"mars": new game.planetproto("mars"),
			"earth": new game.planetproto("earth")
		}

		console.log("---------\n\n\n")

		console.log("planet count");
		console.log(game.planets.mars.allList.count());
		game.planets.mars.allList.add("bohdan");
		game.planets.mars.allList.add("taffy");

	},

	addUser: function(id) {

	},

	planetproto: function(name) {
		this.name = name,
		this.occupationProto = function(name) {
			this.name = name,
			this.list = {
				"random": "som",
				"thing": "yep"
			},
			this.count = function() {
				var out = 0;
				for (var property in this.list) {
					++out;
				}
				return out;
			},
			this.addUser = function(cookie) {
				this.list[cookie] = true;
				// WE need socket here! TODO fix this maybe...
				if (game.socket) {
					game.socket.io.emit("setPlanet", {
						user: cookie,
						planet: this.name
					})
				};
			},
			this.checkForUser = function(cookie) {
				if (this.list[cookie]) {
					return this.list[cookie];
				}
				return false;
			},
			this.removeUser = function(cookie) {

			}
		},
		this.allList = {
			list: {
				"nature": new this.occupationProto("nature"),
				"human": new this.occupationProto("human")
			},
			remove: function(cookie) {

			},
			add: function(cookie) {
				if (this.list.nature.count() < this.list.human.count()) {
					this.list.human.addUser(cookie);
				} else {
					this.list.nature.addUser(cookie);
				}
				// add to lower one

				// allList.list =
			},
			count: function() {
				return this.list.human.count() + this.list.nature.count();
			}
		},
		this.activeMatch = {
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
		this.activeMatch.init();

		// console.log(that);
	}
}

exports.game = game;