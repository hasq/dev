// Hasq Technology Pty Ltd (C) 2013 - 2016

function ajxSendCommand(cmd, callback, logo)
{
    logo.wait();
 cmd = cmd.replace(/\u0025/g,'%25');
    $.post ('/', 'command=' + cmd, function (data)  {})

    .done
    (function (data)
    {
        callback(data);
        logo.done();
    })

    .fail
    (function ()
    {
        callback('FAIL');
        logo.fail();
    })

    .always(function () {});
}
