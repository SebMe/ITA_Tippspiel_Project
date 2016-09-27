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
				console.error(error);
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
        $cordovaSQLite.execute(db, query, [version, tablename]).then(
            function (result) {
            },
            function (error) {
				console.error(error);
            });
    };
	
	this.getBenutzer = function () {
		var query = 'SELECT * from Benutzer';
		var users = [];
		return this.executeQuery(query, []).then(function (result) {
			if (result.rows.length > 0) {
				for (var i = 0; i < result.rows.length; i++) {
					var benutzer = {
						benutzer_id: null,
						benutzer_mailadresse: null,
						benutzer_username: null,
						benutzer_passwort: null,
						};
					benutzer.benutzer_id = result.rows.item(i).benutzer_id;
					benutzer.benutzer_mailadresse = result.rows.item(i).benutzer_mailadresse;
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
		return $cordovaSQLite.execute(db, query).then(
            function (result) {
            },
            function (error) {
				console.error(error);
            });
	};
	
	this.getAllTippsNotCommitted = function(){
		var query = 'SELECT * FROM Tipp WHERE status = \'not_committed\'';
		return this.executeQuery(query, []).then(function (result) {
			var tipps = [];
			if (result.rows.length > 0) {
				for (var i = 0; i < result.rows.length; i++) {
					var tipp = {
						begegnung_fid: null,
						tipprunde_fid: null,
						benutzer_fid: null,
						tipp_tore_heimmannschaft: null,
						tipp_tore_auswaertsmannschaft: null,
					};
					tipp.begegnung_fid = result.rows.item(i).begegnung_fid;
					tipp.tipprunde_fid = result.rows.item(i).tipprunde_fid;
					tipp.benutzer_fid = result.rows.item(i).benutzer_fid;
					tipp.tipp_tore_heimmannschaft = result.rows.item(i).tipp_tore_heimmannschaft;
					tipp.tipp_tore_auswaertsmannschaft = result.rows.item(i).tipp_tore_auswaertsmannschaft;
					tipps.push(tipp);
				};                
			};
			return tipps;
		});
	};
	
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
	
	this.checkUserPlaysTipprunde = function(benutzer_id, tipprunde_id){
		var query = 'SELECT * FROM Benutzer_spielt_Tipprunde WHERE benutzer_fid = ? AND tipprunde_fid = ?';
		return this.executeQuery(query, [benutzer_id, tipprunde_id]).then(function (result) {
			var userPlaysTipprunde = result.rows.length > 0;
			return userPlaysTipprunde;
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
						status: null,
					};
					tipp.begegnung_fid = result.rows.item(i).begegnung_fid;
					tipp.tipprunde_fid = result.rows.item(i).tipprunde_fid;
					tipp.benutzer_fid = result.rows.item(i).benutzer_fid;
					tipp.tipp_tore_heimmannschaft = result.rows.item(i).tipp_tore_heimmannschaft;
					tipp.tipp_tore_auswaertsmannschaft = result.rows.item(i).tipp_tore_auswaertsmannschaft;
					tipp.status = result.rows.item(i).status;
					tipps.push(tipp);
				};                
			};
			return tipps;
		});
	};
	
	this.getPunkteForAllUsersOfTipprunde = function(tipprunde_id){
		var query = 'SELECT * FROM Benutzer_spielt_Tipprunde bst JOIN Benutzer b ON bst.benutzer_fid = b.benutzer_id WHERE tipprunde_fid = ?';
		var userWithPoints = [];
		return this.executeQuery(query, [tipprunde_id]).then(function (result) {
			if (result.rows.length > 0) {
				for (var i = 0; i < result.rows.length; i++) {
					var userPoints = {
						benutzer_name: null,
						punkte: null
					};
					userPoints.benutzer_name = result.rows.item(i).benutzer_username;
					userPoints.punkte = result.rows.item(i).punkte;
					userWithPoints.push(userPoints);
				};                
			};
			return userWithPoints;
		});
	};	
	
	this.getBegegnungWithBenutzerTippForTipprunde = function(benutzer_id, tipprunde_id){
		var query = 'select (select mannschaft_name from mannschaft m where m.mannschaft_id = b.heimmannschaft_fid)heimmannschaft, (select mannschaft_name from mannschaft m where m.mannschaft_id = b.auswaertsmannschaft_fid)auswaertsmannschaft, begegnung_id, begegnung_tore_heimmannschaft, begegnung_tore_auswaertsmannschaft, t.tipp_tore_heimmannschaft, t.tipp_tore_auswaertsmannschaft, g.gruppe_name from begegnung b join gruppe g on b.gruppe_fid = g.gruppe_id left join (select * from tipp where benutzer_fid = ? AND tipprunde_fid = ?) t on b.begegnung_id = t.begegnung_fid';
		var begegnungen = [];
		return this.executeQuery(query, [benutzer_id, tipprunde_id]).then(function (result) {
			if (result.rows.length > 0) {
				for (var i = 0; i < result.rows.length; i++) {
					var begegnungWithTipp = {
						begegnung_id: null,
						begegnung_tore_auswaertsmannschaft: null,
						begegnung_tore_heimmannschaft: null,
						tipp_tore_auswaertsmannschaft: null,
						tipp_tore_heimmannschaft: null,
						heimmannschaft: null,
						auswaertsmannschaft: null,
						gruppe_name: null
					};
					begegnungWithTipp.begegnung_id = result.rows.item(i).begegnung_id;
					begegnungWithTipp.begegnung_tore_auswaertsmannschaft = result.rows.item(i).begegnung_tore_auswaertsmannschaft;
					begegnungWithTipp.begegnung_tore_heimmannschaft = result.rows.item(i).begegnung_tore_heimmannschaft;
					begegnungWithTipp.tipp_tore_auswaertsmannschaft = result.rows.item(i).tipp_tore_auswaertsmannschaft;
					begegnungWithTipp.tipp_tore_heimmannschaft = result.rows.item(i).tipp_tore_heimmannschaft;
					begegnungWithTipp.heimmannschaft = result.rows.item(i).heimmannschaft;
					begegnungWithTipp.auswaertsmannschaft = result.rows.item(i).auswaertsmannschaft;
					begegnungWithTipp.gruppe_name = result.rows.item(i).gruppe_name;
					begegnungen.push(begegnungWithTipp);
				};                
			};
			return begegnungen;
		});
	};
	
	this.changeTipp = function(tipp){
		var query = 'UPDATE Tipp SET tipp_tore_heimmannschaft = ?, tipp_tore_auswaertsmannschaft = ?, status = \'not_committed\' WHERE begegnung_fid = ? AND tipprunde_fid = ? AND benutzer_fid = ?';
		return $cordovaSQLite.execute(db, query, [tipp.tipp_tore_heimmannschaft, tipp.tipp_tore_auswaertsmannschaft, tipp.begegnung_fid, tipp.tipprunde_fid, tipp.benutzer_fid]).then(
            function (result) {
            },
            function (error) {
				console.error(error);
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
		
		var query = 'INSERT INTO ' + tablename + ' (' + columns + ') VALUES (' + questionmarks + ')';
		return $cordovaSQLite.execute(db, query, values).then(
            function (result) {
            },
            function (error) {
				console.error(error);
            });
	};
	
	this.insertOrReplaceDataIntoTable = function(tablename, data){
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
		
		var query = 'INSERT OR REPLACE INTO ' + tablename + ' (' + columns + ') VALUES (' + questionmarks + ')';
		return $cordovaSQLite.execute(db, query, values).then(
			function (result) {
			},
			function (error) {
				console.error(error);
			}
		);
	};

return this;
});