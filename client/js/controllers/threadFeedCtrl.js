//client/controllers/threadListCtrl.js

/**
 *
 * Controller for threadFeed
 *
 * Recieves 'threads', 'topics' and 'users' data injected via Ui-Router resolves that are then bound to the model
 * The model ($scope) is automatically exposed to the template for rendering of the view from these bindings
 *
 * Handles events for displaying / hiding thread and comment input areas
 * Handles user events for adding, liking and deleting threads and comments
 * Listens for socket events of incoming threads, comments and likes that need to be added to the model
 *
 */

'use strict';

var threadFeedCtrl = angular.module('ThreadFeedCtrl', []);

threadFeedCtrl.controller('ThreadFeedController', 
    [           '$scope',  '$rootScope', '$stateParams', 'ThreadApi', '$log', 'Socket', 'threads', 'topics', 'user',
        function($scope,    $rootScope,   $stateParams,   ThreadApi,   $log,   Socket,   threads,   topics,   user) {

              /************************************************/
             /******* CREATE MODEL BINDINGS ON LOAD **********/
            /************************************************/
            
            // Update the model with threads data to comprise the main content of the threadFeed
            if(threads.success){

                $scope.threads = threads.data;
                $scope.loadingStatus = '';
            } else {

                $log.error('Error getting threads', threads.error);
            }

            // Update the model with topics data for the select in the thread input area 
            $scope.topics = topics.data;

            // Update the model if the current state is a topic to pre-select the select in the thread input
            if(threads.type === 'topic') $scope.selectedTopic = $stateParams.topic;

            // Update the model with user data so the template can determine if the user has authored a thread (via a filter)
            $rootScope.username = user.username;

            // if menuSelected is true the user is on a mobile screen so close the nav once the threads have rendered 
            if($rootScope.menuSelected) $rootScope.menuSelected = ! $rootScope.menuSelected;

            // toggles the buttons below input areas
            if(user.signedIn) $scope.inputOnline = true;
            else $scope.inputOffline = true;

              /*************************************************************/
             /******* SHOW & HIDE THREAD AND COMMENT INPUT AREAS **********/
            /*************************************************************/

            // Update the model with a placeholder string so that it can be toggled
            var startThread = 'Start a new thread...',
                titleThread = 'Title';  
            $scope.placeholder = startThread;

            var toggleInput = function(inputArea){

                $scope['showInput' + inputArea] = !$scope['showInput' + inputArea];
                $scope['showPreview' + inputArea] = !$scope['showPreview' + inputArea];
            }

            $scope.hideInputThread = function(){

                toggleInput('Thread');

                $scope.threadTitle = $scope.threadContent = '';
                $scope.placeholder = startThread; 
                $scope.selectedTopic = 'Pick topic';
                $scope.threadTitleError = $scope.threadContentError = $scope.selectError = false;
                $scope.threadForm.$setUntouched();
            }
              
            $scope.hideInputComment = function(){

                toggleInput('Comment');

                $scope.commentData.commentContent = '';
                $scope.commentClicked = !$scope.commentClicked;
                $scope.commentContentError = false;
            }

            $scope.displayInput = function(inputArea) {
                
                // ignore if input area is already open 
                if($scope['showInput' + inputArea]) return;

                if(inputArea === 'Thread') $scope.placeholder = titleThread;
                if(inputArea === 'Comment') $scope.commentClicked = !$scope.commentClicked;
                
                toggleInput(inputArea);
                
                $scope['previewUser' + inputArea] = (user.signedIn) ? user.username : "@user";
                $scope['previewPic' + inputArea] = (user.signedIn) ? user.userImage : "img/profile1.png";
                
            }


              /*****************************************/
             /******* USER EVENT: ADD THREAD **********/
            /*****************************************/

            $scope.addThread = function (){
           
                if(!user.signedIn) return;

                if(!$scope.selectedTopic || $scope.selectedTopic === 'Pick topic')
                    $scope.selectError = true;

                if(!$scope.threadTitle || !$scope.threadContent || !$scope.selectedTopic || $scope.selectedTopic === 'Pick topic') return;

                $scope.newThread = {
                    title: $scope.threadTitle,
                    content: $scope.threadContent,
                    topic: $scope.selectedTopic,
                    author: user.username,
                    authorPhoto: user.userImage
                };
                
                ThreadApi.addThread($scope.newThread).then(

                    // The thread is simply added and checked for error because the new thread
                    // will be picked up by the socket listener and added to the model.
                    // It is not added directly because we need the id from the database before
                    // a user can interact with it.
                    function(){},
                    function(e){

                        $log.error('Error adding thread', e);
                    }
                );

                $scope.hideInputThread();
            };

    
              /******************************************/
             /******* USER EVENT: ADD COMMENT **********/
            /******************************************/

            // Update the model comment with an empty object literal so that the input from the user 
            // binds correctly (prototypal inheritance quirk in javascript)
            $scope.commentData = {};

            $scope.addComment = function (thread) {

                if(!user.signedIn) return;
                
                if(!$scope.commentData.commentContent) return;

                var newComment = {
                    threadId: thread._id,
                    content: $scope.commentData.commentContent,
                    author: user.username,
                    authorPhoto: user.userImage,
                };

                ThreadApi.addComment(newComment).then(

                    // The comment is simply added and checked for error because the new comment
                    // will be picked up by the socket listener and added to the model.
                    // It is not added directly because we need the id from the database before
                    // a user can interact with it.
                    function(){},
                    function(e){

                        $log.error('Error adding comment', e);
                    }
                );

                $scope.hideInputComment();
            };


              /********************************************/
             /******* USER EVENT: REMOVE THREAD **********/
            /********************************************/
        
            $scope.removeThread = function(thread, threadIndex){
            
                ThreadApi.deleteThread(thread._id).then(

                    function(result){
                        
                        // Only the client deleting the thread will see it removed in real time.
                        // This is because a user could be interacting with the thread and for it
                        // to just disappear would be a confusing user experience.
                        $scope.threads.splice(threadIndex, 1);
                    },
                    function(e){

                        $log.error('Error deleting thread', e);
                    })
            }


              /*********************************************/
             /******* USER EVENT: REMOVE COMMENT **********/
            /*********************************************/

            $scope.removeComment = function(thread, comment, commentIndex){

                ThreadApi.deleteComment(thread._id, comment._id).then(

                    function(result){

                        // Only the client deleting the comment will see it removed in real time.
                        // This is because a user could be interacting with the comment and for it
                        // to just disappear would be a confusing user experience.
                        thread.comments.splice(commentIndex, 1);
                    },
                    function(){

                        $log.error('Error deleting comment', e);
                    });
            };


              /****************************************************/
             /******* USER EVENT: LIKE THREAD / COMMENT **********/
            /****************************************************/

            // This loops over a given post's array of likes to check that the current user
            // has not already like the post. Returns a Boolean.
            var liked = function(likes){

                for(var x = 0 ; x < likes.length ; x++){
                   
                    if(likes[x].author === user.username) return true;
                }
                return false;
            }


            $scope.likeThread = function (thread){
               
                if(!user.signedIn) return;
                if(liked(thread.likes)) return;
            
                var threadLike = {
                    threadId: thread._id,
                    author: user.username,
                    topic: thread.topic
                };

                // The variable 'thread' refers to the actual thread that the user is liking
                // and because we don't need the id from the database for anything in the like, 
                // we can go ahead and push it into the current thread.
                thread.likes.push(threadLike);
                
                // Because we don't need the id from the database, we can send the like directly 
                // to the server to be broadcast to everyone else.  
                Socket.emit('thread:like', threadLike);

                ThreadApi.likeThread(threadLike).then(

                    // no action needed if response is ok
                    function(){},
                    function(e){

                        $log.error('Error adding like to thread', e);
                    }
                );
            };
            
            $scope.likeComment = function (thread, comment){

                if(!user.signedIn) return;

                if(liked(comment.likes)) return;
               
                var commentLike = {
                    threadId: thread._id,
                    commentId: comment._id,
                    author: user.username,
                    topic: thread.topic
                };
                
                // The variable 'comment' refers to the actual comment that the user is liking
                // and because we don't need the id from the database for anything in the like, 
                // we can go ahead and push it into the current comment.
                comment.likes.push(commentLike);

                // Because we don't need the id from the database, we can send the like directly 
                // to the server to be broadcast to everyone else. 
                Socket.emit('comment:like', commentLike);

                ThreadApi.likeComment(commentLike).then(

                    // no action needed if response is ok
                    function(){}, 
                    function(e){

                        $log.error('Error adding like to comment', e);
                    }
                );
            };


              /***********************************************************************************/
             /******* SOCKET LISTENERS FOR INCOMING THREADS/COMMNETS/LIKES FROM SERVER **********/
            /***********************************************************************************/

            // When something is recieved from the server, it only needs to be added to the model if it's part of the
            // current user's model. The user's model will either be threads grouped by specific topic, a particular user or 
            // it may me all threads, in which case the incoming data will always be a part of their model. 
            // This is a simple check to determine this 
            var onSamePage = function(post){
                return threads.type === '*' || $stateParams.user === post.author || $stateParams.topic === post.topic;
            }

            // If the incoming post matches the users model, then this function loops over the users posts and returns
            // the post if there is a match, which can then be updated or used for an additional search
            var match = function(posts, id){

                for(var x = 0 ; x < posts.length ; x++ ){

                    if(posts[x]._id === id) return posts[x];
                }
            };

            // listen for messages regarding the loading status of threads and update the model with it. 
            Socket.on('threads:loading', function(loadingStatus){
                
                $scope.loadingStatus = loadingStatus;
            });

            //listen for new threads being recieved and push them into the model if the current users model is relevant to the thread
            Socket.on('thread:add', function(thread){
                
                if(onSamePage(thread)) $scope.threads.unshift(thread);
            });

            // Listen for new comments being recieved. The full thread is recieved and the last comment is extracted as this will be the new one.
            // Check that the current user's model is relevant to the thread, and then find the particular thread and push the comment into its comments array
            Socket.on('comment:add', function(thread){
                
                var comment = thread.comments[thread.comments.length -1];
                if(onSamePage(thread)){

                    // if the thread has been removed there will be no match
                    try {

                        match($scope.threads, thread._id).comments.push(comment);
                    }
                    catch(e){

                        $log.error('Error adding incoming comment to model', e);
                    }
                } 
            });

            // Listen for new likes being recieved. Check that the current user's model is relevant to the thread that the like belongs to, 
            // and then find the particular thread in the user's model and push the like into its likes array
            Socket.on('thread:like', function(like){
                
                if(onSamePage(like)) {

                    // if the thread has been removed there will be no match
                    try {

                        match($scope.threads, like.threadId).likes.push(like);
                    }
                    catch(e){

                        $log.error('Error adding incoming like to thread', e);
                    }
                } 
            });

            // Listen for new likes being recieved. Check that the current user's model is relevant to the thread that the like belongs to, 
            // and then find the particular thread in the user's model, then find the particular comment and push the like into its likes array
            Socket.on('comment:like', function(like){

                if(onSamePage(like)){

                     // if the comment has been removed there will be no match
                    try{

                        match( match($scope.threads, like.threadId).comments , like.commentId).likes.push(like);
                    }
                    catch(e){

                         $log.error('Error adding incoming like to comment', e);
                    }
                } 
            });

            // Everytime this controller is initialised, the socket listeners are initialised and stay listening, so this function  
            // them when the controller is destroyed
            $scope.$on('$destroy', function (event) {

                    Socket.removeAllListeners();
            });

        }
    ]);

