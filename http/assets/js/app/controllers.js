var controllers = {};

controllers.home = function(Socket) {

	window.addEventListener("devicemotion", onMotionEvent, true);
	// window.addEventListener("deviceorientaion", onOrientaionEvent, true);

	var socket = Socket;
	var previous = new Date();


	function onOrientaionEvent(event) {
		var now = new Date();
		if (now - previous < 100) {
			return false;
		}
		previous = now;
		socket.emit("diagdatain", {
			"x": event.gamma,
			"y": event.alpha,
			"z": event.beta
		})
	}

	function onMotionEvent(event) {
		var now = new Date();
		if (now - previous < 100) {
			return false;
		}
		previous = now;

		//Vibration
		//navigator.vibrate([500, 250, 500]);



		var uag = navigator.userAgent;
		var deviceInfo = navigator.appCodeName + "  |  " + navigator.appName + "  |  " + navigator.appVersion + "  |  " + navigator.cookieEnabled + "  |  " + navigator.language + "  |  " + navigator.onLine + "  |  " + navigator.platform;
		var hard = screen.width + "  |  " + screen.height + "  |  " + screen.pixelDepth + "  |  " + screen.availHeight + "  |  " + screen.availWidth + "  |  " + screen.colorDepth;

		socket.emit("diagdatain", {
			"x": event.accelerationIncludingGravity.x,
			"y": event.accelerationIncludingGravity.y,
			"z": event.accelerationIncludingGravity.z,
			"uag": uag,
			"device": deviceInfo,
			"hardware": hard,
		})
	}
}

controllers.diagnostics = function(Socket) {
	copofermance.diagnostics.init(Socket);
	// if (timeApp.diagnostics) {
	// 	timeApp.communication.exitfunction = timeApp.diagnostics.onexit;
	// 	timeApp.diagnostics.init(Socket);
	// }
}

copofermance.controller(controllers);