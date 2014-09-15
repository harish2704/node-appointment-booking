var Teacher = require('../models/Teacher.js');

exports.index = function( req, res ){
    res.render( 'teachers/index' );
};

exports.search = function( req, res ){
    Teacher.findAvailable( req.body , function(err, docs ){
        res.respond( null, { teachers: docs } );
    });
};

exports.create = function( req, res ){
    var data;
    if( !Array.isArray( req.body ) ){
        data = [ req.body ];
    } else {
        data = req.body;
    }

    Teacher.create( data, function(err, docs ){
        if( err ) {
            return res.respond( null, {error: err.toString()}, false);
        }
        docs = [].slice.call( arguments, 1 );
        return res.respond( null, {teachers: docs } );
    });
}

exports.deleteByQuery = function( req, res ){
    Teacher.remove( req.body, function(err, count ){
        if( err ) {
            return res.respond( null, {error: err.toString()}, false);
        }
        return res.respond( null, { count: count} );
    });
}
