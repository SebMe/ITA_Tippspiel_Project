myApp.factory('dataService', function(){
	var benutzer = {
					benutzer_id: null,
					benutzer_mailadresse: null,
					benutzer_username: null,
					benutzer_passwort: null,
					benutzer_punkte: null
					};
	
this.getBenutzer = function(){
	return benutzer;
};

this.setBenutzer = function(userModel){
	this.benutzer = benutzer;
};

return this;
});