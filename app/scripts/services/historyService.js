'use strict';

angular.module('fireTimeTracker')
.filter('dynamicDuration', function() {
    return function(input, scope) {
        if (input.asSeconds() < 60) {
          return  input.format("s") + "s";
        }
        else return  input.format("H:mm");
    }
})
  .service('historyService', function historyService() {

  	this.entries = [
  		{
  			day : 1377686946998,
  			tasks : [{
  				name : "Task1",
  				start: 1377686941998, // "12:00:05"
  				end: 1377686946998,  // 12:14:14
  				comment: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate, non, assumenda, dolor, corrupti dolore quibusdam velit sed voluptas quasi laboriosam voluptatem excepturi iusto accusantium ipsum autem impedit consequuntur voluptatibus eligendi!"
  			},
  			{
  				name : "Task2",
  				start: 1377686940998,
  				end: 1377686946998, 
  				comment: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate, non, assumenda, dolor, corrupti dolore quibusdam velit sed voluptas quasi laboriosam voluptatem excepturi iusto accusantium ipsum autem impedit consequuntur voluptatibus eligendi!"
  			},
  			{
  				name : "Task3",
  				start: 1377686916998,
  				end: 1377687916998, 
  				comment: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate, non, assumenda, dolor, corrupti dolore quibusdam velit sed voluptas quasi laboriosam voluptatem excepturi iusto accusantium ipsum autem impedit consequuntur voluptatibus eligendi!"
  			}]
  		},
  		{
  			day : 234234324,
  			tasks : [{
  				name : "Task1",
  				start: 23847238947,
  				end: 2348723432, 
  				comment: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate, non, assumenda, dolor, corrupti dolore quibusdam velit sed voluptas quasi laboriosam voluptatem excepturi iusto accusantium ipsum autem impedit consequuntur voluptatibus eligendi!"
  			},
  			{
  				name : "Task2",
  				start: 23847238947,
  				end: 2348723432, 
  				comment: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate, non, assumenda, dolor, corrupti dolore quibusdam velit sed voluptas quasi laboriosam voluptatem excepturi iusto accusantium ipsum autem impedit consequuntur voluptatibus eligendi!"
  			}]
  		}
  	];

	$.each(this.entries, function(i, value) {
		var daySum = moment.duration(0);

		$.each(value.tasks, function(i, task) {
			task.duration = moment.duration(moment(task.end).diff(moment(task.start)));
			daySum.add(task.duration);
		});
		value.duration = daySum;
	});

  	this.getEntries = function() {
  		return this.entries;
  	}

  });
