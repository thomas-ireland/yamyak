// client/js/filters/checkAuthorFilter.js

/**
 *
 * A filter that checks if a particular signed in user has authored a thread or comment.
 * If they have, then they are authorised to delete it.
 * 
 * Input parameter is the user name as a String
 * Return value is an empty string for unauthorised or 'delete' for authorised
 *
 */

'use strict';

angular.module('CheckAuthorFilter', [])

.filter('checkAuthor', 
    [           '$rootScope',
        function($rootScope) {
    
            return function(author) {

                var status = '';
                if($rootScope.username){

                    if(author === $rootScope.username) status = 'Delete';
                }
                return status;
            };
        }
    ]);