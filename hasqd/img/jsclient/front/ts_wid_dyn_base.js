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

function widGetHashedValue(d, h){
//It returns hash of raw tokens value
	if (engIsHash(d, h)) {
		var r = d;
	} else {
		var r = engGetHash(d, h)
	}
	
	return r;
}

function widEnDisPasswordInput(data){
// It enable/disable passwords field.
	var obj = $('#' + 'tokens_password_input');
	if (data.length !== 0) {
		obj.attr('disabled', false);
	} else {
		obj.attr('disabled', true);
	}
}

function widShowLog(data){
	var obj = $('#' + 'tokens_log_pre');
	if (arguments.length === 0) {
		obj.html('&nbsp');
	} else {
		obj.html(data);
	}
}

function widShowData(data){
	var obj = $('#' + 'tokens_data_pre'); 
	
	if (arguments.length === 0) {
		obj.hide();	
		obj.empty();
	} else {
		obj.show();	
		obj.html(data);
	}
}

function widShowTokensHashedVal(id){
// It shows a hashed value of the token, if the value is not a hashed 
	//var nextTdId = $('#' + id).closest('td').next('td').attr('id'); //find id of the next <td> 
	//var objH = $('#' + nextTdId);
	var objH = $('#tokens_hashed_value_td');
	
	var objR = $('#' + id);
	var rt = objR.val();
	
	if (rt == ''){
		objH.html(widStringsGrow('&nbsp',32));
		return;
	} else if (engIsHash(rt, glDataBase.hash)) {
		objH.html(widStringsGrow('&nbsp',32));
	} else {
		var s = widGetHashedValue(rt, glDataBase.hash);
		objH.html(s);
	}	
}

function widGetDatabase(dbHash){
	
    var cb = function (data) {
        var db = engGetInfoDb(data);
        
		if (db.length < 1) {
            return 'No database!';
        }
		
		for (var i = 0; i < db.length; i++) {
			if (db[i].hash === dbHash) {
				glDataBase = db[i];
				break;
			}
		}

		if (glDataBase.name === undefined) {
			widShowLog('No database!');
		}		
     }

    ajxSendCommand('info db', cb, hasqdLed);	
}

function widShowTokensState(data){
	widShowTokensExistence(data);
	var lr = engGetLastRecord(data);
	var nr = engGetNewRecord(lr.n, lr.s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);
	var p = widGetTokensState();
}

function widShowTokensExistence(data){
	var r = engGetLastRecord(data);
	
	if (r.message === 'OK'){
		widShowLog('Token exists.');
		var tokensData = r.d;
		if (tokensData.length > 0) {
			widShowData(engGetParsedDataValue(r.d));
		}
	} else if (r.message === 'IDX_NODN'){
		widShowData();
		widShowLog('No such token.');
	}	
}

function widTokensValueOninput(id){
	clearTimeout(glTimerId);
	widShowLog();
	widShowData();
	
	var obj = $('#' + id);
	var rt = obj.val();
	
	widEnDisPasswordInput(rt);	
	widShowTokensHashedVal(id);
	
	if (rt.length > 0) {
		var s = widGetHashedValue(rt, glDataBase.hash);
		var cmd = 'last' + ' ' + glDataBase.name + ' ' + s;
		widSendDeferredRequest(cmd, 1000, widShowTokensExistence);
	}
}
				
				
function widSendDeferredRequest(cmd, t, f){
// It sends request for last data with 1000ms delay .
// the request will be ignored if token value will be changed during this 1000ms
	var req = function(){
		var timerId = glTimerId;
		
		var cb = function(data){
			if (timerId === glTimerId){
				f(data);
			} 
			clearTimeout(timerId);
		}	
		
		ajxSendCommand(cmd, cb, hasqdLed);
	}
	
	glTimerId = setTimeout(req, t);	
}


function widTokensPasswordOninput(id){
	
	return;
}




