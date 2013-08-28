'use strict';
angular.module('fireTimeTracker')
    .controller('FireTimeTrackCtrl', function ($scope, angularFireCollection, $log) {
    
	//init scope
	$scope.activeTrack = {};
	$scope.user = {
		userName: 'jan',
		firstName: 'Jan',
		lastName: 'Pfitzner'
	}
	$scope.customers = [
		{
			name : "fme AG"
		},
		{
			name : "Hochschule Harz"
		}
	];

    var url = 'https://alfrescian.firebaseio.com/tracks';
	$scope.tracks = angularFireCollection(url);
	
	$scope.startFireTrack = function(){
		$log.log("start..");
		$scope.activeTrack = {
			track : {
				description: '',
				user: $scope.user,
				started : Date.now()
			}
		};
		$scope.activeTrack.ref = $scope.tracks.add($scope.activeTrack.track);
		
		$log.log($scope.activeTrack);
		
	}
	$scope.stopFireTrack = function(description){
		$log.log("sop..");
		$scope.activeTrack.ref.update({description: description, stopped: Date.now()});//{description: "test " + Date.now()}
		$scope.activeTrack = {};
	}
	
  }).directive('autoGrow', function() {
    return {
        restrict: 'A',
        link: function( scope , element , attributes ) {
            var threshold    = 35,
                minHeight    = element[0].offsetHeight,
                paddingLeft  = element.css('paddingLeft'),
                paddingRight = element.css('paddingRight');

            var $shadow = angular.element('<div></div>').css({
                position:   'absolute',
                top:        -10000,
                left:       -10000,
                width:      element[0].offsetWidth - parseInt(paddingLeft || 0) - parseInt(paddingRight || 0),
                fontSize:   element.css('fontSize'),
                fontFamily: element.css('fontFamily'),
                lineHeight: element.css('lineHeight'),
                resize:     'none'
            });

            angular.element( document.body ).append( $shadow );

            var update = function() {
                var times = function(string, number) {
                    for (var i = 0, r = ''; i < number; i++) {
                        r += string;
                    }
                    return r;
                }

                var val = element.val().replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/&/g, '&amp;')
                    .replace(/\n$/, '<br/>&nbsp;')
                    .replace(/\n/g, '<br/>')
                    .replace(/\s{2,}/g, function( space ) {
                        return times('&nbsp;', space.length - 1) + ' ';
                    });

                $shadow.html( val );

                element.css( 'height' , Math.max( $shadow[0].offsetHeight + threshold , minHeight ) );
            }

            scope.$on('$destroy', function() {
                $shadow.remove();
            });

            element.bind( 'keyup keydown keypress change' , update );
            update();
        }
    }
}).directive('trackTicker', function($filter,$log, $timeout){
	return {
		restrict : 'E',
		template : '<span>{{duration}}</span>',
		scope: {
	         start :'@'
	    },
	   link: function(scope, elm, attrs, ctrl) {
			var tick = function(){
					$log.log("tick...")
					if (scope.start != null && scope.start!= ""){
						var given = moment($filter('date')(scope.start));
						scope.duration = given.fromNow();
					}
					else{
						scope.duration="";
					}
					$timeout(tick, 60000);
				
			};
			tick();
       }
	};
}).directive('trackDuration', function($filter,$log,$timeout){
	return {
		restrict : 'E',
		template : '<span class="badge">{{duration.asMinutes() | number:0}} min</span>',
		scope: {
	         start :'@',
			 end :'@'
	    },
	   link: function(scope, elm, attrs, ctrl) {
			$timeout(function(){
				var start = scope.start;
				var end = scope.end;
				if (end && start){
					scope.duration = moment.duration(end - start);
				}
				
			});
       }
	};
});
  
