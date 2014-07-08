var Teacher = require('../models/Teacher.js');

exports.index = function( req, res ){
    res.render( 'teachers/index' );
};

exports.search = function( req, res ){
    Teacher.findAvailable( req.body , function(err, docs ){
        console.log( arguments );
        res.respond( null, { teachers: docs } );
    });
};
