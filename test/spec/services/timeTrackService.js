'use strict';

describe('Service: timeTrackService', function () {

  // load the service's module
  beforeEach(module('fireTimeTracker'));

  // instantiate service
  var timeTrackService;
  beforeEach(inject(function (_timeTrackService_) {
    timeTrackService = _timeTrackService_;
  }));

  // it('should do something', function () {
  //   expect(!!timeTrackService).toBe(true);
  // });

});
