// server/controllers/threads-routes.js

var Thread = require('../models/thread-model');
var Auth   = require('../configuration/auth');
var User   = require('../models/user-model');
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;


module.exports = function(app, io) {

    //get threads
    app.get('/api/threads', function(request, response) {
        
        io.emit('threads:loading', 'Loading...');
        
            Thread.find(null, null, { sort : { posted : -1 } }, function(error, threads) {
                if(!error){

                    io.emit('threads:loading', 'Almost there...');
                    response.json(threads); 
                } else {

                    response.send(error);
                }
            });
    });

    //get topic threads
	app.get('/api/threads/:topic', function(request, response) {
        
        io.emit('threads:loading', 'Loading...');
        var topic = request.params.topic;

            Thread.find( { 'topic' : topic }, null, { sort : { posted : -1 } }, function(error, threads) {
                if(!error){

                    io.emit('threads:loading', 'Almost there...');
                    response.json(threads); 
                } else {

                    response.send(error);
                }
            });
    });

    //create thread
	app.post('/api/thread', function (request, response){

		var thread = new Thread(request.body);

		thread.save(function (error, newThread) {

			if(!error){

                response.json(newThread);
                io.emit('thread:add', newThread);
            } else {

                response.send(error);
            } 
		});
	});
			
    //create comment
    app.put('/api/comment', function (request, response){

        var threadId = request.body.threadId;
        var user = request.body.author;
        var photo = request.body.authorPhoto;
        var content = request.body.content;

        Thread.findByIdAndUpdate(

             { _id : threadId },
             { '$push' : { 'comments': { 'author' : user, 'authorPhoto' : photo, 'content' : content } } }, 
             { 'new' : true }, 
             function(error, updatedThread){

                if(!error){

                    response.json(updatedThread);
                    io.emit('comment:add', updatedThread);
                } else {

                    response.send(error);
                }      
        });
    });

    //like thread
	app.put('/api/thread/like', function (request, response){

		var threadId = request.body.threadId;
        var user = request.body.author;
        var topic = request.body.topic;

		Thread.findByIdAndUpdate( 

            { '_id' : threadId },
			{ '$push': { 'likes' : { 'author' : user } } }, 
            { 'new' : true },
            function (error, results) {

				if(!error){

                    response.send(results);
                } else {

                    response.send(error);
                }   
		});

	});

    //like comment
	app.put('/api/comment/like', function (request, response){

		var commentId = request.body.commentId;
		var threadId = request.body.threadId;
        var user = request.body.author;

		Thread.update(

            { '_id' : threadId, 'comments._id' : commentId },
			{ '$push' : { 'comments.$.likes' : { 'author' : user } } }, 
            function (error, result) {

            if(!error){

                response.json(result);
            } else {

                response.send(error);
            }   
		});
	});

    app.delete('/api/thread/delete/:threadId', function (request, response) {

        var threadId = request.params.threadId;
    
        Thread.findByIdAndRemove(threadId, function(error, result) {

            if (!error) {

               response.json(result);
            }
            else {

                response.send(error);
            }
        });

    });

    app.delete('/api/comment/delete/:threadId/:commentId', function (request, response) {
        
        var threadId = request.params.threadId;
        var commentId = request.params.commentId;

        Thread.findByIdAndUpdate(

        { _id : threadId },
        { $pull : { 'comments': { _id : commentId } } }, 
        function(error, result){

            if(!error){
                response.json(result);
                
            } else {

                response.send(error);
            }      
        });
    });
};
