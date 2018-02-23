// Hasq Technology Pty Ltd (C) 2013-2016

// Hasq Technology Pty Ltd (C) 2013-2016

'use strict';

// returns response header
function engGetResponseHeader(data) {
    var resp = null;
    var msg = data.replace(/^\s+|\r|\s+$/g, '');
    var blocks = msg.split(/\s/);
    var lines = msg.split(/\n/);

    if (lines[0] === 'OK') {
        resp = 'OK';
    } else if (blocks[0] === 'OK' ||
            blocks[0] === 'IDX_NODN' ||
            blocks[0] === 'JOB_QUEUED') {
        resp = blocks[0];
    } else {
        resp = msg;
    }

    return resp;
}

function engGetParsedJobId(data) {
    var blocks;

    if (!data) {
        return null;
    }

    blocks = data
        .replace(/\r|\s+$/g, '')
        .split(/\s/);

    return (blocks.length === 2 &&
            blocks[0] === 'OK' &&
            Boolean(Number(blocks[1])))
        ? Number(blocks[1])
        : null;
}

// returns parsed 'info db' response
function engGetParsedInfoDb(data) {
    var db = [];
    var rawDb = data
        .replace(/^OK/g, '')
        .replace(/^\s+|\r|\s+$/g, '')
        .replace(/{\n|}+$/g, '')
        .split(/}\n/);

    if (!rawDb)
        return [];

    for (let i = 0; i < rawDb.length; i++) {
        let traitLines = {};
        let lines;

        db[i] = {};
        traitLines[i] = rawDb[i].split(/\n/);
        lines = traitLines[i];

        for (let j = 0; j < (lines.length - 1); j++) {
            let parts = lines[j].split('=');

            switch (parts[0]) {
                case 'name':
                    db[i].name = parts[1];
                    break;
                case 'hash':
                    db[i].hash = parts[1];
                    break;
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
                case 'description':
                    db[i].description = parts[1];
                    break;
                default:
                    return [];
            }
        }
    }

    return db;
}

function engGetParsedRecord(data) { // returns parsed 'last' response
    var rec = {};
    var parts;

    if (!data) {
        return null;
    }

    parts = data
        .replace(/^OK/g, '')
        .replace(/^\s|\r|\s+$/g, '')
        .split(/\s/);

    if (parts.length < 5) {
        return null;
    }

    rec.n = +parts[0];
    rec.s = parts[1];
    rec.k = parts[2];
    rec.g = parts[3];
    rec.o = parts[4];
    rec.d = '';

    if (parts.length > 5) {
        let d = [];

        for (let i = 5; i < parts.length; i++) {
            d[d.length] = parts[i];
        }

        rec.d = d.join(' ');
    }

    return rec;
}

// generates new record
function engGetRecord(n, s, p0, p1, p2, m, h) {
    var rec = {};
    var n0 = +n;
    var n1 = +n + 1;
    var n2 = +n + 2;
    var k0 = engGetKey(n0, s, p0, m, h);
    var k1;
    var k2;
    var g0;
    var g1;
    var o0;

    if (p1 == null || p2 == null) {
        k1 = engGetKey(n1, s, p0, m, h);
        k2 = engGetKey(n2, s, p0, m, h);
    } else {
        k1 = engGetKey(n1, s, p1, m, h);
        k2 = engGetKey(n2, s, p2, m, h);
    }

    g0 = engGetKey(n1, s, k1, m, h);
    g1 = engGetKey(n2, s, k2, m, h);
    o0 = engGetKey(n1, s, g1, m, h);

    rec.n = n0;
    rec.s = s;
    rec.k = k0;
    rec.g = g0;
    rec.o = o0;

    return rec;
}

function engGetKey(n, s, p, m, h) {
    var rawKey = (m)
        ? (n + ' ' + s + ' ' + p + ' ' + m)
        : (n + ' ' + s + ' ' + p);

    return engGetHash(rawKey, h); ;
}

