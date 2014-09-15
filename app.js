
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , config = require('./config.js')
  , path = require('path');

var app = express();
require('express-respond')(app);
var ECT = require( 'ect' );
var ectRenderer = ECT({ watch: true, root: __dirname + '/views', ext: '.html' });

require('./models/db.js').connect();

app.engine('html', ectRenderer.render);

app.configure(function(){
  app.set('port',  config.port );
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

routes( app );

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
