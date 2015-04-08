// client/js/routes.js

angular.module('appRoutes', [])

.config(

    [       '$stateProvider', '$urlRouterProvider',
    function($stateProvider,   $urlRouterProvider) {

    $urlRouterProvider.otherwise('/all-posts');
    $stateProvider

    .state('app', {
        url: '/',
        views: {
            'app': {
                templateUrl: 'views/app/app.html'
            },
            'header@app': {
                templateUrl: 'views/app/app-header.html',
                controller: 'HeaderController'
            },
            'nav@app': {
                templateUrl: 'views/app/app-nav.html',
                controller: 'NavController' 
            },
            'threadFeed@app' : {
                templateUrl: 'views/app/app-threadFeed.html'
            }
        },
        resolve: {
            user: function(AuthApi){
                return AuthApi.getUser();
            },
            topics: function(TopicsApi){
                return TopicsApi.get();
            }
        }
    })
    
    .state('app.allThreads', {
        url: 'all-posts',
        views: {
            'threadFeedContent@app': {
                templateUrl: 'views/app/app-threadFeed-threads.html',
                controller: 'ThreadListController',
                resolve: {
                    threads: function(ThreadApi){
                        return ThreadApi.get();
                    }
                }
            } 
        }
    })

    .state('app.topicThreads', {
        url: 'topic/:topic',
        views: {
            'threadFeedContent@app': {
                templateUrl: 'views/app/app-threadFeed-threads.html',
                controller: 'ThreadListController',
                resolve: {
                    threads: function(ThreadApi, $stateParams){
                        return  ThreadApi.getTopicThreads($stateParams.topic);
                    }
                }
            } 
        }
    })
    
    .state('app.user', {

        url: 'profile/:user',
            views: {
                'userDetail@app.user' : {
                    templateUrl: 'views/app/app-user-detail.html',
                    controller: 'UserDetailController',
                    resolve: {
                        userOffline: function(UserApi, $stateParams){
                            
                            return UserApi.getUser($stateParams.user);
                    }
                }
            },
            'threadFeedContent@app': {
                    templateUrl: 'views/app/app-threadFeed-threads.html',
                    controller: 'ThreadListController',
                    resolve: {
                        threads: function(UserApi, $stateParams){
                            return UserApi.getUserThreads($stateParams.user);
                    }
                }
            } 
        }
    })
   
    .state('auth',{
        url: '/authentication',
        views: {
            'auth': {
                templateUrl: 'views/auth/auth.html'
            },
            'authHeader@auth': {
                templateUrl: 'views/auth/auth-header.html',
                controller: 'AuthController'
            }
        }
    })
    
    .state('auth.signIn',{
        url: '/sign-in',
        views: {
            'authAction@auth': {
                templateUrl: 'views/auth/auth-sign-in.html',
                controller: 'AuthController'
            }
        }
    })

    .state('auth.signUp',{
        url: '/sign-up',
        views: {
            'authAction@auth': {
                templateUrl: 'views/auth/auth-sign-up.html',
                controller: 'AuthController'
            }
        }
    })

    .state('auth.signOut',{
        url: '/sign-out',
        views: {
            'authAction@auth': {
                templateUrl: 'views/auth/auth-sign-out.html',
                controller: 'SignOutController',
                resolve: {
                        signedOut: function(AuthApi){
                            return AuthApi.signOut();
                    }
                }
            }
        }
    })

}]);