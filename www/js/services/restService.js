myApp.factory('restService', function($http, databaseService){

//var serverURL = 'http://192.168.2.102';
var serverURL = 'http://127.0.0.1';

this.getOpenLigaMatches = function(){
	return $http.get('http://www.openligadb.de/api/getmatchdata/em2016/2016/1');
};

// See http://angulartricks.com/how-to-do-http-post-with-angularjs-in-php/
this.postDataToServer = function(table, values){	
	return $http.post(serverURL+'/restController.php', {tablename: table, data: values});
};

this.syncTableWithServer = function(table){
	return databaseService.getTableVersions(table).then(function(response){
			return $http.post(serverURL+'/restController.php', {tablename: table, version: response}).then(function(response){
				for(var i=0;i<response.data.length;i++){
					var oneTableRow = response.data[i];
					delete oneTableRow["version"];
					databaseService.insertDataIntoTable(table, oneTableRow);
				}			
			});
	});
};

// User will be created at the server, if successfull the user is also created in the app db
this.createUser = function(userdata){
	// Send a createUser request to the server
	return $http.post(serverURL+'/restController.php', {createUser:1, user: userdata}).then(function(response){
		// If the server created the user, the AUTOINCREMENT ID in the Server.Benutzer table is returned
		if(response.data >= 0){
			userdata.benutzer_id = response.data;
			// Create the user in the local database, using the ID we retrieved from the server
			return databaseService.insertDataIntoTable('Benutzer', userdata).then(function(response){
				return 'User was created.';
			});
		}else{
			return response.data;
		}
	});
};

// Stub, server connection not yet implemented
// Tipprunde will be created at the server, if successfull the Tipprunde is also created in the app db
this.createTipprunde = function(tipprunde){
	return databaseService.insertDataIntoTable('Tipprunde', tipprunde).then(function(response){
		return 'Tipprunde was created.';
	});
};

// Tipp will be created in the app db. Use sendTippsToServer to try and send all offline created Tipps to the server
this.createTipp = function(tipp){
	tipp.status = 'not_committed';
	delete tipp['tipp_datum']; // Datum is set by the database as CURRENT_TIMESTAMP
	return databaseService.insertDataIntoTable('Tipp', tipp).then(function(response){
		return 'Tipp was created.';
	});
};

// Stub, server connection not yet implemented
this.sendTippsToServer = function(){
	return databaseService.setTippsCommitted().then(function(response){
		return 'All offline created Tipps send to server.';
	});
};

return this;
});