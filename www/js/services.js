angular.module('starter.services', ['ngCordova'])
    .factory('CardsDataService', function ($cordovaSQLite, $ionicPlatform) {
        var db, dbName = "game.db"

        function useWebSql() {
            db = window.openDatabase(dbName, "1.0", "Game database", 200000)
            console.info('Using webSql')
        }

        function useSqlLite() {
            window.plugins.sqlDB.copy(dbName,2, function (e) {
                console.log(e);
            });
            db = $cordovaSQLite.openDB({name: dbName, location : 1})
            console.info('Using SQLITE')
        }

        function initDatabase(){
            $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS cards (id integer primary key, title, category_id integer)')
            $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS categories (id integer primary key, name)')
            $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS config (id integer primary key,name, value integer)')
            $cordovaSQLite.execute(db, 'INSERT INTO categories VALUES (1,"jeux video")')
            $cordovaSQLite.execute(db, 'INSERT INTO categories VALUES (2,"personnages")')
            $cordovaSQLite.execute(db, 'INSERT INTO config VALUES (1,"timer",45)')
            $cordovaSQLite.execute(db, 'INSERT INTO config VALUES (2,"card",40)')
            $cordovaSQLite.execute(db, 'INSERT INTO cards VALUES (1,"mario",1)')
            $cordovaSQLite.execute(db, 'INSERT INTO cards VALUES (2,"superman",1)')
            $cordovaSQLite.execute(db, 'INSERT INTO cards VALUES (3,"hulk",2)')
            $cordovaSQLite.execute(db, 'INSERT INTO cards VALUES (4,"maison",2)')
            $cordovaSQLite.execute(db, 'INSERT INTO cards VALUES (5,"eglise",1)')
            $cordovaSQLite.execute(db, 'INSERT INTO cards VALUES (6,"piano",1)')
        }

        $ionicPlatform.ready(function () {
            if(window.cordova){
                useSqlLite()
            } else {
                useWebSql();
                initDatabase();
            }

        })

        function onErrorQuery(err){
            console.error(err)
        }

        return {
            getTimer: function(callback){
                $ionicPlatform.ready(function () {
                    $cordovaSQLite.execute(db, 'SELECT value FROM config where name ="timer"').then(function (results) {
                        callback(results.rows.item(0));
                    })
                })
            },
            updateTimer: function(res){
                return $cordovaSQLite.execute(db, 'UPDATE config set value = ? where name ="timer"', [res])
            },
            getNumberCards: function(callback){
                $ionicPlatform.ready(function () {
                    $cordovaSQLite.execute(db, 'SELECT value FROM config where name ="card"').then(function (results) {
                        callback(results.rows.item(0))
                    })
                })
            },
            updateNumberCards: function(res){
                return $cordovaSQLite.execute(db, 'UPDATE config set value = ? where name ="card"', [res])
            },
            getCards: function(callback){
                $ionicPlatform.ready(function () {
                    $cordovaSQLite.execute(db, 'SELECT value FROM config where name ="card"').then(function (results) {
                        var res = results.rows[0];
                        var number = res.value;
                        $cordovaSQLite.execute(db, 'SELECT * FROM cards  LIMIT ?', [number]).then(function (results) {
                            var data = []

                            for (i = 0, max = results.rows.length; i < max; i++) {
                                data.push(results.rows.item(i))
                            }

                            callback(data)
                        }, onErrorQuery)
                    })
                })
            },
            getAll: function(callback){
                $ionicPlatform.ready(function () {
                    $cordovaSQLite.execute(db, 'SELECT value FROM config where name ="card"').then(function (results) {
                        var res = results.rows[0];
                        var number = res.value;
                        $cordovaSQLite.execute(db, 'SELECT * FROM cards  LIMIT ?', [number]).then(function (results) {
                            var data = []

                            for (i = 0, max = results.rows.length; i < max; i++) {
                                data.push(results.rows.item(i))
                            }

                            callback(data)
                        }, onErrorQuery)
                    })
                })
            },
            getCats: function(callback){
                $ionicPlatform.ready(function () {
                        $cordovaSQLite.execute(db, 'SELECT * FROM categories ').then(function (results) {
                            var data = []

                            for (i = 0, max = results.rows.length; i < max; i++) {
                                data.push(results.rows.item(i))
                            }

                            callback(data)
                        }, onErrorQuery)
                })
            },

            getCatCards: function(id,callback){
                var catconvert = parseInt(id);
                $ionicPlatform.ready(function () {
                    $cordovaSQLite.execute(db,'SELECT * FROM cards where category_id = ?', [catconvert]).then(function (results) {
                        var cards = []

                        for (i = 0, max = results.rows.length; i < max; i++) {
                            cards.push(results.rows.item(i))
                        }

                        callback(cards)
                    }, onErrorQuery)
                })
            },


            deleteCard: function(id){
                return $cordovaSQLite.execute(db, 'DELETE FROM cards where id = ?', [id])
            },

            getCardById: function(id, callback){
                $ionicPlatform.ready(function () {
                    $cordovaSQLite.execute(db, 'SELECT * FROM cards  where id = ? ', [id]).then(function (results) {
                        callback(results.rows.item(0))
                    })
                })
            },
            updateCard: function(card,cardId,cat){
                return $cordovaSQLite.execute(db, 'UPDATE cards set title = ?, category_id = ? where id = ?', [card.title, cat, cardId])
            },
            createCard: function (card,cat) {
                return $cordovaSQLite.execute(db, 'INSERT INTO cards (title, category_id) VALUES(?, ?)', [card.title, cat])
            },

        }
    })


    