// Hasq Technology Pty Ltd (C) 2013-2015
function TextArea() {
	
}

TextArea.prototype.val = function (jqObj, data) {
		var jqText = widGetTextareaObj(jqObj);
		if (typeof data == 'undefined') return jqText.val();
		return jqText.val(jqText.val() + data);
}

TextArea.prototype.empty = function (jqObj) {
		var jqText = widGetTextareaObj(jqObj);
		return jqText.val('');
}

var textArea = new TextArea();

function Led() {
	
}

Led.prototype.show = function (jqObj, flag, title) {
		var jqLed = widGetLedObj(jqObj);
		if (flag === null) {
			jqLed.html(picL12);
			jqLed.prop('title', 'Please wait...');
		} else if (flag) {
			jqLed.html(picGrn);
			(title === undefined) ? jqLed.prop('title', 'OK') : jqLed.prop('title', title);
		} else {
			jqLed.html(picRed);
			(title === undefined) ? jqLed.prop('title', 'Inappropriate or unavailable tokens detected!') : jqLed.prop('title', title);
		}
}

Led.prototype.empty = function (jqObj){
		if (arguments.length === 0) {
			$('#tokens_tabs').find('div[data-class="led_div"]').empty();			
		} else {
			widGetLedObj(jqObj).empty();
		}
}

var led = new Led();

function widCleanCL() {
    glCL.idx = 0;
    glCL.counter = 100;
    glCL.items.length = 0;
}


function widShowProgressbar(data) {
    var objProgressbar = $('#tokens_progressbar');

    if (data) {
        var val = Math.floor(data);
        objProgressbar.progressbar('value', val);
    } else {
        objProgressbar.progressbar('value', data);
    }
}

function widShowTokensLog(data) {
    var objLog = $('#tokens_log_pre');
    (arguments.length == 0) ? objLog.html('&nbsp') : objLog.html(data);
}

function widShowOrderedTokensNames(arr) {
    for (var i = 0; i < arr.length; i++) {
        if (i == 0) {
			widGetRawTokens(arr[i]);
            //jqObj.val(arr[i]);
        } else {
            widGetRawTokens(widGetRawTokens() + ' ' + arr[i]);
        }
    }
}

function widCleanUI(jqObj) {
	if (arguments.length == 0) {
		led.empty();	
		$('div[data-class="capsule"]').find('textarea').val('');
		widCleanVerifyTab();
	} else {
		led.empty(jqObj);
		textArea.empty(jqObj);
	}
	widShowProgressbar(0);
	widShowTokensLog();	
	//widShowTokensLog();
}

function widCleanVerifyTab() {
    $('#tokens_verify_table').find('tr:gt(0)').remove();
    $('#tokens_verify_table_pre').hide();
    $('#tokens_verify_led_div').empty();
}

function widGetMainButtonObj(jqObj) {
	return $(jqObj.closest('div[data-class="capsule"]').find('button[data-class="shared_button"]') );
}

function widGetContinueButtonObj(jqObj) {
    return $(jqObj.closest('div[data-class="capsule"]').find('button[data-class="continue_button"]'));
}

function widGetWarningTextObj(jqObj) {
    return $(jqObj.closest('div[data-class="capsule"]').find('td[data-class="warning_text"]'));
}

function widGetLedObj(jqObj) {
    return $(jqObj.closest('div[data-class="capsule"]').find('div[data-class="led_div"]'));
}

function widGetTextareaObj(jqObj) {
    return $(jqObj.closest('div[data-class="capsule"]').find('textarea'));
}

function widDisableTokensInput() {
    var jqObj = $('#tokens_tabs');
    jqObj.tabs('option', 'disabled', true);
    jqObj.closest('div[id^="tabs"]').find('button, input, textarea').prop('disabled', true);
    jqObj.closest('div[id^="tabs"]').find('textarea:first').prop('disabled', false);
}

function widEnableTokensInput() {
    var jqObj = $('#tokens_tabs');
    jqObj.tabs('enable');
    jqObj.closest('div[id^="tabs"]').find('button, input, textarea').prop('disabled', false);
}

function widDisableAllTokensUI(jqObj) {
    var tabs = $('#tokens_tabs');
    tabs.tabs('option', 'disabled', true);
    tabs.closest('div[id^="tabs"]').find('button, input, textarea').prop('disabled', true);
    $(widGetContinueButtonObj(jqObj)).prop('disabled', false);
    $(widGetMainButtonObj(jqObj)).prop('disabled', false);
}

function widEnableAllTokensUI() {
    var jqObj = $('#tokens_tabs');
    jqObj.tabs('enable');
    jqObj.closest('div[id^="tabs"]').find('button, input, textarea').prop('disabled', false); //closest('div[id^="tabs"]')
}

function widSwitchShowHide(jqObj) {
    if (jqObj.css('display') === 'none') {
        jqObj.show();
    } else {
        jqObj.hide();
    }
}

function widGetWarningsMode(jqObj) {
    return (jqObj.button('option', 'label') == 'Continue') ? true : false;
}

function widGetButtonsMode(jqObj) {
	var label = jqObj.button('option', 'label');
    var title = jqObj.attr('data-title');
    var objC = widGetContinueButtonObj(jqObj);
    var cMode = widGetWarningsMode(objC);
	
    if (jqObj == objC && cMode) {
        return true;
    } else if (label == title) {
        return true; // Main button in action-mode is visible
    } else {
        return false; // Cancel is visible
    }
}

function widGetFunctionById(jqObj, click) {
	widCleanCL();
	var fName = jqObj.attr('data-function');

	fName = (arguments.length > 1) ? fName + '(jqObj, click)' : fName + '(jqObj)';

    return function () {
        eval(fName);
    }
}

function widSwitchButtonsMode(jqObj) {
    var title = jqObj.attr('data-title');
    var label = jqObj.button('option', 'label');
    var objWarning = widGetWarningTextObj(jqObj);	// warning text
    var objContinue = widGetContinueButtonObj(jqObj); // continue button
	
    if (label === title && title === 'Continue') {
        widSwitchShowHide(jqObj);
        widSwitchShowHide(objWarning);
        jqObj.button('option', 'label', 'Hidden');
    } else if (label !== title && title === 'Continue') {
        jqObj.button('option', 'label', title);
        widSwitchShowHide(jqObj);
        widSwitchShowHide(objWarning);
    } else if (label === title) {
        jqObj.button('option', 'label', 'Cancel');
    } else {
        jqObj.button('option', 'label', title);

        if (widGetWarningsMode(objContinue)) {
            $(objContinue).button('option', 'label', 'Hidden');
            widSwitchShowHide(objContinue);
            widSwitchShowHide(objWarning);
        }
    }
}

