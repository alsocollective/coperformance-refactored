var factories = {};

factories.Socket = function($rootScope, $location) {

	var socket = io.connect("http://192.168.0.105:8080");


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

copofermance.factory(factories);