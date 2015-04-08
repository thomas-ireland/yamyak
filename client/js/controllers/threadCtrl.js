// client/js/controllers/threadCtrl.js

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

'use strict';

angular.module('ThreadCtrl', [])

.controller('ThreadController',
    [           '$scope', 
        function($scope) {

            $scope.getFullThread = function() { 

                $scope.showFullThread = ! $scope.showFullThread;
            };
        }
    ]);



