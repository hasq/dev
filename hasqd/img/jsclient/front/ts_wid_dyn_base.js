// Hasq Technology Pty Ltd (C) 2013-2016

function HasqdLed(){
    //this.counter = 0;
}

HasqdLed.prototype.fail = function(){
    $('#hasqd_led').html(picRed);
    widShowLog('Server connection failure!');
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
// Ping server every 5s,10s,15s,...,60s,...,60s,...
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

function widSetDefaultDb(dbHash){
// Searching for database and save it in variable.
    var cb = function (d) {
        var db = engGetInfoDb(d);
        
		if (db.length < 1) {
            widShowLog('Database is not availible!');
        }
		
		for (var i = 0; i < db.length; i++) {
			if (db[i].hash === dbHash) {
				glCurrentDB = db[i];
				break;
			}
		}
		
		if (glCurrentDB.name === undefined) {
			widShowLog('Database is not availible!');
		}		
     }

    ajxSendCommand('info db', cb, hasqdLed);	
}

function widStringsGrow(s, l){
// workaround for html...
	var r = '';
	
	for (var i = 0; i < l; i++){
		r += s;
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

function widEnDisPasswordInput(d){
// It enable/disable passwords field.
	var obj = $('#' + 'tokens_password_input');
	if (d.length !== 0) {
		obj.attr('disabled', false);
	} else {
		obj.attr('disabled', true);
	}
}

function widShowLog(d){
	var obj = $('#' + 'tokens_log_pre');
	if (arguments.length === 0) {
		obj.html('&nbsp');
	} else {
		obj.html(d);
	}
}

function widShowData(d){
// Shows tokens data field if it length greater then zero.
	var obj = $('#' + 'tokens_data_pre'); 
	if (arguments.length === 0) {
		obj.hide();	
		obj.empty();
	} else if (String(d).length > 0) {
		obj.show();	
		obj.html(d);
	} else {
		obj.hide();	
		obj.empty();
	}
}

function widShowTokensHashedVal(id){
// Shows hashed value of token (if the value is not a default hash)
	//var nextTdId = $('#' + id).closest('td').next('td').attr('id'); //find id of the next <td> 
	//var objH = $('#' + nextTdId);
	var objH = $('#tokens_hashed_value_td');
	var objR = $('#' + id);
	var rt = objR.val();
	
	if (rt.length == 0){
		objH.html(widStringsGrow('&nbsp',32));
		return;
	} else if (engIsHash(rt, glCurrentDB.hash)) {
		objH.html(widStringsGrow('&nbsp',32));
	} else {
		var s = widGetHashedValue(rt, glCurrentDB.hash);
		objH.html(s);
	}	
}

function widShowTokenLastRecords(d){
	glLastRec = engGetLastRecord(d);
	
	if (glLastRec.message === 'OK'){
		widShowTokensExistence(true);
		widShowPasswordMatch(glLastRec);
		widShowData(engGetParsedDataValue(glLastRec.d));
	} else if (glLastRec.message === 'IDX_NODN'){
		widShowTokensExistence(false);
		widShowPasswordMatch();
		widShowData();
	}
}

function widGetPasswordPicture(d){
	switch (d){
		case 1:
			return picGrn;
			break;
		case 2:
			return picYlwGrn;
			break;
		case 3:
			return picGrnYlw;
			break;
		default:
			return picRed;
			break;
	}
}

function widShowPasswordMatch(lr){
	var objT = $('#password_pic_td');
	var objI = $('#tokens_password_input');
	
	if (arguments.length !== 0 && objI.val() !== '') {
		var nr = engGetNewRecord(lr.n, lr.s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);
		var p = engGetTokensState(lr, nr);
		var pic = widGetPasswordPicture(p);
		objT.html(pic);
	} else {
		objT.empty();
	}
}

function widShowTokensExistence(d){
// Shows message or image about tokens existense.
	var obj = $('#token_pic_td');
	
	if (arguments.length === 0) {
		obj.empty();
	} else if (d === null) {
		obj.html(picL12);
	} else if (d === true) {
		widShowLog('Token exists.');
		obj.html(picGrn);		
	} else if (d === false){
		obj.html(picRed);
		widShowLog('No such token.');		
	} 
}

function widGetZxcvbnResponse(d){
	var r = zxcvbn(d);
	return 'Guess time: ' + r.crack_times_display.offline_slow_hashing_1e4_per_second;		
}

function widTokensValueOninput(id){
// Events when tokens value changed.
	clearTimeout(glTimerId);
	widShowLog();
	widShowData();
	widShowTokensExistence(null);
	
	var obj = $('#' + id);
	var rt = obj.val();
	glLastRec = {};
	
	widEnDisPasswordInput(rt);	
	widShowTokensHashedVal(id);
	
	if (rt.length > 0) {
		var s = widGetHashedValue(rt, glCurrentDB.hash);
		var cmd = 'last' + ' ' + glCurrentDB.name + ' ' + s;
		widSendDeferredRequest(cmd, 1000, widShowTokenLastRecords);
	} else {
		widShowTokensExistence();
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
// Events when passwords value changed.
	var obj = $('#password_zxcvbn_td');
	
	glPassword = $('#' + id).val();
	obj.html(widGetZxcvbnResponse(glPassword));
	
	if (glLastRec.message === 'OK') {
		widShowPasswordMatch(glLastRec);
	} else {
		widShowPasswordMatch();
	}
}




