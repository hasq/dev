// Hasq Technology Pty Ltd (C) 2013-2016

function HasqdLed() {
    //this.counter = 0;
}

HasqdLed.prototype.fail = function () {
    $('#hasqd_led').html(picRed);
    widShowLog('Server connection failure!');
};

HasqdLed.prototype.inc = function () {
    setTimeout(function () {
        $('#hasqd_led').html(picGryGrn);
    }, 500);
};

HasqdLed.prototype.dec = function () {
    setTimeout(function () {
        $('#hasqd_led').html(picGry);
    }, 500);
};

var hasqdLed = new HasqdLed();

function TextArea() {}

TextArea.prototype.val = function (jqObj, data) {
	if (typeof data == 'undefined') return jqText.val();
	return jqObj.val(jqObj.val() + data);
}

TextArea.prototype.empty = function (jqObj) {
	return jqObj.val('');
}

TextArea.prototype.emptyall = function () {
	return $('textarea').not('#token_text_textarea').val('');
}

var textArea = new TextArea();

function widAnimateProgbar() {
    $('#hasqd_led').html(picGry);
}


function widButtonClick(obj) {
    // Shared button click function
    var obj = $(obj);
    var f = obj.attr('data-onclick');

    widDisableInitialDataUI();
    widDisableTabsUI();

    eval(f);
}

function widCompleteEvent(text) {
    // Completes actions and enables UI
    widDisableInitialDataUI(false);
    widDisableTabsUI(false);
    if (arguments.length == 0) text = '&nbsp'
	return widShowLog(text);
}

function widSetDefaultDb(dbHash) {
    // Searching for database and save it in variable.
    var cb = function (d) {
        var db = engGetResponseInfoDb(d);

        if (db.length > 0) {
            for (var i = 0; i < db.length; i++) {
                if (db[i].hash === dbHash) {
                    glCurrentDB = db[i];
                    break;
                }
            }
        }

        if (glCurrentDB.name === undefined) {
            widShowDBError();
        }
    }

    ajxSendCommand('info db', cb, hasqdLed);
}

function widShowDBError() {
    // displays error message and blocks all UI;
    var warning = 'Database is not accessible!';
    alert(warning);
    widShowLog(warning);
    widDisableInitialDataUI(true);
    widDisableTabsUI(true);
}

function widDisableInitialDataUI(f) {
    // Disables UI
    var jqInitData = $('#initial_data_table');

    if (arguments.length == 0) {
        var f = true;
    }

    jqInitData.find('input').prop('disabled', f); //closest('table[id^="initial"]').
}

function widDisableTabsUI(f) {
    // To enable/disable specified selectors into the tabs area
    var obj = $('#tabs_div');

    if (arguments.length == 0) {
        var f = true;
    }

    obj.find('button, input, textarea').prop('disabled', f);
}

function widShowPwdGuessTime(d) {
    // Shows password guess time
    var jqZxcvbn = $('#password_zxcvbn_td');

    if (arguments.length > 0 && d != undefined) {
        jqZxcvbn.html(d);
    } else {
        jqZxcvbn.empty();
    }
}


function widShowToken() {
    // Shows hashed value of token (if the value is not a default hash)
    var jqTokText = $('#token_hash_td');
    var jqTokHash = $('#token_text_textarea');
    var tok = jqTokHash.val();

    if (tok.length == 0) {
        jqTokText.empty();
        return;
    }

    jqTokText.html(widGetToken(tok, glCurrentDB.hash));
}

function widShowData(data) {
    // Shows tokens data field if it length greater then zero.
    var jqData = $('#tokens_data_pre');
	var jqPattern = $('#initial_data_table');
	
	jqData.outerWidth(jqPattern.innerWidth() - 2);
	
    if (arguments.length === 0) {
        jqData.hide();
        jqData.empty();
    } else if (String(data).length > 0) {
        jqData.show();
        jqData.html(data);
    } else {
        jqData.hide();
        jqData.empty();
    }
}

function widShowLog(text) {
    // Shows messages in log
    var jqLog = $('#' + 'tokens_log_pre');
    if (arguments.length === 0) {
        jqLog.html('&nbsp');
    } else {
        jqLog.html(text);
    }
}