function widMainButtonClick(jqObj, text) {
	var f;
	
    if (widGetButtonsMode(jqObj)) {
        widDisableAllTokensUI(jqObj);
        f = widGetFunctionById(jqObj);
    } else {
        f = function () {
            widCancel(jqObj, text);
        }
    }
    widSwitchButtonsMode(jqObj);
    setTimeout(f);
}

function widDone(jqObj, text) {
    widMainButtonClick(jqObj, text);
}

function widCancel(jqObj, text) {
    if (typeof(text) != 'string') {
        text = 'Operation cancelled!';
		glVTL = engGetVTL(glVTL);
	}
	
    widCleanCL();
    widShowTokensLog(text);
    widEnableAllTokensUI();
}

function widContinueButtonClick(jqObj, click) {
    widSwitchButtonsMode(jqObj);

    var label = jqObj.button('option', 'label');

    if (click === true) { // called by onclick;
        setTimeout(widGetFunctionById(widGetMainButtonObj(jqObj), click));
    } else {
		widShowTokensLog('Process suspended...');
	}
}

function widTokensIdxOninput(jqObj) {
	jqObj.val(engGetOnlyNumber(jqObj.val()));
}

function widTokensPasswordOninput(data) {
    glPassword = data;
    glVTL = engGetVTL(glVTL);
    widCleanVerifyTab();
	led.empty();
}

function widGetRawTokens(data){
	jqText = $('#tokens_names_textarea');
	if (arguments.length == 0) {
		return jqText.val();
	} else {
		return jqText.val(data);
	}
}

function widIsPassword() {
	return ($('#tokens_password_input').val().length > 0);
}

function widIsRawTokens() {
	return (widGetRawTokens().length > 0 && engIsRawTokens(widGetRawTokens(), glCurrentDB.hash));
}

function widGetRangeDataState() {
    var jqBasename = $('#tokens_basename_input');
    var idx0 = +$('#tokens_first_idx_input').val();
    var idx1 = +$('#tokens_last_idx_input').val();
    var r = {};
    r.msg = 'OK';
    r.cnt = 'OK';

    if (jqBasename.val() == '') {
        r.msg = 'ERROR';
        r.cnt = 'Empty basename.';
    } else if (/[\s]/g.test(jqBasename.val())) {
        r.msg = 'ERROR';
        r.cnt = 'Incorrect basename. Please, remove spaces.';
    } else if (idx0 > idx1) {
        r.msg = 'ERROR';
        r.cnt = 'Incorrect indexes. The start index should not be bigger the end index.';
    } else if (idx1 - idx0 > 127) {
        r.msg = 'ERROR';
        r.cnt = 'Too many tokens, the maximum quantity - 128';
    }

    return r;
}

function widTokensNamesOninput(jqObj) {
    glVTL = engGetVTL(glVTL);
    widCleanUI();
    widShowBordersColor(jqObj);
	
    var tokens = jqObj.val();

    if (!engIsRawTokens(tokens, glCurrentDB.hash)) {
        widDisableTokensInput();
        widShowBordersColor(jqObj, '#FF0000'); //RED BORDER
        widShowTokensLog('Please enter a hashes or raw value in square brackets.');
    } else if (tokens.length >= 15479) {
        widEnableTokensInput();
        widShowBordersColor(jqObj, '#FFFF00'); //YELLOW BORDER
        var l = 16511 - tokens.length;
        jqObj.prop('title', 'Warning! ' + l + ' chars left.');
        widShowTokensLog();
    } else {
        widEnableTokensInput();
        widShowBordersColor(jqObj);
        widShowTokensLog();
    }
}

function widAddTokens(jqObj, data) {
    var jqBasename = $('#tokens_basename_input')
    var jqFirstIdx = $('#tokens_first_idx_input')
    var jqLastIdx = $('#tokens_last_idx_input')
    //var objNames = $('#tokens_names_textarea')
    var chk = widGetRangeDataState();
    if (chk.msg == 'ERROR') return widDone(jqObj, chk.cnt);

    var baseName = jqBasename.val();
    var idx0 = jqFirstIdx.val();
    var idx1 = jqLastIdx.val();
    var rawTok = widGetRawTokens().replace(/\s+$/g, '');
    var l = rawTok.length;
    var lastChar = rawTok.charAt(l - 1);
    var newTokens = (l == 0 || lastChar == '\u0020' || lastChar == '\u0009' || lastChar == '\u000A' || lastChar == '\u000B' || lastChar == '\u000D') ? '' : '\u0020';

    if (idx0 == '' && idx1 == '') {
        newTokens += '[' + baseName + ']';
    } else if (idx0 != '' && idx1 != '') {
        var idx0 = +idx0;
        var idx1 = +idx1;

        for (var i = idx0; i <= idx1; i++) {
            newTokens = (i == idx1) ? newTokens + '[' + baseName + i + ']' : newTokens + '[' + baseName + i + ']' + '\u0020';
        }
    } else {
        newTokens += '[' + baseName + ']' + '\u0020';
        var idx0 = +idx0;
        var idx1 = +idx1;

        for (var i = idx0; i <= idx1; i++) {
            newTokens = (i == idx1) ? newTokens + '[' + baseName + i + ']' : newTokens + '[' + baseName + i + ']' + '\u0020';
        }
    }

    rawTok += newTokens;

    if (rawTok.length <= 16511) {
        widGetRawTokens(rawTok);
		widGetRawTokens();
        //objNames[0].oninput();
        jqBasename.val('');
        jqFirstIdx.val('');
        jqLastIdx.val('');
        widDone(jqObj, 'OK');
    } else {
        widDone(jqObj, 'REQ_TOKENS_TOO_MANY');
    }

}

function widPreCreate(jqObj) {
    widCleanCL();
    glVTL = engGetVTL(glVTL);

	if (!widIsRawTokens()) return widDone(jqObj, 'Empty or bad tokens!');
	if (!widIsPassword()) return widDone(jqObj, 'Empty password!');

    var tokens = engGetTokens(widGetRawTokens(), glCurrentDB.hash);
    widCreateTokens(jqObj, tokens);
}

