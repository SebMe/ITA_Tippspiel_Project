myApp.controller('groupListViewController', function ($scope, dataService) {
	$scope.user = dataService.getUser();
});