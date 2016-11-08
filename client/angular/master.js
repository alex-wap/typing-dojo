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
        controller: 'GameController'     
    })  
    .when('/play',{
        templateUrl: 'partials/play.html',
        controller: 'GameController'     
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
        $http.get('/scores').then(function(response) {
            callback(response.data);
        })
    }
    factory.create = function(score, callback) {
        $http.post('/scores', score).then(function(response) {
            // console.log('Create Method', response);
            callback(response.data);
        })
    }
    factory.getUser = function(){
        if (factory.user){
            return factory.user;
        }
    }
    factory.paragraphs = ["Right now there are three people in chat, but there's no way of knowing exactly who until you are in there, and the chat room she finds not so comforting.",
                        "Prior to joining our bootcamp, we want to get you up to speed with our learning platform as you will be spending a lot of time learning new concepts.",
                        "Never gonna give you up, never gonna let you down. Never gonna run around and desert you. Never gonna make you cry, never gonna say goodbye.",
                        "First appearing in 1991, Python is a general-purpose, high-level, interpreted programming language whose design focus emphasizes code readability.",
                        "As you progress through the platform, you'll be seeing snippets of code that will help you complete the assignments.",
                        "There are three ways of attaching CSS to a document: inline, internal, and external. Inline and internal CSS are considered to be bad practices.",
                        "Why is jQuery useful? First, it saves you tons of lines of code. Look at the script file for jQuery when you get a chance.",
                        "The next step in becoming familiar with the terminal is being well acquainted with version control with Git.",
                        "With the introduction of Swift, there really is never a better time to get into iOS development. Here are some of the prerequisites for this course.",
                        "At this stage of the bootcamp, many people ask whether they are following best practices or not. This is an important question, and we want to address this to everyone.",
                        "For web developers, URLs, files, or code that are specifically designed to be used by other developers are called APIs."
                        ];
    return factory;
})
////////////////////////////////////////////////////////////
//                        Controllers                     //
////////////////////////////////////////////////////////////
app.controller('MainController', function($scope, $timeout, MainFactory) {
    $scope.username = prompt("please enter a username");
    console.log('Main Controller loaded');
    // $scope.scores = [{name:'Alex',speed:100,time:10},{name:'Elliot',speed:10,time:20},{name:'Phil',speed:600,time:5}]
    $scope.paragraphs = MainFactory.paragraphs;

    $scope.inputStyle = {'background-color':'none'}
    $scope.resetOn = false;
    $scope.isDisabled = false;
    $scope.resetDisabled = true;
    $scope.new_paragraph = Math.floor(Math.random()*$scope.paragraphs.length);
    $scope.text = $scope.paragraphs[$scope.new_paragraph];
    $scope.total_length = $scope.text.length;
    $scope.words = $scope.text.split(" ");
    $scope.finished = "";
    for (var i = 0; i < $scope.words.length-1; i++){
        $scope.words[i] = $scope.words[i]+" ";
    }
    $scope.totaltype = '';
    $scope.progress = 0;
    $scope.wpm = 0;

    $scope.index = 0;
    $scope.text_disable = true;
    // $scope.username = MainFactory.getUser();

////////////////////////////////////////////////////////////
//                   Start Game Timer                     //
////////////////////////////////////////////////////////////

    $scope.realTimer = function () {

        $scope.current = $scope.words[0];
        $scope.text = $scope.text.substring($scope.current.length);

        $scope.results = '';
        $scope.type = '';
        $scope.isDisabled = true;
        $scope.time = 45.00;
        $scope.getready = 4;

        var delay = function(){
            if ($scope.getready > 0){
                $scope.getready--;
                $timeout(delay,1000);
            }
            if ($scope.getready <= 0){
                $scope.text_disable = false;
                $scope.getready = 'GO!'
                $timeout(countdown,20);
            }
            return;
        };

        var timer = $timeout(delay,0);

        var addScore = function(){
            if (!$scope.scores){
                $scope.scores = [];
            };
            if ($scope.wpm > 0){
                var date = new Date();
                $scope.scores.push({speed:$scope.wpm,time:date});
            };

            MainFactory.create({name:$scope.username,speed:$scope.wpm,time:date}, function(data) {
            if (data.errors) {
                console.log(data.errors);
            } 
            // else {
            //     MainFactory.index(function(data) {
            //         $scope.people = data;

            //         $scope.new_person = {};
            //     });
            // }
            })
        }

        var reset1 = function () {
            console.log('inside reset1');
            $scope.resetOn = false;
            // console.log($scope.resetOn);
            $scope.isDisabled = false;
            $scope.resetDisabled = true;
            $scope.text = $scope.paragraphs[$scope.new_paragraph]
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
            if ($scope.time < 43){
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
                $scope.wpm = Math.round(($scope.totaltype.length/5)/(45-$scope.time)*60);
            }
            // give score if finished
            if ($scope.totaltype.length == $scope.total_length && $scope.totaltype[-1] == $scope.text[-1]){
                console.log($scope.total_length+" characters in "+(45-$scope.time)+" seconds. with "+$scope.time+" seconds left.")
                $scope.results = 'Nice typing! Your wpm is '+ Math.round(($scope.total_length/5)/(45-$scope.time)*60)+'!'
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
                $scope.wpm = Math.round($scope.totaltype.length/(15/4));
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
            $scope.time -= 0.02;
            $scope.time = Math.round($scope.time*1000)/1000;
            $timeout(countdown, 20);
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
            $scope.text = $scope.paragraphs[$scope.new_paragraph]
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

    $scope.new = function () {
        $scope.new_paragraph = Math.floor(Math.random()*$scope.paragraphs.length)
        $scope.text = $scope.paragraphs[$scope.new_paragraph];
        $scope.total_length = $scope.text.length;
        $scope.words = $scope.text.split(" ");
        $scope.finished = "";
        for (var i = 0; i < $scope.words.length-1; i++){
            $scope.words[i] = $scope.words[i]+" ";
        }
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
        $scope.resetOn = false;
        $scope.isDisabled = false;
    }



////////////////////////////////////////////////////////////
//                     End Game Code                      //
////////////////////////////////////////////////////////////


    MainFactory.index(function(data) {
        // console.log(data);
        $scope.people = data;
    });
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
})
////////////////////////////////////////////////////////////
//                   Game Controller                      //
////////////////////////////////////////////////////////////

app.controller('GameController', function($scope, $timeout, MainFactory) {
    console.log('Game Controller loaded');
    MainFactory.index(function(data) {
        // console.log(data);
        $scope.scores = data;
    });
    // $scope.username = prompt("please enter a username");
    $scope.paragraphs = MainFactory.paragraphs;

    $scope.inputStyle = {'background-color':'none'}
    $scope.resetOn = false;
    $scope.editMode = false;
    $scope.isDisabled = false;
    $scope.resetDisabled = true;
    $scope.new_paragraph = 0;
    $scope.text = $scope.paragraphs[$scope.new_paragraph];
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
        $scope.time = 45.00;
        $scope.getready = 15;

        var delay = function(){
            if ($scope.getready > 0){
                $scope.getready--;
                $timeout(delay,1000);
            }
            if ($scope.getready <= 0){
                $scope.text_disable = false;
                $scope.getready = 'GO!'
                $timeout(countdown,20);
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
            $scope.text = $scope.paragraphs[$scope.new_paragraph]
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
            if ($scope.time < 43){
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
                $scope.wpm = Math.round(($scope.totaltype.length/5)/(45-$scope.time)*60);
            }
            // give score if finished
            if ($scope.totaltype.length == $scope.total_length && $scope.totaltype[-1] == $scope.text[-1]){
                $scope.results = 'Nice typing! Your wpm is '+ Math.round(($scope.total_length/5)/(45-$scope.time)*60)+'!'
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
                $scope.wpm = Math.round($scope.totaltype.length/(15/4));
                $scope.time = 0
                if ($scope.wpm > 0){
                    $scope.getready = "";
                    $scope.results = 'Your wpm is '+$scope.wpm+'!'
                    addScore();
                };
                // console.log($scope.scores);
                $scope.text_disable = true;
                $scope.type = "";
                $scope.inputStyle = {'background-color':'none'};
                $scope.resetDisabled = false;
                $scope.resetOn = true;
                return;
            };
            $scope.time -= 0.02;
            $scope.time = Math.round($scope.time*100)/100;
            $timeout(countdown, 20);
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
            $scope.text = $scope.paragraphs[$scope.new_paragraph];
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

    $scope.new = function () {
        $scope.new_paragraph = Math.floor(Math.random()*$scope.paragraphs.length)
        $scope.text = $scope.paragraphs[$scope.new_paragraph];
        $scope.total_length = $scope.text.length;
        $scope.words = $scope.text.split(" ");
        $scope.finished = "";
        for (var i = 0; i < $scope.words.length-1; i++){
            $scope.words[i] = $scope.words[i]+" ";
        }
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
        $scope.resetOn = false;
        $scope.isDisabled = false;
    }



////////////////////////////////////////////////////////////
//                     End Game Code                      //
////////////////////////////////////////////////////////////


    MainFactory.index(function(data) {
        // console.log(data);
        $scope.people = data;
    });

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
    $scope.storeUser = function() {
        console.log($scope.username)
        MainFactory.user = $scope.username;
        console.log(MainFactory.username)
        $location.url('/');
    }
})




