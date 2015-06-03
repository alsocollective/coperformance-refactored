var controllers = {};

controllers.home = function(Socket) {

	var gamma, beta, alpha;

	window.addEventListener("devicemotion", onMotionEvent, true);
	window.addEventListener('deviceorientation', onOrientaionEvent, true);

	var socket = Socket;
	var previous = new Date();


	function onOrientaionEvent(event) {

		gamma = event.gamma;
		beta = event.beta;
		alpha = event.alpha;
	}



	function onMotionEvent(event) {
		var now = new Date();
		if (now - previous < 100) {
			return false;
		}
		previous = now;

		//Vibration
		//navigator.vibrate([500, 250, 500]);

		console.log(event.accelerationIncludingGravity.x + "***");


		var uag = navigator.userAgent;
		var deviceInfo = navigator.appCodeName + "  |  " + navigator.appName + "  |  " + navigator.appVersion + "  |  " + navigator.cookieEnabled + "  |  " + navigator.language + "  |  " + navigator.onLine + "  |  " + navigator.platform;
		var hard = screen.width + "  |  " + screen.height + "  |  " + screen.pixelDepth + "  |  " + screen.availHeight + "  |  " + screen.availWidth + "  |  " + screen.colorDepth;

		var support = window.DeviceOrientationEvent;

		console.log(gamma);

		socket.emit("diagdatain", {
			"x": event.accelerationIncludingGravity.x,
			"y": event.accelerationIncludingGravity.y,
			"z": event.accelerationIncludingGravity.z,
			"uag": uag,
			"device": deviceInfo,
			"hardware": hard,
			"support": support,
			"gamma": gamma,
			"beta": beta,
			"alpha": alpha,
		})
	}
}

controllers.diagnostics = function(Socket) {
	copofermance.diagnostics.init(Socket);
}

copofermance.controller(controllers);