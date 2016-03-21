
// progr must have functions
//  1   Set button according to g_searchOn
//  2   Show current file
//  3   Update results

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

    var retObj =
    {
    from : fromDate,
    to : toDate
    };

    return retObj;
}

function engSearchStop()
{
    var o = glSearch.o;
    var retObj =
    {
    from : o.fromDate,
    to : o.toDate
    };

    return retObj;
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
    var current_name = o.folders[0];

    // select the next number
    ++o.number;

    current_name = current_name + o.number;

    var current_file = "/smd.db"+ current_name + ".smd.txt";

    //console.log(current_name);
    //console.log(current_file);

    ajxSendCommand(current_file, searchGetFile, hasqLogo);

}

function searchGetFile(data)
{
    if (!glSearch.isOn)
        return;

    var o = glSearch.o;

    if( data.length<12 || data.substr(0,12) == "REQ_PATH_BAD" )
    {
        console.log(o.folders[0]+" : done");
        o.folders.shift(); // remove processed date
        o.number = 0;
    }
    else
        searchProcessFile(data);

    setTimeout(processDates,1);
}

function searchProcessFile(data)
{
    var o = glSearch.o;
    console.log("processing file "+o.folders[0]);

    var recs = data.split('\n');

    var list = {};

    for( var i in recs )
    {
        var s = recs[i];
        if( s.length < 10 ) continue;
        ///searchProcessRec(s);
        var a = s.split(' ');
        if( a.lingth < 3 ) continue;

        if( !(a[1] in list) )
        {
            list[a[1]] = { n:a[0], r:s };
            continue; 
        }

        var w = list[a[1]];
        if( parseInt(w.n) > parseInt(a[0]) ) continue;

        w.n = a[0];
        w.r = s;
    }

    for(var i in list)
        searchProcessRec(list[i].r);
}

function searchProcessRec(srec)
{
    console.log("searchProcessRec ["+srec+"]");
}
