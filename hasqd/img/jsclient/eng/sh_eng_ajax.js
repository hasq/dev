// Hasq Technology Pty Ltd (C) 2013-2016

function ajxSendCommand(cmd, callback, led) {
    led.wait();
    //$.get('/' + cmd, function (data) {})
    // use post to prevent caching
    $.post('/', 'command=' + cmd, function (data) {})

    .done(function (data) {
        led.done(); 
		//setTimeout(function() {led.done()}, 2000);
        callback(data); 
		//setTimeout(function() {callback(data)}, 1000);
    })

    .fail(function () {
        led.fail();
        alert('Failed to connect to server!');
    })

    .always(function () {});

}
