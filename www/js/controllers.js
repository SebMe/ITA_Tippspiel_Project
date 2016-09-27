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
      tipprunde_name: 'FHTipprunde7',
      tipprunde_passwort: 'geheim',
      europameisterschaft_fid: 1,   
    };
    
    restService.createTipprunde(tipprunde).then(function(response){
	 $scope.returnedData = response;
    });
  };
    
    $scope.testUserJoinsTipprunde = function(){
		var loggedInBenutzerID = dataService.getBenutzer().benutzer_id;
		var tipprunde_id = 16;
		restService.createBenutzerSpieltTipprunde(tipprunde_id, loggedInBenutzerID).then(function(response){
			$scope.returnedData = response;
		});
	}
  
  $scope.testCreateTipp = function(){
    var loggedInBenutzerID = dataService.getBenutzer().benutzer_id;
    var tipp = {
      begegnung_fid: 165,
      tipprunde_fid: 16,
      benutzer_fid: loggedInBenutzerID,
      tipp_tore_heimmannschaft: 3,
      tipp_tore_auswaertsmannschaft: 4,
      status: null,
    };
    
    // Create a first tipp
    restService.createTipp(tipp).then(function(response){
      $scope.returnedData = response;
    });
    
    // Create a second tipp
    tipp.begegnung_fid = 166;
    restService.createTipp(tipp).then(function(response){
      $scope.returnedData = response;
    });
    
    restService.sendTippsToServer().then(function(response){
      $scope.returnedData = $scope.returnedData + response;
    });
  };
  
  $scope.testChangeTipp = function(){
    var tipprunde_id = 16;
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

	$scope.continue = function() {
      databaseService.getBenutzer().then(function(users){
          $state.go("tabsController.tipprunden");
      }
    )}

	$scope.benutzer = dataService.getBenutzer();
	
    $scope.login = function() {
  		databaseService.getBenutzer().then(function(users){
  		  // Enable console in command line: start app with "ionic serve", enter, then type "c", enter
  		  // Using console for debug purposes to see what we retrieved from db
  		  for (var i = 0; i < users.length; i++) {
  			console.log(users[i].benutzer_username);
  		  }
  		  
  		  for (var i = 0; i < users.length; i++) {
  			if(users[i].benutzer_username == $scope.benutzer.benutzer_username && users[i].benutzer_passwort == $scope.benutzer.benutzer_passwort){
  			  dataService.setBenutzer(users[i]);
  			  console.log(users[i]);
  			  $state.go("tabsController.tipprunden");
  			};
  		  };
  		});   
    }

    
}])


.controller('ladidaCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {
  $scope.goTo = function(){
        $state.go('tabsController.spiele');
    }

}])
   
.controller('punkteCtrl', ['$scope', '$stateParams', 'dataService', 'databaseService', 'restService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, dataService, databaseService, restService) {
	$scope.$on('$ionicView.enter', function () {
		var selectedTipprunde = dataService.getSelectedTipprunde();
		restService.syncAllTables().then(function(response){
			databaseService.getPunkteForAllUsersOfTipprunde(selectedTipprunde.tipprunde_id).then(function(response){
				$scope.tipprundePunkte = response;
			});
		});
	});
}])
   

.controller('tipprundenCtrl' ,[ '$scope', 'restService', '$ionicPopup', 'databaseService', '$state', 'dataService',
function($scope, restService, $ionicPopup, databaseService, $state, dataService) {
  $scope.$on('$ionicView.enter', function () {
	  $scope.tipprunde = {
            tipprunde_id: null,
            tipprunde_name: null,
            tipprunde_passwort: null,
            europameisterschaft_fid: 1,   
        }
		
	databaseService.getAllTipprunden().then(function(response){
		$scope.tipprunden = response;
	})
  })

  $scope.tipprundeClicked = function (clickedTipprunde) {	
  $scope.userInput = {tipprunde_passwort: null};
  $scope.serverResponse = '';
	var myPopup = $ionicPopup.show({
		template: '<input type="password" placeholder="Passwort der Tipprunde" ng-model="userInput.tipprunde_passwort">{{serverResponse}}',
		title: 'Tipprunde beitreten',
		scope: $scope,
		buttons: [
		  { text: 'Zurück' },
		  {
			text: '<b>Beitreten</b>',
			type: 'button-positive',
			onTap: function(e) {
				e.preventDefault();
				if($scope.userInput.tipprunde_passwort == clickedTipprunde.tipprunde_passwort){
					var benutzer = dataService.getBenutzer();
					databaseService.checkUserPlaysTipprunde(benutzer.benutzer_id,clickedTipprunde.tipprunde_id).then(function(response){			
						if(response == false){
							restService.createBenutzerSpieltTipprunde(clickedTipprunde.tipprunde_id, benutzer.benutzer_id).then(function(response){
								dataService.setSelectedTipprunde(clickedTipprunde);
								$state.go("tabsController.spiele");
								myPopup.close();
							});
						} else {
							dataService.setSelectedTipprunde(clickedTipprunde);
							$state.go("tabsController.spiele");
							myPopup.close();
						}
					});
				} else {
					$scope.serverResponse = 'Falsches Passwort';
				}
			}
		  }
		]
	});
  };

  $scope.showTipprundenCreator = function() {
	  $scope.serverResponse = "";
	var myPopup = $ionicPopup.show({
		template: '<input type="text" placeholder="Name der Tipprunde" ng-model="tipprunde.tipprunde_name"> <input type="password" placeholder="Passwort der Tipprunde" ng-model="tipprunde.tipprunde_passwort">{{serverResponse}}',
		title: 'Tipprunde anlegen',
		//subTitle: 'Untertitel',
		scope: $scope,
		buttons: [
		  { text: 'Zurück' },
		  {
			text: '<b>Speichern</b>',
			type: 'button-positive',
			onTap: function(e) {
				e.preventDefault();
				if($scope.tipprunde.tipprunde_name == null || $scope.tipprunde.tipprunde_name == "" ||
					$scope.tipprunde.tipprunde_passwort == null || $scope.tipprunde.tipprunde_passwort == "" ){
						return;
					}
					
				restService.createTipprunde($scope.tipprunde).then(function(response){	
					if(response=='Tipprunde was created.'){
						databaseService.getAllTipprunden().then(function(response){
							$scope.tipprunden = response;
						});
						myPopup.close();
					} else {
						$scope.serverResponse=response;
					}
				})
			}
		  }
		]
	});
  };
 }])

