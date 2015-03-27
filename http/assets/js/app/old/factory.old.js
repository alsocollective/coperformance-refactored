var factories = {};

factories.Socket = function($rootScope, $location) {

	var socket = io.connect("http://localhost:8080");


	return {
		on: function(eventName, callback) {
			socket.on(eventName, function(msg) {
				$rootScope.$apply(function() {
					callback.apply(socket, [msg]);
				});
			});
		},
		onunbind: function(eventName) {
			socket.removeAllListeners(eventName);
		},
		emit: function(eventName, data, callback) {
			socket.emit(eventName, data, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					if (callback) {
						callback.apply(socket, args);
					}
				});
			})
		}
	};
}

factories.CurrentPage = function(Socket, Userset) {
	var factory = {};
	factory.page = "";
	factory.meta = null;
	factory.getMeta = function() {
		if (!factory.meta) {
			// Socket.emit("getmeta", "")
			// console.log("meta: " + factory.meta)
			// return "song1" + Userset.getUserSub();
			return "";
		} else {
			//return factory.meta + Userset.getUserSub();
			return factory.meta;
		}
	}

	return factory;
}

factories.Userset = function($cookies, Socket, $location, SongSets) {
	var factory = {};
	factory.ticket = null;
	factory.subuser = null;
	factory.red = false;

	factory.newRed = function(msg) {
		if (factory.ticket == msg) {
			factory.red = true;
			$("#main_container").addClass("red");
		} else if (factory.red) {
			factory.red = false;
			$("#main_container").removeClass("red");
		}
	}

	factory.getUserSub = function() {
		if (factory.subuser != null) {
			return "-" + factory.subuser;
		} else {
			factory.subuser = (factory.ticket.charCodeAt(0) % 2);
			factory.downloadImages("-" + factory.subuser);
			return "-" + factory.subuser;
		}
	}
	factory.downloadImages = function(subuser) {
		return false;
		var imagesToLoad = [];
		var imageSetSizes = [9, 9, 9, 9, 9] //TODO actually set the proper number of images in here...
		for (var a = 1, maxa = 3; a <= maxa; ++a) {
			for (var b = 0, maxb = imageSetSizes[a - 1]; b <= maxb; ++b) {
				var item = new Image();
				item.src = ("/public/content/song" + a + subuser + "/" + b + ".png");
			}
		}
		SongSets.preloadImages();
	}
	return factory;
}

factories.SongSets = function() {
	var factory = {
		songs: {
			"song1": {
				title: "eshu",
				english: "trickster",
				backgroundImage: "/public/content/albumbbackground/song1.jpg",
				description: "description",
				type: "tap"
			},
			"song2": {
				title: "pa bailar",
				english: "lets go dance",
				backgroundImage: "/public/content/albumbbackground/song2.jpg",
				description: "description",
				type: "slide"
			},
			"song3": {
				title: "cimarron",
				english: "excape to freedom",
				backgroundImage: "/public/content/albumbbackground/song3.jpg",
				description: "description",
				type: "slide"
			},
			"song4": {
				title: "complica",
				english: "complicated",
				backgroundImage: "/public/content/albumbbackground/song3.jpg",
				description: "description",
				type: "shake"
			},
			"song5": {
				title: "asi vengo yo",
				english: "here I come",
				backgroundImage: "/public/content/albumbbackground/song3.jpg",
				description: "description",
				type: "slide"
			}
		}
	};
	factory.preloadImages = function() {
		for (var key in factory.songs) {
			var item = new Image();
			item.src = factory.songs[key].backgroundImage;
		}
	}

	return factory;
}

timeApp.factory(factories);