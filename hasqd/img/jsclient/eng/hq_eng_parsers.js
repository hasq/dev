// Hasq Technology Pty Ltd (C) 2013-2016

function engGetParsedInfoId(data)
{
    // returns response header
    var infoId = data.replace(/^OK/g, '').replace(/^\s+|\r|\s+$/g, '');
    var lines = infoId.split(/\n/);

    if (lines.length < 5)
        return null;

    return infoId;
}

function engGetParsedInfoSys(data)
{
    var infoSys = data.replace(/^OK/g, '').replace(/^\s+|\r|\s+$/g, '');
    var lines = infoSys.split(/\n/);

    if (lines.length < 5)
        return null;

    return infoSys;
}

function engGetParsedRange(data)
{
    var range = data.replace(/^OK/g, '').replace(/^\s+|\r|\s+$/g, '');

    if (!range)
        return null;

    return range;
}

function engGetParsedInfoFam(data)
{
    var list = [];

    var infoFam = data.replace(/^OK/g, '').replace(/^\s+|\r|\s+$/g, '');

    if (infoFam.length === 0)
        return list;

    var lines = rawFamData.split(/\n/);

    for (var i = 0; i < lines.length; i++)
    {
        var parts = lines[i].split(/\s/);

        if (parts.length != 5)
            return null;

        list[i] = {};
        list[i].name = parts[0];
        list[i].link = parts[1];
        list[i].neighbor = (parts[2] == 'N');
        list[i].alive = (parts[3] == 'A');
        list[i].unlock = (parts[4] == 'U');
    }

    return list;
}

function engGetOnlyNumber(data)
{
    return (data.replace(/[^0-9]/g, '').length > 0) ? +data.replace(/[^0-9]/g, '') : '';
}

function engIsNull(data)
{
    return (typeof(data) === 'null') ? true : false;
}

function engIsRawTokens(data, hash)
{
    var n = data;

    // remove all space-like symbols from the start and end of the string
    n = n.replace(/^\s+|\s+$/g, '');

    n = n.split(/\s/);
    for (var i = 0; i < n.length; i++)
    {
        n[i] = n[i].replace(/^\s+|\s+$/g, '');
        if ((n[i].length == 0) || (n[i] === undefined) || (n[i] === null))
            true;
        else if (n[i].charAt(0) == '[' && n[i].charAt(n[i].length - 1) == ']' && n[i].length > 2)
        {
            if (/\[|\]/.test(n[i].substring(1, n[i].length - 1)))
            return false;
            else
                true;
        }
        else if (engIsHash(n[i], hash))
            true;
        else
            return false;
    }

    return true;
}

function engGetOrderedTokens(tok)
{
    // sorts tokens list by names and hashes;

    tok.sort(engSortByProperties('s'));

    for (var i = 0; i < tok.length - 1; i++)
    {
        if (tok[i].s == tok[i + 1].s && tok[i].raw == tok[i + 1].raw)
        {
            tok.splice(i + 1, 1);
            i--;
        }
        else if (tok[i].s == tok[i + 1].s && tok[i].raw != tok[i + 1].raw && tok[i].raw == '')
        {
            tok[i].raw = tok[i + 1].raw;
            tok.splice(i + 1, 1);
            i--;
        }
        else if (tok[i].s == tok[i + 1].s && tok[i].raw != tok[i + 1].raw && tok[i + 1].raw == '')
        {
            tok.splice(i + 1, 1);
            i--;
        }
    }
    return tok;
}

function engGetTokens(rawTok, hash)
{
    // returns parsed tokens list with names and hashes;
    var tok = [];
    rawTok = rawTok.replace(/^\s+|\s+$/g, '').split(/\s/); ; // remove all space-like symbols from the start and end of the string

    for (var i = 0; i < rawTok.length; i++)
    {
        rawTok[i] = rawTok[i].replace(/^\s+|\s+$/g, '');
        if ((rawTok[i].length == 0) || (rawTok[i] === undefined) || (rawTok[i] === null))
        {
            rawTok.splice(i, 1);
            i--;
        }
        else if (rawTok[i].charAt(0) == '[' && rawTok[i].charAt(rawTok[i].length - 1) == ']' && rawTok[i].length > 2)
        {
            var l = tok.length;
            tok[l] = {};
            tok[l].raw = rawTok[i].slice(1, -1);
            tok[l].s = engGetHash(tok[l].raw, hash);
        }
        else if (engIsHash(rawTok[i], hash))
        {
            var l = tok.length;
            tok[l] = {};
            tok[l].raw = '';
            tok[l].s = rawTok[i];
        }
    }

    return engGetOrderedTokens(tok);
}

function engGetRawList(data)
{
    // if exists raw token names returns its otherwise hash;
    var r = [];

    for (var i = 0; i < data.length; i++)
        r[i] = (data[i].raw != '') ? data[i].raw : data[i].s;

    return r;
}
