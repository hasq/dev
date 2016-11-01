// Hasq Technology Pty Ltd (C) 2013-2016

'use strict';


function engGetDbByHash(db, hash) {
    var currentDb = null;

    for (let i = 0; i < db.length; i++) {
        if (db[i].hash === hash) {
            currentDb = db[i];
            break;
        }
    }

    return currentDb;
}

function engGetTokenHash(data, hash) {
    return (engIsHash(data, hash))
        ? data
        : engGetHash(data, hash);
}

function engGetTokObj(data) {
    var tok = {};
    tok.s = tok.raw = '';

    if (data) {
        tok.s = engGetTokenHash(data, gCurrentDB.hash);
    }

    if (engIsValidString(data) && data !== tok.s) {
        tok.raw = data;
    }

    return tok;
}

function engGetTokNameFromZ(s, zd, hash) {
    var l;

    if (!zd) {
        return s;
    }

    l = zd.length;

    if (zd.charAt(0) === '[' && zd.charAt(l - 1) === ']') {
        let fmd = zd.substring(1, l - 1);
        let raw = engGetDataFromRec(fmd);

        if (engGetHash(raw, hash) === s) {
            return raw;
        }
    }

    return s;
}


/*
Sends ajax request with 500ms delay.
the request will be ignored if token
value will be changed during this 1000ms
*/
function engSendDeferredRequest(cmd, f, t) {
    var t = +t || 0;
    var req = function () {
        var timerId = gTimerId;
        var cb = function (data) {
            if (timerId === gTimerId) {
                f(data);
            }

            clearTimeout(timerId);
        };

        ajxSendCommand(cmd, cb, hasqLogo);
    };

    gTimerId = setTimeout(req, t);
}

function engSendPing(timeDelay) {
    var ping;
    var cb = function (data) {
        var now = new Date();
        var ct = now.getHours() + ':' + now.getMinutes() + ':' +
            now.getSeconds() + '.' + now.getMilliseconds();
        var resp = engGetResponseHeader(data);
    };

    ajxSendCommand('ping', cb, hasqLogo);

    if (arguments.length == 0) {
        return;
    }

    // Ping server every 0s, 5s,10s,15s,...,60s,...,60s,...
    if (timeDelay < 60000) {
        timeDelay += 5000;
    }

    ping = function () {
        engSendPing(timeDelay);
    };

    setTimeout(ping, timeDelay);
}

function engLoadFiles(files, hash, cb, progressCb) {
    // files is a FileList of File objects. List some properties.
    var output = [];
    var file = files[0];
    var obj = {};
    var reader;

    if (file) {
        obj.name = file.name;
        obj.size = file.size;
        obj.type = file.type;
    } else {
        obj.error = null;
        return cb(obj);
    }

    function progressHandler(evt) {
        // evt is an ProgressEvent;
        if (evt.lengthComputable) {
            let percentLoaded = Math.round((evt.loaded / evt.total) * 100);
            if (percentLoaded < 100) {
                progressCb(+percentLoaded);
            }
        }

    };

    function onloadHandler(evt) {
        var bytes = new Uint8Array(evt.target.result);
        var length = bytes.byteLength;
        obj.raw = '';

        if (length === 0) {
            obj.error = gMsg.fileZero;
        } else if (length > G_MAX_FILE_SIZE) {
            obj.error = gMsg.fileTooBig;
        } else {
            for (let i = 0; i < length; i++) {
                obj.raw += String.fromCharCode(bytes[i]);
            }

            obj.s = engGetHash(obj.raw, hash);
        }

        cb(obj);
    };

    reader = new FileReader();

    reader.readAsArrayBuffer(file);
    reader.onprogress = progressHandler;
    reader.onload = onloadHandler;
    reader.onerror = reader.onabort = function (evt) {
        // get window.event if evt argument missing (in IE)
        evt = evt || window.event;

        switch (evt.target.error.code) {
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

    reader.onloadstart = function () {
        //console.log('start');
    };

    reader.onloadend = function () {
        //console.log('done');
    };
}

function updateGWalletOnLast(lr, raw) {
    var nr;
    var st;
    var w;

    if (!lr) {
        return;
    }

    nr = engGetRecord(lr.n, lr.s, gPassword, null, null, gCurrentDB.magic,
        gCurrentDB.hash);
    st = engGetTokStatus(lr, nr);

    if (st == 4 && !gWallet[lr.s]) {
        return;
    }

    if (!gWallet[lr.s]) {
        let r = {};
        r.s = lr.s;
        r.n = lr.n;
        r.raw = '';
        r.state = 0;
        gWallet[lr.s] = r;
    }

    w = gWallet[lr.s];
    w.n = lr.n;
    w.state = st;

    if (w.s == engGetHash(raw, gCurrentDB.hash)) {
        w.raw = raw;
    }
}

function engGetNumberLevel(num) {
    switch (true) {
        case (num < 100):
            return (num);
        case (num < 1000):
            return (~~(num / 100) * 100 + '+');
        case (num < 10000):
            return (~~(num / 1000) + 'K+');
        case (num < 100000):
            return (~~(num / 1000) + 'K+');
        case (num < 1000000):
            return (~~(num / 1000) + 'K+');
        default:
            return ('1M+');
    }
}