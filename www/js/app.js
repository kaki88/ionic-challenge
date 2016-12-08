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
    .config(function($stateProvider, $urlRouterProvider) {
      $stateProvider

          .state('home', {
              url: '/home',
              templateUrl: 'templates/home.html'
          })  
          
          .state('game', {
              url: '/game',
              templateUrl: 'templates/game.html',
              controller: 'GameCtrl'
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

      $urlRouterProvider.otherwise('/home')
    })


angular.module('starter.controllers', [])

    .controller('GameCtrl', function ($scope,$ionicPlatform, $state, CardsDataService) {
        $scope.$on('$ionicView.enter', function(e) {
            CardsDataService.getAll(function(data){
                $scope.indexToShow = 0;
                $scope.cardsList = data;
                $scope.findsList =  [];
                console.log(data);
                console.log( $scope.findsList);

                $scope.change = function(){
                    $scope.findsList.push($scope.cardsList[0]);
                    $scope.cardsList.splice(0,1);
                    console.log(data);
                    console.log( $scope.findsList);
                };
            })
        })

        $scope.gotoEdit = function(idNote){
            $state.go('form', {id: idNote})
        }
    })

    .controller('ListCtrl', function ($scope,$ionicPlatform, $state, CardsDataService) {
        $scope.$on('$ionicView.enter', function(e) {
            CardsDataService.getAll(function(data){
                $scope.itemsList = data
            })
        })

        $scope.gotoEdit = function(idNote){
            $state.go('form', {id: idNote})
        }
    })

    .controller('FormCtrl', function ($scope, $stateParams, $ionicPopup, $state, CardsDataService) {
        $scope.$on('$ionicView.enter', function(e) {
            initForm()
        })

        function initForm(){
            if($stateParams.id){
                CardsDataService.getById($stateParams.id, function(item){
                    $scope.noteForm = item
                })
            } else {
                $scope.noteForm = {}
            }
        }
        function onSaveSuccess(){
            $state.go('list')
        }
        $scope.saveNote = function(){

            if(!$scope.noteForm.id){
                CardsDataService.createNote($scope.noteForm).then(onSaveSuccess)
            } else {
                CardsDataService.updateNote($scope.noteForm).then(onSaveSuccess)
            }
        }

        $scope.confirmDelete = function(idNote) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Supprimer une note',
                template: 'êtes vous sûr de vouloir supprimer ?'
            })

            confirmPopup.then(function(res) {
                if(res) {
                    CardsDataService.deleteNote(idNote).then(onSaveSuccess)
                }
            })
        }


    })