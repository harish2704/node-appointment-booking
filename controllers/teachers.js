var Teacher = require('../models/Teacher.js');

exports.showListPage = function( req, res ){
    res.render( 'teachers/list', { _title: 'Add data'} );
};
exports.showSeachPage = function( req, res ){
    res.render( 'teachers/search', { _title: 'Search availability of teachers'} );
};

exports.index = function( req, res ){
  var page = parseInt( req.query.page, 10 ) || 1;
  Teacher.find({}, {}, { limit: 20, skip: ( page -1 ) * 20 }, function(err, items ){
    if( err ) {
      console.log( err );
      return res.respond( null, {error: err.toString()}, false);
    }
    res.respond(null, { teachers: items });
  });
};

exports.search = function( req, res ){
    Teacher.findAvailable( req.body , function(err, docs ){
        res.respond( null, { teachers: docs } );
    });
};

exports.update = function( req, res ){
  var data = req.body;
  var id = req.params.id;
  delete data._id;
  Teacher.update({_id: id}, {$set: data }, function(err, data){
    if( err ) { console.log( err ); return res.respond( null, {error: err.toString()}, false); }
    res.respond(null, data );
  });
};

exports.create = function( req, res ){
    var data;
    if( !Array.isArray( req.body ) ){
        data = [ req.body ];
    } else {
        data = req.body;
    }
    console.log( data[0] );

    Teacher.create( data, function(err, docs ){
        if( err ) { return res.respond( null, {error: err.toString()}, false); }
        docs = [].slice.call( arguments, 1 );
        return res.respond( null, {teachers: docs } );
    });
};

exports.deleteByQuery = function( req, res ){
    Teacher.remove( req.body, function(err, count ){
        if( err ) {
            return res.respond( null, {error: err.toString()}, false);
        }
        return res.respond( null, { count: count} );
    });
};
