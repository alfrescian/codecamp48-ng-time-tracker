'use strict';

angular.module('fireTimeTracker')
  .controller('TimeTrackCtrl', function ($scope, customerService, projectService, taskService, bookingService, $log, $rootScope) {
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
		var id = bookingService.create({}).$promise.then(function (resp){
            $rootScope.currentBooking = resp.id;
			$rootScope.startTime = resp.data.start;
        },
        function (error){
            $log.log(error);
        }); 
	}

	$scope.stop = function() {
		$log.log("stop() booking " + $rootScope.currentBooking);
		bookingService.update({bookingId: $rootScope.currentBooking}, { description: $scope.comment, task : $scope.selectedTask.id })
		.$promise.then(function (resp){
			$scope.started = false;
			$rootScope.startTime = null;
        });
	}

  });
