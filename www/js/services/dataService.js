myApp.factory('dataService', function(){
	var userModel = {
		username: null,
		password: null
	};
	
this.getUser = function(){
	return userModel;
};

this.setUser = function(userModel){
	this.userModel = userModel;
};

return this;
});