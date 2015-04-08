// server/controllers/profile-routes.js

var Thread = require('../models/thread-model');
var Auth   = require('../configuration/auth');
var User           = require('../models/user-model');
var mongoose = require('mongoose');

module.exports = function(app, io) {
	
	app.get('/api/user/threads/:username', function(request, response) {

        var username = request.params.username;
        
        Thread.find( { 'author' : username }, null, 
                    { sort : { posted : -1 } }, function(error, threads) {

                        if(!error){

                            io.emit('threads:loading', 'Almost there...');
                            response.json(threads);
                        }else{

                             response.send(error);
                        }
                });
    });

    app.get('/api/user/:username', function(request, response) {

        var username = request.params.username;
        
        User.find( { 'username' : username }, function(error, threads) {
                        if(!error){

                            response.json(threads);
                        }else{
                            
                             response.send(error);
                        }
                });
        
    });
       
};

