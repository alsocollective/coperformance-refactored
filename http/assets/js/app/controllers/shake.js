copofermance.shake = {
	settings: {
		test: null,
		back: null,
		mvgAvgx: null,
		mvgAvgy: null,
		diffArr: null,
		current: 0,
		counter: 0,
		min: -800,
		max: 800,
		col: [
			[
				[144, 0, 255],
				[255, 0, 0]
			],
			[
				[13, 255, 0],
				[255, 145, 0]
			]
		],
		socket: null,
		subuser: null
	},
	init: function(Socket, Userset) {
		console.log("Shake JS Init");
		timeApp.shake.settings.socket = Socket;
		timeApp.shake.settings.test = document.getElementById("test");
		timeApp.shake.settings.back = document.getElementById("shake");
		timeApp.shake.settings.diffArr = [0, 0];
		Userset.getUserSub();
		timeApp.shake.settings.subuser = Userset.subuser;
		console.log(timeApp.shake.settings.subuser)
		timeApp.modal.alert("<h2>Shake your phone, becasue it's all about the bass.</h2><h3>Shake</h3><img src='/public/content/shake.png'>")

		window.addEventListener("devicemotion", timeApp.shake.motionEvent, true);
	},
	motionEvent: function(event) {
		var x = event.accelerationIncludingGravity.x;

		timeApp.shake.settings.mvgAvgx = (x * 0.4) + (timeApp.shake.settings.mvgAvgx * (1 - 0.4));

		timeApp.shake.settings.diffArr.shift();
		timeApp.shake.settings.diffArr[timeApp.shake.settings.diffArr.length] = timeApp.shake.settings.current;

		timeApp.shake.settings.current = (Math.floor(timeApp.shake.settings.mvgAvgx.toFixed(2) * 1000));

		if (timeApp.shake.settings.current < timeApp.shake.settings.min && timeApp.shake.settings.current < 8000) {
			timeApp.shake.settings.min = timeApp.shake.settings.current;
		} else if (timeApp.shake.settings.current > timeApp.shake.settings.max && timeApp.shake.settings.current < 8000) {
			timeApp.shake.settings.max = timeApp.shake.settings.current;
		}

		if ((timeApp.shake.diff(timeApp.shake.settings.diffArr[0], timeApp.shake.settings.diffArr[1])) > 100) {
			timeApp.shake.settings.back.style.backgroundColor = timeApp.shake.mapColour(timeApp.shake.settings.current, timeApp.shake.settings.min, timeApp.shake.settings.max, timeApp.shake.settings.col[timeApp.shake.settings.subuser][0], timeApp.shake.settings.col[timeApp.shake.settings.subuser][1]);
			timeApp.shake.settings.test.style.color = timeApp.shake.mapColour(timeApp.shake.settings.current, timeApp.shake.settings.min, timeApp.shake.settings.max, timeApp.shake.settings.col[timeApp.shake.settings.subuser][1], timeApp.shake.settings.col[timeApp.shake.settings.subuser][0]);
		}

		//TODO-BA: Add colour select by ID group

		//Touch Designer Data
		if (timeApp.shake.settings.current > 5000) {
			if (timeApp.shake.settings.current > timeApp.shake.settings.max || timeApp.shake.settings.current < timeApp.shake.settings.min) {
				timeApp.shake.settings.counter++
				timeApp.shake.settings.socket.emit("sha", timeApp.shake.settings.counter);
				//timeApp.shake.settings.test.innerHTML = "counter: " + timeApp.shake.settings.counter;
				timeApp.shake.settings.test.style.top = "-" + timeApp.shake.settings.counter * 16 + "px";
				//console.log(timeApp.shake.settings.counter);
			}
		}
	},
	onexit: function() {
		window.removeEventListener("devicemotion", timeApp.shake.motionEvent, true);
	},
	diff: function(a, b) {
		return Math.abs(a - b);
	},
	mapColour: function(cur, min, max, c1, c2) {
		var percent = (cur - min) / (max - min);
		return "rgb(" + timeApp.shake.map(percent, c1, c2, 0) + "," + timeApp.shake.map(percent, c1, c2, 1) + "," + timeApp.shake.map(percent, c1, c2, 2) + ")"
	},
	map: function(percent, c1, c2, c) {
		return Math.floor(percent * (c2[c] - c1[c]) + c1[c])
	}
}