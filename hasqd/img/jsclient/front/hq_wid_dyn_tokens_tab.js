// Hasq Technology Pty Ltd (C) 2013-2015

function widCleanCL() {
    glCL.idx = 0;
    glCL.counter = 100;
    glCL.items.length = 0;
}

function widCleanVerifyTab() {
    $('#tokens_verify_table').find('tr:gt(0)').remove();
    $('#tokens_verify_table_div').hide();
    $('#tokens_verify_led_div').empty();
}

function widCleanAllLeds() {
	$('#tokens_tabs').find('div[data-class="led_div"]').empty();
}

function widCleanUI() {
	$('div[data-class="capsule"]').find('textarea').val('');
	
	widCleanAllLeds();	
	widCleanVerifyTab();
    widShowProgressbar(0);
}

function widCleanClosestUI(jqObj) {
	jqObj.closest('div[data-class="capsule"]').find('div[data-class="led_div"]').empty();
	jqObj.closest('div[data-class="capsule"]').find('textarea').val('');
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

    if (arguments.length == 0) {
        objLog.html('&nbsp');
    } else {
        objLog.html(data);
    }

}

function widTokensIdxOninput(jqObj) {
	jqObj.val(engGetOnlyNumber(jqObj.val()));
}

function widTokensPasswordOninput(data) {
    glPassword = data;
    glVTL = engGetVTL(glVTL);
    widCleanVerifyTab();
	widCleanAllLeds();
}

