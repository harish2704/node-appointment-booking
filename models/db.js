var mongoose = require('mongoose');


exports.connect = function() {
    mongoose.connect( 'mongodb://localhost/scheduler' );
}
