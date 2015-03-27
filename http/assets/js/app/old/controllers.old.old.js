var controllers = {},
	scope = null,
	debug = true;

controllers.sync = function($scope, $location, socket, UserSet) {
	console.log("strted sync");
	socket.on('setup', function(data) {
		console.log("get setup...")
		console.log(data.msg);
		$scope.message = data.msg;
		$location.path('/tap');
	});

	socket.on('CP', function(data) {
		$location.path(data)
	})

}

controllers.swipe = function($scope, socket, $location, $timeout) {

	$scope.users = ["@SamiraAhmed", "@NerminAl-Fiqy", "@LobnaAbdelAziz", "@DaliaElBehery"] //, "@Bushra", "@IlhamChahine", "@MimiChakib", "@AssiaDagher", "@NabilaEbeid", "@MariamFakhrEddine", "@RehamAbdElGhafour", "@LailaElwi", "@NaglaaFathi", "@Feyrouz", "@SanaaGamil", "@FatenHamama", "@SuadHusni", "@YosraElLozy", "@NadiaLutfi", "@FerdoosMohammed", "@LeilaMourad", "@Nadine[disambiguationneeded]", "@SuadNasr", "@MaryQueeny", "@GehanRateb", "@AminaRizk", "@HendRostom", "@HalaSedki", "@Shadia", "@Sherihan", "@Shwikar", "@HananTork", "@Yousra", "@MonaZaki"]

	$scope.currentList = ["@SamiraAhmed", "@NerminAl-Fiqy", "@LobnaAbdelAziz", "@DaliaElBehery"];

	function timeoutFunction() {
		$(".usersswippe").slick({
			dots: false,
			arrows: false,
			infinite: false,
			speed: 300,
			slidesToShow: 1,
			slidesToScroll: 1,
			autoplay: false,
			autoplaySpeed: 2000,
			onAfterChange: function() {
				if (!this.currentSlide) {
					var index = $scope.currentList.indexOf(this.$slider[0].id);
					if (index !== -1) {
						$scope.currentList.splice(index, 1);
					}
					$(this.$slider[0]).unslick();
					var el = this.$slider[0];
					$(el).height($(el).height() / 2);
					$(el).height(0);
					$timeout(function() {
						el.parentNode.removeChild(el);
						if ($scope.currentList.length == 0) {
							console.log("load in data");
							console.log($scope.users);
							$scope.currentList = $scope.users;
							$timeout(timeoutFunction);
						}
					}, 500)
				}
			}
		}).slickNext();
	}

	$timeout(timeoutFunction);
	/*function() {
		jQuery(".usersswippe").slick({
			dots: false,
			arrows: false,
			infinite: false,
			speed: 300,
			slidesToShow: 1,
			slidesToScroll: 1,
			autoplay: false,
			autoplaySpeed: 2000,
			onAfterChange: function() {
				if (!this.currentSlide) {
					var index = $scope.currentList.indexOf(this.$slider[0].id);
					if (index !== -1) {
						$scope.currentList.splice(index, 1);
					}

					if ($scope.currentList.length == 0) {
						console.log("load in data");
						// $scope.currentList = $scope.users;
					}

					$(this.$slider[0]).unslick();
					var el = this.$slider[0];
					$(el).height($(el).height() / 2);
					$(el).height(0);
					$timeout(function() {
						el.parentNode.removeChild(el);
					}, 500)
				}
			}
		}).slickNext()

	}*/

	socket.on('CP', function(data) {
		$location.path(data)
	});
}

