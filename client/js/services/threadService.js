// client/js/services/threadListService.js

/**
 *
 * Service that is responsible for retrieving and updating threads from the backend API
 * 
 * Returned values are promises
 *
 * Ui-Router will only initialise controllers if promises are solved, so when a service is called from Ui-Router,
 * the return values are wrapped in an object literal to ensure the controller is initialised even in the case of error
 *
 */

angular.module('ThreadService', [])

.factory('ThreadApi', 
	[           '$http', 
		function($http) {

			return {
				
				get : function() {

					return $http.get('/api/threads').then(

		                    function(result){
		                    	
		                        return { success: true, data: result.data, type: '*' }
		                    },
		                    function(e){

		                        return { success: false, error: e }
		                    })
				},

				getTopicThreads : function(topic){

					return $http.get('/api/threads/' + topic).then(

		                    function(result){
		                        
		                        return { success: true, data: result.data, type: 'topic' }
		                        
		                    },
		                    function(e){

		                        return { success: false, error: e }
		                    })
				},
				
				addThread : function(thread) {

					return $http.post('/api/thread', thread);
				},

				addComment : function(comment) {

					return $http.put('/api/comment', comment);
				},
				
				likeThread : function(like) {

					return $http.put('/api/thread/like', like);
				},

				likeComment : function(like) {

					return $http.put('/api/comment/like', like);
				},

				deleteThread : function(threadId){

					return $http.delete('/api/thread/delete/' + threadId);
				},

				deleteComment : function(threadId, commentId){

					return $http.delete('/api/comment/delete/' + threadId + '/' + commentId);
				}
			}
		}
	]);