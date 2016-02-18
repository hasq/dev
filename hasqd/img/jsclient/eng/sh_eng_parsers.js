// Hasq Technology Pty Ltd (C) 2013-2016

function engGetResp(data) {
    // returns response header
    var resp = {};
    var tmp = data.replace(/\r|\s+$/g, '');
    var blocks = tmp.split(/\s/); // split by by \s (\s, \n, \t, \v);
    var lines = tmp.split(/\n/); // split by \n only;

	if (tmp.length == 0){
        resp.msg = 'ERROR';
        resp.cnt = 'NO_OUTPUT';
		return resp;
	}
	
    if (tmp.length == 0) {
        resp.msg = 'ERROR';
        resp.cnt = data;
    } else if (lines[0] === 'OK') {
        resp.msg = 'OK'
    } else if (blocks[0] === 'OK') {
        resp.msg = 'OK';
    } else if (blocks[0] === 'IDX_NODN') {
        resp.msg = blocks[0];
        resp.cnt = blocks[0];
    } else if (
	    blocks[0] === 'URF_BAD_FORMAT' ||
        blocks[0] === 'REQ_HASHTYPE_BAD' ||
        blocks[0] === 'REQ_MSG_HEAD' ||
        blocks[0] === 'REQ_DN_BAD' ||
        blocks[0] === 'REC_INIT_BAD_N' ||
        blocks[0] === 'REC_INIT_BAD_S' ||
        blocks[0] === 'REC_INIT_BAD_KGO') {
        resp.msg = 'ERROR';
        resp.cnt = tmp;
    } else {
        resp.msg = 'ERROR';
        resp.cnt = tmp;
    }
    return resp;
}

