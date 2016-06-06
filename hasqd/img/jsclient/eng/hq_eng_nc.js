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

    return ajxSendCommand(cmd, intCb, hasqLogo);
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

    return ajxSendCommand(cmd, intCb, hasqLogo);
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

    return ajxSendCommand(cmd, intCb, hasqLogo);
}
