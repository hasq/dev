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

function engGetRawFromZRec (s, z, hash)
{
    if (!z)
        return s;

    var l = z.length;

    if (z.charAt(0) === '[' && z.charAt(l - 1) === ']' )
    {
        var raw = z.substring(1, l - 1);
        if ( engGetHash(raw, hash) === s) return raw;
    }

    return s;
}

function engLoadFiles(files, hash, cb0)
{
    // files is a FileList of File objects. List some properties.
    var output = [];
    var file = files[0];
    var obj = {};

    if (file)
    {
        obj.name = file.name;
        obj.size = file.size;
        obj.type = file.type;
    }
    else
    {
        obj.error = null;
        return cb0(obj);
    }

    var reader = new FileReader();

    reader.onload = function()
    {
        if (+file.size > 20971520)
            obj.error = gMsg.fileTooBig;
        else if (+file.size === 0)
            obj.error = gMsg.fileZero;
        else
        {
            obj.raw = this.result; //event.target.result;
            obj.loading = false;
            obj.s = engGetHash(obj.raw, hash);
        }

        cb0(obj);
    };

    reader.onerror = function()
    {
        obj.error = gMsg.fileLoadError;
        obj.loading = false;
        cb0(obj);
    };

    reader.onloadstart = function()
    {
        obj.loading = true;
    }

    reader.onloadend = function()
    {}

    reader.readAsBinaryString(file);
}

/* FIXME what is this?
a=str.charCodeAt(0);
if (a>0xFF) a-=0x350;

function native2ascii(str)
{
    console.log('in: ' + str);
    console.log('Before: ' + engGetHash(str, 'smd'));

    var out = '';
    for (var i = 0, l = str.length; i < l; i++) {
        if (str.charCodeAt(i) < 0x80) {
            out += str.charAt(i);
        } else {
            console.log(str.charCodeAt(i));
            var u = '' + str.charCodeAt(i).toString(16);
            out += '\\u' + (u.length === 2 ? '00' + u : u.length === 3 ? '0' + u : u);
        }
    }
    console.log('out: ' + out);
    console.log('After: ' + engGetHash(out, 'smd'));
    return out;
}
*/

function updateGWalletOnLast(lr)
{
    if(!lr) return;

    var nr = engGetRecord(lr.n, lr.s, gPassword, null, null, gCurrentDB.magic, gCurrentDB.hash);
    var st = engGetTokensStatus(lr, nr);

    if( st=='PWD_WRONG' && !gWallet[lr.s] ) return;

    if ( !gWallet[lr.s] )
    {
        var r = {};
        r.s = lr.s;
        r.n = lr.n;
        r.raw = "";
        r.state = 0;
        gWallet[lr.s] = r;

	// FIXME test token name and fill raw
    }

    var rs = gWallet[lr.s];

    rs.n = lr.n;

    switch (st)
    {
        case 'OK':        rs.state = 1; break;
        case 'PWD_SNDNG': rs.state = 2; break;
        case 'PWD_RCVNG': rs.state = 3; break;
        case 'PWD_WRONG': rs.state = 4; break;
    }
}

