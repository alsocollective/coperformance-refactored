//Tap JS

copofermance.tap = {
	settings: {
		bg: null,
		textOut: null,
		mvgAvg: null,
		max: 20,
		manifesto: ["Freeman", "and", "slave", "patrician", "and", "plebeian", "lord", "and", "serf", "guild-master", "and", "journeyman", "in", "a", "word", "oppressor", "and", "oppressed", "stood", "in", "constant", "opposition", "to", "one", "another", "carried", "on", "an", "uninterrupted", "now", "hidden", "now", "open", "fight", "a", "fight", "that", "each", "time", "ended", "either", "in", "a", "revolutionary", "reconstitution", "of", "society", "at", "large", "or", "in", "the", "common", "ruin", "of", "the", "contending", "classes", "In", "the", "earlier", "epochs", "of", "history", "we", "find", "almost", "everywhere", "a", "complicated", "arrangement", "of", "society", "into", "various", "orders", "a", "manifold", "gradation", "of", "social", "rank", "In", "ancient", "Rome", "we", "have", "patricians", "knights", "plebeians", "slaves;", "in", "the", "Middle", "Ages", "feudal", "lords", "vassals", "guild-masters", "journeymen", "apprentices", "serfs", "in", "almost", "all", "of", "these", "classes", "again", "subordinate", "gradations", "The", "modern", "bourgeois", "society", "that", "has", "sprouted", "from", "the", "ruins", "of", "feudal", "society", "has", "not", "done", "away", "with", "class", "antagonisms", "It", "has", "but", "established", "new", "classes", "new", "conditions", "of", "oppression", "new", "forms", "of", "struggle", "in", "place", "of", "the", "old", "ones"],
		socket: null
	},
	init: function(Socket) {
		console.log("tap init")
		timeApp.tap.settings.socket = Socket;
		timeApp.modal.alert("<h2>Tap your phone to the beat</h2><h3>Tap</h3><img src='/public/content/tap.png'>")
		timeApp.tap.settings.bg = document.getElementById("tap");
		timeApp.tap.settings.textOut = document.getElementById("speech");
		window.addEventListener("devicemotion", timeApp.tap.motionEvent, true);
	},
	motionEvent: function(event) {
		console.log("tap motion event")

		var z = event.accelerationIncludingGravity.z;

		event.preventDefault();

		timeApp.tap.settings.mvgAvg = (z * 0.4) + (timeApp.tap.settings.mvgAvg * (1 - 0.4));

		if ((Math.abs(timeApp.tap.settings.mvgAvg - z)) > 8) {
			timeApp.tap.settings.bg.className = "bgWhite";
			timeApp.tap.settings.textOut.innerHTML = timeApp.tap.settings.manifesto[Math.floor((Math.random() * timeApp.tap.settings.manifesto.length) + 1)];
			timeApp.tap.settings.socket.emit("tap", "");
		} else {
			timeApp.tap.settings.bg.className = "";
		}
	},
	onexit: function() {
		console.log("tap onexit")
		window.removeEventListener("devicemotion", timeApp.tap.motionEvent, true);
	}
}