$(function () {
	$('#projectDependencies .dependency:gt(0)').hide().find('select').prop('disabled', true);
	$('#projectDependencies select').change(function () {
		$(this).closest('.dependency').next().show().focus().find('select').prop('disabled', false);
	});

	$('#startTracking').one('click', function () {
		var startTime = 0;
		var $time = $('#time');
		$(this)
			.removeClass('btn-primary')
			.addClass('btn-danger')
			.attr('title', 'Stop')
			.html('<span class="glyphicon glyphicon-stop"></span>')
			.before('<button id="pauseTracking" type="button" class="btn btn-block btn-lg btn-warning" title="Pause"><span class="glyphicon glyphicon-pause"></span></button>');

		function resetTime() {
			var date = new Date(startTime++ * 1000);
			$time.text(("0" + date.getUTCHours()).slice(-2) + ':' + ("0" + date.getUTCMinutes()).slice(-2) + ':' + ("0" + date.getUTCSeconds()).slice(-2));
		}
		$time.hide();
		resetTime();
		$time.fadeIn('slow');
		$('#timeIcon').removeClass('hidden');
		var resetTimeInterval = setInterval(resetTime, 1000);
		var invisibleInterval = setInterval(function () {
			$('#timeIcon').toggleClass('invisible');
		}, 400);
		$('#comment').focus();
		$('form').submit(function () {
			clearInterval(resetTimeInterval);
			clearInterval(invisibleInterval);
			$('#timeIcon').addClass('invisible');
			$('#pauseTracking').remove();
			$('#startTracking').removeClass('btn-danger').addClass('btn-info').attr('title', 'Send').html('<span class="glyphicon glyphicon-send"></span>');
			if(!$(this).valid()) {
				return false;
			}
		});
		return false;
	});

	$(document).keyup(function (e) {
		if (e.ctrlKey && (e.keyCode || e.which) == 13) {
			$('#startTracking').click();
		}
	});

	$('form').validate({
		errorClass : 'help-block error',
		validClass : 'help-block success',
		highlight: function (element, errorClass, validClass) {
		        $(element).closest('.form-group')
		                  .addClass('has-error')
		                  .removeClass('has-success');
		    },
		    unhighlight: function (element, errorClass, validClass) {
		        $(element).parents('.has-error')
		                  .removeClass('has-error')
		                  .addClass('has-success');
		    }
	});

	$('[data-toggle=tooltip]').tooltip();
});
