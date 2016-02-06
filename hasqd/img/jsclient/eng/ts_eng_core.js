function engDoNothing() {
	return true;
}

function engSendDeferredRequest(cmd, t, f) {
// Sends ajax request with 1000ms delay.
// the request will be ignored if token value will be changed during this 1000ms
	var req = function() {
		var timerId = glTimerId;
		
		var cb = function(data) {
			if (timerId === glTimerId) {
				f(data);
			} 
			clearTimeout(timerId);
		}	
		
		ajxSendCommand(cmd, cb, hasqdLed);
	}
	
	glTimerId = setTimeout(req, t);	
}

function engSendPing(timeDelay) {
// Ping server every 5s,10s,15s,...,60s,...,60s,...
	var timerId = glPingTimerId;
	
	if ( timeDelay < 60000 ) {
		timeDelay += 5000;
	} 

	var cb = function(data) {
		var response = engGetParsedResponse(data);
		
		//var now = new Date();
		//var ct = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + '.' + now.getMilliseconds();
		//console.log(ct);
		
		var ping = function() {engSendPing(timeDelay)};
		glPingTimerId = setTimeout(ping, timeDelay);
		clearInterval(timerId);	
	}
	
	ajxSendCommand('ping', cb, hasqdLed)
}

function engGetDateRangeFolders(fromDate, toDate) {
	var r = [];
	var fromY = fromDate.getFullYear();
	var fromM = fromDate.getMonth() + 1;
	var fromD = fromDate.getDate();
	var toY = toDate.getFullYear();
	var toM = toDate.getMonth() + 1;
	var toD = toDate.getDate();

	while (toY >= 2016) {
		if (toY == fromY && toM == fromM && toD == fromD){
			break;
		} else if (toM == 0) {
			toM = 12;
		}
		
		while (toM > 0) {
			if (toD == 0) {
				// fills days count in month
				if (toM == 1 || toM == 3 ||toM == 5 ||toM == 7 ||toM == 8 ||toM == 10 ||toM == 12) {
					toD = 31;
				} else if (toM == 4 ||toM == 6 ||toM == 9 ||toM == 11 ||toM == 10 ||toM == 12) {
					toD = 30;
				} else if (toY % 400 == 0 || (toY % 4 == 0 && toY % 100 != 0)) {
					toD = 29;
				} else {
					toD = 28;
				}				
			}
			while (toD > 0) {
				var mm = (toM < 10) ? '0' + toM.toString() : toM.toString();
				var dd = (toD < 10) ? '0' + toD.toString() : toD.toString();
				var cmd = '/' + toY.toString() + '/' + mm + '/' + dd + '/';
				
				r[r.length] = cmd;
				
				if (toY == fromY && toM == fromM && toD == fromD) {
					break;
				} else {
					toD--;
				}
				
			}
			
			if (toY == fromY && toM == fromM && toD == fromD){
				break;
			} else {
				toM--;
			}			
		}
		
		if (toY == fromY && toM == fromM && toD == fromD){
			break;
		} else {
			toY--;
		}		
	}

	return r;
}