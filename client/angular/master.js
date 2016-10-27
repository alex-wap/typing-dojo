////////////////////////////////////////////////////////////
//                        Angular                         //
////////////////////////////////////////////////////////////
var app = angular.module('app', ['ngRoute']);

////////////////////////////////////////////////////////////
//                        Routes                          //
////////////////////////////////////////////////////////////
app.config(function ($routeProvider) {
    $routeProvider
    .when('/',{
        templateUrl: 'partials/index.html',
        controller: 'MainController'     
    })  
    .when('/play',{
        templateUrl: 'partials/play.html',
        controller: 'MainController'     
    })
    .when('/practice',{
        templateUrl: 'partials/practice.html',
        controller: 'MainController'     
    })  
    .when('/test',{
        templateUrl: 'partials/test.html',
        controller: 'MainController'     
    })
    .otherwise({
        redirectTo: '/'
    });
});
////////////////////////////////////////////////////////////
//                        Factories                       //
////////////////////////////////////////////////////////////
app.factory('MainFactory', function($http) {
    var factory = {};
    // var people  = [{name: 'asdf', age: 123}, {name: 'fdsa', age: 321}];

    factory.index = function(callback) {
        // $http.get('/people').then(function(response) {
        //     callback(response.data);
        // })
    }
    factory.create = function(new_person, callback) {
        // $http.post('/people', new_person).then(function(response) {
        //     // console.log('Create Method', response);
        //     callback(response.data);
        // })
    }
    factory.delete = function(person, callback) {
        // $http.delete('/people/'+person._id).then(function(response) {
        //     callback();
        // });
    }
    factory.update = function(person, callback) {
        // $http.post('/edit/people', person).then(function(response) {
        //     console.log('Factory update',person);
        //     callback();
        // })
    }

    return factory;
})
////////////////////////////////////////////////////////////
//                        Controllers                     //
////////////////////////////////////////////////////////////
app.controller('MainController', function($scope, $timeout, MainFactory) {
    console.log('Main Controller loaded');
    // $scope.scores = [{name:'Alex',speed:100,time:10},{name:'Elliot',speed:10,time:20},{name:'Phil',speed:600,time:5}]
    $scope.editMode = false;
    $scope.isDisabled = false;
    $scope.text = "Welcome to CodingDojo! We're excited to have you join our bootcamp!"
    $scope.total_length = $scope.text.length;
    $scope.words = $scope.text.split(" ");
    $scope.finished = "";
    var editAttr = {};
    for (var i = 0; i < $scope.words.length-1; i++){
        $scope.words[i] = $scope.words[i]+" ";
    }
    $scope.totaltype = '';
    $scope.progress = 0;
    $scope.wpm = 0;
    $scope.index = 0;

////////////////////////////////////////////////////////////
//                   Start Game Timer                     //
////////////////////////////////////////////////////////////

    $scope.startTimer = function () {
        $scope.results = ''
        document.getElementById('text-in').focus()
        $scope.isDisabled = true;
        $scope.time = 20.0;
        // $scope.index = 0;
        
        // var delay = function(){
        //     var count = 0;
        //     $timeout(delay,3000)
        //     count++;
        //     return;
        // }

        // var delay_timer = $timeout(delay,3000);

        var addScore = function(){
            if (!$scope.scores){
                $scope.scores = [];
            };
            var date = new Date();
                if ($scope.wpm > 0){
                    $scope.scores.push({speed:$scope.wpm,time:date});
                };
        }

        var countdown = function() {
            // if ($scope.type.length >= $scope.words[$scope.index]){
            if ($scope.type == $scope.words[$scope.index]){
                console.log('word number '+$scope.index+' is correct')
                console.log('next word is '+$scope.words[$scope.index+1])
                $scope.finished = $scope.finished+$scope.text.substring(0,$scope.type.length);
                $scope.text = $scope.text.substring($scope.type.length);
                $scope.index++;
                $scope.totaltype += $scope.type
                $scope.type = '';
                $scope.progress = Math.round(100*$scope.totaltype.length/$scope.total_length);
                console.log('progress is '+$scope.progress);
                $scope.wpm = Math.round(($scope.totaltype.length/5)/(20-$scope.time)*60);
            }
            if ($scope.totaltype.length == $scope.total_length && $scope.totaltype[-1] == $scope.text[-1]){
                $scope.results = 'Nice typing! Your wpm is '+ Math.round(($scope.total_length/5)/(20-$scope.time)*60)+'!'
                addScore()
                return;
            }
            if ($scope.time <= 0){
                // $timeout.cancel(timer);
                $scope.wpm = Math.round($scope.totaltype.length/(5/3));
                $scope.time = 0
                if ($scope.wpm > 0){
                    $scope.results = 'Your wpm is '+$scope.wpm+'!'//' Your cpm is '+Math.round($scope.totaltype.length/(1/3))+'.'
                };
                addScore();
                console.log($scope.scores);
                return;
            };
            $scope.time -= 0.06;
            $scope.time = Math.round($scope.time*10)/10;
            // console.log('time is '+$scope.time);
            $timeout(countdown, 60);
        }
        var timer = $timeout(countdown, 60);
    }
////////////////////////////////////////////////////////////
//                     End Game Timer                     //
////////////////////////////////////////////////////////////
    $scope.realTimer = function () {
        $scope.results = '';
        $scope.type = '';
        
        $scope.isDisabled = true;
        $scope.time = 20.0;
        
        // var delay = function(){
        //     $scope.getready = 'GO'
        //     $timeout(countdown, 60);
        //     return;
        // }
        $scope.getready = 4;
        var delay = function(){
            if ($scope.getready > 0){
                $scope.getready--;
                $timeout(delay,1000);;
            }
            if ($scope.getready <= 0){
                $scope.getready = 'GO!'
                document.getElementById('text-in').focus()
                $timeout(countdown,60);
            }
            return;
        };

        var timer = $timeout(delay,0);

        var addScore = function(){
            if (!$scope.scores){
                $scope.scores = [];
            };
            var date = new Date();
                if ($scope.wpm > 0){
                    $scope.scores.push({speed:$scope.wpm,time:date});
                };
        }

        var countdown = function() {
            // if ($scope.type.length >= $scope.words[$scope.index]){
            if ($scope.type == $scope.words[$scope.index]){
                console.log('word number '+$scope.index+' is correct')
                console.log('next word is '+$scope.words[$scope.index+1])
                $scope.finished = $scope.finished+$scope.text.substring(0,$scope.type.length);
                $scope.text = $scope.text.substring($scope.type.length);
                $scope.index++;
                $scope.totaltype += $scope.type
                $scope.type = '';
                $scope.progress = Math.round(100*$scope.totaltype.length/$scope.total_length);
                console.log('progress is '+$scope.progress);
                $scope.wpm = Math.round(($scope.totaltype.length/5)/(20-$scope.time)*60);
            }
            if ($scope.totaltype.length == $scope.total_length && $scope.totaltype[-1] == $scope.text[-1]){
                $scope.results = 'Nice typing! Your wpm is '+ Math.round(($scope.total_length/5)/(20-$scope.time)*60)+'!'
                addScore()
                return;
            }
            if ($scope.time <= 0){
                // $timeout.cancel(timer);
                $scope.wpm = Math.round($scope.totaltype.length/(5/3));
                $scope.time = 0
                if ($scope.wpm > 0){
                    $scope.results = 'Your wpm is '+$scope.wpm+'!'//' Your cpm is '+Math.round($scope.totaltype.length/(1/3))+'.'
                };
                addScore();
                console.log($scope.scores);
                return;
            };
            $scope.time -= 0.06;
            $scope.time = Math.round($scope.time*10)/10;
            // console.log('time is '+$scope.time);
            $timeout(countdown, 60);
        }
        // var timer = $timeout(countdown, 60);
    }


    // $scope.stop = function() {
    //     $scope.time = 0;
    //     $scope.totaltype = "";
    //     $scope.getready = "";
    // }

    $scope.reset = function () {
        $scope.isDisabled = false;
        $scope.text = "Welcome to CodingDojo! We're excited to have you join our bootcamp!"
        $scope.finished = "";
        $scope.time = 0;
        $scope.index = 0;
        $scope.results = '';
        $scope.totaltype = '';
        $scope.type = '';
        $scope.wpm = 0;
        $scope.progress = 0;
    }





    MainFactory.index(function(data) {
        console.log(data);
        $scope.people = data;
    });
    $scope.field = function(attribute) {
        if (!editAttr._id) {
            editAttr._id = $scope.edit_person._id;
        }
        editAttr[attribute] = $scope.edit_person[attribute];

        console.log(editAttr);
    }
    //Submits the edit form so that we can edit the person
    $scope.editingPerson = function() {
        console.log($scope.edit_person);
        MainFactory.update(editAttr, function() {
            MainFactory.index(function(data) {
                console.log(data);
                $scope.people = data;
            });
        })
    }
    //Shows the person that we are trying to edit
    $scope.showPerson = function(data) {
        editAttr = {};
        console.log(data);
        $scope.editMode = true;

        $scope.edit_person = data
    }
    $scope.createPerson = function() {
        $scope.errors = {};
        console.log('Creating a person: Angular Controller');
        MainFactory.create($scope.new_person, function(data) {
            if (data.errors) {
                console.log(data.errors);
                $scope.errors = data.errors;
            } else {
                MainFactory.index(function(data) {
                    $scope.people = data;

                    $scope.new_person = {};
                });
            }
        })
    }
    $scope.deletePerson = function(data) {
        console.log('Deleting a person. :[');
        MainFactory.delete(data, function() {
            MainFactory.index(function(data) {
                $scope.people = data;
            });
        })
    }
})
