// Hasq Technology Pty Ltd (C) 2013-2016

function engSendDeferredRequest(cmd, f, t)
{
    // Sends ajax request with 500ms delay.
    // the request will be ignored if token value will be changed during this 1000ms
    t = +t || 0;

    var req = function ()
    {
        var timerId = glTimerId;

        var cb = function (data)
        {
            if (timerId === glTimerId)
                f(data);

            clearTimeout(timerId);
        }
        ajxSendCommand(cmd, cb, hasqLogo);
    }

    glTimerId = setTimeout(req, t);
}

function engSendPing(timeDelay)
{
    var cb = function (data)
    {
        var now = new Date();
        var ct = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + '.' + now.getMilliseconds();

        //console.log(ct);

        var resp = engGetResponseHeader(data);

        //if (resp.msg !== 'OK')
        //return widShowLog(resp.msg + ': ' + resp.cnt);
    }

    ajxSendCommand('ping', cb, hasqLogo);

    if (arguments.length == 0)
        return;

    if (timeDelay < 60000) // Ping server every 0s, 5s,10s,15s,...,60s,...,60s,...
    timeDelay += 5000;

    var ping = function ()
    {
        engSendPing(timeDelay);
    }

    setTimeout(ping, timeDelay);
}

function engGetTokenName (record, keys)
{

    var d = (record) ? record.d : '';
    var dLen = d.length;

    if (d && d.charAt(0) === '[' && d.charAt(dLen - 1) === ']' && engGetHash(d.substring(1, dLen - 1), glCurrentDB.hash) === keys[0].s)
        return d.substring(1, dLen - 1);
    else
        return keys[0].s;
}

