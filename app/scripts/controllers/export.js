var dateFormat = function(datetime){
    return new moment(datetime).format('YY-MM-DD, h:mm:ss')
};

var durationFormat = function(datetimeStart, datetimeEnd){
    return Math.round((new Date() - datetimeStart) / (1000*60*60), 0) + " min";
};
var durationFormat = function(timespan){
    return Math.round(timespan / (1000*60*60), 0) + " min";
};

angular.module('fireTimeTracker')
    .filter('dateFormat', function() {
    return dateFormat(input);
    })
    .controller('ExportCtrl', function ($scope, exportService, $log) {
        $scope.tasks = exportService.getTasks()
        $scope.taskColumns = [
            { visible: true, name: "Customer", getValue: function(task) {return task.project.customer.name} },
            { visible: true, name: "Project", getValue: function(task) {return task.project.name} },
            { visible: true, name: "Project Status", getValue: function(task) {return task.project.status} },
            { visible: true, name: "Task Description", getValue: function(task) {return task.description} },
            { visible: true, name: "Task Duration", getValue: function(task) {return durationFormat(task.duration)} },
        ];
        $scope.exportCsv = function() {
            exportToCSV($scope, 'export.csv')
        };

        $scope.visibleColumns = function(){
            return $scope.taskColumns.filter(function(col) { return col.visible} )
        }

        function exportToCSV($scope, filename) {

            var colDelim = ';';
            var rowDelim = '\r\n';
            var csv = "";

            var quote = function(value) { return "\"" + value + "\""}

            // write column header
            $scope.columns.map(function(col){
                if (col.visible){
                    csv += quote(col.name) + colDelim;
                };
            });

            csv += rowDelim;

            // write data
            $scope.tasks.map(function(tasks){
                $scope.columns.map(function(col){
                    if (col.visible){
                        try{
                            csv += quote(col.getValue(tasks)) + colDelim;
                        }catch(ex){
                            csv += quote("error") + colDelim;
                        };
                    };
                });
            })

            var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);
            var newWindow=window.open(csvData, 'export.csv');
        };
    })
