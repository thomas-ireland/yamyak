// client/js/controllers/navCtrl.js

/**
 *
 * Controller for the navigation pane
 *
 * Recieves 'topics' and 'user' data that is injected via Ui-Router resolves
 * Updates the model ($scope) with 'topics' and 'user' (if user is signed in) data
 * The model ($scope) is then automatically exposed to the template for rendering of the view 
 * 
 */

'use strict';

angular.module('NavCtrl', [])

.controller('NavController', 
    [           '$scope', '$log', 'topics', 'user',
        function($scope,   $log,   topics,   user) {
            
            if(topics.success) 
                $scope.topics = topics.data;
             else 
                $log.error('Error getting topics', topics.error);

            var loadUserStatus = function(){

                if(user.success){
              
                    if (user.signedIn){
                        $scope.usernameAuth = user.username;
                        $scope.userImage = user.userImage;
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
            
        }
    ]);