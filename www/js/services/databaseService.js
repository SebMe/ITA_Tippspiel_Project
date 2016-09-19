myApp.factory('databaseService', function($cordovaSQLite, $q){

	// db is a global variable set in app.js

    // function to use on SQL select syntax, a select on a table could take 2min+, the promise is immediatly returned but resloves only when the operation is finished
    this.executeQuery = function (query, parameters) {									     
	   var q = $q.defer();  
        parameters = parameters || []; // Use empty field in case no parameters are used
        $cordovaSQLite.execute(db, query, parameters).then(
			// Query execute was successfull (positive promise)
            function (result) {
                q.resolve(result);
            },
            // Query execute failed (negative promise)
            function (error) {
                q.reject(error);
            });
        return q.promise;
    };
	
	this.getTableVersions = function(tablename){
		var query = 'SELECT version FROM table_versions where tablename = ?';
		return this.executeQuery(query, [tablename]).then(function (result) {
			var version = -1;
			if (result.rows.length > 0) {
				version = result.rows.item(0).version;
			}
			return version;
		});
	};
	
	this.updateTableVersions = function (tablename, version) {
        var query = 'UPDATE table_versions SET version = ? WHERE tablename = ?';
        $cordovaSQLite.execute(db, query, [version, tablename]);
    };
	
	this.getBenutzer = function () {
		var query = 'SELECT * from Benutzer';
		var users = [];
		return this.executeQuery(query, []).then(function (result) {
			if (result.rows.length > 0) {
				for (var i = 0; i < result.rows.length; i++) {
					var benutzer = {
						benutzer_mailadresse: null,
						benutzer_username: null,
						benutzer_passwort: null,
						benutzer_punkte: null
						};
					benutzer.benutzer_username = result.rows.item(i).benutzer_username;
					benutzer.benutzer_passwort = result.rows.item(i).benutzer_passwort;
					users.push(benutzer);
				};                
			};
			return users;
		});
    };
	
	this.setTippsCommitted = function(){
		var query = 'UPDATE Tipp SET status = \'committed\' WHERE status = \'not_committed\'';
		return $cordovaSQLite.execute(db, query);
	}
	
	this.getAllTipprunden = function(){
		var query = 'SELECT * FROM Tipprunde';
		var tipprunden = [];
		return this.executeQuery(query, []).then(function (result) {
			if (result.rows.length > 0) {
				for (var i = 0; i < result.rows.length; i++) {
					var tipprunde = {
						tipprunde_id: null,
						tipprunde_name: null,
						tipprunde_passwort: null,
						tipprunde_europameisterschaft_fid: null
					};
					tipprunde.tipprunde_id = result.rows.item(i).tipprunde_id;
					tipprunde.tipprunde_name = result.rows.item(i).tipprunde_name;
					tipprunde.tipprunde_passwort = result.rows.item(i).tipprunde_passwort;
					tipprunde.tipprunde_europameisterschaft_fid = result.rows.item(i).tipprunde_europameisterschaft_fid;
					tipprunden.push(tipprunde);
				};                
			};
			return tipprunden;
		});
	};
	
	this.getAllTippsForTipprunde = function(tipprunde_id){
		var query = 'SELECT * FROM Tipp WHERE tipprunde_fid = ?';
		var tipps = [];
		return this.executeQuery(query, [tipprunde_id]).then(function (result) {
			if (result.rows.length > 0) {
				for (var i = 0; i < result.rows.length; i++) {
					var tipp = {
						begegnung_fid: null,
						tipprunde_fid: null,
						benutzer_fid: null,
						tipp_tore_heimmannschaft: null,
						tipp_tore_auswaertsmannschaft: null,
						tipp_datum: null
					};
					tipp.begegnung_fid = result.rows.item(i).begegnung_fid;
					tipp.tipprunde_fid = result.rows.item(i).tipprunde_fid;
					tipp.benutzer_fid = result.rows.item(i).benutzer_fid;
					tipp.tipp_tore_heimmannschaft = result.rows.item(i).tipp_tore_heimmannschaft;
					tipp.tipp_tore_auswaertsmannschaft = result.rows.item(i).tipp_tore_auswaertsmannschaft;
					tipp.tipp_datum = result.rows.item(i).tipp_datum;
					tipps.push(tipp);
				};                
			};
			return tipps;
		});
	};
	
	this.getPunkteForAllUsersOfTipprunde = function(tipprunde_id){
		var query = 'SELECT * FROM Benutzer_spielt_Tipprunde JOIN Benutzer ON benutzer_fid WHERE tipprunde_fid = ?';
		var userWithPoints = [];
		return this.executeQuery(query, [tipprunde_id]).then(function (result) {
			if (result.rows.length > 0) {
				for (var i = 0; i < result.rows.length; i++) {
					var userPoints = {
						benutzer_name: null,
						punkte: null
					};
					userPoints.benutzer_name = result.rows.item(i).benutzer_name;
					userPoints.punkte = result.rows.item(i).punkte;
					userWithPoints.push(userPoints);
				};                
			};
			return userWithPoints;
		});
	};
	
	this.insertDataIntoTable = function(tablename, data){
		var columns = Object.keys(data);
		var questionmarks = "";
		var values = [];
		
		for(var key in data){
			values.push(data[key])
		};
		
		for (var i = 0; i<columns.length;i++){
			if(i != columns.length-1){
				questionmarks = questionmarks + '?,'
			}else{
				questionmarks = questionmarks + '?'
			}
		};
		
		var query = 'INSERT OR IGNORE INTO ' + tablename + ' (' + columns + ') VALUES (' + questionmarks + ')';
		return $cordovaSQLite.execute(db, query, values);
	};

return this;
});