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
				version = result.rows.item(0);
			}
			return version;
		});
	};
	
	this.updateTableVersion = function (tablename, version) {
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
					id: null,
					mailadresse: null,
					username: null,
					passwort: null,
					punkte: null
					};
				benutzer.username = result.rows.item(i).benutzer_username;
				benutzer.passwort = result.rows.item(i).benutzer_passwort;
				users.push(benutzer);
			};                
		};
		return users;
	});
    };
	
	this.updateBenutzer = function (benutzer) {
        var query = 'INSERT OR IGNORE INTO Benutzer (benutzer_username, benutzer_passwort) VALUES (?, ?)';
        $cordovaSQLite.execute(db, query, [benutzer.username, benutzer.passwort]);
    };

return this;
});