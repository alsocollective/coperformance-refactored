var controllers = {};

controllers.home = function($scope, Socket, User) {

	$scope.reset = function() {
		User.data.setPlanet(null);
		User.data.setOccupation(null);
	}
	$scope.tcpPlanet = function() {
		console.log("yep");
		Socket.emit('planet', {
			"planet": "earth"
		})
	}
}

controllers.lobby = function($scope, Socket, User) {
	$scope.planet = User.data.planet;
	$scope.occupation = User.data.occupation;
	$scope.setPlanet = function() {
		console.log($scope.planet);
		User.data.setPlanet($scope.planet);
	}
	$scope.clickPlanet = function(planet) {
		User.data.setPlanet(planet);
	}
	$scope.setOccupation = function() {
		console.log($scope.occupation);
		User.data.setOccupation($scope.occupation);
	}

}

controllers.planet = function($scope, Socket, User) {
	$scope.planet = User.data.planet;
	$scope.occupation = User.data.occupation;

	$scope.currentPage = window.location.hash.split("/")[1];

	$scope.clickOccupation = function(occupation) {
		User.data.setOccupation(occupation);
	}
}

controllers.human = function($scope, Socket, User) {
	$scope.planet = User.data.planet;
	$scope.occupation = User.data.occupation;
}

controllers.nature = function($scope, Socket, User) {
	$scope.planet = User.data.planet;
	$scope.occupation = User.data.occupation;
}


//(Rev 1.0 of Tap)

controllers.taptest = function($scope, Socket, User) {

	window.addEventListener("devicemotion", onMotionEvent, true);

	var percent = document.getElementById("percent");
	var debug = document.getElementById("debug");
	var block = document.getElementById("touchblock");
	var fuel = document.getElementById("gauge");
	var mvgAvg = null;
	var tapNum = 0;


	// Frontend Work

	function onMotionEvent(event) {

		var z = event.accelerationIncludingGravity.z;

		event.preventDefault();

		mvgAvg = (z * 0.4) + (mvgAvg * (1 - 0.4));

		if ((Math.abs(mvgAvg - z)) > 6) {
			console.log("tap");
			tapNum++
			fuel.style.height = $(document).height() * (tapNum / 100) + "px"
			console.log(tapNum);
			percent.innerHTML = $(document).height() * (tapNum / 100) + "px"

		} else if (tapNum > 100) {
			tapNum = 0;
		} else {

		}
	}


	//Frontend Touch Events

	document.body.addEventListener('touchstart', function(e) {

		debug.innerHTML = "Debug:" + Math.round(e.changedTouches[0].pageX) + "<b> : x</b><br>" + Math.round(e.changedTouches[0].pageY) + "<b> : y</b>";

		block.style.left = e.changedTouches[0].pageX - 30;
		block.style.top = e.changedTouches[0].pageY - 30;

	}, false)

	block.addEventListener("touchmove", function(e) {

		block.style.left = e.changedTouches[0].pageX - 30;
		block.style.top = e.changedTouches[0].pageY - 30;

		debug.innerHTML = "Debug:" + Math.round(e.changedTouches[0].pageX) + "<b> : x</b><br>" + Math.round(e.changedTouches[0].pageY) + "<b> : y</b>";

	}, false);


	//Socket stuff to send to server

	socket.emit("touchtap", {
		"x": Math.round(e.changedTouches[0].pageX),
		"y": Math.round(e.changedTouches[0].pageY),
		"tap": tapNum
	});
}


controllers.diagnosticsout = function(Socket) {
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