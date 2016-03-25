// Hasq Technology Pty Ltd (C) 2013-2016

function engGetRespInfoId(data)
{
    // returns response header
    var err = {};
    var infoId = data.replace(/^OK/g,'').replace(/^\s+|\r|\s+$/g, '');
 var lines = infoId.split(/\n/);

    if (lines.length < 5)
    {
        err.msg = 'ERROR';
        err.cnt = 'NO_OUTPUT';
        return err;
    }

    return infoId;
}

function engGetRespInfoSys(data)
{
    var err = {};
    var infoSys = data.replace(/^OK/g,'').replace(/^\s+|\r|\s+$/g, '');
 var lines = infoSys.split(/\n/);

    if (lines.length < 5)
    {
        err.msg = 'ERROR';
        err.cnt = 'NO_OUTPUT';
        return err;
    }

    return infoSys;
}

function engGetRespRange(data)
{
    var err = {};
    var range = data.replace(/^OK/g,'').replace(/^\s+|\r|\s+$/g, '');

    if (range.length == 0)
    {
        err.msg = 'ERROR';
        err.cnt = range;
        return err;
    }

    return range;
}

function engGetRespInfoFam(data)
{
    var err = {};
    list = [];


    var infoFam = data.replace(/^OK/g,'').replace(/^\s+|\r|\s+$/g, '');
    if (infoFam.length == 0) return list;

 var lines = rawFamData.split(/\n/);

    for (var i = 0; i < lines.length; i++)
    {
        var parts = lines[i].split(/\s/);
        if (parts.length != 5) break;

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
    return (data === null) ? true : false;
}

function engIsRawTokens(data, hash)
{
    var n = data;
    n = n.replace(/^\s+|\s+$/g, ''); // remove all space-like symbols from the start and end of the string
    n = n.split(/\s/);
    for (var i = 0; i < n.length; i++)
    {
        n[i] = n[i].replace(/^\s+|\s+$/g, '');
        if ((n[i].length == 0) || (n[i] === undefined) || (n[i] === null))
        {
            true;
        }
        else if (n[i].charAt(0) == '[' && n[i].charAt(n[i].length - 1) == ']' && n[i].length > 2)
        {
            if (/\[|\]/.test(n[i].substring(1, n[i].length - 1))) {
            return false;
        }
        else
        {
            true;
        }
    } else if (engIsHash(n[i], hash))
    {
        true;
    }
    else
    {
        return false;
    }
}
return true;
}

function engGetOrderedTokens(tok)
{
 // sorts tokens list by names and hashes;

    tok.sort(engSortByProperties('s'));

    for (var i = 0; i < tok.length - 1; i++)
    {
        if (tok[i].s == tok[i + 1].s && tok[i].r == tok[i + 1].r)
        {
            tok.splice(i + 1, 1);
            i--;
        }
        else if (tok[i].s == tok[i + 1].s && tok[i].r != tok[i + 1].r && tok[i].r == '')
        {
            tok[i].r = tok[i + 1].r;
            tok.splice(i + 1, 1);
            i--;
        }
        else if (tok[i].s == tok[i + 1].s && tok[i].r != tok[i + 1].r && tok[i + 1].r == '')
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
    rawTok = rawTok.replace(/^\s+|\s+$/g, '').split(/\s/);; // remove all space-like symbols from the start and end of the string

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
            tok[l].r = rawTok[i].slice(1, -1);
            tok[l].s = engGetHash(tok[l].r, hash);
        }
        else if (engIsHash(rawTok[i], hash))
        {
            var l = tok.length;
            tok[l] = {};
            tok[l].r = '';
            tok[l].s = rawTok[i];
        }
    }

    return engGetOrderedTokens(tok);
}

function engGetRawTokensList(data)
{
 // if exists raw token names returns its otherwise hash;
    var r = [];

    for (var i = 0; i < data.length; i++)
    {
        r[i] = (data[i].r != '') ? data[i].r : data[i].s;
    }

    return r;
}

function engGetUpgradedTransKeys(transKeys, list)
{
    for (var i = 0; i < transKeys.length; i++)
    {
        transKeys[i].n = list[i].n;
    }
    return transKeys;
}

