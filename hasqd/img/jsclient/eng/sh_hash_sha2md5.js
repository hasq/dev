// Hasq Technology Pty Ltd (C) 2013-2016

function hex_sha2md5(data){
	if (data !== undefined && data !== null) {
		if (data.length !== 0) {
			return hex_md5(hex_sha256(data));
		}
	}
	return '';
}