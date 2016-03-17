// Hasq Technology Pty Ltd (C) 2013-2016

function ajxSendCommand(cmd, callback, logo)
{
    logo.wait();
    $.post('/', 'command=' + cmd, function (data)  {}

    )

    .done(function (data)
    {
        callback(data);
        logo.done();
    }
    )

    .fail(function ()
    {
        callback('An error occurred while processing your request!');
        logo.fail();
        alert('Failed to connect to server!');
    }
    )

    .always(function ()  {}

    );
}
