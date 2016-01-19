// Hasq Technology Pty Ltd (C) 2013-2016

function engGetHasqdOk(data) {
    var r = data.replace(/\r|\s+$/g, '');

    var blocks = r.split(/\s/); // split by by \s (\s, \n, \t, \v);
    var lines = r.split(/\n/);  // split by \n;

    if (lines[0] == 'OK') {
        return lines[0];
    } else if (blocks[0] == 'OK' || blocks[0] == 'IDX_NODN') {
        return blocks[0];
    } else {
        return r;
    }
}

function engGetHasqdResponse(data) {
    var r = {};
    var response = data.replace(/\r|\s+$/g, '');
    var blocks = response.split(/\s/);  // split by by \s (\s, \n, \t, \v);
    var lines = response.split(/\n/);   // split by \n only;

    if (lines.length == 0 || blocks[0] == 0) {
        r.content = 'NO_OUTPUT';
        r.message = 'ERROR';
    } else if (lines[0] == 'OK') {
        r.content = response.replace(/^OK/, '');
        r.message = 'OK'
    } else if (blocks[0] == 'OK') {
        r.content = response.replace(/^OK\s/, '');
        r.message = 'OK';
    } else if (blocks[0] == 'IDX_NODN' ) {
        r.content = blocks[0];
        r.message = blocks[0];
    } else if (
                blocks[0] == 'REQ_HASHTYPE_BAD' ||
                blocks[0] == 'URF_BAD_FORMAT' ||
                blocks[0] == 'REQ_MSG_HEAD' ||
                blocks[0] == 'REQ_DN_BAD' ||
                blocks[0] == 'REC_INIT_BAD_N' ||
                blocks[0] == 'REC_INIT_BAD_S' ||
                blocks[0] == 'REC_INIT_BAD_KGO'
                ) {
        r.content = blocks[0];
        r.message = 'ERROR';
    } else {
        r.content = response;
        r.message = 'ERROR';
    }
    return r;
}

function engGetLastRecord(data) {
    var r = {};
    r.content = 'OK';
    r.message = 'OK';

    parsedData = engGetHasqdResponse(data);

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