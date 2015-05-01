var copofermance = angular.module("copofermance", ['ngRoute', 'ngCookies', 'ngAnimate']) //
	.config(function($routeProvider) {
		$routeProvider
			.when('/', {
				controller: "home",
				templateUrl: 'pages/home.html'
			})
			.when("/lobby", {
				controller: "lobby",
				templateUrl: "pages/co_lobby.html"
			})



		.when("/mars", {
			controller: "planet",
			templateUrl: "pages/co_planet.html"
		})
			.when("/mars/occupation1", {
				controller: "occupation1",
				templateUrl: "pages/co_occupation.html"
			})
			.when("/mars/occupation2", {
				controller: "occupation2",
				templateUrl: "pages/co_occupation.html"
			})



		.when("/earth", {
			controller: "planet",
			templateUrl: "pages/co_planet.html"
		})
			.when("/earth/occupation1", {
				controller: "occupation1",
				templateUrl: "pages/co_occupation.html"
			})
			.when("/earth/occupation2", {
				controller: "occupation2",
				templateUrl: "pages/co_occupation.html"
			})



		.when('/taptest', {
			controller: "taptest",
			templateUrl: 'pages/taptest.html'
		})
			.when('/input', {
				controller: "diagnosticsout",
				templateUrl: 'pages/input.html'
			})
			.when('/diagnostics', {
				controller: "diagnostics",
				templateUrl: 'pages/diagnostics.html'
			}).otherwise({
				redirectTo: "/"
			});
	});