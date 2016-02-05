// Hasq Technology Pty Ltd (C) 2013-2016

function HasqdLed() {
    //this.counter = 0;
}

HasqdLed.prototype.fail = function() {
    $('#hasqd_led').html(picRed);
    widShowLog('Server connection failure!');
};

HasqdLed.prototype.inc = function() {
    setTimeout(function() { $('#hasqd_led').html(picGryGrn); }, 500);
};

HasqdLed.prototype.dec = function() {
    setTimeout(function() { $('#hasqd_led').html(picGry); }, 500);
};

var hasqdLed = new HasqdLed();

function widAnimateProgbar() {
    $('#hasqd_led').html(picGry);
}

function widSendPing(timeDelay) {
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
			var ping = function() {widSendPing(timeDelay)};
			glPingTimerId = setTimeout(ping, timeDelay);
			clearInterval(timerId);			
		}
	}
	
	ajxSendCommand('ping', cb, hasqdLed)
}

function widSendDeferredRequest(cmd, t, f) {
// It sends ajax request with 1000ms delay.
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

function widSetDefaultDb(dbHash) {
// Searching for database and save it in variable.
    var cb = function (d) {
        var db = engGetParsedResponseInfoDb(d);
        
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

function widStringsGrow(s, l) {
// workaround for html...
	var r = '';
	
	for (var i = 0; i < l; i++) {
		r += s;
	}
	
	return r;
}

function widGetToken(d, h) {
//It returns hash of raw tokens value
	if (engIsHash(d, h)) {
		var r = d;
	} else {
		var r = engGetHash(d, h)
	}
	
	return r;
}

function widEnDisPasswordInput(d) {
// It enable/disable passwords field.
	var obj = $('#' + 'password_input');
	if (d.length !== 0) {
		obj.attr('disabled', false);
	} else {
		obj.attr('disabled', true);
	}
}

function widShowLog(d) {
// Shows messages in log
	var obj = $('#' + 'tokens_log_pre');
	if (arguments.length === 0) {
		obj.html('&nbsp');
	} else {
		obj.html(d);
	}
}

function widShowData(d) {
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

function widShowToken() {
// Shows hashed value of token (if the value is not a default hash)
	var objT = $('#token_value_td');
	var objH = $('#token_hint_input');
	var hint = objH.val();
	
	if (hint.length == 0) {
		objT.html(widStringsGrow('&nbsp',32));
		return;
	} else if (engIsHash(hint, glCurrentDB.hash)) {
		objT.html(widStringsGrow('&nbsp',32));
	} else {
		var s = widGetToken(hint, glCurrentDB.hash);
		objT.html(s);
	}	
}

function widSetLastRecChanges(d) {
	glLastRec = engGetParsedResponseLast(d);
	
	if (glLastRec.message === 'OK') {
		widShowTokenState(true);
		widShowPasswordMatch(glLastRec);
		widShowPasswordGuessTime(widGetPasswordGuessTime(glPassword));
		widShowData(engGetOutParsedDataValue(glLastRec.d));
	} else if (glLastRec.message === 'IDX_NODN') {
		widShowTokenState(false);
		widShowPasswordMatch();
		widShowData();
	}
}

function widShowTokenState(d) {
// Shows message or image about tokens existense.
	var obj = $('#token_pic_td');
	
	if (arguments.length === 0) {
		obj.empty();
		widShowLog();
	} else if (d === null) {
		obj.html(picL12);
		widShowLog('Searching for token...');
	} else if (d === true) {
		widShowLog('Token exists.');
		obj.empty();		
	} else if (d === false) {
		obj.empty();
		widShowLog('No such token.');		
	} 
}

function widTokenHintOninput(id) {
// Events when tokens value changed.
	clearTimeout(glTimerId);
	glLastRec = {};
	widShowLog(); //clear log
	widShowData(); //clear and hide data field
	widShowTokenState(null); // show animation
	
	var obj = $('#token_hint_input');
	var hint = obj.val();
	glLastRec = {};
	
	//widEnDisPasswordInput(hint);	
	widShowToken();	
 	if (hint.length > 0) {
		var s = widGetToken(hint, glCurrentDB.hash);
		var cmd = 'last' + ' ' + glCurrentDB.name + ' ' + s;
		widSendDeferredRequest(cmd, 1000, widSetLastRecChanges);
	} else {
		widShowTokenState();
		widShowPasswordMatch();
	}
}
				
				
function widTokensPasswordOninput() {
// Events when passwords value changed.
	glPassword = $('#password_input').val();
	
	if (glPassword.length == 0) {
		widShowPasswordMatch();
		widShowPasswordGuessTime();
	} else if (glLastRec.message === 'OK') {
		widShowPasswordMatch(glLastRec);
		widShowPasswordGuessTime(widGetPasswordGuessTime(glPassword));
	} else {
		widShowPasswordMatch();
		widShowPasswordGuessTime(widGetPasswordGuessTime(glPassword));
	} 
}

function widGetPasswordPicture(d) {
// Returns an image displaying the password match
	switch (d) {
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

function widShowPasswordMatch(lr) {
// Shows an image displaying the password match
	var objT = $('#password_pic_td');
	var objI = $('#password_input');
	
	if (arguments.length !== 0 && objI.val() !== '') {
		var nr = engGetNewRecord(lr.n, lr.s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);
		var p = engGetTokensState(lr, nr);
		var pic = widGetPasswordPicture(p);
		objT.html(pic);
	} else {
		objT.empty();
		//objI.val('');
	}
}

function widGetPasswordGuessTime(d) {
// Returns guess time of specified password
	if (String(d).length === 0) {
		return '';
	} else {
		var r = zxcvbn(d);
		return 'Guess time: ' + r.crack_times_display.offline_slow_hashing_1e4_per_second;		
	}
}

function widShowPasswordGuessTime(d) {
// Shows password guess time
	var obj = $('#password_zxcvbn_td');
	
	if (arguments.length !== 0 && String(d).length > 0) {
		obj.html(d);			
	} else {
		obj.empty();
	}
}


function widDisableInitialDataUI(f) {
// Disables UI
	var obj = $('#initial_data_table');
	
	if (arguments.length == 0 ) { var f = true; }
	
	obj.find('input').prop('disabled', f); //closest('table[id^="initial"]').
}


function widDisableTabsUI(f) {
// To enable/disable specified selectors into the tabs area
	var obj = $('#tabs_div');
	
	if (arguments.length == 0) { var f = true; }

	obj.find('button, input, textarea').prop('disabled', f);			
}

function widGetInitialDataState() {
// Returns state of initial data	
	var objT = $('#token_hint_input');
	var objP = $('#password_input');
	var r = {};
	r.message = false;
	r.content = '';
	
	if (objT.val() == '') {
		r.message = false;
		r.content = 'Empty token value.';
	} else if (objP.val() == '') {
		r.message = false;
		r.content = 'Empty token password.';		
	} else {
		r.message = true;
		r.content = '&nbsp';	
	}
	return r;
}

function widButtonClick(id) {
// Shared button click function
	var obj = $('#' + id);
	var f = obj.attr('data-onclick');
	
	widDisableInitialDataUI();
	widDisableTabsUI();
	
	eval(f);
}

function widCompleteEvent(t) {
// Completes actions and enables UI
	widDisableInitialDataUI(false);
	widDisableTabsUI(false);
	widShowLog(t);
}

function widCreateButtonClick() {
// Creates a new token record
	var objT = $('#token_hint_input');
	var objP = $('#password_input');
	var s = engGetHash(objT.val(), glCurrentDB.hash);
	var e = widGetInitialDataState();
	
	if (glLastRec.message === 'OK') {
		widCompleteEvent('Token already exists.');
		return;
	} else if (!e.message) {
		widCompleteEvent(e.content);
		return;	
	} else if (glLastRec.message === undefined) {
		widCompleteEvent('');
		return;	
	}
	
	var nr = engGetNewRecord(0, s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);
	var nr_d = (objT.val().length <= 160) ? '[' + objT.val() + ']' : '';
    var cmd = 'z * ' + glCurrentDB.name + ' 0 ' + s + ' ' + nr.k + ' ' + nr.g + ' ' + nr.o + ' ' + nr_d;
	
	var cb = function(d) {
		var r = engGetParsedResponse(d);
		if (r.message == 'OK') {
			widCompleteEvent(r.message);
			widTokenHintOninput();
		} else {
			widCompleteEvent(r.message + ': ' + r.content);
		}
	}
	
	var f = function() { ajxSendCommand(cmd, cb, hasqdLed);}
	
	setTimeout(f, 1000);
	widShowLog('Creating token...');
}

function widSetDataButtonClick() {
// Adds a new record with a specified data
	var objT = $('#token_hint_input');
	var objP = $('#password_input');
	var objP = $('#setdata_textarea');
	
	var e = widGetInitialDataState();
	
	if (glLastRec.message !== 'OK') {
		widCompleteEvent('First create a token.');
		return;
	} else if (!e.message) {
		widCompleteEvent(e.content);
		return;
	}
	
	var s = engGetHash(objT.val(), glCurrentDB.hash);
	var nr = engGetNewRecord(glLastRec.n + 1, s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);
	var nr_d = engGetInParsedDataValue(objP.val());
    var cmd = 'add * ' + glCurrentDB.name + ' ' + nr.n + ' ' + s + ' ' + nr.k + ' ' + nr.g + ' ' + nr.o + ' ' + nr_d;
	
	var cb = function(d) {
		var r = engGetParsedResponse(d);
		if (r.message == 'OK') {
			widCompleteEvent(r.message);
			widTokenHintOninput();
		} else {
			widCompleteEvent(r.message + ': ' + r.content);
		}
	}
	
	var f = function() { ajxSendCommand(cmd, cb, hasqdLed) }
	
	setTimeout(f, 1000);
	widShowLog('Setting token data...');
}

/*
function widGetCurrentDate(){
	var date = new Date();
	var y = date.getFullYear();
	var m = (date.getMonth() < 10) ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
	var d = (date.getDate() < 10) ? '0' + date.getDate() : date.getDate();
	var r = y + '/' + m + '/' + d;
	return r;
}
*/

function widSearchButtonClick(){
	var objFrom = $('#from_datepicker_input');
	var objTo = $('#to_datepicker_input');
	
	var fromDate = new Date(objFrom.datepicker('getDate'));
	var toDate = new Date(objTo.datepicker('getDate'));
	
	var fromY = fromDate.getFullYear();
	var fromM = fromDate.getMonth() + 1;
	var fromD = fromDate.getDate();
	
	var toY = toDate.getFullYear();
	var toM = toDate.getMonth() + 1;
	var toD = toDate.getDate();
	
	var cbY = function callBackY (dY) {
		var rY = engGetParsedResponse(dY);
		
		if (rY.content != 'REQ_PATH_BAD') {
			var cbM = function callBackM(dM) {
				var rM = engGetParsedResponse(dM);
				if (rM.content != 'REQ_PATH_BAD') {
					console.log(rM.content);
				} else {
					toM--;
					if (toM >= fromM) {
						var cmdM = cmdM = '/' + glCurrentDB.name + '/' + toY + '/' + toM + '/';
						ajxSendCommand(cmdM, cbM, hasqdLed);
					}
				}				
			}		
			var cmdM = '/' + glCurrentDB.name + '/' + toY + '/' + toM + '/';
			ajxSendCommand(cmdM, cbM, hasqdLed);			
		} else {
			toY--;
			if (toY >= fromY) {
				var cmdY = '/' + glCurrentDB.name + '/' + toY + '/';
				ajxSendCommand(cmdY, callBackY, hasqdLed);
			}
		}
	}
	
	var cmdY = '/' + glCurrentDB.name + '/' + toY + '/';	
	ajxSendCommand(cmdY, cbY, hasqdLed);

}

