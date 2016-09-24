angular.module('app.controllers', [])

.controller('restTestViewController', function ($scope, restService, databaseService, dataService) {

  $scope.testSQL = function(){
    restService.syncTableWithServer('Tipp').then(function(response){
      $scope.returnedData = response;
    });
  } 
  
  $scope.testCreateTipprunde = function(){
    var tipprunde = {
      tipprunde_id: null,
      tipprunde_name: 'FHTipprunde5',
      tipprunde_passwort: 'geheim',
      europameisterschaft_fid: 1,   
    };
    
    restService.createTipprunde(tipprunde).then(function(response){
      $scope.returnedData = response;
    });
  };
  
  $scope.testCreateTipp = function(){
    var loggedInBenutzerID = dataService.getBenutzer().benutzer_id;
    var tipp = {
      begegnung_fid: 1,
      tipprunde_fid: 1,
      benutzer_fid: 1,//loggedInBenutzerID,
      tipp_tore_heimmannschaft: 3,
      tipp_tore_auswaertsmannschaft: 4,
      status: null,
    };
    
    // Create a first tipp
    restService.createTipp(tipp).then(function(response){
      $scope.returnedData = response;
    });
    
    // Create a second tipp
    tipp.begegnung_fid = 2;
    restService.createTipp(tipp).then(function(response){
      $scope.returnedData = response;
    });
    
    restService.sendTippsToServer().then(function(response){
      $scope.returnedData = $scope.returnedData + response;
    });
  };
  
  $scope.testChangeTipp = function(){
    var tipprunde_id = 1;
    databaseService.getAllTippsForTipprunde(tipprunde_id).then(function(response){
      var tipps = response;
      tipps[0]["tipp_tore_auswaertsmannschaft"] = 777;
      databaseService.changeTipp(tipps[0]).then(function(response){
        $scope.returnedData = response;
      });
    });
  };
  
  $scope.getAllTipprunden = function(){ 
    databaseService.getAllTipprunden().then(function(response){
      $scope.returnedData = response;
    });
  };
  
  $scope.getAllTippsForTipprunde = function(){  
    // Get all Tipps that belong to Tipprunde with ID = 1, see testCreateTipprunde and testCreateTipp for creation of sample data
    var tipprunde_id = 1;
    databaseService.getAllTippsForTipprunde(tipprunde_id).then(function(response){
      $scope.returnedData = response;
    });
  };
  
  $scope.getPunkteForAllUsersOfTipprunde = function(){  
    var tipprunde_id = 1;
    databaseService.getPunkteForAllUsersOfTipprunde(tipprunde_id).then(function(response){
      // Database not populated enough to make this query, dummy data returned
      var userPoints1 = {
        benutzer_name: 'Max',
        punkte: 12
      };
      var userPoints2 = {
        benutzer_name: 'Felix',
        punkte: 21
      };
      var data = [];
      data.push(userPoints1);
      data.push(userPoints2);
      $scope.returnedData = data;
    });
  };
  
  $scope.triggerServerFetchOpenLigaDB = function(){ 
    restService.triggerServerFetchOpenLigaDB().then(function(response){
      $scope.returnedData = response;
    });
  };
})


.controller('loginViewController', function ($scope, $state, dataService, databaseService, restService) {
  // Globale variablen werden über den dataService verwaltet
  $scope.benutzer = dataService.getBenutzer();
 
 
  $scope.register = function(){
    restService.createUser($scope.benutzer).then(function(response){
      $scope.serverResponse = response;
    });
  }
 
    $scope.login = function() {
    databaseService.getBenutzer().then(function(users){
      // Enable console in command line: start app with "ionic serve", enter, then type "c", enter
      // Using console for debug purposes to see what we retrieved from db
      for (var i = 0; i < users.length; i++) {
        console.log(users[i].benutzer_username);
      };

      for (var i = 0; i < users.length; i++) {
        if(users[i].benutzer_username == $scope.benutzer.benutzer_username && users[i].benutzer_passwort == $scope.benutzer.benutzer_passwort){
          dataService.setBenutzer(users[i]);
          console.log(users[i]);
          $state.go("state_groupListViewDisplayed");
        };
      };
    });   
    }
  
})

