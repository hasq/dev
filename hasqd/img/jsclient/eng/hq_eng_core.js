// Hasq Technology Pty Ltd (C) 2013-2016

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
        var existingRec = engGetParsedResponseLast(data);
        var expectingRec = engGetNewRecord(existingRec.n, existingRec.s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);
        table.items[n].n = existingRec.n;
        table.items[n].d = existingRec.d;

        switch (engGetTokensState(existingRec, expectingRec)) {
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
        var r = engGetParsedResponse(data).message;

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
        ajxSendCommand(cmdsList.items[cmdsList.idx].cmd, cb, hasqdLed);
    } else if (cmdsList.items.length === 0) {
        cbFunc('OK', 0, 0);
    }
}