//checks string is hash or not hash
function engIsHash(data, h) {
    var notHex = /[^0-9a-f]/g;
    var l;

    switch (h) {
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

    return (data.length != l || /[^0-9a-f]/g.test(data))
        ? false
        : true;
}

//returns specified hash of 'data'
function engGetHash(data, h) {
    switch (h) {
        case 'wrd':
            return hex_md5(data).substring(0, 4);
        case 'md5':
            return hex_md5(data);
        case 'r16':
            return hex_rmd160(data);
        case 's22':
            return hex_sha256_raw(data);
        case 's25':
            return hex_sha512(data);
        case 'smd':
            return hex_smd(data);
        case 's21':
            return hex_sha256(data);
        default:
            return null;
    }
}

function engGetTokStatus(lr, nr) {
    switch (true) {
    case (lr.g === nr.g && lr.o === nr.o):
        return 1;
    case (lr.g === nr.g):
        return 2;
    case (lr.o === nr.o):
        return 3;
    default:
        return 4;
    }
}

function engGetClearData(data) {
    var data = data || '';

    return data
        .replace(/\t/g, '\u0020')
        .replace(/\u0020+$/mg, '')
        .replace(/(\r\n)|\r/mg, '\n')
        .replace(/^\n+|\n+$/g, '');
}

function engIsValidString(data) {
    var data = data || '';

    for (let i = 0, l = data.length; i < l; i++) {
        let ch = data.charCodeAt(i);
        let range = [9, 10, 13];
        
        for (let j = 32, l = 127; j <= l; j++ ) {
            range.push(j);
        }
        
        if (range.indexOf(ch) > -1) {
            continue;
        } else {
            return false;
        }
/* //FIX return or not to conditions?
        if ((ch >= 32 && ch <= 127) ||
                ch === 9 ||
                ch === 10 ||
                ch === 13) {
            continue;
        } else {
            return false;
        }
*/      
        
    }

    return true;
}

function engDataToRecErrorLevel(data, lim) {
    var r = 0;
    var fmd;
    
    if (data === '') {
        return r;
    }
    
    if (!data) {
        return r = 1;
    }

    data = engGetClearData(data);

    if ((data.length) > lim) {
        return r = 2;
    }
    
    if (!engIsValidString(data)) {
        return r = 3;
    }

    var fmd = engGetDataToRec(data);

    if ((fmd.length) > lim) {
        return r = 4;
    }
    
    if (data !== engGetDataFromRec(fmd)) {
        return r = 5;
    }

    return r;
}

function engGetDataToRec(data) {
/*
    \u000a is LF;
    \u0020 is space;
    \u005c is backslash;
    \u006e is n 
*/

    if (!data) {
        return '';
    }

    data = engGetClearData(data)
        .replace(/\u005c/mg, '\u005c\u005c')
        .replace(/(\u0020(?=\u0020))/g, '\u0020\u005c')
        .replace(/\u000a/g, '\u005c\u006e');

    return data;
}

function engGetDataFromRec(data) {
/*     
    returns parsed data for displaying
    \u000a is LF;
    \u0020 is space;
    \u005c is backslash;
    \u006e is n
    
*/
    var bs = 0;

    data = data || '';

    for (let i = 0; i < data.length; i++) {
        bs = (data[i] === '\u005c') ? ++bs : 0;

        if (data[i] === '\u005c' && data[i + 1] === '\u006e') {
            if (bs > 0 && bs % 2 === 1) {
                bs = 0;
                data = data.substring(0, i) + '\u000a' + data.substr(i + 2);
            }
        }
    }

    return data
        .replace(/(\u0020\u005c)(?=\u0020)/g, '\u0020')
        .replace(/(\u005c\u005c)/g, '\u005c');
}

function engIsAsgmtKeys(keys) {
    var prK1K2 = '23132';
    var prG2O2 = '24252';
    var prG1O1 = '24151';
    var prK1G1 = '23141';
    var prK1 = '231';
    var prO1 = '251';
    var prK2 = '232';

    if (!Boolean(keys))
        return false;

    //FIX
    if (keys.replace(/\s/g, '') !== engGetOnlyHex(keys.replace(/\s/g, '')))
        return false;

    keys = keys.replace(/\s{2,}/g, '\u0020')
        .replace(/^\s+|\s+$/, '')
        .split(/\s/);
    var prCode = keys.splice(keys.length - 1, 1)[0];
    var prCode0Ch = prCode.charAt(0);

    if (prCode0Ch !== '1' && prCode0Ch !== '2')
        return false;

    var isRecNum = (prCode0Ch == '1') ? true : false;
    var keysLen;
    var prCodeLen = prCode.length;

    if (prCodeLen < 3 || prCodeLen > 6)
        return false;
    if (prCodeLen == 3 || prCodeLen == 4)
        keysLen = (isRecNum) ? 3 : 2;
    if (prCodeLen == 5 || prCodeLen == 6)
        keysLen = (isRecNum) ? 4 : 3;

    //FIX
    prK1K2 = (isRecNum) ? prCode0Ch + prK1K2 : prK1K2;
    prG2O2 = (isRecNum) ? prCode0Ch + prG2O2 : prG2O2;
    prG1O1 = (isRecNum) ? prCode0Ch + prG1O1 : prG1O1;
    prK1G1 = (isRecNum) ? prCode0Ch + prK1G1 : prK1G1;
    prK1 = (isRecNum) ? prCode0Ch + prK1 : prK1;
    prO1 = (isRecNum) ? prCode0Ch + prO1 : prO1;
    prK2 = (isRecNum) ? prCode0Ch + prK2 : prK2;

    if (prCode !== prK1K2 &&
        prCode !== prG2O2 &&
        prCode !== prG1O1 &&
        prCode !== prK1G1 &&
        prCode !== prK1 &&
        prCode !== prO1 &&
        prCode !== prK2)
        return false;

    var prCRC = '';
    var tkCRC = '';
    var tmpl = ''; //FIX ? = 0

    if (keys[keys.length - 1].length == 4) {
        //FIX
        prCRC = keys.splice(keys.length - 1, 1)[0];
        tkCRC = engGetHash(keys.join('')
                .replace(/\s/g, ''), 's22').substring(0, 4);
    } else if (keys[keys.length - 2].length == 4) {
        prCRC = keys.splice(keys.length - 2, 1)[0];
        tmpl = keys.splice(keys.length - 1, 1)[0].length;
        tkCRC = engGetHash(keys.join('')
                .replace(/\s/g, ''), 's22').substring(0, 4);
    }

    if (prCRC !== tkCRC)
        return false;
    if (keys.length < keysLen)
        return false;

    if (tmpl.length == 0) {
        var mod = keys.length % keysLen;

        if (mod !== 0 && mod !== 1)
            return false;

        tmpl = (mod == 0)
         ? keys[keys.length - 1].length
         : keys.splice(keys.length - 1, 1)[0].length;
    }

    if (isRecNum)
        for (var i = 0; i < keys.length; i = i + keysLen) {
            if (!engIsNumber(keys[i]))
                return false;

            keys.splice(i, 1);
            i--;
        }

    tmpl = (tmpl > 0) ? tmpl : keys[0].length;

    for (var i = 0; i < keys.length; i++)
        if (tmpl !== keys[i].length)
            return false;

    return true;
}

function engGetParsedAsgmtKeys(keys) {
    var prK1K2 = '23132';
    var prG2O2 = '24252';
    var prG1O1 = '24151';
    var prK1G1 = '23141';
    var prK1 = '231';
    var prO1 = '251';
    var prK2 = '232';

    keys = keys.replace(/\s{2,}/g, '\u0020')
        .replace(/^\s+|\s+$/, '')
        .split(/\s/);

    var prCode = keys.splice(keys.length - 1, 1)[0];
    var keysLen;

    var prCode0Ch = prCode.charAt(0);
    var prCodeLen = prCode.length;
    var isRecNum = (prCode0Ch == '1') ? true : false;

    if (prCodeLen == 3 || prCodeLen == 4)
        keysLen = (isRecNum) ? 3 : 2;
    if (prCodeLen == 5 || prCodeLen == 6)
        keysLen = (isRecNum) ? 4 : 3;

    if (keys[keys.length - 1].length == 4)
        keys.splice(keys.length - 1, 1)[0]; ///FIX
    else if (keys[keys.length - 2].length == 4) {
        keys.splice(keys.length - 2, 1)[0]; ///FIX
        keys.splice(keys.length - 1, 1)[0].length; ///FIX
    }

    if (keys.length % keysLen == 1)
        keys.splice(keys.length - 1, 1)[0].length; ///FIX

    prK1K2 = (isRecNum) ? prCode0Ch + prK1K2 : prK1K2;
    prG2O2 = (isRecNum) ? prCode0Ch + prG2O2 : prG2O2;
    prG1O1 = (isRecNum) ? prCode0Ch + prG1O1 : prG1O1;
    prK1G1 = (isRecNum) ? prCode0Ch + prK1G1 : prK1G1;
    prK1 = (isRecNum) ? prCode0Ch + prK1 : prK1;
    prO1 = (isRecNum) ? prCode0Ch + prO1 : prO1;
    prK2 = (isRecNum) ? prCode0Ch + prK2 : prK2;

    var keysQty = keys.length / keysLen;
    var asgmtKeys = [];

    for (var i = 0; i < keysQty; i++) {

        var tmpKeys = keys.splice(0, keysLen);
        asgmtKeys[i] = {};
        asgmtKeys[i].prcode = prCode;
        asgmtKeys[i].n = (isRecNum)
         ? asgmtKeys[i].n = +tmpKeys[0]//FIX
             : asgmtKeys[i].n = -1; //FIX

        asgmtKeys[i].s = (isRecNum)
         ? tmpKeys[1]
         : tmpKeys[0];

        switch (prCode) {
        case (prK1K2):
            asgmtKeys[i].k1 = (isRecNum) ? tmpKeys[2] : tmpKeys[1];
            asgmtKeys[i].k2 = (isRecNum) ? tmpKeys[3] : tmpKeys[2];

            break;
        case (prG2O2):
            asgmtKeys[i].g2 = (isRecNum) ? tmpKeys[2] : tmpKeys[1];
            asgmtKeys[i].o2 = (isRecNum) ? tmpKeys[3] : tmpKeys[2];

            break;
        case (prG1O1):
            asgmtKeys[i].g1 = (isRecNum) ? tmpKeys[2] : tmpKeys[1];
            asgmtKeys[i].o1 = (isRecNum) ? tmpKeys[3] : tmpKeys[2];

            break;
        case (prK1G1):
            asgmtKeys[i].k1 = (isRecNum) ? tmpKeys[2] : tmpKeys[1];
            asgmtKeys[i].g1 = (isRecNum) ? tmpKeys[3] : tmpKeys[2];

            break;
        case (prK1):
            asgmtKeys[i].k1 = (isRecNum) ? tmpKeys[2] : tmpKeys[1];

            break;
        case (prO1):
            asgmtKeys[i].o1 = (isRecNum) ? tmpKeys[2] : tmpKeys[1];

            break;
        case (prK2):
            asgmtKeys[i].k2 = (isRecNum) ? tmpKeys[2] : tmpKeys[1];

            break;
        default:
            return null;
        }

    }

    asgmtKeys.sort(engSortByProperties('s'));

    // if presents keys for same token;
    for (var i = 0; i < asgmtKeys.length - 1; i++) {
        if (asgmtKeys[i].s == asgmtKeys[i + 1].s) {
            asgmtKeys.splice(i + 1, 1);
            i--;
        }
    }

    return asgmtKeys;
}

function engGetTitleRecord(asgmtKeys, p, h, m) {
    var titleRecord = asgmtKeys;
    var prK1K2 = '23132'; //simple send;
    var prG2O2 = '24252'; // simple request;
    var prK1G1 = '23141'; // blocking send, st1;
    var prK1 = '231'; // blocking send, st2;
    var prO1 = '251'; // blocking request, st1;
    var prG1O1 = '24151'; //blocking request, st2;
    var prK2 = '232'; // blocking receive revert;

    // get protocol key from first element;
    var prCode = titleRecord[0].prcode;
    var prCode0Ch = prCode.charAt(0);
    // if protocol have record numbers;
    var isRecNum = (prCode0Ch == '1') ? true : false;

    prK1K2 = (isRecNum) ? prCode0Ch + prK1K2 : prK1K2;
    prK1G1 = (isRecNum) ? prCode0Ch + prK1G1 : prK1G1;
    prK1 = (isRecNum) ? prCode0Ch + prK1 : prK1;
    prG2O2 = (isRecNum) ? prCode0Ch + prG2O2 : prG2O2;
    prG1O1 = (isRecNum) ? prCode0Ch + prG1O1 : prG1O1;
    prO1 = (isRecNum) ? prCode0Ch + prO1 : prO1;
    prK2 = (isRecNum) ? prCode0Ch + prK2 : prK2;

    for (var i = 0; i < titleRecord.length; i++) {
        var n = titleRecord[i].n;
        delete titleRecord[i].n;
        var s = titleRecord[i].s;
        var n1 = n + 1;
        var n2 = n + 2;
        var n3 = n + 3;
        var n4 = n + 4;
        var k1,
        k2,
        k3,
        k4,
        g1,
        g2,
        g3,
        o1;

        switch (titleRecord[0].prcode) {
        case prK1K2:
            titleRecord[i].n1 = n1;
            titleRecord[i].n2 = n2;
            k2 = titleRecord[i].k2;
            titleRecord[i].g1 = engGetKey(n2, titleRecord[i].s, k2, m, h);
            k3 = engGetKey(n3, s, p, m, h);
            g2 = titleRecord[i].g2 = engGetKey(n3, s, k3, m, h);
            titleRecord[i].o1 = engGetKey(n2, s, g2, m, h);
            k4 = engGetKey(n4, s, p, m, h);
            g3 = engGetKey(n4, s, k4, m, h);
            titleRecord[i].o2 = engGetKey(n3, s, g3, m, h);

            break;
        case prG2O2:
            titleRecord[i].n1 = n1;
            titleRecord[i].n2 = n2;
            g2 = titleRecord[i].g2;
            titleRecord[i].k1 = engGetKey(n1, s, p, m, h);
            k2 = titleRecord[i].k2 = engGetKey(n2, s, p, m, h);
            titleRecord[i].g1 = engGetKey(n2, s, k2, m, h);
            titleRecord[i].o1 = engGetKey(n2, s, g2, m, h);

            break;
        case prK1G1:
            titleRecord[i].n1 = n1;
            k3 = engGetKey(n3, s, p, m, h);
            g2 = engGetKey(n3, s, k3, m, h);
            titleRecord[i].o1 = engGetKey(n2, s, g2, m, h);

            break;
        case prK1:
            titleRecord[i].n1 = n1;
            k2 = engGetKey(n2, s, p, m, h);
            k3 = engGetKey(n3, s, p, m, h);
            g2 = engGetKey(n3, s, k3, m, h);
            titleRecord[i].g1 = engGetKey(n2, s, k2, m, h);
            titleRecord[i].o1 = engGetKey(n2, s, g2, m, h);

            break;
        case prO1:
            titleRecord[i].n1 = n1;
            titleRecord[i].k1 = engGetKey(titleRecord[i].n1, s, p, m, h);
            k2 = engGetKey(n2, s, p, m, h);
            titleRecord[i].g1 = engGetKey(n2, s, k2, m, h);
            titleRecord[i].o1;

            break;
        case prG1O1:
            titleRecord[i].n1 = n1;
            titleRecord[i].k1 = engGetKey(n1, s, p, m, h);

            break;
        case prK2:
            titleRecord[i].n1 = n1;
            titleRecord[i].n2 = n2;
            titleRecord[i].k1 = engGetKey(n1, s, p, m, h);
            titleRecord[i].g1 = engGetKey(n2, s, titleRecord[i].k2, m, h);
            k3 = engGetKey(n3, s, p, m, h);
            titleRecord[i].g2 = engGetKey(n3, s, k3, m, h);
            titleRecord[i].o1 = engGetKey(n2, s, titleRecord[i].g2, m, h);
            k4 = engGetKey(n4, s, p, m, h);
            g3 = engGetKey(n4, s, k4, m, h);
            titleRecord[i].o2 = engGetKey(n3, s, g3, m, h);

            break;
        default:
            return null;
        }
    }

    return titleRecord;
}

function engGetDnOrRawList(dnList, rawList, hash) {
    // returns merged names from both lists asgmtKeys and tokens;
    for (var k = 0; k < dnList.length; k++) {
        for (var t = 0; t < rawList.length; t++) {
            if (dnList[k] === engGetHash(rawList[t], hash)) {
                var rawName = '[' + rawList[t] + ']';
                dnList[k] = rawName;
                rawList.splice(t, 1);
                t--;

                break;
            } else if (dnList[k] === rawList[t]) {
                rawList.splice(t, 1);
                t--;
            }
        }
    }

    return dnList;
}

function engGetNumberedAsgmtKeys(keys, list) {
    for (var i = 0; i < keys.length; i++)
        keys[i].n = list[i].n;

    return keys;
}

function engGetOnlyHex(data) {
    return data.replace(/[^0-9a-f]/g, '');
}

function engSortByProperties(prop) {
    return function (a, b) {
        return ((a[prop] < b[prop]) ? -1 : ((a[prop] > b[prop]) ? 1 : 0))
    }
}

function engGetDnList(list) {
    // returns tokens hash list;
    var r = [];

    for (var i = 0; i < list.length; i++)
        r[i] = list[i].s;

    return r;
}

function engIsNumber(num) {
    return !/[^0-9]/.test(num)
}
