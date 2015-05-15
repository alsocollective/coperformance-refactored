var controllers = {};

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

	//Only need to define this once. I should get it earlier maybe?
	// <<<<<<< HEAD
	// 	// document.getElementById("planet").style.height = $(document).width() - 200;
	// 	// document.getElementById("planet").style.width = $(document).width() - 200;

	// 	// document.getElementById("planet2").style.height = $(document).width() - 200;
	// 	// document.getElementById("planet2").style.width = $(document).width() - 200;
	// =======
	// 	//document.getElementById("planet").style.height = $(document).width() - 200;
	// 	//document.getElementById("planet").style.width = $(document).width() - 200;

	// 	//document.getElementById("planet2").style.height = $(document).width() - 200;
	// 	//document.getElementById("planet2").style.width = $(document).width() - 200;
	// >>>>>>> 7ea0802f013099e136fa807af0a71402e76b6a05

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

	console.log($(document).width());
	console.log(document.getElementById("planet"));

	//setTimeout(function() {
	var docSize = $(document).width();

	console.log("DOC SIZE " + docSize);


	$("#planet").height(docSize);
	$("#planet").width(docSize);
	//}, 0)

	//Only need to define this once. I should get it earlier maybe?
	// <<<<<<< HEAD
	// 	// document.getElementById("planet").style.height = $(document).width() - 120;
	// 	// document.getElementById("planet").style.width = $(document).width() - 120;

	// 	// document.getElementById("planet2").style.height = $(document).width() - 120;
	// 	// document.getElementById("planet2").style.width = $(document).width() - 120;
	// =======
	// 	//document.getElementById("planet").style.height = ($(document).width() - 120) + "px";
	// 	//document.getElementById("planet").style.width = ($(document).width() - 120) + "px";

	// 	//document.getElementById("planet2").style.height = $(document).width() - 120;
	// 	//document.getElementById("planet2").style.width = $(document).width() - 120;
	// >>>>>>> 7ea0802f013099e136fa807af0a71402e76b6a05

	// document.getElementsByClassName("spheres").style.height = $(document).width() - 120;
	// document.getElementsByClassName("spheres").style.width = $(document).width() - 120;

	// $(".planet").style.height = $(document).width() - 120;
	// $(".planet").style.width = $(document).width() - 120;

	$("#ready").click(function() {
		console.log("this");

		controllers.extract($scope, Socket, User);
	});
}

controllers.extract = function($scope, Socket, User) {

	// delete controllers.pair();

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

	//$("#nested_container").switchClass("intro", "extract");

	window.addEventListener("devicemotion", onMotionEvent, true);

	var percent = document.getElementById("percent");
	var debug = document.getElementById("debug");
	//var block = document.getElementById("touchblock");
	var fuel = document.getElementById("gauge");
	var mvgAvg = null;
	var tapNum = 0;


	// Frontend Work

	function onMotionEvent(event) {

		var z = event.accelerationIncludingGravity.z;

		event.preventDefault();

		mvgAvg = (z * 0.4) + (mvgAvg * (1 - 0.4));

		if ((Math.abs(mvgAvg - z)) > 6) {
			//console.log("tap");
			tapNum++
			fuel.style.height = $(document).height() * (tapNum / 100) + "px";
			//console.log(tapNum);
			percent.innerHTML = (tapNum / $(document).height()) * 100 + "%";

			fuel.style.height = (tapNum / $(document).height()) * 100 + "px";

			console.log(tapNum);
			console.log($(document).height() * (tapNum / 100) + "px");
			console.log($(document).height());
			console.log((tapNum / $(document).height()) * 100);

		} else if (tapNum != User.data.percent && tapNum % 10 == 0) {
			User.data.setPosition(tapNum);
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

	// This is within the controllers namespace.

	$(window).bind('touchstart', function(e) {

		e.preventDefault();

		//debug.innerHTML = "Debug:" + Math.round(e.changedTouches[0].pageX) + "<b> : x</b><br>" + Math.round(e.changedTouches[0].pageY) + "<b> : y</b>";

		User.data.setPosition(e.originalEvent.changedTouches[0].pageX, e.originalEvent.changedTouches[0].pageY);

		$(window).unbind("touchstart");



		//console.log(e);
	});

	/*$(window).bind("touchmove", function(e) {

		e.preventDefault();

		// block.style.left = e.changedTouches[0].pageX - 30;
		// block.style.top = e.changedTouches[0].pageY - 30;

		// console.log(e.targetTouches[0].pageX - 30);
		// console.log(e.targetTouches[0].pageY - 30);

		console.log(e.originalEvent.changedTouches[0].pageX);
		console.log(e.originalEvent.changedTouches[0].pageY);

		//console.log(e);

		// debug.innerHTML = "Debug:" + Math.round(e.changedTouches[0].pageX) + "<b> : x</b><br>" + Math.round(e.changedTouches[0].pageY) + "<b> : y</b>";
	});*/


	//Socket stuff to send to server

	// console.log(Math.round(e.changedTouches[0].pageX));

	controllers.socket.emit("touchtap", {



		// "x": Math.round(e.changedTouches[0].pageX),
		// "y": Math.round(e.changedTouches[0].pageY),
		// "tap": tapNum
	});

}


controllers.pair = function($scope, Socket, User) {

	//delete controllers.extract();

	//Start pair

	//Wave form matching!
	//window.removeEventListener("devicemotion", );


	console.log("Pairing Mode");
	$('input#sync-input').unbind();
	$("#sync-input").show();
	$("#sync-input").val("");
	$('input#sync-input').change(function(event) {
		console.log("INPUT CHANGE");
		checkInputValue();
	});
	//$("#nested_container").switchClass("extract", "pairing", 1000, "easeInOutQuad");
	//$("#nested_container").switchClass("extract", "pairing");

	if ($("#nested_container").hasClass("extract") == true) {
		$("#nested_container").removeClass("extract");
		$("#nested_container").addClass("pairing");
		console.log("done");
	}

	//Socket.emit("HELLO_PAIR", {"d":1})

	var tmpBack = document.getElementById("nested_container");

	//tmpBack.style.background = "#ff0";

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
		});
		controllers.socketBound = true;
	}

	$scope.planet = User.data.planet;
	$scope.occupation = User.data.occupation;

	console.log($(document).width());

	//Only need to define this once. I should get it earlier maybe?
	// document.getElementById("planet").style.height = $(document).width() - 120;
	// document.getElementById("planet").style.width = $(document).width() - 120;

	// document.getElementById("planet2").style.height = $(document).width() - 120;
	// document.getElementById("planet2").style.width = $(document).width() - 120;

	// document.getElementsByClassName("spheres").style.height = $(document).width() - 120;
	// document.getElementsByClassName("spheres").style.width = $(document).width() - 120;

	// $(".planet").style.height = $(document).width() - 120;
	// $(".planet").style.width = $(document).width() - 120;

	$("#ready").click(function() {
		console.log("this");

		controllers.extract($scope, Socket, User);
	});

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

	// console.log(Math.round(e.changedTouches[0].pageX));

	Socket.emit("touchtap", {
		// "x": Math.round(e.changedTouches[0].pageX),
		// "y": Math.round(e.changedTouches[0].pageY),
		// "tap": tapNum
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