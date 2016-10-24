////////////////////////////////////////////////////////////
//                        Angular                         //
////////////////////////////////////////////////////////////
var app = angular.module('app', ['ngRoute']);

app.factory('PersonFactory', function($http) {
    var factory = {};
    // var people  = [{name: 'asdf', age: 123}, {name: 'fdsa', age: 321}];

    factory.index = function(callback) {
        $http.get('/people').then(function(response) {
            callback(response.data);
        })
    }
    factory.create = function(new_person, callback) {
        $http.post('/people', new_person).then(function(response) {
            // console.log('Create Method', response);
            callback(response.data);
        })
    }
    factory.delete = function(person, callback) {
        $http.delete('/people/'+person._id).then(function(response) {
            callback();
        });
    }
    factory.update = function(person, callback) {
        $http.post('/edit/people', person).then(function(response) {
            console.log('Factory update',person);
            callback();
        })
    }

    return factory;
})

app.controller('PersonController', function($scope, PersonFactory) {
    console.log('Person Controller loaded');
    $scope.editMode = false;
    var editAttr = {};

    PersonFactory.index(function(data) {
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
        PersonFactory.update(editAttr, function() {
            PersonFactory.index(function(data) {
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
        PersonFactory.create($scope.new_person, function(data) {
            if (data.errors) {
                console.log(data.errors);
                $scope.errors = data.errors;
            } else {
                PersonFactory.index(function(data) {
                    $scope.people = data;

                    $scope.new_person = {};
                });
            }
        })
    }
    $scope.deletePerson = function(data) {
        console.log('Deleting a person. :[');
        PersonFactory.delete(data, function() {
            PersonFactory.index(function(data) {
                $scope.people = data;
            });
        })
    }
})
