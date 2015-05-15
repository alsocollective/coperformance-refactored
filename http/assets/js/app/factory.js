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

// user will check what user then are, if they have already been to the site (via cookies)
// if previouse user they will be redirect to the correct page
factories.User = function($cookies, $location, Socket) {
	var factory = {
		init: function() {
			//check if the user has been to the site before
			// it returns the appropiate location to be redirected to
			// console.log("redirect to: " + factory.data.checkForCookies());
			Socket.on("setup", function(msg) {
				$cookies.id = msg.cookie;
			})
			$location.path(factory.data.checkForCookies());
		},
		redirect: function() {
			$location.path("/test")
		},
		data: {
			planet: null,
			occupation: null,
			checkForCookies: function() {
				factory.data.planet = $cookies.planet;
				factory.data.occupation = $cookies.occupation;
				if (!factory.data.planet) {
					return "/lobby";
				} else {
					if (factory.data.occupation) {
						return "/" + factory.data.planet + "/" + factory.data.occupation;
					}
					return "/" + factory.data.planet;
				}
			},
			setPlanet: function(data) {
				$cookies.planet = data;
				factory.data.planet = data;
			},
			setOccupation: function(data) {
				$cookies.occupation = data;
				factory.data.occupation = data;
			},
		}
	};

	factory.init();

	return factory;
}

copofermance.factory(factories);