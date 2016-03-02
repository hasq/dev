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
		
        switch (engGetTokensStatus(lr, nr)) {
        case 1:
            item.st = 'OK';
			item.fit = true;
            break;
        case 2:
            item.st = 'TKN_SNDNG';
			item.unfit = true;
            break;
        case 3:
            item.st = 'TKN_RCVNG';
			item.unfit = true;
            break;
        default:
            item.st = 'WRONG_PWD';
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

function engRunCL(commandsList, cbFunc) {
    var cb = function (ajxData) {
        if (commandsList.items.length == 0 && commandsList.idx >= commandsList.items.length) return;

        var progress = ((commandsList.idx + 1) / commandsList.items.length) * 100;
        var r = engGetResp(ajxData).msg;

        if (r == 'OK' || r == 'IDX_NODN') {
            cbFunc(ajxData, commandsList.idx, progress);
            commandsList.idx++;
            commandsList.counter = 100;
        } else {
			// in case of an error repeats command 100 times then continue next command;
            commandsList.counter--;
            if (commandsList.counter == 0) { //if (commandsList.counter < 0) {
				commandsList.idx++; // go to the next command in the list
				commandsList.counter = 100; // restore counter
                cbFunc(ajxData, commandsList.idx, progress);
            }
        }

        if (commandsList.items.length != 0 && commandsList.idx < commandsList.items.length) {
            engRunCL(commandsList, cbFunc)
        }
    }

    if (commandsList.items.length > 0 && commandsList.idx < commandsList.items.length) {
        ajxSendCommand(commandsList.items[commandsList.idx].cmd, cb, hasqLogo);
    } else if (commandsList.items.length === 0) {
        cbFunc('OK', 0, 0);
    }
}
