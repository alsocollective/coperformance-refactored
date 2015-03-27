copofermance.communication = {
	settings: {
		setupbol: false,
		pageChange: false,
		socket: null,
		location: null,
		currentPage: null,
		heartbeatPage: null,
		container: null,
		lastFired: 0
	},

	setup: function(Socket, Cookie, Userset, location, CurrentPage) {
		if (timeApp.communication.settings.setupbol) {
			return false;
		}

		timeApp.communication.setupbol = true;
		if (Cookie.ticket) {
			Userset.ticket = Cookie.ticket;
			Userset.getUserSub();
			Socket.emit("setID", Cookie.ticket);
		} else {
			Socket.emit("getID", "I have no id");
			Socket.on("setID", function(msg) {
				Userset.ticket = msg;
				Cookie.ticket = msg;
				Userset.getUserSub();
			})
		}

		timeApp.communication.settings.setupbol = true;

		timeApp.communication.settings.socket = Socket;
		timeApp.communication.settings.location = location;
		timeApp.communication.settings.currentPage = CurrentPage;
		timeApp.communication.settings.userset = Userset;
		timeApp.communication.settings.cookie = Cookie;
		timeApp.communication.settings.container = $("#main_container")[0];

		if (location.path() == "/admin") {
			return false;
		}
		timeApp.communication.setupPageChange(Socket, location, CurrentPage);

		//TODO retrive the what page the user is suppose to be on
		//should be pushed to the CurrentPage
		//be sure to run exit script when changing pages
	},

	// test: function(Socket) {
	// 	Socket.emit("ID");
	// 
	// },
	exitfunction: null,
	setupPageChange: function(Socket, location, CurrentPage) {
		if (timeApp.communication.settings.pageChange) {
			return false;
		}
		timeApp.communication.settings.socket = Socket;
		Socket.on("CP", timeApp.communication.changePage)

		Socket.on("meta", function(msg) {
			CurrentPage.meta = msg;
		})
		Socket.on("red", timeApp.communication.settings.userset.newRed);


		// make sure everything is set correctly...
		console.log("set up check for updates");
		timeApp.communication.checkforupdates();
		timeApp.communication.settings.heartbeatPage = setInterval(timeApp.communication.checkforupdates, 10000);
		$(window).focus(timeApp.communication.onfocus);

		timeApp.communication.settings.lastFired = new Date().getTime();
		if ((/iphone|ipod|ipad.*os/gi).test(navigator.appVersion)) {
			setInterval(function() {
				now = new Date().getTime();
				if (now - timeApp.communication.settings.lastFired > 2000) { //if it's been more than 5 seconds
					timeApp.communication.onfocus()
				}
				timeApp.communication.settings.lastFired = now;
			}, 500);
		}

		Socket.on("ID", function(msg) {
			if (timeApp.communication.settings.cookie.ticket) {
				timeApp.communication.settings.socket.emit("setID", timeApp.communication.settings.cookie.ticket);
			}
		})

		// Socket.on("push", function(msg) {
		// 	timeApp.communication.pageExitFunction();
		// 	location.path("/song");
		// 	CurrentPage.page = "song";
		// 	CurrentPage.meta = msg;
		// })		
		timeApp.communication.settings.pageChange = true;
	},
	onfocus: function() {
		// alert("setting on focuse")
		timeApp.communication.checkforupdates();
		timeApp.allfunc.fullscreen();
		// timeApp.communication.settings.socket.emit("setID", timeApp.communication.settings.cookie.ticket);
	},
	changePage: function(msg) {
		if (msg == null) {
			return false;
		}
		if (timeApp.communication.settings.location.path() != ("/" + msg)) {
			console.log("not the correct pages");
			// timeApp.communication.settings.container.className = "animation " + msg
			console.log("changepage")
			timeApp.communication.pageExitFunction();
			timeApp.communication.settings.location.path("/" + msg);
		}
		timeApp.communication.settings.currentPage.page = msg;
	},
	checkforupdates: function() {
		console.log("check for updates");
		timeApp.communication.settings.socket.emit("getmeta");
		timeApp.communication.settings.socket.emit("getpage");
	},

	pageExitFunction: function() {
		// timeApp.modal.close();
		if (timeApp.communication.exitfunction) {
			timeApp.communication.exitfunction(timeApp.communication.settings.socket)
			timeApp.communication.exitfunction = null;
		}
	}
}


copofermance.allfunc = {
	firstvisit: function(cookie, location, Userset, CurrentPage, Socket) {
		// timeApp.modal.close();
		if (!cookie.ticket || !Userset.ticket) {
			location.path("/");
			Userset.ticket = cookie.ticket;
			Userset.getUserSub();
			Socket.emit("setID", cookie.ticket);
			/*} else if (location.path() == "/pushedpage" && (!CurrentPage.meta)) {
			location.path("/song")*/
		} else {
			console.log("user already has a ticket")
			// console.log(location.path())

		}
	},
	fullscreen: function() {
		//Fullscreen
		var doc = window.document;
		var docEl = doc.documentElement;

		var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
		var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

		if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
			requestFullScreen.call(docEl);
			console.log("Fullscreen called");
		} else {
			//cancelFullScreen.call(doc);
		}
	}
}