myApp.factory('restService', function($http, databaseService){

//var serverURL = 'http://192.168.2.102';
var serverURL = 'http://127.0.0.1';

this.getOpenLigaMatches = function(){
	return $http.get('http://www.openligadb.de/api/getmatchdata/em2016/2016/1');
};

this.getServerData = function(param){
	return $http.get(serverURL+'/restController.php?'+param);
};

this.postDataToServer = function(param){
	var fakeUsertableEntry = {
		benutzer_id: 11,
		benutzer_mailadresse: 'test@test.de',
		benutzer_password: 'testpasswort',
		benutzer_username: 'ionicgenerateduser',
		benutzer_punkte: 0,
		version: 0,
		operation: 'INSERT'
	}
	
	return $http.post(serverURL+'/restController.php', fakeUsertableEntry);
};

return this;
});