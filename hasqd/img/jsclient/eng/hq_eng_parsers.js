// Hasq Technology Pty Ltd (C) 2013-2015

function engGetKeysSetCheckResults(data, altName, sKey){
    var keys = data;
    keys = keys.replace(/^\s+/, '').replace(/\s+$/, '').split(/\s/);
    var rawKeys = data;
    rawKeys = rawKeys.replace(/\s/g, '');
    var chkHash = 's22'
    var r = {};
    r.message = 'OK';
    r.content = 'OK';
    var hashLength = altName.length; //it may be need to check tokens length

    if (sKey.length == 6 && (keys.length - 3) % 4 != 0) {
        r.message = 'ERROR';
        r.content = 'BAD_KEYS';
    } else if (sKey.length == 4 && (keys.length - 3) % 3 != 0) {
        r.message = 'ERROR';
        r.content = 'BAD_KEYS';
    } else if (rawKeys != engSetHex(rawKeys)) {
        r.message = 'ERROR';
        r.content = 'BAD_CHARS';
    } else if (keys[keys.length - 1] != sKey) {
        r.message = 'ERROR';
        r.content = 'BAD_SC_CODE';
    } else if (keys[keys.length - 2] != altName) {
        r.message = 'ERROR';
        r.content = 'BAD_DB_NAME';
    } else if (keys[keys.length - 3] != engGetHash(keys.slice(0, keys.length - 3).join(''), chkHash).substring(0, 4)) {
        r.message = 'ERROR';
        r.content = 'BAD_RAWKEYS_HASH';
    }
    return r;
}


function engGetSubmit(data) {
    var r = data.replace(/^\s|\s+$/g, '');
    return r;
}

function engGetInfoId(data) {
    var r = engGetHasqdResponse(data);
    return r;
}

function engGetInfoSys(data) {
    var r = engGetHasqdResponse(data);
    return r;
}

function engGetInfoFam(data) {
    var r = {};
    r.list = [];
    r.message = 'OK';
    r.content = '';

    var parsedData = engGetHasqdResponse(data);

    if (parsedData.message != 'OK') {
        return parsedData;
    }

    var dataContent = parsedData.content;
    var lines = dataContent.split(/\n/);

    if (lines.length <= 1) {
        r.message = 'OK';
        r.content = 'NO_FAMILY';
        return r;
    }

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var parts = line.split(/\s/);
        if (parts.length != 5) {
            break;
        }

        r.list[i] = {};
        r.list[i].name = parts[0];
        r.list[i].link = parts[1];
        r.list[i].neighbor = (parts[2] == 'N');
        r.list[i].alive = (parts[3] == 'A');
        r.list[i].unlock = (parts[4] == 'U');
    }
    return r;
}

function engGetInfoDb(data) {
    var r = [];

    var parsedData = engGetHasqdResponse(data);

    if (parsedData.message != 'OK' || parsedData.length == 0) {
        return parsedData;
    }

    var dataContent = parsedData.content;

    dataContent = dataContent.replace(/{\n|}+$/g, '');
    dataContent = dataContent.split(/}\n/);

    if (dataContent.length < 1) {
        return dataContent;
    }

    for (var i = 0; i < dataContent.length; i++) {
        r[i] = {};
        var traitLines = {};

        traitLines[i] = dataContent[i].split(/\n/);

        var lines = traitLines[i];
        for (var j = 0; j < (lines.length - 1); j++) {
            var parts = lines[j].split('=');

            switch (parts[0]) {
            case 'name':
                r[i].name = parts[1];
                break;
            case 'hash':
                r[i].hash = parts[1];
                break;
            case 'rawS':
                r[i].rawS = parts[1];
                break;
            case 'nG':
                r[i].ng = parts[1];
                break;
            case 'magic':
                r[i].magic = parts[1].replace(/^\[|\]$/g, '');
                break;
            case 'size':
                r[i].size = parts[1];
                break;
            case 'thin':
                r[i].thin = parts[1];
                break;
            case 'datalimit':
                r[i].datalim = parts[1];
                break;
            case 'altname':
                r[i].altname = parts[1];
                break;
            default:
                break;
            }
        }
    }
    return r;
}

function engIsHash(data, hashFunction) {
    var notHex = /[^0-9a-f]/g;
    var r = true;
    switch (hashFunction) {
    case 'md5':
        var l = 32;
        break;
    case 'r16':
        var l = 40;
        break;
    case 's22':
        var l = 64;
        break;
    case 's25':
        var l = 128;
        break;
    case 'wrd':
        var l = 4;
        break;
    default:
        break;
    }

    if (data.length != l || notHex.test(data) ) { //mismatched length or not not hex chars contents
        return false;
    } else {
        return true;
    };
}

