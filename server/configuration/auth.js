// server/configuration/auth.js

var passport       = require('passport');
var passportLocal  = require('passport-local');
var User = require('../models/user-model');
var bcrypt         = require('bcrypt');
passport.use(new passportLocal.Strategy(verifyCredentials));

function verifyCredentials(username, password, done){
	User.find({'username': username}, function(error, user) {
 	
        if (error) {
        	return done(error);
        }
        else if (!user[0]) {
            return done(null, false, { message: "Are you sure you entered your details correct?"});
        }
        
        else  if ( !bcrypt.compareSync(password, user[0].password) ) {
            return done(null, false, { message: "Are you sure you entered your details correct?" });
        }
        else {
        return done(null, {username: user[0].username});
		}
	});
};
 
passport.serializeUser(function(user, done){
	done(null, user.username);
});

passport.deserializeUser(function(username, done){
	done(null, {username:username});
});

function ensureAuthenticated( request, response, next ) {
	if(request.isAuthenticated()) {

	return	next();
	} else {
        
		response.send(403);
	}
};