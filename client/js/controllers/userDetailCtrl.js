//client/controllers/userDetailCtrl.js

/**
 *
 * Controller for the user detail section of the threadFeed
 *
 * Recieves 'userOffline' data that is injected via Ui-Router resolves
 * Updates the model ($scope) with 'userOffline' data
 * The model ($scope) is then automatically exposed to the template for rendering of the view 
 * 
 */

'use strict';

angular.module('UserDetailCtrl', [])

.controller('UserDetailController',
    [           '$scope', 'userOffline',
        function($scope,   userOffline) {

            $scope.userImage = userOffline.data[0].photo;
            $scope.username = userOffline.data[0].username;
        }
]);


                    