console.log('Person Model Loaded');
var mongoose = require('mongoose');

var PersonSchema = mongoose.Schema({
    name: {type: String, required: true, minlength: 4},
    age: {type: Number, required: true}
}, {timestamps: true});

mongoose.model('Person', PersonSchema);
