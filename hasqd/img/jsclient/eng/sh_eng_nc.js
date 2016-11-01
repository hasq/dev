function engNcInfoDb(extCb)
{
    var cmd = 'info db';

    var intCb = function (data)
    {
        var resp = engGetResponseHeader(data);
        var db = [];

        if (resp === HASQD_RESP.OK) {
            db = engGetParsedInfoDb(data);
        }

        extCb(resp, db);
    }

    return ajxSendCommand(cmd, intCb, hasqLogo);
}
