myApp.controller('loginViewController', function ($scope, $state, dataService, databaseService) {
	// Globale variablen werden über den dataService verwaltet
	$scope.user = dataService.getUser();
 
	$scope.register = function(){
		databaseService.updateUsertable($scope.user);
	}
 
    $scope.login = function() {
		databaseService.getUsertable().then(function(users){
			// Enable console in command line: start app with "ionic serve", enter, then type "c", enter
			// Using console for debug purposes to see what we retrieved from db
			for (var i = 0; i < users.length; i++) {
				console.log(users[i].username);
			};
			
			for (var i = 0; i < users.length; i++) {
				if(users[i].username == $scope.user.username && users[i].password == $scope.user.password){
					$state.go("state_groupListViewDisplayed");
				};
			};
		});		
    }
	
});