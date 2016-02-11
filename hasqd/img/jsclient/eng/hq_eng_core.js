// Hasq Technology Pty Ltd (C) 2013-2016
function engGetTokenInfo(data, rawS, s) {
	var response = engGetResponse(data);
	
	var item = {};
    item.rawS = rawS;
    item.s = s;
    item.n = -1;
    item.d = '';
    item.message = 'IDX_NODN';
    item.unknown = true;
	item.known = false;
	
	if (response.message === 'OK') {
        var lr = engGetResponseLast(data);
        var nr = engGetNewRecord(lr.n, lr.s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);
        item.n = lr.n;
        item.d = lr.d;
        item.known = true;
		item.unknown = false;
		
        switch (engGetTokensState(lr, nr)) {
        case 1:
            item.message = 'OK';
            break;
        case 2:
            item.message = 'TKN_SNDNG';
            break;
        case 3:
            item.message = 'TKN_RCVNG';
            break;
        default:
            item.message = 'WRONG_PWD';
			item.known = false;
			item.unknown = true;
            break;
        }
    }

    return item;
}

function engGetVTL(list, item) {
	if (arguments.length == 1) {
		// clear list
		list.items.length = 0;
		list.known = false;
		list.unknown = false;
		return list;
	}
		
    var n = list.items.length;
    list.items[n] = {};
    list.items[n].rawS = item.rawS;
    list.items[n].s = item.s;
	list.items[n].n = item.n;
    list.items[n].d = item.d;
	list.items[n].message = item.message;
	
    if (item.known) {
		list.known = true;
	}
	
	if (item.unknown) {
		list.unknown = true;
	}

	return list;
	
}


function engGetVTLContent(tokensList) {
	// checks content of the VTL (verified tokens list) for known and unknown tokens
    if (tokensList.known && !tokensList.unknown) {
        return true; //only known tokens;
    } else if (!tokensList.known && tokensList.unknown) {
        return false; //only unknown tokens
    } else if (!tokensList.known && !tokensList.unknown) {
        return null; //no has tokens
    } else {
        return undefined; //different tokens
    }
}


function engRunCL(commandsList, cbFunc) {
    var cb = function (ajxData) {
        if (commandsList.items.length == 0 && commandsList.idx >= commandsList.items.length) {
            return;
        }

        var progress = 100 * (commandsList.idx + 1) / commandsList.items.length;
        var r = engGetResponse(ajxData).message;

        if (r == 'OK' || r == 'IDX_NODN') {
            cbFunc(ajxData, commandsList.idx, progress);
            commandsList.idx++;
            commandsList.counter = 100;
        } else {
            commandsList.counter--;
            if (commandsList.counter < 0) {
                cbFunc(ajxData, commandsList.idx, progress);
                commandsList.items.length = 0;
            }
        }

        if (commandsList.items.length != 0 && commandsList.idx < commandsList.items.length) {
            engRunCL(commandsList, cbFunc)
        }
    }

    if (commandsList.items.length > 0 && commandsList.idx < commandsList.items.length) {
        ajxSendCommand(commandsList.items[commandsList.idx].cmd, cb, hasqdLed);
    } else if (commandsList.items.length === 0) {
        cbFunc('OK', 0, 0);
    }
}
