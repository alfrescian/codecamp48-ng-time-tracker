var dateFormat = function(datetime){
    return new moment(datetime).format('YY-MM-DD, h:mm:ss')
};

var durationFormat = function(datetimeStart, datetimeEnd){
    return Math.round((new Date() - datetimeStart) / (1000*60*60), 0) + " min";
};

angular.module('fireTimeTracker')
    .filter('dateFormat', function() {
    return dateFormat(input);
    })
    .controller('ExportCtrl', function ($scope, angularFireCollection, $log) {
        var url = 'https://alfrescian.firebaseio.com/tracks';
        $scope.tasks = angularFireCollection(url);
        $scope.taskColumns = [
            { visible: false, name: "User Name", getValue: function(tasks) {return tasks.user.userName} },
            { visible: true, name: "Customer", getValue: function(tasks) {return tasks.customer.name} },
            { visible: true, name: "Project", getValue: function(tasks) {return tasks.project.userName} },
            { visible: true, name: "Project Status", getValue: function(tasks) {return dateFormat(tasks.project.status)} },
            { visible: true, name: "Task Description", getValue: function(tasks) {return tasks.description} },
            { visible: true, name: "Task Status", getValue: function(tasks) {return dateFormat(tasks.status)} },
            { visible: true, name: "Task Start Time", getValue: function(tasks) {return dateFormat(tasks.started)} },
            { visible: true, name: "Task End Time", getValue: function(tasks) {return dateFormat(tasks.ended)} },
            { visible: true, name: "Task Duration", getValue: function(tasks) {return durationFormat(tasks.started, tasks.ended)} },
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
            $scope.taskss.map(function(tasks){
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