function widShowTokRequestRes(d) {
    // Shows message or image about tokens existense.
    var obj = $('#token_pic_td');

    if (arguments.length === 0) {
        obj.empty();
        widShowLog();
    } else if (d === undefined) {
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

function widIsPassword() {
	return ($('#password_input').val().length > 0);
}

function widIsTokenText() {
	return ($('#token_text_textarea').val().length > 0);
}

function widGetToken(d, h) {
    //It returns hash of raw tokens value
    if (engIsHash(d, h))
        return d;

    return engGetHash(d, h)
}

function widGetTokenStatus(lr, nr) {
	switch (engGetTokensStatus(lr, nr)) {
    case 1:
        return 'OK';
    case 2:
        return 'TKN_SNDNG';
    case 3:
        return 'TKN_RCVNG';
    default: //case 0:
		return 'WRONG_PWD';
	}
}

function widGetPwdPic(status) {
    // Returns an image displaying the password match
	r = {};
	r.title = status;
    switch (status) {
    case 'OK':
		r.pic = picGrn;
		break;
    case 'TKN_SNDNG':
        r.pic = picYlwGrn;
		break;
    case 'TKN_RCVNG':
        r.pic = picGrnYlw;
		break;
    default:
        r.pic = picRed;
		break;
    }
	return r;
}

function widShowPwdMatch(status) {
    // Shows an image displaying the password match
    var objT = $('#password_pic_td');
    var objI = $('#password_input');

    if (arguments.length == 0 ) return objT.empty();
	var r = widGetPwdPic(status);
	objT.html(r.pic);
	objT.prop('title', r.title);
}

function widGetPwdGuessTime(pwd) {
    // Returns guess time of specified password
    return 'Guess time: ' + zxcvbn(pwd).crack_times_display.offline_slow_hashing_1e4_per_second;
}


function widTokenTextOninput(id) {
    // Events when tokens value changed.
	glLastRec = {};
    
	clearTimeout(glTimerId);
    widShowLog(); //clear log
    widShowData(); //clear and hide data field
	widShowPwdMatch();
	widShowToken();
    widShowTokRequestRes(undefined); // show animation
	textArea.emptyall();

    var jqTok = $('#token_text_textarea');
    var tokText = jqTok.val();



	var cb = function (data) {
		var resp = engGetResponse(data);
		widShowTokRequestRes();
		if (resp.message === 'ERROR') return widShowData(resp.message + ':\n' + resp.content);
		
		if (resp.message === 'IDX_NODN') {
			widShowTokRequestRes(false);
			glLastRec.status = resp.message;
		} else {
			var lr = engGetResponseLast(data);
			var nr = engGetNewRecord(lr.n, lr.s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);
			glLastRec = lr;
			glLastRec.status = widGetTokenStatus(lr, nr);
			widShowTokRequestRes(true);
			
			if (glPassword.length > 0) {
				widShowPwdMatch(glLastRec.status);
				widShowPwdGuessTime(widGetPwdGuessTime(glPassword));
			}
			widShowData(engGetOutputDataValue(glLastRec.d));
		}
	}
	
    if (tokText.length > 0) {
        var tok = widGetToken(tokText, glCurrentDB.hash);
        var cmd = 'last' + ' ' + glCurrentDB.name + ' ' + tok;
        engSendDeferredRequest(cmd, 1000, cb);
    } else {
        widShowTokRequestRes();
		widShowPwdMatch();
    }
}

function widPasswordOninput(jqPwd) {
    // Events when passwords value changed.
	widShowLog();
	textArea.emptyall();
    glPassword = jqPwd.val();

    if (jqPwd.val().length == 0) {
        widShowPwdMatch();
        widShowPwdGuessTime();
		jqPwd.attr('type', 'password');
		return;
    }	
	    
	var jqTok = $('#token_text_textarea');
	
	if (jqTok.val().length == 0) {
        widShowPwdMatch();
    } else {
		var nr = engGetNewRecord(glLastRec.n, glLastRec.s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);
		glLastRec.status = widGetTokenStatus(glLastRec, nr);		
		widShowPwdMatch(glLastRec.status);
	}
	
    widShowPwdGuessTime(widGetPwdGuessTime(glPassword));

}

function widPasswordContextMenu(jqObj) {
	if (jqObj.val().length > 0) {
        (jqObj.attr('type') == 'text') ? jqObj.attr('type', 'password') : jqObj.attr('type', 'text');
	} else {
		jqObj.attr('type', 'password');
	}
	return false;
}

function widCreateButtonClick() {
    // Creates a new token record
    var jqTokText = $('#token_text_textarea');
    var jqPwd = $('#password_input');
    var tok = engGetHash(jqTokText.val(), glCurrentDB.hash);
	
	if (glLastRec.status === 'OK') return widCompleteEvent('Token already exists.');
	if (! widIsTokenText()) return widCompleteEvent('Empty token text!');
	if (! widIsPassword()) return widCompleteEvent('Empty master key!');

    var nr = engGetNewRecord(0, tok, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);
    var nr_d = (jqTokText.val().length <= 160) ? '[' + jqTokText.val() + ']' : '';
    var cmd = 'z * ' + glCurrentDB.name + ' 0 ' + tok + ' ' + nr.k + ' ' + nr.g + ' ' + nr.o + ' ' + nr_d;

    var cb = function (d) {
        var r = engGetResponse(d);
        if (r.message == 'OK') {
            widCompleteEvent(r.message);
            widTokenTextOninput();
        } else {
            widCompleteEvent(r.message + ':\n' + r.content);
        }
    }

    var f = function () {
        ajxSendCommand(cmd, cb, hasqdLed);
    }

    setTimeout(f, 1000);
    widShowLog('Creating token...');
}

function widSendButtonClick() {
	var jqTokText = $('#token_text_textarea');
    var jqPwd = $('#password_input');
	var jqArea0 = $('#send_simple_textarea');
	var jqArea1 = $('#send_blocking_textarea');
	var jqSendType = $('#send_type_checkbox');
	
	if (! widIsTokenText()) return widCompleteEvent('Empty token text!');
	if (glLastRec.status === 'IDX_NODN') return widCompleteEvent('First create a token!');
	if (! widIsPassword()) return widCompleteEvent('Empty master key!');
	if (glLastRec.status !== 'OK' && glLastRec.status !== 'TKN_SNDNG' ) return widCompleteEvent('Unavailable token!');

	textArea.empty(jqArea0);
	textArea.empty(jqArea1);
	
	var tok = engGetHash(jqTokText.val(), glCurrentDB.hash);
	var k1, k2, g1, tkLine, rawTransKeys, prLine;
	
	if (! jqSendType.prop('checked')) { // Simple Send
		if (glLastRec.status !== 'OK') return widCompleteEvent('Unavailable token!');
		
		k1 = engGetKey(glLastRec.n + 1, glLastRec.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
		k2 = engGetKey(glLastRec.n + 2, glLastRec.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
		tkLine = glLastRec.n + ' ' + glLastRec.s + ' ' + k1 + ' ' + k2 + '\n';
		
		textArea.val(jqArea0, tkLine);

		rawTransKeys = jqArea0.val().replace(/\s/g, '');
		prLine = engGetHash(rawTransKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '1231320';
	
		textArea.val(jqArea0, prLine);
		
		return widCompleteEvent('OK');
	} 
	
	if (glLastRec.status == 'OK') {  // Blocking Send
        k1 = engGetKey(glLastRec.n + 1, glLastRec.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
        k2 = engGetKey(glLastRec.n + 2, glLastRec.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
        g1 = engGetKey(glLastRec.n + 2, glLastRec.s, k2, glCurrentDB.magic, glCurrentDB.hash);
        tkLine = glLastRec.n + ' ' + glLastRec.s + ' ' + k1 + ' ' + g1 + '\n';
		textArea.val(jqArea0, tkLine);
		
		rawTransKeys = jqArea0.val().replace(/\s/g, '');
		prLine = engGetHash(rawTransKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '1231410';
		
		textArea.val(jqArea0, prLine);
		
        tkLine = glLastRec.n + ' ' + glLastRec.s + ' ' + k2 + '\n';
		
		textArea.val(jqArea1, tkLine);
		
		rawTransKeys = jqArea1.val().replace(/\s/g, '');
		prLine = engGetHash(rawTransKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '12320';
		
		textArea.val(jqArea1, prLine);
	
		return widCompleteEvent('OK');
	}
	
	if (glLastRec.status == 'TKN_SNDNG') {
		textArea.empty(jqArea0);
		
        k2 = engGetKey(glLastRec.n + 1, glLastRec.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
        tkLine = glLastRec.n - 1 + ' ' + glLastRec.s + ' ' + k2 + '\n';
		
		textArea.val(jqArea1, tkLine);
		
		rawTransKeys = jqArea1.val().replace(/\s/g, '');
		prLine = engGetHash(rawTransKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '12320';
		
		textArea.val(jqArea1, prLine);
		
		return widCompleteEvent('OK');
	}
	
}

function widSetDataButtonClick() {
    // Adds a new record with a specified data
    var jqTokText = $('#token_text_textarea');
    var jqPwd = $('#password_input');
    var jqData = $('#setdata_textarea');

	if (! widIsTokenText()) return widCompleteEvent('Empty token text!');
	if (glLastRec.status === 'IDX_NODN') return widCompleteEvent('First create a token!');	
	if (! widIsPassword()) return widCompleteEvent('Empty master key!');
	if (glLastRec.status !== 'OK') return widCompleteEvent('Incorrect master key!');	
	
    var tok = engGetHash(jqTokText.val(), glCurrentDB.hash);
    var nr = engGetNewRecord(glLastRec.n + 1, tok, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);
    var nr_d = engGetInputDataValue(jqData.val());
    var cmd = 'add * ' + glCurrentDB.name + ' ' + nr.n + ' ' + tok + ' ' + nr.k + ' ' + nr.g + ' ' + nr.o + ' ' + nr_d;

    var cb = function (d) {
        var r = engGetResponse(d);
        if (r.message == 'OK') {
            widCompleteEvent(r.message);
            widTokenTextOninput();
        } else {
            widCompleteEvent(r.message + ':\n' + r.content);
        }
    }

    var f = function () {
        ajxSendCommand(cmd, cb, hasqdLed)
    }

    widShowLog('Giving token data...');
    setTimeout(f);
}

function widSearchButtonClick() {
    var jqFrom = $('#from_datepicker_input');
    var jqTo = $('#to_datepicker_input');

    var fromDate = new Date(jqFrom.datepicker('getDate'));
    var toDate = new Date(jqTo.datepicker('getDate'));

    // needs to check correctness of specified date range if entered manually
    console.log(fromDate);
    console.log(toDate);
    var folders = engGetDateRangeFolders(fromDate, toDate);

    widCompleteEvent();
}
