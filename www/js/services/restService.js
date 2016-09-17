myApp.factory('restService', function($http, databaseService){

//var serverURL = 'http://192.168.2.102';
var serverURL = 'http://127.0.0.1';

this.getOpenLigaMatches = function(){
	return $http.get('http://www.openligadb.de/api/getmatchdata/em2016/2016/1');
};

this.getServerData = function(tablename){
	databaseService.getTableVersion(tablename);
	return $http.post(serverURL+'/restController.php', {tablename: table, version: values});
};

// See http://angulartricks.com/how-to-do-http-post-with-angularjs-in-php/
this.postDataToServer = function(table, values){	
	return $http.post(serverURL+'/restController.php', {tablename: table, data: values});
	/*
	return $http({
	url: serverURL+'/restController.php',
		method: "POST",
		//headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		data: {test: 'hallo'}
	});*/
};

return this;
});