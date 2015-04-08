//client/controllers/statusCtrl.js

/**
 *
 * Controller for the header banner
 *
 * Recieves 'user' data that is injected via Ui-Router resolves
 * Updates the model ($scope) dependant upon the auth status of the user
 * The model ($scope) is then automatically exposed to the template for rendering of the view
 *
 * Handles displayNav event  
 * 
 */

'use strict';

angular.module('HeaderCtrl', [])

.controller('HeaderController', 
    [           '$scope', '$log', 'user', '$rootScope',
        function($scope,   $log,   user,   $rootScope) {
        
            // this allows the search bar to have access to the model data, which is in a nested state
            $rootScope.query = {
                search: ''
            };
            
            var loadUserStatus = function(){

                if(user.success){
              
                    if (!user.signedIn){
                              
                        $scope.authActionParams = "signIn";
                        $scope.authActionButton = "Sign In";  
                    } else {
                        
                        $scope.authActionParams = "signOut";
                        $scope.authActionButton = "Sign Out";  
                    }
                } else {

                    $log.error('Error in attempt to authenticate user', user.error);
                }
            }

            loadUserStatus();

            // Due to an issue with ui-router, when the app is refreshed, the resolves fire but the controllers do not get reinitialised
            // To work around this, a $watch is placed on the resolve 'user', and when it changes, this function is called
            $scope.$watch('$state.$current.locals.globals.user', function () {
                
                loadUserStatus();
            });

            $scope.displayNav = function(){

                $rootScope.menuSelected = ! $rootScope.menuSelected;
            };

        }
    ]);
