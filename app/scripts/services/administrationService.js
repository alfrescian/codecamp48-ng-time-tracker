'use strict';

angular.module('fireTimeTracker')

    .factory('customerService', function ($resource) {
        return $resource('/api/customer', {}, {
            get: {
                method: 'GET',
                isArray: true
            },
            create: {
                method: 'POST'
            }
        });
    })
    .factory('projectService', function ($resource) {
        return $resource('/api/customer/:customerId/project', {}, {
            get: {
                method: 'GET',
                isArray: true
            },
            create: {
                method: 'POST'
            }
            
        });
    })
    .factory('taskService', function ($resource) {
        return $resource('/api/project/:projectId/task', {}, {
            get: {
                method: 'GET',
                isArray: true
            },
            create: {
                method: 'POST'
            }
        });
    })
    .filter('estimationDuration', function($filter) {
        return function(input, scope) {
            var duration = moment.duration(input);
            return  $filter('dynamicDuration')(duration);
        }
    });