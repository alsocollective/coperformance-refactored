copofermance.diagnostics = {
	settings: {
		Socket: null,
		diagdata: null,
		tiltEvent: null,
		data: [],
		datasets: [],
		lines: [],
		paths: [],
		lastEvent: 0,
		width: $(document).width() - 60,
		height: 300,
		yscale: null,
		xscale: null,
		linex: null,
		liney: null,
		linez: null,
		pathx: null,
		pathy: null,
		pathz: null,
		devices: [],
	},
	init: function(Socket) {
		console.log("diagnostics...")
		if (!Socket) {
			console.log("you need to pass socket into the diagnostics init");
			return false;
		}
		copofermance.diagnostics.settings.Socket = Socket;
		copofermance.diagnostics.devices = [null, null];


		//used http://bost.ocks.org/mike/path/ for reference
		//Create the data array... change 60 to the number of points

		copofermance.diagnostics.settings.datasets[0] = [];
		copofermance.diagnostics.settings.datasets[1] = [];

		for (var a = 0; a < 120; ++a) {
			var dp = {
				"x": 0,
				"y": 0,
				"z": 0
			};
			copofermance.diagnostics.settings.data.push({
				"x": 0,
				"y": 0,
				"z": 0
			})

			copofermance.diagnostics.settings.datasets[0].push(dp);
			copofermance.diagnostics.settings.datasets[1].push(dp);
		}


		// D3 action starts here

		copofermance.diagnostics.settings.diagdata = Socket.on("diagdata", copofermance.diagnostics.datain);


		copofermance.diagnostics.settings.xscale = d3.scale.linear()
		// .domain([0, copofermance.diagnostics.settings.data.length - 1])
		.domain([0, copofermance.diagnostics.settings.data.length])
			.range([0, copofermance.diagnostics.settings.width]);
		copofermance.diagnostics.settings.yscale = d3.scale.linear()
			.domain([-30, 30])
			.range([copofermance.diagnostics.settings.height, 0]);


		// LINES ,these determin which data set we use... x,y,z

		for (var i = 0; i < 2; i++) {
			var linex = d3.svg.line()
				.x(function(d, i) {
					return copofermance.diagnostics.settings.xscale(i);
				})
				.y(function(d, i) {
					return copofermance.diagnostics.settings.yscale(d.x);
				})

			copofermance.diagnostics.settings.linex = linex;

			var liney = d3.svg.line()
				.x(function(d, i) {
					return copofermance.diagnostics.settings.xscale(i);
				})
				.y(function(d, i) {
					return copofermance.diagnostics.settings.yscale(d.y);
				})
			copofermance.diagnostics.settings.liney = liney;

			var linez = d3.svg.line()
				.x(function(d, i) {
					return copofermance.diagnostics.settings.xscale(i);
				})
				.y(function(d, i) {
					return copofermance.diagnostics.settings.yscale(d.z);
				})
			copofermance.diagnostics.settings.linez = linez;

			copofermance.diagnostics.settings.lines[i] = {
				"lx": linex,
				"ly": liney,
				"lz": linez
			};

		}
		//set up the document
		var margins = 20;
		var xCol = ["#0070ED", "#ED2A00"];
		var yCol = ["#75AFF0", "#F0917C"];
		var zCol = ["#807CF0", "#ED5200"];
		var svg = d3.select("#datalocation").append("svg")
			.attr("width", copofermance.diagnostics.settings.width + margins + 50)
			.attr("height", copofermance.diagnostics.settings.height + margins + 50)


		// GRID LINES
		var yAxis = d3.svg.axis()
			.scale(copofermance.diagnostics.settings.yscale)
			.orient("left")
			.tickSize(1)
			.innerTickSize(-copofermance.diagnostics.settings.width)
			.outerTickSize(0)
			.tickPadding(5)
			.ticks(40);
		var yAxis2 = d3.svg.axis()
			.scale(copofermance.diagnostics.settings.yscale)
			.orient("right")
			.tickSize(0)
			.innerTickSize(copofermance.diagnostics.settings.width)
			.outerTickSize(0)
			.tickPadding(5)
			.ticks(40);
		var xAxis = d3.svg.axis()
			.scale(copofermance.diagnostics.settings.xscale)
			.tickSize(1)
			.innerTickSize(-copofermance.diagnostics.settings.height)
			.outerTickSize(0)
			.tickPadding(5)
			.ticks(20)
			.orient("top");
		var xAxis2 = d3.svg.axis()
			.scale(copofermance.diagnostics.settings.xscale)
			.tickSize(0)
			.innerTickSize(copofermance.diagnostics.settings.height)
			.outerTickSize(0)
			.tickPadding(5)
			.ticks(20)
			.orient("bottom");
		svg.append("g")
			.attr("transform", "translate(" + margins + "," + margins + ")")
			.attr("class", "y axis")
			.call(yAxis)
		svg.append("g")
			.attr("transform", "translate(" + margins + "," + margins + ")")
			.attr("class", "y axis")
			.call(yAxis2)
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + 10 + ")")
			.attr("transform", "translate(" + margins + "," + margins + ")")
			.call(xAxis)
		svg.append("g")
			.attr("transform", "translate(" + margins + "," + margins + ")")
			.attr("class", "y axis")
			.call(xAxis2)

		// add the parent element of all the lines
		svg = svg.append("g")
			.attr("stroke", "#f0f")
			.attr("transform", "translate(" + margins + "," + margins + ")");


		for (var i = 0; i < 2; i++) {
			// actually add the lines now... and their colours are described in here...
			var pathx = svg.append("g")
				.attr("clip-path", "url(#clip)")
				.append("path")
				.datum(copofermance.diagnostics.settings.datasets[i])
				.attr("class", "line")
				.attr("d", copofermance.diagnostics.settings.lines[i].lx)
				.attr("fill", "none")
				.attr("stroke-width", 4)
				.attr("stroke", xCol[i]);

			copofermance.diagnostics.settings.pathx = pathx;

			var pathy = svg.append("g")
				.attr("clip-path", "url(#clip)")
				.append("path")
				.datum(copofermance.diagnostics.settings.datasets[i])
				.attr("class", "line")
				.attr("d", copofermance.diagnostics.settings.lines[i].ly)
				.attr("fill", "none")
				.attr("stroke-width", 4)
				.attr("stroke", yCol[i]);

			copofermance.diagnostics.settings.pathy = pathy;


			var pathz = svg.append("g")
				.attr("clip-path", "url(#clip)")
				.append("path")
				.datum(copofermance.diagnostics.settings.datasets[i])
				.attr("class", "line")
				.attr("d", copofermance.diagnostics.settings.lines[i].lz)
				.attr("fill", "none")
				.attr("stroke-width", 4)
				.attr("stroke", zCol[i]);

			copofermance.diagnostics.settings.pathz = pathz;

			copofermance.diagnostics.settings.paths[i] = {
				"px": pathx,
				"py": pathy,
				"pz": pathz
			};
		}
	},
	datain: function(msg) {
		if (typeof copofermance.diagnostics.settings.datasets[0][0] != typeof msg) {
			console.log("the data type is bad...");

		} else if (copofermance.diagnostics.settings.devices.indexOf(msg.id) == -1) {

			copofermance.diagnostics.settings.devices.push(msg.id);

		}

		if (copofermance.diagnostics.settings.devices.length > 2)
			copofermance.diagnostics.settings.devices.shift();


		console.log(copofermance.diagnostics.settings.devices);

		var dex = copofermance.diagnostics.settings.devices.indexOf(msg.id);
		console.log(msg.id);
		console.log("DEX " + dex);
		msg = msg.data;
		//add your filter here
		var filter = msg;



		//append the new data
		copofermance.diagnostics.settings.datasets[dex].push(filter);

		//update the graph...
		copofermance.diagnostics.settings.paths[dex].px
			.attr("d", copofermance.diagnostics.settings.lines[dex].lx)
		copofermance.diagnostics.settings.paths[dex].py
			.attr("d", copofermance.diagnostics.settings.lines[dex].ly)
		copofermance.diagnostics.settings.paths[dex].pz
			.attr("d", copofermance.diagnostics.settings.lines[dex].lz)

		//remove the old
		copofermance.diagnostics.settings.datasets[dex].shift();


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
				//console.log({
				//	"x": x,
				//	"y": y,
				//	"z": z,
				//});
				copofermance.diagnostics.settings.Socket.emit("diagdata", {
					"x": x,
					"y": y,
					"z": z,
					"id": Socket.id
				});
				copofermance.diagnostics.settings.lastEvent = Date.now();
			}
		}
		window.addEventListener("devicemotion", copofermance.diagnostics.settings.tiltEvent, true);
	}

}