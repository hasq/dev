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
	if (typeof data == 'undefined') return jqObj.val();
	return jqObj.val(jqObj.val() + data);
}

TextArea.prototype.empty = function (jqObj, data) {
	if (typeof data == 'undefined') return jqObj.val('');
	jqObj.val('');
	jqObj.val(data);	
	return;
}

TextArea.prototype.emptyall = function () {
	return $('textarea').not('#token_text_textarea').val('');
}

var textArea = new TextArea();

function widAnimateProgbar() {
    $('#hasqd_led').html(picGry);
}

function widGetLastRec(text) {
	lr = {};
	lr.r = '';
	lr.s = '';
	lr.n = -1;
	lr.k = '';
	lr.g = '';
	lr.o = '';
	lr.d = '';
	lr.st = '';
	
	if (arguments.length > 0 ) {
		lr.r = text;
		lr.s = widGetToken(text, glCurrentDB.hash);
		lr.st = 'IDX_NODN';		
	}
	
	return lr;
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
    if (arguments.length == 0) text = '&nbsp';
	return widShowLog(text);
}

function widSetDefaultDb(dbHash) {
    // Searching for database and save it in variable.
    var cb = function (d) {
        var db = engGetRespInfoDb(d);

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

    if (tok.length == 0) return jqTokText.empty();

    jqTokText.html(widGetToken(tok, glCurrentDB.hash));
}

function widShowData(data) {
    // Shows tokens data field if it length greater then zero.
    var jqData = $('#token_data_pre');
	var jqDataTd = jqData.closest('table').closest('td');
	
    if (arguments.length === 0) {
        jqDataTd.hide();
        jqData.empty();
    } else if (String(data).length > 0) {
		var maxHeight = (($(window).height() - $('body').height()) > 200) ? ($(window).height() - $('body').height())/2 : 100;

		jqData.outerWidth(jqDataTd.closest('table').innerWidth()-4);
		jqData.css('max-height',  maxHeight + 'px');
        jqDataTd.show();
        jqData.html(data);
    } else {
        jqDataTd.hide();
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

function widGetToken(data, hash) {
    //It returns hash of raw tokens value
    if (engIsHash(data, hash)) return data;

    return engGetHash(data, hash)
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
	clearTimeout(glTimerId);
    widShowLog(); //clear log
    widShowData(); //clear and hide data field
	widShowPwdMatch();
	widShowToken();
    widShowTokRequestRes(undefined); // show animation
	textArea.emptyall();

    var jqTokText = $('#token_text_textarea');
    var tokText = jqTokText.val();
	
	var cb = function (data) {
		var resp = engGetResp(data);
		widShowTokRequestRes();
		if (resp.msg === 'ERROR') return widShowData(resp.msg + ':\n' + data);
		
		if (resp.msg === 'IDX_NODN') {
			widShowTokRequestRes(false);
			glLastRec = widGetLastRec(tokText);
			glLastRec.st = resp.msg;
		} else {
			var lr = engGetRespLast(data);
			if (lr.msg === 'ERROR') return widShowData(resp.msg + ':\n' + data);
			var nr = engGetNewRecord(lr.n, lr.s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);
			glLastRec = lr;
			glLastRec.r = jqTokText.val();
			glLastRec.st = widGetTokenStatus(lr, nr);
			widShowTokRequestRes(true);
			
			if (glPassword.length > 0) {
				widShowPwdMatch(glLastRec.st);
				widShowPwdGuessTime(widGetPwdGuessTime(glPassword));
			}
			widShowData(engGetOutputDataValue(glLastRec.d));
		}
	}
	
    if (tokText.length > 0) {
		glLastRec = widGetLastRec(widGetToken(tokText, glCurrentDB.hash));
        var cmd = 'last' + '\u0020' + glCurrentDB.name + '\u0020' + glLastRec.s;
        engSendDeferredRequest(cmd, 1000, cb);
    } else {
		glLastRec = widGetLastRec();
        widShowTokRequestRes();
		widShowPwdMatch();
    }
}

function widPasswordOninput(jqPwd) {
    // Events when passwords value changed.
	widShowLog();
	//textArea.emptyall();
    glPassword = jqPwd.val();

    if (jqPwd.val().length == 0) {
		glLastRec.st = 'WRONG_PWD';
        widShowPwdMatch();
        widShowPwdGuessTime();
		jqPwd.attr('type', 'password');
		return;
    }	
	    
	if (glLastRec.st == 'IDX_NODN' || glLastRec.st == '' ) {
        widShowPwdMatch();
    } else {
		var nr = engGetNewRecord(glLastRec.n, glLastRec.s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);
		glLastRec.st = widGetTokenStatus(glLastRec, nr);		
		widShowPwdMatch(glLastRec.st);
	}
	
    widShowPwdGuessTime(widGetPwdGuessTime(glPassword));

}

function widPasswordOncontextmenu(jqObj) {
	if (jqObj.val().length > 0) {
        (jqObj.attr('type') == 'text') ? jqObj.attr('type', 'password') : jqObj.attr('type', 'text');
	} else {
		jqObj.attr('type', 'password');
	}
	return false;
}

function widCreateButtonClick() {
    // Creates a new token record
    var jqPwd = $('#password_input');

	if (glLastRec.st === '') return widCompleteEvent('Empty token text!');
	if (glLastRec.st !== 'IDX_NODN') return widCompleteEvent('Token already exists.');
	if (! widIsPassword()) return widCompleteEvent('Empty master key!');
	
    var nr = engGetNewRecord(0, glLastRec.s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);
    var nr_d = (glLastRec.r.length <= 160) ? '[' + glLastRec.r + ']' : '';
    var cmd = 'z *' + '\u0020' + glCurrentDB.name + '\u0020' + '0' + '\u0020' + glLastRec.s + '\u0020' + nr.k + '\u0020' + nr.g + '\u0020' + nr.o + '\u0020' + nr_d;

    var cb = function (d) {
        var r = engGetResp(d);
        if (r.msg == 'OK') {
            widCompleteEvent(r.msg);
            widTokenTextOninput();
        } else {
            widCompleteEvent(r.msg + ':\n' + r.cnt);
        }
    }

    var f = function () {
        ajxSendCommand(cmd, cb, hasqdLed);
    }

    setTimeout(f, 1000);
    widShowLog('Creating token...');
}

function widSetDataButtonClick() {
    // Adds a new record with a specified data
    var jqPwd = $('#password_input');
    var jqData = $('#setdata_textarea');

	if (glLastRec.st === '') return widCompleteEvent('Empty token text!');
	if (glLastRec.st === 'IDX_NODN') return widCompleteEvent('First create a token!');	
	if (! widIsPassword()) return widCompleteEvent('Empty master key!');
	if (glLastRec.st !== 'OK') return widCompleteEvent('Incorrect master key!');	
	
    var nr = engGetNewRecord(glLastRec.n + 1, glLastRec.s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);
    var nr_d = engGetInputDataValue(jqData.val());
    var cmd = 'add * ' + glCurrentDB.name + '\u0020' + nr.n + '\u0020' + glLastRec.s + '\u0020' + nr.k + '\u0020' + nr.g + '\u0020' + nr.o + '\u0020' + nr_d;

    var cb = function (d) {
        var r = engGetResp(d);
        if (r.msg == 'OK') {
            widTokenTextOninput();
			return widCompleteEvent(r.msg);
        } 
        
		return widCompleteEvent(r.cnt);
    }

    var f = function () {
        ajxSendCommand(cmd, cb, hasqdLed)
    }

    widShowLog('Giving token data...');
    setTimeout(f);
}


function widShowKeysButtonClick() {
    var jqPwd = $('#password_input');
	var jqArea0 = $('#send_simple_textarea');
	var jqArea1 = $('#send_blocking_textarea');
	var jqSendType = $('#send_type_checkbox');
	
	if (glLastRec.st === '') return widCompleteEvent('Empty token text!');
	if (glLastRec.st === 'IDX_NODN') return widCompleteEvent('First create a token!');
	if (! widIsPassword()) return widCompleteEvent('Empty master key!');
	if (glLastRec.st !== 'OK' && glLastRec.st !== 'TKN_SNDNG' ) return widCompleteEvent('Unavailable token!');

	textArea.empty(jqArea0);
	textArea.empty(jqArea1);
	
	var k1, k2, g1, tkLine, rawTransKeys, prLine;
	
	if (! jqSendType.prop('checked')) { // Simple Send
		if (glLastRec.st !== 'OK') return widCompleteEvent('Unavailable token!');
		
		k1 = engGetKey(glLastRec.n + 1, glLastRec.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
		k2 = engGetKey(glLastRec.n + 2, glLastRec.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
		tkLine = glLastRec.s + '\u0020' + k1 + '\u0020' + k2 + '\u0020';
		
		textArea.val(jqArea0, tkLine);

		rawTransKeys = jqArea0.val().replace(/\s/g, '');
		prLine = engGetHash(rawTransKeys, 's22').substring(0, 4) + '\u0020' + glCurrentDB.altname + '\u0020' + '23132';
	
		textArea.val(jqArea0, prLine);
		
		return widCompleteEvent('OK');
	} 
	
	if (glLastRec.st == 'OK') {  // Blocking Send
        k1 = engGetKey(glLastRec.n + 1, glLastRec.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
        k2 = engGetKey(glLastRec.n + 2, glLastRec.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
        g1 = engGetKey(glLastRec.n + 2, glLastRec.s, k2, glCurrentDB.magic, glCurrentDB.hash);
        tkLine = glLastRec.s + '\u0020' + k1 + '\u0020' + g1 + '\u0020';
		textArea.val(jqArea0, tkLine);
		
		rawTransKeys = jqArea0.val().replace(/\s/g, '');
		prLine = engGetHash(rawTransKeys, 's22').substring(0, 4) + '\u0020' + glCurrentDB.altname + '\u0020' + '23141';
		
		textArea.val(jqArea0, prLine);
		
        tkLine = glLastRec.s + '\u0020' + k2;
		
		textArea.val(jqArea1, tkLine);
		
		rawTransKeys = jqArea1.val().replace(/\s/g, '');
		prLine = engGetHash(rawTransKeys, 's22').substring(0, 4) + '\u0020' + glCurrentDB.altname + '\u0020' + '232';
		
		textArea.val(jqArea1, prLine);
	
		return widCompleteEvent('OK');
	}
	
	if (glLastRec.st == 'TKN_SNDNG') {
		textArea.empty(jqArea0);
		
        k2 = engGetKey(glLastRec.n + 1, glLastRec.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
        tkLine = glLastRec.n - 1 + '\u0020' + glLastRec.s + '\u0020' + k2 + '\u0020';
		
		textArea.val(jqArea1, tkLine);
		
		rawTransKeys = jqArea1.val().replace(/\s/g, '');
		prLine = engGetHash(rawTransKeys, 's22').substring(0, 4) + '\u0020' + glCurrentDB.altname + '\u0020' + '232';
		
		textArea.val(jqArea1, prLine);
		
		return widCompleteEvent('OK');
	}
	
}

function widReceiveButtonClick() {
	var rawTransKeys = $('#receive_textarea').val();
	var jqTok = $('#token_text_textarea');
	
	if (!engIsRawTransKeys(rawTransKeys)) return widCompleteEvent('Bad TransKeys!');
	if (!widIsPassword)	return widCompleteEvent('Empty password!');
	
    var tokText = [glLastRec.r]
	console.log(tokText);	
	var transKeys = engGetTransKeys(rawTransKeys);
	console.log(transKeys);
	var tok = engGetMergedTokensList(engGetHashedTokensList(transKeys), tokText, glCurrentDB.hash);
	console.log(tok);
	//tok = tok[0].replace(/\[|\]/g, '');

	textArea.empty(jqTok, tok);
	
	widCompleteEvent('!!!!!!!11111');
	
	//widTransKeysUpdate(jqObj, transKeys, widSimpleReceive); 	
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
