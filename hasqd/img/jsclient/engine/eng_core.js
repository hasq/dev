// Hasq Technology Pty Ltd (C) 2013-2015

function engGetHash(data, hashType) {
	switch (hashType) {
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
	default:
		break;
	}
	return null;
}

function engGetNewRecord(n, s, p0, p1, p2, m, h) {
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

function engCheckTokensOwnership(existingRec, expectingRec) {
	if ((existingRec.g === expectingRec.g) && (existingRec.o === expectingRec.o)) {
		return 1; // Tokens keys is fully matched with a password
	} else if (existingRec.g === expectingRec.g) {
		return 2; // Token is in a sending process
	} else if (existingRec.o === expectingRec.o) {
		return 3; // Token is in a receiving process
	} else {
		return 0; // Tokens keys is not matched with a password
	}
}

function engAddVTLItem(data, idx, table, cmdList) {
	var n = table.items.length;

	if (cmdList.length == 0) { // for manually cancel and clear commands list.
		return 'ERROR';
	};

	var rawS = cmdList[idx].rawS;
	var s = cmdList[idx].s;

	table.items[n] = {};
	table.items[n].rawS = rawS;
	table.items[n].s = s;

	if (data === 'IDX_NODN') {
		table.items[n].n = -1;
		table.items[n].d = '';
		table.items[n].message = 'IDX_NODN';
		table.unknown = true;
	} else {
		var existingRec = engGetLastRecord(data);
		var expectingRec = engGetNewRecord(existingRec.n, existingRec.s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);
		table.items[n].n = existingRec.n;
		table.items[n].d = existingRec.d;

		switch (engCheckTokensOwnership(existingRec, expectingRec)) {
		case 1:
			table.items[n].message = 'OK';
			table.known = true;
			break;
		case 2:
			table.items[n].message = 'TKN_SNDNG';
			table.known = true;
			break;
		case 3:
			table.items[n].message = 'TKN_RCVNG';
			table.known = true;
			break;
		default:
			table.items[n].message = 'WRONG_PWD';
			table.unknown = true;
			break;
		}
	}

	return table;
}

function engCheckVTL(table) {
	if (table.known && !table.unknown) {
		return true; //only known tokens;
	} else if (!table.known && table.unknown) {
		return false; //only unknown tokens
	} else if (!table.known && !table.unknown) {
		return null; //no has tokens
	} else {
		return undefined; //different tokens
	}
}

function engRunCRL(cmdsList, cbFunc) {
	var cb = function (data) {
		if (cmdsList.items.length == 0 && cmdsList.idx >= cmdsList.items.length) {
			return;
		}

		var progress = 100 * (cmdsList.idx + 1) / cmdsList.items.length;
		var r = engGetHasqdOk(data);

		if (r === 'OK' || r === 'IDX_NODN') {
			cbFunc(data, cmdsList.idx, progress);
			cmdsList.idx++;
			cmdsList.counter = 100;
		} else {
			cmdsList.counter--;
			if (cmdsList.counter < 0) {
				cbFunc(data, cmdsList.idx, progress);
				cmdsList.items.length = 0;
			}
		}

		if (cmdsList.items.length != 0 && cmdsList.idx < cmdsList.items.length) {
			engRunCRL(cmdsList, cbFunc)
		}
	}

	if (cmdsList.items.length !== 0 && cmdsList.idx < cmdsList.items.length) {
		ajxSendCommand(cmdsList.items[cmdsList.idx].cmd, cb, progressLed);
	} else if (cmdsList.items.length === 0) {
		cbFunc('OK', 0, 0);
	}
}
