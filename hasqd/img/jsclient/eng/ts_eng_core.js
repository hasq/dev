function engDoNothing() {
    return true;
}

function engSendDeferredRequest(cmd, t, f) {
    // Sends ajax request with 1000ms delay.
    // the request will be ignored if token value will be changed during this 1000ms
    var req = function () {
        var timerId = glTimerId;

        var cb = function (data) {
            if (timerId === glTimerId) f(data);
            clearTimeout(timerId);
        }
        ajxSendCommand(cmd, cb, hasqLogo);
    }
    glTimerId = setTimeout(req, t);
}

function engGetDateRangeFolders(fromDate, toDate) {
    var r = [];
    var fromY = fromDate.getFullYear();
    var fromM = fromDate.getMonth() + 1;
    var fromD = fromDate.getDate();
    var toY = toDate.getFullYear();
    var toM = toDate.getMonth() + 1;
    var toD = toDate.getDate();

	var getD = function engGetDaysNumber(month, year){
		// returns the number of the days in a month
		var day;
		
		if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
			day = 31;
		} else if (month == 4 || month == 6 || month == 9 || month == 11 || month == 10 || month == 12) {
			day = 30;
		} else if (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0)) {
			day = 29;
		} else {
			day = 28;
		}
		return day;
	}
	
    while (toY >= 2016) {
        if (toY == fromY && toM == fromM && toD == fromD) {
            break;
        } else if (toM == 0) {
            toM = 12;
        }
        while (toM > 0) {
            if (toD == 0) {
				toD = engGetDaysNumber(toM, toY);				
            }
            while (toD > 0) {
                var mm = (toM < 10) ? '0' + toM.toString() : toM.toString();
                var dd = (toD < 10) ? '0' + toD.toString() : toD.toString();
                var cmd = '/' + toY.toString() + '/' + mm + '/' + dd + '/' + toY.toString() + mm + dd + '-';

                r[r.length] = cmd;

                if (toY == fromY && toM == fromM && toD == fromD) {
                    break;
                } else {
                    toD--;
                }

            }

            if (toY == fromY && toM == fromM && toD == fromD) {
                break;
            } else {
                toM--;
            }
        }

        if (toY == fromY && toM == fromM && toD == fromD) {
            break;
        } else {
            toY--;
        }
    }

    return r;
}
