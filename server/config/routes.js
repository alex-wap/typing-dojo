//Require the controller
var Person = require('../controllers/scores.js');

//////////////////////////////////////////////////////////
//                        Routes                        //
//////////////////////////////////////////////////////////
module.exports = function(app) {
    app.get('/scores', function(req, res) {
        Person.index(req, res);
    })
    app.post('/scores', function(req, res) {
        Person.create(req, res);
    })
}
