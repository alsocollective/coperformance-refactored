var controllers = {};

controllers.home = function(Socket) {

	// window.addEventListener("devicemotion", onMotionEvent, true);
	window.addEventListener("deviceorientation", onOrientaionEvent, true);

	// setInterval(randomData, 100);

	var socket = Socket;
	var previous = new Date();


	function onOrientaionEvent(event) {
		var now = new Date();
		if (now - previous < 500) {
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
		if (now - previous < 500) {
			return false;
		}
		previous = now;
		socket.emit("diagdatain", {
			"x": event.accelerationIncludingGravity.x,
			"y": event.accelerationIncludingGravity.y,
			"z": event.accelerationIncludingGravity.z
		})
	}

	function randomData() {
		socket.emit("diagdatain", {
			"x": Math.random() * 10,
			"y": Math.random() * 10,
			"z": Math.random() * 10
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