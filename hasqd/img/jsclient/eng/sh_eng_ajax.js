// Hasq Technology Pty Ltd (C) 2013-2016

function ajxSendCommand(cmd, callback, led) {
    //console.log('---start!');
    led.inc();
    //$.get('/' + cmd, function (data) {})
    // use post to prevent caching
    $.post('/', 'command=' + cmd, function (data) {})

    .done(function (data) {
		console.log(data);
        //console.log('-done:' + data);
        //setTimeout(function() {callback(data)}, 1000);
        callback(data);
        led.dec();
    })

    .fail(function () {
        led.fail();
        alert('Failed to connect to server!');
    })

    .always(function () {
	})

    .error(function() {
    		led.fail();
    });
}
