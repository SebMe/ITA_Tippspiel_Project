myApp.controller('restTestViewController', function ($scope, restService, databaseService) {

	$scope.testSQL = function(){
		restService.syncTableWithServer('Benutzer').then(function(response){
			$scope.returnedData = response;
		});
	}	
	
	$scope.testCreateTipprunde = function(){
		var tipprunde = {
			tipprunde_id: 1,
			tipprunde_name: 'FHTipprunde',
			tipprunde_passwort: 'geheim',
			tipprunde_europameisterschaft_fid: 1,		
		};
		
		restService.createTipprunde(tipprunde).then(function(response){
			$scope.returnedData = response;
		});
	};
	
	$scope.testCreateTipp = function(){
		var tipp = {
			begegnung_fid: 1,
			tipprunde_fid: 1,
			benutzer_fid: 1,
			tipp_tore_heimmannschaft: 3,
			tipp_tore_auswaertsmannschaft: 4,
			tipp_datum: null,
			status: null
		};
		
		// Create a first tipp
		restService.createTipp(tipp).then(function(response){
			$scope.returnedData = response;
		});
		
		// Create a second tipp
		tipp.begegnung_fid = 2;
		restService.createTipp(tipp).then(function(response){
			$scope.returnedData = response;
		});
		
		restService.sendTippsToServer().then(function(response){
			$scope.returnedData = $scope.returnedData + response;
		});
	};
	
	$scope.getAllTipprunden = function(){	
		databaseService.getAllTipprunden().then(function(response){
			$scope.returnedData = response;
		});
	};
	
	$scope.getAllTippsForTipprunde = function(){	
		// Get all Tipps that belong to Tipprunde with ID = 1, see testCreateTipprunde and testCreateTipp for creation of sample data
		var tipprunde_id = 1;
		databaseService.getAllTippsForTipprunde(tipprunde_id).then(function(response){
			$scope.returnedData = response;
		});
	};
	
	$scope.getPunkteForAllUsersOfTipprunde = function(){	
		var tipprunde_id = 1;
		databaseService.getPunkteForAllUsersOfTipprunde(tipprunde_id).then(function(response){
			// Database not populated enough to make this query, dummy data returned
			var userPoints1 = {
				benutzer_name: 'Max',
				punkte: 12
			};
			var userPoints2 = {
				benutzer_name: 'Felix',
				punkte: 21
			};
			var data = [];
			data.push(userPoints1);
			data.push(userPoints2);
			$scope.returnedData = data;
		});
	};
});