var uu, uu1,uu2,uu3,uu4; function save( ){ uu = arguments; uu1 = arguments[0]; uu2 = arguments[1]; uu3 = arguments[2]; uu4 = arguments[3]; console.log( 'Got ' + arguments.length ); }
function print( ){ [].slice.call( arguments ).forEach(function(data){ console.log( JSON.stringify( data, null, '\t' )); }); }
var async = require('async');
var Teacher = require('./models/Teacher.js');
var teachersData = require('./test/teachers-data.js');

require('./models/db').connect();
var appointmentTime = { start: '2014-4-7 9:00', end: '2014-4-7 10:00' };
Teacher.findOne( function(err, doc ){
    t = doc;
    slots = t.availability;
    startPoints = slots.map( function(v){ return v.start; });
});


