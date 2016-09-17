myApp.controller('restTestViewController', function ($scope, restService, databaseService) {

	$scope.getOpenLigaDB = function(){
		restService.getOpenLigaMatches().then(function(response){
			$scope.returnedData = response;
		});
	}

	$scope.testSQL = function(){
		databaseService.updateTableVersion('Benutzer', new Date());
	}	
	
	$scope.postUsertable = function(){
		var fakeBenutzerTableEntry = {
		benutzer_id: 11,
		benutzer_mailadresse: 'test@test.de',
		benutzer_password: 'testpasswort',
		benutzer_username: 'ionicgenerateduser',
		benutzer_punkte: 0,
		version: 0,
		operation: 'INSERT'
	}
		restService.postDataToServer('benutzer', fakeBenutzerTableEntry).then(function(response){
			$scope.returnedData = response;
		});
	}
});