'use strict';

angular.module('fireTimeTracker')
    .controller('AdministrationCtrl', function ($scope, $log, customerService, projectService, taskService) {
        $scope.customers = customerService.get();
    $scope.selectCustomer = function (id) {
        $log.log('loading projects for customer ' + id);
        $scope.selectedCustomer = id;
        $scope.projects = projectService.get({customerId:id});
        $scope.selectedProject = null;
        $scope.tasks = [];
    }
    $scope.selectProject = function (projectId) {
        $log.log('loading tasks for project ' + projectId);
        $scope.selectedProject = projectId;
        $scope.tasks = taskService.get({projectId:projectId});
        $scope.selectTask = null;
    }
    $scope.selectTask = function (taskId) {
        $log.log('selecting tasks ' + taskId);
        $scope.selectedTask = taskId;
    }
    
    $scope.createCustomer = function(){
        var id = customerService.create({},{
            name : $scope.newCustomerName,
            status : 'active'
        });
        $log.log(id);
        //$scope.projects = administrationService.getProjects(id);
        $scope.selectedCustomer = id;
    }
    
    $scope.createProject = function(){
        var id = projectService.create({customerId: $scope.selectedCustomer},{
            name : $scope.newProjectName,
            estimatedTime: 123456,                           
            status : 'active'
        });
        //$scope.projects = administrationService.getProjects(id);
        $scope.project = id;
    }

    $scope.createTask = function(){
        var id = taskService.create({projectId: $scope.selectedProject},{
            description : $scope.newTaskDescription,
            estimatedTime: 456,                           
            status : 'active'
        });
        //$scope.projects = administrationService.getProjects(id);
        $scope.project = id;
    }

});