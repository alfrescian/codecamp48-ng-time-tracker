'use strict';

angular.module('fireTimeTracker', ['ngRoute', 'firebase'])
  .config(function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
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
  })
  .run(['$rootScope', '$location', '$route', function($rootScope, $location, $route) {
    var path = function() { return $location.path(); };
    $rootScope.$watch(path, function(newVal, oldVal) {
        var pathElements = newVal.split("/");
        if (pathElements.length == 2){
          $rootScope.activetab = pathElements[1];
        } 
       });
   }]);  

/* Patch for moment JS to format durations: https://github.com/moment/moment/issues/463 */
moment.duration.fn.format = function (input) {
    var output = input;
    var milliseconds = this.asMilliseconds();
    var totalMilliseconds = 0;
    var replaceRegexps = {
        years: /Y(?!Y)/g,
        months: /M(?!M)/g,
        weeks: /W(?!W)/g,
        days: /D(?!D)/g,
        hours: /H(?!H)/g,
        minutes: /m(?!m)/g,
        seconds: /s(?!s)/g,
        milliseconds: /S(?!S)/g
    }
    var matchRegexps = {
        years: /Y/g,
        months: /M/g,
        weeks: /W/g,
        days: /D/g,
        hours: /H/g,
        minutes: /m/g,
        seconds: /s/g,
        milliseconds: /S/g
    }
    for (var r in replaceRegexps) {
        if (replaceRegexps[r].test(output)) {
            var as = 'as'+r.charAt(0).toUpperCase() + r.slice(1);
            var value = new String(Math.floor(moment.duration(milliseconds - totalMilliseconds)[as]()));
            var replacements = output.match(matchRegexps[r]).length - value.length;
            output = output.replace(replaceRegexps[r], value);

            while (replacements > 0 && replaceRegexps[r].test(output)) {
                output = output.replace(replaceRegexps[r], '0');
                replacements--;
            }
            output = output.replace(matchRegexps[r], '');

            var temp = {};
            temp[r] = value;
            totalMilliseconds += moment.duration(temp).asMilliseconds();
        }
    }
    return output;
}
