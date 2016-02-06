// Hasq Technology Pty Ltd (C) 2013-2016

function engGetParsedResponse(d) {
    // returns response header
    var r = {};
    var response = d.replace(/\r|\s+$/g, '');
    var blocks = response.split(/\s/); // split by by \s (\s, \n, \t, \v);
    var lines = response.split(/\n/); // split by \n only;

    if (lines.length == 0 || blocks[0] == 0) {
        r.content = 'NO_OUTPUT';
        r.message = 'ERROR';
    } else if (lines[0] === 'OK') {
        r.content = response.replace(/^OK/, '');
        r.message = 'OK'
    } else if (blocks[0] === 'OK') {
        r.content = response.replace(/^OK\s/, '');
        r.message = 'OK';
    } else if (blocks[0] === 'IDX_NODN') {
        r.content = blocks[0];
        r.message = blocks[0];
    } else if (
        blocks[0] === 'REQ_HASHTYPE_BAD' ||
        blocks[0] === 'URF_BAD_FORMAT' ||
        blocks[0] === 'REQ_MSG_HEAD' ||
        blocks[0] === 'REQ_DN_BAD' ||
        blocks[0] === 'REC_INIT_BAD_N' ||
        blocks[0] === 'REC_INIT_BAD_S' ||
        blocks[0] === 'REC_INIT_BAD_KGO') {
        r.content = blocks[0];
        r.message = 'ERROR';
    } else {
        r.content = response;
        r.message = 'ERROR';
    }
    return r;
}

function engGetParsedResponseInfoDb(d) {
    // returns parsed 'info db' response
    var r = [];

    var response = engGetParsedResponse(d);

    if (response.message != 'OK' || response.length == 0) {
        return response;
    }

    var rawDbData = response.content;

    rawDbData = rawDbData.replace(/{\n|}+$/g, '');
    rawDbData = rawDbData.split(/}\n/);

    if (rawDbData.length < 1) {
        return rawDbData;
    }

    for (var i = 0; i < rawDbData.length; i++) {
        r[i] = {};
        var traitLines = {};

        traitLines[i] = rawDbData[i].split(/\n/);

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

function engGetParsedResponseLast(d) {
    // returns parsed 'last' response
    var r = {};
    r.content = 'OK';
    r.message = 'OK';

    parsedData = engGetParsedResponse(d);

    if (parsedData.message != 'OK' || parsedData.length == 0) {
        return parsedData;
    }

    var dataContent = parsedData.content;
    var parts = dataContent.split(/\s/);
    if (parts.length < 5) {
        r.message = 'ERROR';
        r.content = parts;
    } else if (parts.length == 5) {
        r.n = +parts[0];
        r.s = parts[1];
        r.k = parts[2];
        r.g = parts[3];
        r.o = parts[4];
        r.d = '';
    } else if (parts.length > 5) {
        r.n = +parts[0];
        r.s = parts[1];
        r.k = parts[2];
        r.g = parts[3];
        r.o = parts[4];
        d = [];
        for (var i = 5; i < parts.length; i++) {
            d[d.length] = parts[i];
        }
        r.d = d.join(' ');
    }

    return r;
}

function engGetNewRecord(n, s, p0, p1, p2, m, h) {
    // generates new record
    var r = {};
    r.n = '';
    r.s = '';
    r.k = '';
    r.g = '';
    r.o = '';

    var n0 = +n;
    var n1 = +n + 1;
    var n2 = +n + 2;

    var k0 = engGetKey(n0, s, p0, m, h);

    if ((p1 == null) || (p2 == null)) {
        var k1 = engGetKey(n1, s, p0, m, h);
        var k2 = engGetKey(n2, s, p0, m, h);
    } else {
        var k1 = engGetKey(n1, s, p1, m, h);
        var k2 = engGetKey(n2, s, p2, m, h);
    }

    var g0 = engGetKey(n1, s, k1, m, h);
    var g1 = engGetKey(n2, s, k2, m, h);
    var o0 = engGetKey(n1, s, g1, m, h);

    r.n = n0;
    r.s = s;
    r.k = k0;
    r.g = g0;
    r.o = o0;

    return r;
}

function engGetKey(n, s, p, m, h) {
    var raw_k = n + ' ' + s + ' ' + p;

    if (m != '') {
        raw_k += ' ' + m;
    }

    return engGetHash(raw_k, h); ;
}

function engIsHash(d, h) {
    //checks string is hash or not hash
    var notHex = /[^0-9a-f]/g;
    var r = true;
    switch (h) {
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
    case 'smd':
        var l = 32;
        break;
    default:
        break;
    }

    if (d.length != l || notHex.test(d)) { //mismatched length or not not hex chars contents
        return false;
    } else {
        return true;
    };
}

function engGetHash(d, h) {
    //returns specified hash of 'd'
    switch (h) {
    case 'wrd':
        return hex_md5(d).substring(0, 4);
    case 'md5':
        return hex_md5(d);
    case 'r16':
        return hex_rmd160(d);
    case 's22':
        return hex_sha256(d);
    case 's25':
        return hex_sha512(d);
    case 'smd':
        return hex_smd(d);
    default:
        break;
    }
    return null;
}

function engGetTokensState(lr, nr) {
    // returns current matching of password
    if ((lr.g === nr.g) && (lr.o === nr.o)) {
        return 1; // Tokens keys is fully matched with a password
    } else if (lr.g === nr.g) {
        return 2; // Token is in a sending process
    } else if (lr.o === nr.o) {
        return 3; // Token is in a receiving process
    } else {
        return 0; // Tokens keys is not matched with a password
    }
}

function engGetOutParsedDataValue(d) {
    // returns parsed data for displaying
    var r = d;
    if (r !== undefined && r.length > 0) {
        var lf = '\u000a'; //unicode line-feed

        for (var i = 0; i < r.length; i++) {
            if (r[i] === '\u005c' && r[i + 1] === '\u005c' && r[i + 2] === '\u006e') {
                // "\\n" > "\n", "\\\n" > "\\n"
                r = r.substring(0, i) + r.substr(i + 1);
                i++; // need check;
            } else if (r[i] === '\u005c' && r[i + 1] === '\u006e') {
                // "\n" > LF
                r = r.substring(0, i) + lf + r.substr(i + 2);
            } else if (r[i] === '\u005c' && r[i - 1] === '\u0020' && r[i + 1] === '\u0020') {
                // "a \ a" > "a, "a \ \ a" > "a   a", "a\ " > "a\ "
                r = r.substring(0, i) + r.substr(i + 1);
            }
        }
    }
    return r;

}

function engGetInParsedDataValue(d) {
    // returns parsed data for add into record
    var r = d.replace(/^\s+|\s+$/g, '');
    if (r !== undefined && r.length > 0) {
        for (var i = 0; i < r.length; i++) {
            if (r[i] === '\u0020' && r[i + 1] === '\u0020') {
                // "a  a" -> "a \ a", "  " -> ""
                r = r.substring(0, i + 1) + '\u005c' + r.substr(i + 1, r.length);
                i++;
            } else if (r[i] === '\u000a') {
                // LF  > "\n"
                r = r.substring(0, i) + '\u005c\u006e' + r.substr(i + 1);
            }
        }
    }
    return r;
}
