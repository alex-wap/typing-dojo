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
    $scope.scores = [{name:'Alex',speed:100,time:10},{name:'Elliot',speed:10,time:20},{name:'Phil',speed:600,time:5}]
    $scope.editMode = false;
    $scope.isDisabled = false;
    $scope.text = "Welcome to CodingDojo! We're excited to have you join our bootcamp!"
    $scope.words = $scope.text.split(" ");
    var editAttr = {};
    
    $scope.startTimer = function () {
        $scope.isDisabled = true;
        $scope.time = 10.0;
        $scope.index = 0;
        var countdown = function() {

            //////////////////////////////////////////////////// stop timer if user finishes paragraph

            if ($scope.type == $scope.words[$scope.index]){
                console.log('word number '+$scope.index+' is correct')
                console.log('next word is '+$scope.words[$scope.index+1])
                $scope.index++;
                $scope.type = '';
            }

            if ($scope.time <= 0){
                // $timeout.cancel(timer);
                $scope.time = 'Time is up!'
                $scope.isDisabled = false;
                return;
            };
            $scope.time -= 0.1;
            $scope.time = Math.round($scope.time*10)/10;
            console.log('time is '+$scope.time)
            $timeout(countdown, 100);
        }
        var timer = $timeout(countdown, 100);
    }

    $scope.reset = function () {
        $scope.isDisabled = false;
        $scope.time = 10;
        $scope.index = 0;
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
