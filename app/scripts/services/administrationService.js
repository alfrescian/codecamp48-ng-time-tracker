'use strict';

angular.module('fireTimeTracker')

    .factory('customerService', function ($resource) {
        return $resource('customer', {}, {
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
        return $resource('/customer/:customerId/project', {}, {
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
        return $resource('/project/:projectId/task', {}, {
            get: {
                method: 'GET',
                isArray: true
            },
            create: {
                method: 'POST'
            }
        });
    });