myApp.factory('dataService', function(){
	var benutzer = {
		benutzer_id: null,
		benutzer_mailadresse: null,
		benutzer_username: null,
		benutzer_passwort: null,
		};
	
	var tipprunde = {
		tipprunde_id: null,
		tipprunde_name: null,
		tipprunde_passwort: null,
		tipprunde_europameisterschaft_fid: null
	};
	
	var tipp = {
		begegnung_fid: null,
		tipprunde_fid: null,
		benutzer_fid: null,
		tipp_tore_heimmannschaft: null,
		tipp_tore_auswaertsmannschaft: null,
		tipp_datum: null
	};
	
this.getBenutzer = function(){
	return benutzer;
};

this.setBenutzer = function(userModel){
	this.benutzer = benutzer;
};

return this;
});