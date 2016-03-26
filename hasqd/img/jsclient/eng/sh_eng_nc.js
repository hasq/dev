// Hasq Technology Pty Ltd (C) 2013-2016

function engNcDeferredLast(cb, tok, delay)
{
    var cmd = 'last' + '\u0020' + glCurrentDB.name + '\u0020' + tok;

    var cb2 = function (data)
    {
        var resp = engGetResp(data);
        var record = null;

	// if( resp is valid ) FIXME
	record = engGetRespLast(data);

        cb(resp, record);
    }

    return engSendDeferredRequest(cmd, cb2, delay);
}

