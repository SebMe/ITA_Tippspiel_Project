myApp.factory('restService', function($http, databaseService, dataService){

//var serverURL = 'http://192.168.2.102';
var serverURL = 'http://127.0.0.1';

// This function will retrieve all data from server (for the given table) that the client not yet has, the new data is then inserted in the client db
this.syncTableWithServer = function(table){
	return databaseService.getTableVersions(table).then(function(response){
		var benutzer = dataService.getBenutzer();
		var loggedInbenutzer_id = benutzer.benutzer_id;
		return $http.post(serverURL+'/restController.php', {tablename: table, version: response, benutzer_id: loggedInbenutzer_id}).then(function(response){
			var newestDBEntryDate = -1;
			var newestDBEntryAsString = "";
			for(var i=0;i<response.data.length;i++){
				var oneTableRow = response.data[i];
				if(new Date(response.data[i]["version"]) > newestDBEntryDate){
					newestDBEntryDate = new Date(response.data[i]["version"]);
					newestDBEntryAsString = response.data[i]["version"];
				};
				delete oneTableRow["version"];
				databaseService.insertOrReplaceDataIntoTable(table, oneTableRow);
			};
			// We received data, store the date of the newest entry as version, so the next sync with server will not receive the data we already have
			if(newestDBEntryDate > 0){
				databaseService.updateTableVersions(table, newestDBEntryAsString);
			};
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

// Tipprunde will be created at the server, if successfull the Tipprunde is also created in the app db
this.createTipprunde = function(tipprundeData){
	var benutzer = dataService.getBenutzer();
	var loggedInbenutzer_id = benutzer.benutzer_id;
	return $http.post(serverURL+'/restController.php', {createTipprunde:1, tipprunde: tipprundeData, benutzer_id: loggedInbenutzer_id}).then(function(response){
		if(response.data >= 0){
			tipprundeData.tipprunde_id = response.data;
			return databaseService.insertDataIntoTable('Tipprunde', tipprundeData).then(function(response){
				return 'Tipprunde was created.';
			});
		}else{
			return response.data;
		}
	});
};

this.createBenutzerSpieltTipprunde = function(param_tipprunde_id, param_benutzer_id){
	var data = {
		benutzer_fid: param_benutzer_id,
		tipprunde_fid: param_tipprunde_id,
		punkte: 0
	};
	return $http.post(serverURL+'/restController.php', {createBenutzerSpieltTipprunde:1, dataToInsert:data}).then(function(response){
		if(response.data == 'success'){
			return databaseService.insertDataIntoTable('Benutzer_spielt_Tipprunde', data).then(function(response){
				return 'Benutzer now assigned to Tipprunde.';
			});
		}else{
			return response.data;
		}
	});
}

// Tipp will be created in the app db. Use sendTippsToServer to try and send all offline created Tipps to the server
this.createTipp = function(tipp){
	tipp.status = 'not_committed';
	return databaseService.insertDataIntoTable('Tipp', tipp).then(function(response){
		return 'Tipp was created.';
	});
};

// This will send all all tipps with status=not_committed to the server
this.sendTippsToServer = function(){
	return databaseService.getAllTippsNotCommitted().then(function(notCommittedTipps){	
		return $http.post(serverURL+'/restController.php', {createOrUpdateTipps:1, tipps: notCommittedTipps}).then(function(response){
			if(response.data == notCommittedTipps.length){
				return databaseService.setTippsCommitted().then(function(response){
					return 'All offline created or changed Tipps send to server.';
				});
			}else{
				return 'Offline created or changed Tipps were send to Server but Server did not correctly insert or update.';
			}
		});
	});
};

this.triggerServerFetchOpenLigaDB = function(){
	return $http.post(serverURL+'/restController.php', {serverFetchOpenLigaDB:1}).then(function(response){
		if(response.data == 'success'){
			return 'Server loaded new data from OpenLigaDB';
		}else{
			return response.data;
		};
	});	
};

return this;
});