function widCreateTokens(jqObj, tokens) {
    var cbFunc = function (cbData, cmdIdx, progress) {
        if (glCL.items.length == 0) return;

        widShowProgressbar(progress);

        if (engGetResp(cbData).msg == 'ERROR') return widDone(jqObj, engGetResp(cbData).cnt);
		
		(cmdIdx + 1 < glCL.items.length) ? widShowTokensLog('Creating... ') : widDone(jqObj, 'OK');
    }

    for (var i = 0; i < tokens.length; i++) {
        var r = engGetNewRecord(0, tokens[i].s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);
        var zCmd = 'z * ' + glCurrentDB.name + ' 0 ' + tokens[i].s + ' ' + r.k + ' ' + r.g + ' ' + r.o + ' ';
        var lastCmd = 'last ' + glCurrentDB.name + ' ' + tokens[i].s;
        var zCmdIdx = (i == 0) ? 0 : i * 2;
        var lastCmdIdx = zCmdIdx + 1;

        glCL.items[zCmdIdx] = {};
        glCL.items[zCmdIdx].cmd = zCmd;
        glCL.items[zCmdIdx].r = tokens[i].r;
        glCL.items[zCmdIdx].s = tokens[i].s;
        glCL.items[lastCmdIdx] = {};
        glCL.items[lastCmdIdx].cmd = lastCmd;
        glCL.items[lastCmdIdx].r = tokens[i].r;
        glCL.items[lastCmdIdx].s = tokens[i].s;
    }

    engRunCL(glCL, cbFunc);
}

function widShowVerifyTableRow(rec, pic) {
    var jqTable = $('#tokens_verify_table');
	var row = widGetHTMLTr(widGetHTMLTd(pic + rec.st) + widGetHTMLTd(rec.r) + widGetHTMLTd(rec.s) + widGetHTMLTd(rec.n) + widGetHTMLTd(rec.d));
    jqTable.append(row);
}

function widGetVerifyTableRowLed(state) {
    switch (state) {
    case 'WRONG_PWD':
        return picYlw;
        break;
    case 'TKN_SNDNG':
        return picYlwGrn;
        break;
    case 'TKN_RCVNG':
        return picGrnYlw;
        break;
    case 'OK':
        return picGrn;
        break;
    default: // 'IDX_NODN':
        return picRed;
        break;
    }
}

function widPreVerify(jqObj) {
    widCleanCL();
    glVTL = engGetVTL(glVTL);
    widCleanVerifyTab();

	if (!widIsRawTokens()) return widDone(jqObj, 'Empty or bad tokens!');
	if (!widIsPassword()) return widDone(jqObj, 'Empty password!');

    var jqTable = $('#tokens_verify_table_pre');
	var jqDiv = jqTable.closest('div');
	var maxHeight = (($(window).height() - $('body').height()) > 200) ? ($(window).height() - $('body').height())/2 : 100;

	jqTable.outerWidth(jqDiv.innerWidth() - 4);
	jqTable.css('max-height',  maxHeight + 'px');
	jqTable.show();	
	
    var tokens = engGetTokens(widGetRawTokens(), glCurrentDB.hash);
    widVerifyTokens(jqObj, tokens);
}

function widVerifyTokens(jqObj, tokens) {
    var cbFunc = function (ajxData, clIdx, progress) {
        if (glCL.items.length == 0) return;
        if (engGetResp(ajxData).msg == 'ERROR') return widDone(jqObj, engGetResp(ajxData).cnt);

        widShowProgressbar(progress);
		
		var item = engGetTokenInfo(ajxData, glCL.items[clIdx].r, glCL.items[clIdx].s)
        glVTL = engGetVTL(glVTL, item); //add info to VTL about last processed token from CL;

        var idx = glVTL.items.length - 1;
        var lineLed = widGetVerifyTableRowLed(glVTL.items[idx].st);

		led.show(jqObj, !glVTL.unavail);
        widShowVerifyTableRow(glVTL.items[idx], lineLed);

        (glVTL.items.length < glCL.items.length) ? widShowTokensLog('Verifying...') : widDone(jqObj, 'OK');
	}

    for (var i = 0; i < tokens.length; i++) {
        var lastCmd = 'last ' + glCurrentDB.name + ' ' + tokens[i].s;
        glCL.items[i] = {};
        glCL.items[i].cmd = lastCmd;
        glCL.items[i].r = tokens[i].r;
        glCL.items[i].s = tokens[i].s;
    }

    engRunCL(glCL, cbFunc);
}

function widMakeVTL(jqObj, tokens, extCb) {
    glVTL = engGetVTL(glVTL);
    widCleanCL();
	
    var cbFunc = function (ajxData, clIdx, progress) {
        if (glCL.items.length == 0) return;
        if (engGetResp(ajxData).msg == 'ERROR') return widDone(jqObj, engGetResp(ajxData).cnt);
		
        widShowProgressbar(progress);
		
		var item = engGetTokenInfo(ajxData, glCL.items[clIdx].r, glCL.items[clIdx].s)
        glVTL = engGetVTL(glVTL, item); //add info to VTL about last processed token from CL;
        var idx = glVTL.items.length - 1;
		
        (glVTL.items.length < glCL.items.length) ? widShowTokensLog('Verifying tokens...') : setTimeout(extCb); // start external function;
    }
	
    for (var i = 0; i < tokens.length; i++) {
        var lastCmd = 'last ' + glCurrentDB.name + ' ' + tokens[i].s;
        glCL.items[i] = {};
        glCL.items[i].cmd = lastCmd;
        glCL.items[i].r = (tokens[i].r !== undefined) ? tokens[i].r : ''; 
        glCL.items[i].s = tokens[i].s;
    }
	
    engRunCL(glCL, cbFunc);
}

function widPreUpdate(jqObj, click) {
    widCleanCL();
	widCleanUI();
	var d;
    	
    switch (engGetVTLContent(glVTL)) {
    case true:
		d = $('#tokens_data_newdata_input').val();
        widUpdateTokens(jqObj, d);
        break;
    case false:
        widDone(jqObj, 'All tokens are unknown!');
        break;
    case undefined:
		if (click) {
			d = $('#tokens_data_newdata_input').val();
            widUpdateTokens(jqObj, d);
        } else {
            widContinueButtonClick(widGetContinueButtonObj(jqObj));
        }
        break;
    default:
		led.show(jqObj, null);
		if (!widIsRawTokens()) return widDone(jqObj, 'Empty or bad tokens!');
		if (!widIsPassword()) return widDone(jqObj, 'Empty password!');
        
		var tokens = engGetTokens(widGetRawTokens(), glCurrentDB.hash);
        var extCb = function (data) {
			widPreUpdate(jqObj);
            
        }
		
		widMakeVTL(jqObj, tokens, extCb);
        break;
    }
}

