'use strict';

// declare top-level module which depends on filters,and services
var myApp = angular.module('myApp',
    [   'ngRoute',
        'myApp.filters',
        'myApp.directives',
        'mgcrea.ngStrap',// custom directives        
        'ngSanitize', // for html-bind in ckeditor  
        'angular-loading-bar',
        'ui.bootstrap', // jquery ui bootstrap
        'ngMaterial',
        'md.data.table',
        'myApp.List',
        'myApp.Activate',
        'myApp.theme'
    ]);


var filters = angular.module('myApp.filters', []);
var directives = angular.module('myApp.directives', []);

// bootstrap angular
myApp.config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {

    // TODO use html5 *no hash) where possible
    // $locationProvider.html5Mode(true);

    // Register interceptors service
    $httpProvider.interceptors.push('interceptors');
    $httpProvider.defaults.headers.common = { 'X-Requested-With': 'XMLHttpRequest' };

    // by default, redirect to site root
    $routeProvider.otherwise({
        redirectTo: '/Activacion'
    });

}]);

// this is run after angular is instantiated and bootstrapped
myApp.run(function ($rootScope, $location, $http, $timeout,  RESTService) {

    // *****
    // Eager load some data using simple REST client
    // *****

    $rootScope.restService = RESTService;
    $rootScope.notificationManager = new NotificationManager($rootScope);
    $rootScope.Mensaje = {
        Text: null,
        Tipo: null
    }
});