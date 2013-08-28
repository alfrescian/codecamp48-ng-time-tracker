'use strict';

angular.module('fireTimeTracker')

    .factory('bookingService', function ($resource) {
        return $resource('/api/booking/:bookingId', {}, {
            get: {
                method: 'GET',
                isArray: true
            },
            create: {
                method: 'POST'
            },
            update: {
                method: 'PUT'
            }
        });
    })
  // .service('timeTrackService', function timeTrackService() {
  //   // AngularJS will instantiate a singleton by calling "new" on this function
  // });
