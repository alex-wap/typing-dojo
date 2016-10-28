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
    $scope.inputStyle = {'background-color':'none'}
    $scope.resetOn = false;
    $scope.editMode = false;
    $scope.isDisabled = false;
    $scope.resetDisabled = true;
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
    $scope.text_disable = true;

////////////////////////////////////////////////////////////
//                   Start Game Timer                     //
////////////////////////////////////////////////////////////

    $scope.realTimer = function () {

        $scope.current = $scope.words[0];
        $scope.text = $scope.text.substring($scope.current.length);

        $scope.results = '';
        $scope.type = '';
        $scope.isDisabled = true;
        $scope.time = 20.0;
        $scope.getready = 4;

        var delay = function(){
            if ($scope.getready > 0){
                $scope.getready--;
                $timeout(delay,1000);
            }
            if ($scope.getready <= 0){
                $scope.text_disable = false;
                $scope.getready = 'GO!'
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

        var reset1 = function () {
            console.log('inside reset1');
            $scope.resetOn = false;
            // console.log($scope.resetOn);
            $scope.isDisabled = false;
            $scope.resetDisabled = true;
            $scope.text = "Welcome to CodingDojo! We're excited to have you join our bootcamp!"
            $scope.finished = "";
            $scope.time = "";
            $scope.index = 0;
            $scope.results = '';
            $scope.totaltype = '';
            $scope.type = '';
            $scope.wpm = 0;
            $scope.progress = 0;
            $scope.text_disable = true;
            $scope.current = "";
            $scope.getready = "";
        }

        var countdown = function() {
            document.getElementById('text-in').focus()

            // activate reset button after delay
            if ($scope.time < 19){
                $scope.resetDisabled = false;
            }
            // call reset
            if ($scope.resetOn == true){
                reset1();
                return;
            }
            // check for mistakes and change color of text box
            for (var i = 0; i<$scope.type.length;i++){
                if($scope.type[i] != $scope.current[i]){
                    $scope.inputStyle = {'background-color':'#f44336'};
                    break;
                }
                else{
                    $scope.inputStyle = {'background-color':'none'};
                }
            }
            if($scope.type.length == 0){$scope.inputStyle = {'background-color':'none'};}

            // check if word is finished
            if ($scope.type == $scope.current){
                $scope.finished = $scope.finished+$scope.current;
                $scope.index++;
                $scope.current = $scope.words[$scope.index];
                if ($scope.current){
                    $scope.text = $scope.text.substring($scope.current.length);
                }
                $scope.totaltype += $scope.type
                $scope.type = '';
                $scope.progress = Math.round(100*$scope.totaltype.length/$scope.total_length);
                $scope.wpm = Math.round(($scope.totaltype.length/5)/(20-$scope.time)*60);
            }
            // give score if finished
            if ($scope.totaltype.length == $scope.total_length && $scope.totaltype[-1] == $scope.text[-1]){
                $scope.results = 'Nice typing! Your wpm is '+ Math.round(($scope.total_length/5)/(20-$scope.time)*60)+'!'
                $scope.getready = "";
                addScore()
                $scope.text_disable = true;
                $scope.inputStyle = {'background-color':'none'};
                $scope.resetDisabled = false;
                $scope.resetOn = true;
                return;
            }
            // give score if time runs out
            if ($scope.time <= 0){
                $scope.wpm = Math.round($scope.totaltype.length/(5/3));
                $scope.time = 0
                if ($scope.wpm > 0){
                    $scope.getready = "";
                    $scope.results = 'Your wpm is '+$scope.wpm+'!'
                    addScore();
                };
                console.log($scope.scores);
                $scope.text_disable = true;
                $scope.type = "";
                $scope.inputStyle = {'background-color':'none'};
                $scope.resetDisabled = false;
                $scope.resetOn = true;
                return;
            };
            $scope.time -= 0.06;
            $scope.time = Math.round($scope.time*10)/10;
            $timeout(countdown, 60);
        }
    }

////////////////////////////////////////////////////////////
//                     End Game Timer                     //
////////////////////////////////////////////////////////////

    $scope.reset = function () {
        console.log('inside reset');
        if ($scope.resetOn == false){
            $scope.resetOn = true;
            $scope.inputStyle = {'background-color':'none'};
        }
        else{
            $scope.resetOn = false;
            $scope.isDisabled = false;
            $scope.text = "Welcome to CodingDojo! We're excited to have you join our bootcamp!"
            $scope.finished = "";
            $scope.time = "";
            $scope.index = 0;
            $scope.results = '';
            $scope.totaltype = '';
            $scope.type = '';
            $scope.wpm = 0;
            $scope.progress = 0;
            $scope.text_disable = true;
            $scope.current = "";
            $scope.getready = "";
            $scope.inputStyle = {'background-color':'none'};
        }  
    }


////////////////////////////////////////////////////////////
//                     End Game Code                      //
////////////////////////////////////////////////////////////


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