function engIsTokensNamesGood(data, hash) {
    var n = data;
    n = n.replace(/^\s+/, '').replace(/\s+$/, ''); // remove all space-like symbols from the start and end of the string
    n = n.split(/\s/);
    for (var i = 0; i < n.length; i++) {
        n[i] = n[i].replace(/^\s+/, '').replace(/\s+$/, '');
        if ((n[i].length == 0) || (n[i] === undefined) || (n[i] === null)) {
            true;
        } else if (n[i].charAt(0) == '[' && n[i].charAt(n[i].length - 1) == ']' && n[i].length > 2) {
            if (/\[|\]/.test(n[i].substring(1, n[i].length - 1))) {
                return false;
            } else {
                true;
            }
        } else if (engIsHash(n[i], hash)) {
            true;
        } else {
            return false;
        }
    }
    return true;
}


function engGetSortTokensNames(data) {
    function sortStr(prop) {
        return function (a, b) {
            return ((a[prop] < b[prop]) ? -1 : ((a[prop] > b[prop]) ? 1 : 0))
        }
    }

    var r = data;

    r.sort(sortStr('s'));

    for (var i = 0; i < r.length - 1; i++) {
        if (r[i].s == r[i + 1].s && r[i].rawS == r[i + 1].rawS) {
            r.splice(i + 1, 1);
            i--;
        } else if (r[i].s == r[i + 1].s && r[i].rawS != r[i + 1].rawS && r[i].rawS == ''){
            r[i].rawS = r[i + 1].rawS;
            r.splice(i + 1, 1);
            i--;
        } else if (r[i].s == r[i + 1].s && r[i].rawS != r[i + 1].rawS && r[i + 1].rawS == ''){
            r.splice(i + 1, 1);
            i--;
        }
    }
    return r;
}

function engGetParsedTokens(data, hash) {
    var r = [];

    var n = data;
    n = n.replace(/^\s+/, '').replace(/\s+$/, ''); // remove all space-like symbols from the start and end of the string
    n = n.split(/\s/);
    for (var i = 0; i < n.length; i++) {
        n[i] = n[i].replace(/^\s+/, '').replace(/\s+$/, '');
        if ((n[i].length == 0) || (n[i] === undefined) || (n[i] === null)) {
            n.splice(i, 1);
            i--;
        } else if (n[i].charAt(0) == '[' && n[i].charAt(n[i].length - 1) == ']' && n[i].length > 2) {
            var l = r.length;
            r[l] = {};
            r[l].rawS = n[i].slice(1, -1);
            r[l].s = engGetHash(r[l].rawS, hash);
        } else if (engIsHash(n[i], hash)) {
            var l = r.length;
            r[l] = {};
            r[l].rawS = '';
            r[l].s = n[i];
        }
    }

    return engGetSortTokensNames(r);
}

function engGetParsedTransferKeys(data, sk) {
    var r = [];
    var rawKeys = data;
    var keys = rawKeys.replace(/^\s+/, '').replace(/\s+$/, '').split(/\s/);
    var sK1K2 = '123132';
    var sG2O2 = '124252';
    var sK1G1 = '123141';
    var sK2 = '1232';
    var sO1 = '1251';

    for (var i = 0; i < keys.length; i++) {
        keys[i] = keys[i].replace(/^\s+/, '').replace(/\s+$/, '');
        if ((keys[i].length == 0) || (keys[i] === undefined) || (keys[i] === null)) {
            keys.splice(i, 1);
            i--;
        }
    }

    keys = keys.slice(0, keys.length - 3); // remove transfer protocol;

    for (var i = 0; i < keys.length;) {
        switch (sk) {
        case sK1K2:
            var idx = i / 4;
            r[idx] = {};
            var n = r[idx].n = +keys[i];
            var s = r[idx].s = keys[i + 1];
            var k1 = r[idx].k1 = keys[i + 2];
            var k2 = r[idx].k2 = keys[i + 3];

            i = i + 4;

            break;
        case sG2O2:
            var idx = i / 4;
            r[idx] = {};
            var n = r[idx].n = +keys[i];
            var s = r[idx].s = keys[i + 1];
            var g2 = r[idx].g2 = keys[i + 2];
            var o2 = r[idx].o2 = keys[i + 3];

            i = i + 4;

            break;
        case sK1G1:
            var idx = i / 4;
            r[idx] = {};
            var n = r[idx].n = +keys[i];
            var s = r[idx].s = keys[i + 1];
            var k1 = r[idx].k1 = keys[i + 2];
            var g1 = r[idx].g1 = keys[i + 3];

            i = i + 4;

            break;
        case sK2:
            var idx = i / 3;
            r[idx] = {};
            var n = r[idx].n = +keys[i];
            var s = r[idx].s = keys[i + 1];
            var k2 = r[idx].k2 = keys[i + 2];

            i = i + 3;

            break;
        case sO1:
            var idx = i / 3;
            r[idx] = {};
            var n = r[idx].n = +keys[i];
            var s = r[idx].s = keys[i + 1];
            var o1 = r[idx].o1 = keys[i + 2];

            i = i + 3;

            break;
        default:
            return r;

            break;
        }
    }

    function sortStr(prop) {
        return function (a, b) {
            return ((a[prop] < b[prop]) ? -1 : ((a[prop] > b[prop]) ? 1 : 0))
        }
    };

    r.sort(sortStr('s'));

    for (var i = 0; i < r.length - 1; i++) {
        if (r[i].s == r[i + 1].s) {
            r.splice(i + 1, 1);
            i--;
        };
    }

    return r;
}

