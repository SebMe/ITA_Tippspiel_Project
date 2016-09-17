myApp.controller('groupListViewController', function ($scope, dataService) {
	$scope.benutzer = dataService.getBenutzer();
});