function widUpdateTokens(jqObj, data) {
	var cbFunc = function (cbData, cmdIdx, progress) {
        if (glCL.items.length === 0) return widDone(jqObj, cbData);

        widShowProgressbar(progress);

        if (engGetResp(cbData).msg === 'ERROR') return widDone(jqObj, engGetResp(cbData).cnt);
        (cmdIdx + 1 < glCL.items.length) ? widShowTokensLog('Update data... ') : widDone(jqObj, 'OK');
    }

    for (var i = 0; i < glVTL.items.length; i++) {
        if (glVTL.items[i].st == 'OK' && glVTL.items[i].d != data) {

            var n = +glVTL.items[i].n + 1; //new records number;
            var s = engGetHash(glVTL.items[i].r, glCurrentDB.hash);
            var r = engGetNewRecord(n, s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);
            var addCmd = 'add *' + ' ' + glCurrentDB.name + ' ' + n + ' ' + s + ' ' + r.k + ' ' + r.g + ' ' + r.o + ' ' + data;
            var lastCmd = 'last' + ' ' + glCurrentDB.name + ' ' + s;
            var idx = (glCL.items.length == 0) ? 0 : glCL.items.length;

            glCL.items[idx] = {};
            glCL.items[idx].cmd = addCmd;
            glCL.items[idx].r = glVTL.items[i].r;
            glCL.items[idx].s = glVTL.items[i].s;

            idx++;

            glCL.items[idx] = {};
            glCL.items[idx].cmd = lastCmd;
            glCL.items[idx].r = glVTL.items[i].r;
            glCL.items[idx].s = glVTL.items[i].s;
        }
    }
    engRunCL(glCL, cbFunc);
}

function widTransKeysUpdate(jqObj, transKeys, func){
	widCleanCL();
	var prCode = transKeys[0].prcode;
	
	if (prCode.charAt(0) === '0' && glVTL.items.length === 0) {
        var extCb = function () {
			widTransKeysUpdate(jqObj, transKeys, func);
        }
		widMakeVTL(jqObj, transKeys, extCb);
		return;
	} else if (prCode.charAt(0) === '0' && glVTL.items.length > 0) {
		if (transKeys.length !== glVTL.items.length) return widDone(jqObj, 'TransKeys update error!');
		transKeys = engGetUpdatedTransKeys(transKeys, glVTL);
	}
	
	var enrollKeys = engGetEnrollKeys(transKeys, glPassword, glCurrentDB.hash, glCurrentDB.magic);
	var	f = function () {
		func(jqObj, enrollKeys);
	}
	
	setTimeout(f);
}

function widPreSimpleSend(jqObj) {
    widCleanCL();

	var msg;
	
    switch (engGetVTLContent(glVTL)) {	// checks the contents of the verified tokens list
    case true:		// VTL contains only available tokens
	    widCleanUI(jqObj);
		led.show(jqObj, null);
        widSimpleSend(jqObj, glVTL);
        break;
    case false:		// VTL contains only unavailable tokens
		msg = 'All tokens are unavailable!';
		led.show(jqObj, false, msg);
		if (textArea.val(jqObj).length > 0) textArea.empty(jqObj);
        widDone(jqObj, msg);
        break;
    case undefined:		/// VTL contains both kinds of tokens - available and unavailable
		msg = 'Some tokens are unavailable!';
		led.show(jqObj, false, msg);
		if (textArea.val(jqObj).length > 0) textArea.empty(jqObj);
        widDone(jqObj, msg);
        break;
    default:		// VTL no contains any tokens then make new VTL 
		if (!widIsRawTokens()) return widDone(jqObj, 'Empty or bad tokens!');
		if (!widIsPassword()) return widDone(jqObj, 'Empty password!');
		
		led.show(jqObj, null);	

        var tok = engGetTokens(widGetRawTokens(), glCurrentDB.hash);
        var extCb = function (data) {
			widPreSimpleSend(jqObj);
        }
		widMakeVTL(jqObj, tok, extCb);
        break;
    }
}

