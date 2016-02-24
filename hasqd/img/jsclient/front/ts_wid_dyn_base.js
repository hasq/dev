// Hasq Technology Pty Ltd (C) 2013-2016

function HasqLogo() {
    //this.counter = 0;
}

HasqLogo.prototype.inc = function () {
    setTimeout(function () {
        $('#hasqd_logo').html(picLogoBlink);
    }, 500);
};

HasqLogo.prototype.dec = function () {
    setTimeout(function () {
        $('#hasqd_logo').html(picLogoBlue);
    }, 500);
};

HasqLogo.prototype.fail = function () {
    $('#hasqd_logo').html(picLogoRed);
    //widShowLog('Server connection failure!');
};

var hasqLogo = new HasqLogo();

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

    ajxSendCommand('info db', cb, hasqLogo);
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

function widShowToken(tok) {
    // Shows hashed value of token (if the value is not a default hash)
    var jqTokText = $('#token_hash_td');
	if (arguments.length == 0 || typeof tok == 'undefined') return jqTokText.empty();
    if (tok.length == 0) return widShowToken();

    jqTokText.html(widGetToken(tok, glCurrentDB.hash));
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

function widShowTokenMsg(d) {
    // Shows message or image about tokens existense.
    var obj = $('#token_pic_td');

    if (arguments.length === 0) {
        obj.empty();
        widShowLog();
    } else if (d === undefined) {
        obj.html(picLoading);
        widShowLog('Searching for token...');
    } else if (d === true) {
        widShowLog('Token exists.');
        obj.empty();
    } else if (d === false) {
        obj.empty();
        widShowLog('No such token.');
    }
}

function widDisableDataTab(comm) {
    return $('#setdata_table').find('button, textarea').prop('disabled', comm);
}

function widDisableCreateTab(comm) {
    return $('#create_table').find('button').prop('disabled', comm);
}

function widDisableSendTab(comm) {
    return $('#send_table').find('button, textarea, input').prop('disabled', comm);
}

function widDisableReceiveTab(comm) {
    return $('#receive_table').find('button, textarea').prop('disabled', comm);
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
	if (lr.msg === 'IDX_NODN') return lr.msg;
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
		r.pic = picPwdOk;
		break;
    case 'TKN_SNDNG':
        r.pic = picPwdSndng;
		break;
    case 'TKN_RCVNG':
        r.pic = picPwdRcvng;
		break;
    default: //'WRONG_PWD'
        r.pic = picPwdWrong;
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

function widTokenTextOninput() {
    // Events when tokens value changed.
	clearTimeout(glTimerId);
    widShowLog(); //clear log
    widShowEmptyArea(); //clear and hide data field
	widShowPwdMatch();
	widShowTokenMsg();
	textArea.emptyall();
	glLastRec={};

	widDisableDataTab(true);
	widDisableCreateTab(true);
	widDisableSendTab(true);
	
    var jqTokText = $('#token_text_textarea');
	var tok = widGetToken(jqTokText.val(), glCurrentDB.hash);
	widShowToken(tok);	
	
	var cb = function (data) {
		var resp = engGetResp(data);
		widShowTokenMsg();
		if (resp.msg === 'ERROR') return widShowLog(resp.msg + ': ' + data);
		
		if (resp.msg === 'IDX_NODN') {
			glLastRec.st = 'IDX_NODN';
			glLastRec.s = tok;
			widShowTokenMsg(false);
			widShowCreateArea();
			if (glPassword.length > 0) widDisableCreateTab(false);
		} else {
			glLastRec = engGetRespLast(data);
			//if (lr.msg === 'ERROR') return widShowLog(resp.msg + ': ' + data);
			var nr = engGetNewRecord(glLastRec.n, glLastRec.s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);
			glLastRec.st = widGetTokenStatus(glLastRec, nr);
			widShowTokenMsg(true);
			widShowDataArea(engGetOutputDataValue(glLastRec.d));
		}
		
		glLastRec.r = (jqTokText.val() !== tok) ? jqTokText.val() : '';
		widPasswordOninput(); //updates info about last records and password matching
	}
	
    if (tok.length > 0) {
		widShowTokenMsg(undefined); // show animation
        var cmd = 'last' + '\u0020' + glCurrentDB.name + '\u0020' + tok;
        engSendDeferredRequest(cmd, 1000, cb);
    }
}

function widShowDataArea(data) {
	$('#tabs_div').tabs('option', 'active', 1);
    // Shows tokens data field if it length greater then zero.
    var jqData = $('#setdata_textarea');
	if (glLastRec.st == 'OK') widDisableDataTab(false);
	
    if (arguments.length === 0) {
        jqData.empty();
    } else { 
		jqData.val(data);
	}
	return;
}

function widPasswordOninput(jqPwd) {
    // Events when passwords value changed.
	if (typeof jqPwd !== 'undefined') glPassword = jqPwd.val();
	widDisableDataTab(true);
	widDisableCreateTab(true);
	widDisableSendTab(true);
	widDisableReceiveTab(true);
	if (glPassword.length > 0) {
		widShowPwdGuessTime(widGetPwdGuessTime(glPassword));
		if (typeof glLastRec.st === 'undefined') return;
		if (glLastRec.st === 'IDX_NODN') return widDisableCreateTab(false);
		var nr = engGetNewRecord(glLastRec.n, glLastRec.s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);
		glLastRec.st = widGetTokenStatus(glLastRec, nr);
		widShowPwdMatch(glLastRec.st);
		if (glLastRec.st == 'OK') {
			widDisableDataTab(false);
			widDisableSendTab(false);
			widDisableReceiveTab(true);
			return;
		} else {
			widDisableReceiveTab(false);			
		}
    } else {
		widShowPwdMatch();
		widShowPwdGuessTime();
		if (typeof glLastRec.st === 'undefined') return;
		if (glLastRec.st !== 'IDX_NODN') glLastRec.st = 'WRONG_PWD';
	}
}

function widPasswordEyeClick(jqEye){
//shows/hides passwords	by click;
	var jqPwd = $('#password_input');
	if (jqPwd.attr('type') == 'text') {
		jqPwd.attr('type', 'password');
		jqEye.html(picEyeOpen);
		jqEye.attr('title', 'Unmask password');
	} else {
		jqPwd.attr('type', 'text');
		jqEye.html(picEyeClosed);
		jqEye.attr('title', 'Mask password');
	}
}

function widCreateButtonClick() {
    // Creates a new token record
	widShowEmptyArea();
    var jqPwd = $('#password_input');

	if (typeof glLastRec.st === 'undefined') return widCompleteEvent('Empty token text!');
	if (glLastRec.st !== 'IDX_NODN') return widCompleteEvent('Token already exists.');
	if (! widIsPassword()) return widCompleteEvent('Empty master key!');

    var nr = engGetNewRecord(0, glLastRec.s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);
    var nr_d = (glLastRec.r.length > 0 && glLastRec.r.length <= 160 && glLastRec.r !== glLastRec.s) ? '[' + glLastRec.r + ']' : '';
    var cmd = 'z *' + '\u0020' + glCurrentDB.name + '\u0020' + '0' + '\u0020' + glLastRec.s + '\u0020' + nr.k + '\u0020' + nr.g + '\u0020' + nr.o + '\u0020' + nr_d;

    var cb = function (data) {
        var r = engGetResp(data);
        if (r.msg == 'OK') {
            widCompleteEvent(r.msg);
            widTokenTextOninput(); //update token info after create;
        } else {
            widCompleteEvent(r.msg + ': ' + r.cnt);
        }
    }

    var f = function () {
        ajxSendCommand(cmd, cb, hasqLogo);
    }

    setTimeout(f, 1000);
    widShowLog('Creating token...');
}

function widSetDataButtonClick() {
    // Adds a new record with a specified data
    var jqPwd = $('#password_input');
    var jqData = $('#setdata_textarea');

	if (typeof glLastRec.st === 'undefined') return widCompleteEvent('Empty token text!');
	if (glLastRec.st === 'IDX_NODN') return widCompleteEvent('First create a token!');	
	if (! widIsPassword()) return widCompleteEvent('Empty master key!');
	if (glLastRec.st !== 'OK') return widCompleteEvent('Incorrect master key - token is unavailable!');	
	
    var nr = engGetNewRecord(glLastRec.n + 1, glLastRec.s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);
    var nr_d = engGetInputDataValue(jqData.val());
    var cmd = 'add * ' + glCurrentDB.name + '\u0020' + nr.n + '\u0020' + glLastRec.s + '\u0020' + nr.k + '\u0020' + nr.g + '\u0020' + nr.o + '\u0020' + nr_d;

    var cb = function (d) {
        var r = engGetResp(d);
        if (r.msg == 'OK') {
            widTokenTextOninput();
			return widCompleteEvent(r.msg);
        } 
        
		return widCompleteEvent(r.msg + ': ' + r.cnt);
    }

    var f = function () {
        ajxSendCommand(cmd, cb, hasqLogo)
    }

    widShowLog('Giving token data...');
    setTimeout(f);
}


function widShowKeysButtonClick() {
    var jqPwd = $('#password_input');
	var jqArea0 = $('#send_simple_textarea');
	var jqArea1 = $('#send_blocking_textarea');
	var jqSendType = $('#send_type_checkbox');
	
	if (typeof glLastRec.st === 'undefined') return widCompleteEvent('Empty token text!');
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
	
	if (glLastRec.st === 'OK') {  // Blocking Send
        k1 = engGetKey(glLastRec.n + 1, glLastRec.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
        k2 = engGetKey(glLastRec.n + 2, glLastRec.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
        g1 = engGetKey(glLastRec.n + 2, glLastRec.s, k2, glCurrentDB.magic, glCurrentDB.hash);
        tkLine = glLastRec.s + '\u0020' + k1 + '\u0020' + g1 + '\u0020';
		textArea.val(jqArea0, tkLine);
		
		rawTransKeys = jqArea0.val().replace(/\s/g, '');
		prLine = engGetHash(rawTransKeys, 's22').substring(0, 4) + '\u0020' + glCurrentDB.altname + '\u0020' + '23141';
		
		textArea.val(jqArea0, prLine);
		
        tkLine = glLastRec.s + '\u0020' + k2 + '\u0020';
		
		textArea.val(jqArea1, tkLine);
		
		rawTransKeys = jqArea1.val().replace(/\s/g, '');
		prLine = engGetHash(rawTransKeys, 's22').substring(0, 4) + '\u0020' + glCurrentDB.altname + '\u0020' + '232';
		
		textArea.val(jqArea1, prLine);
	
		return widCompleteEvent('OK');
	}
	
	if (glLastRec.st === 'TKN_SNDNG') {
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

	var transKeys = engGetTransKeys(rawTransKeys);
	console.log(transKeys);
	var tok = engGetMergedTokensList(engGetHashedTokensList(transKeys), tokText, glCurrentDB.hash);
	tok = tok[0].replace(/\[|\]/g, '');

    var cb = function (data) {
        var r = engGetResp(data);
        if (r.msg !== 'OK') return widCompleteEvent(r.msg + ': ' + r.cnt);
		var lr = engGetRespLast(data);
		if (lr.msg === 'ERROR') return widCompleteEvent(lr.msg + ': ' + lr.cnt);
		var nr = engGetNewRecord(lr.n, lr.s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);
		lr.st = widGetTokenStatus(lr, nr);
		if (lr.st === 'OK') return widCompleteEvent('Token already available!');
		textArea.empty(jqTok, tok);
		widSetTransKeys(transKeys);
    }
    
	var cmd = 'last' + '\u0020' + glCurrentDB.name + '\u0020' + transKeys[0].s;
	
    var f = function () {
        ajxSendCommand(cmd, cb, hasqLogo);
    }

    setTimeout(f, 1000);
    widShowLog('Receiving token...');
		//widTransKeysUpdate(jqObj, transKeys, widSimpleReceive); 	
}

function widSetTransKeys(keys){
	keys = engGetEnrollKeys(keys, glPassword, glCurrentDB.hash, glCurrentDB.magic);
	switch (keys[0].prcode){
		case '23132':
			break;
		case '23141':
			break;
		case '232':
			break;
		default:
			return widCompleteEvent('Bad TransKeys!');
	}
	widCompleteEvent('OK');
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


function widShowEmptyArea() {
	return $('#tabs_div').tabs('option', 'active', 0);
}


function widShowCreateArea() {
	return $('#tabs_div').tabs('option', 'active', 2);
}

function widShowSendArea() {
	return $('#tabs_div').tabs('option', 'active', 3);
}

function widShowReceiveArea() {
	return $('#tabs_div').tabs('option', 'active', 4);
}

function widShowSearchArea() {
	return $('#tabs_div').tabs('option', 'active', 5);
}