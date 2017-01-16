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


        var admobid = {};

// select the right Ad Id according to platform

        if( /(android)/i.test(navigator.userAgent) ) {
            admobid = { // for Android
                banner: 'ca-app-pub-3193271501395281/5676408651',
                interstitial: 'ca-app-pub-3193271501395281/9467479859'
            };
        } else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
            admobid = { // for iOS
                banner: 'ca-app-pub-3193271501395281/5676408651',
                interstitial: 'ca-app-pub-3193271501395281/9467479859'
            };
        } else {
            admobid = { // for Windows Phone
                banner: 'ca-app-pub-3193271501395281/5676408651',
                interstitial: 'ca-app-pub-3193271501395281/9467479859'
            };
        }

        if(window.AdMob) AdMob.createBanner( {
            adId:admobid.banner,
            isTesting: true,
            position:AdMob.AD_POSITION.BOTTOM_CENTER,
            autoShow:true} );

        if(window.AdMob) AdMob.prepareInterstitial( {
            adId:admobid.interstitial,
            autoShow:true} );


        


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

