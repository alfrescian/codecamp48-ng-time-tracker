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
        customerService.create({},{
            name : $scope.newCustomerName
        }).$promise.then(function (resp){
            $scope.newCustomerName = null;
            $scope.customers.push(resp);
            $scope.selectedCustomer = resp.id;
            $scope.projects = [];
            $scope.selectedProject = null;
            $scope.tasks = [];
        },
        function (error){
            $log.log(error);
        });   
    }
    
    $scope.createProject = function(){
        var id = projectService.create({customerId: $scope.selectedCustomer},{
            name : $scope.newProjectName,
            estimatedTime: 123456
        }).$promise.then(function (resp){
            $scope.newProjectName = null;
            $scope.projects.push(resp);
            $scope.selectedProject = resp.id;
            $scope.tasks = [];
        },
        function (error){
            $log.log(error);
        }); 
    }

    $scope.createTask = function(){
        var id = taskService.create({projectId: $scope.selectedProject},{
            description : $scope.newTaskDescription,
            estimatedTime: 456                         
        }).$promise.then(function (resp){
            $scope.newTaskDescription= null;
            $scope.tasks.push(resp);
            $scope.selectedTask = resp.id;
        },
        function (error){
            $log.log(error);
        }); 
    }

});