controllers.shaker = function($scope, socket, UserSet, $location) {

	$scope.colourSelect = {}
	$scope.active = true;

	$scope.controls = false;

	//$scope.colourSelect

	$scope.colourSelect.colour1 = null;
	$scope.colourSelect.colour2 = null;

	var colour1 = [50, 50, 50];
	var colour2 = [50, 50, 50];

	console.log("Get Shak'n");

	$scope.addColour1 = function(value) {
		console.log("colour1 " + value);
		$scope.colourSelect.colour1 = value;
		checker();
	}
	$scope.addColour2 = function(value) {
		console.log("colour2 " + value);
		$scope.colourSelect.colour2 = value;
		checker();
	}

	function checker() {
		if ($scope.colourSelect.colour2 != null && $scope.colourSelect.colour1 != null) {
			console.log("success");

			//document.getElementById("colorSelector").remove();

			$scope.controls = true;

			var array1 = $scope.colourSelect.colour1.split(',').map(Number);
			var array2 = $scope.colourSelect.colour2.split(',').map(Number);

			colour1 = array1;
			colour2 = array2;
			screenfull.request();
		}
	}

	if (window.DeviceMotionEvent) {
		var min = 0,
			max = 0,
			current = 0;

		//output.style.color = [255,255,255];

		console.log(colour1);
		window.ondevicemotion = function(event) {
			if (event.accelerationIncludingGravity.z) {
				//real it back in...
				min += 50;
				max -= 50;
				current = (Math.floor(event.accelerationIncludingGravity.x * 1000));
				if (current < min) {
					min = current;
				} else if (current > max) {
					max = current;
				}
				output.style.backgroundColor = mapColour(current, min, max, colour1, colour2);
				output.style.color = mapColour(current, min, max, colour2, colour1);
			}
		}
	}

	function mapColour(cur, min, max, c1, c2) {
		var percent = (cur - min) / (max - min);
		return "rgb(" + map255(percent, c1, c2, 0) + "," + map255(percent, c1, c2, 1) + "," + map255(percent, c1, c2, 2) + ")"
	}

	function map255(percent, c1, c2, c) {
		return Math.floor(percent * (c2[c] - c1[c]) + c1[c])
	}
	socket.on('CP', function(data) {
		$location.path(data)
	});
}


//


//TAPPING

controllers.tap = function($scope, socket, UserSet, $location, $timeout) {

	UserSet.checkUser();

	var mvgAvg = null,
		tapCol = 1,
		scope = angular.element(main_container).scope();

	$scope.tap = false;

	$scope.tapped = function() {
		socket.emit('tapped', true);
	}

	function handleMotionEvent(event) {

		var z = event.accelerationIncludingGravity.z;

		mvgAvg = (z * 0.4) + (mvgAvg * (1 - 0.4));

		if ((Math.abs(mvgAvg - z)) > 6) {
			scope.$apply(function() {
				$scope.tap = true;
			});
			socket.emit('tap', tapCol);
		} else {
			scope.$apply(function() {
				$scope.tap = false;
			});
		}
	}

	window.addEventListener("devicemotion", handleMotionEvent, true);

	socket.on('cTap', function(data) {
		tapCol = 2;
		$scope.col = "?????";
	});
	$scope.$on("$destroy", function() {
		window.ondevicemotion = null;
	});
	socket.on('CP', function(data) {
		$location.path(data)
	});
}


//LOGIN PAGE
controllers.login = function($scope, socket, UserSet, $location) {

	//Set default value of text input
	$scope.ticket = 123;
	$scope.active = true;

	//Called by Submit Input
	$scope.addUser = function() {
		console.log($scope.ticket.length);
		UserSet.setUserId($scope.ticket);
		$location.path('/lobby');
	}

	//Keep checking the field whenever there is input
	$scope.changeLength = function() {
		if ($scope.ticket.length > 2) {
			$scope.active = false;
		} else {
			$scope.active = true;
		}
	};
	socket.on('CP', function(data) {
		$location.path(data)
	});
}

