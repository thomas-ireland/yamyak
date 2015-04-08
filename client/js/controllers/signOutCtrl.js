// client/js/controllers/authCtrl.js

/**
 *
 * Controller for signOut event
 *
 * Recieves 'signedOut' data that is injected via Ui-Router resolves
 * Updates the model ($scope) with the status of the signOut event
 * The model ($scope) is then automatically exposed to the template for rendering of the view 
 * 
 */

'use strict';

angular.module('SignOutCtrl', [])

.controller('SignOutController',
    [           '$state', '$scope', 'signedOut', 
        function($state,   $scope,   signedOut) {

            if(signedOut.success)
                $scope.signOutStatus = "Signed Out!";  
             else
                $log.error('Error in attempt to sign out user', signedOut.error);
        }
    ]);