angular.module('starter.controllers', [])

// ----------------------------------------------------------------------------JEU
    .controller('GameCtrl', function ($scope,$ionicPlatform, $state,$timeout, CardsDataService) {
        $scope.$on('$ionicView.enter', function(e) {
//Initialisation des paramètres
            CardsDataService.getCards(function(data){
                $scope.cardsList = data;
                $scope.cardsListround2 = data;
            })
            CardsDataService.getTimer(function(data){
                $scope.counter = data.value;
            })
            $scope.indexToShow = 0;
            $scope.findsList =  [];
            $scope.scoreLeft = 0;
            $scope.scoreRight = 0;
            $scope.team = 1;
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
                if ($scope.cardsList.length < 1){
                    console.log('terminé');
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
                $timeout.cancel(mytimeout);
                CardsDataService.getTimer(function(data){
                    $scope.counter = data.value;
                })
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

        $scope.gotoEdit = function(idNote){
            $state.go('form', {id: idNote})
        }
    })

    // ----------------------------------------------------------------------------CONFIGURATION
    .controller('ConfigCtrl', function ($scope,$ionicPlatform, $state, CardsDataService, $ionicPopup) {
        $scope.$on('$ionicView.enter', function(e) {
            CardsDataService.getTimer(function(data){
                $scope.timerConfig = data.value;
            })
            CardsDataService.getNumberCards(function(data){
                $scope.cardConfig = data.value;
            })
        })

        $scope.changeTimer = function(val){

            $scope.data = { time: val}
            var myPopup = $ionicPopup.show({
                template: '<input type = "number" ng-model = "data.time">',
                title: 'Durée du minuteur',
                subTitle: 'en secondes',
                scope: $scope,

                buttons: [
                    { text: 'Annuler' }, {
                        text: '<b>Valider</b>',
                        type: 'button-positive',
                        onTap: function(e) {

                            if (!$scope.data.time) {
                                e.preventDefault();
                            } else {
                                return $scope.data.time;
                            }
                        }
                    }
                ]
            });

            myPopup.then(function(res) {
                CardsDataService.updateTimer(res)
            });
        };

        $scope.changeCard = function(val){

            $scope.data = { card: val}
            var myPopup = $ionicPopup.show({
                template: '<input type = "number" ng-model = "data.card">',
                title: 'Nombre de cartes',
                subTitle: 'pour chaque manche',
                scope: $scope,

                buttons: [
                    { text: 'Annuler' }, {
                        text: '<b>Valider</b>',
                        type: 'button-positive',
                        onTap: function(e) {

                            if (!$scope.data.card) {
                                e.preventDefault();
                            } else {
                                return $scope.data.card;
                            }
                        }
                    }
                ]
            });

            myPopup.then(function(res) {
                CardsDataService.updateNumberCards(res)
            });
        };

    })





    // ----------------------------------------------------------------------------LISTE DES CATEGORIES
    .controller('ListCtrl', function ($scope,$ionicPlatform, $state, CardsDataService) {
        $scope.$on('$ionicView.enter', function(e) {
            CardsDataService.getAll(function(data){
                $scope.itemsList = data
            })
            CardsDataService.getCats(function(data){
                $scope.catsList = data
            })
        })

        $scope.gotoEdit = function(idNote){
            $state.go('form', {id: idNote})
        }

        $scope.viewCat = function(idCat){
            $state.go('listcards', {id: idCat})
        }
    })


    // ---------------------------------------------------------------------------- EDITER CATEGORIES
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
                title: 'Supprimer une catégorie',
                template: 'êtes vous sûr de vouloir supprimer ?'
            })

            confirmPopup.then(function(res) {
                if(res) {
                    CardsDataService.deleteNote(idNote).then(onSaveSuccess)
                }
            })
        }
    })

    // ----------------------------------------------------------------------------LISTE DES CARTES
    .controller('CardCtrl', function ($scope, $stateParams,$ionicPlatform, $state, CardsDataService) {
        $scope.$on('$ionicView.enter', function(e) {
            CardsDataService.getCatCards($stateParams.id,function(cards){
                $scope.itemsList = cards
            })
        })

        $scope.gotoEdit = function(idNote){
            $state.go('form', {id: idNote})
        }

        $scope.viewCat = function(idCat){
            $state.go('listcards', {id: idCat})
        }
    })

    // ----------------------------------------------------------------------------EDITER CARTES
    .controller('ListCardsCtrl', function ($scope, $stateParams, $ionicPopup, $state, CardsDataService) {
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
                title: 'Supprimer une carte',
                template: 'êtes vous sûr de vouloir supprimer ?'
            })

            confirmPopup.then(function(res) {
                if(res) {
                    CardsDataService.deleteNote(idNote).then(onSaveSuccess)
                }
            })
        }
    })