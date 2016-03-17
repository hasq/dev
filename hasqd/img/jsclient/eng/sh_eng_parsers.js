// Hasq Technology Pty Ltd (C) 2013-2016

function engGetResp(data)
{
    // returns response header
    var resp = {};
    var tmp = data.replace(/\r|\s+$/g, '');
    var blocks = tmp.split(/\s/); // split by by \s (\s, \n, \t, \v);
    var lines = tmp.split(/\n/); // split by \n only;

    if (!tmp)
    {
        resp.msg = 'ERROR';
        resp.cnt = 'NO_OUTPUT';
		
        return resp;
    }

    if (lines[0] === 'OK')
    {
        resp.msg = 'OK';
        resp.cnt = 'OK';
    }
    else if (blocks[0] === 'OK')
    {
        resp.msg = 'OK';
        resp.cnt = 'OK';
    }
    else if (blocks[0] === 'IDX_NODN')
    {
        resp.msg = blocks[0];
        resp.cnt = blocks[0];
    }
    else if (
        blocks[0] === 'URF_BAD_FORMAT' ||
        blocks[0] === 'REQ_HASHTYPE_BAD' ||
        blocks[0] === 'REQ_MSG_HEAD' ||
        blocks[0] === 'REQ_DN_BAD' ||
        blocks[0] === 'REC_INIT_BAD_N' ||
        blocks[0] === 'REC_INIT_BAD_S' ||
        blocks[0] === 'REC_INIT_BAD_KGO'
		)
    {
        resp.msg = 'ERROR';
        resp.cnt = tmp;
    }
    else
    {
        resp.msg = 'ERROR';
        resp.cnt = tmp;
    }
    return resp;
}

function engGetRespInfoDb(data)
{
    // returns parsed 'info db' response
    var db = [];
    var err = {};
    var rawDb = data.replace(/^OK/g, '').replace(/^\s+|\r|\s+$/g, '').replace(/{\n|}+$/g, '').split(/}\n/);

    if (!rawDb)
    {
        err.msg = 'ERROR';
        err.cnt = data;
        return err;
    }

    for (var i = 0; i < rawDb.length; i++)
    {
        db[i] = {};
        var traitLines = {};

        traitLines[i] = rawDb[i].split(/\n/);

        var lines = traitLines[i];
		
        for (var j = 0; j < (lines.length - 1); j++)
        {
            var parts = lines[j].split('=');

            switch (parts[0])
            {
            case 'name':
                db[i].name = parts[1];
                break;
            case 'hash':
                db[i].hash = parts[1];
                break;
                /*
                case 'rawS':
                db[i].r = parts[1];
                break;
                 */
            case 'nG':
                db[i].ng = parts[1];
                break;
            case 'magic':
                db[i].magic = parts[1].replace(/\[|\]/g, '');
                break;
            case 'size':
                db[i].size = parts[1];
                break;
            case 'thin':
                db[i].thin = parts[1];
                break;
            case 'datalimit':
                db[i].datalim = parts[1];
                break;
            case 'altname':
                db[i].altname = parts[1];
                break;
            default:
                break;
            }
        }
    }
    return db;
}

function engGetRespLast(data)
{
    // returns parsed 'last' response
    var rec = {};
    var err = {};
    var parts = data.replace(/^OK/g, '').replace(/^\s|\r|\s+$/g, '').split(/\s/);

    if ( parts.length < 5 )
    {
        err.msg = 'ERROR';
        err.cnt = parts;
		
        return err;
    }
    
	if ( parts.length == 5 )
    {
        rec.n = +parts[0];
        rec.s = parts[1];
        rec.k = parts[2];
        rec.g = parts[3];
        rec.o = parts[4];
        rec.d = '';
    }
    else if ( parts.length > 5 )
    {
        rec.n = +parts[0];
        rec.s = parts[1];
        rec.k = parts[2];
        rec.g = parts[3];
        rec.o = parts[4];
        var d = [];
		
        for (var i = 5; i < parts.length; i++)
            d[d.length] = parts[i];

        rec.d = d.join(' ');
    }

    return rec;
}

