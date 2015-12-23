// Hasq Technology Pty Ltd (C) 2013-2015

function ajxSendCommand(cmd, callback, progbar) {
	progbar.inc();
	//$.get('/' + cmd, function (data){})
	// use post to prevent caching
	$.post('/', 'command=' + cmd, function (data) {})

	.done(function (data) {
		callback(data);
		progbar.dec();
	})

	.fail(function () {
		progbar.fail();
	})

	.always(function () {
	});
}