.controller('groupListViewController', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {
  $scope.benutzer = dataService.getBenutzer();
}])

     
.controller('registrierungCtrl', ['$scope', '$stateParams', 'restService', '$state', 'dataService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, restService, $state, dataService) {
	$scope.benutzer = dataService.getBenutzer();
	$scope.register = function(){
		restService.createUser($scope.benutzer).then(function(response){
			if(response == 'User was created.'){
				$state.go("login");
			}else{
				$scope.serverResponse = response;
			}
		});
	};

}])
   
.controller('loginCtrl', ['$scope', '$stateParams', 'dataService', 'databaseService', 'restService', '$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, dataService, databaseService, restService, $state) {
	
	$scope.benutzer = dataService.getBenutzer();
	
    $scope.login = function() {
  		databaseService.getBenutzer().then(function(users){
  		  // Enable console in command line: start app with "ionic serve", enter, then type "c", enter
  		  // Using console for debug purposes to see what we retrieved from db
  		  for (var i = 0; i < users.length; i++) {
  			console.log(users[i].benutzer_username);
  		  };
  		  
  		  for (var i = 0; i < users.length; i++) {
  			if(users[i].benutzer_username == $scope.benutzer.benutzer_username && users[i].benutzer_passwort == $scope.benutzer.benutzer_passwort){
  			  dataService.setBenutzer(users[i]);
  			  console.log(users[i]);
  			  $state.go("tabsController.spiele");
  			};
  		  };
  		});   
    }

    $scope.continue = function() {
      databaseService.getBenutzer().then(function(users){
          $state.go("tabsController.spiele");
      }
    )}
}])
   
.controller('punkteCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {

  
  $scope.addEntry = function() {
    var newItem = {};
    newItem.description = 'bla';
    $scope.punkte.push(newItem);
  }
  

}])
   

.controller('spieleCtrl', function($scope, $ionicPopup, $timeout) {
  $scope.getTipprundenName = function () {
      $scope.tipprunde.name = 'Tipprunde';
  };

  $scope.showTipprundenCreator = function() {

  var myPopup = $ionicPopup.show({
    // TODO
    template: '<input type="text" >', <!-- ng-model="data.wifi" -->
    title: 'Tipprunde anlegen',
    //subTitle: 'Untertitel',
    scope: $scope,
    buttons: [
      { text: 'Zurück' },
      {
        text: '<b>Speichern</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.data.wifi) {

            // DO SOMETHING

            //don't allow the user to close 
            //e.preventDefault();
            
            // close programatically
            //myPopup.close();
          } else {
            // ELSE
          }
        }
      }
    ]
  });
  };
})

   
.controller('tipprundenCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {








}])
   
.controller('einstellungenCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('pageCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])



   
.controller('testPageCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('testPageCtrl', function($scope, $ionicPopup, $timeout) {
  // $scope.data = {} 

  $scope.addEntry = function() {

    var para = document.createElement("p");
    var node = document.createTextNode("new entry here");
    para.appendChild(node);

    var element = document.getElementById("ladida");
    element.appendChild(para);
  }

  $scope.addItem = function() {
    <!--$("#ladidaListe").append('<p>Test</p>');-->

    var item = '<a class="item item-thumbnail-left" href="#">'
          +'<img src="img/fruit.jpg">'
          +'<h2>Pretty Hate Machine</h2>'
          +'<p>Nine Inch Nails</p>'
          +'</a>';
    <!--var list = document.getElementById("ladidaListe");-->
    $('#ladidaListe').append(item);
  }
  
  $scope.showPopup = function() {

  // An elaborate, custom popup
  var myPopup = $ionicPopup.show({
    template: '<input type="text" >', <!-- ng-model="data.wifi" -->
    title: 'Titel',
    subTitle: 'Untertitel',
    scope: $scope,
    buttons: [
      { text: 'Zurück' },
      {
        text: '<b>Speichern</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.data.wifi) {

            // DO SOMETHING

            //don't allow the user to close 
            //e.preventDefault();
            
            // close programatically
            //myPopup.close();
          } else {
            // ELSE
          }
        }
      }
    ]
  });
  };
});

 