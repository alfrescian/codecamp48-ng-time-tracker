var dateFormat = function(datetime){
    return new moment(datetime).format('YY-MM-DD, h:mm:ss')
};

var durationFormat = function(datetimeStart, datetimeEnd){
    return Math.round((new Date() - datetimeStart) / (1000*60*60), 0) + " min";
};
var durationFormat = function(timespan){
    return Math.round(timespan / (1000*60*60), 0) + " min";
};
var getDuration = function(bookings){

    var duration = 0;

    for(var i = 0; i < bookings.length; i++){
        var end = parseInt(bookings[i].data.end);
        var start = parseInt(bookings[i].data.start);
        if (end && start){
            duration += end - start;
        }
    };
    return durationFormat(duration);
    //var time;
    //for (var i = 0; i < bookings.length; i++){
    //    time += (bookings[i].end ? bookings[i].data.end : new Date())-bookings[i].data.start;
    //}
    //return Math.round(time / (1000*60*60), 0) + " min";
}

angular.module('fireTimeTracker')
    .filter('dateFormat', function() {
    return dateFormat(input);
    })
    .controller('ExportCtrl', function ($scope, exportService, $log) {
        $scope.tasks = exportService.getTasks();

        $scope.taskColumns = [
            {
                visible: true,
                name: "Customer",
                getValue: function(task) {
                    return (task && task.project && task.project.customer) ? task.project.customer.data.name : "error";
                }
            },
            {
                visible: true,
                name: "Project",
                getValue: function(task) {
                    return (task && task.project) ? task.project.data.name : "error";
                }
            },
            {
                visible: true,
                name: "Task Description",
                getValue: function(task) {
                    return task.data.description;
                }
            },
            {
                visible: true,
                name: "Task Estimated Time",
                getValue: function(task) {
                    return task.data.estimatedTime;
                }
            },
            {
                visible: true,
                name: "Task Duration",
                getValue: function(task) {
                    return getDuration(task.bookings);
                }
            }
        ];

        $scope.matchFilter = function(task) {
            console.log("Match Filter started")
            var result = false;
            // do not filter if filter condition is not valid
            if (!$scope.filterText){
                return true;
                console.log("Match Filter filter text not set")
            }

            $scope.visibleColumns().map(angular.bind(this, function(col){
                var value;
                try {
                    value = col.getValue(task);
                    console.log("Match Filter value:", value)
                }
                catch(e){
                    value = "error";
                    console.log("Match Filter error", e)
                }
                try{
                    if (value){
                        try{
                        console.log($scope.filterText);
                        if (value.toLowerCase().indexOf($scope.filterText.toLowerCase()) >= 0){
                            result = true
                        }
                        } catch(e){console.log("inner: ", e)}
                    }
                } catch(e){console.log(e)}

            }));
            console.log("Match Filter result:", result)
            return result;
        }

        $scope.exportCsv = function() {
            exportToCsv($scope, 'export.csv');
        }

        $scope.visibleColumns = function(){
            return $scope.taskColumns.filter(function(col) { return col.visible} );
        }

        exportToCsv = function($scope, filename) {

            var colDelim = ';';
            var rowDelim = '\r\n';
            var csv = "";

            var quote = function(value) { return "\"" + value + "\""}

            // write column header
            $scope.taskColumns.map(function(col){
                if (col.visible){
                    csv += quote(col.name) + colDelim;
                };
            });

            csv += rowDelim;

            // write data
            $scope.tasks.map(angular.bind(this, function(task){
                if ($scope.matchFilter(task)){
                    $scope.taskColumns.map(function(col){
                        if (col.visible){
                            try{
                                csv += quote(col.getValue(task)) + colDelim;
                            }catch(ex){
                                csv += quote("error") + colDelim;
                            };
                        };
                    });
                }
            }))

            var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);
            var newWindow=window.open(csvData, 'export.csv');
        }
    })
