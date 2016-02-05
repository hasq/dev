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
		
		if (response.message === 'OK') {
			//var now = new Date()
			//var ct = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + '.' + now.getMilliseconds();
			//console.log(ct);
			var ping = function() {engSendPing(timeDelay)};
			glPingTimerId = setTimeout(ping, timeDelay);
			clearInterval(timerId);			
		}
	}
	
	ajxSendCommand('ping', cb, hasqdLed)
}