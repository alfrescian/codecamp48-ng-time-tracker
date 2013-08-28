'use strict';

angular.module('fireTimeTracker')
  .service('administrationService', function administrationService() {
      
      
      this.getCustomers = function (userId){
        return this.customers;
      };
      
      this.getProjects = function (customerId){
        return this.projects;
      };
      this.getTasks = function (projectId){
        return this.tasks;
      };
      
      
      
      //test objects
      this.customers = [
            {
                name : 'Customer 1',
                status: 'active',
                id: 'cust_1'
            },
            {
                name : 'Customer 2',
                status: 'active',
                id: 'cust_2'
            },
            {
                name : 'Customer 3',
                status: 'inactive',
                id: 'cust_3'
            }
        ];
      this.tasks = [
            {
                name : 'Task 1',
                plannedEffort: 2,
                status: 'active',
                id: 'task_1'
            },
            {
                name : 'Task 1',
                plannedEffort: 2,
                status: 'active',
                id: 'task_1'
            },
            {
                name : 'Task 1',
                plannedEffort: 2,
                status: 'active',
                id: 'task_1'
            }
        ];
      this.projects = [
            {
                name : 'Project 1',
                number: 100123,
                plannedEffort: 48,
                status: 'active',
                id: 'prj_1'
            },
            {
                name : 'Project 2',
                number: 100124,
                plannedEffort: 8,
                status: 'inactive',
                id: 'prj_2'
            },
            {
                name : 'Project 3',
                number: 100124,
                plannedEffort: 12,
                status: 'active',
                id: 'prj_3'
            }
        ];
    
          
  });