function engGetRespInfoDb(data) {
    // returns parsed 'info db' response
    var db = [];
	var err = {};
    var rawDb = data.replace(/^OK/g, '').replace(/^\s+|\r|\s+$/g, '').replace(/{\n|}+$/g, '').split(/}\n/);

    if (rawDb.length == 0) {

		err.msg = 'ERROR';
		err.cnt = rawDB;
        return err;
    }

    for (var i = 0; i < rawDb.length; i++) {
        db[i] = {};
        var traitLines = {};

        traitLines[i] = rawDb[i].split(/\n/);

        var lines = traitLines[i];
        for (var j = 0; j < (lines.length - 1); j++) {
            var parts = lines[j].split('=');

            switch (parts[0]) {
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

function engGetRespLast(data) {
    // returns parsed 'last' response
    var rec = {};
	var err = {};
    var parts = data.replace(/^OK/g, '').replace(/^\s|\r|\s+$/g, '').split(/\s/);
	
    if (parts.length < 5) {
        err.msg = 'ERROR';
        err.cnt = parts;
		return err;
    } else if (parts.length == 5) {
        rec.n = +parts[0];
        rec.s = parts[1];
        rec.k = parts[2];
        rec.g = parts[3];
        rec.o = parts[4];
        rec.d = '';
    } else if (parts.length > 5) {
        rec.n = +parts[0];
        rec.s = parts[1];
        rec.k = parts[2];
        rec.g = parts[3];
        rec.o = parts[4];
        var d = [];
        for (var i = 5; i < parts.length; i++) {
            d[d.length] = parts[i];
        }
        rec.d = d.join(' ');
    }

    return rec;
}

function engGetNewRecord(n, s, p0, p1, p2, m, h) {
    // generates new record
    var rec = {};
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

    rec.n = n0;
    rec.s = s;
    rec.k = k0;
    rec.g = g0;
    rec.o = o0;

    return rec;
}

function engGetKey(n, s, p, m, h) {
    var raw_k = n + ' ' + s + ' ' + p;

    if (m != '') {
        raw_k += ' ' + m;
    }

    return engGetHash(raw_k, h); ;
}

function engIsHash(data, h) {
    //checks string is hash or not hash
    var notHex = /[^0-9a-f]/g;
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

    if (data.length != l || /[^0-9a-f]/g.test(data)) { //mismatched length or not not hex chars contents
        return false;
    } else {
        return true;
    };
}

function engGetHash(data, h) {
    //returns specified hash of 'data'
    switch (h) {
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

function engGetTokensStatus(lr, nr) {
    // returns current matching of password
	
    // Tokens keys is fully matched with a password
	if ((lr.g === nr.g) && (lr.o === nr.o)) return 1; 
	// Token is in a sending process
	if (lr.g === nr.g) return 2;
	// Token is in a receiving process
	if (lr.o === nr.o) return 3; 
	// Tokens keys is not matched with a password
	return 0; 
}

function engGetOutputDataValue(d) {
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

function engGetInputDataValue(d) {
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

function engIsRawTransKeys(keys) {
	if (keys == '' || typeof keys === 'undefined' || typeof keys === 'null' || typeof keys === 'NaN') return false;
	if (keys.replace(/\s/g, '') !== engGetOnlyHex(keys.replace(/\s/g, ''))) return false; // checks for non hex chars;
	
    keys = keys.replace(/\s{2,}/g, '\u0020').replace(/^\s+|\s+$/, '').split(/\s/); // remove extra spaces and split 
	var prCode = keys.splice(keys.length - 1, 1)[0]; //get protocol line;

	var isRecNum, keysQty;
	var prCode0Ch = prCode.charAt(0);
	var prCodeLen = prCode.length;
	// checks protocol code for record number exists into the transkeys;
	if (prCode0Ch == '1') {
		isRecNum = true;
	} else if (prCode0Ch == '2') {
		isRecNum = false;
	} else {
		return;
	}
	//checks match of a protocol code and quantity of transkeys elements;
	if (prCodeLen == 3 || prCodeLen == 4) { 		
		keysQty = (isRecNum) ? 3 : 2;
	} else if (prCodeLen == 5 || prCodeLen == 6) {
		keysQty = (isRecNum) ? 4 : 3;
	} else {
		return false;
	}

	var prCRC = '';
	var tkCRC = '';
	var tmpl = '';	
	//if exists CRC extract it and compare with calculated CRC
	//if exists db name it will be used like lengths template
	if (keys[keys.length - 1].length == 4) {
		prCRC = keys.splice(keys.length - 1, 1)[0];	//extracts CRC;
		tkCRC = engGetHash(keys.join('').replace(/\s/g, ''), 's22').substring(0, 4);	//calculates CRC
	} else if (keys[keys.length - 2].length == 4) {
		prCRC = keys.splice(keys.length - 2, 1)[0];	//extracts CRC;
		tmpl = keys.splice(keys.length - 1, 1)[0].length;	//extracts DB name;
		tkCRC = engGetHash(keys.join('').replace(/\s/g, ''), 's22').substring(0, 4);	//calculates CRC	
	}

	if (prCRC !== tkCRC) return false; //checks CRC

	if (keys.length < keysQty) return false;
	
	if (tmpl.length == 0) {
		var mod = keys.length % keysQty;
		if ( mod == 1 ) {
			tmpl = keys.splice(keys.length - 1, 1)[0].length; //extracts DB name;
		} else if (mod == 0) {
			tmpl = keys[keys.length - 1].length;
		} else {
			return false;
		}
	}
	
	if (isRecNum) {
		for (var i = 0; i < keys.length; i = i + keysQty) {
			if (!engIsNumber(keys[i])) return false;
			keys.splice(i, 1);
			i--;
		}
	}

	
	tmpl = (tmpl > 0) ? tmpl : keys[0].length;
	for (var i = 0; i < keys.length; i++) {		
		if (tmpl !== keys[i].length) return false;
	}	
	
	return true;
}

function engGetTransKeys(keys) {
	var prK1K2 = '23132';
    var prG2O2 = '24252';
    var prK1G1 = '23141'; 
    var prK2 = '232';
    var prO1 = '251'; 

	var transKeys = [];
 
	keys = keys.replace(/\s{2,}/g, '\u0020').replace(/^\s+|\s+$/, '').split(/\s/); // remove extra spaces and split 
	var prCode = keys.splice(keys.length - 1, 1)[0]; //get protocol line;
	
 	var isRecNum, keysQty;
	var prCode0Ch = prCode.charAt(0);
	var prCodeLen = prCode.length;
	// checks protocol code for record number exists into the transkeys;
	if (prCode0Ch == '1') {
		isRecNum = true;
	} else if (prCode0Ch == '2') {
		isRecNum = false;
	} 
	//checks match of a protocol code and quantity of transkeys elements;
	if (prCodeLen == 3 || prCodeLen == 4) keysQty = (isRecNum) ? 3 : 2;
	if (prCodeLen == 5 || prCodeLen == 6) keysQty = (isRecNum) ? 4 : 3;

	//if exists CRC remove it
	//if exists db name it will be used like lengths template
	if (keys[keys.length - 1].length == 4) {
		keys.splice(keys.length - 1, 1)[0];	//extracts CRC;
	} else if (keys[keys.length - 2].length == 4) {
		keys.splice(keys.length - 2, 1)[0];	//extracts CRC;
		keys.splice(keys.length - 1, 1)[0].length;	//extracts DB name;
	}


	var mod = keys.length % keysQty;
	if (mod == 1) keys.splice(keys.length - 1, 1)[0].length;
	
	var coef = (prCode0Ch == '1') ? 1 : 2; // if protocol have record numbers;
	
	prK1K2 = (isRecNum) ? prCode0Ch + prK1K2 : prK1K2;
	prG2O2 = (isRecNum) ? prCode0Ch + prG2O2 : prG2O2;
	prK1G1 = (isRecNum) ? prCode0Ch + prK1G1 : prK1G1;
	prK2 = (isRecNum) ? prCode0Ch + prK2 : prK2;
	prO1 = (isRecNum) ? prCode0Ch + prO1 : prO1;
	
    for (var i = 0; i < keys.length; i++) {
	
		transKeys[i] = {};
		transKeys[i].prcode = prCode;
		transKeys[i].n = (coef == 1) ? transKeys[i].n = -1 : transKeys[i].n = +el[0];// if protocol have record numbers n = -1;
		transKeys[i].s = el[1 - coef];
		
		switch (prCode) {
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
    for (var i = 0; i < transKeys.length - 1; i++) {
        if (transKeys[i].s == transKeys[i + 1].s) {
            transKeys.splice(i + 1, 1);
            i--;
        };
    }

    return transKeys;
}

function engGetEnrollKeys(transKeys, p, h, m) {
    var enrollKeys = transKeys;
	var prK1K2 = '23132'; 
    var prG2O2 = '24252';
    var prK1G1 = '23141';
    var prK2 = '232';
    var prO1 = '251';
	
	var prCode = transKeys[0].prcode; // get protocol key from first element;
	var prCode0Ch = prCode.charAt(0);
	var dbFlag = (prCode.charAt(prCode.length - 1) == '0') ? '0' : '';
	var coef = (prCode0Ch == '0') ? 1 : 0; // if protocol have record numbers;
	
	prK1K2 = prCode0Ch + prK1K2 + dbFlag;
	prG2O2 = prCode0Ch + prG2O2 + dbFlag;
	prK1G1 = prCode0Ch + prK1G1 + dbFlag;
	prK2 = prCode0Ch + prK2 + dbFlag;
	prO1 = prCode0Ch + prO1 + dbFlag;
	
    for (var i = 0; i < enrollKeys.length; i++) {
		var n = enrollKeys[i].n
		var s = enrollKeys[i].s;
		var n1 = n + 1;
		var n2 = n + 2;
		var n3 = n + 3;
		var n4 = n + 4;
		
        switch (enrollKeys[0].prcode) {
        case prK1K2:
            var k2 = enrollKeys[i].k2; //
            enrollKeys[i].g1 = engGetKey(n2, enrollKeys[i].s, k2, m, h); //
            var k3 = engGetKey(n3, s, p, m, h);
            var g2 = enrollKeys[i].g2 = engGetKey(n3, s, k3, m, h); //
            enrollKeys[i].o1 = engGetKey(n2, s, g2, m, h); //
            var k4 = engGetKey(n4, s, p, m, h);
            var g3 = engGetKey(n4, s, k4, m, h);
            enrollKeys[i].o2 = engGetKey(n3, s, g3, m, h); //
            break;
        case prG2O2:
            enrollKeys[i].n1 = n1; //
            enrollKeys[i].n2 = n2; //
            var g2 = enrollKeys[i].g2; //
            enrollKeys[i].k1 = engGetKey(n1, s, p, m, h); //
            var k2 = enrollKeys[i].k2 = engGetKey(n2, s, p, m, h); //
            enrollKeys[i].g1 = engGetKey(n2, s, k2, m, h); //
            enrollKeys[i].o1 = engGetKey(n2, s, g2, m, h); //
            break;
        case prK1G1:
            var k3 = engGetKey(n3, s, p, m, h);
            var g2 = engGetKey(n3, s, k3, m, h);
			enrollKeys[i].o1 = engGetKey(n2, s, g2, m, h); //
            break;
        case prK2:
            var k3 = engGetKey(n3, s, p, m, h);
            var k4 = engGetKey(n4, s, p, m, h);
            var g3 = engGetKey(n4, s, k4, m, h);
			enrollKeys[i].g2 = engGetKey(n3, s, k3, m, h); //
			enrollKeys[i].o2 = engGetKey(n3, s, g3, m, h); //
            break;
        case prO1:
            enrollKeys[i].n1 = n + 1;
            enrollKeys[i].k1 = engGetKey(enrollKeys[i].n1, s, p, m, h); //
            var k2 = engGetKey(n2, s, p, m, h);
            enrollKeys[i].g1 = engGetKey(n2, s, k2, m, h); //
            enrollKeys[i].o1; //
			break;
        default:
            break;
        }
    }
    return enrollKeys;
}



function engGetMergedTokensList(hashList, rawList, hash) {
	// returns merged names from both lists transkeys and tokens;
    for (var k = 0; k < hashList.length; k++) {
        for (var t = 0; t < rawList.length; t++) {
            if (hashList[k] == engGetHash(rawList[t], hash)) {
                var rawName = '[' + rawList[t] + ']';
                hashList[k] = rawName;
                rawList.splice(t, 1);
                t--;
                break;
            } else if (hashList[k] == rawList[t]) {
                rawList.splice(t, 1);
                t--;
            }
        }
    }
    return hashList;
}

function engGetOnlyHex(data) {
    return data.replace(/[^0-9a-f]/g, '');
}

function engSortByProperties(prop) {
	return function (a, b) {
		return ((a[prop] < b[prop]) ? -1 : ((a[prop] > b[prop]) ? 1 : 0))
    }
}


function engGetHashedTokensList(list) {
	// returns hashed token names;
    var r = [];
	
    for (var i = 0; i < list.length; i++) {
        r[i] = list[i].s;
    }
	
    return r;
}

function engIsNumber(num) {
    return !/[^0-9]/.test(num)
}