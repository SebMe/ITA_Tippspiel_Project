// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var db = null;

var myApp = angular.module('starter', ['ionic', 'angularSoap', 'ngCordova'])

.run(function($ionicPlatform, $cordovaSQLite) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
	
	// window.openDB is used on the actual phone, window.openDatabase is chrome Syntax, to be able to use the "ionic serve" command to run the app in google chrome browser on pc
        // See https://gist.github.com/borissondagh/29d1ed19d0df6051c56f 
        if (window.cordova) {
            // App syntax
            db = $cordovaSQLite.openDB({name:"myapp.db", iosDatabaseLocation:'default'});
        } else {
            // Google Chrome Syntax
            // Database is stored by Chrome under C:\Users\Seb\AppData\Local\Google\Chrome\User Data\Default\databases\http_192.168.2.100_8100\1 - open with SqliteBrowser(Open DB, Show all files, pick the 1)
            db = window.openDatabase("myapp.db", "1.0", "MyAppInfo", -1);
        }
    
        // Create the user_table in case this is the first time the app is ever started		
		$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS User_Table(ID INTEGER PRIMARY KEY AUTOINCREMENT, Username TEXT, Password TEXT, UNIQUE(Username))");       
  });
});

// Solves a tab issue, that would otherwise be shown at the top of the screen
myApp.config(function ($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.tabs.style("standard"); //Makes them all look the same across all OS
});

  // State Machine for the App, common way to have more than one view
// See http://learn.ionicframework.com/formulas/navigation-and-routing-part-1/
myApp.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/')

    $stateProvider.state('state_soapTestViewDisplayed', {
        url: '/soapTestView',
        views: {
            name_soapTestView: {
                templateUrl: 'views/soapTestView/soapTestView.html'
            }
        }
    });
	
	$stateProvider.state('state_loginViewDisplayed', {
        url: '/loginView',
        views: {
            name_loginView: {
                templateUrl: 'views/loginView/loginView.html'
            }
        }
    });
	
		$stateProvider.state('state_groupListViewDisplayed', {
        url: '/groupListView',
        views: {
            name_groupListView: {
                templateUrl: 'views/groupListView/groupListView.html'
            }
        }
    });
});