copofermance.newSong = {
	settings: {
		scope: null,
		currentPage: null,
		songSets: null,
		location: null,
		interval: null,
		j: 0,
		interval: null
	},
	init: function(scope, CurrentPage, SongSets, location, Socket) {
		// Set all variables to be global
		timeApp.newSong.settings.scope = scope;
		timeApp.newSong.settings.currentPage = CurrentPage;
		timeApp.newSong.settings.songSets = SongSets;
		timeApp.newSong.settings.location = location;

		//set modal as we check if we need to load
		//we also hide the modal
		// timeApp.modal.setTextHidden("<h2>retriving data from the server...</h2>");

		//check if we have meta
		//if we don't we request it and continously check to see if it comes in
		if (!CurrentPage.meta) {
			Socket.emit("getmeta", "");
			timeApp.newSong.settings.interval = setInterval(timeApp.newSong.checkForMeta, 50);
			return false;
		}

		//we have everything we need we start the page...
		timeApp.newSong.setup(timeApp.newSong.settings.scope, timeApp.newSong.settings.currentPage, timeApp.newSong.settings.songSets, timeApp.newSong.settings.location);
	},
	// the looping for meta
	checkForMeta: function() {
		if (timeApp.newSong.settings.currentPage.meta) {
			timeApp.newSong.setup(timeApp.newSong.settings.scope, timeApp.newSong.settings.currentPage, timeApp.newSong.settings.songSets, timeApp.newSong.settings.location);
		}
	},

	//we initialze the content of the page
	setup: function(scope, CurrentPage, SongSets, location) {
		console.log("setup")
		// we remove the interval of the page
		if (timeApp.newSong.settings.interval) {
			clearInterval(timeApp.newSong.settings.interval);
		}
		// we change what the modal says... still hidden
		// timeApp.modal.setTextHidden("<h2>The song is about to begin.</h2>");

		// we set local variables
		var element = document.getElementById("content"),
			song = CurrentPage.getMeta();

		// we generate images of each of the elements
		for (i = 0; i < 20; i++) {
			var d = document.createElement("div");
			element.appendChild(d);
			d.style.visibility = "hidden";
			d.style.backgroundImage = "url(/public/content/song-" + song.split("g").pop() + "/s" + song.split("g").pop() + "-" + i + ".jpg)";
			d.id = "s4-" + i;
		}

		// we start the looping process for the images.
		timeApp.newSong.settings.interval = setInterval(function() {
			timeApp.newSong.myTimer()
		}, 150);
	},
	myTimer: function() {
		if (timeApp.newSong.settings.j < 19) {
			timeApp.newSong.settings.j++
		} else if (timeApp.newSong.settings.j === 19) {
			timeApp.newSong.settings.j = 0;
		}

		document.getElementById(("s4-" + timeApp.newSong.settings.j).toString()).style.visibility = "hidden";

		if (timeApp.newSong.settings.j + 1 === 20) {
			document.getElementById(("s4-0").toString()).style.visibility = "visible";
		} else {
			document.getElementById(("s4-" + (timeApp.newSong.settings.j + 1)).toString()).style.visibility = "visible";
		}
	},

	onexit: function() {
		if (timeApp.newSong.settings.interval) {
			clearInterval(timeApp.newSong.settings.interval);
		}
		window.clearInterval(timeApp.newSong.settings.interval);
	}
}