myApp.factory('dataService', function(){
	var benutzer = {
					id: null,
					mailadresse: null,
					username: null,
					passwort: null,
					punkte: null
					};
	
this.getBenutzer = function(){
	return benutzer;
};

this.setBenutzer = function(userModel){
	this.benutzer = benutzer;
};

return this;
});