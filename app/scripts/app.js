'use strict';

angular.module('fireTimeTracker', ['ngRoute', 'firebase'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'FireTimeTrackCtrl'
      })
      .when('/export', {
            templateUrl: 'views/export.html',
            controller: 'ExportCtrl'
        })
      .otherwise({
        redirectTo: '/'
      });
  });
