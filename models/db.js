var mongoose = require('mongoose');
var config = require('../config.js');


exports.connect = function() {
    mongoose.connect( config.db );
}
