// client/js/filters/insertBreaksFilter.js

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

'use strict';

angular.module('InsertBreaksFilter', [])

.filter('insertBreaks', 
    function() {
    
        return function(postContent) {

            return postContent.replace(/\n/g,'<br />').replace(/\t/g,'&nbsp;&nbsp;&nbsp;');
    };
});