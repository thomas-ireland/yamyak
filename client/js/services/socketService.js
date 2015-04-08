// client/js/services/socketService.js

/**
 *
 * This is boilerplate to wrap socket io functions in an Angular service to avoid placing socket io in the global namespace
 * 
 * When you use anything outside of Angular, Angular does not include it in its digest cycles.
 * Therefore, when a socket io function is called, you need to call $apply to ignite a digest cycle 
 * to pick up any changes on the model
 *
 * It was provided by btford, and can be found here: https://github.com/btford/angular-socket-io
 *
 * The functions provided by socket io are not altered at all
 *
 */

'use strict';

angular.module('SocketService', [])

.factory('Socket', 
    [           '$rootScope', 
        function($rootScope) {

            var socket = io();
            return {

                on: function (eventName, callback) {
                    socket.on(eventName, function () {
                        var args = arguments;
                        $rootScope.$apply(function () {
                            callback.apply(socket, args);
                        });
                    });
                },

                emit: function (eventName, data, callback) {
                    socket.emit(eventName, data, function () {
                        var args = arguments;
                        $rootScope.$apply(function () {
                            if (callback) {
                                callback.apply(socket, args);
                            }
                        });
                    })
                },

                removeAllListeners: function (eventName, callback) {
                  socket.removeAllListeners(eventName, function() {
                      var args = arguments;
                      $rootScope.$apply(function () {
                        callback.apply(socket, args);
                      });
                  }); 
              }
            };
        }
    ]);
