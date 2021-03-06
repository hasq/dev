// Hasq Technology Pty Ltd (C) 2013-2016

'use strict';


function engNcDeferredLast(extCb, tok, delay) {
    var cmd = ['last', gCurrentDB.name, tok]
        .join(' ');
    var intCb = function (data) {
        var resp = engGetResponseHeader(data);
        var record = null;

        if (resp === HASQD_RESP.OK) {
            record = engGetParsedRecord(data);
        }

        extCb(resp, record);
    };

    return engSendDeferredRequest(cmd, intCb, delay);
}

function engNcZ(extCb, db, rec, data) {
    var data = (data) ? '[' + data + ']' : '';
    var cmd = ['z', '*', db, 0, rec.s, rec.k, rec.g, rec.o, data]
        .join(' ');
    var jobCb = function (resp, jobId) {
        (resp === HASQD_RESP.JOB_QUEUED)
         ? engNcJob(jobCb, jobId)
         : extCb(resp);
    };
    var intCb = function (data) {
        var resp = engGetResponseHeader(data);
        var jobId = engGetParsedJobId(data);

        (resp !== HASQD_RESP.OK)
            ? extCb(resp, jobId)
            : engNcJob(jobCb, jobId);
    };

    return ajxSendCommand(cmd, intCb, hasqLogo);
}

function engNcAdd(extCb, db, rec, data) {
    var data = data || '';
    var n1 = rec.n || rec.n1 || rec.n2;
    var k1 = rec.k || rec.k1 || rec.k2;
    var g1 = rec.g || rec.g1 || rec.g2;
    var o1 = rec.o || rec.o1 || rec.o2;
    var cmd = ['add', '*', gCurrentDB.name, n1, rec.s, k1, g1, o1, data]
        .join(' ');
    var jobCb = function (resp, jobId) {
        if (resp === HASQD_RESP.JOB_QUEUED) {
            engNcJob(jobCb, jobId);
        } else {
            delete rec.n1;
            delete rec.k1;
            delete rec.g1;
            delete rec.o1;
            extCb(resp, rec);
        }
    };

    var addCb = function (data) {
        var resp = engGetResponseHeader(data);
        var jobId = engGetParsedJobId(data);

        (resp !== HASQD_RESP.OK)
            ? extCb(resp, jobId)
            : engNcJob(jobCb, jobId);
    }

    return ajxSendCommand(cmd, addCb, hasqLogo);
}

function engNcRecordZero(extCb, s) {
    var cmd = ['record', gCurrentDB.name, 0, s]
        .join(' ');
    var intCb = function (data) {
        var resp = engGetResponseHeader(data);
        var record = null;

        if (resp === HASQD_RESP.OK){
            record = engGetParsedRecord(data);
        }

        extCb(resp, record);
    };

    return ajxSendCommand(cmd, intCb, hasqLogo);
}

function engNcJob(extCb, jobId) {
    var cmd = ['job', jobId]
        .join(' ');
    var intCb = function (data) {
        var resp = engGetResponseHeader(data);
        extCb(resp, jobId);
    };
    var f = function () {
        ajxSendCommand(cmd, intCb, hasqLogo);
    };

    setTimeout(f, 500);
}
