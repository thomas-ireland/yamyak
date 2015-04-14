// client/js/controllers/authCtrl.js

/**
 *
 * Controller for signUp and signIn events
 *
 * Both events: 
 * Recieve incoming data from user input via the model ($scope) (two-way data binding)
 * Send model ($scope) data to backend for authetication or creation via AuthApi
 * Update the model ($scope) with data from AuthApi returned promises
 * The model ($scope) is automatically exposed to the template for rendering of the view  
 * 
 */

'use strict';

var authCtrl = angular.module('AuthCtrl', []);

authCtrl.controller('AuthController', 
    [           '$scope', '$state', 'AuthApi',
        function($scope,   $state,   AuthApi) {
       
            $scope.signIn = function (){

                if(!$scope.username || !$scope.password) return;

                $scope.user = {

                    username: '@' + this.username,
                    password: this.password
                }

                AuthApi.login($scope.user).then(

                    function(result) {

                        if(result.data != "success") {

                            // not signed in
                            $scope.authError = result.data;
                            $scope.username = $scope.password = '';
                            
                            // only toggle error message if it's not displayed
                            if(!$scope.showAuthError) 
                                $scope.showAuthError = !$scope.showAuthError;
                        } else {

                            // signed in
                            $state.go('app.allThreads', null, { reload : true } );
                            //$scope.username = $scope.password = '';
                        }
                    },
                    function(e) {

                        $log.error('Error occurred while trying to sign user in', e);
                    });
            };

            $scope.signUp = function (){

                if(!$scope.username || !$scope.password || !$scope.email) return;

                $scope.user = {
                    email: this.email,
                    username: '@' + this.username,
                    password: this.password
                };

                AuthApi.create($scope.user).then(

                    function(result) {

                        // user created
                        if(result.data === "success") {

                         $state.go('auth.signIn');
                        } else if (result.data === "taken") {

                            $scope.authError = "Ah! This username has already been taken.";
                            $scope.email = $scope.password = $scope.username = '';

                            // only toggle error message if it's not displayed
                            if(!$scope.showAuthError) 
                                $scope.showAuthError = !$scope.showAuthError;   
                        };
                    },
                    function(e) {

                        $log.error('Error occurred while trying to sign user up', e);
                });
            };

        }
    ]);

/**
 *
 * Controller for signOut event
 *
 * Recieves 'signedOut' data that is injected via Ui-Router resolves
 * Updates the model ($scope) with the status of the signOut event
 * The model ($scope) is then automatically exposed to the template for rendering of the view 
 * 
 */

authCtrl.controller('SignOutController', 
    [           '$scope', '$state', 'signedOut',
        function($scope,   $state,   signedOut) {

            if(signedOut.success)
                $scope.signOutStatus = "Signed Out!"; 
             else
                $log.error('Error in attempt to sign out user', signedOut.error);
       
        }  
    ]);