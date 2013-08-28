'use strict';

describe('Controller: TimeTrackCtrl', function () {

  // load the controller's module
  beforeEach(module('fireTimeTracker'));

  var TimeTrackCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TimeTrackCtrl = $controller('TimeTrackCtrl', {
      $scope: scope
    });
  }));

  // it('should attach a list of awesomeThings to the scope', function () {
  //   expect(scope.awesomeThings.length).toBe(3);
  // });
});
