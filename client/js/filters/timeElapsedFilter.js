// client/js/filters/insertBreaksFilter.js

/**
 *
 * A filter that works out the time elapsed since the post was added
 *
 * Input parameter the date posted
 * Return value is the time elapsed since it was posted
 *
 */

'use strict';

angular.module('TimeElapsedFilter', [])
.filter('timeElapsed', 
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