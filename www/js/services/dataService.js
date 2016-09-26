myApp.factory('dataService', function(){
	
	var selectedTipprunde = {
		tipprunde_id: null,
		tipprunde_name: null,
		tipprunde_passwort: null
	}
	
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

	this.getSelectedTipprunde = function(){
		return selectedTipprunde;
	}
	
	this.setSelectedTipprunde = function(tipprundeNeu){
		selectedTipprunde.tipprunde_id = tipprundeNeu.tipprunde_id;
		selectedTipprunde.tipprunde_name = tipprundeNeu.tipprunde_name;
		selectedTipprunde.tipprunde_passwort = tipprundeNeu.tipprunde_passwort;
	}
	
	this.getBenutzer = function(){
		return benutzer;
	};

	this.setBenutzer = function(benutzerNeu){
		benutzer.benutzer_id = benutzerNeu.benutzer_id;
		benutzer.benutzer_mailadresse = benutzerNeu.benutzer_mailadresse;
		benutzer.benutzer_username = benutzerNeu.benutzer_username;
		benutzer.benutzer_passwort = benutzerNeu.benutzer_passwort;
	};

return this;
});