controllers.lobby = function($scope, socket, UserSet, $location) {

	var scope = angular.element(main_container).scope();

	scope.countdown = "00 : 00 : 00";

	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth() + 1; //January is 0!
	var yyyy = today.getFullYear();
	var startTime = "23:08:00";

	var target_date = new Date(mm + " " + dd + ", " + yyyy + ", " + startTime).getTime();
	var hours, minutes, seconds;
	var timer = document.getElementById("timer");

	console.log("You've reached the LOBBY!");

	$('.autoplay').slick({
		dots: false,
		arrows: false,
		infinite: true,
		speed: 200,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 3000
	});

	var timerId = setInterval(function() {

		var current_date = new Date().getTime();
		var seconds_left = (target_date - current_date) / 1000;

		hours = parseInt(seconds_left / 3600);
		seconds_left = seconds_left % 3600;

		minutes = parseInt(seconds_left / 60);
		seconds = parseInt(seconds_left % 60);

		scope.$apply(function() {
			scope.countdown = ("0" + hours).slice(-2) + " : " + ("0" + minutes).slice(-2) + " : " + ("0" + seconds).slice(-2);;
		})

		if (hours <= 0 && minutes <= 0 && seconds <= 0) {

			timer.innerHTML = "00 : 00 : 00";

			clearInterval(timerId);
		}
	}, 1000);

	socket.on('CP', function(data) {
		$location.path(data)
	});
}

controllers.admin = function($scope, socket, UserSet, $location) {
	$scope.userID = UserSet.user;
	$scope.msg = {
		"id": "repeat",
		"header": "CP",
		"msg": "/"
	}

	$scope.sendMsg = function() {
		socket.emit($scope.msg.id, {
			"header": $scope.msg.header,
			"msg": $scope.msg.msg
		})
		// console.log($scope.msg.id, $scope.msg.msg)
	}

	socket.on('CP', function(data) {
		console.log("got: " + data)
		//$location.path(data);
	})
}

