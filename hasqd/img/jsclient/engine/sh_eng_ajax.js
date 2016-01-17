// Hasq Technology Pty Ltd (C) 2013-2015

function ajxSendCommand(cmd, callback, progressLed) {
    progressLed.inc();
    //$.get('/' + cmd, function (data){})
    // use post to prevent caching
    $.post('/', 'command=' + cmd, function (data) {})

    .done(function (data) {
        callback(data);
        progressLed.dec();
    })

    .fail(function () {
        progressLed.fail();
    })

    .always(function () {
    });
}
