angular.module('starter', ['ionic','starter.controllers', 'starter.services'])

    .run(function($ionicPlatform) {
      $ionicPlatform.ready(function() {
        if(window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true)
          cordova.plugins.Keyboard.disableScroll(true)
        }
        if(window.StatusBar) {
          StatusBar.styleDefault()
        }
      })
    })
    // ----------------------------------------------------------------------------ROUTES
    .config(function($stateProvider, $urlRouterProvider) {
      $stateProvider

          .state('home', {
              url: '/home',
              templateUrl: 'templates/home.html'
          })  
          
          .state('jeu', {
              url: '/game',
              templateUrl: 'templates/game.html',
              controller: 'GameCtrl'
          })

          .state('configuration', {
          url: '/config',
          templateUrl: 'templates/config.html',
          controller: 'ConfigCtrl'
      })

          .state('regle-du-jeu', {
              url: '/rules',
              templateUrl: 'templates/rules.html'
          })

          .state('list', {
            url: '/list',
            templateUrl: 'templates/list.html',
            controller: 'ListCtrl'
          })

          .state('form', {
          url: '/form/{id}',
          templateUrl: 'templates/form.html',
          controller: 'FormCtrl',
          params: {
              id: {value: null},
          },
      })

          .state('listcards', {
              url: '/liste-des-cartes/{id}',
              templateUrl: 'templates/listcards.html',
              controller: 'CardCtrl',
              params: {
                  id: {value: null},
              },
          })

      $urlRouterProvider.otherwise('/home')
    })

