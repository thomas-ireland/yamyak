// client/js/filters/checkAuthorFilter.js


'use strict';

var formatFilters = angular.module('FormatFilters', []);

/**
 *
 * A filter that checks if a particular signed in user has authored a thread or comment.
 * If they have, then they are authorised to delete it.
 * 
 * Input parameter is the user name as a String
 * Return value is an empty string for unauthorised or 'delete' for authorised
 *
 */

formatFilters.filter('checkAuthor', 
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

/**
 *
 * A filter that replaces all '/n' with '<br/>'
 * MongoDB stores all newline characters as '/n' so these need to be converted to HTML 
 * to render the page correctly
 *
 * Input parameter is the post as a String
 * Return value is the modified post as a String
 *
 */

formatFilters.filter('insertBreaks', 
    function() {
    
        return function(postContent) {

            return postContent.replace(/\n/g,'<br />').replace(/\t/g,'&nbsp;&nbsp;&nbsp;');
    };
});

/**
 *
 * A filter that works out the time elapsed since the post was added
 *
 * Input parameter the date posted
 * Return value is the time elapsed since it was posted
 *
 */

formatFilters.filter('timeElapsed', 
    function() {
    
      return function(posted) {
        var datePostedMilli = new Date(posted).getTime();
        var datePostedFull  = new Date(posted).toLocaleString();
        var dateNowMilli    = new Date().getTime();
        var timeElapsed     = dateNowMilli - datePostedMilli;
        var seconds         = timeElapsed / 1000;
        var minutes         = seconds / 60;
        var hours           = minutes / 60;
        var days            = hours / 24;
    
        if (hours >= 1 && hours < 24) 
            timeElapsed = Math.floor(hours).toString()+ " h";
        else if (minutes >= 1 && minutes < 60) 
            timeElapsed = Math.floor(minutes).toString() + " m";
        else if (seconds >= 0 && seconds < 60) 
            timeElapsed = Math.floor(seconds).toString() + " s";
        else
            timeElapsed = Math.floor(days).toString()+ " d";

        return timeElapsed;

    };
});