function engGetNewRecord(n, s, p0, p1, p2, m, h)
{
    // generates new record
    var rec = {};
    var n0 = +n;
    var n1 = +n + 1;
    var n2 = +n + 2;
    var k0 = engGetKey(n0, s, p0, m, h);

    if ( p1 == null || p2 == null )
    {
        var k1 = engGetKey(n1, s, p0, m, h);
        var k2 = engGetKey(n2, s, p0, m, h);
    }
    else
    {
        var k1 = engGetKey(n1, s, p1, m, h);
        var k2 = engGetKey(n2, s, p2, m, h);
    }

    var g0 = engGetKey(n1, s, k1, m, h);
    var g1 = engGetKey(n2, s, k2, m, h);
    var o0 = engGetKey(n1, s, g1, m, h);

    rec.n = n0;
    rec.s = s;
    rec.k = k0;
    rec.g = g0;
    rec.o = o0;

    return rec;
}

function engGetKey(n, s, p, m, h)
{
    var rawKey = (m) ? ( n + ' ' + s + ' ' + p + ' ' + m ) : ( n + ' ' + s + ' ' + p );

    return engGetHash(rawKey, h); ;
}

function engIsHash(data, h)
{
    //checks string is hash or not hash
    var notHex = /[^0-9a-f]/g;
	var l;
	
    switch (h)
    {
    case 'md5':
        l = 32;
        break;
    case 'r16':
        l = 40;
        break;
    case 's22':
        l = 64;
        break;
    case 's25':
        l = 128;
        break;
    case 'wrd':
        l = 4;
        break;
    case 'smd':
        l = 32;
        break;
    default:
		return false;
    }

    if (data.length != l || /[^0-9a-f]/g.test(data)) //mismatched length or not not hex chars contents
		return false;
    else
        return true;
}

function engGetHash(data, h)
{
    //returns specified hash of 'data'
    switch (h)
    {
    case 'wrd':
        return hex_md5(data).substring(0, 4);
    case 'md5':
        return hex_md5(data);
    case 'r16':
        return hex_rmd160(data);
    case 's22':
        return hex_sha256(data);
    case 's25':
        return hex_sha512(data);
    case 'smd':
        return hex_smd(data);
    default:
        break;
    }
	
    return null;
}

function engGetTokensStatus(lr, nr)
{
    if (!lr) // returns current matching of password
        return false;
    
    if ( lr.g === nr.g && lr.o === nr.o ) // Tokens keys is fully matched with a password
        return 'OK';
    
    if ( lr.g === nr.g ) // Token is in a sending process
        return 'PWD_SNDNG';
    
    if ( lr.o === nr.o ) // Token is in a receiving process
        return 'PWD_RCVNG';
    
    return 'PWD_WRONG';// Tokens keys is not matched with a password
}

function engGetDataValToDisplay(data)
{
    // returns parsed data for displaying
    var r = data || '';
    
    var LF = '\u000a'; //unicode line-feed
    var space = '\u0020';
    var backslash = '\u005c';
    var n = '\u006e';

    for (var i = 0; i < r.length; i++) 
    { // replaces all not escaped '\n' by LF;
        if (r[i - 1] !== backslash && r[i] === backslash && r[i + 1] === n) 
            r = r.substring(0, i) + LF + r.substr(i + 2);
    }

    r = r.replace(/(\u0020\u005c)(?=\u0020)/g,'\u0020'); //replaces all double spaces by " \ ";
    r = r.replace(/(\u005c\u005c)(?!(\u006e))/g,'\u005c'); //replaces all double backslash by single;

    
    return r;

}

function engGetDataValToRecord(data)
{   // returns parsed data for add into record
    var r = data || '';
    
    var LF = '\u000a'; //unicode line-feed
    var space = '\u0020';
    var backslash = '\u005c';
    var n = '\u006e';   
    
    r = r.replace(/\u005c(?!\u006e|(\u005c\u006e))/mg,'\u005c\u005c'); //replace all "\" by "\\" if is not located in front of "n" or "\n";
    r = r.replace(/(\u0020(?=\u0020))/g,'\u0020\u005c'); //replace all double spaces by " \ ";
    r = r.replace(/\u000a/g,'\u005c\u006e'); // 'LF' > '\n';
    
    return r;
}

