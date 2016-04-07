// Hasq Technology Pty Ltd (C) 2013-2016

function engNcDeferredLast(extCb, tok, delay)
{
    var cmd = 'last' + '\u0020' + glCurrentDB.name + '\u0020' + tok;

    var intCb = function (data)
    {
        var resp = engGetResponseHeader(data);
        var record = null;

        if (resp === 'OK')
            record = engGetParsedRecord(data);

        extCb(resp, record);
    }

    return engSendDeferredRequest(cmd, intCb, delay);
}

function engNcLast(extCb, tok)
{
    var cmd = 'last' + '\u0020' + glCurrentDB.name + '\u0020' + tok;

    var intCb = function (data)
    {
        var resp = engGetResponseHeader(data);
        var record = null;

        if (resp === 'OK')
            record = engGetParsedRecord(data);

        extCb(resp, record);
    }

    return ajxSendCommand(cmd, intCb, hasqLogo);
}

function engNcInfoDb(extCb)
{
    var cmd = 'info db';

    var intCb = function (data)
    {
        var resp = engGetResponseHeader(data);
        var db = [];

        if (resp === 'OK')
            db = engGetParsedInfoDb(data);

        extCb(resp, db);
    }

    return ajxSendCommand(cmd, intCb, hasqLogo);
}

function engNcZ(extCb, db, rec, rawDn)
{
    rawDn = (rawDn.length > 0 && rawDn.length <= 160 && rawDn !== rec.s) ? '[' + rawDn + ']' : '';
    var cmd = 'z *' + '\u0020' + db + '\u0020' + '0' + '\u0020' + rec.s + '\u0020' + rec.k + '\u0020' + rec.g + '\u0020' + rec.o + '\u0020' + rawDn;

    var jobCb = function (resp, jobId)
    {
        (resp === 'JOB_QUEUED') ? engNcJob(jobCb, jobId) : extCb(resp);
    }

    var intCb = function (data)
    {
        var resp = engGetResponseHeader(data);
        var jobId = engGetParsedJobId(data);

        (resp !== 'OK') ? extCb(resp, jobId) : engNcJob(jobCb, jobId);
    }

    return ajxSendCommand(cmd, intCb, hasqLogo);
}

function engNcAdd(extCb, db, rec, data)
{
    var data = (data) ? engGetDataValToRecord(data) : '';
    var n1 = rec.n || rec.n1 || rec.n2;
    var k1 = rec.k || rec.k1 || rec.k2;
    var g1 = rec.g || rec.g1 || rec.g2;
    var o1 = rec.o || rec.o1 || rec.o2;

    var cmd = 'add *' + '\u0020' + glCurrentDB.name + '\u0020' + n1 + '\u0020' + rec.s + '\u0020' + k1 + '\u0020' + g1 + '\u0020' + o1 + '\u0020' + data;

    var jobCb = function (resp, jobId)
    {
        if (resp === 'JOB_QUEUED')
            engNcJob(jobCb, jobId);
        else
        {
            delete rec.n1;
            delete rec.k1;
            delete rec.g1;
            delete rec.o1;
            extCb(resp, rec);
        }
    }

    var addCb = function (data)
    {
        var resp = engGetResponseHeader(data);
        var jobId = engGetParsedJobId(data);

        (resp !== 'OK') ? extCb(resp, jobId) : engNcJob(jobCb, jobId);
    }

    return ajxSendCommand(cmd, addCb, hasqLogo);
}

function engNcRecordZero(extCb, tok)
{
    var cmd = 'record' + '\u0020' + glCurrentDB.name + '\u0020' + '0' + '\u0020' + tok;

    var intCb = function (data)
    {
        var resp = engGetResponseHeader(data);
        var record = null;

        if (resp === 'OK')
            record = engGetParsedRecord(data);

        extCb(resp, record);
    }

    return ajxSendCommand(cmd, intCb, hasqLogo);
}

function engNcJob(extCb, jobId)
{
    var cmd = 'job' + '\u0020' + jobId;

    var intCb = function (data)
    {
        var resp = engGetResponseHeader(data);
        extCb(resp, jobId);
    }

    var f = function ()
    {
        ajxSendCommand(cmd, intCb, hasqLogo);
    }

    setTimeout(f, 500);
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

    reader.onload = function(event)
    {
        if (+file.size > 20971520)
            obj.error = glMsg.fileTooBig;
        else if (+file.size === 0)
            obj.error = glMsg.fileZero;
        else
        {
            obj.raw = event.target.result;
            obj.loading = false;
            obj.hash = engGetHash(obj.raw, hash);
        }

        cb0(obj);
    };

    reader.onerror = function()
    {
        obj.error = glMsg.fileLoadError;
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

