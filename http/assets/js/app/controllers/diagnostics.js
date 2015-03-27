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
		timeApp.diagnostics.settings.Socket = Socket;



		//used http://bost.ocks.org/mike/path/ for reference
		//Create the data array... change 60 to the number of points
		for (var a = 0; a < 120; ++a) {
			timeApp.diagnostics.settings.data.push({
				"x": 0,
				"y": 0,
				"z": 0
			})
		}

		timeApp.diagnostics.settings.diagdata = Socket.on("diagdata", timeApp.diagnostics.datain);
		timeApp.diagnostics.settings.xscale = d3.scale.linear()
			.domain([0, timeApp.diagnostics.settings.data.length - 1])
			.range([0, timeApp.diagnostics.settings.width]);
		timeApp.diagnostics.settings.yscale = d3.scale.linear()
			.domain([-30, 30])
			.range([timeApp.diagnostics.settings.height, 0]);


		// LINES ,these determin which data set we use... x,y,z
		timeApp.diagnostics.settings.linex = d3.svg.line()
			.x(function(d, i) {
				return timeApp.diagnostics.settings.xscale(i);
			})
			.y(function(d, i) {
				return timeApp.diagnostics.settings.yscale(d.x);
			})
		timeApp.diagnostics.settings.liney = d3.svg.line()
			.x(function(d, i) {
				return timeApp.diagnostics.settings.xscale(i);
			})
			.y(function(d, i) {
				return timeApp.diagnostics.settings.yscale(d.y);
			})
		timeApp.diagnostics.settings.linez = d3.svg.line()
			.x(function(d, i) {
				return timeApp.diagnostics.settings.xscale(i);
			})
			.y(function(d, i) {
				return timeApp.diagnostics.settings.yscale(d.z);
			})


		//set up the document
		var margins = 100;
		var xCol = "#f00";
		var yCol = "#0f0";
		var zCol = "#00f";
		var svg = d3.select("#datalocation").append("svg")
			.attr("width", timeApp.diagnostics.settings.width + margins)
			.attr("height", timeApp.diagnostics.settings.height + margins)


		// GRID LINES
		var yAxis = d3.svg.axis()
			.scale(timeApp.diagnostics.settings.yscale)
			.orient("left")
			.ticks(20);
		var xAxis = d3.svg.axis()
			.scale(timeApp.diagnostics.settings.xscale)
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

		// actually add the lines now... and their colours are described in here...
		timeApp.diagnostics.settings.pathx = svg.append("g")
			.attr("clip-path", "url(#clip)")
			.append("path")
			.datum(timeApp.diagnostics.settings.data)
			.attr("class", "line")
			.attr("d", timeApp.diagnostics.settings.linex)
			.attr("fill", "none")
			.attr("stroke", xCol);



		timeApp.diagnostics.settings.pathy = svg.append("g")
			.attr("clip-path", "url(#clip)")
			.append("path")
			.datum(timeApp.diagnostics.settings.data)
			.attr("class", "line")
			.attr("d", timeApp.diagnostics.settings.liney)
			.attr("fill", "none")
			.attr("stroke", yCol);

		timeApp.diagnostics.settings.pathz = svg.append("g")
			.attr("clip-path", "url(#clip)")
			.append("path")
			.datum(timeApp.diagnostics.settings.data)
			.attr("class", "line")
			.attr("d", timeApp.diagnostics.settings.linez)
			.attr("fill", "none")
			.attr("stroke", zCol);
	},
	datain: function(msg) {
		if (typeof timeApp.diagnostics.settings.data[0] != typeof msg) {
			console.log("the data type is bad...")
		} else {

			//add your filter here
			var filter = msg;


			//append the new data
			timeApp.diagnostics.settings.data.push(filter);

			//update the graph...
			timeApp.diagnostics.settings.pathx
				.attr("d", timeApp.diagnostics.settings.linex)
			timeApp.diagnostics.settings.pathy
				.attr("d", timeApp.diagnostics.settings.liney)
			timeApp.diagnostics.settings.pathz
				.attr("d", timeApp.diagnostics.settings.linez)

			//remove the old
			timeApp.diagnostics.settings.data.shift();

		}
	},
	onexit: function(Socket) {
		window.removeEventListener("devicemotion", timeApp.diagnostics.settings.tiltEvent, true);
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
		timeApp.diagnostics.settings.Socket = Socket;
		timeApp.diagnostics.settings.tiltEvent = function(event) {
			if (Date.now() - timeApp.diagnostics.settings.lastEvent > 10) {
				var x = (event.accelerationIncludingGravity.x) ? event.accelerationIncludingGravity.x : 0,
					y = (event.accelerationIncludingGravity.y) ? event.accelerationIncludingGravity.y : 0,
					z = (event.accelerationIncludingGravity.z) ? event.accelerationIncludingGravity.z : 0;
				console.log({
					"x": x,
					"y": y,
					"z": z,
				});
				timeApp.diagnostics.settings.Socket.emit("diagdata", {
					"x": x,
					"y": y,
					"z": z
				});
				timeApp.diagnostics.settings.lastEvent = Date.now();
			}
		}
		window.addEventListener("devicemotion", timeApp.diagnostics.settings.tiltEvent, true);
	}

}