function widSimpleSend(jqObj, list) {
    for (var i = 0; i < list.items.length; i++) {
        if (list.items[i].st == 'OK') {
		// only own tokens will include;
            var k1 = engGetKey(list.items[i].n + 1, list.items[i].s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
            var k2 = engGetKey(list.items[i].n + 2, list.items[i].s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
            var tkLine = list.items[i].n + ' ' + list.items[i].s + ' ' + k1 + ' ' + k2 + '\n';
			//tkLine = list.items[i].s + ' ' + k1 + ' ' + k2 + '\n';
			textArea.val(jqObj, tkLine);
        }
		
		widShowProgressbar(100 * (i + 1) / list.items.length);
        widShowTokensLog('Generation...');
    }

    var rawTransKeys = widGetTextareaObj(jqObj).val().replace(/\s/g, '');
    var prLine = engGetHash(rawTransKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '1231320';
	//var prLine = engGetHash(rawTransKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '0231320';
	
    textArea.val(jqObj, prLine);
	led.show(jqObj, true);
    widDone(jqObj, 'OK');
}

function widPreSimpleReceive(jqObj, click) {
	led.empty(jqObj);
	var rawTransKeys = widGetTextareaObj(jqObj).val();
	if (!engIsRawTransKeys(rawTransKeys)) return widDone(jqObj, 'Bad TransKeys!');
	if (!widIsPassword)	return widDone(jqObj, 'Empty password!');
	
	if (widGetRawTokens().length > 0 && (typeof click == 'undefined')) {
		//if there is tokens make users request for continue;
		//if "Continue" button will pressed "click" will stay true
		return widContinueButtonClick(widGetContinueButtonObj(jqObj));
	} 

 	widCleanCL();
	glVTL = engGetVTL(glVTL);
	
    var tok = engGetTokens(widGetRawTokens(), glCurrentDB.hash);		
    var transKeys = engGetTransKeys(rawTransKeys);
	tok = engGetMergedTokensList(engGetHashedTokensList(transKeys), engGetRawTokensList(tok), glCurrentDB.hash);
    widShowOrderedTokensNames(tok);
	widTransKeysUpdate(jqObj, transKeys, widSimpleReceive); 
}

function widSimpleReceive(jqObj, enrollKeys) {
    var cbFunc = function (data, cmdIdx, progress) {
		widShowProgressbar(progress);
		
		var err = 'Operation error occurred.\nPlease verify tokens state!';
        (engGetResp(data).msg !== 'ERROR') ? led.show(jqObj, true) : led.show(jqObj, false, err);
		
        if (glCL.items.length == 0) return widDone(jqObj, 'Operation cancelled!');
		(cmdIdx + 1 < glCL.items.length) ? widShowTokensLog('Obtaining keys...') : widDone(jqObj, 'Done.');
	}
	
    for (var i = 0; i < enrollKeys.length; i++) {
        var n0 = enrollKeys[i].n;
        var n1 = n0 + 1;
        var n2 = n0 + 2;
        var s = enrollKeys[i].s;
        var k1 = enrollKeys[i].k1;
        var g1 = enrollKeys[i].g1;
        var o1 = enrollKeys[i].o1;
        var k2 = enrollKeys[i].k2;
        var g2 = enrollKeys[i].g2;
        var o2 = enrollKeys[i].o2;

        var addCmd1 = 'add * ' + glCurrentDB.name + ' ' + n1 + ' ' + s + ' ' + k1 + ' ' + g1 + ' ' + o1;
        var addCmd2 = 'add * ' + glCurrentDB.name + ' ' + n2 + ' ' + s + ' ' + k2 + ' ' + g2 + ' ' + o2;

        var idx = (i == 0) ? 0 : i * 2;
		
        glCL.items[idx] = {};
        glCL.items[idx].cmd = addCmd1;
        glCL.items[idx].s = s;
        glCL.items[idx].r = '';

        idx++;

        glCL.items[idx] = {};
        glCL.items[idx].cmd = addCmd2;
        glCL.items[idx].s = s;
        glCL.items[idx].r = '';
    }

    engRunCL(glCL, cbFunc);
}

function widPreSimpleRequest(jqObj) {
    widCleanCL();
    widCleanUI(jqObj);
	var msg;
	
    switch (engGetVTLContent(glVTL)) { // checks the contents of the verified tokens list
	case true: // VTL contains only available
		msg = 'All tokens in the list are already available!';
		led.show(jqObj, false, msg);
		widDone(jqObj, msg);
		break;
    case false:		// VTL contains only unavailable tokens
		led.show(jqObj, null);
        widSimpleRequest(jqObj, glVTL);
        break;
    case undefined:		// VTL contains both kinds of tokens - available and unavailable
		msg = 'There are some available tokens in the list!';
		led.show(jqObj, false, msg);
		widDone(jqObj, msg);
        break;		
    default:
		if (!widIsRawTokens()) return widDone(jqObj, 'Empty or bad tokens!');
		if (!widIsPassword()) return widDone(jqObj, 'Empty password!');
		
        var tok = engGetTokens(widGetRawTokens(), glCurrentDB.hash);
        var extCb = function (data) {
			widPreSimpleRequest(jqObj);
        }
		led.show(jqObj, null);
		widMakeVTL(jqObj, tok, extCb);
        break;
    }
}

function widSimpleRequest(jqObj, list) {
    for (var i = 0; i < list.items.length; i++) {
		if (list.items[i].st === 'WRONG_PWD') {
			// includes only existing unknown tokens
            var r = list.items[i];
            var k3 = engGetKey(r.n + 3, r.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
            var k4 = engGetKey(r.n + 4, r.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
            var g2 = engGetKey(r.n + 3, r.s, k3, glCurrentDB.magic, glCurrentDB.hash);
            var g3 = engGetKey(r.n + 4, r.s, k4, glCurrentDB.magic, glCurrentDB.hash);
            var o2 = engGetKey(r.n + 3, r.s, g3, glCurrentDB.magic, glCurrentDB.hash);
            var tkLine = r.n + ' ' + r.s + ' ' + g2 + ' ' + o2 + '\n';
			//tkLine = r.s + ' ' + g2 + ' ' + o2 + '\n';
			textArea.val(jqObj, tkLine);
		}

		widShowProgressbar(100 * (i + 1) / list.items.length);
		widShowTokensLog('Generation...');
    }
	
	var msg, flag;
	if (textArea.val(jqObj).length == 0) {
		msg = 'Inappropriate tokens!';
		flag = false;
	} else {
		var rawTransKeys = $(widGetTextareaObj(jqObj)).val().replace(/\s/g, '');
		var prLine = engGetHash(rawTransKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '1242520';
		//var prLine = engGetHash(rawTransKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '0242520';
		textArea.val(jqObj, prLine);
		msg = 'OK';
		flag = true;
	}
	
	led.show(jqObj, flag, msg);
    widDone(jqObj, msg);
}

function widPreSimpleAccept(jqObj, click) {
    var rawTransKeys = widGetTextareaObj(jqObj).val();
    if (!engIsRawTransKeys(rawTransKeys)) return widDone(jqObj, 'Bad TransKeys!');
	if (!widIsPassword()) return widDone(jqObj, 'Empty password!');
	
	if (widGetRawTokens().length > 0 && (typeof click == 'undefined')) {
		//if there is tokens make users request for continue;
		//if "Continue" button will pressed "click" will stay true
		return widContinueButtonClick(widGetContinueButtonObj(jqObj));
	} 
	
    widCleanCL();
    glVTL = engGetVTL(glVTL);

	var tok = engGetTokens(widGetRawTokens(), glCurrentDB.hash);
    var transKeys = engGetTransKeys(rawTransKeys);
	tok = engGetMergedTokensList(engGetHashedTokensList(transKeys), engGetRawTokensList(tok), glCurrentDB.hash); 
	widShowOrderedTokensNames(tok);
	widTransKeysUpdate(jqObj, transKeys, widSimpleAccept); 
}

function widSimpleAccept(jqObj, enrollKeys) {
    var cbFunc = function (data, cmdIdx, progress) {
        widShowProgressbar(progress);
		
		var err = 'Operation error occurred.\nPlease verify tokens state!';
        (engGetResp(data).msg !== 'ERROR') ? led.show(jqObj, true) : led.show(jqObj, false, err);

        if (glCL.items.length == 0) return widDone(jqObj, 'Operation cancelled!');
		(cmdIdx + 1 < glCL.items.length) ? widShowTokensLog('Obtaining keys...') : widDone(jqObj, 'Done.');
    }

    for (var i = 0; i < enrollKeys.length; i++) {
        var n0 = enrollKeys[i].n;
        var n1 = enrollKeys[i].n1;
        var n2 = enrollKeys[i].n2;
        var s = enrollKeys[i].s;
        var k1 = enrollKeys[i].k1;
        var g1 = enrollKeys[i].g1;
        var o1 = enrollKeys[i].o1;
        var k2 = enrollKeys[i].k2;
        var g2 = enrollKeys[i].g2;
        var o2 = enrollKeys[i].o2;

        var addCmd1 = 'add * ' + glCurrentDB.name + ' ' + n1 + ' ' + s + ' ' + k1 + ' ' + g1 + ' ' + o1;
        var addCmd2 = 'add * ' + glCurrentDB.name + ' ' + n2 + ' ' + s + ' ' + k2 + ' ' + g2 + ' ' + o2;

        var idx = (i == 0) ? 0 : i * 2;

        glCL.items[idx] = {};
        glCL.items[idx].cmd = addCmd1;
        glCL.items[idx].s = s;
        glCL.items[idx].r = '';

        idx++;

        glCL.items[idx] = {};
        glCL.items[idx].cmd = addCmd2;
        glCL.items[idx].s = s;
        glCL.items[idx].r = '';
    }

    engRunCL(glCL, cbFunc);
}

function widPreBlockingSendStep1(jqObj) {
    widCleanCL();
	var msg;
	
    switch (engGetVTLContent(glVTL)) {
    case true:		// VTL contains only available tokens
	    widCleanUI(jqObj);
	    led.show(jqObj, null);
        widBlockingSendStep1(jqObj, glVTL);
        break;
    case false:		// VTL contains only unavailable tokens
		msg = 'All tokens are unavailable!';
		led.show(jqObj, false, msg);	
		if (textArea.val(jqObj).length > 0) textArea.empty(jqObj);
        widDone(jqObj, msg);
        break;
    case undefined:		// VTL contains both kinds of tokens - available and unavailable
		msg = 'Some tokens are unavailable!';
		led.show(jqObj, false, msg);	
		if (textArea.val(jqObj).length > 0) textArea.empty(jqObj);
        widDone(jqObj, msg);
        break;
    default:
		if (!widIsRawTokens()) return widDone(jqObj, 'Empty or bad tokens!');
		if (!widIsPassword()) return widDone(jqObj, 'Empty password!');
		
		led.show(jqObj, null);
        
		var tok = engGetTokens(widGetRawTokens(), glCurrentDB.hash);
        var extCb = function (data) {
			widPreBlockingSendStep1(jqObj);
        }
		widMakeVTL(jqObj, tok, extCb);
        break;
    }
}

function widBlockingSendStep1(jqObj, list) {
    for (var i = 0; i < list.items.length; i++) {
        if (list.items[i].st === 'OK') {
			// includes only known tokens;
            var r = list.items[i];
            var n0 = r.n;
            var k1 = engGetKey(r.n + 1, r.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
            var k2 = engGetKey(r.n + 2, r.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
            var g1 = engGetKey(r.n + 2, r.s, k2, glCurrentDB.magic, glCurrentDB.hash);
            var tkLine = n0 + ' ' + r.s + ' ' + k1 + ' ' + g1 + '\n';
			//tkLine = r.s + ' ' + k1 + ' ' + g1 + '\n';
			textArea.val(jqObj, tkLine);
        }

		widShowProgressbar(100 * (i + 1) / list.items.length);
		widShowTokensLog('Generation...');
    }

    var rawTransKeys = widGetTextareaObj(jqObj).val().replace(/\s/g, '');
    var prLine = engGetHash(rawTransKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '1231410';
	//var prLine = engGetHash(rawTransKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '0231410';
	
    textArea.val(jqObj, prLine);
	led.show(jqObj, true);
    widDone(jqObj, 'OK');
}

function widPreBlockingSendStep2(jqObj) {
    widCleanCL();
	var msg;

    switch (engGetVTLContent(glVTL)) {	// checks the contents of the verified tokens list
    case true:		// VTL contains only available tokens
		msg = 'All All tokens in the list are already available!';
        led.show(jqObj, false, msg); 
		if (textArea.val(jqObj).length > 0) textArea.empty(jqObj);
		widDone(jqObj, msg);
        break;
    case false:		// VTL contains only unavailable tokens
		led.show(jqObj, null);
        widBlockingSendStep2(jqObj, glVTL);
        break;
    case undefined:		// VTL contains both kinds of tokens - available and unavailable
		msg = 'Some All tokens in the list are already available!';
        led.show(jqObj, false, msg);
		if (textArea.val(jqObj).length > 0) textArea.empty(jqObj);
        widDone(jqObj, msg);
        break;
    default:		// VTL no contains any tokens then make new VTL
		if (!widIsRawTokens()) return widDone(jqObj, 'Empty or bad tokens!');
		if (!widIsPassword()) return widDone(jqObj, 'Empty password!');

		led.show(jqObj, null);
		
        var tok = engGetTokens(widGetRawTokens(), glCurrentDB.hash);
        var extCb = function (data) {
			widPreBlockingSendStep2(jqObj);
        }
		widMakeVTL(jqObj, tok, extCb);
        break;
    }
}
	
function widBlockingSendStep2(jqObj, list) {
    for (var i = 0; i < list.items.length; i++) {
        if (list.items[i].st === 'TKN_SNDNG') {
			//include only tokens in sending state;
            var r = list.items[i];
            var n0 = r.n - 1;
            var n2 = r.n + 1;
            var k2 = engGetKey(n2, r.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
            var tkLine = n0 + ' ' + r.s + ' ' + k2 + '\n';
			//tkLine = r.s + ' ' + k2 + '\n';
			textArea.val(jqObj, tkLine);
        } 
		
		widShowProgressbar(100 * (i + 1) / list.items.length);
		widShowTokensLog('Generation...');
    }

	var msg, flag;
	if (textArea.val(jqObj).length == 0) {
		msg = 'Inappropriate tokens!';
		flag = false;
	} else {
		var rawTransKeys = widGetTextareaObj(jqObj).val().replace(/\s/g, '');
		var prLine = engGetHash(rawTransKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '12320';
		//var prLine = engGetHash(rawTransKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '02320';
		textArea.val(jqObj, prLine);
		msg = 'OK';
		flag = true;
	}
	
	led.show(jqObj, flag);
    widDone(jqObj, 'OK');
}

function widPreBlockingReceiveStep1(jqObj, click) {
	var rawTransKeys = widGetTextareaObj(jqObj).val();
	if (!engIsRawTransKeys(rawTransKeys)) return widDone(jqObj, 'Bad TransKeys!');
	if (!widIsPassword)	return widDone(jqObj, 'Empty password!');

	if (widGetRawTokens().length > 0 && (typeof click == 'undefined')) {
		//if there is tokens make users request for continue;
		//if "Continue" button will pressed "click" will stay true
		return widContinueButtonClick(widGetContinueButtonObj(jqObj));
	} 
	
    widCleanCL();
	glVTL = engGetVTL(glVTL);

	if (!widIsPassword()) return widDone(jqObj, 'Empty password!');

    var tok = engGetTokens(widGetRawTokens(), glCurrentDB.hash);		
    var transKeys = engGetTransKeys(rawTransKeys);
	tok = engGetMergedTokensList(engGetHashedTokensList(transKeys), engGetRawTokensList(tok), glCurrentDB.hash);
    widShowOrderedTokensNames(tok);
	widTransKeysUpdate(jqObj, transKeys, widBlockingReceiveStep1); 
}

function widBlockingReceiveStep1(jqObj, enrollKeys) {
    var cbFunc = function (data, cmdIdx, progress) {
		widShowProgressbar(progress);
		
		var err = 'Operation error occurred.\nPlease verify tokens state!';
        (engGetResp(data).msg !== 'ERROR') ? led.show(jqObj, true) : led.show(jqObj, false, err);

        if (glCL.items.length == 0) return widDone(jqObj, 'Operation cancelled!');
		(cmdIdx + 1 < glCL.items.length) ? widShowTokensLog('Obtaining keys...') : widDone(jqObj, 'Done.');
    }

    for (var i = 0; i < enrollKeys.length; i++) {
        var n0 = enrollKeys[i].n;
        var n1 = n0 + 1;
        var s = enrollKeys[i].s;
        var k1 = enrollKeys[i].k1;
        var g1 = enrollKeys[i].g1;
        var o1 = enrollKeys[i].o1;

        var addCmd = 'add * ' + glCurrentDB.name + ' ' + n1 + ' ' + s + ' ' + k1 + ' ' + g1 + ' ' + o1;

        glCL.items[i] = {};
        glCL.items[i].cmd = addCmd;
        glCL.items[i].s = s;
        glCL.items[i].r = '';
    }

    engRunCL(glCL, cbFunc);
}

function widPreBlockingReceiveStep2(jqObj, click) {
	var rawTransKeys = widGetTextareaObj(jqObj).val();
	if (!engIsRawTransKeys(rawTransKeys)) return widDone(jqObj, 'Bad TransKeys!');
	if (!widIsPassword)	return widDone(jqObj, 'Empty password!');
	
	if (widGetRawTokens().length > 0 && (typeof click == 'undefined')) {
		//if there is tokens make users request for continue;
		//if "Continue" button will pressed "click" will stay true
		return widContinueButtonClick(widGetContinueButtonObj(jqObj));
	} 

 	widCleanCL();
	glVTL = engGetVTL(glVTL);
	
    var tok = engGetTokens(widGetRawTokens(), glCurrentDB.hash);		
    var transKeys = engGetTransKeys(rawTransKeys);
	tok = engGetMergedTokensList(engGetHashedTokensList(transKeys), engGetRawTokensList(tok), glCurrentDB.hash);
    widShowOrderedTokensNames(tok);
	widTransKeysUpdate(jqObj, transKeys, widBlockingReceiveStep2); 
}

function widBlockingReceiveStep2(jqObj, enrollKeys) {
    var cbFunc = function (data, cmdIdx, progress) {
		widShowProgressbar(progress);
		
		var resp = engGetResp(data);
		
        if (resp.msg == 'ERROR') {
			led.show(jqObj, false, resp.msg + ': ' + resp.cnt);
			return widDone(jqObj, resp.msg + ': ' + resp.cnt);			
		}
		
		led.show(jqObj, true)

        if (glCL.items.length == 0) return widDone(jqObj, 'Operation cancelled!');
		(cmdIdx + 1 < glCL.items.length) ? widShowTokensLog('Obtaining keys...') : widDone(jqObj, 'OK');
    }

    for (var i = 0; i < enrollKeys.length; i++) {
        var n0 = enrollKeys[i].n;
        var n2 = n0 + 2;
        var s = enrollKeys[i].s;
        var k2 = enrollKeys[i].k2;
        var g2 = enrollKeys[i].g2;
        var o2 = enrollKeys[i].o2;
        
		var addCmd = 'add * ' + glCurrentDB.name + ' ' + n2 + ' ' + s + ' ' + k2 + ' ' + g2 + ' ' + o2;
		
        glCL.items[i] = {};
        glCL.items[i].cmd = addCmd;
        glCL.items[i].s = s;
        glCL.items[i].r = '';

    }

    engRunCL(glCL, cbFunc);
}

function widPreBlockingRequestStep1(jqObj) {
    widCleanCL();
	widCleanUI(jqObj);
	var msg;
	
    switch (engGetVTLContent(glVTL)) {	// checks the contents of the verified tokens list
    case true:		// VTL contains only available tokens
		msg = 'All tokens in the list are already available!';
		led.show(jqObj, false, msg);
        widDone(jqObj, msg);
        break;
    case false:		// VTL contains only unavailable tokens
		led.show(jqObj, null);
		widBlockingRequestStep1(jqObj, glVTL);
        break;
    case undefined:		// VTL contains both kinds of tokens - available and unavailable
		msg = 'There are some available tokens in the list!';
		led.show(jqObj, false, msg);	
        widDone(jqObj, msg);
        break;
    default:		// VTL no contains any tokens then make new VTL 
		if (!widIsRawTokens()) return widDone(jqObj, 'Empty or bad tokens!');
		if (!widIsPassword()) return widDone(jqObj, 'Empty password!');
		
		var tok = engGetTokens(widGetRawTokens(), glCurrentDB.hash);
        var extCb = function (data) {
			widPreBlockingRequestStep1(jqObj);
        }
		led.show(jqObj, null);
		widMakeVTL(jqObj, tok, extCb);
        break;
    }
}

function widBlockingRequestStep1(jqObj, list) {
    for (var i = 0; i < list.items.length; i++) {
        if (list.items[i].st === 'WRONG_PWD') {
			// includes only existing unknown tokens
            var r = list.items[i];
            var n0 = r.n;
            var k3 = engGetKey(n0 + 3, r.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
            var g2 = engGetKey(n0 + 3, r.s, k3, glCurrentDB.magic, glCurrentDB.hash);
            var o1 = engGetKey(n0 + 2, r.s, g2, glCurrentDB.magic, glCurrentDB.hash);
            var tkLine = r.n + ' ' + r.s + ' ' + o1 + '\n';
			//var tkLine = r.s + ' ' + o1 + '\n';
			textArea.val(jqObj, tkLine);
        }
        
        widShowProgressbar(100 * (i + 1) / list.items.length);
		widShowTokensLog('Generation...');
    }
	
	var msg, flag;
	if (textArea.val(jqObj).length == 0) {
		msg = 'Inappropriate tokens!';
		flag = false;
	} else {
		var rawTransKeys = $(widGetTextareaObj(jqObj)).val().replace(/\s/g, '');
		var prLine = engGetHash(rawTransKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '12510';
		//var prLine = engGetHash(rawTransKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '02510';
		textArea.val(jqObj, prLine);
		msg = 'OK';
		flag = true;
	}
	
	led.show(jqObj, flag, msg);
    widDone(jqObj, msg);
}

function widPreBlockingRequestStep2(jqObj) {
    widCleanCL();
	widCleanUI(jqObj);
	var msg;
	
    switch (engGetVTLContent(glVTL)) { // checks the contents of the verified tokens list
	case true: // VTL contains only available
		msg = 'All tokens in the list are already available!';
		led.show(jqObj, false, msg);
		widDone(jqObj, msg);
		break;
    case false:		// VTL contains only unavailable tokens
		led.show(jqObj, null);
        widBlockingRequestStep2(jqObj, glVTL);
        break;
    case undefined:		// VTL contains both kinds of tokens - available and unavailable
		msg = 'There are some available tokens in the list!';
		led.show(jqObj, false, msg);
		widDone(jqObj, msg);
        break;		
    default:
		if (!widIsRawTokens()) return widDone(jqObj, 'Empty or bad tokens!');
		if (!widIsPassword()) return widDone(jqObj, 'Empty password!');
		
        var tok = engGetTokens(widGetRawTokens(), glCurrentDB.hash);
        var extCb = function (data) {
			widPreBlockingRequestStep2(jqObj);
        }
		led.show(jqObj, null);
		widMakeVTL(jqObj, tok, extCb);
        break;
    }
}

function widBlockingRequestStep2(jqObj, data) {
    for (var i = 0; i < data.items.length; i++) {
        if (data.items[i].st === 'TKN_RCVNG') {
			// includes only existing tokens in blocking receiving state
            var r = data.items[i];
            var n0 = r.n - 1;
            var k3 = engGetKey(n0 + 3, r.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
            var g2 = engGetKey(n0 + 3, r.s, k3, glCurrentDB.magic, glCurrentDB.hash); //
            var k4 = engGetKey(n0 + 4, r.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
            var g3 = engGetKey(n0 + 4, r.s, k4, glCurrentDB.magic, glCurrentDB.hash);
            var o2 = engGetKey(n0 + 3, r.s, g3, glCurrentDB.magic, glCurrentDB.hash); //
            var tkLine = n0 + ' ' + r.s + ' ' + g2 + ' ' + o2 + '\n';
			//var tkLine = r.s + ' ' + g2 + ' ' + o2 + '\n';
			textArea.val(jqObj, tkLine);
        } 
		
		widShowProgressbar(100 * (i + 1) / data.items.length);
        widShowTokensLog('Generation...');
    }
	
	var msg, flag;
	if (textArea.val(jqObj).length == 0) {
		msg = 'Inappropriate tokens!';
		flag = false;
	} else {
		var rawTransKeys = $(widGetTextareaObj(jqObj)).val().replace(/\s/g, '');
		var prLine = engGetHash(rawTransKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '1242520';
		//var prLine = engGetHash(rawTransKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '0242520';
		textArea.val(jqObj, prLine);
		msg = 'OK';
		flag = true;
	}
	
	led.show(jqObj, flag, msg);
    widDone(jqObj, msg);
}

function widPreBlockingAcceptStep1(jqObj, click) {
    var rawTransKeys = widGetTextareaObj(jqObj).val();
    if (!engIsRawTransKeys(rawTransKeys)) return widDone(jqObj, 'Bad TransKeys!');
	if (!widIsPassword()) return widDone(jqObj, 'Empty password!');
	
	if (widGetRawTokens().length > 0 && (typeof click == 'undefined')) {
		//if there is tokens make users request for continue;
		//if "Continue" button will pressed "click" will stay true
		return widContinueButtonClick(widGetContinueButtonObj(jqObj));
	} 
	
    widCleanCL();
    glVTL = engGetVTL(glVTL);

	var tok = engGetTokens(widGetRawTokens(), glCurrentDB.hash);
    var transKeys = engGetTransKeys(rawTransKeys);
	tok = engGetMergedTokensList(engGetHashedTokensList(transKeys), engGetRawTokensList(tok), glCurrentDB.hash); 
	widShowOrderedTokensNames(tok);
	widTransKeysUpdate(jqObj, transKeys, widBlockingAcceptStep1); 
}

function widBlockingAcceptStep1(jqObj, enrollKeys) {
    var cbFunc = function (data, cmdIdx, progress) {
		widShowProgressbar(progress);
		
		var err = 'Operation error occurred.\nPlease verify tokens state!';
        (engGetResp(data).msg !== 'ERROR') ? led.show(jqObj, true) : led.show(jqObj, false, err);

        if (glCL.items.length == 0) return widDone(jqObj, 'Operation cancelled!');
		(cmdIdx + 1 < glCL.items.length) ? widShowTokensLog('Obtaining keys...') : widDone(jqObj, 'Done.');
    }

    for (var i = 0; i < enrollKeys.length; i++) {
        var n1 = enrollKeys[i].n1;
        var s = enrollKeys[i].s;
        var k1 = enrollKeys[i].k1;
        var g1 = enrollKeys[i].g1;
        var o1 = enrollKeys[i].o1;
		
        var addCmd = 'add * ' + glCurrentDB.name + ' ' + n1 + ' ' + s + ' ' + k1 + ' ' + g1 + ' ' + o1;

        glCL.items[i] = {};
        glCL.items[i].cmd = addCmd;
        glCL.items[i].s = s;
        glCL.items[i].r = '';

    }

    engRunCL(glCL, cbFunc);
}

function widPreBlockingAcceptStep2(jqObj, click) {
    var rawTransKeys = widGetTextareaObj(jqObj).val();
    if (!engIsRawTransKeys(rawTransKeys)) return widDone(jqObj, 'Bad TransKeys!');
	if (!widIsPassword()) return widDone(jqObj, 'Empty password!');
	
	if (widGetRawTokens().length > 0 && (typeof click == 'undefined')) {
		//if there is tokens make users request for continue;
		//if "Continue" button will pressed "click" will stay true
		return widContinueButtonClick(widGetContinueButtonObj(jqObj));
	} 
	
    widCleanCL();
    glVTL = engGetVTL(glVTL);

	var tok = engGetTokens(widGetRawTokens(), glCurrentDB.hash);
    var transKeys = engGetTransKeys(rawTransKeys);
	tok = engGetMergedTokensList(engGetHashedTokensList(transKeys), engGetRawTokensList(tok), glCurrentDB.hash); 
	widShowOrderedTokensNames(tok);
	widTransKeysUpdate(jqObj, transKeys, widBlockingAcceptStep2); 
}

function widBlockingAcceptStep2(jqObj, enrollKeys) {
    var cbFunc = function (data, cmdIdx, progress) {
        widShowProgressbar(progress);
		
		var err = 'Operation error occurred.\nPlease verify tokens state!';
        (engGetResp(data).msg !== 'ERROR') ? led.show(jqObj, true) : led.show(jqObj, false, err);

        if (glCL.items.length == 0) return widDone(jqObj, 'Operation cancelled!');
		(cmdIdx + 1 < glCL.items.length) ? widShowTokensLog('Obtaining keys...') : widDone(jqObj, 'Done.');
    }

    for (var i = 0; i < enrollKeys.length; i++) {
        var n2 = enrollKeys[i].n2;
        var s = enrollKeys[i].s;
        var k2 = enrollKeys[i].k2;
        var g2 = enrollKeys[i].g2;
        var o2 = enrollKeys[i].o2;

        var addCmd = 'add * ' + glCurrentDB.name + ' ' + n2 + ' ' + s + ' ' + k2 + ' ' + g2 + ' ' + o2;

        glCL.items[i] = {};
        glCL.items[i].cmd = addCmd;
        glCL.items[i].s = s;
        glCL.items[i].r = '';
    }

    engRunCL(glCL, cbFunc);
}
