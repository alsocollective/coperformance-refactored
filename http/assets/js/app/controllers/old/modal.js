copofermance.modal = {
	settings: {
		close: null,
		modal: null,
		help: null,
		content: null,
		hideDelay: null
	},
	init: function() {
		timeApp.modal.settings.close = document.getElementById("xx");
		timeApp.modal.settings.modal = document.getElementById("modal");
		timeApp.modal.settings.help = document.getElementById("help");
		timeApp.modal.settings.content = document.getElementById("modal-content");
		timeApp.modal.settings.endless = document.getElementById("endless");

		timeApp.modal.settings.close.onclick = timeApp.modal.close;
		timeApp.modal.settings.help.onclick = timeApp.modal.help;

		timeApp.modal.settings.modal.className = "fade-in";
	},
	close: function() {
		if (timeApp.modal.settings.modal == null) {
			return false;
		}
		// timeApp.modal.settings.help.className = "";
		timeApp.modal.settings.help.style.display = "";
		timeApp.modal.settings.help.className = "pop-in";
		timeApp.modal.settings.modal.className = "fade-out";

		timeApp.modal.settings.hideDelay = setTimeout(function() {
			timeApp.modal.settings.modal.style.display = "none";
		}, 900);

		timeApp.allfunc.fullscreen();

		//Trigger video to play once modal is closed
		if (!(/iphone|ipod|ipad.*os/gi).test(navigator.appVersion)) {
			timeApp.modal.settings.endless.play();
		}

	},
	help: function() {
		timeApp.modal.settings.help.className = "pop-out";
		timeApp.modal.settings.hideDelay = setTimeout(function() {
			timeApp.modal.settings.help.style.display = "none";
		}, 500)
		timeApp.modal.settings.modal.style.display = "";
		timeApp.modal.settings.modal.className = "fade-in";
	},
	setTextHidden: function(text) {
		if (timeApp.modal.settings.modal == null) {
			timeApp.modal.init();
		}
		// if (timeApp.modal.settings.hideDelay) {
		// 	clearTimeout(timeApp.modal.settings.hideDelay);
		// 	timeApp.modal.settings.hideDelay = null;
		// }
		timeApp.modal.settings.modal.style.display = "none";
		// timeApp.modal.settings.modal.className = "close";
		timeApp.modal.settings.content.innerHTML = text;
	},
	alert: function(text) {
		if (timeApp.modal.settings.modal == null) {
			timeApp.modal.init();
		}

		if (timeApp.modal.settings.hideDelay) {
			clearTimeout(timeApp.modal.settings.hideDelay);
			timeApp.modal.settings.hideDelay = null;
		}
		timeApp.modal.settings.modal.style.display = "block";
		timeApp.modal.settings.modal.className = "";
		timeApp.modal.settings.modal.className = "fade-in";
		timeApp.modal.settings.content.innerHTML = text;
	}
}