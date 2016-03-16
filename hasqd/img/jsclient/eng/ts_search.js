var g_searchOn = false;
var g_fromDate; // remove later
var g_toDate;   // remove later
var g_search = {};
var g_result = {};

// progr must have functions
//  1   Set button according to g_searchOn
//  2   Show current file
//  3   Update results

function engSearchClick(fromDate, toDate, progr)
{
    g_searchOn = !g_searchOn;

    if( g_searchOn )
        return engSearchStart(fromDate, toDate);

    return engSearchStop();
}

function engSearchStart(fromDate, toDate, progr)
{
    g_search.progr = progr;
    g_fromDate = fromDate;
    g_toDate = toDate;

    g_search.folders = engGetDateRangeFolders(fromDate, toDate);
    console.log(g_search.folders);
    g_search.number = 0;

    // start process
    setTimeout(processDates,10);

    return {from:fromDate, to:toDate};
}

function engSearchStop()
{
    // hare cancel ajax request FIXME

    return {from:g_fromDate, to:g_toDate};
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
	
    while (toY >= 2016) 
	{
        if (toY == fromY && toM == fromM && toD == fromD) 
            break;
		
		if (toM == 0) 
			toM = 12;
		
        while (toM > 0) 
		{
            if (toD == 0) 
                toD = getD(toM, toY);

            while (toD > 0) 
			{
                var mm = (toM < 10) ? '0' + toM.toString() : toM.toString();
                var dd = (toD < 10) ? '0' + toD.toString() : toD.toString();
                var cmd = '/' + toY.toString() + '/' + mm + '/' + dd + '/' + toY.toString() + mm + dd + '-';

                r[r.length] = cmd;

				if (toY == fromY && toM == fromM && toD == fromD)
					break;
				
				toD--;
            }

            if (toY == fromY && toM == fromM && toD == fromD)
				break;

			toM--;
        }

        if (toY == fromY && toM == fromM && toD == fromD) 
			break;
		
		toY--;
    }

    return r;
}

function processDone()
{
    g_searchOn = false;
    g_search = {};
}

function processDates()
{
    if( !g_searchOn ) return;

    if( g_search.folders.length == 0 ) 
        return processDone();

    // pick the first date
    var current_name = g_search.folders[0];

    // select the next number
    ++g_search.number;

    current_name = current_name + g_search.number;

    var current_file = current_name + ".smd.txt";

    console.log(current_name);
    console.log(current_file);


    // FIXME request ajax

    // remove processed date
    //g_search.folders.shift();
}
