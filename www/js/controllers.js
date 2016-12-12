angular.module('starter.controllers', [])

// ----------------------------------------------------------------------------JEU
    .controller('GameCtrl', function ($scope,$ionicPlatform, $state,$timeout, CardsDataService) {
        $scope.$on('$ionicView.enter', function(e) {
//Compte a rebours
            $timeout(function () {
                $scope.showhide = 'show';
                $scope.hidecountdown = 'hide';
                change('start');
                $scope.findsList =  [];
                $timeout.cancel(mytimeout);
                CardsDataService.getTimer(function(data){
                    $scope.counter = data.value;
                })
                startTimer();
            }, 4000);
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
            $scope.turn = 1;
            var round = 0;
            var mytimeout = null;

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
                if ( $scope.team == 1 ){
                    $scope.turn++;
                }
                $scope.hideready = 'show';
                $timeout.cancel(mytimeout);
            };
// Joueurs prêts
            $scope.ready = function(){
                change('start');
                $scope.findsList =  [];
                $timeout.cancel(mytimeout);
                CardsDataService.getTimer(function(data){
                    $scope.counter = data.value;
                })
                $scope.hideready = 'hide';
                $scope.showhide = 'hide';
                $scope.hidecountdown = 'show';
                $timeout(function () {
                    $scope.showhide = 'show';
                    $scope.hidecountdown = 'hide';
                    startTimer();
                }, 4000);
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
                    if ( $scope.team == 1 ){
                        $scope.turn++;
                    }
                    $scope.hideready = 'show';
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
                   {
                        text: '<b>Valider</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                                $scope.timerConfig = $scope.data.time;
                                return $scope.data.time;
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
                    {
                        text: '<b>Valider</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            $scope.cardConfig = $scope.data.card;
                                return $scope.data.card;
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
            $state.go('cartes', {id: idCat.id, cat: idCat.name})
        }
    })


    // ---------------------------------------------------------------------------- CREER CARTES
    .controller('FormCtrl', function ($scope, $stateParams, $ionicPopup, $state, CardsDataService,$ionicHistory) {
        $scope.$on('$ionicView.enter', function(e) {
            $scope.addForm = {}
            CardsDataService.getCats(function(item){
                $scope.allCats = item;
                $scope.allCat = $scope.allCats[$stateParams.cid - 1];
            })
        })
        function onSaveSuccess(){
            $ionicHistory.backView().go();
        }
        $scope.addCard = function(allCat){
                CardsDataService.createCard($scope.addForm,allCat).then(onSaveSuccess)
        }
    })

    // ----------------------------------------------------------------------------LISTE DES CARTES
    .controller('CardCtrl', function ($scope, $stateParams,$ionicPlatform, $state, CardsDataService) {
        $scope.$on('$ionicView.enter', function(e) {
            CardsDataService.getCatCards($stateParams.id,function(cards){
                $scope.itemsList = cards
            })
        })
        $scope.title  = $stateParams.cat;
            $scope.gotoEditCard = function(obj){
            $state.go('edition', {cid:$stateParams.id,cat:$stateParams.cat,id: obj.id,title: obj.title})
        }

        $scope.viewCat = function(idCat){
            $state.go('listcards', {id: idCat})
        }

        $scope.addForm = function(){
            $state.go('creer', {cid:$stateParams.id,cat: $stateParams.cat})
        }
    })

    // ---------------------------------------------------------------------------- EDITER CARTES
    .controller('FormCardCtrl', function ($scope, $stateParams, $ionicPopup, $state,$ionicHistory, CardsDataService) {
        $scope.$on('$ionicView.enter', function(e) {
            initForm()
        })

        function initForm(){
            if($stateParams.id){
                CardsDataService.getCardById($stateParams.id, function(item){
                    $scope.cardForm = item;
                })
                CardsDataService.getCats(function(item){
                    $scope.allCats = item;
                    $scope.allCat = $scope.allCats[$stateParams.cid - 1];
                })

            } else {
                $scope.cardForm = {}
            }
        }
        function onSaveSuccess(){
            $ionicHistory.backView().go();
        }
        $scope.saveNote = function(cardId,allCat){

            if(!$scope.cardForm.id){
                CardsDataService.createCard($scope.cardForm).then(onSaveSuccess)
            } else {
                CardsDataService.updateCard($scope.cardForm,cardId,allCat).then(onSaveSuccess)
            }
        }

        $scope.confirmDelete = function(idCard) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Supprimer une carte',
                template: 'êtes vous sûr de vouloir supprimer ?'
            })

            confirmPopup.then(function(res) {
                if(res) {
                    CardsDataService.deleteCard(idCard).then(onSaveSuccess)
                }
            })
        }
    })