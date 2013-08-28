'use strict';

angular.module('fireTimeTracker')
    .service('exportService', function exportService($http, $q, $rootScope) {


        this.customers = [
            {data: {name: "Telekom AG"}}
        ];

        this.projects = [
            {data: {name: "Accounting System", status: "closed"}, customer: this.customers[0]},
            {data: {name: "Kundenanfrage XY", status: "ongoing"}, customer: this.customers[0]}
        ];

        this.tasks = [
            {data: {description: "Specification", estimatedTime: 30}, project: this.projects[0]},
            {data: {description: "Implementation", estimatedTime: 100}, project: this.projects[0]},
            {data: {description: "Testing", estimatedTime: 60}, project: this.projects[0]},
            {data: {description: "Deployment", estimatedTime: 8}, project: this.projects[0]},
            {data: {description: "Anfahrt", estimatedTime: 2}, project: this.projects[1]},
            {data: {description: "Telefon anschließen", estimatedTime: 24}, project: this.projects[1]},
        ];

        this.bookings = [{data:
            {
                description: "Booking 01",
                started: new Date(2013, 23, 12, 4, 4, 10, 10),
                ended: new Date(2013, 24, 12, 4, 4, 10, 10)},
                task: this.tasks[0]
            },{data:
            {
                description: "Booking 02",
                started: new Date(2013, 24, 12, 4, 4, 10, 10),
                ended: new Date(2013, 25, 12, 4, 4, 10, 10)},
                task: this.tasks[0]
            },{data:
            {
                description: "Booking 03",
                started: new Date(2013, 25, 12, 4, 4, 10, 10),
                ended: new Date(2013, 26, 12, 4, 4, 10, 10)},
                task: this.tasks[0]
            },{data:
            {
                description: "Booking 04",
                started: new Date(2013, 26, 12, 4, 4, 10, 10),
                ended: new Date(2013, 27, 12, 4, 4, 10, 10)},
                task: this.tasks[1]
            },{data:
            {
                description: "Booking 05",
                started: new Date(2013, 26, 12, 4, 4, 10, 10),
                ended: new Date(2013, 27, 12, 4, 4, 10, 10)},
                task: this.tasks[1]
            },
        ];


        /*
        this.calculateCustomProperties = function(){
            var b = this.bookings;
            var t = this.tasks;

            t.map(function(task){
                b.map(function(booking){
                    if (booking.task == task){
                        var end = new moment(booking.ended);
                        var start = new moment(booking.started);
                        task.duration += end.diff(start);
                    }
                })
            })
        } */

        this.getTasks = function(){
            //this.loadData()
            //this.calculateCustomProperties();
            return this.tasks;
        }

        this.loadData = function()
        {
            var deferredCustomers = $q.defer();
            this.customers = deferredCustomers.promise;
            $http({method: 'GET', url: 'api/customer'}).
                success(function(data, status, headers, config) {
                    deferredCustomers.resolve(data);
                    })

            var deferredProjects = $q.defer();
            this.projects = deferredProjects.promise;
            $http({method: 'GET', url: 'api/project'}).
                success(function(data, status, headers, config) {
                    deferredProjects.resolve(data);
                })

            var deferredTasks = $q.defer();
            this.tasks = deferredTasks.promise;
            $http({method: 'GET', url: 'api/task'}).
                success(function(data, status, headers, config) {
                    deferredTasks.resolve(data);
                }).error(function(err){console.log("error: ", err)})

            var deferredBookings = $q.defer();
            this.bookings = deferredBookings.promise;
            $http({method: 'GET', url: 'api/booking'}).
                success(function(data, status, headers, config) {
                    deferredBookings.resolve(data);
                })

            var deferredAll = $q.all([
                this.customers,
                this.projects,
                this.tasks,
                this.bookings
            ]);

            /*
            var customers = this.customers;
            var projects = this.projects;
            var tasks = this.tasks;
            var bookings = this.bookings;
              */

            // connect data
            deferredAll.then(angular.bind(this, function(result){
                this.customers = result[0];
                this.projects = result[1];
                this.tasks = result[2];
                this.bookings = result[3];

                for(var c = 0; c < this.customers.length; c++){
                    this.customers[c].projects = [];

                    for (var p = 0; p < this.projects.length; p++){
                        this.projects[p].tasks = [];
                        this.projects[p].customer = this.customers[c];
                        this.customers[c].projects.push(this.projects[p])

                        for (var t = 0; t < this.tasks.length; t++){
                            this.tasks[t].bookings = [];
                            this.tasks[t].project = this.projects[p];
                            this.projects[p].tasks.push(this.tasks[t])

                            for (var b = 0; b < this.bookings.length; b++){
                                this.bookings[b].task = this.tasks[t];
                                this.tasks[t].bookings.push(this.bookings[b])
                            }
                        }
                    }
                };

            }), function(err) { console.log("load data error:", err) })
        }
    });