controllers.diagnostics = function($scope, socket) {

	var newPosition = null;

	var mvAvgX = 0,
		mvAvgY = 0,
		mvAvgZ = 0,
		thresh = 15,
		tc = 0.4,
		alph = 1.0,
		per = 1000,
		dat = null,
		diffArrX = [0, 0],
		diffArrY = [0, 0],
		diffArrZ = [0, 0],
		spd = [0, 0];

	$scope.tcValue = tc;
	$scope.alphVal = alph;
	$scope.threshValue = thresh;
	$scope.tapped = false;

	$scope.speed = 0;

	var movingAverage = false,
		differenceValue = false;

	var n = 160,
		data = [{
			"name": "x",
			"values": [0]
		}, {
			"name": "y",
			"values": [0]
		}, {
			"name": "z",
			"values": [0]
		}];

	var margin = {
			top: 20,
			right: 20,
			bottom: 20,
			left: 40
		},
		width = 900 - margin.left - margin.right,
		height = 400 - margin.top - margin.bottom;

	//D'fuq
	var x = d3.scale.linear()
		.domain([0, n - 1])
		.range([0, width]);

	var y = d3.scale.linear()
		.domain([-2.0, 20])
		.range([height, 0]);

	var line = d3.svg.line()
		.x(function(d, i) {
			return x(i);
		})
		.y(function(d, i) {
			return y(d);
		});

	var svg = d3.select("#visualization").append("svg")
		.attr("width", width + margin.left + margin.right + 10)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//?
	svg.append("defs").append("clipPath")
		.attr("id", "clip")
		.append("rect")
		.attr("width", width)
		.attr("height", height);

	svg.append("g")
		.attr("class", "y axis left")
		.attr("id", "y-left")
		.call(d3.svg.axis().scale(y).orient("left"));

	var orient = svg.selectAll(".orient")
		.data(data)
		.enter().append("g")
		.attr("class", "orient")
		.attr("id", function(d) {
			return d.name
		});

	orient.append("path")
		.attr("class", "line")
		.attr("d", function(d) {
			return line(d.values);
		});

	function make_y_axis() {
		return d3.svg.axis()
			.scale(y)
			.orient("left")
			.ticks(10)
	}

	svg.append("g")
		.attr("class", "grid")
		.call(make_y_axis()
			.tickSize(-width, 0, 0)
			.tickFormat(""));

	svg.append("g")
		.attr("class", "y axis right")
		.attr("id", "y-right")
		.attr("transform", "translate(" + width + ")")
		.call(d3.svg.axis().scale(y).orient("right"));

	tick();

	function tick() {
		// push a new data point onto the back

		//Maybe emply the .length technique here as well? Can't be variable though.
		if (newPosition) {
			data[0].values.push(newPosition.x);
			data[1].values.push(newPosition.y);
			data[2].values.push(newPosition.z);
			newPosition = null;

			// pop the old data point off the front
			if (data[0].values.length > 160) {
				data[0].values.shift();
				data[1].values.shift();
				data[2].values.shift();

				orient.selectAll(".line")
					.attr("d", function(d) {
						return line(d.values);
					})
					.attr("transform", null)
					.transition()
					.duration(40)
					.ease("linear")
					.attr("transform", "translate(" + x(-1) + ",0)")
					.each("end", tick);
			} else {
				orient.selectAll(".line")
					.attr("d", function(d) {
						return line(d.values);
					})
					.attr("transform", null)
					.transition()
					.duration(40)
					.ease("linear")
					.each("end", tick);
			}
		} else {
			setTimeout(tick, 40);
		}
	}

	socket.on('lv', function(newData) {

		newPosition = newData;

		if (movingAverage) {
			// Exponentially decaying moving average

			var filterX = newPosition.x;
			var filterY = newPosition.y;
			var filterZ = newPosition.z;

			mvAvgX = (newPosition.x * tc) + (mvAvgX * (alph - tc));
			mvAvgY = (newPosition.y * tc) + (mvAvgY * (alph - tc));
			mvAvgZ = (newPosition.z * tc) + (mvAvgZ * (alph - tc));

			newPosition.x = diff(mvAvgX, filterX);
			newPosition.y = diff(mvAvgY, filterY);
			newPosition.z = diff(mvAvgZ, filterZ);

			if (newPosition.z > thresh) {
				console.log("tapped");
				$scope.tapped = true;
			} else {
				$scope.tapped = false;
			}
		}

		/*if(differenceValue){
			// Exponentially decaying moving average
			mvAvgX = (newPosition.x*tc)+(mvAvgX*(alph-tc));
			mvAvgY = (newPosition.y*tc)+(mvAvgY*(alph-tc));
			mvAvgZ = (newPosition.z*tc)+(mvAvgZ*(alph-tc));
			
			diffArrX.shift();
			diffArrY.shift();
			diffArrZ.shift();

			diffArrX[diffArrX.length] = mvAvgX;
			diffArrY[diffArrY.length] = mvAvgY;
			diffArrZ[diffArrZ.length] = mvAvgZ;

			newPosition.x = diff(diffArrX[0],diffArrX[1]);
			newPosition.y = diff(diffArrY[0],diffArrY[1]);
			newPosition.z = diff(diffArrZ[0],diffArrZ[1]);
		}*/

		if (newData) {
			if (dat < 100) {
				dat++
			} else {
				dat = 0;
				spd.shift();
				spd[spd.length] = Date.now();
				$scope.speed = 100 / (Math.abs(spd[0] - spd[1]) / per);
			}
		} else {
			$scope.speed = 0.0;
		}
	});

	function diff(a, b) {
		return Math.abs(a - b);
	}

	//I DON'T NEED THESE WHEN USING ANGULAR
	d3.select('#movingAverage').on('click', function() {
		movingAverage = true;
		console.log("We are filtering (MvAVG + Diff)");
	});

	/*d3.select('#differenceValue').on('click', function() {
	  differenceValue = true;
	  movingAverage = false;
	});

	*/

	$scope.alphChange = function() {
		alph = $scope.alphVal;
	}

	//Keep checking the field whenever there is input
	$scope.changeLength = function() {
		tc = $scope.tcValue;
	};

	$scope.threshold = function() {
		thresh = $scope.threshValue;
	};
}

timeApp.controller(controllers);