.controller('spieleCtrl', function ($scope, restService, databaseService, dataService, $ionicPopup) {
	
	var loadBegegnungen = function(){
		var loggedInBenutzerID = dataService.getBenutzer().benutzer_id;
		var selectedTipprunde = dataService.getSelectedTipprunde();
		if(selectedTipprunde.tipprunde_id == null){
		    var alertPopup = $ionicPopup.alert({
				title: 'Keine Tipprunde ausgewählt',
				template: 'Eine Tipprunde kann über die Suche gefunden und ausgewählt werden'
			});	
		} else {
			databaseService.getBegegnungWithBenutzerTippForTipprunde(loggedInBenutzerID, selectedTipprunde.tipprunde_id).then(function(response){
				$scope.begegnungen = response;
			});
		}
	};
	
	$scope.$on('$ionicView.enter', function () {
		loadBegegnungen();
	});
	
	$scope.selectGruppe = function(gruppe){
		$scope.selectedGruppe = gruppe;
	}
	
	$scope.begegnungClicked = function(clickedBegegnung){
		$scope.selectedBegegnung = clickedBegegnung;
		$scope.newTipp = {
			tipp_tore_heimmannschaft: null,
			tipp_tore_auswaertsmannschaft: null
		};
		var myPopup = $ionicPopup.show({
			template:  '<label class="item-input"> <span class="input-label">{{selectedBegegnung.heimmannschaft}}</span> <input type="number" ng-model="newTipp.tipp_tore_heimmannschaft"></label> <label class="item-input"> <span class="input-label">{{selectedBegegnung.auswaertsmannschaft}}</span> <input type="number" ng-model="newTipp.tipp_tore_auswaertsmannschaft"></label> ',
			title: 'Tipp abgeben',
			scope: $scope,
			buttons: [
			  { text: 'Zurück' },
			  {
				text: '<b>Speichern</b>',
				type: 'button-positive',
				onTap: function(e) {
					e.preventDefault();
					if($scope.newTipp.tipp_tore_auswaertsmannschaft == null || $scope.newTipp.tipp_tore_auswaertsmannschaft < 0 ||
						$scope.newTipp.tipp_tore_heimmannschaft == null || $scope.newTipp.tipp_tore_heimmannschaft < 0){
							return;
						}
					var loggedInBenutzerID = dataService.getBenutzer().benutzer_id;
					var selectedTipprunde = dataService.getSelectedTipprunde();
					var tipp ={
						benutzer_fid: loggedInBenutzerID,
						tipprunde_fid: selectedTipprunde.tipprunde_id,
						begegnung_fid: clickedBegegnung.begegnung_id,
						tipp_tore_auswaertsmannschaft: $scope.newTipp.tipp_tore_auswaertsmannschaft,
						tipp_tore_heimmannschaft: $scope.newTipp.tipp_tore_heimmannschaft						
					};
					var noTippExistsForBegegnung = clickedBegegnung.tipp_tore_auswaertsmannschaft == null;
					
					if(noTippExistsForBegegnung){
						restService.createTipp(tipp).then(function(response){
							loadBegegnungen();
							restService.sendTippsToServer();
							myPopup.close();
						});
					} else {
						databaseService.changeTipp(tipp).then(function(response){
							loadBegegnungen();
							restService.sendTippsToServer();
							myPopup.close();
						});
					}
				}
			  }
			]
		});
	}
})

   
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

 