function engGetTransKeys(rawKeys)
{
    var prK1K2 = '23132';
    var prG2O2 = '24252';
    var prK1G1 = '23141';
    var prK2 = '232';
    var prO1 = '251';

    var transKeys = [];

    var keys = rawKeys.replace(/^\s+|\s+$/g, '').split(/\n/); //split by linefeed;
    var prLine = keys.splice(keys.length - 1, 1)[0].split(/\s/); //get last (protocol) line and split by spaces;
    var prCode = prLine[prLine.length - 1]; // get protocol key;
    var numFlag = prCode.charAt(0);
    var dbFlag = (prCode.charAt(prCode.length - 1) == '0') ? '0' : '';
    var coef = (numFlag == '0') ? 1 : 0; // if protocol have record numbers;

    prK1K2 = numFlag + prK1K2 + dbFlag;
    prG2O2 = numFlag + prG2O2 + dbFlag;
    prK1G1 = numFlag + prK1G1 + dbFlag;
    prK2 = numFlag + prK2 + dbFlag;
    prO1 = numFlag + prO1 + dbFlag;

    for (var i = 0; i < keys.length; i++)
    {
        /*      FIXME what is this code?
                                        keys[i] = keys[i].replace(/^\s+|\s+$/, '');
                if ((keys[i] === undefined) || (keys[i] === null) || (keys[i].length == 0))
        {
                    keys.splice(i, 1);
                    i--;
                    break;
                }
        */
        var el = keys[i].split(/\s/);

        transKeys[i] = {};
        transKeys[i].prcode = prCode;
        transKeys[i].n = (coef == 1) ? transKeys[i].n = -1 : transKeys[i].n = +el[0];// if protocol have record numbers n = -1;
        transKeys[i].s = el[1 - coef];

        switch (prCode)
        {
            case (prK1K2):
                transKeys[i].k1 = el[2 - coef];
                transKeys[i].k2 = el[3 - coef];
                break;
            case (prG2O2):
                transKeys[i].g2 = el[2 - coef];
                transKeys[i].o2 = el[3 - coef];
                break;
            case (prK1G1):
                transKeys[i].k1 = el[2 - coef];
                transKeys[i].g1 = el[3 - coef];
                break;
            case (prK2):
                transKeys[i].k2 = el[2 - coef];
                break;
            case (prO1):
                transKeys[i].o1 = el[2 - coef];
                break;
            default:
                    break;
        }
    }

    transKeys.sort(engSortByProperties('s'));

    // if presents keys for same token;
    for (var i = 0; i < transKeys.length - 1; i++)
    {
        if (transKeys[i].s == transKeys[i + 1].s)
        {
            transKeys.splice(i + 1, 1);
            i--;
        }
    }

    return transKeys;
}

function engGetTitleKeys(transKeys, p, h, m)
{
    var titleKeys = transKeys;
    var prK1K2 = '23132';
    var prG2O2 = '24252';
    var prK1G1 = '23141';
    var prK2 = '232';
    var prO1 = '251';

    var prCode = transKeys[0].prcode; // get protocol key from first element;
    var numFlag = prCode.charAt(0);
    var dbFlag = (prCode.charAt(prCode.length - 1) == '0') ? '0' : '';
    var coef = (numFlag == '0') ? 1 : 0; // if protocol have record numbers;

    prK1K2 = numFlag + prK1K2 + dbFlag;
    prG2O2 = numFlag + prG2O2 + dbFlag;
    prK1G1 = numFlag + prK1G1 + dbFlag;
    prK2 = numFlag + prK2 + dbFlag;
    prO1 = numFlag + prO1 + dbFlag;

    for (var i = 0; i < titleKeys.length; i++)
    {
        var n = titleKeys[i].n;
        var s = titleKeys[i].s;
        var n1 = n + 1;
        var n2 = n + 2;
        var n3 = n + 3;
        var n4 = n + 4;

        switch (titleKeys[0].prcode)
        {
            case prK1K2:
                var k2 = titleKeys[i].k2; //
                titleKeys[i].g1 = engGetKey(n2, titleKeys[i].s, k2, m, h); //
                var k3 = engGetKey(n3, s, p, m, h);
            var g2 = titleKeys[i].g2 = engGetKey(n3, s, k3, m, h); //
                titleKeys[i].o1 = engGetKey(n2, s, g2, m, h); //
                var k4 = engGetKey(n4, s, p, m, h);
                var g3 = engGetKey(n4, s, k4, m, h);
                titleKeys[i].o2 = engGetKey(n3, s, g3, m, h); //
                break;
            case prG2O2:
                titleKeys[i].n1 = n1; //
                titleKeys[i].n2 = n2; //
                var g2 = titleKeys[i].g2; //
                titleKeys[i].k1 = engGetKey(n1, s, p, m, h); //
                var k2 = titleKeys[i].k2 = engGetKey(n2, s, p, m, h); //
                titleKeys[i].g1 = engGetKey(n2, s, k2, m, h); //
                titleKeys[i].o1 = engGetKey(n2, s, g2, m, h); //
                break;
            case prK1G1:
                var k3 = engGetKey(n3, s, p, m, h);
                var g2 = engGetKey(n3, s, k3, m, h);
                titleKeys[i].o1 = engGetKey(n2, s, g2, m, h); //
                break;
            case prK2:
                var k3 = engGetKey(n3, s, p, m, h);
                var k4 = engGetKey(n4, s, p, m, h);
                var g3 = engGetKey(n4, s, k4, m, h);
                titleKeys[i].g2 = engGetKey(n3, s, k3, m, h); //
                titleKeys[i].o2 = engGetKey(n3, s, g3, m, h); //
                break;
            case prO1:
                titleKeys[i].n1 = n + 1;
                titleKeys[i].k1 = engGetKey(titleKeys[i].n1, s, p, m, h); //
                var k2 = engGetKey(n2, s, p, m, h);
                titleKeys[i].g1 = engGetKey(n2, s, k2, m, h); //
                titleKeys[i].o1; //
                break;
            default:
                    break;
        }
    }
    return titleKeys;
}
