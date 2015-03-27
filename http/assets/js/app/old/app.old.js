var copofermance = angular.module("timeApp", ['ngRoute', 'ngCookies', 'ngAnimate']) //
	.config(function($routeProvider) {
		$routeProvider
			.when('/', {
				controller: "home",
				templateUrl: 'pages/home.html'
			})
			.when('/tap', {
				controller: "tap",
				templateUrl: 'pages/tap.html'
			})
			.when('/shake', {
				controller: "shake",
				templateUrl: 'pages/shake.html'
			})
			.when('/song', {
				controller: "newSong",
				templateUrl: 'pages/song.html'
			})
			.when('/betweenpages', {
				controller: "betweenpages",
				templateUrl: 'pages/betweenpages.html'
			})
			.when('/admin', {
				controller: 'admin',
				templateUrl: 'pages/admin.html'
			})
			.when('/diagnostics', {
				controller: "diagnostics",
				templateUrl: 'pages/diagnostics.html'
			}).otherwise({
				redirectTo: "/"
			});

	});