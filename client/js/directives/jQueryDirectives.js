// client/js/directives/jQueryDirectives.js

var jQueryDirectives = angular.module('jQueryDirectives', []);


jQueryDirectives.directive('navActive', [
            
        function(){

            return {

                restrict: 'A',
                
                link: function(scope, element, attrs){

                    element.on('click', function(){
                        
                        $('.topic-item').removeClass('active-topic');
                        element.addClass('active-topic');
                    });
                
                }
                
            }
        }

    ]);