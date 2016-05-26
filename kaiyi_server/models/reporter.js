var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    message: String,
    name: String,
    phone: Number
});

module.exports = mongoose.model('Reporter', schema);