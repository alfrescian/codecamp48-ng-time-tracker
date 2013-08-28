'use strict';

angular.module('fireTimeTracker')
  .controller('AdministrationCtrl', function ($scope,$log, administrationService) {
      $scope.customers = administrationService.getCustomers('myuserId');
      $scope.selectCustomer = function (customerId){
        $log.log('loading projects for customer ' + customerId);
          $scope.selectedCustomer = customerId;
          $scope.projects = administrationService.getProjects(customerId);
          $scope.selectedProject = null;
          $scope.tasks=[];
      }
      $scope.selectProject = function (projectId){
        $log.log('loading tasks for project ' + projectId);
          $scope.selectedProject = projectId;
          $scope.tasks = administrationService.getTasks(projectId);
          $scope.selectTask = null;
      }
       $scope.selectTask = function (taskId){
        $log.log('selecting tasks ' + taskId);
        $scope.selectedTask = taskId;   
           
         
      }
  });
