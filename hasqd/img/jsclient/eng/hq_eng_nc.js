function engNcInfoId(extCb)
{
    var cmd = 'info id';

    var intCb = function (data)
    {
        var resp = engGetResponseHeader(data);
        var id = null;

        if (engGetResponseHeader(data) == 'OK')
            id = engGetParsedInfoId(data);

        extCb(resp, id);
    }

    ajxSendCommand(cmd, intCb, hasqLogo);
}

function engNcInfoSys(extCb)
{
    var cmd = 'info sys';

    var intCb = function (data)
    {
        var resp = engGetResponseHeader(data);
        var sys = null;

        if (engGetResponseHeader(data) == 'OK')
            sys = engGetParsedInfoSys(data);

        extCb(resp, sys);
    }

    ajxSendCommand(cmd, intCb, hasqLogo);
}

function engNcInfoFam(extCb)
{
    var cmd = 'info fam';

    var intCb = function (data)
    {
        var resp = engGetResponseHeader(data);
        var fam = null;

        if (engGetResponseHeader(data) == 'OK')
            fam = engGetParsedInfoFam(data);

        extCb(resp, fam);
    }

    ajxSendCommand(cmd, intCb, hasqLogo);
}

function engNcInfoFam(extCb)
{
    var cmd = 'info fam';

    var intCb = function (data)
    {
        var resp = engGetResponseHeader(data);
        var fam = null;

        if (engGetResponseHeader(data) == 'OK')
            fam = engGetParsedInfoFam(data);

        extCb(resp, fam);
    }

    ajxSendCommand(cmd, intCb, hasqLogo);
}

function engNcLast(tok, db, extCb)
{
    var cmd = engGetSplitted('last', db, tok);

    var intCb = function (data)
    {
        var resp = engGetResponseHeader(data);
        var record = null;

        if (resp === gResponse.OK)
            record = engGetParsedRecord(data);

        extCb(resp, record);
    }

    ajxSendCommand(cmd, intCb, hasqLogo);
}

function engNcRange(range, tok, db, extCb)
{
    var cmd = engGetSplitted('range', db, -range, -1, tok);

    var intCb = function (data)
    {
        var resp = engGetResponseHeader(data);
        var range = null;

        if (resp === gResponse.OK)
            range = engGetParsedRange(data);

        extCb(resp, range);
    }

    ajxSendCommand(cmd, intCb, hasqLogo);
}

function engNcRawCommand(cmd, extCb)
{
    var intCb = function (data)
    {
        extCb(engGetResponseHeader(data));
    }
    ajxSendCommand(cmd, intCb, hasqLogo);
}