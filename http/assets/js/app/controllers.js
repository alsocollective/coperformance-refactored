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
    
    controllers.socket = Socket;
    
    controllers.syncCode = "";
    
    controllers.socket.on("sync", function(data) {
        
        
        
        
        controllers.syncCode = data;
        
        console.log(" RECEIVED SYNC CODE  " + controllers.syncCode);
        
        $("#pairnow").text("Pair Now \n " + controllers.syncCode);
        
        //$("#pairnow").parent().append("");
        
    });
    
    controllers.socket.on("pairsuccess", function(data) {
        
       
        console.log("PAIR SUCCESS " + data);
        
        
        $("#sync-input").hide();
        $("#pairnow").text("PAIR SUCCESS");
        //console.log(data); 
        
    });
    
    

}


function checkInputValue() {

   var syncCode = $("input#sync-input").val();

   var maxval = 4;
   
   console.log("CHECKING SYNC CODE INPUT " + syncCode);

   if (syncCode.length < maxval || syncCode.length > maxval) return;

   console.log("ATTEMPTING PAIR");
   
   controllers.socket.emit("syncpair", syncCode);

};

controllers.lobby = function($scope, Socket, User) {
	$scope.planet = User.data.planet;
	$scope.occupation = User.data.occupation;

	//Only need to define this once. I should get it earlier maybe?
	document.getElementById("planet").style.height = $(document).width() - 200;
	document.getElementById("planet").style.width = $(document).width() - 200;

	document.getElementById("planet2").style.height = $(document).width() - 200;
	document.getElementById("planet2").style.width = $(document).width() - 200;

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
	$scope.planet = User.data.planet;
	$scope.occupation = User.data.occupation;

	console.log($(document).width());

	//Only need to define this once. I should get it earlier maybe?
	document.getElementById("planet").style.height = $(document).width() - 120;
	document.getElementById("planet").style.width = $(document).width() - 120;

	document.getElementById("planet2").style.height = $(document).width() - 120;
	document.getElementById("planet2").style.width = $(document).width() - 120;

	// document.getElementsByClassName("spheres").style.height = $(document).width() - 120;
	// document.getElementsByClassName("spheres").style.width = $(document).width() - 120;

	// $(".planet").style.height = $(document).width() - 120;
	// $(".planet").style.width = $(document).width() - 120;

	$("#ready").click(function() {
		console.log("this");

		controllers.extract();
	});

}

controllers.extract = function($scope, Socket, User) {

	delete controllers.pair();

	console.log("Extract Mode");

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
	var block = document.getElementById("touchblock");
	var fuel = document.getElementById("gauge");
	var mvgAvg = null;
	var tapNum = 0;
    
    
    $('input#sync-input').change(function(event) {
        
        console.log("INPUT CHANGE"); 
        checkInputValue();
        
    });
    

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
			percent.innerHTML = $(document).height() * (tapNum / 100) + "%"

		} else if (tapNum > 100) {
			tapNum = 0;
			removeEvent();
			controllers.pair();
		} else {

		}
	}

	$("#pair").click(function() {
		removeEvent();
		controllers.pair();
	});

	function removeEvent() {
		fuel.style.height = 0;
		window.removeEventListener("devicemotion", onMotionEvent, true);
	}


	//Frontend Touch Events

	/*document.body.addEventListener('touchstart', function(e) {

		debug.innerHTML = "Debug:" + Math.round(e.changedTouches[0].pageX) + "<b> : x</b><br>" + Math.round(e.changedTouches[0].pageY) + "<b> : y</b>";

		block.style.left = e.changedTouches[0].pageX - 30;
		block.style.top = e.changedTouches[0].pageY - 30;

	}, false)

	block.addEventListener("touchmove", function(e) {

		block.style.left = e.changedTouches[0].pageX - 30;
		block.style.top = e.changedTouches[0].pageY - 30;

		debug.innerHTML = "Debug:" + Math.round(e.changedTouches[0].pageX) + "<b> : x</b><br>" + Math.round(e.changedTouches[0].pageY) + "<b> : y</b>";

	}, false);*/


	//Socket stuff to send to server

	// console.log(Math.round(e.changedTouches[0].pageX));

	// Socket.emit("touchtap", {
	// 	// "x": Math.round(e.changedTouches[0].pageX),
	// 	// "y": Math.round(e.changedTouches[0].pageY),
	// 	// "tap": tapNum
	// });

}


controllers.pair = function($scope, Socket, User) {

	//delete controllers.extract();

	//Start pair

	//Wave form matching!
	//window.removeEventListener("devicemotion", );


	console.log("Pairing Mode");

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
    

	$("#pairnow").click(function() {

		//$("#nested_container").switchClass("pairing", "extract");
		delete controllers.pair();

		controllers.extract();

		//console.log("Time to Pair Andrei");
		// removeEvent();
		// controllers.pair();
	});
}



//This object is potentially redundant

controllers.nature = function($scope, Socket, User) {
	$scope.planet = User.data.planet;
	$scope.occupation = User.data.occupation;

	console.log($(document).width());

	//Only need to define this once. I should get it earlier maybe?
	document.getElementById("planet").style.height = $(document).width() - 120;
	document.getElementById("planet").style.width = $(document).width() - 120;

	document.getElementById("planet2").style.height = $(document).width() - 120;
	document.getElementById("planet2").style.width = $(document).width() - 120;

	// document.getElementsByClassName("spheres").style.height = $(document).width() - 120;
	// document.getElementsByClassName("spheres").style.width = $(document).width() - 120;

	// $(".planet").style.height = $(document).width() - 120;
	// $(".planet").style.width = $(document).width() - 120;

	$("#ready").click(function() {
		console.log("this");

		controllers.extract();
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