var copofermance = angular.module("timeApp", ['ngRoute']) //
	.config(function($routeProvider) {
		$routeProvider
			.when('/', {
				controller: "home",
				templateUrl: 'pages/home.html'
			})
			.when('/diagnostics', {
				controller: "diagnostics",
				templateUrl: 'pages/diagnostics.html'
			}).otherwise({
				redirectTo: "/"
			});
	});