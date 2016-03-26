// Hasq Technology Pty Ltd (C) 2013-2016

function engSearchClick(fromDate, toDate, progr)
{
    glSearch.isOn = !glSearch.isOn;

    if (glSearch.isOn)
        return engSearchStart(fromDate, toDate, progr);

    return engSearchStop();
}

function engSearchStart(fromDate, toDate, progr)
{

    var o = glSearch.o;

    o.progr = progr;
    o.fromDate = fromDate;
    o.toDate = toDate;

    o.folders = engGetDateRangeFolders(fromDate, toDate);
    console.log(o.folders);
    o.number = 0;

    // start process
    setTimeout(processDates, 10);

    return { from : fromDate, to : toDate };
}

function engSearchStop()
{
    var o = glSearch.o;
    return { from : o.fromDate, to : o.toDate };
}

function engGetDateRangeFolders(fromDate, toDate)
{
    var r = [];
    var fromY = fromDate.getFullYear();
    var fromM = fromDate.getMonth() + 1;
    var fromD = fromDate.getDate();
    var toY = toDate.getFullYear();
    var toM = toDate.getMonth() + 1;
    var toD = toDate.getDate();

    var getD = function (month, year)
    {
        // returns the number of the days in a month
        var day;

        if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12)
            day = 31;

        if (month == 4 || month == 6 || month == 9 || month == 11 || month == 10 || month == 12)
            day = 30;

        if (month == 2)
            day = (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0)) ? 29 : 28;

        return day;
    }

    var slicePath = function (y, m, d)
    {
        var mm = (m < 10) ? '0' + m.toString() : m.toString();
        var dd = (d < 10) ? '0' + d.toString() : d.toString();
        var path = '/' + y.toString() + '/' + mm + '/' + dd + '/' + y.toString() + mm + dd + '-';

        return path;

    }

    while (toY >= 2016)
    {
        if (toM == 0)
            toM = 12;

        while (toM > 0)
        {
            if (toD == 0)
                toD = getD(toM, toY);

            while (toD > 0)
            {
                r[r.length] = slicePath(toY, toM, toD);

                if (toY == fromY && toM == fromM && toD == fromD)
                    return r;

                toD--;
            }

            toM--;
        }

        toY--;
    }

    return r;
}

function processDone()
{
    glSearch.isOn = false;
    g_search = {};
}

function processDates()
{
    if (!glSearch.isOn)
        return;

    var o = glSearch.o;

    if (o.folders.length == 0)
        return processDone();

    // pick the first date
    o.current_name = o.folders[0];

    // select the next number
    ++o.number;

    o.current_name = o.current_name + o.number;

    o.current_file = "/smd.db" + o.current_name + ".smd.txt";

    ///$('#current_slice_span').html(current_name + ".smd.txt");

    ajxSendCommand(o.current_file, searchGetFile, hasqLogo);
}

function searchGetFile(data)
{
    if (!glSearch.isOn)
        return;

    var o = glSearch.o;

    if ( data.length < 12 || data.substr(0, 12) == "REQ_PATH_BAD" )
    {
        console.log(o.folders[0] + " : done");

        ///$('#mine_search_results_div').html($('#mine_search_results_div').html() + '\n' + o.folders[0]);

        o.folders.shift(); // remove processed date
        o.number = 0;

        // FIXME
        // the problem that the slice can be started in the previous days
        // algorithm must:
        // 1. go one day past and process last slice
        // 2. if no slices then back to 1
    }
    else
        searchProcessFile(data);

    setTimeout(processDates, 1);
}

function searchProcessFile(data)
{
    var o = glSearch.o;
    console.log("processing file " + o.folders[0]);
    o.progr(2, o.current_name, o.current_file);

    var recs = data.split('\n');

    var list = {};

    for ( var i in recs )
    {
        var s = recs[i];
        if ( s.length < 10 ) continue;

        var a = s.split(' ');
        if ( a.length < 3 ) continue;

        if ( !(a[1] in list) )
        {
            list[a[1]] = { n:a[0], r:s };
            continue;
        }

        var w = list[a[1]];
        if ( parseInt(w.n) > parseInt(a[0]) ) continue;

        w.n = a[0];
        w.r = s;
    }

    for (var i in list)
        searchProcessRec(list[i].r);
}

function searchProcessRec(srec)
{
    var lr = engGetRespLast(srec);

    var nr = engGetNewRecord(lr.n, lr.s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);

    var st = engGetTokensStatus(lr, nr);

    console.log("searchProcessRec [" + srec + "] -> " + st);

    if ( st == "PWD_WRONG" ) return;

    var r = {};
    r.s = nr.s;
    r.n = lr.n;
    r.raw = "";
    r.check = st;
    r.state = 0;

    var v = glSearch.result;
    var index = v.length;
    v[index] = r;

    setTimeout(function() {searchValidate1(index)}, 1);
}

function searchValidate1(index)
{
    var v = glSearch.result;
    var res = v[index];

    var cmd = 'last' + '\u0020' + glCurrentDB.name + '\u0020' + res.s;

    ajxSendCommand(cmd, function(data) {searchValidate2(index, data)}, hasqLogo);
}

function searchValidate2(index, data)
{
    var resp = engGetResp(data);

    if (resp.msg === 'ERROR') return;
    if (resp.msg === 'IDX_NODN') return;

    var lr = engGetRespLast(data);
    var nr = engGetNewRecord(lr.n, lr.s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);
    var st = engGetTokensStatus(lr, nr);

    var res = glSearch.result[index];

    res.n = lr.n;

    switch (st)
    {
        case 'OK':        res.state = 1; break;
        case 'PWD_SNDNG': res.state = 2; break;
        case 'PWD_RCVNG': res.state = 3; break;
        case 'PWD_WRONG': res.state = 4; break;
    }

    glSearch.o.progr(3);

    // FIXME find RawDN update result and request result update again
    //var cmd = 'last' + '\u0020' + glCurrentDB.name + '\u0020' + res.s;
    //ajxSendCommand(cmd, function(data){searchValidate3(index,data)}, hasqLogo);
}
