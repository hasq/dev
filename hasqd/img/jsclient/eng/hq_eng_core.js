// Hasq Technology Pty Ltd (C) 2013-2016
function engGetTokenInfo(data, r, s) {
	var response = engGetResp(data);
	
	var item = {};
    item.r = r;
    item.s = s;
    item.fit = false;
	item.unfit = false;
	
	if (response.msg === 'OK') {
        var lr = engGetRespLast(data);
        var nr = engGetNewRecord(lr.n, lr.s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);
        item.n = lr.n;
        item.d = lr.d;
        item.fit = false;
		item.unfit = false;
		item.st = engGetTokensStatus(lr, nr);
        switch (item.st) {
        case 'OK':
			item.fit = true;
            break;
        case 'PWD_SNDNG':
			item.unfit = true;
            break;
        case 'PWD_RCVNG':
			item.unfit = true;
            break;
        case 'PWD_WRONG':
			item.unfit = true;
            break;
        }
    } else {
		item.st = 'IDX_NODN';
		item.unfit = true;
		item.n = -1;	
		item.d = '';		
	}

    return item;
}

function engRunCmdList(cmdList, cbFunc) {
    var cb = function (ajxData) {
        if (cmdList.items.length == 0 && cmdList.idx >= cmdList.items.length) return;

        var progress = ((cmdList.idx + 1) / cmdList.items.length) * 100;
        var r = engGetResp(ajxData).msg;

        if (r == 'OK' || r == 'IDX_NODN') {
            cbFunc(ajxData, cmdList.idx, progress);
            cmdList.idx++;
            cmdList.counter = 100;
        } else {
			// in case of an error repeats command 100 times then continue next command;
            cmdList.counter--;
            if (cmdList.counter == 0) { //if (cmdList.counter < 0) {
				cmdList.idx++; // go to the next command in the list
				cmdList.counter = 100; // restore counter
                cbFunc(ajxData, cmdList.idx, progress);
            }
        }

        if (cmdList.items.length != 0 && cmdList.idx < cmdList.items.length) {
            engRunCmdList(cmdList, cbFunc)
        }
    }

    if (cmdList.items.length > 0 && cmdList.idx < cmdList.items.length) {
        ajxSendCommand(cmdList.items[cmdList.idx].cmd, cb, hasqLogo);
    } else if (cmdList.items.length === 0) {
        cbFunc('OK', 0, 0);
    }
}
