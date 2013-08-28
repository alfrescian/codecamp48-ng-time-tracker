'use strict';

angular.module('fireTimeTracker', ['ngRoute', 'firebase'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        redirectTo: '/time-track'
      })
      .when('/firetrack', {
        templateUrl: 'views/main.html',
        controller: 'FireTimeTrackCtrl'
      })
      .when('/time-track', {
        templateUrl: 'views/time-track.html',
        controller: 'TimeTrackCtrl'
      })
      .when('/administration', {
        templateUrl: 'views/administration.html',
        controller: 'AdministrationCtrl'
      })
      .when('/export', {
            templateUrl: 'views/export.html',
            controller: 'ExportCtrl'
      })
      .when('/history', {
        templateUrl: 'views/history.html',
        controller: 'HistoryCtrl'
      })
      .otherwise({
        redirectTo: '/time-track'
      });
  });
