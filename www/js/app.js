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


    // ----------------------------------------------------------------------------JEU
    .controller('GameCtrl', function ($scope,$ionicPlatform, $state,$timeout, CardsDataService) {
        $scope.$on('$ionicView.enter', function(e) {
            CardsDataService.getAll(function(data){
                $scope.indexToShow = 0;
                $scope.cardsList = data;
                $scope.findsList =  [];
                $scope.scoreLeft = 0;
                $scope.scoreRight = 0;
                $scope.team = 1;
                $scope.counter = 40;
                var mytimeout = null;
                var round = 0;
                change('error');
// Scores
                $scope.valide = function(){
                    $scope.findsList.push($scope.cardsList[0]);
                    $scope.cardsList.splice(0,1);
                    if (round % 2 == 1) {
                    $scope.scoreRight++;
                    }
                  else {
                        $scope.scoreLeft++;
                    }
                };
// Faute de jeu
                $scope.error = function(){
                    round++;
                    change('error');
                    $scope.team =  (round % 2) + 1;
                };
// Joueurs prêts
                $scope.ready = function(){
                    change('start');
                    $scope.findsList =  [];
                    $scope.counter = 40;
                    startTimer();
                };

// Afficher ou masquer les elements
                function change(state){
                    if(state !== 'error'){
                        $scope.roundEnd = function(){
                            return "ng-hide";
                        }
                        $scope.roundStart = function(){
                            return "ng-show";
                        }
                    } else {
                        $scope.roundEnd = function(){
                            return "ng-show";
                        }
                        $scope.roundStart = function(){
                            return "ng-hide";
                        }
                    }
                }

                $scope.onTimeout = function() {
                    if($scope.counter ===  0) {
                        $scope.$broadcast('timer-stopped', 0);
                        $timeout.cancel(mytimeout);
                        round++;
                        change('error');
                        $scope.team =  (round % 2) + 1;
                        return;
                    }
                    $scope.counter--;
                    mytimeout = $timeout($scope.onTimeout, 1000);
                };

                $scope.waitTimer = function() {
                    $timeout.cancel(mytimeout);
                };

                $scope.restartTimer = function() {
                    startTimer();
                };

                function startTimer() {
                    mytimeout = $timeout($scope.onTimeout, 1000);
                };

                // temps écoulé
                $scope.$on('timer-stopped', function(event, remaining) {
                    if(remaining === 0) {


                    }
                });


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