// Hasq Technology Pty Ltd (C) 2013-2016

function engGetDbByHash (db, hash)
{
    var currentDb = null;

    for (var i = 0; i < db.length; i++)
        if (db[i].hash === hash)
        {
            currentDb = db[i];
            break;
        }

    return currentDb;
}

function engSendDeferredRequest(cmd, f, t)
{
    // Sends ajax request with 500ms delay.
    // the request will be ignored if token value will be changed during this 1000ms
    t = +t || 0;

    var req = function ()
    {
        var timerId = gTimerId;

        var cb = function (data)
        {
            if (timerId === gTimerId)
                f(data);

            clearTimeout(timerId);
        }
        ajxSendCommand(cmd, cb, hasqLogo);
    }

    gTimerId = setTimeout(req, t);
}

function engSendPing(timeDelay)
{
    var cb = function (data)
    {
        var now = new Date();
        var ct = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + '.' + now.getMilliseconds();

        //console.log(ct);

        var resp = engGetResponseHeader(data);

        //if (resp !== 'OK')
        //return widShowLog(resp);
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

function engGetTokenName (data, s)
{
    if (!data)
        return s;

    var d = data || '';

    var dLen = d.length;

    if (d && d.charAt(0) === '[' && d.charAt(dLen - 1) === ']' )
    {
        var g = d.substring(1, dLen - 1);
        if ( engGetHash(g, gCurrentDB.hash) === s) return g;
    }

    return s;
}

