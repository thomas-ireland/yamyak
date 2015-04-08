// server/controllers/user-routes.js

var User           = require('../models/user-model');
var passport       = require('passport');
var passportLocal  = require('passport-local');
var bcrypt 		   = require('bcrypt');

var createHash = function(password){
 return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

module.exports = function(app) {
	
	app.post('/api/user/login', function(request, response, next) {

	  	passport.authenticate('local', function(error, user, info) {
	    	if (error)
	    		return next(error) 
	   	 	if (!user) 
	      		return response.send(info.message);

	    	request.logIn(user, function(error) {
	    		
	     		 if (error)
	      			return next(error); 
	      		 else
	      			return response.send("success");
	   			 });
  		})(request, response, next);
	});

	app.get('/api/loggedin', function(request, response) {

		var user = request.isAuthenticated() ? request.user : false;
			if(!user) {
				return response.send(false);
			} else {
				User.find({'username':user.username}, function(error, user) {
				 	if(error)
				 		return response.send(error);
				 	 else
				 		return response.json(user);
				});
			};
	});

	app.post('/api/user/join', function (request, response){

		User.find({'username': request.body.username}, function(error, user) {
			if(user.length > 0){
				return response.send("taken");
			} else {
				var user = new User({
				username: request.body.username,
				email: request.body.email,
				password: createHash(request.body.password),
				photo: "img/profile" + (Math.floor(Math.random() * 5) + 1) + ".png"
			});
				user.save(function (error, result) {
					if(error)
						response.send(error);
				 	else 
				    	response.send("success");
				});
			};
		});
	});

	app.post('/api/user/sign-out', function(request, response){

	    request.logOut();
	  	response.status(200).end();
	});
};