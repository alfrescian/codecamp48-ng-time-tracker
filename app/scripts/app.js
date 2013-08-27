'use strict';

angular.module('fireTimeTracker', ['ngRoute', 'firebase'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'FireTimeTrackCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
