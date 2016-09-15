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
	
	 this.updateUsertable = function (user) {
        var insert_usertable_query = 'INSERT OR IGNORE INTO User_Table (Username, Password) VALUES (?, ?)';
        $cordovaSQLite.execute(db, insert_usertable_query, [user.username, user.password]);
    };
	
	this.getUsertable = function () {
	var query = 'SELECT * from User_Table';
	var users = [];
	return this.executeQuery(query, []).then(function (result) {
		if (result.rows.length > 0) {
			for (var i = 0; i < result.rows.length; i++) {
				var user = {
					username: null,
					password: null
					};
				user.username = result.rows.item(i).Username;
				user.password = result.rows.item(i).Password;
				users.push(user);
			};                
		};
		return users;
	});
    };
	
	this.update_table_versions = function(tableInfo){
		var query = 'INSERT OR IGNORE INTO table_versions (ID, tablename, version) VALUES (?, ?, ?)';
		$cordovaSQLite.execute(db, query, [tableInfo.id, tableInfo.tablename, tableInfo.version]);
	}

return this;
});