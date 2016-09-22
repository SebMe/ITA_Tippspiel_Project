myApp.controller('loginViewController', function ($scope, $state, dataService, databaseService, restService) {
	// Globale variablen werden über den dataService verwaltet
	$scope.benutzer = dataService.getBenutzer();
 
 
	$scope.register = function(){
		restService.createUser($scope.benutzer).then(function(response){
			$scope.serverResponse = response;
		});
	}
 
    $scope.login = function() {
		databaseService.getBenutzer().then(function(users){
			// Enable console in command line: start app with "ionic serve", enter, then type "c", enter
			// Using console for debug purposes to see what we retrieved from db
			for (var i = 0; i < users.length; i++) {
				console.log(users[i].benutzer_username);
			};

			for (var i = 0; i < users.length; i++) {
				if(users[i].benutzer_username == $scope.benutzer.benutzer_username && users[i].benutzer_passwort == $scope.benutzer.benutzer_passwort){
					dataService.setBenutzer(users[i]);
					console.log(users[i]);
					$state.go("state_groupListViewDisplayed");
				};
			};
		});		
    }
	
});