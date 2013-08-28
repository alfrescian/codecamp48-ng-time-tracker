'use strict';

angular.module('fireTimeTracker')
  .controller('TimeTrackCtrl', function ($scope, customerService, projectService, taskService, bookingService, $log) {
    $scope.customers = customerService.get();
	$scope.projects = [];
	$scope.tasks = [];
	$scope.started = false; 

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

	$scope.start = function() {
		$log.log("start()");
		$log.log($scope.comment);
		$scope.started = true;
		bookingService.create({});
	}

	$scope.stop = function() {
		$log.log("stop()");

		
	}

  });
