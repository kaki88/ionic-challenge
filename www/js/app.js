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

          .state('accueil', {
              url: '/accueil',
              templateUrl: 'templates/home.html',
              controller: 'Home'
          })  
          
          .state('jeu', {
              url: '/jeu',
              templateUrl: 'templates/game.html',
              controller: 'GameCtrl'
          })

          .state('parametres', {
          url: '/parametres',
          templateUrl: 'templates/config.html',
          controller: 'ConfigCtrl'
      })

          .state('regles-du-jeu', {
              url: '/regles-du-jeu',
              templateUrl: 'templates/rules.html'
          })

          .state('categories', {
            url: '/categories',
            templateUrl: 'templates/list.html',
            controller: 'ListCtrl'
          })

          .state('creer', {
          url: '/{cid}-{cat}/creer',
          templateUrl: 'templates/formadd.html',
          controller: 'FormCtrl',
          params: {
              id: {value: null},
          },
      })

          .state('edition', {
              url: '/{cid}-{cat}/{id}-{title}/edition',
              templateUrl: 'templates/formcard.html',
              controller: 'FormCardCtrl',
              params: {
                  id: {value: null},
              },
          })

          .state('cartes', {
              url: '/cartes/{id}-{cat}',
              templateUrl: 'templates/listcards.html',
              controller: 'CardCtrl',
              params: {
                  id: {value: null},
              },
          })

      $urlRouterProvider.otherwise('/accueil')
    })

