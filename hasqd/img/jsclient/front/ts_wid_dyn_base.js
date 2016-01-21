// Hasq Technology Pty Ltd (C) 2013-2016

function HasqdLed(){
    //this.counter = 0;
}

HasqdLed.prototype.fail = function(){
    $('#hasqd_led').html(picRed);
    alert('Connection failed!');
};

HasqdLed.prototype.inc = function(){
    setTimeout(function(){ $('#hasqd_led').html(picGryGrn); }, 500);
};

HasqdLed.prototype.dec = function(){
    setTimeout(function(){ $('#hasqd_led').html(picGry); }, 500);
};

var hasqdLed = new HasqdLed();

function widAnimateProgbar(){
    $('#hasqd_led').html(picGry);
}

function widPing(timeDelay){
	var timerId = glPingTimerId;
	
	if ( timeDelay < 60000 ){
		timeDelay += 5000;
	}

	var cb = function(data){
		var response = engGetHasqdResponse(data);
		
		if (response.message === 'OK'){
			//var now = new Date()
			//var ct = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + '.' + now.getMilliseconds();
			//console.log(ct);
			var ping = function(){widPing(timeDelay)};
			glPingTimerId = setTimeout(ping, timeDelay);
			clearInterval(timerId);			
		}
	}
	
	ajxSendCommand('ping', cb, hasqdLed)
}

function widStringsGrow(string, l){
//
	var r = '';
	
	for (var i = 0; i < l; i++){
		r += string;
	}
	
	return r;
}

function widGetTokens(data){
//It returns hash of raw tokens value
	if (engIsHash(data, glDbHash)) {
		var r = data;
	} else {
		var r = engGetHash(data, glDbHash)
	}
	
	return r;
}

function widTokensValueOninput(id){
	clearTimeout(glTimerId);

	var objTokensRawValue = $('#' + id);
	var rt = objTokensRawValue.val();
	var s = widGetTokens(rt);

	widShowTokensHashedVal(id);
	widLastDataReq(s);
}

function widShowTokensHashedVal(id){
// It shows a hashed value of the token, if the value is not a hashed 
	var nextTdId = $('#' + id).closest('td').next('td').attr('id'); //find id of the next <td> 
	var objTokensHashedValueTd = $('#' + nextTdId);
	var objTokensRawValue = $('#' + id);
	
	var rt = objTokensRawValue.val();
	
	if (rt == ''){
		objTokensHashedValueTd.html(widStringsGrow('&nbsp',32));
		return;
	} else if (engIsHash(rt, glDbHash)) {
		objTokensHashedValueTd.html(widStringsGrow('&nbsp',32));
	} else {
		var s = widGetTokens(rt);
		objTokensHashedValueTd.html(s);
	}	
}

function widLastDataReq(s){
// It get the request for last data with 1000ms delay .
// the request will be ignored if token value will be changed during this 1000ms
	var cmd = 'last' + ' ' + glDataBase + ' ' + s;
	var objTokensDataDiv = $('#' + 'tokens_data_div');
	var objTokensDataPre = $('#' + 'tokens_data_pre');
	objTokensDataDiv.hide();	
	objTokensDataPre.html();
	
	var req = function(){
		var timerId = glTimerId;
		
		var cb = function(data){
			if (timerId === glTimerId){
				var r = engGetLastRecord(data);

				if (r.message === 'OK'){
					var tokensData = r.d;
					if (tokensData.length > 0) {
						objTokensDataDiv.show();
						objTokensDataPre.html(engGetParsedDataValue(r.d));
					}
				} else if (r.message === 'IDX_NODN'){
					objTokensDataDiv.show();
					objTokensDataPre.html('No such token');
				}
			} else {
				clearTimeout(timerId);
			}
		}		
		ajxSendCommand(cmd, cb, hasqdLed);
	}
	
	glTimerId = setTimeout(req, 1000);	
}
