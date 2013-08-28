var dateFormat = function(datetime){
    return new moment(datetime).format('YY-MM-DD, h:mm:ss')
};

var durationFormat = function(datetimeStart, datetimeEnd){
    return new moment(datetimeEnd).subtract(datetimeStart);
};

angular.module('fireTimeTracker')
    .filter('dateFormat', function() {
    return dateFormat(input);
    })
    .controller('ExportCtrl', function ($scope, angularFireCollection, $log) {
        var url = 'https://alfrescian.firebaseio.com/tracks';
        $scope.tracks = angularFireCollection(url);
        $scope.columns = [
            { visible: true, name: "User Name", getValue: function(track) {return track.user.userName} },
            { visible: true, name: "Description", getValue: function(track) {return track.description} },
            { visible: true, name: "Project", getValue: function(track) {return track.user.userName} },
            { visible: true, name: "Customer", getValue: function(track) {return track.description} },
            { visible: true, name: "ProjectStatus", getValue: function(track) {return dateFormat(track.started)} },
            { visible: true, name: "TaskStatus", getValue: function(track) {return dateFormat(track.started)} },
            { visible: true, name: "TaskDescription", getValue: function(track) {return dateFormat(track.started)} },
            { visible: true, name: "Task Start Time", getValue: function(track) {return dateFormat(track.started)} },
            { visible: true, name: "Task End Time", getValue: function(track) {return dateFormat(track.ended)} },
            { visible: true, name: "Task Duration", getValue: function(track) {return durationFormat(track.started, track.ended)} },
            { visible: true, name: "BookingDescription", getValue: function(track) {return dateFormat(track.started)} },
            { visible: true, name: "BookingDuration", getValue: function(track) {return dateFormat(track.started)} },
        ];
        $scope.exportCsv = function() {
            exportTableToCSV($scope, 'export.csv')
        };

        $scope.visibleColumns = function(){
            return $scope.columns.filter(function(col) { return col.visible} )
        }

        function exportTableToCSV($scope, filename) {

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
            $scope.tracks.map(function(track){
                $scope.columns.map(function(col){
                    if (col.visible){
                        csv += quote(col.getValue(track)) + colDelim;
                    };
                });
            })

            var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);
            var newWindow=window.open(csvData, 'export.csv');
        };
    })
