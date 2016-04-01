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

    o.outsideRangeDone = false;

    o.sliceFrom = engGetSliceDate(fromDate);
    o.sliceDate = engGetSliceDate(toDate);

    console.log(o.sliceDate.name());
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

function calendarDays(year, month)
{
    // returns the number of the days in a month
    var day = 0;

    if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12)
        day = 31;

    if (month == 4 || month == 6 || month == 9 || month == 11 || month == 10 || month == 12)
        day = 30;

    if (month == 2)
        day = (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0)) ? 29 : 28;

    return day;
}

function engGetSliceDate(toDate)
{
    var toY = toDate.getFullYear();
    var toM = toDate.getMonth() + 1;
    var toD = toDate.getDate();

    var name = function() { return this.y4 + this.mm + this.dd; };
    var path = function(n)
    {
        var v = '/' + this.y4 + '/' + this.mm + '/' + this.dd + '/';
        v = "/" + glCurrentDB.name + v;
        v += this.name() + '-' + n + "." + glCurrentDB.hash + ".txt";
        return v;
    };

    var earlierDay = function ()
    {
        var dd = +this.dd;
        var mm = +this.mm;
        var yy = +this.y4;

        if ( --dd == 0)
        {
            if ( --mm == 0)
            {
                yy = yy - 1;
                mm = 12;
                dd = calendarDays(yy, mm);
            }
            else
            {
                dd = calendarDays(yy, mm);
            }
        }

        this.y4 = yy.toString();

        var s2 = function(x) { return (x < 10) ? '0' + x.toString() : x.toString(); };
        this.mm = s2(mm);
        this.dd = s2(dd);
    };


    var sliceObj = { name : name, path : path, previous : earlierDay };
    sliceObj.y4 = +toY;
    sliceObj.mm = +toM;
    sliceObj.dd = +toD + 1;
    sliceObj.previous();

    console.log("sliceObj generated : " + sliceObj);
    return sliceObj;
}

function processDone()
{
    glSearch.isOn = false;
}

function processDates()
{
    if (!glSearch.isOn)
        return;

    var o = glSearch.o;

    var name = o.sliceDate.path(++o.number);

    console.log(name);

    ajxSendCommand(name, searchGetFile, hasqLogo);
}

function searchGetFile(data)
{
    if (!glSearch.isOn)
        return;

    var o = glSearch.o;

    if ( data.length < 12 || data.substr(0, 12) == "REQ_PATH_BAD" )
    {
        console.log(o.sliceDate.name() + " : done");

        // outside
        if ( o.sliceDate.name() < o.sliceFrom.name() )
        {
            if ( o.outsideRangeDone ) processDone();
            else if ( o.number > 1 ) o.outsideRangeDone = true;
        }

        o.sliceDate.previous();
        o.number = 0;
        console.log(o.sliceDate.name() + " : new");

        if ( +o.sliceDate.y4 < 2016 ) processDone();
    }
    else
        searchProcessFile(data);

    setTimeout(processDates, 1);
}

function searchProcessFile(data)
{
    var o = glSearch.o;
    console.log("processing file " + o.sliceDate.name());
    o.progr(2, o.sliceDate.name(), o.sliceDate.path(o.number));

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
    var lr = engGetParsedRecord(srec);

    var nr = engGetRecord(lr.n, lr.s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);

    var st = engGetTokensStatus(lr, nr);

    console.log("searchProcessRec [" + srec + "] -> " + st);

    if ( st == "PWD_WRONG" ) return;

    var r = {};
    r.s = nr.s;
    r.n = lr.n;
    r.raw = "";
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
    var resp = engGetResponseHeader(data);

    if (resp !== 'OK' && resp !== 'IDX_NODN') return;

    var lr = engGetParsedRecord(data);
    var nr = engGetRecord(lr.n, lr.s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);
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
}