/**
 *
 * Controller for individual threads
 *
 * Currently this controller only handles the show / hide event of expanding threads
 * By creating a controller for each thread Angular can work out which individual thread the user has selected
 * 
 * TODO : this controller should handle all events for individual threads rather than them being handled in the threadFeed controller -
 * because this will have performance gains when updates come in from web sockets as it avoids having to checking the current model
 * each time there is an update by registering a listener can to each thread and even comments (which would involve another controller)
 * 
 */

threadFeedCtrl.controller('ThreadController',
    [           '$scope', 
        function($scope) {

            $scope.getFullThread = function() { 

                $scope.showFullThread = ! $scope.showFullThread;
            };
        }
    ]);

/**
 *
 * Controller for individual threads
 *
 * Currently this controller only handles the show / hide event of expanding threads
 * By creating a controller for each thread Angular can work out which individual thread the user has selected
 * 
 * TODO : this controller should handle all events for individual threads rather than them being handled in the threadFeed controller -
 * because this will have performance gains when updates come in from web sockets as it avoids having to checking the current model
 * each time there is an update by registering a listener can to each thread and even comments (which would involve another controller)
 * 
 */

threadFeedCtrl.controller('UserDetailController',
    [           '$scope', 'userOffline',
        function($scope,   userOffline) {

            $scope.userImage = userOffline.data[0].photo;
            $scope.username = userOffline.data[0].username;
        }
]);