function engIsTransKeys(keys)
{
    if (!keys)
        return false;
    
    if (keys.replace(/\s/g, '') !== engGetOnlyHex(keys.replace(/\s/g, '')))
        return false; // checks for non hex chars;

    keys = keys.replace(/\s{2,}/g, '\u0020').replace(/^\s+|\s+$/, '').split(/\s/); // remove extra spaces and split
    var prCode = keys.splice(keys.length - 1, 1)[0]; //get protocol line;
    var prCode0Ch = prCode.charAt(0);
    
    // checks protocol code for record number exists into the transkeys;
    if (prCode0Ch !== '1' && prCode0Ch !== '2')
        return false;

    var isRecNum = (prCode0Ch == '1') ?  true :  false;
    
    //checks match of a protocol code and quantity of transkeys elements;
    var keysLen;
    var prCodeLen = prCode.length;
    
    if (prCodeLen < 3 || prCodeLen > 6)
        return false;
    
    if (prCodeLen == 3 || prCodeLen == 4)
        keysLen = (isRecNum) ? 3 : 2;
    
    if (prCodeLen == 5 || prCodeLen == 6)
        keysLen = (isRecNum) ? 4 : 3;

    //if exists CRC extract it and compare with calculated CRC
    //if exists db name it will be used like lengths template
    var prCRC = '';
    var tkCRC = '';
    var tmpl = '';

    if (keys[keys.length - 1].length == 4)
    {
        prCRC = keys.splice(keys.length - 1, 1)[0]; //extracts CRC;
        tkCRC = engGetHash(keys.join('').replace(/\s/g, ''), 's22').substring(0, 4); //calculates CRC
    }
    else if (keys[keys.length - 2].length == 4)
    {
        prCRC = keys.splice(keys.length - 2, 1)[0]; //extracts CRC;
        tmpl = keys.splice(keys.length - 1, 1)[0].length; //extracts DB name;
        tkCRC = engGetHash(keys.join('').replace(/\s/g, ''), 's22').substring(0, 4); //calculates CRC
    }
    
    if (prCRC !== tkCRC)
        return false; //checks CRC
    
    if (keys.length < keysLen)
        return false;
    
    if (tmpl.length == 0)
    {
        var mod = keys.length % keysLen;

        if (mod !== 0 && mod !== 1)
            return false;

        tmpl = (mod == 0) ? keys[keys.length - 1].length : keys.splice(keys.length - 1, 1)[0].length; //extracts DB name;
    }

    if (isRecNum)
    { //removes all records number, leaves only keys;
        for (var i = 0; i < keys.length; i = i + keysLen)
        {
            if (!engIsNumber(keys[i]))
                return false;
            
            keys.splice(i, 1);
            i--;
        }
    }

    tmpl = (tmpl > 0) ? tmpl : keys[0].length;

    for (var i = 0; i < keys.length; i++)
    {
        if (tmpl !== keys[i].length)
            return false; //checks coincidence of the keys length and template length
    }

    return true;
}

