// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.filters'])

.run(function($ionicPlatform, $http, User) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    if(window.localStorage.getItem('token')){
        $http.get('http://localhost:4567/users/' +window.localStorage.getItem('token')).then(function(res){
          if(res.data==='invalid token'){
            window.localStorage.removeItem("token");
          }
          else{
            User.login(res.data)
          }
        })
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.places', {
      url: '/places',
      views: {
        'tab-places': {
          templateUrl: 'templates/tab-places.html',
          controller: 'PlacesCtrl'
        }
      }
    })
    .state('tab.places-show', {
        url: '/places/show/',
        views: {
          'tab-places': {
            templateUrl: 'templates/places-show.html',
            controller: 'PlacesDisplayCtrl',
          }
        }
      })
    .state('tab.people', {
        url: '/people',
        views: {
          'tab-people': {
            templateUrl: 'templates/tab-people.html',
            controller: 'PeopleCtrl'
          }
        }
      })
      .state('tab.people-show', {
          url: '/people/show/',
          views: {
            'tab-people': {
              templateUrl: 'templates/people-show.html',
              controller: 'PeopleDisplayCtrl',
            }
          }
        })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })
  .state('tab.login', {
  url: '/account/login',
  views: {
    'tab-account': {
      templateUrl: 'templates/account-login.html',
      controller: 'LoginCtrl'
    }
  }
});

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});
