// Hasq Technology Pty Ltd (C) 2013-2016

function engGetTokenInfo(data, r, s)
{
    var item = {};
    item.raw = r;
    item.s = s;
    item.fit = false;
    item.unfit = false;

    if (engGetResponseHeader(data) === 'OK')
    {
        var lr = engGetParsedRecord(data);
        var nr = engGetRecord(lr.n, lr.s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);
        item.n = lr.n;
        item.d = lr.d;
        item.fit = false;
        item.unfit = false;
        item.state = engGetTokensStatus(lr, nr);
        switch (item.state)
        {
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
    }
    else
    {
        item.state = 'IDX_NODN';
        item.unfit = true;
        item.n = -1;
        item.d = '';
    }

    return item;
}

function engRunCmdList(cmdList, cbFunc)
{
    var cb = function (ajxData)
    {
        if (cmdList.items.length == 0 && cmdList.idx >= cmdList.items.length) return;

        var progress = ((cmdList.idx + 1) / cmdList.items.length) * 100;
        var r = engGetResponseHeader(ajxData);

        if (r === 'OK' || r === 'IDX_NODN')
        {
            cbFunc(ajxData, cmdList.idx, progress);
            cmdList.idx++;
            cmdList.counter = 100;
        }
        else
        {
            cmdList.counter--;
            if (cmdList.counter === 0)
            {
                cmdList.idx++;
                cmdList.counter = 100;
                cbFunc(ajxData, cmdList.idx, progress);
            }
        }

        if (cmdList.items.length != 0 && cmdList.idx < cmdList.items.length)
            engRunCmdList(cmdList, cbFunc)
        }

    if (cmdList.items.length > 0 && cmdList.idx < cmdList.items.length)
        ajxSendCommand(cmdList.items[cmdList.idx].cmd, cb, hasqLogo);
    else if (cmdList.items.length === 0)
        cbFunc('OK', 0, 0);
}
