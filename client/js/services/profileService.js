// client/js/services/profileService.js

/**
 *
 * Service that is responsible for retrieving information about users from the backend API
 * 
 * Returned values are promises
 *
 * Ui-Router will only initialise controllers if promises are solved, so when a service is called from Ui-Router,
 * the return values are wrapped in an object literal to ensure the controller is initialised even in the case of error
 *
 */

'use strict';

angular.module('ProfileService', [])

.factory('UserApi', 
    [           '$http', 
        function($http) {

        	return {

        		getUserThreads : function(username) {

        			return $http.get('/api/user/threads/' + username).then(

                            function(result){
                                
                                return { success: true, data: result.data, type: 'user' }
                            },
                            function(e){

                                return { success: false, error: e }
                            })
        		},

                getUser : function(username) {

                    return $http.get('/api/user/' + username).then(

                            function(result){
                                
                                return { success: true, data: result.data }
                            },
                            function(e){

                                return { success: false, error: e }
                            })
                },

        	}		
	
        }
    ]);
