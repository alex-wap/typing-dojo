//Require the controller
var Person = require('../controllers/person.js');

//////////////////////////////////////////////////////////
//                        Routes                        //
//////////////////////////////////////////////////////////
module.exports = function(app) {
    app.get('/people', function(req, res) {
        Person.index(req, res);
    })
    app.post('/people', function(req, res) {
        Person.create(req, res);
    })
    app.delete('/people/:id', function(req, res) {
        Person.delete(req, res);
    })
    app.post('/edit/people', function(req, res) {
        Person.update(req, res);
    })
}
