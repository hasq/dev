// Hasq Technology Pty Ltd (C) 2013-2016

function engNcDeferredLast(extCb, tok, delay)
{
    var cmd = 'last' + '\u0020' + glCurrentDB.name + '\u0020' + tok;

    var intCb = function (data)
    {
        var resp = engGetResponseHeader(data);
        var record = null;

        if (resp.msg === 'OK' )
            record = engGetParsedLastRecord(data);

        extCb(resp, record);
    }

    return engSendDeferredRequest(cmd, intCb, delay);
}

function engNcInfoDb(extCb)
{
    var cmd = 'info db';

    var intCb = function (data)
    {
        var resp = engGetResponseHeader(data);
        var db = null;

        if (resp.msg === 'OK' )
            db = engGetParsedInfoDb(data);

        extCb(resp, db);
    }

    return ajxSendCommand(cmd, intCb, hasqLogo);
}

function engNcZ(extCb)
{
    var nr = engGetNewRecord(0, glLastRec.s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);
    var nr_d = (glLastRec.r.length > 0 && glLastRec.r.length <= 160 && glLastRec.r !== glLastRec.s) ? '[' + glLastRec.r + ']' : '';
    var cmd = 'z *' + '\u0020' + glCurrentDB.name + '\u0020' + '0' + '\u0020' + glLastRec.s + '\u0020' + nr.k + '\u0020' + nr.g + '\u0020' + nr.o + '\u0020' + nr_d;

    var intCb = function (data)
    {
        var resp = engGetResponseHeader(data);

        extCb(resp);
    }

    return ajxSendCommand(cmd, intCb, hasqLogo);
}

function engNcAdd(extCb, tokData)
{
    var nr = engGetNewRecord(glLastRec.n + 1, glLastRec.s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);
    var nr_d = (tokData) ? engGetDataValToRecord(tokData) : '';
    var cmd = 'add *' + '\u0020' + glCurrentDB.name + '\u0020' + nr.n + '\u0020' + glLastRec.s + '\u0020' + nr.k + '\u0020' + nr.g + '\u0020' + nr.o + '\u0020' + nr_d;

    var intCb = function (data)
    {
        var resp = engGetResponseHeader(data);
        var jobId = engGetJobId(data);

        extCb(resp, jobId);
    }

    return ajxSendCommand(cmd, intCb, hasqLogo);
}

function engNcRecord(extCb, tok)
{
    var cmd = 'record' + '\u0020' + glCurrentDB.name + '\u0020' + '0' + '\u0020' + tok;

    var intCb = function (data)
    {
        var resp = engGetResponseHeader(data);
        var record = null;

        if (resp.msg === 'OK' )
            record = engGetParsedLastRecord(data);

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

        if (resp.msg === 'OK')
            continue;

        extCb(resp);
    }

    return ajxSendCommand(cmd, intCb, hasqLogo);
}