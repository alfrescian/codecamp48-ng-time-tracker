'use strict';

angular.module('fireTimeTracker')
  .controller('TimeTrackCtrl', function ($scope, customerService, projectService, taskService) {
    $scope.customers = customerService.get();
	$scope.projects = [];
	$scope.tasks = [];

	$scope.customerSelected = function() {
		$scope.projects = projectService.get({customerId:$scope.selectedCustomer.id});
		$scope.selectedProject = null;
		$scope.tasks = [];
		$scope.selectedTask = null;
	}

	$scope.projectSelected = function() {
		$scope.tasks = taskService.get({projectId:$scope.selectedProject.id});
		$scope.selectedTask = null;
	}


  });
