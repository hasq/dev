// Hasq Technology Pty Ltd (C) 2013-2016

function ajxSendCommand(cmd, callback, logo) {
    logo.wait();
    //$.get('/' + cmd, function (data) {})
    // use post to prevent caching
    $.post('/', 'command=' + cmd, function (data) {})

    .done(function (data) 
    {
        callback(data);     
        logo.done(); 
        //setTimeout(function() {logo.done()}, 2000);
        //setTimeout(function() {callback(data)}, 1000);
    })

    .fail(function () 
    {
        callback('An error occurred while processing your request!');
        logo.fail();
        alert('Failed to connect to server!');
    })

    .always(function () {});

}