function engGetUpdatedTransferKeys(data, p, h, m, sk) {
    var r = data;
    var sK1K2 = '123132';
    var sG2O2 = '124252';
    var sK1G1 = '123141';
    var sK2 = '1232';
    var sO1 = '1251';

    for (var i = 0; i < r.length; i++) {
        switch (sk) {
        case sK1K2:
            var n0 = r[i].n; //
            var n1 = n0 + 1;
            var s = r[i].s; //
            var k1 = r[i].k1; //
            var k2 = r[i].k2; //
            var n2 = n0 + 2;
            var g1 = r[i].g1 = engGetKey(n2, s, k2, m, h); //
            var n3 = n0 + 3;
            var k3 = engGetKey(n3, s, p, m, h);
            var g2 = r[i].g2 = engGetKey(n3, s, k3, m, h); //
            var o1 = r[i].o1 = engGetKey(n2, s, g2, m, h); //
            var n4 = n0 + 4;
            var k4 = engGetKey(n4, s, p, m, h);
            var g3 = engGetKey(n4, s, k4, m, h);
            var o2 = r[i].o2 = engGetKey(n3, s, g3, m, h); //

            break;
        case sG2O2:
            var n0 = r[i].n; //
            var n1 = r[i].n1 = n0 + 1; //
            var n2 = r[i].n2 = n0 + 2; //
            var s = r[i].s; //
            var g2 = r[i].g2; //
            var o2 = r[i].o2; //
            var k1 = r[i].k1 = engGetKey(n1, s, p, m, h); //
            var k2 = r[i].k2 = engGetKey(n2, s, p, m, h); //
            var g1 = r[i].g1 = engGetKey(n2, s, k2, m, h); //
            var o1 = r[i].o1 = engGetKey(n2, s, g2, m, h); //

            break;
        case sK1G1:
            var n0 = r[i].n;
            var n1 = n0 + 1;
            var n2 = n0 + 2;
            var n3 = n0 + 3;
            var s = r[i].s;
            var k1 = r[i].k1;//
            var g1 = r[i].g1;//
            var k3 = engGetKey(n3, s, p, m, h);
            var g2 = engGetKey(n3, s, k3, m, h);
            var o1 = r[i].o1 = engGetKey(n2, s, g2, m, h); //

            break;
        case sK2:
            var n0 = r[i].n; //
            var n1 = n0 + 1;
            var n2 = n0 + 2; //
            var n3 = n0 + 3;
            var n4 = n0 + 4;
            var s = r[i].s; //
            var k2 = r[i].k2; //
            var k3 = engGetKey(n3, s, p, m, h);
            var g2 = r[i].g2 = engGetKey(n3, s, k3, m, h); //
            var k4 = engGetKey(n4, s, p, m, h);
            var g3 = engGetKey(n4, s, k4, m, h);
            var o2 = r[i].o2 = engGetKey(n3, s, g3, m, h); //

            break;
        case sO1:
            var n0 = r[i].n;
            var n1 = r[i].n1 = n0 + 1;
            var n2 = n0 + 2;
            var s = r[i].s;
            var k1 = r[i].k1 = engGetKey(n1, s, p, m, h);//
            var k2 = engGetKey(n2, s, p, m, h);
            var g1 = r[i].g1 = engGetKey(n2, s, k2, m, h);//
            var o1 = r[i].o1;//

            break;
        default:
            break;
        }
    }

    return r;
}

function engGetTokensHashedNames(data){
    var r = [];
    for (var i = 0; i < data.length; i++){
        r[i] = data[i].s;
    }
    return r;
}

function engGetTokensRawNames(data){
    var r = [];
    for (var i = 0; i < data.length; i++){
        if (data[i].rawS != '') {
            r[i] = data[i].rawS;
        } else {
            r[i] = data[i].s;
        }

    }
    return r;
}

function engGetTokensUpdatedNames(data0, data1) {
    for (var k = 0; k < data0.length; k++){
        for (var t = 0; t < data1.length; t++) {
            if (data0[k] == engGetHash(data1[t], glCurrentDB.hash)) {
                var rawName = '[' + data1[t] + ']';
                data0[k] = rawName;
                data1.splice(t, 1);
                t--;
                break;
            } else if (data0[k] == data1[t] ) {
                data1.splice(t, 1);
                t--;
            }
        }
    }
    return data0;
}

function engSetNumber(data) {
    var r = +data.replace(/[^0-9]/g, '');
    return r;
}

function engSetHex(data) {
    var r = data.replace(/[^0-9a-f]/g, '');
    return r;
}

function engIsNull(data) {
    return data == null ? true : false;
}
