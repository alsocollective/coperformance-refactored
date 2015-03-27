copofermance.cAdmin = {
	settings: {

	},
	init: function(scope, socket) {
		//store the values
		timeApp.cAdmin.settings.scope = scope;
		timeApp.cAdmin.settings.socket = socket;

		//create the interaction
		scope.submitted = function() {
			timeApp.cAdmin.settings.socket.emit("CP", timeApp.cAdmin.settings.scope.msg);
		}

		timeApp.cAdmin.settings.scope.msg2 = "song1"; //set the default value
		scope.pushPage = function() {
			timeApp.cAdmin.settings.socket.emit("setmeta", timeApp.cAdmin.settings.scope.msg2);
		}
	}
}