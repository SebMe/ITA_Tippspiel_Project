// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var db = null;

var myApp = angular.module('starter', ['ionic', 'ngCordova'])

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
    	
		$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS table_versions(ID INTEGER PRIMARY KEY, tablename TEXT, version TIMESTAMP, UNIQUE(tablename))"); 
		
		 // Reihenfolge: Benutzer, Zeitzone, Mannschaft, Gruppe, Europameisterschaft, Gruppe_Enthaelt_Mannschaft, Europameisterschaft_beinhaltet_Mannschaft, Begegnung, Mannschaft_bestreitet_Begegnung, Tipprunde, Benutzer_spielt_Tipprunde, Tipp
		$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Benutzer(benutzer_id INTEGER PRIMARY KEY, benutzer_mailadresse TEXT UNIQUE, benutzer_passwort TEXT, benutzer_username TEXT UNIQUE)");     
		$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Zeitzone(zeitzone_id INTEGER PRIMARY KEY AUTOINCREMENT, zeitzone_name TEXT UNIQUE)");
		$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Mannschaft(mannschaft_id INTEGER PRIMARY KEY AUTOINCREMENT, mannschaft_name TEXT UNIQUE, mannschaft_flagge BLOB)");
		$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Gruppe(gruppe_id INTEGER PRIMARY KEY AUTOINCREMENT, gruppe_name TEXT, gruppe_orderID TEXT UNIQUE, gruppe_leagueshortcut TEXT UNIQUE)");
		$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Europameisterschaft(europameisterschaft_id INTEGER PRIMARY KEY AUTOINCREMENT, europameisterschaft_jahr TEXT UNIQUE, europameisterschaft_ort TEXT)");
		$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Gruppe_enthaelt_Mannschaft(gruppe_fid INTEGER NOT NULL, mannschaft_fid INTEGER NOT NULL, PRIMARY KEY(gruppe_fid, mannschaft_fid), FOREIGN KEY(gruppe_fid) REFERENCES Gruppe(gruppe_id), FOREIGN KEY(mannschaft_fid) REFERENCES Mannschaft(mannschaft_id))"); 
		$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Europameisterschaft_beinhaltet_Mannschaft(europameisterschaft_fid INTEGER NOT NULL, mannschaft_fid INTEGER NOT NULL, PRIMARY KEY(europameisterschaft_fid, mannschaft_fid), FOREIGN KEY(europameisterschaft_fid) REFERENCES Europameisterschaft(europameisterschaft_id), FOREIGN KEY(mannschaft_fid) REFERENCES Mannschaft(mannschaft_id))");
		$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Begegnung(begegnung_id INTEGER PRIMARY KEY AUTOINCREMENT, begegnung_spieltermin TEXT, begegnung_tore_heimmannschaft INTEGER, begegnung_tore_auswaertsmannschaft INTEGER, begegnung_zeitzone_fid INTEGER NOT NULL, begegnung_gruppe_fid INTEGER NOT NULL, begegnung_europameisterschaft_fid INTEGER NOT NULL, FOREIGN KEY(begegnung_zeitzone_fid) REFERENCES Zeitzone(zeitzone_id), FOREIGN KEY(begegnung_gruppe_fid) REFERENCES Gruppe(gruppe_id), FOREIGN KEY(begegnung_europameisterschaft_fid) REFERENCES Europameisterschaft(europameisterschaft_id))");
		$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Mannschaft_bestreitet_Begegnung(mannschaft_fid INTEGER NOT NULL, begegnung_fid INTEGER NOT NULL, mbb_heimmannschaft INTEGER, PRIMARY KEY(mannschaft_fid, begegnung_fid), FOREIGN KEY(mannschaft_fid) REFERENCES Mannschaft(mannschaft_id), FOREIGN KEY(begegnung_fid) REFERENCES Begegnung(begegnung_id))");    
		$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Tipprunde(tipprunde_id INTEGER PRIMARY KEY AUTOINCREMENT, tipprunde_name TEXT UNIQUE, tipprunde_passwort TEXT, tipprunde_europameisterschaft_fid INTEGER NOT NULL, FOREIGN KEY(tipprunde_europameisterschaft_fid) REFERENCES Europameisterschaft(europameisterschaft_id))");
		$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Benutzer_spielt_Tipprunde(benutzer_fid INTEGER NOT NULL, tipprunde_fid INTEGER NOT NULL, PRIMARY KEY(benutzer_fid, tipprunde_fid), punkte INTEGER, FOREIGN KEY(benutzer_fid) REFERENCES Benutzer(benutzer_id), FOREIGN KEY(tipprunde_fid) REFERENCES Tipprunde(tipprunde_id))");
		$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Tipp(begegnung_fid INTEGER NOT NULL, benutzer_fid INTEGER NOT NULL, tipprunde_fid INTEGER NOT NULL, tipp_tore_heimmannschaft INTEGER, tipp_tore_auswaertsmannschaft INTEGER, tipp_datum TIMESTAMP DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(begegnung_fid, benutzer_fid, tipprunde_fid), FOREIGN KEY(begegnung_fid) REFERENCES Begegnung(begegnung_id), FOREIGN KEY(benutzer_fid) REFERENCES Benutzer(benutzer_id), FOREIGN KEY(tipprunde_fid) REFERENCES Tipprunde(tipprunde_id))");
		
		// Init tables
		$cordovaSQLite.execute(db, "INSERT OR IGNORE INTO table_versions (tablename, version) VALUES ('Benutzer', 0)");
		$cordovaSQLite.execute(db, "INSERT OR IGNORE INTO table_versions (tablename, version) VALUES ('Tipprunde', 0)");
		$cordovaSQLite.execute(db, "INSERT OR IGNORE INTO table_versions (tablename, version) VALUES ('Benutzer_spielt_Tipprunde', 0)");
		$cordovaSQLite.execute(db, "INSERT OR IGNORE INTO table_versions (tablename, version) VALUES ('Tipp', 0)");
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

    $stateProvider.state('state_restTestViewDisplayed', {
        url: '/restTestView',
        views: {
            name_restTestView: {
                templateUrl: 'views/restTestView/restTestView.html'
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