function engGetTransKeys(keys)
{
    var prK1K2 = '23132';
	var prG2O2 = '24252';
    var prG1O1 = '24151';
    var prK1G1 = '23141';
    var prK1 = '231';
    var prO1 = '251';
	var prK2 = '232';

    keys = keys.replace(/\s{2,}/g, '\u0020').replace(/^\s+|\s+$/, '').split(/\s/); // remove extra spaces and split
    var prCode = keys.splice(keys.length - 1, 1)[0]; //get protocol line;
    var isRecNum,
    keysLen;
    var prCode0Ch = prCode.charAt(0);
    var prCodeLen = prCode.length;
    var isRecNum = (prCode0Ch == '1') ? true : false; // checks protocol code for record number exists into the transkeys;

    if (prCodeLen == 3 || prCodeLen == 4)     //checks match of a protocol code and quantity of transkeys elements;
        keysLen = (isRecNum) ? 3 : 2;
    
    if (prCodeLen == 5 || prCodeLen == 6)     //checks match of a protocol code and quantity of transkeys elements;
        keysLen = (isRecNum) ? 4 : 3;

    if (keys[keys.length - 1].length == 4)
    {
        keys.splice(keys.length - 1, 1)[0]; //extracts CRC;
    }
    else if (keys[keys.length - 2].length == 4)
    {
        keys.splice(keys.length - 2, 1)[0]; //extracts CRC;
        keys.splice(keys.length - 1, 1)[0].length; //extracts DB name;
    }

    if (keys.length % keysLen == 1)
        keys.splice(keys.length - 1, 1)[0].length;

    prK1K2 = (isRecNum) ? prCode0Ch + prK1K2 : prK1K2;
    prG2O2 = (isRecNum) ? prCode0Ch + prG2O2 : prG2O2;
	prG1O1 = (isRecNum) ? prCode0Ch + prG1O1 : prG1O1;
    prK1G1 = (isRecNum) ? prCode0Ch + prK1G1 : prK1G1;
    prK1 = (isRecNum) ? prCode0Ch + prK1 : prK1;
    prO1 = (isRecNum) ? prCode0Ch + prO1 : prO1;
	prK2 = (isRecNum) ? prCode0Ch + prK2 : prK2;

    var keysQty = keys.length / keysLen;
    var transKeys = [];
	
    for (var i = 0; i < keysQty; i++)
    {

        var tmpKeys = keys.splice(0, keysLen);
        transKeys[i] = {};
        transKeys[i].prcode = prCode;
        transKeys[i].n = (isRecNum) ? transKeys[i].n = +tmpKeys[0] : transKeys[i].n = -1; // if protocol not includes numbers n = -1;
        transKeys[i].s = (isRecNum) ? tmpKeys[1] : tmpKeys[0];

        switch (prCode)
        {
        case (prK1K2):
            transKeys[i].k1 = (isRecNum) ? tmpKeys[2] : tmpKeys[1];
            transKeys[i].k2 = (isRecNum) ? tmpKeys[3] : tmpKeys[2];
			
            break;
        case (prG2O2):
            transKeys[i].g2 = (isRecNum) ? tmpKeys[2] : tmpKeys[1];
            transKeys[i].o2 = (isRecNum) ? tmpKeys[3] : tmpKeys[2];
			
            break;
        case (prG1O1):
            transKeys[i].g1 = (isRecNum) ? tmpKeys[2] : tmpKeys[1];
            transKeys[i].o1 = (isRecNum) ? tmpKeys[3] : tmpKeys[2];
			
            break;			
        case (prK1G1):
            transKeys[i].k1 = (isRecNum) ? tmpKeys[2] : tmpKeys[1];
            transKeys[i].g1 = (isRecNum) ? tmpKeys[3] : tmpKeys[2];
			
            break;
        case (prK1):
            transKeys[i].k1 = (isRecNum) ? tmpKeys[2] : tmpKeys[1];
			
            break;
        case (prO1):
            transKeys[i].o1 = (isRecNum) ? tmpKeys[2] : tmpKeys[1];
			
            break;
        case (prK2):
            transKeys[i].k2 = (isRecNum) ? tmpKeys[2] : tmpKeys[1];
			
            break;			
        default:
            return false;
        }

    }
	
    transKeys.sort(engSortByProperties('s'));

    for (var i = 0; i < transKeys.length - 1; i++)   // if presents keys for same token;
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
    var prK1K2 = '23132'; //simple send;
	var prG2O2 = '24252'; // simple request;
    var prK1G1 = '23141'; // blocking send, st1;
    var prK1 = '231'; // blocking send, st2;
	var prO1 = '251'; // blocking request, st1;
	var prG1O1 = '24151'; //blocking request, st2;
	var prK2 = '232'; // blocking receive revert;

    var prCode = titleKeys[0].prcode; // get protocol key from first element;
    var prCode0Ch = prCode.charAt(0);
    var isRecNum = (prCode0Ch == '1') ? true : false; // if protocol have record numbers;

    prK1K2 = (isRecNum) ? prCode0Ch + prK1K2 : prK1K2;
    prK1G1 = (isRecNum) ? prCode0Ch + prK1G1 : prK1G1;
    prK1 = (isRecNum) ? prCode0Ch + prK1 : prK1;
    prG2O2 = (isRecNum) ? prCode0Ch + prG2O2 : prG2O2;
	prG1O1 = (isRecNum) ? prCode0Ch + prG1O1 : prG1O1;
    prO1 = (isRecNum) ? prCode0Ch + prO1 : prO1;
	prK2 = (isRecNum) ? prCode0Ch + prK2 : prK2;

    for (var i = 0; i < titleKeys.length; i++)
    {
        var n = titleKeys[i].n;
        var s = titleKeys[i].s;
        var n1 = n + 1;
        var n2 = n + 2;
        var n3 = n + 3;
        var n4 = n + 4;
		var k1, k2, k3, k4, g1, g2, g3, o1;
		
        switch (titleKeys[0].prcode)
        {
        case prK1K2:
            k2 = titleKeys[i].k2; //
            titleKeys[i].g1 = engGetKey(n2, titleKeys[i].s, k2, m, h); //
            k3 = engGetKey(n3, s, p, m, h);
            g2 = titleKeys[i].g2 = engGetKey(n3, s, k3, m, h); //
            titleKeys[i].o1 = engGetKey(n2, s, g2, m, h); //
            k4 = engGetKey(n4, s, p, m, h);
            g3 = engGetKey(n4, s, k4, m, h);
            titleKeys[i].o2 = engGetKey(n3, s, g3, m, h); //
			
            break;
        case prG2O2:
            titleKeys[i].n1 = n1; //
            titleKeys[i].n2 = n2; //
            g2 = titleKeys[i].g2; //
            titleKeys[i].k1 = engGetKey(n1, s, p, m, h); //
            k2 = titleKeys[i].k2 = engGetKey(n2, s, p, m, h); //
            titleKeys[i].g1 = engGetKey(n2, s, k2, m, h); //
            titleKeys[i].o1 = engGetKey(n2, s, g2, m, h); //
			
            break;
        case prK1G1:
            k3 = engGetKey(n3, s, p, m, h);
            g2 = engGetKey(n3, s, k3, m, h);
            titleKeys[i].o1 = engGetKey(n2, s, g2, m, h); //
			
            break;
        case prK1:
            k2 = engGetKey(n2, s, p, m, h);
            k3 = engGetKey(n3, s, p, m, h);
            g2 = engGetKey(n3, s, k3, m, h);
            titleKeys[i].g1 = engGetKey(n2, s, k2, m, h); //
            titleKeys[i].o1 = engGetKey(n2, s, g2, m, h); //
			
            break;
        case prO1:
            titleKeys[i].n1 = n1;
            titleKeys[i].k1 = engGetKey(titleKeys[i].n1, s, p, m, h); //
            k2 = engGetKey(n2, s, p, m, h);
            titleKeys[i].g1 = engGetKey(n2, s, k2, m, h); //
            titleKeys[i].o1; //
			
            break;
        case prG1O1:
            titleKeys[i].n1 = n1; //
            titleKeys[i].k1 = engGetKey(n1, s, p, m, h); //

            break;			
        case prK2:
            titleKeys[i].n1 = n1;
			titleKeys[i].n2 = n2;
            titleKeys[i].k1 = engGetKey(n1, s, p, m, h); //
            titleKeys[i].g1 = engGetKey(n2, s, titleKeys[i].k2, m, h);
			var k3 = engGetKey(n3, s, p, m, h);
			titleKeys[i].g2 = engGetKey(n3, s, k3, m, h);
			titleKeys[i].o1 = engGetKey(n2, s, titleKeys[i].g2, m, h); //
			var k4 = engGetKey(n4, s, p, m, h);
			var g3 = engGetKey(n4, s, k4, m, h);
			titleKeys[i].o2 = engGetKey(n3, s, g3, m, h);

            break;			
        default:
            break;
        }
    }
    return titleKeys;
}

function engGetMergedTokensList(hashList, rawList, hash)
{
    // returns merged names from both lists transkeys and tokens;
    for (var k = 0; k < hashList.length; k++)
    {
        for (var t = 0; t < rawList.length; t++)
        {
            if (hashList[k] == engGetHash(rawList[t], hash))
            {
                var rawName = '[' + rawList[t] + ']';
                hashList[k] = rawName;
                rawList.splice(t, 1);
                t--;
				
                break;
            }
            else if (hashList[k] == rawList[t])
            {
                rawList.splice(t, 1);
                t--;
            }
        }
    }
    return hashList;
}

function engGetOnlyHex(data)
{
    return data.replace(/[^0-9a-f]/g, '');
}

function engSortByProperties(prop)
{
    return function (a, b)
    {
        return ((a[prop] < b[prop]) ? -1 : ((a[prop] > b[prop]) ? 1 : 0))
    }
}

function engGetHashedTokensList(list)
{
    // returns hashed token names;
    var r = [];

    for (var i = 0; i < list.length; i++)
    {
        r[i] = list[i].s;
    }

    return r;
}

function engIsNumber(num)
{
    return !/[^0-9]/.test(num)
}
