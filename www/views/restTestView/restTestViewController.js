myApp.controller('restTestViewController', function ($scope, restService, databaseService) {

	$scope.getOpenLigaDB = function(){
		restService.getOpenLigaMatches().then(function(response){
			$scope.returnedData = response;
		});
	}
	
	$scope.getTableVersions = function(){
		restService.getServerData('gettableversions').then(function(response){
			$scope.returnedData = response;
		});
	}

	$scope.testLocalTableVersionsUpdate = function(){
		var tableinfo = {
		id: 1,
		tablename: 'test',
		version: new Date()
		};
		databaseService.update_table_versions(tableinfo);
	}	
	
	$scope.postUsertable = function(){
		restService.postDataToServer('postusertable').then(function(response){
			$scope.returnedData = response;
		});
	}
});