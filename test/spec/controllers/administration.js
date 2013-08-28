'use strict';

describe('Controller: AdministrationCtrl', function () {

  // load the controller's module
  beforeEach(module('fireTimeTracker'));

  var AdministrationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdministrationCtrl = $controller('AdministrationCtrl', {
      $scope: scope
    });
  }));

  // it('should attach a list of awesomeThings to the scope', function () {
  //   expect(scope.awesomeThings.length).toBe(3);
  // });
});
