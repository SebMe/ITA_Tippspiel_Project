angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  
  .state('tabsController', {
    url: '/tabControllerElement',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('registrierung', {
    url: '/viewRegister',
    templateUrl: 'templates/registrierung.html',
    controller: 'registrierungCtrl'
  })

  .state('login', {
    url: '/viewLogin',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('tabsController.punkte', {
    url: '/viewPunkte',
    views: {
      'tab3': {
        templateUrl: 'templates/punkte.html',
        controller: 'punkteCtrl'
      }
    }
  })

  .state('tabsController.spiele', {
    url: '/viewSpiele',
    views: {
      'tab2': {
        templateUrl: 'templates/spiele.html',
        controller: 'spieleCtrl'
      }
    }
  })

  .state('tabsController.tipprunden', {
    url: '/viewTipprunden',
    views: {
      'tab1': {
        templateUrl: 'templates/tipprunden.html',
        controller: 'tipprundenCtrl'
      }
    }
  })

  .state('tabsController.einstellungen', {
    url: '/viewEinstellungen',
    views: {
      'tab4': {
        templateUrl: 'templates/einstellungen.html',
        controller: 'einstellungenCtrl'
      }
    }
  })

  .state('page', {
    url: '/page12',
    templateUrl: 'templates/page.html',
    controller: 'pageCtrl'
  })

  .state('tabsController.testPage', {
    url: '/testPage',
    views: {
      'tab5': {
        templateUrl: 'templates/testPage.html',
        controller: 'testPageCtrl'
      }
    }
  })

  .state('tabsController.loginView', {
    url: '/loginView',
    views: {
      'tab6': {
        templateUrl: 'templates/loginView.html',
        controller: 'loginViewController'
      }
    }
  })

  .state('tabsController.restTestViewDisplayed', {
    url: '/restTestView',
    views: {
      'tab7': {
        templateUrl: 'templates/restTestView.html',
        controller: 'restTestViewController'
      }
    }
  })

  .state('tabsController.groupListView', {
    url: '/groupListView',
    views: {
      'tab8': {
        templateUrl: 'templates/groupListView.html',
        controller: 'groupListViewController'
      }
    }
  })

$urlRouterProvider.otherwise('/viewLogin')

  

});