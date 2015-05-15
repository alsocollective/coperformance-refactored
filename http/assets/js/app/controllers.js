var controllers = {};

/* Dot on planet
BA: TCP for pair completion
AV: Gestural pairing
AV: Debugger working
*/


controllers.home = function($scope, Socket, User) {

	$scope.reset = function() {
		User.data.setPlanet(null);
		User.data.setOccupation(null);
	}
	$scope.tcpPlanet = function() {
		Socket.emit('planet', {
			"planet": 1
		});
	}
	$scope.tcpPaired = function() {
		Socket.emit('paired', {
			"planet": 0
		});
	}
	$scope.tcpSendRandom = function() {
		Socket.emit('sendRandom', {})
	}

}


function checkInputValue() {

	var syncCode = $("input#sync-input").val();

	var maxval = 4;

	console.log("CHECKING SYNC CODE INPUT " + syncCode);

	if (syncCode.length < maxval || syncCode.length > maxval) return;

	console.log("ATTEMPTING PAIR");

	controllers.socket.emit("syncpair", syncCode);

};

controllers.lobby = function($scope, Socket, User, $location) {
	$scope.planet = User.data.planet;
	$scope.occupation = User.data.occupation;

	$scope.setPlanet = function() {
		console.log($scope.planet);
		User.data.setPlanet($scope.planet);
	}
	$scope.clickPlanet = function(planet) {
		User.data.setPlanet(planet);
		console.log(User.data.planet);
		Socket.emit("joinPlanet", {
			planet: User.data.planet
		})
	}
	$scope.setOccupation = function() {
		console.log($scope.occupation);
		User.data.setOccupation($scope.occupation);
	}

	Socket.on("makeOccupation", function(msg) {
		User.data.setOccupation(msg);
	})
}

controllers.planet = function($scope, Socket, User) {
	$scope.planet = User.data.planet;
	$scope.occupation = User.data.occupation;

	$scope.currentPage = window.location.hash.split("/")[1];

	$scope.clickOccupation = function(occupation) {
		User.data.setOccupation(occupation);
	}

}


// User Actions

controllers.human = function($scope, Socket, User) {
	console.log("human")
	console.log(controllers.socketBound);
	if (controllers.socketBound === undefined) {
		console.log("setting up socket!")
		controllers.socket = Socket;
		controllers.syncCode = "";
		controllers.socket.on("sync", function(data) {
			controllers.syncCode = data;
			console.log(" RECEIVED SYNC CODE  " + controllers.syncCode);
			$("#pairnow").text("Pair Now \n " + controllers.syncCode);
		});
		controllers.socket.on("pairsuccess", function(data) {
			console.log("PAIR SUCCESS " + data);
			$("#sync-input").hide();
			$("#pairnow").text("PAIR SUCCESS");
		});
		controllers.socketBound = true;
	}

	$scope.planet = User.data.planet;
	$scope.occupation = User.data.occupation;

	$("#ready").click(function() {
		console.log("this");

		controllers.extract($scope, Socket, User);
	});
}

controllers.extract = function($scope, Socket, User) {

	console.log("Extract Mode");

	//Bind events here first once only...

	if ($("#nested_container").hasClass("intro") == true) {
		$("#nested_container").removeClass("intro");
		$("#nested_container").addClass("extract");
		console.log("done");
	} else if ($("#nested_container").hasClass("pairing") == true) {
		$("#nested_container").removeClass("pairing");
		$("#nested_container").addClass("extract");
		console.log("done2");

	}

	window.addEventListener("devicemotion", onMotionEvent, true);

	var percent = document.getElementById("percent");
	var debug = document.getElementById("debug");
	var fuel = document.getElementById("gauge");
	var mvgAvg = null;
	var tapNum = 0;


	// Frontend Work

	function onMotionEvent(event) {

		var z = event.accelerationIncludingGravity.z;

		event.preventDefault();

		mvgAvg = (z * 0.4) + (mvgAvg * (1 - 0.4));

		if ((Math.abs(mvgAvg - z)) > 6) {

			tapNum++

			var mapped = (tapNum - 0) * ($(document).height() - 0) / (100 - 0) + 0;

			fuel.style.height = $(document).height() * (tapNum / 100) + "px";
			percent.innerHTML = Math.ceil((mapped / $(document).height()) * 100) + "%";

		} else if (tapNum != User.data.percent && tapNum % 10 == 0) {
			User.data.setPercent(tapNum);
			Socket.emit("touchtap", {
				"planet": User.data.planet,
				"occupation": User.data.occupation,
				"x": Math.floor(User.data.x),
				"y": Math.floor(User.data.y),
				"percent": tapNum
			});
		} else if (tapNum > 100) {
			tapNum = 0;
			removeEvent();
			controllers.pair($scope, Socket, User);
		} else {

		}
	}

	$("#pair").unbind(); //Maybe run this once upon init.

	$("#pair").click(function() {
		removeEvent();
		controllers.pair($scope, Socket, User);
	});

	function removeEvent() {
		fuel.style.height = 0;
		window.removeEventListener("devicemotion", onMotionEvent, true);
	}


	//Frontend Touch Events

	/*
	This would look great with an animation
	*/

	$(window).bind('touchstart', function(e) {

		e.preventDefault();

		User.data.setPosition(Math.round(e.originalEvent.changedTouches[0].pageX), Math.round(e.originalEvent.changedTouches[0].pageY));

		$("#touchdot").css({
			left: +e.originalEvent.changedTouches[0].pageX - 20
		});

		$("#touchdot").css({
			top: +e.originalEvent.changedTouches[0].pageY - 20
		});

		$(window).unbind("touchstart");

	});
}


controllers.pair = function($scope, Socket, User) {

	console.log("Pairing Mode");
	$('input#sync-input').unbind();
	$("#sync-input").show();
	$("#sync-input").val("");
	$('input#sync-input').change(function(event) {
		console.log("INPUT CHANGE");
		checkInputValue();
	});

	if ($("#nested_container").hasClass("extract") == true) {
		$("#nested_container").removeClass("extract");
		$("#nested_container").addClass("pairing");
		console.log("done");
	}

	var tmpBack = document.getElementById("nested_container");

	controllers.socket.emit("pair", {
		// "x": Math.round(e.changedTouches[0].pageX),
		// "y": Math.round(e.changedTouches[0].pageY),
		// "tap": tapNum
	});

	$("#pairnow").unbind();

	$("#pairnow").click(function() {
		controllers.extract($scope, Socket, User);
	});
}



//This object is potentially redundant

controllers.nature = function($scope, Socket, User) {
	console.log("nature");
	if (controllers.socketBound) {
		console.log("setting up socket!")
		controllers.socket = Socket;
		controllers.syncCode = "";
		controllers.socket.on("sync", function(data) {
			controllers.syncCode = data;
			console.log(" RECEIVED SYNC CODE  " + controllers.syncCode);
			$("#pairnow").text("Pair Now \n " + controllers.syncCode);
		});
		controllers.socket.on("pairsuccess", function(data) {
			console.log("PAIR SUCCESS " + data);
			$("#sync-input").hide();
			$("#pairnow").text("PAIR SUCCESS");

			//Send them back to extract
			controllers.extract($scope, Socket, User);

		});
		controllers.socketBound = true;
	}

	$scope.planet = User.data.planet;
	$scope.occupation = User.data.occupation;

	console.log($(document).width());

	$("#ready").click(function() {
		console.log("this");

		controllers.extract($scope, Socket, User);
	});

}


controllers.diagnosticsout = function(Socket) {

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