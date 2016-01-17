// Hasq Technology Pty Ltd (C) 2013-2016

function hex_sha2md5(data){
	return hex_md5(hex_sha256(data));
}