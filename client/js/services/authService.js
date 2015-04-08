// client/js/services/authService.js

/**
 *
 * Service that is responsible for creating and authenticating users on the backend API
 * 
 * Returned values are promises
 *
 * Ui-Router will only initialise controllers if promises are solved, so when a service is called from Ui-Router,
 * the return values are wrapped in an object literal to ensure the controller is initialised even in the case of error
 *
 */

'use strict';

angular.module('AuthService', [])

.factory('AuthApi', 
    [           '$http', '$rootScope', 
        function($http,   $rootScope) {

        	return {
        		
        		create : function(userData, callback) {

        			return $http.post('/api/user/join', userData);
        		},

        		login : function(logInData, callback) {

        			return $http.post('/api/user/login', logInData);
        		},

        		getUser : function() {
        			return $http.get('/api/loggedin').then(

                            function(result){

                               if(result.data){

                                    return { 
                                        success: true, 
                                        signedIn: true,
                                        username: result.data[0].username, 
                                        userImage: result.data[0].photo
                                    }
                                } else {

                                    return { success: true, signedIn: false }
                                }
                            },
                            function(e){

                                return { success: false, error: e }
                            })
          		},

        		signOut : function() {

        			return $http.post('/api/user/sign-out').then(

                            function(result){
                                
                                return { success: true, data: result.data }
                            },
                            function(e){

                                return { success: false, error: e }
                            })

        		}
        			
        	}
        }
    ]);

