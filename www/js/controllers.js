angular.module('starter.controllers', [])

// ----------------------------------------------------------------------------JEU
    .controller('GameCtrl', function ($scope,$ionicPlatform, $state,$timeout,$ionicPopup, CardsDataService,$cordovaNativeAudio) {
        if(window.cordova){
        $ionicPlatform.ready(function() {
// Audio
            $cordovaNativeAudio
                .preloadSimple('load', 'files/countdown.mp3')
                .then(function (msg) {
                    console.log(msg);
                }, function (error) {
                    console.log(error);
                });
            $cordovaNativeAudio.preloadComplex('load', 'files/countdown.mp3', 1, 1)
                .then(function (msg) {
                    console.log(msg);
                }, function (error) {
                    console.error(error);
                });
            $cordovaNativeAudio
                .preloadSimple('go', 'files/321.mp3')
                .then(function (msg) {
                    console.log(msg);
                }, function (error) {
                    console.log(error);
                });
            $cordovaNativeAudio.preloadComplex('go', 'files/321.mp3', 1, 1)
                .then(function (msg) {
                    console.log(msg);
                }, function (error) {
                    console.error(error);
                });

        });
        }
        $scope.$on('$ionicView.enter', function(e) {
                if(window.cordova) {
                    $cordovaNativeAudio.play('go');
                }else{
                    $scope.audio = new Audio('../files/321.mp3');
                    $scope.audio.play();
                }
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
            }, 2300);
//Initialisation des paramètres
            CardsDataService.getCardsnumber(function(data){
                $scope.cardsnumber = data;
            })
            CardsDataService.getCards(function(data){
                $scope.cardsList = data;
                data.shuffle();
                $scope.cardsList.splice($scope.cardsnumber);
                $scope.cardsListround2 = JSON.parse(JSON.stringify($scope.cardsList));
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
            var party = 1;
            var round = 0;
            var mytimeout = null;
            change('error');
// Scores
            $scope.valide = function(){
                $scope.findsList.push($scope.cardsList[0]);
                $scope.cardsList.splice(0,1);
                console.log($scope.cardsList);
                console.log($scope.cardsListround2);
                if (round % 2 == 1) {
                    $scope.scoreRight++;
                }
                else {
                    $scope.scoreLeft++;
                }
                if ($scope.cardsList.length < 1){
                    $timeout.cancel(mytimeout);
                    change('error');
                    $scope.end = 'show';
                    $scope.hideready = 'show';
                    $scope.cardsList= $scope.cardsListround2;
                    $scope.cardsList.shuffle();
                    if ( party == 1 ){
                        $scope.endmsg = 'Fin de la 1ère manche';
                        party++;
                        round++;
                        $scope.team =  (round % 2) + 1;
                    }
                    else{
                        $scope.endmsg = 'Fin de la partie';
                        $scope.theend = 'show';
                    }
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
                $timeout(function () {
                if(window.cordova) {
                    $cordovaNativeAudio.play('go');
                }else{
                $scope.audio = new Audio('../files/321.mp3');
                $scope.audio.play();
                }
                }, 300);
                if ( party == 2 ){
                    $scope.end = 'hide';
                }
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
                }, 2300);
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
// Chrono
            $scope.onTimeout = function() {
                if(window.cordova){
                if($scope.counter ===  8) {
                    $cordovaNativeAudio.play('load');
                }
                } else {
                    if($scope.counter ===  7) {
                        $scope.audio = new Audio('../files/countdown.mp3');
                        $scope.audio.play();
                    }
                }
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
// Pause
            $scope.waitTimer = function(){
                $timeout.cancel(mytimeout);
                var myPopup = $ionicPopup.show({
                    title: 'Jeu en Pause',

                    buttons: [
                        {
                            text: '<b>Reprendre la Partie</b>',
                            type: 'button-positive',
                            onTap: function(e) {
                                startTimer();
                            }
                        }
                    ]
                });
            };
// Demarrer chrono
            function startTimer() {
                mytimeout = $timeout($scope.onTimeout, 1000);
            };
// Rejouer
            $scope.replay = function() {
                $state.go('parametres');
                location.reload();
            };
 // Retour menu
            $scope.gotomenu = function() {
                $state.go('accueil');
                location.reload();
            };
 // Quitter
            $scope.exit = function() {
                ionic.Platform.exitApp();
            };
        })
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
    .controller('ListCtrl', function ($scope,$ionicPlatform, $state, CardsDataService,$ionicPopup) {
        $scope.$on('$ionicView.enter', function(e) {
            CardsDataService.getAll(function(data){
                $scope.itemsList = data
            })
            CardsDataService.getCats(function(data){
                $scope.catsList = data
            })
            $scope.addForm = {}
        })

        $scope.addCategory = function(){
            var myPopup = $ionicPopup.show({
                template: '<input type = "text" ng-model = "addForm.cat">',
                title: 'Nom de la catégorie',
                scope: $scope,

                buttons: [
                    {
                        text: '<b>Annuler</b>',
                        type: 'button-assertive',
                        onTap: function(e) {
                            myPopup.close();
                        }
                    },
                    {
                        text: '<b>Valider</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            CardsDataService.addCat($scope.addForm);
                            myPopup.close();
                            CardsDataService.getCats(function(data){
                                $scope.catsList = data
                            })
                        }
                    }
                ]
            });
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



    // ---------------------------------------------------------------------------- ACCUEIL
    .controller('Home', function ($scope, $ionicPopup) {
$scope.about = function(){
var myPopup = $ionicPopup.show({
        title: 'Version 2016.12.14',
    template:'<div>Auteur: PERRIN Olivier</div>' +
    '<div>Support: perrinolivier88@gmail.com</div>',
    buttons: [
            {
                text: '<b>Ok</b>',
                type: 'button-positive',
                onTap: function(e) {
                    myPopup.close();
                }
            }
        ]
    });
};
})



// Mélanger les cartes
Array.prototype.shuffle = function() {
    var input = this;
    for (var i = input.length-1; i >=0; i--) {
        var randomIndex = Math.floor(Math.random()*(i+1));
        var itemAtIndex = input[randomIndex];
        input[randomIndex] = input[i];
        input[i] = itemAtIndex;
    }
    return input;
}