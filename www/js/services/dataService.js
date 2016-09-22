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
		europameisterschaft_fid: null
	};
	
	var tipp = {
		begegnung_fid: null,
		tipprunde_fid: null,
		benutzer_fid: null,
		tipp_tore_heimmannschaft: null,
		tipp_tore_auswaertsmannschaft: null,
		status: null,
	};
	
this.getBenutzer = function(){
	return benutzer;
};

this.setBenutzer = function(benutzerNeu){
	benutzer.benutzer_id = benutzerNeu.benutzer_id;
	benutzer.benutzer_mailadresse = benutzerNeu.mailadresse;
	benutzer.benutzer_username = benutzerNeu.benutzer_username;
	benutzer.benutzer_passwort = benutzerNeu.benutzer_passwort;
};

return this;
});