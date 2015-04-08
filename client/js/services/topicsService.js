// client/js/services/topicService.js

/**
 *
 * Service that is responsible for retrieving topics from the backend API
 * 
 * Returned values are promises
 *
 * Ui-Router will only initialise controllers if promises are solved, so when a service is called from Ui-Router,
 * the return values are wrapped in an object literal to ensure the controller is initialised even in the case of error
 *
 */

'use strict';

angular.module('TopicsService', [])

.factory('TopicsApi', 
    [           '$http', 
        function($http) {

        	return {
        		
        		get : function() {

        			return $http.get('/api/topics').then(

                            function(result){

                                return { success: true, data: result.data }
                            },
                            function(e){

                                return { success: false, error: e }
                            });
        		}
        	}
        }
    ]);
