copofermance.diagnostics = {
	settings: {
		Socket: null,
		diagdata: null,
		tiltEvent: null,
		data: [],
		lastEvent: 0,
		width: 1800,
		height: 700,
		yscale: null,
		xscale: null,
		users: [],
		lines: [],
		paths: [],

		linex: null,
		liney: null,
		linez: null,
		pathx: null,
		pathy: null,
		pathz: null
	},
	init: function(Socket) {
		console.log("diagnostics...")
		if (!Socket) {
			console.log("you need to pass socket into the diagnostics init");
			return false;
		}
		copofermance.diagnostics.settings.Socket = Socket;



		//used http://bost.ocks.org/mike/path/ for reference
		//Create the data array... change 60 to the number of points
		for (var a = 0; a < 120; ++a) {
			copofermance.diagnostics.settings.data.push([{
				"x": 0,
				"y": 0,
				"z": 0
			}])
		}

		copofermance.diagnostics.settings.diagdata = Socket.on("diagdata", copofermance.diagnostics.datain);

		copofermance.diagnostics.settings.xscale = d3.scale.linear()
			.domain([0, copofermance.diagnostics.settings.data.length - 1])
			.range([0, copofermance.diagnostics.settings.width]);
		copofermance.diagnostics.settings.yscale = d3.scale.linear()
			.domain([-360, 360])
			.range([copofermance.diagnostics.settings.height, 0]);


		// LINES ,these determin which data set we use... x,y,z
		// copofermance.diagnostics.settings.linex = d3.svg.line()
		// 	.x(function(d, i) {
		// 		return copofermance.diagnostics.settings.xscale(i);
		// 	})
		// 	.y(function(d, i) {
		// 		return copofermance.diagnostics.settings.yscale(d.x);
		// 	})
		// copofermance.diagnostics.settings.liney = d3.svg.line()
		// 	.x(function(d, i) {
		// 		return copofermance.diagnostics.settings.xscale(i);
		// 	})
		// 	.y(function(d, i) {
		// 		return copofermance.diagnostics.settings.yscale(d.y);
		// 	})
		// copofermance.diagnostics.settings.linez = d3.svg.line()
		// 	.x(function(d, i) {
		// 		return copofermance.diagnostics.settings.xscale(i);
		// 	})
		// 	.y(function(d, i) {
		// 		return copofermance.diagnostics.settings.yscale(d.z);
		// 	})

		//set up the document
		var margins = 100;
		//var xCol = "#f00";
		//var yCol = "#0f0";
		//var zCol = "#00f";
		var svg = d3.select("#datalocation").append("svg")
			.attr("width", copofermance.diagnostics.settings.width + margins)
			.attr("height", copofermance.diagnostics.settings.height + margins)


		// GRID LINES
		var yAxis = d3.svg.axis()
			.scale(copofermance.diagnostics.settings.yscale)
			.orient("left")
			.ticks(20);
		var xAxis = d3.svg.axis()
			.scale(copofermance.diagnostics.settings.xscale)
			.orient("top");
		svg.append("g")
			.attr("transform", "translate(" + margins + "," + margins + ")")
			.call(yAxis);
		svg.append("g")
			.attr("transform", "translate(" + margins + "," + margins + ")")
			.call(xAxis);

		// add the parent element of all the lines
		svg = svg.append("g")
			.attr("transform", "translate(" + margins + "," + margins + ")");

		copofermance.diagnostics.svg = svg;

		copofermance.diagnostics.colour = d3.scale.linear()
			.domain([-1, 0, 12])
			.range(["red", "white", "green"]);

		// actually add the lines now... and their colours are described in here...
		// copofermance.diagnostics.settings.pathx = svg.append("g")
		// 	.attr("clip-path", "url(#clip)")
		// 	.append("path")
		// 	.datum(copofermance.diagnostics.settings.data)
		// 	.attr("class", "line")
		// 	.attr("d", copofermance.diagnostics.settings.linex)
		// 	.attr("fill", "none")
		// 	.attr("stroke", xCol);

		// copofermance.diagnostics.settings.pathy = svg.append("g")
		// 	.attr("clip-path", "url(#clip)")
		// 	.append("path")
		// 	.datum(copofermance.diagnostics.settings.data)
		// 	.attr("class", "line")
		// 	.attr("d", copofermance.diagnostics.settings.liney)
		// 	.attr("fill", "none")
		// 	.attr("stroke", yCol);

		// copofermance.diagnostics.settings.pathz = svg.append("g")
		// 	.attr("clip-path", "url(#clip)")
		// 	.append("path")
		// 	.datum(copofermance.diagnostics.settings.data)
		// 	.attr("class", "line")
		// 	.attr("d", copofermance.diagnostics.settings.linez)
		// 	.attr("fill", "none")
		// 	.attr("stroke", zCol);
	},
	addLine: function(count) {
		var letters = ["x", "y", "z"],
			letter = letters[count % 3],
			count = count - 1;

		copofermance.diagnostics.settings.lines[count * 3] = d3.svg.line()
			.x(function(d, i) {
				return copofermance.diagnostics.settings.xscale(i);
			})
			.y(function(d, i) {
				if (i == 120) {
					console.log(d[count], count);
				}
				return copofermance.diagnostics.settings.yscale(d[count][letter]);
			})

		copofermance.diagnostics.settings.lines[(count * 3) + 1] = null;
		copofermance.diagnostics.settings.lines[(count * 3) + 2] = null;
		// copofermance.diagnostics.settings.lines[(count * 3) + 1] = d3.svg.line()
		// 	.x(function(d, i) {
		// 		return copofermance.diagnostics.settings.xscale(i);
		// 	})
		// 	.y(function(d, i) {
		// 		return copofermance.diagnostics.settings.yscale(d[letter]);
		// 	})
		// copofermance.diagnostics.settings.lines[(count * 3) + 2] = d3.svg.line()
		// 	.x(function(d, i) {
		// 		return copofermance.diagnostics.settings.xscale(i);
		// 	})
		// 	.y(function(d, i) {
		// 		return copofermance.diagnostics.settings.yscale(d[letter]);
		// 	})

		copofermance.diagnostics.settings.paths[count * 3] = copofermance.diagnostics.svg.append("g")
			.attr("clip-path", "url(#clip)")
			.append("path")
			.datum(copofermance.diagnostics.settings.data)
			.attr("class", "line")
			.attr("d", copofermance.diagnostics.settings.lines[count * 3])
			.attr("fill", "none")
			.attr("stroke", copofermance.diagnostics.colour(count * 3));

		copofermance.diagnostics.settings.paths[(count * 3) + 1] = null;
		copofermance.diagnostics.settings.paths[(count * 3) + 2] = null;

		// copofermance.diagnostics.settings.paths[(count * 3) + 1] = copofermance.diagnostics.svg.append("g")
		// 	.attr("clip-path", "url(#clip)")
		// 	.append("path")
		// 	.datum(copofermance.diagnostics.settings.data)
		// 	.attr("class", "line")
		// 	.attr("d", copofermance.diagnostics.settings.lines[(count * 3) + 1])
		// 	.attr("fill", "none")
		// 	.attr("stroke", copofermance.diagnostics.colour((count * 3) + 1));

		// copofermance.diagnostics.settings.paths[(count * 3) + 2] = copofermance.diagnostics.svg.append("g")
		// 	.attr("clip-path", "url(#clip)")
		// 	.append("path")
		// 	.datum(copofermance.diagnostics.settings.data)
		// 	.attr("class", "line")
		// 	.attr("d", copofermance.diagnostics.settings.lines[(count * 3) + 2])
		// 	.attr("fill", "none")
		// 	.attr("stroke", copofermance.diagnostics.colour((count * 3) + 2));

	},
	datain: function(msg) {
		if (copofermance.diagnostics.settings.users.indexOf(msg.id) == -1) {
			copofermance.diagnostics.settings.users.push(msg.id);
			console.log("added user");
			console.log(msg.id)
			copofermance.diagnostics.addLine(copofermance.diagnostics.settings.users.length);
		}


		if (typeof copofermance.diagnostics.settings.data[0] != typeof msg) {
			console.log("the data type is bad...")
		} else {
			var userNumber = copofermance.diagnostics.settings.users.indexOf(msg.id);

			msg = msg.data;
			//add your filter here
			var past = copofermance.diagnostics.settings.data[copofermance.diagnostics.settings.data.length - 1];
			past[userNumber] = msg;

			console.log(past);
			//append the new data
			copofermance.diagnostics.settings.data.push(past);

			//update the graph...
			copofermance.diagnostics.settings.paths[userNumber * 3]
				.attr("d", copofermance.diagnostics.settings.lines[userNumber * 3])

			// copofermance.diagnostics.settings.paths[userNumber * 3]
			// 	.attr("d", copofermance.diagnostics.settings.lines[userNumber * 3])
			// copofermance.diagnostics.settings.paths[userNumber * 3]
			// 	.attr("d", copofermance.diagnostics.settings.lines[userNumber * 3])

			// copofermance.diagnostics.settings.pathy
			// 	.attr("d", copofermance.diagnostics.settings.liney)
			// copofermance.diagnostics.settings.pathz
			// 	.attr("d", copofermance.diagnostics.settings.linez)
			//remove the old
			copofermance.diagnostics.settings.data.shift();

		}
	},
	onexit: function(Socket) {
		window.removeEventListener("devicemotion", copofermance.diagnostics.settings.tiltEvent, true);
		Socket.onunbind("diagdata");
	},



	createDiagnosticButton: function(Socket) {
		var button = document.createElement("button");
		button.innerHTML = "send data";
		$("#main_container")[0].appendChild(button);
		var senddata = function(event) {
			console.log(event.timeStamp)
			Socket.emit("tap", "1");
			Socket.emit("diagdata", event.timeStamp);
		}
		$(button).click(senddata);
	},


	addTiltEventListener: function(Socket) {
		copofermance.diagnostics.settings.Socket = Socket;
		copofermance.diagnostics.settings.tiltEvent = function(event) {
			if (Date.now() - copofermance.diagnostics.settings.lastEvent > 10) {
				var x = (event.accelerationIncludingGravity.x) ? event.accelerationIncludingGravity.x : 0,
					y = (event.accelerationIncludingGravity.y) ? event.accelerationIncludingGravity.y : 0,
					z = (event.accelerationIncludingGravity.z) ? event.accelerationIncludingGravity.z : 0;
				console.log({
					"x": x,
					"y": y,
					"z": z,
				});
				copofermance.diagnostics.settings.Socket.emit("diagdata", {
					"x": x,
					"y": y,
					"z": z
				});
				copofermance.diagnostics.settings.lastEvent = Date.now();
			}
		}
		window.addEventListener("devicemotion", copofermance.diagnostics.settings.tiltEvent, true);
	}

}