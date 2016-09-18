myApp.factory('restService', function($http, databaseService){

//var serverURL = 'http://192.168.2.102';
var serverURL = 'http://127.0.0.1';

this.getOpenLigaMatches = function(){
	return $http.get('http://www.openligadb.de/api/getmatchdata/em2016/2016/1');
};

this.getServerData = function(table){
	return databaseService.getTableVersions(table).then(function(response){
			return $http.post(serverURL+'/restController.php', {tablename: table, version: response});
	});
};

// See http://angulartricks.com/how-to-do-http-post-with-angularjs-in-php/
this.postDataToServer = function(table, values){	
	return $http.post(serverURL+'/restController.php', {tablename: table, data: values});
};

this.createUser = function(userdata){
	// Send a createUser request to the server
	return $http.post(serverURL+'/restController.php', {createUser:1, user: userdata}).then(function(response){
		// If the server created the user, the AUTOINCREMENT ID in the Server.Benutzer table is returned
		if(response.data >= 0){
			userdata.benutzer_id = response.data;
			// Create the user in the local database, using the ID we retrieved from the server
			return databaseService.updateBenutzer(userdata).then(function(response){
				return 'User was created.';
			});
		}else{
			return response.data;
		}
	});
};

return this;
});