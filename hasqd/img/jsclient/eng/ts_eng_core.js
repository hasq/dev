// Hasq Technology Pty Ltd (C) 2013-2016

function engGetDbByHash(db, hash)
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

function engGetTokenHash(data, hash)
{
    //Returns hash of raw tokens value;
    return (engIsHash(data, hash)) ? data : engGetHash(data, hash);
}

function engGetTokenObj(data)
{
    var tok = {};

    tok.s = (data) ? engGetTokenHash(data, gCurrentDB.hash) : '';
    tok.raw = (data === tok.s)
              ? ''
              : (engIsAsciiOrLF(data))
              ? data
              : '';
    return tok;
}

function engGetTokNameFromZ(s, zd, hash)
{
    if (!zd)
        return s;

    var l = zd.length;

    if (zd.charAt(0) === '[' && zd.charAt(l - 1) === ']')
    {
        var fmd = zd.substring(1, l - 1);
        var raw = engGetDataFromRec(fmd);

        if (engGetHash(raw, hash) === s)
            return raw;
    }

    return s;
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
        var resp = engGetResponseHeader(data);
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

function engLoadFiles(files, hash, cb, progressCb)
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
        return cb(obj);
    }

    function progressHandler(evt)
    {
     // evt is an ProgressEvent;
        if (evt.lengthComputable)
        {
         var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
            if (percentLoaded < 100)
            {
                progressCb( +percentLoaded );
            }
        }

    };

    function onloadHandler(evt)
    {
        obj.raw = '';
        var bytes = new Uint8Array(evt.target.result);
        var length = bytes.byteLength;

        if (length === 0)
            obj.error = gMsg.fileZero;
        else if (length > gMaxFileSize)
            obj.error = gMsg.fileTooBig;
        else
        {
            for (var i = 0; i < length; i++)
                obj.raw += String.fromCharCode(bytes[i]);

            obj.s = engGetHash(obj.raw, hash);
        }

        cb(obj);
    };

    var reader = new FileReader();

    reader.readAsArrayBuffer(file);
    reader.onprogress = progressHandler;
    reader.onload = onloadHandler;
    reader.onerror = reader.onabort = function (evt)
    {
     evt = evt || window.event; // get window.event if evt argument missing (in IE)

        switch (evt.target.error.code)
        {
            case evt.target.error.NOT_FOUND_ERR:
                obj.error = 'File not found!';
                break;
            case evt.target.error.NOT_READABLE_ERR:
                obj.error = 'File not readable!';
                break;
            case evt.target.error.ABORT_ERR:
                obj.error = 'Read operation was aborted!';
                break;
            case evt.target.error.SECURITY_ERR:
                obj.error = 'File is in a locked state!';
                break;
            case evt.target.error.ENCODING_ERR:
                obj.error = 'The file is too long to encode.';
                break;
            default:
                    obj.error = 'Read error.';
        }

        //obj.error = gMsg.fileLoadError;
        cb(obj);
    };

    reader.onloadstart = function ()
    {
        console.log('start');
    };

    reader.onloadend = function ()
    {
        console.log('done');
    };



}


function updateGWalletOnLast(lr, raw)
{
    if (!lr)
        return;

    var nr = engGetRecord(lr.n, lr.s, gPassword, null, null, gCurrentDB.magic, gCurrentDB.hash);
    var st = engGetTokensStatus(lr, nr);

    if (st == 'PWD_WRONG' && !gWallet[lr.s])
        return;

    if (!gWallet[lr.s])
    {
        var r = {};
        r.s = lr.s;
        r.n = lr.n;
        r.raw = "";
        r.state = 0;
        gWallet[lr.s] = r;
    }

    var w = gWallet[lr.s];
    w.n = lr.n;

    switch (st)
    {
        case 'OK':
            w.state = 1;
            break;
        case 'PWD_SNDNG':
            w.state = 2;
            break;
        case 'PWD_RCVNG':
            w.state = 3;
            break;
        case 'PWD_WRONG':
            w.state = 4;
            break;
    }

    if (w.s == engGetHash(raw, gCurrentDB.hash))
        w.raw = raw;
}

function engGetNumberLevel(num)
{
    if (num < 100)
        return (num);
    else if (num < 1000)
        return (~~(num / 100) * 100 + '+');
        else if (num < 10000)
        return (~~(num / 1000) + 'K+');
            else if (num < 100000)
        return (~~(num / 1000) + 'K+');
                else if (num < 1000000)
        return (~~(num / 1000) + 'K+');
                    else if (num > 1000000)
                        return ('1M+');
}