'use strict';

angular.module('app.rt', ['ngRoute']).config(function ($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('');

    $routeProvider
        .when('/overview', {
            templateUrl: 'components/overview/overview.tmpl.html',
            controller: 'overviewController as overviewController'
        })

        .when('/crossroads/create', {
            templateUrl: 'components/crossroads/create/crossroads.create.tmpl.html',
            controller: 'crossroadsCreateController as crossroadsCreateController'
        })
        .when('/crossroads/details/:cid', {
            templateUrl: 'components/crossroads/details/crossroads.details.tmpl.html',
            controller: 'crossroadsDetailsController as crossroadsDetailsController'
        })
        .when('/crossroads/details/:cid/:sid', {
            templateUrl: 'components/crossroads/details/crossroads.details.tmpl.html',
            controller: 'crossroadsDetailsController as crossroadsDetailsController'
        })
        .when('/crossroads/edit/:cid', {
            templateUrl: 'components/crossroads/edit/crossroads.edit.tmpl.html',
            controller: 'crossroadsEditController as crossroadsEditController'
        })
        .when('/crossroads/edit/:cid/:sid', {
            templateUrl: 'components/crossroads/edit/crossroads.edit.tmpl.html',
            controller: 'crossroadsEditController as crossroadsEditController'
        })
        .when('/crossroads/list', {
            templateUrl: 'components/crossroads/list/crossroads.list.tmpl.html',
            controller: 'crossroadsListController as crossroadsListController'
        })

        .otherwise({redirectTo: '/overview'});
});