function widIsInitialData() {
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
    r.message = 'OK';
    r.content = 'OK';

    if (jqBasename.val() == '') {
        r.message = 'ERROR';
        r.content = 'Empty basename.';
    } else if (/[\s]/g.test(jqBasename.val())) {
        r.message = 'ERROR';
        r.content = 'Incorrect basename. Please, remove spaces.';
    } else if (idx0 > idx1) {
        r.message = 'ERROR';
        r.content = 'Incorrect indexes. The start index should not be bigger the end index.';
    } else if (idx1 - idx0 > 127) {
        r.message = 'ERROR';
        r.content = 'Too many tokens, the maximum quantity - 128';
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

function widAddTokens(id, data) {
    var jqBasename = $('#tokens_basename_input')
    var objFirstIdx = $('#tokens_first_idx_input')
    var objLastIdx = $('#tokens_last_idx_input')
    //var objNames = $('#tokens_names_textarea')
    var chk = widGetRangeDataState();

    if (chk.message == 'ERROR') return widDone(id, chk.content);

    var baseName = jqBasename.val();
    var idx0 = objFirstIdx.val();
    var idx1 = objLastIdx.val();
    var tokens = widGetRawTokens().replace(/\s+$/g, '');
    var l = tokens.length;
    var lastChar = tokens.charAt(l - 1);
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

    tokens += newTokens;

    if (tokens.length <= 16511) {
        widGetRawTokens(tokens);
		widGetRawTokens();
        //objNames[0].oninput();
        jqBasename.val('');
        objFirstIdx.val('');
        objLastIdx.val('');
        widDone(id, 'OK');
    } else {
        widDone(id, 'REQ_TOKENS_TOO_MANY');
    }

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
	var strFunc = (arguments.length > 1) ? jqObj.attr('data-function') + '(jqObj, click)' : jqObj.attr('data-function') + '(jqObj)';

    return function () {
        eval(strFunc);
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

    if (click === true) {
        setTimeout(widGetFunctionById(widGetMainButtonObj(jqObj), click));
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
    var cbFunc = function (cbData, cmdItemIdx, progress) {
        if (glCL.items.length == 0) return;

        widShowProgressbar(progress);

        var cbResponse = engGetResponse(cbData);
        if (cbResponse.message == 'ERROR') {
            return widDone(jqObj, cbResponse.content);
			
        } 
		
		if (cmdItemIdx + 1 < glCL.items.length) {
            widShowTokensLog('Creating... ');
        } else {
            return widDone(jqObj, 'OK');
        }
    }

    for (var i = 0; i < tokens.length; i++) {
        var r = engGetNewRecord(0, tokens[i].s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);
        var zCmd = 'z * ' + glCurrentDB.name + ' 0 ' + tokens[i].s + ' ' + r.k + ' ' + r.g + ' ' + r.o + ' ';
        var lastCmd = 'last ' + glCurrentDB.name + ' ' + tokens[i].s;
        var zCmdIdx = (i == 0) ? 0 : i * 2;
        var lastCmdIdx = zCmdIdx + 1;

        glCL.items[zCmdIdx] = {};
        glCL.items[zCmdIdx].cmd = zCmd;
        glCL.items[zCmdIdx].rawS = tokens[i].rawS;
        glCL.items[zCmdIdx].s = tokens[i].s;
        glCL.items[lastCmdIdx] = {};
        glCL.items[lastCmdIdx].cmd = lastCmd;
        glCL.items[lastCmdIdx].rawS = tokens[i].rawS;
        glCL.items[lastCmdIdx].s = tokens[i].s;
    }

    engRunCL(glCL, cbFunc);
}

function widShowVerifyTableRow(data, pic) {
    var table = $('#tokens_verify_table');
	var row = widGetHTMLTr(widGetHTMLTd(pic + data.message) + widGetHTMLTd(data.rawS) + widGetHTMLTd(data.s) + widGetHTMLTd(data.n) + widGetHTMLTd(data.d));
    table.append(row);
}

function widGetVerifyTableRowLed(data) {
    switch (data) {
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

function widPreVerify(jqObj, data) {
    widCleanCL();
    glVTL = engGetVTL(glVTL);
    widCleanVerifyTab();

	if (!widIsRawTokens()) return widDone(jqObj, 'Empty or bad tokens!');
	if (!widIsPassword()) return widDone(jqObj, 'Empty password!');

    var objTable = $('#tokens_verify_table_div');

    objTable.css('display', 'block');
    var tokens = engGetTokens(widGetRawTokens(), glCurrentDB.hash);

    widVerifyTokens(jqObj, tokens);
}

function widVerifyTokens(jqObj, tokens) {
    var cbFunc = function (ajxData, clIdx, progress) {
        if (glCL.items.length == 0) {
            return;
        }

        var r = engGetResponse(ajxData);

        if (r.message == 'ERROR') {
            widDone(jqObj, r.content);
            return;
        }

        widShowProgressbar(progress);
		
		var item = engGetTokenInfo(ajxData, glCL.items[clIdx].rawS, glCL.items[clIdx].s)
        glVTL = engGetVTL(glVTL, item); //add info to VTL about last processed token from CL;

        var idx = glVTL.items.length - 1;
        var led = widGetVerifyTableRowLed(glVTL.items[idx].message);

		widShowLed(jqObj, !glVTL.unknown);
        widShowVerifyTableRow(glVTL.items[idx], led);

        if (glVTL.items.length < glCL.items.length) {
            widShowTokensLog('Verifying...');
        } else {
			widDone(jqObj, 'OK');
		}
	}

    for (var i = 0; i < tokens.length; i++) {
        var lastCmd = 'last ' + glCurrentDB.name + ' ' + tokens[i].s;
        glCL.items[i] = {};
        glCL.items[i].cmd = lastCmd;
        glCL.items[i].rawS = tokens[i].rawS;
        glCL.items[i].s = tokens[i].s;
    }

    engRunCL(glCL, cbFunc);
}

function widMakeVTL(jqObj, tokens, extCb) {
    glVTL = engGetVTL(glVTL);
    widCleanCL();
	
    var cbFunc = function (ajxData, clIdx, progress) {

        if (glCL.items.length == 0) {
            return;
        }

        var r = engGetResponse(ajxData);

        if (r.message == 'ERROR') {
            widDone(jqObj, r.message + ': ' +r.content);
            return;
        }
		
        widShowProgressbar(progress);
		
		var item = engGetTokenInfo(ajxData, glCL.items[clIdx].rawS, glCL.items[clIdx].s)
        glVTL = engGetVTL(glVTL, item); //add info to VTL about last processed token from CL;
        var idx = glVTL.items.length - 1;
		
        if (glVTL.items.length < glCL.items.length) {
            widShowTokensLog('Verifying tokens...');
		} else {
	        setTimeout(extCb); // start external function;
		}
    }
	
    for (var i = 0; i < tokens.length; i++) {
        var lastCmd = 'last ' + glCurrentDB.name + ' ' + tokens[i].s;
        glCL.items[i] = {};
        glCL.items[i].cmd = lastCmd;
        glCL.items[i].rawS = (tokens[i].rawS !== undefined) ? tokens[i].rawS : ''; 
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
		widShowLed(jqObj, null);
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
	var cbFunc = function (cbData, cmdItemIdx, progress) {
        if (glCL.items.length === 0) {
            widDone(jqObj, cbData);
            return;
        }

        widShowProgressbar(progress);

        var cbResponse = engGetResponse(cbData);

        if (cbResponse.message === 'ERROR') {
            widDone(jqObj, cbResponse.content);
        } else if (cmdItemIdx + 1 < glCL.items.length) {
            widShowTokensLog('Update data... ');
        } else {
            widDone(jqObj, 'OK');
        }
    }

    for (var i = 0; i < glVTL.items.length; i++) {
        if (glVTL.items[i].message == 'OK' && glVTL.items[i].d != data) {

            var n = +glVTL.items[i].n + 1; //new records number;
            var s = engGetHash(glVTL.items[i].rawS, glCurrentDB.hash);
            var r = engGetNewRecord(n, s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);
            var addCmd = 'add *' + ' ' + glCurrentDB.name + ' ' + n + ' ' + s + ' ' + r.k + ' ' + r.g + ' ' + r.o + ' ' + data;
            var lastCmd = 'last' + ' ' + glCurrentDB.name + ' ' + s;
            var idx = (glCL.items.length == 0) ? 0 : glCL.items.length;

            glCL.items[idx] = {};
            glCL.items[idx].cmd = addCmd;
            glCL.items[idx].rawS = glVTL.items[i].rawS;
            glCL.items[idx].s = glVTL.items[i].s;

            idx++;

            glCL.items[idx] = {};
            glCL.items[idx].cmd = lastCmd;
            glCL.items[idx].rawS = glVTL.items[i].rawS;
            glCL.items[idx].s = glVTL.items[i].s;
        }
    }
    engRunCL(glCL, cbFunc);
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

function widShowGetTransKeysInc(jqObj, data) {
    var jqText = widGetTextareaObj(jqObj);
	if (typeof data == 'undefined') return jqText.val();
	if (data.length == 0) {
		return jqText.val('');
	} else {
        return jqText.val(jqText.val() + data);
    }
}

function widShowLed(jqObj, flag, title) {
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

function widTransKeysUpdate(jqObj, transKeys, func){
	widCleanCL();
	var prCode = transKeys[0].protocode;
	
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

function widPreSS1(jqObj) {
    widCleanCL();
    widCleanClosestUI(jqObj);
	
    switch (engGetVTLContent(glVTL)) {	// checks the contents of the verified tokens list
    case true:		// VTL contains only known tokens
        widShowLed(jqObj, true);
        widSS1(jqObj, glVTL);
        break;
    case false:		// VTL contains only known tokens
        widShowLed(jqObj, false);
        widDone(jqObj, 'Inappropriate or unavailable tokens!');
        break;
    case undefined:		// VTL contains both known and unknown tokens
        widShowLed(jqObj, false);
        widSS1(jqObj, glVTL);
        break;
    default:		// VTL no contains any tokens - make new VTL 
		if (!widIsRawTokens()) return widDone(jqObj, 'Empty or bad tokens!');
		if (!widIsPassword()) return widDone(jqObj, 'Empty password!');

		widShowLed(jqObj, null);
        var tok = engGetTokens(widGetRawTokens(), glCurrentDB.hash);
        var extCb = function (data) {
			widPreSS1(jqObj);
        }
		widMakeVTL(jqObj, tok, extCb);
        break;
    }
}

function widSS1(jqObj, list) {
	var tkLine;
    for (var i = 0; i < list.items.length; i++) {
		tkLine = '';
        if (list.items[i].message == 'OK') {
		// only own tokens will include;
            var k1 = engGetKey(list.items[i].n + 1, list.items[i].s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
            var k2 = engGetKey(list.items[i].n + 2, list.items[i].s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
            tkLine = list.items[i].n + ' ' + list.items[i].s + ' ' + k1 + ' ' + k2 + '\n';
			//tkLine = list.items[i].s + ' ' + k1 + ' ' + k2 + '\n';
        }
		
        widShowGetTransKeysInc(jqObj, tkLine);
		widShowProgressbar(100 * (i + 1) / list.items.length);
        widShowTokensLog('Generation...');
    }

    var rawTransKeys = widGetTextareaObj(jqObj).val().replace(/\s/g, '');
    var prLine = engGetHash(rawTransKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '1231320';
	//var prLine = engGetHash(rawTransKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '0231320';
	
    widShowGetTransKeysInc(jqObj, prLine);
    widDone(jqObj, 'OK');
}

function widPreRS1(jqObj, click) {
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
	widTransKeysUpdate(jqObj, transKeys, widRS1); 
}

function widRS1(jqObj, enrollKeys) {
    var cbFunc = function (data, cmdItemIdx, progress) {
		widShowProgressbar(progress);
		
		var err = 'Operation error occurred.\nPlease use the \"Verify\" tab for more info\nor try to repeat operation.';
        (engGetResponse(data).message !== 'ERROR') ? widShowLed(jqObj, true) : widShowLed(jqObj, false, err);

        if (glCL.items.length == 0) return widDone(jqObj, 'Operation cancelled!');

		(cmdItemIdx + 1 < glCL.items.length) ? widShowTokensLog('Obtaining keys...') : widDone(jqObj, 'OK');
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
        glCL.items[idx].rawS = '';

        idx++;

        glCL.items[idx] = {};
        glCL.items[idx].cmd = addCmd2;
        glCL.items[idx].s = s;
        glCL.items[idx].rawS = '';
    }

    engRunCL(glCL, cbFunc);
	
}

function widPreSS2(jqObj, click) {
    var rawTransKeys = widGetTextareaObj(jqObj).val();
    if (!engIsRawTransKeys(rawTransKeys)) return widDone(jqObj, 'Bad TransKeys!');
	if (!widIsPassword()) return widDone(jqObj, 'Empty password!');
	
	if (widGetRawTokens().length > 0 && (typeof click == 'undefined')) {
		return widContinueButtonClick(widGetContinueButtonObj(jqObj));
	} 
	
    widCleanCL();
    glVTL = engGetVTL(glVTL);

	var tok = engGetTokens(widGetRawTokens(), glCurrentDB.hash);
    var transKeys = engGetTransKeys(rawTransKeys);
	
	tok = engGetMergedTokensList(engGetHashedTokensList(transKeys), engGetRawTokensList(tok), glCurrentDB.hash); 
	widShowOrderedTokensNames(tok);
	widTransKeysUpdate(jqObj, transKeys, widSS2); 
}

function widSS2(jqObj, enrollKeys) {
    var cbFunc = function (data, cmdItemIdx, progress) {
        widShowProgressbar(progress);
		
		var err = 'Operation error occurred.\nPlease use the \"Verify\" tab for more info\nor try to repeat operation.';
        (engGetResponse(data).message !== 'ERROR') ? widShowLed(jqObj, true) : widShowLed(jqObj, false, err);

        if (glCL.items.length == 0) return widDone(jqObj, 'Operation cancelled!');

		(cmdItemIdx + 1 < glCL.items.length) ? widShowTokensLog('Obtaining keys...') : widDone(jqObj, 'OK');
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
        glCL.items[idx].rawS = '';

        idx++;

        glCL.items[idx] = {};
        glCL.items[idx].cmd = addCmd2;
        glCL.items[idx].s = s;
        glCL.items[idx].rawS = '';
    }

    engRunCL(glCL, cbFunc);
}

function widPreRS2(jqObj) {
    widCleanCL();
    widCleanClosestUI(jqObj);
	
    switch (engGetVTLContent(glVTL)) {
	case true:
		var msg = 'Already available tokens!';
		widShowLed(jqObj, false, msg);
		widDone(jqObj, msg);
		break;
    case false:		// VTL contains only known tokens
        widRS2(jqObj, glVTL);
        break;
    case undefined:		// VTL contains both known and unknown tokens
        widRS2(jqObj, glVTL);
        break;		
    default:
		if (!widIsRawTokens()) return widDone(jqObj, 'Empty or bad tokens!');
		if (!widIsPassword()) return widDone(jqObj, 'Empty password!');
	
		widShowLed(jqObj, null);
        var tok = engGetTokens(widGetRawTokens(), glCurrentDB.hash);
        var extCb = function (data) {
			widPreRS2(jqObj);
        }
		widMakeVTL(jqObj, tok, extCb);
        break;
    }
}

function widRS2(jqObj, list) {
	var tkLine;
    for (var i = 0; i < list.items.length; i++) {
		tkLine = '';
		if (list.items[i].message !== 'IDX_NODN' && list.items[i].message !== 'OK') {
			// includes only existing unknown tokens
            var r = list.items[i];
            var k3 = engGetKey(r.n + 3, r.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
            var k4 = engGetKey(r.n + 4, r.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
            var g2 = engGetKey(r.n + 3, r.s, k3, glCurrentDB.magic, glCurrentDB.hash);
            var g3 = engGetKey(r.n + 4, r.s, k4, glCurrentDB.magic, glCurrentDB.hash);
            var o2 = engGetKey(r.n + 3, r.s, g3, glCurrentDB.magic, glCurrentDB.hash);
            tkLine = r.n + ' ' + r.s + ' ' + g2 + ' ' + o2 + '\n';
			//tkLine = r.s + ' ' + g2 + ' ' + o2 + '\n';
		}
		
        widShowGetTransKeysInc(jqObj, tkLine);
        widShowTokensLog('Generation...');
		widShowProgressbar(100 * (i + 1) / list.items.length);
    }
	
	var msg, flag;
	if (widShowGetTransKeysInc(jqObj).length == 0) {
		console.log('..')
		msg = 'Inappropriate or already available tokens!';
		flag = false;
	} else {
		var rawTransKeys = $(widGetTextareaObj(jqObj)).val().replace(/\s/g, '');
		var prLine = engGetHash(rawTransKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '1242520';
		//var prLine = engGetHash(rawTransKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '0242520';
		widShowGetTransKeysInc(jqObj, prLine);
		msg = 'OK';
		flag = true;
	}
	
	widShowLed(jqObj, flag, msg);
    widDone(jqObj, msg);
}

function widPreSS3S1(jqObj) {
    widCleanCL();
    widCleanClosestUI(jqObj);

    switch (engGetVTLContent(glVTL)) {
    case true:
        widShowLed(jqObj, true);
        widSS3S1(jqObj, glVTL);
        break;
    case false:
        widShowLed(jqObj, false);
        widDone(jqObj, 'Inappropriate or unavailable tokens!');
        break;
    case undefined:
        widShowLed(jqObj, false);
        widSS3S1(jqObj, glVTL);
        break;
    default:
		if (!widIsRawTokens()) return widDone(jqObj, 'Empty or bad tokens!');
		if (!widIsPassword()) return widDone(jqObj, 'Empty password!');

	    widShowLed(jqObj, null);
        var tok = engGetTokens(widGetRawTokens(), glCurrentDB.hash);
        var extCb = function (data) {
			widPreSS3S1(jqObj);
        }
		widMakeVTL(jqObj, tok, extCb);
        break;
    }
}

function widSS3S1(jqObj, list) {
	var tkLine;
    for (var i = 0; i < list.items.length; i++) {
		tkLine = '';
        if (list.items[i].message === 'OK') {
			// includes only known tokens;
            var r = list.items[i];
            var n0 = r.n;
            var k1 = engGetKey(r.n + 1, r.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
            var k2 = engGetKey(r.n + 2, r.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
            var g1 = engGetKey(r.n + 2, r.s, k2, glCurrentDB.magic, glCurrentDB.hash);
            tkLine = n0 + ' ' + r.s + ' ' + k1 + ' ' + g1 + '\n';
			//tkLine = r.s + ' ' + k1 + ' ' + g1 + '\n';
        }

        widShowGetTransKeysInc(jqObj, tkLine);
        widShowTokensLog('Generation...');
		widShowProgressbar(100 * (i + 1) / list.items.length);
    }

    var rawTransKeys = widGetTextareaObj(jqObj).val().replace(/\s/g, '');
    var prLine = engGetHash(rawTransKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '1231410';
	//var prLine = engGetHash(rawTransKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '0231410';
	
    widShowGetTransKeysInc(jqObj, prLine);
    widDone(jqObj, 'OK');
}

function widPreSS3S2(jqObj) {
    widCleanCL();
    widCleanClosestUI(jqObj);

    switch (engGetVTLContent(glVTL)) {	// checks the contents of the verified tokens list
    case true:		// VTL contains only known tokens
        widShowLed(jqObj, true);
        widSS3S2(jqObj, glVTL);
        break;
    case false:		// VTL contains only known tokens
        widShowLed(jqObj, false);
        widDone(jqObj, 'Inappropriate or unavailable tokens!');
        break;
    case undefined:		// VTL contains both known and unknown tokens
        widShowLed(jqObj, false);
        widSS3S2(jqObj, glVTL);
        break;
    default:		// VTL no contains any tokens - make new VTL 
		if (!widIsRawTokens()) return widDone(jqObj, 'Empty or bad tokens!');
		if (!widIsPassword()) return widDone(jqObj, 'Empty password!');

		widShowLed(jqObj, null);
        var tok = engGetTokens(widGetRawTokens(), glCurrentDB.hash);
        var extCb = function (data) {
			widPreSS3S2(jqObj);
        }
		widMakeVTL(jqObj, tok, extCb);
        break;
    }
}
	
function widSS3S2(jqObj, list) {
	var tkLine;
    for (var i = 0; i < list.items.length; i++) {
		tkLine = '';
        if (list.items[i].message === 'TKN_SNDNG') {
			//include only tokens in sending state;
            var r = list.items[i];
            var n0 = r.n - 1;
            var n2 = r.n + 1;
            var k2 = engGetKey(n2, r.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
            tkLine = n0 + ' ' + r.s + ' ' + k2 + '\n';
			//tkLine = r.s + ' ' + k2 + '\n';
        } 
		
        widShowGetTransKeysInc(jqObj, tkLine);
        widShowTokensLog('Generation...');
		widShowProgressbar(100 * (i + 1) / list.items.length);
    }

	var msg = 'Inappropriate tokens!'
	
	if (widShowGetTransKeysInc(jqObj).length > 0 ) {	
		var rawTransKeys = widGetTextareaObj(jqObj).val().replace(/\s/g, '');
		var prLine = engGetHash(rawTransKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '1231320';
		//var prLine = engGetHash(rawTransKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '0231320';
		widShowGetTransKeysInc(jqObj, prLine);
	}
	
    widDone(jqObj, 'OK');
}

function widPreRS3S1(jqObj, data) {
    widCleanCL();
    glVTL = engGetVTL(glVTL);

	if (!widIsPassword()) return widDone(jqObj, 'Empty password!');

    var rawTok = widGetRawTokens();
    var rawTransKeys = $(widGetTextareaObj(jqObj)).val();
    var sKey = '1231410';

    if (!engIsRawTransKeys(rawTransKeys)) {
        widDone(jqObj, 'Bad TransKeys!');
        return;
    }

    if (rawTok == '' || data) {
        var transKeys = engGetTransKeys(rawTransKeys, sKey);
        transKeys = engGetEnrollKeys(transKeys, glPassword, glCurrentDB.hash, glCurrentDB.magic, sKey);
        tok = engGetTokens(rawTok, glCurrentDB.hash);
        tok = engGetMergedTokensList(engGetHashedTokensList(transKeys), engGetRawTokensList(tok), glCurrentDB.hash);
        widShowOrderedTokensNames(tok);
        var f = function () {
            widRS3S1(jqObj, transKeys);
        }
        setTimeout(f);
    } else {
        widContinueButtonClick(widGetContinueButtonObj(jqObj));
    }
}

function widRS3S1(jqObj, data) {
    var cbFunc = function (cbData, cmdItemIdx, progress) {
        var cbResponse = engGetResponse(cbData);
		var err = 'Operation error occurred.\nPlease use the \"Verify\" tab for more info\nor try to repeat operation.';
        (cbResponse.message !== 'ERROR') ? widShowLed(jqObj, true) : widShowLed(jqObj, false, err);

        widShowProgressbar(progress);

        if (glCL.items.length == 0) {
            widDone(jqObj, 'Operation cancelled!');
        } else if (cmdItemIdx + 1 < glCL.items.length) {
            widShowTokensLog('Obtaining keys...');
        } else {
            widMainButtonClick(jqObj, 'OK');
        }
    }

    for (var i = 0; i < data.length; i++) {
        var n0 = data[i].n;
        var n1 = n0 + 1;
        var s = data[i].s;
        var k1 = data[i].k1;
        var g1 = data[i].g1;
        var o1 = data[i].o1;

        var addCmd = 'add * ' + glCurrentDB.name + ' ' + n1 + ' ' + s + ' ' + k1 + ' ' + g1 + ' ' + o1;

        glCL.items[i] = {};
        glCL.items[i].cmd = addCmd;
        glCL.items[i].s = s;
        glCL.items[i].rawS = '';
    }

    engRunCL(glCL, cbFunc);
}

function widPreRS3S2(jqObj, data) {
    widCleanCL();
    glVTL = engGetVTL(glVTL);

	if (!widIsPassword()) return widDone(jqObj, 'Empty password!');

    var tokens = widGetRawTokens();
    var rawTransKeys = $(widGetTextareaObj(jqObj)).val();
    var sKey = '12320';

    if (!engIsRawTransKeys(rawTransKeys)) return widDone(jqObj, 'Bad TransKeys!');

    if (tokens == '' || data) {
        var transKeys = engGetTransKeys(rawTransKeys, sKey);
        transKeys = engGetEnrollKeys(transKeys, glPassword, glCurrentDB.hash, glCurrentDB.magic, sKey);
        tokens = engGetTokens(tokens, glCurrentDB.hash);
        tokens = engGetMergedTokensList(engGetHashedTokensList(transKeys), engGetRawTokensList(tokens), glCurrentDB.hash);

        widShowOrderedTokensNames(tokens);
        var f = function () {
            widRS3S2(jqObj, transKeys);
        }
        setTimeout(f);
    } else {
        widContinueButtonClick(widGetContinueButtonObj(jqObj));
    }
}

function widRS3S2(jqObj, data) {
    var cbFunc = function (cbData, cmdItemIdx, progress) {
        var cbResponse = engGetResponse(cbData);
		var err = 'Operation error occurred.\nPlease use the \"Verify\" tab for more info\nor try to repeat operation.';
        (cbResponse.message !== 'ERROR') ? widShowLed(jqObj, true) : widShowLed(jqObj, false, err);

        widShowProgressbar(progress);

        if (glCL.items.length == 0) {
            widDone(jqObj, 'Operation cancelled!');
        } else if (cmdItemIdx + 1 < glCL.items.length) {
            widShowTokensLog('Obtaining keys...');
        } else {
            widMainButtonClick(jqObj, 'OK');
        }
    }

    for (var i = 0; i < data.length; i++) {
        var n0 = data[i].n;
        var n2 = n0 + 2;
        var s = data[i].s;
        var k2 = data[i].k2;
        var g2 = data[i].g2;
        var o2 = data[i].o2;
        var addCmd = 'add * ' + glCurrentDB.name + ' ' + n2 + ' ' + s + ' ' + k2 + ' ' + g2 + ' ' + o2;

        glCL.items[i] = {};
        glCL.items[i].cmd = addCmd;
        glCL.items[i].s = s;
        glCL.items[i].rawS = '';

    }

    engRunCL(glCL, cbFunc);
}

function widPreSS4S1(jqObj, data) {
    widCleanCL();
    glVTL = engGetVTL(glVTL);

	if (!widIsPassword()) return widDone(jqObj, 'Empty password!');

    var tokens = widGetRawTokens();
    var rawTransKeys = $(widGetTextareaObj(jqObj)).val();
    var sKey = '12510';

    if (!engIsRawTransKeys(rawTransKeys)) return widDone(jqObj, 'Bad TransKeys!');

    if (tokens == '' || data) {
        var transKeys = engGetTransKeys(rawTransKeys, sKey);
        transKeys = engGetEnrollKeys(transKeys, glPassword, glCurrentDB.hash, glCurrentDB.magic, sKey);
        tokens = engGetTokens(tokens, glCurrentDB.hash);
        tokens = engGetMergedTokensList(engGetHashedTokensList(transKeys), engGetRawTokensList(tokens), glCurrentDB.hash);

        widShowOrderedTokensNames(tokens);
        var f = function () {
            widSS4S1(jqObj, transKeys);
        }
        setTimeout(f);
    } else {
        widContinueButtonClick(widGetContinueButtonObj(jqObj));
    }
}

function widSS4S1(jqObj, data) {
    var cbFunc = function (cbData, cmdItemIdx, progress) {

        var cbResponse = engGetResponse(cbData);
		var err = 'Operation error occurred.\nPlease use the \"Verify\" tab for more info\nor try to repeat operation.';
        (cbResponse.message !== 'ERROR') ? widShowLed(jqObj, true) : widShowLed(jqObj, false, err);

        widShowProgressbar(progress);

        if (glCL.items.length == 0) {
            widDone(jqObj, 'Operation cancelled!');
        } else if (cmdItemIdx + 1 < glCL.items.length) {
            widShowTokensLog('Obtaining keys...');
        } else {
            widMainButtonClick(jqObj, 'OK');
        }
    }

    for (var i = 0; i < data.length; i++) {
        var n1 = data[i].n1;
        var s = data[i].s;
        var k1 = data[i].k1;
        var g1 = data[i].g1;
        var o1 = data[i].o1;
        var addCmd = 'add * ' + glCurrentDB.name + ' ' + n1 + ' ' + s + ' ' + k1 + ' ' + g1 + ' ' + o1;

        glCL.items[i] = {};
        glCL.items[i].cmd = addCmd;
        glCL.items[i].s = s;
        glCL.items[i].rawS = '';

    }

    engRunCL(glCL, cbFunc);
}

function widPreSS4S2(jqObj, data) {
    widCleanCL();
    glVTL = engGetVTL(glVTL);

	if (!widIsPassword()) return widDone(jqObj, 'Empty password!');
	
    var tokens = widGetRawTokens();
    var rawTransKeys = $(widGetTextareaObj(jqObj)).val();
    var sKey = '1242520';

    if (!engIsRawTransKeys(rawTransKeys)) return widDone(jqObj, 'Bad TransKeys!');

    if (tokens == '' || data) {
        var transKeys = engGetTransKeys(rawTransKeys, sKey);
        transKeys = engGetEnrollKeys(transKeys, glPassword, glCurrentDB.hash, glCurrentDB.magic, sKey);
        var tokens = engGetTokens(tokens, glCurrentDB.hash);
        tokens = engGetMergedTokensList(engGetHashedTokensList(transKeys), engGetRawTokensList(tokens), glCurrentDB.hash);
        widShowOrderedTokensNames(tokens);
		
        var f = function () {
            widSS4S2(jqObj, transKeys);
        }
		
        setTimeout(f);
    } else {
        widContinueButtonClick(widGetContinueButtonObj(jqObj));
    }
}

function widSS4S2(jqObj, data) {
    var cbFunc = function (cbData, cmdItemIdx, progress) {
        var cbResponse = engGetResponse(cbData);
		var err = 'Operation error occurred.\nPlease use the \"Verify\" tab for more info\nor try to repeat operation.';
        (cbResponse.message !== 'ERROR') ? widShowLed(jqObj, true) : widShowLed(jqObj, false, err);

        widShowProgressbar(progress);

        if (glCL.items.length == 0) {
            widDone(jqObj, 'Operation cancelled!');
        } else if (cmdItemIdx + 1 < glCL.items.length) {
            widShowTokensLog('Obtaining keys...');
        } else {
            widMainButtonClick(jqObj, 'OK');
        }
    }

    for (var i = 0; i < data.length; i++) {
        var n2 = data[i].n2;
        var s = data[i].s;
        var k2 = data[i].k2;
        var g2 = data[i].g2;
        var o2 = data[i].o2;

        var addCmd = 'add * ' + glCurrentDB.name + ' ' + n2 + ' ' + s + ' ' + k2 + ' ' + g2 + ' ' + o2;

        glCL.items[i] = {};
        glCL.items[i].cmd = addCmd;
        glCL.items[i].s = s;
        glCL.items[i].rawS = '';
    }

    engRunCL(glCL, cbFunc);
}

function widPreRS4S1(jqObj) {
    widCleanCL();
    //widCleanClosestUI(jqObj);

	if (!widIsRawTokens()) return widDone(jqObj, 'Empty password!');
	if (!widIsPassword()) return widDone(jqObj, 'Empty password!');

    var tblState = engGetVTLContent(glVTL);

    switch (tblState) {
    case null:
        var tokens = engGetTokens(widGetRawTokens(), glCurrentDB.hash);
        var extCb = function (data) {
			widPreRS4S1(jqObj);
        }
		widMakeVTL(jqObj, tokens, extCb);
        break;
    default:
        var g = false;
        for (var i = 0; i < glVTL.items.length; i++) {
            if (glVTL.items[i].message != 'IDX_NODN') {
                var g = true;
                break;
            }
        }
        if (g) {
            widShowLed(jqObj, true);
            var f = function () {
                widRS4S1(jqObj, glVTL);
            }
            setTimeout(f);
        } else {
            widShowLed(jqObj, false);
            widDone(jqObj, 'Unknown tokens!');
        }
        break;
    }
}

function widRS4S1(jqObj, data) {
    for (var i = 0; i < data.items.length; i++) {
        widShowProgressbar(100 * (i + 1) / data.items.length);
        if (data.items[i].message != 'IDX_NODN') {
            var r = data.items[i];
            var n0 = r.n;
            var k3 = engGetKey(n0 + 3, r.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
            var g2 = engGetKey(n0 + 3, r.s, k3, glCurrentDB.magic, glCurrentDB.hash);
            var o1 = engGetKey(n0 + 2, r.s, g2, glCurrentDB.magic, glCurrentDB.hash);
            var newRow = r.n + ' ' + r.s + ' ' + o1 + '\n';
        } else {
            var newRow = '';
        }

        widShowGetTransKeysInc(jqObj, newRow);
        widShowTokensLog('Generation...');
    }

    var extractKeys = $(widGetTextareaObj(jqObj)).val().replace(/[\n|\s]/g, '');
    var lastRow = engGetHash(extractKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '12510';
    widShowGetTransKeysInc(jqObj, lastRow);
    widMainButtonClick(jqObj, 'OK');
}

function widPreRS4S2(jqObj) {
    widCleanCL();
    //widCleanClosestUI(jqObj);

	if (!widIsRawTokens()) return widDone(jqObj, 'Empty password!');
	if (!widIsPassword()) return widDone(jqObj, 'Empty password!');

    var tblState = engGetVTLContent(glVTL);

    switch (tblState) {
    case null:
        var tokens = engGetTokens(widGetRawTokens(), glCurrentDB.hash);
        var extCb = function (data) {
			widPreRS4S2(jqObj);
        }
		widMakeVTL(jqObj, tokens, extCb);
        break;
    default:
        for (var i = 0; i < glVTL.items.length; i++) {
            var g = false;
            if (glVTL.items[i].message != 'IDX_NODN') {
                var g = true;
                break;
            }
        }
        if (g) {
            widShowLed(jqObj, true);
            var f = function () {
                widRS4S2(jqObj, glVTL);
            }
            setTimeout(f);
        } else {
            widShowLed(jqObj, false);
            widDone(jqObj, 'Unknown tokens!');
        }
        break;
    }
}

function widRS4S2(jqObj, data) {
    for (var i = 0; i < data.items.length; i++) {
        widShowProgressbar(100 * (i + 1) / data.items.length);
        if (data.items[i].message != 'IDX_NODN' && data.items[i].n !== 0) {
            var r = data.items[i];
            var n0 = r.n - 1;
            var k3 = engGetKey(n0 + 3, r.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
            var g2 = engGetKey(n0 + 3, r.s, k3, glCurrentDB.magic, glCurrentDB.hash); //
            var k4 = engGetKey(n0 + 4, r.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
            var g3 = engGetKey(n0 + 4, r.s, k4, glCurrentDB.magic, glCurrentDB.hash);
            var o2 = engGetKey(n0 + 3, r.s, g3, glCurrentDB.magic, glCurrentDB.hash); //
            var newRow = n0 + ' ' + r.s + ' ' + g2 + ' ' + o2 + '\n';
        } else {
            var newRow = '';
        }

        widShowGetTransKeysInc(jqObj, newRow);
        widShowTokensLog('Generation...');
    }

    if (newRow.length !== 0) {
        var extractKeys = $(widGetTextareaObj(jqObj)).val().replace(/[\n|\s]/g, '');
        var lastRow = engGetHash(extractKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '1242520';
        widShowGetTransKeysInc(jqObj, lastRow);
    }

    widMainButtonClick(jqObj, 'OK');
}
