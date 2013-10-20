
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var signin = require('./routes/signin');
var index = require('./routes/index');
var contact = require('./routes/contact');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('./public/images'));
app.use(express.static('./public/javascripts'));
app.use(express.static('./public/stylesheets'));
app.use(express.static('./public/fonts'));
app.use(express.static('./public/html'));
app.use(express.static('./public/PIE'));
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/contact', contact.contactFunction); 
app.get('/signin', signin.signinfunction);
app.get('/', index.indexfunction);

app.post('/signin', function(req, res){
	var body = '';
	req.on('data', function (data) {
    	body += data;
         // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
        if (body.length > 1e6) { 
        	// FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
            req.connection.destroy();
	    }
    });
	var email = req.param('email');
	var password = req.param('password');	
	console.log('Email:' + email);
	console.log('Password:' + password);
}
);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
