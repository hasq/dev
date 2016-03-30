// Hasq Technology Pty Ltd (C) 2013-2016

function engNcDeferredLast(extCb, tok, delay)
{
    var cmd = 'last' + '\u0020' + glCurrentDB.name + '\u0020' + tok;

    var intCb = function (data)
    {
        var resp = engGetResponseHeader(data);
        var record = null;

        if (resp.msg === 'OK' )
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

        if (resp.msg === 'OK' )
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
        var db = null;

        if (resp.msg === 'OK' )
            db = engGetParsedInfoDb(data);

        extCb(resp, db);
    }

    return ajxSendCommand(cmd, intCb, hasqLogo);
}

function engNcZ(extCb, db, rec)
{
    var data = (glLastRec.r.length > 0 && glLastRec.r.length <= 160 && glLastRec.r !== glLastRec.s) ? '[' + glLastRec.r + ']' : '';
    var cmd = 'z *' + '\u0020' + db + '\u0020' + '0' + '\u0020' + rec.s + '\u0020' + rec.k + '\u0020' + rec.g + '\u0020' + rec.o + '\u0020' + data;

    var jobCb = function (resp, jobId)
    {
        console.log(resp);
        if (resp.msg === 'JOB_QUEUED')
            engNcJob(jobCb, jobId)
            else
                extCb(resp);
    }

    var intCb = function (data)
    {
        var resp = engGetResponseHeader(data);
        var jobId = engGetJobId(data);

        (resp.msg === 'ERROR') ? extCb(resp, jobId) : engNcJob(jobCb, jobId);
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
     //console.log(resp);
     //note!!!
     //mozhet byt', chto nuzhno uchest' tot sluchaj, kogda job budet rejected
        if (resp.msg === 'JOB_QUEUED')
            engNcJob(jobCb, jobId)
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
     //console.log('addCb data: ' + data);
        var resp = engGetResponseHeader(data);
        var jobId = engGetJobId(data);

        (resp.msg === 'ERROR') ? extCb(resp, jobId) : engNcJob(jobCb, jobId);
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

        if (resp.msg === 'OK' )
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
        var resp = engGetResponseHeader(data)
                   extCb(resp, jobId);
    }

    return ajxSendCommand(cmd, intCb, hasqLogo);
}