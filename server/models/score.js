console.log('Score Model Loaded');
var mongoose = require('mongoose');

var ScoreSchema = mongoose.Schema({
    name: {type: String},
    speed: {type: Number},
    time: {type: Date}
}, {timestamps: true});

mongoose.model('Score', ScoreSchema);
