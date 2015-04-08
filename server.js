// server.js
var express        = require('express');
var app            = express();
var http           = require('http').Server(app);
var io             = require('socket.io')(http);
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var cookieParser   = require('cookie-parser');
var expressSession = require('express-session');
var passport       = require('passport');
var passportLocal  = require('passport-local');
var passportHttp   = require('passport-http');
var bcrypt         = require('bcrypt');


var port = process.env.PORT || 3002; 

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/client')); 

var db = require('./server/configuration/db');

mongoose.connect(db.url); 

app.use(bodyParser.json()); 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(methodOverride('X-HTTP-Method-Override')); 
app.use(express.static(__dirname + '/client')); 

app.use(cookieParser());
app.use(expressSession({
secret:process.env.SESSION_SECRET ||'secret',
saveUnintialized:false,
resave:false
}));

app.use(passport.initialize());
app.use(passport.session());

require('./server/configuration/auth.js');
require('./server/controllers/profile-routes')(app, io);
require('./server/controllers/topics-routes')(app);
require('./server/controllers/threads-routes')(app, io);
require('./server/controllers/auth-routes')(app);
require('./server/sockets/io')(io);
app.get('*', function(request, response) {
			 response.render('index');
});


http.listen(port);								
console.log('Listening on port: ' + port); 			
exports = module.exports = app; 
