myApp.controller('loginViewController', function ($scope, $state, dataService, databaseService, restService) {
	// Globale variablen werden über den dataService verwaltet
	$scope.benutzer = dataService.getBenutzer();
 
 
	$scope.register = function(){
		//restService.
		databaseService.updateBenutzer($scope.benutzer);
	}
 
    $scope.login = function() {
		databaseService.getBenutzer().then(function(users){
			// Enable console in command line: start app with "ionic serve", enter, then type "c", enter
			// Using console for debug purposes to see what we retrieved from db
			for (var i = 0; i < users.length; i++) {
				console.log(users[i].username);
			};

			for (var i = 0; i < users.length; i++) {
				if(users[i].username == $scope.benutzer.username && users[i].passwort == $scope.benutzer.passwort){
					$state.go("state_groupListViewDisplayed");
				};
			};
		});		
    }
	
});