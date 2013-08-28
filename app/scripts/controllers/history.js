'use strict';

angular.module('fireTimeTracker')
  .controller('HistoryCtrl', function ($scope, historyService) {
    
    $scope.entries = historyService.getEntries();

});
