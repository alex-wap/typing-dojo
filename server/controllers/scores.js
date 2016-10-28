console.log('Score Controller Loaded');
var mongoose = require('mongoose');

var Score = mongoose.model('Score');

module.exports = (function() {
    return {
        index: function(req, res) {
            console.log('Index Method of Score Controller');
            Score.find({}, function(err, data) {
                if (err) {
                    console.log(err);
                    res.json(err);
                } else {
                    res.json(data);
                }
            })
        },
        create: function(req, res) {
            console.log('Create method of Score Controller');
            console.log(req.body);            
            var score = new Score(req.body);

            score.save(function(err, data) {
                if (err) {
                    console.log(err);
                    res.json(err);
                } else {
                    res.json(data);
                }
            })
        }
    }
}())
