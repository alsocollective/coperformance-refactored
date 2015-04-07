var copofermance = angular.module("copofermance", ['ngRoute', 'ngCookies', 'ngAnimate']) //
	.config(function($routeProvider) {
		$routeProvider
			.when('/', {
				controller: "home",
				templateUrl: 'pages/home.html'
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