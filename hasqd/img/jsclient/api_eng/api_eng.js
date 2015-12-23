// Hasq Technology Pty Ltd (C) 2013-2015

function apiSendCommand(command, callback, progress) {
	return ajxSendCommand(command, callback, progress);
}

function apiParseInfoFam(data) {
	return engParseInfoFam(data);
}

function apiParseInfoDbs(data) {
	return engParseInfoDbs(data);
}

function apiParseInfoId(data) {
	return engParseInfoId(data);
}

function apiParseInfoSys(data) {
	return engParseInfoSys(data);
}

function apiGetLastRecord(data) {
	return engGetLastRecord(data);
}

function apiParseSubmit(data) {
	return engParseSubmit(data);
}

function apiParseAllResponse(data) {
	return engParseAllResponse(data);
}

function apiGetHash(data, hashType) {
	return engGetHash(data, hashType);
}

function apiHashCheck(data, hashType) {
	return engHashCheck(data, hashType);
}

function apiGetNewRecord(n, s, p0, p1, p2, m, h) {
	return engGetNewRecord(n, s, p0, p1, p2, m, h);
}

function apiGetKey(n, s, p, m, h) {
	return engGetKey(n, s, p, m, h);
}

function apiCompareTokens(n, s, p0, p1, p2, k0, g0, o0, record) {
	return engCompareTokens(n, s, p0, p1, p2, k0, g0, o0, record);
}

function apiRunCRL(data, cb) {
	return engRunCRL(data, cb);
}

function apiAddVTLItem(data, idx, table, list){
	return engAddVTLItem(data, idx, table, list);
}

function apiSetNumber(data) {
	return engSetNumber(data);
}

function apiSetHex(data) {
	return engSetHex(data);
}

function apiIsNull(data) {
	return engIsNull(data);
}

function apiParseTokens (data, hash) {
	return engParseTokens (data, hash);
}

function apiParseKeys (data, password, dbHash, dbMagic, dbAltName, scKey) {
	return engParseKeys (data, password, dbHash, dbMagic, dbAltName, scKey);
}