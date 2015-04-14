copofermance.betweenpages = {
	settings: {
		scope: null,
		SongSets: null,
		CurrentPage: null,
		iterator: null
	},
	init: function(scope, SongSets, CurrentPage, Socket) {
		timeApp.betweenpages.settings.scope = scope,
		timeApp.betweenpages.settings.SongSets = SongSets,
		timeApp.betweenpages.settings.CurrentPage = CurrentPage;

		scope.songname = "loading";

		if (CurrentPage.meta) {
			timeApp.betweenpages.setup(scope, SongSets, CurrentPage);
		} else {
			Socket.emit("getmeta", "");
			timeApp.betweenpages.settings.iterator = setInterval(timeApp.betweenpages.checkForMeta, 50);
		}
	},
	checkForMeta: function() {
		if (timeApp.betweenpages.settings.CurrentPage.meta) {
			timeApp.betweenpages.setup(timeApp.betweenpages.settings.scope, timeApp.betweenpages.settings.SongSets, timeApp.betweenpages.settings.CurrentPage);
		}
	},
	setup: function(scope, SongSets, CurrentPage) {
		if (timeApp.betweenpages.settings.iterator) {
			clearInterval(timeApp.betweenpages.settings.iterator);
		}
		console.log("YES setup ran")
		console.log(CurrentPage.meta)
		console.log()

		scope.songname = SongSets.songs[CurrentPage.meta].title;
		// if (timeApp.pushedpage.settings.j < 9) {
		// 	timeApp.pushedpage.settings.j++
		// } else if (timeApp.pushedpage.settings.j === 9) {
		// 	timeApp.pushedpage.settings.j = 0;
		// }

		// document.getElementById(("s4-" + timeApp.pushedpage.settings.j).toString()).style.visibility = "hidden";

		// if (timeApp.pushedpage.settings.j + 1 === 10) {
		// 	document.getElementById(("s4-0").toString()).style.visibility = "visible";
		// } else {
		// 	document.getElementById(("s4-" + (timeApp.pushedpage.settings.j + 1)).toString()).style.visibility = "visible";
		// }
	},
	onexit: function() {
		// window.clearInterval(timeApp.pushedpage.settings.interval);
	}
}