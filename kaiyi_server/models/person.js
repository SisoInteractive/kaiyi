var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name: String,
    phone: Number
});

module.exports = mongoose.model('Person', schema);