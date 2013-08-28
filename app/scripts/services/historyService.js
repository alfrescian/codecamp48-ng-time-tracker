'use strict';

angular.module('fireTimeTracker')
.filter('dynamicDuration', function() {
    return function(input, scope) {
      if (input) {
        if (input.asSeconds() < 60) {
          return  input.format("s") + "s";
        }

        else {
          var minutes = input.minutes();
          return input.hours() + "h" + (minutes < 10 ? "0" :"") + minutes + "m";
        }
      }
    }
})
.service('historyService', function historyService($http, $q) {

  	this.getEntries = function() {
      var entries = $q.defer();
      $http.get('/api/bookingTask').success(function(data) {
        var result =  {};
        $.each(data, function(i, value) {

          // convert string timestamps to numbers
          if (value.data.start) value.data.start = parseInt(value.data.start);
          if (value.data.end) value.data.end = parseInt(value.data.end);

          // use start of day to group the bookings
          var day = moment(value.data.start).startOf('day').valueOf();
          if (!result[day]) {
            result[day] = { "day" : day, "bookings" : [] };
          }

          result[day].bookings.push(value.data);
        });

        // Convert result object to an array
        var days = [];
        $.each(result, function(i, value) {
          days.push(value);
        });

        // calculate durations for each task and for the whole day
        $.each(days, function(i, value) {
          var daySum = moment.duration(0);

          $.each(value.bookings, function(i, booking) {
            if (booking.end) {
              booking.duration = moment.duration(moment(booking.end).diff(moment(booking.start)));
              daySum.add(booking.duration);
            }
          });
          value.duration = daySum;
        });

        // resolve the promise and return the data
        entries.resolve(days);
      });

  		return entries.promise;
  	}

  });
