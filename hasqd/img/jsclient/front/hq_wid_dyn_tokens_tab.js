// Hasq Technology Pty Ltd (C) 2013-2015
function closestTextArea($obj) {
	var $textarea = undefined;
	if (arguments.length > 0 ) $textarea = $obj.closest('.wrap').find('textarea');	
	return {
		add: function (data) {
			$textarea.val($textarea.val() + data);
		},
		clear: function (data) {
			if (typeof data == 'undefined') return $textarea.val('');
			$textarea.val('');
			$textarea.val(data);	
		},
		clearExcept: function ($obj) {
			(arguments.length == 0) ? $textarea.val('') : $('textarea .wrap').not($textarea).val('');
		},		
		val: function () {
			return $textarea.val();
		}
	}
}

function led($obj) {
	var $led = undefined;
	if (arguments.length > 0 ) $led = $obj.closest('.wrap').find('img');
	return {
		set: function (img, title) {
			if (typeof img == 'undefined') return this.clear($obj);
			if ($led.attr('src') != img) $led.attr('src', img);
			if (typeof title == 'undefined') {
				$led.removeAttr('title')
			} else {
				if ($led.prop('title', title) != title) $led.prop('title', title);	
			}
			
		},
		clear: function () {
			if ( typeof $led == 'undefined') return $('.led-span').find($('img')).removeAttr('src').removeAttr('title');
			$led.removeAttr('src').removeAttr('title');
		},
		source: function () {
			if (typeof $led !== 'undefined') return $led.attr('src');
		}
	}
}

function widWarningLed($obj, image, title) {
//not change the LED if it shows a warning
	var source = led($obj).source();
	if (source == imgError || source == imgWarning || source == image) return;
	led($obj).set(image, title);
}

function widCleanCL() {
    glCL.idx = 0;
    glCL.counter = 100;
    glCL.items.length = 0;
}


function widShowProgressbar(data) {
    var $Progressbar = $('#tokens_progressbar');

    if (data) {
        var val = Math.floor(data);
        $Progressbar.progressbar('value', val);
    } else {
        $Progressbar.progressbar('value', data);
    }
}

function widShowTokensLog(data) {
    var $Log = $('#tokens_log_pre');
    (arguments.length == 0) ? $Log.html('&nbsp') : $Log.html(data);
}

function widShowOrderedTokensNames(arr) {
    for (var i = 0; i < arr.length; i++) {
        if (i == 0) {
			widGetRawTokens(arr[i]);
        } else {
            widGetRawTokens(widGetRawTokens() + ' ' + arr[i]);
        }
    }
}

function widCleanUI($obj) {
	widShowProgressbar(0);
	widShowTokensLog();	
	
	return {
		full: function() {
			led().clear();	
			$('textarea .wrap').val('');
			widCleanVerifyTab();
		},
		near: function() {
			led($obj).clear();
			closestTextArea($obj).clear();
		}
	}
}

function widCleanVerifyTab() {
    $('#tokens_verify_table').find('tr:gt(0)').remove();
	led($('#tokens_verify_button')).clear();
    $('.verify-hidden-area-div').hide();
}

function widGetClosestMainButton($obj) {
	return $obj.closest('.wrap').find($('.shared-button'));
}

function widGetClosestContinueButton($obj) {
	return $obj.closest('.wrap').find($('.continue-button'));
}

function widGetClosestWarningTd($obj) {
    return $obj.closest('.wrap').find($('td .warning-td'));
}

function widGetClosestLed($obj) {
    return $obj.closest('.wrap').find($('.led-span'));
}

function widGetClosestTextarea($obj) {
    return $obj.closest('.wrap').find($('textarea'));
}

function widDisableTokensInput() {
    var $obj = $('#tokens_tabs');
    $obj.tabs('option', 'disabled', true);
    $obj.closest('div[id^="tabs"]').find('button, input, textarea').prop('disabled', true);
    $obj.closest('div[id^="tabs"]').find('textarea:first').prop('disabled', false);
}

function widEnableTokensInput() {
    var $obj = $('#tokens_tabs');
    $obj.tabs('enable');
    $obj.closest('div[id^="tabs"]').find('button, input, textarea').prop('disabled', false);
}

function widDisableAllTokensUI($obj) {
    var tabs = $('#tokens_tabs');
    tabs.tabs('option', 'disabled', true);
    tabs.closest('div[id^="tabs"]').find('button, input, textarea').prop('disabled', true);
    $(widGetClosestContinueButton($obj)).prop('disabled', false);
    $(widGetClosestMainButton($obj)).prop('disabled', false);
}

function widEnableAllTokensUI() {
    var $obj = $('#tokens_tabs');
    $obj.tabs('enable');
    $obj.closest('div[id^="tabs"]').find('button, input, textarea').prop('disabled', false); //closest('div[id^="tabs"]')
}

function widSwitchShowHide($obj) {
    if ($obj.css('display') === 'none') {
        $obj.fadeIn(); //show
    } else {
        $obj.hide();
    }
}

function widGetWarningsMode($obj) {
    return ($obj.button('option', 'label') == 'Continue') ? true : false;
}

function widGetButtonsMode($obj) {
	var label = $obj.button('option', 'label');
    var title = $obj.attr('data-title');
    var objC = widGetClosestContinueButton($obj);
    var cMode = widGetWarningsMode(objC);
	
    if ($obj == objC && cMode)  return true;
    if (label == title) return true; // Main button in action-mode is visible
    return false; // Cancel is visible
}

function widGetFunctionById($obj, click) {
	widCleanCL();
	var fName = $obj.attr('data-function');

	fName = (arguments.length > 1) ? fName + '($obj, click)' : fName + '($obj)';

    return function () {
        eval(fName);
    }
}

function widSwitchButtonsMode($obj) {
    var title = $obj.attr('data-title');
    var label = $obj.button('option', 'label');
    var objWarning = widGetClosestWarningTd($obj);	// warning text
    var objContinue = widGetClosestContinueButton($obj); // continue button
		
    if (label === title && title === 'Continue') {
        widSwitchShowHide($obj);
        widSwitchShowHide(objWarning);
        $obj.button('option', 'label', 'Hidden');
		return;
    } 
	
	if (label !== title && title === 'Continue') {
        widSwitchShowHide($obj);
        widSwitchShowHide(objWarning);
        $obj.button('option', 'label', title);
		return;
    } 
	
	if (label === title) return $obj.button('option', 'label', 'Cancel');

    $obj.button('option', 'label', title);

    if (widGetWarningsMode(objContinue)) {
		widSwitchShowHide(objContinue);
		widSwitchShowHide(objWarning);			
        $(objContinue).button('option', 'label', 'Hidden');
    }
}

function widMainButtonClick($obj, text) {
	var f;
	
    if (widGetButtonsMode($obj)) {
        widDisableAllTokensUI($obj);
        f = widGetFunctionById($obj);
    } else {
        f = function () {
            widCancel($obj, text);
        }
    }
    widSwitchButtonsMode($obj);
    setTimeout(f);
}

function widDone($obj, text) {
    widMainButtonClick($obj, text);
}

function widCancel($obj, text) {
    if (typeof(text) != 'string') {
        text = 'Operation cancelled!';
		glTokList.clear();
		led($obj).set(imgError, text);
	}
	
    widCleanCL();
    widShowTokensLog(text);
    widEnableAllTokensUI();
}

function widContinueButtonClick($obj, click) {
    widSwitchButtonsMode($obj);

    var label = $obj.button('option', 'label');

    if (click === true) { // called by onclick;
        setTimeout(widGetFunctionById(widGetClosestMainButton($obj), click));
    } else {
		widShowTokensLog('Process suspended...');
	}
}

function widTokensIdxOninput($obj) {
	$obj.val(engGetOnlyNumber($obj.val()));
}

function widTokensPasswordOninput(data) {
    glPassword = data;
    glTokList.clear();
	led().clear();
    widCleanVerifyTab();
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

function widTokensNamesOninput($obj) {
    glTokList.clear();
    widCleanUI().full();
    widShowBordersColor($obj);
	
    var tokens = $obj.val();

    if (!engIsRawTokens(tokens, glCurrentDB.hash)) {
        widDisableTokensInput();
        widShowBordersColor($obj, '#FF0000'); //RED BORDER
        widShowTokensLog('Please enter a hashes or raw value in square brackets.');
    } else if (tokens.length >= 15479) {
        widEnableTokensInput();
        widShowBordersColor($obj, '#FFFF00'); //YELLOW BORDER
        var l = 16511 - tokens.length;
        $obj.prop('title', 'Warning! ' + l + ' chars left.');
        widShowTokensLog();
    } else {
        widEnableTokensInput();
        widShowBordersColor($obj);
        widShowTokensLog();
    }
}

function widAddTokens($obj, data) {
    var jqBasename = $('#tokens_basename_input')
    var jqFirstIdx = $('#tokens_first_idx_input')
    var jqLastIdx = $('#tokens_last_idx_input')
    //var objNames = $('#tokens_names_textarea')
    var chk = widGetRangeDataState();
    if (chk.msg == 'ERROR') return widDone($obj, chk.cnt);

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
        widDone($obj, 'OK');
    } else {
        widDone($obj, 'REQ_TOKENS_TOO_MANY');
    }

}

function widPreCreate($obj) {
    widCleanCL();
    glTokList.clear();

	if (!widIsRawTokens()) return widDone($obj, 'Empty or bad tokens!');
	if (!widIsPassword()) return widDone($obj, 'Empty password!');

    var tokens = engGetTokens(widGetRawTokens(), glCurrentDB.hash);
    widCreateTokens($obj, tokens);
}

function widCreateTokens($obj, tokens) {
    var cbFunc = function (cbData, cmdIdx, progress) {
        if (glCL.items.length == 0) return;
		widShowProgressbar(progress);

        if (engGetResp(cbData).msg == 'ERROR') return widDone($obj, engGetResp(cbData).cnt);
		(cmdIdx + 1 < glCL.items.length) ? widShowTokensLog('Creating... ') : widDone($obj, 'OK');
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

function widAddVerifyTR(rec, statePic) {
    var jqTable = $('#tokens_verify_table');
	var pic = '<img width="12" height="12" src="' + statePic.img + '" title="' + statePic.title + '"></img>';
	var tr = widGetHTMLTr(widGetHTMLTd(pic + rec.st) + widGetHTMLTd(rec.r) + widGetHTMLTd(rec.s) + widGetHTMLTd(rec.n) + widGetHTMLTd(rec.d));
    jqTable.append(tr);
}

function widGetTokenStateImg(status) {
    // Returns an image source and title displaying tokens/password state
	var r = {};

    switch (status) {
    case 'OK':
		r.img = imgPwdOk;
		r.title = 'OK';
		break;
    case 'TKN_SNDNG':
        r.img = imgPwdSndng;
		r.title = 'Token is locked by sending';
		break;
    case 'TKN_RCVNG':
        r.img = imgPwdRcvng;
		r.title = 'Token is locked by receiving';		
		break;
    case 'WRONG_PWD': //'WRONG_PWD'
        r.img = imgPwdWrong;
		r.title = 'Wrong password';		
		break;
	default:
		r.img = imgNoDN;
		r.title = 'No such token';
		break;
    }
	return r;
}

function widPreVerify($obj) {
    widCleanCL();
    glTokList.clear();
    widCleanVerifyTab();

	if (!widIsRawTokens()) return widDone($obj, 'Empty or bad tokens!');
	if (!widIsPassword()) return widDone($obj, 'Empty password!');

    var $TableArea = $('.verify-hidden-area-div');
	var width = $obj.closest('.wrap').outerWidth() - 6;
	var maxHeight = (($(window).height() - $('body').height()) > 200) ? ($(window).height() - $('body').height())/2 : 100;

	$TableArea.outerWidth(width);
	$TableArea.css('max-height',  maxHeight + 'px');
	$TableArea.show();	
	
    var tokens = engGetTokens(widGetRawTokens(), glCurrentDB.hash);
    widVerifyTokens($obj, tokens);
}

function widVerifyTokens($obj, tokens) {
    var cbFunc = function (ajxData, clIdx, progress) {
        if (glCL.items.length == 0) return;
        if (engGetResp(ajxData).msg == 'ERROR') return widDone($obj, engGetResp(ajxData).cnt);

        widShowProgressbar(progress);
		
		var item = engGetTokenInfo(ajxData, glCL.items[clIdx].r, glCL.items[clIdx].s)
        glTokList.add(item); //add info to VTL about last processed token from CL;

        var idx = glTokList.items.length - 1;
        var lineLed = widGetTokenStateImg(glTokList.items[idx].st);
        widAddVerifyTR(glTokList.items[idx], lineLed);
		
		(glTokList.unfit) ? widWarningLed($obj, imgWarning, 'Unavailable tokens presents') : widWarningLed($obj, imgOk, 'OK');
        (glTokList.items.length < glCL.items.length) ? widShowTokensLog('Verifying...') : widDone($obj, 'OK');
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

function widFillOutTokList($obj, tokens, extCb) {
    glTokList.clear();
    widCleanCL();
    var cbFunc = function (cbData, clIdx, progress) {
        if (glCL.items.length == 0) return led().clear(); // it is necessary to check need
		
		var resp = engGetResp(cbData);
        if (resp.msg == 'ERROR') return widDone($obj, resp.msg + ': ' + resp.cnt);
		
        widShowProgressbar(progress);
		
		var item = engGetTokenInfo(cbData, glCL.items[clIdx].r, glCL.items[clIdx].s);
        glTokList.add(item); //add info to VTL about last processed token from CL;
        var idx = glTokList.items.length - 1;
		
        (glTokList.items.length < glCL.items.length) ? widShowTokensLog('Filling out tokens list...') : setTimeout(extCb); // start external function;
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

function widPreUpdate($obj, click) {
    widCleanCL();
	widCleanUI().full();
	var d = $obj.closest('.wrap').find('input').val();
	var msg = 'Please wait...';
	
    switch (glTokList.state()) {
    case true:
	    led($obj).set(imgLoading, msg);	
        widUpdateTokens($obj, d, glTokList.items);
        break;
    case false:
		msg = 'All tokens are unknown!';
		led($obj).set(imgError, msg);	
        widDone($obj, msg);
        break;
    case undefined:
		(typeof click == 'undefined') ? widContinueButtonClick(widGetClosestContinueButton($obj)) : widUpdateTokens($obj, d, glTokList.items);
        break;
    default:
		if (!widIsRawTokens()) return widDone($obj, 'Empty or bad tokens!');
		if (!widIsPassword()) return widDone($obj, 'Empty password!');
		
		led($obj).set(imgLoading, msg);
		
		var tokens = engGetTokens(widGetRawTokens(), glCurrentDB.hash);
        var extCb = function (data) {
			widPreUpdate($obj, click);
        }
		
		widFillOutTokList($obj, tokens, extCb);
        break;
    }
}

function widUpdateTokens($obj, data, items) {
	var cbFunc = function (cbData, cmdIdx, progress) {
		widShowProgressbar(progress);
		if (glCL.items.length == 0) return widDone($obj, 'Operation cancelled!');
		
		var resp = engGetResp(cbData);
        (resp.msg !== 'ERROR') ? widWarningLed($obj, imgOk, 'OK') : widWarningLed($obj, imgError, 'Error occurred: ' + resp.cnt);
		
        if (cmdIdx + 1 < glCL.items.length) {
			widShowTokensLog('Update data... ')
		} else {
			widDone($obj, 'OK');
		} 
    }
	
	glTokList.clear();	
    
	for (var i = 0; i < items.length; i++) {
        if (items[i].st == 'OK' && items[i].d != data) {

            var n = +items[i].n + 1; //new records number;
            var s = engGetHash(items[i].r, glCurrentDB.hash);
            var r = engGetNewRecord(n, s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);
            var addCmd = 'add *' + ' ' + glCurrentDB.name + ' ' + n + ' ' + s + ' ' + r.k + ' ' + r.g + ' ' + r.o + ' ' + data;
            var lastCmd = 'last' + ' ' + glCurrentDB.name + ' ' + s;
            var idx = (glCL.items.length == 0) ? 0 : glCL.items.length;

            glCL.items[idx] = {};
            glCL.items[idx].cmd = addCmd;
            glCL.items[idx].r = items[i].r;
            glCL.items[idx].s = items[i].s;

            idx++;

            glCL.items[idx] = {};
            glCL.items[idx].cmd = lastCmd;
            glCL.items[idx].r = items[i].r;
            glCL.items[idx].s = items[i].s;
        }
    }
    engRunCL(glCL, cbFunc);
}

function widUpgradeTransKeys($obj, transKeys, func){
//if transkeys not contains numbers of records , makes 'last' and update transkeys records numbers;
	widCleanCL();
	var prCode = transKeys[0].prcode;
	
	if (prCode.charAt(0) === '2' && glTokList.items.length === 0) {
        var extCb = function () {
			widUpgradeTransKeys($obj, transKeys, func);
        }
		return widFillOutTokList($obj, transKeys, extCb);
	} else if (prCode.charAt(0) === '2' && glTokList.items.length > 0) {
		if (transKeys.length !== glTokList.items.length) return widDone($obj, 'TransKeys update error!');
		transKeys = engGetUpgradedTransKeys(transKeys, glTokList.items);
	}
	
	var titleKeys = engGetTitleKeys(transKeys, glPassword, glCurrentDB.hash, glCurrentDB.magic);
	var	f = function () { func($obj, titleKeys); }
	setTimeout(f);
}

function widPreSimpleSend($obj) {
    widCleanCL();
	widCleanUI($obj).near();
	var msg = 'Please wait...';
	
    switch (glTokList.state()) {	// checks the contents of the verified tokens list
    case true:		// VTL contains only available tokens
		led($obj).set(imgLoading, msg);
        widSimpleSend($obj, glTokList.items);
        break;
    case false:		// VTL contains only unavailable tokens
		msg = 'All tokens are unavailable!';
		led($obj).set(imgError, msg);
		if (closestTextArea($obj).val().length > 0) closestTextArea($obj).clear();
        widDone($obj, msg);
        break;
    case undefined:		/// VTL contains both kinds of tokens - available and unavailable
		msg = 'Some tokens are unavailable!';
		led($obj).set(imgError, msg);
		if (closestTextArea($obj).val().length > 0) closestTextArea($obj).clear();
        widDone($obj, msg);
        break;
    default:		// VTL no contains any tokens then make new VTL 
		if (!widIsRawTokens()) return widDone($obj, 'Empty or bad tokens!');
		if (!widIsPassword()) return widDone($obj, 'Empty password!');
		
		led($obj).set(imgLoading, msg);	

        var tok = engGetTokens(widGetRawTokens(), glCurrentDB.hash);
        var extCb = function (data) {
			widPreSimpleSend($obj);
        }
		widFillOutTokList($obj, tok, extCb);
        break;
    }
}

function widSimpleSend($obj, items) {
    for (var i = 0; i < items.length; i++) {
        if (items[i].st == 'OK') {
		// only own tokens will include;
            var k1 = engGetKey(items[i].n + 1, items[i].s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
            var k2 = engGetKey(items[i].n + 2, items[i].s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
            var tkLine = items[i].n + ' ' + items[i].s + ' ' + k1 + ' ' + k2 + '\n';
			//tkLine = items[i].s + ' ' + k1 + ' ' + k2 + '\n';
			closestTextArea($obj).add(tkLine);
        }
		
		widShowProgressbar(100 * (i + 1) / items.length);
        widShowTokensLog('Generation...');
    }

    var rawTransKeys = widGetClosestTextarea($obj).val().replace(/\s/g, '');
    var prLine = engGetHash(rawTransKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '123132';
	//var prLine = engGetHash(rawTransKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '23132';
	
    closestTextArea($obj).add(prLine);
	led($obj).set(imgOk, 'OK');
    widDone($obj, 'OK');
}

function widPreSimpleReceive($obj, click) {
	led($obj).clear();
	var rawTransKeys = widGetClosestTextarea($obj).val();
	if (!engIsRawTransKeys(rawTransKeys)) return widDone($obj, 'Bad TransKeys!');
	if (!widIsPassword)	return widDone($obj, 'Empty password!');
	
	if (widGetRawTokens().length > 0 && (typeof click == 'undefined')) {
		//if there is tokens make users request for continue;
		//if "Continue" button will pressed "click" will stay true
		return widContinueButtonClick(widGetClosestContinueButton($obj));
	} 

 	widCleanCL();
	glTokList.clear();
	
    var tok = engGetTokens(widGetRawTokens(), glCurrentDB.hash);		
    var transKeys = engGetTransKeys(rawTransKeys);
	tok = engGetMergedTokensList(engGetHashedTokensList(transKeys), engGetRawTokensList(tok), glCurrentDB.hash);
    widShowOrderedTokensNames(tok);
	widUpgradeTransKeys($obj, transKeys, widSimpleReceive); 
}

function widSimpleReceive($obj, titleKeys) {
    var cbFunc = function (cbData, cmdIdx, progress) {
		widShowProgressbar(progress);
		
		var resp = engGetResp(cbData);
        (resp.msg !== 'ERROR') ? widWarningLed($obj, imgOk, 'OK') : widWarningLed($obj, imgError, 'Error occurred: ' + resp.cnt);
		
        if (glCL.items.length == 0) return widDone($obj, 'Operation cancelled!');
		(cmdIdx + 1 < glCL.items.length) ? widShowTokensLog('Obtaining keys...') : widDone($obj, 'Done.');
	}
	
    for (var i = 0; i < titleKeys.length; i++) {
        var n0 = titleKeys[i].n;
        var n1 = n0 + 1;
        var n2 = n0 + 2;
        var s = titleKeys[i].s;
        var k1 = titleKeys[i].k1;
        var g1 = titleKeys[i].g1;
        var o1 = titleKeys[i].o1;
        var k2 = titleKeys[i].k2;
        var g2 = titleKeys[i].g2;
        var o2 = titleKeys[i].o2;

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

function widPreSimpleRequest($obj) {
    widCleanCL();
    widCleanUI($obj).near();
	var msg = 'Please wait...';
	
    switch (glTokList.state()) { // checks the contents of the verified tokens list
	case true: // VTL contains only available
		msg = 'All tokens in the list are already available!';
		led($obj).set(imgError, msg);
		widDone($obj, msg);
		break;
    case false:		// VTL contains only unavailable tokens
		led($obj).set(imgLoading, msg);
        widSimpleRequest($obj, glTokList.items);
        break;
    case undefined:		// VTL contains both kinds of tokens - available and unavailable
		msg = 'There are some available tokens in the list!';
		led($obj).set(imgError, msg);
		widDone($obj, msg);
        break;		
    default:
		if (!widIsRawTokens()) return widDone($obj, 'Empty or bad tokens!');
		if (!widIsPassword()) return widDone($obj, 'Empty password!');
		
        var tok = engGetTokens(widGetRawTokens(), glCurrentDB.hash);
        var extCb = function (data) {
			widPreSimpleRequest($obj);
        }
		led($obj).set(imgLoading, msg);
		widFillOutTokList($obj, tok, extCb);
        break;
    }
}

function widSimpleRequest($obj, items) {
    for (var i = 0; i < items.length; i++) {
		if (items[i].st === 'WRONG_PWD') {
			// includes only existing unknown tokens
            var r = items[i];
			var k3 = engGetKey(r.n + 3, r.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
			var k4 = engGetKey(r.n + 4, r.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
            var g2 = engGetKey(r.n + 3, r.s, k3, glCurrentDB.magic, glCurrentDB.hash);
            var g3 = engGetKey(r.n + 4, r.s, k4, glCurrentDB.magic, glCurrentDB.hash);
            var o2 = engGetKey(r.n + 3, r.s, g3, glCurrentDB.magic, glCurrentDB.hash);
            var tkLine = r.n + ' ' + r.s + ' ' + g2 + ' ' + o2 + '\n';
			//tkLine = r.s + ' ' + g2 + ' ' + o2 + '\n';
			closestTextArea($obj).add(tkLine);
		}

		widShowProgressbar(100 * (i + 1) / items.length);
		widShowTokensLog('Generation...');
    }
	
	var msg, img;
	if (closestTextArea($obj).val().length == 0) {
		msg = 'Inappropriate tokens!';
		img = imgError;
	} else {
		var rawTransKeys = $(widGetClosestTextarea($obj)).val().replace(/\s/g, '');
		var prLine = engGetHash(rawTransKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '124252';
		//var prLine = engGetHash(rawTransKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '24252';
		closestTextArea($obj).add(prLine);
		msg = 'OK';
		img = imgOk;
	}
	
	led($obj).set(img, msg);
    widDone($obj, msg);
}

function widPreSimpleAccept($obj, click) {
	led($obj).clear();	
    var rawTransKeys = widGetClosestTextarea($obj).val();
    if (!engIsRawTransKeys(rawTransKeys)) return widDone($obj, 'Bad TransKeys!');
	if (!widIsPassword()) return widDone($obj, 'Empty password!');
	
	if (widGetRawTokens().length > 0 && (typeof click == 'undefined')) {
		//if there is tokens make users request for continue;
		//if "Continue" button will pressed "click" will stay true
		return widContinueButtonClick(widGetClosestContinueButton($obj));
	} 
	
    widCleanCL();
    glTokList.clear();

	var tok = engGetTokens(widGetRawTokens(), glCurrentDB.hash);
    var transKeys = engGetTransKeys(rawTransKeys);
	tok = engGetMergedTokensList(engGetHashedTokensList(transKeys), engGetRawTokensList(tok), glCurrentDB.hash); 
	widShowOrderedTokensNames(tok);
	widUpgradeTransKeys($obj, transKeys, widSimpleAccept); 
}

function widSimpleAccept($obj, titleKeys) {
    var cbFunc = function (cbData, cmdIdx, progress) {
        widShowProgressbar(progress);
		
		var resp = engGetResp(cbData);
        (resp.msg !== 'ERROR') ? widWarningLed($obj, imgOk, 'OK') : widWarningLed($obj, imgError, 'Error occurred: ' + resp.cnt);

        if (glCL.items.length == 0) return widDone($obj, 'Operation cancelled!');
		(cmdIdx + 1 < glCL.items.length) ? widShowTokensLog('Obtaining keys...') : widDone($obj, 'Done.');
    }

    for (var i = 0; i < titleKeys.length; i++) {
        var n0 = titleKeys[i].n;
        var n1 = n0 + 1;
        var n2 = n0 + 2;
        var s = titleKeys[i].s;
        var k1 = titleKeys[i].k1;
        var g1 = titleKeys[i].g1;
        var o1 = titleKeys[i].o1;
        var k2 = titleKeys[i].k2;
        var g2 = titleKeys[i].g2;
        var o2 = titleKeys[i].o2;
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

function widPreBlockingSendStep1($obj) {
    widCleanCL();
	widCleanUI($obj).near();	
	var msg = 'Please wait...';
	
    switch (glTokList.state()) {
    case true:		// VTL contains only available tokens
	    led($obj).set(imgLoading, msg);
        widBlockingSendStep1($obj, glTokList.items);
        break;
    case false:		// VTL contains only unavailable tokens
		msg = 'All tokens are unavailable!';
		led($obj).set(imgError, msg);	
		if (closestTextArea($obj).val().length > 0) closestTextArea($obj).clear();
        widDone($obj, msg);
        break;
    case undefined:		// VTL contains both kinds of tokens - available and unavailable
		msg = 'Some tokens are unavailable!';
		led($obj).set(imgError, msg);	
		if (closestTextArea($obj).val().length > 0) closestTextArea($obj).clear();
        widDone($obj, msg);
        break;
    default:
		if (!widIsRawTokens()) return widDone($obj, 'Empty or bad tokens!');
		if (!widIsPassword()) return widDone($obj, 'Empty password!');
		
		led($obj).set(imgLoading, msg);
        
		var tok = engGetTokens(widGetRawTokens(), glCurrentDB.hash);
        var extCb = function (data) {
			widPreBlockingSendStep1($obj);
        }
		widFillOutTokList($obj, tok, extCb);
        break;
    }
}

function widBlockingSendStep1($obj, items) {
    for (var i = 0; i < items.length; i++) {
        if (items[i].st === 'OK') {
			// includes only known tokens;
            var r = items[i];
            var n0 = r.n;
            var k1 = engGetKey(r.n + 1, r.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
            var k2 = engGetKey(r.n + 2, r.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
            var g1 = engGetKey(r.n + 2, r.s, k2, glCurrentDB.magic, glCurrentDB.hash);
            var tkLine = n0 + ' ' + r.s + ' ' + k1 + ' ' + g1 + '\n';
			//tkLine = r.s + ' ' + k1 + ' ' + g1 + '\n';
			closestTextArea($obj).add(tkLine);
        }

		widShowProgressbar(100 * (i + 1) / items.length);
		widShowTokensLog('Generation...');
    }

    var rawTransKeys = widGetClosestTextarea($obj).val().replace(/\s/g, '');
    var prLine = engGetHash(rawTransKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '123141';
	//var prLine = engGetHash(rawTransKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '23141';
	
    closestTextArea($obj).add(prLine);
	led($obj).set(imgOk, 'OK');
    widDone($obj, 'OK');
}

function widPreBlockingSendStep2($obj) {
    widCleanCL();
	widCleanUI($obj).near();
	var msg = 'Please wait...';

    switch (glTokList.state()) {	// checks the contents of the verified tokens list
    case true:		// VTL contains only available tokens
		msg = 'All tokens in the list are still fully available!';
        led($obj).set(imgError, msg); 
		if (closestTextArea($obj).val().length > 0) closestTextArea($obj).clear();
		widDone($obj, msg);
        break;
    case false:		// VTL contains only unavailable tokens
		led($obj).set(imgLoading, msg);
        widBlockingSendStep2($obj, glTokList.items);
        break;
    case undefined:		// VTL contains both kinds of tokens - available and unavailable
		msg = 'Some tokens in the list are already available!';
        led($obj).set(imgError, msg);
		if (closestTextArea($obj).val().length > 0) closestTextArea($obj).clear();
        widDone($obj, msg);
        break;
    default:		// VTL no contains any tokens then make new VTL
		if (!widIsRawTokens()) return widDone($obj, 'Empty or bad tokens!');
		if (!widIsPassword()) return widDone($obj, 'Empty password!');

		led($obj).set(imgLoading, msg);
		
        var tok = engGetTokens(widGetRawTokens(), glCurrentDB.hash);
        var extCb = function (data) {
			widPreBlockingSendStep2($obj);
        }
		widFillOutTokList($obj, tok, extCb);
        break;
    }
}
	
function widBlockingSendStep2($obj, items) {
    for (var i = 0; i < items.length; i++) {
        if (items[i].st === 'TKN_SNDNG') {
			//include only tokens in sending state;
            var r = items[i];
            var n0 = r.n - 1;
            var n2 = r.n + 1;
            var k2 = engGetKey(n2, r.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
            var tkLine = n0 + ' ' + r.s + ' ' + k2 + '\n';
			//tkLine = r.s + ' ' + k2 + '\n';
			closestTextArea($obj).add(tkLine);
        } 
		
		widShowProgressbar(100 * (i + 1) / items.length);
		widShowTokensLog('Generation...');
    }

	var msg, img;
	if (closestTextArea($obj).val().length == 0) {
		msg = 'Inappropriate tokens!';
		img = imgError;
	} else {
		var rawTransKeys = widGetClosestTextarea($obj).val().replace(/\s/g, '');
		var prLine = engGetHash(rawTransKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '1232';
		//var prLine = engGetHash(rawTransKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '232';
		closestTextArea($obj).add(prLine);
		msg = 'OK';
		img = imgOk;
	}
	
	led($obj).set(img, msg);
    widDone($obj, msg);
}

function widPreBlockingReceiveStep1($obj, click) {
	led($obj).clear();	
	var rawTransKeys = widGetClosestTextarea($obj).val();
	if (!engIsRawTransKeys(rawTransKeys)) return widDone($obj, 'Bad TransKeys!');
	if (!widIsPassword)	return widDone($obj, 'Empty password!');

	if (widGetRawTokens().length > 0 && (typeof click == 'undefined')) {
		//if there is tokens make users request for continue;
		//if "Continue" button will pressed "click" will stay true
		return widContinueButtonClick(widGetClosestContinueButton($obj));
	} 
	
    widCleanCL();
	glTokList.clear();

    var tok = engGetTokens(widGetRawTokens(), glCurrentDB.hash);		
    var transKeys = engGetTransKeys(rawTransKeys);
	tok = engGetMergedTokensList(engGetHashedTokensList(transKeys), engGetRawTokensList(tok), glCurrentDB.hash);
    widShowOrderedTokensNames(tok);
	widUpgradeTransKeys($obj, transKeys, widBlockingReceiveStep1); 
}

function widBlockingReceiveStep1($obj, titleKeys) {
    var cbFunc = function (cbData, cmdIdx, progress) {
		widShowProgressbar(progress);
		
		var resp = engGetResp(cbData);
        (resp.msg !== 'ERROR') ? widWarningLed($obj, imgOk, 'OK') : widWarningLed($obj, imgError, 'Error occurred: ' + resp.cnt);
		
        if (glCL.items.length == 0) return widDone($obj, 'Operation cancelled!');
		(cmdIdx + 1 < glCL.items.length) ? widShowTokensLog('Obtaining keys...') : widDone($obj, 'Done.');
    }

    for (var i = 0; i < titleKeys.length; i++) {
        var n0 = titleKeys[i].n;
        var n1 = n0 + 1;
        var s = titleKeys[i].s;
        var k1 = titleKeys[i].k1;
        var g1 = titleKeys[i].g1;
        var o1 = titleKeys[i].o1;

        var addCmd = 'add * ' + glCurrentDB.name + ' ' + n1 + ' ' + s + ' ' + k1 + ' ' + g1 + ' ' + o1;

        glCL.items[i] = {};
        glCL.items[i].cmd = addCmd;
        glCL.items[i].s = s;
        glCL.items[i].r = '';
    }

    engRunCL(glCL, cbFunc);
}

function widPreBlockingReceiveStep2($obj, click) {
	led($obj).clear();	
	var rawTransKeys = widGetClosestTextarea($obj).val();
	if (!engIsRawTransKeys(rawTransKeys)) return widDone($obj, 'Bad TransKeys!');
	if (!widIsPassword)	return widDone($obj, 'Empty password!');
	
	if (widGetRawTokens().length > 0 && (typeof click == 'undefined')) {
		//if there is tokens make users request for continue;
		//if "Continue" button will pressed "click" will stay true
		return widContinueButtonClick(widGetClosestContinueButton($obj));
	} 

 	widCleanCL();
	glTokList.clear();
	
    var tok = engGetTokens(widGetRawTokens(), glCurrentDB.hash);		
    var transKeys = engGetTransKeys(rawTransKeys);
	tok = engGetMergedTokensList(engGetHashedTokensList(transKeys), engGetRawTokensList(tok), glCurrentDB.hash);
    widShowOrderedTokensNames(tok);
	widUpgradeTransKeys($obj, transKeys, widBlockingReceiveStep2); 
}

function widBlockingReceiveStep2($obj, titleKeys) {
    var cbFunc = function (cbData, cmdIdx, progress) {
		widShowProgressbar(progress);
		
		var resp = engGetResp(cbData);
        (resp.msg !== 'ERROR') ? widWarningLed($obj, imgOk, 'OK') : widWarningLed($obj, imgError, 'Error occurred: ' + resp.cnt);
		
        if (glCL.items.length == 0) return widDone($obj, 'Operation cancelled!');
		(cmdIdx + 1 < glCL.items.length) ? widShowTokensLog('Obtaining keys...') : widDone($obj, 'OK');
    }

    for (var i = 0; i < titleKeys.length; i++) {
        var n0 = titleKeys[i].n;
        var n2 = n0 + 2;
        var s = titleKeys[i].s;
        var k2 = titleKeys[i].k2;
        var g2 = titleKeys[i].g2;
        var o2 = titleKeys[i].o2;
        
		var addCmd = 'add * ' + glCurrentDB.name + ' ' + n2 + ' ' + s + ' ' + k2 + ' ' + g2 + ' ' + o2;
		
        glCL.items[i] = {};
        glCL.items[i].cmd = addCmd;
        glCL.items[i].s = s;
        glCL.items[i].r = '';

    }

    engRunCL(glCL, cbFunc);
}

function widPreBlockingRequestStep1($obj) {
    widCleanCL();
	widCleanUI($obj).near();
	var msg = 'Please wait...';
	
    switch (glTokList.state()) {	// checks the contents of the verified tokens list
    case true:		// VTL contains only available tokens
		msg = 'All tokens in the list are already available!';
		led($obj).set(imgError, msg);
        widDone($obj, msg);
        break;
    case false:		// VTL contains only unavailable tokens
		led($obj).set(imgLoading, msg);
		widBlockingRequestStep1($obj, glTokList.items);
        break;
    case undefined:		// VTL contains both kinds of tokens - available and unavailable
		msg = 'There are some available tokens in the list!';
		led($obj).set(imgError, msg);	
        widDone($obj, msg);
        break;
    default:		// VTL no contains any tokens then make new VTL 
		if (!widIsRawTokens()) return widDone($obj, 'Empty or bad tokens!');
		if (!widIsPassword()) return widDone($obj, 'Empty password!');
		
		var tok = engGetTokens(widGetRawTokens(), glCurrentDB.hash);
        var extCb = function (data) {
			widPreBlockingRequestStep1($obj);
        }
		led($obj).set(imgLoading, msg);
		widFillOutTokList($obj, tok, extCb);
        break;
    }
}

function widBlockingRequestStep1($obj, items) {
    for (var i = 0; i < items.length; i++) {
        if (items[i].st === 'WRONG_PWD') {
			// includes only existing unknown tokens
            var r = items[i];
            var n0 = r.n;
            var k3 = engGetKey(n0 + 3, r.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
            var g2 = engGetKey(n0 + 3, r.s, k3, glCurrentDB.magic, glCurrentDB.hash);
            var o1 = engGetKey(n0 + 2, r.s, g2, glCurrentDB.magic, glCurrentDB.hash);
            var tkLine = r.n + ' ' + r.s + ' ' + o1 + '\n';
			//var tkLine = r.s + ' ' + o1 + '\n';
			closestTextArea($obj).add(tkLine);
        }
        
        widShowProgressbar(100 * (i + 1) / items.length);
		widShowTokensLog('Generation...');
    }
	
	var msg, img;
	if (closestTextArea($obj).val().length == 0) {
		msg = 'Inappropriate tokens!';
		img = imgError;
	} else {
		var rawTransKeys = $(widGetClosestTextarea($obj)).val().replace(/\s/g, '');
		var prLine = engGetHash(rawTransKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '1251';
		//var prLine = engGetHash(rawTransKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '251';
		closestTextArea($obj).add(prLine);
		msg = 'OK';
		img = imgOk;
	}
	
	led($obj).set(img, msg);
    widDone($obj, msg);
}

function widPreBlockingRequestStep2($obj) {
    widCleanCL();
	widCleanUI($obj).near();
	var msg = 'Please wait...';
	
    switch (glTokList.state()) { // checks the contents of the verified tokens list
	case true: // VTL contains only available
		msg = 'All tokens in the list are already available!';
		led($obj).set(imgError, msg);
		widDone($obj, msg);
		break;
    case false:		// VTL contains only unavailable tokens
		led($obj).set(imgLoading, msg);
        widBlockingRequestStep2($obj, glTokList.items);
        break;
    case undefined:		// VTL contains both kinds of tokens - available and unavailable
		msg = 'There are some available tokens in the list!';
		led($obj).set(imgError, msg);
		widDone($obj, msg);
        break;		
    default:
		if (!widIsRawTokens()) return widDone($obj, 'Empty or bad tokens!');
		if (!widIsPassword()) return widDone($obj, 'Empty password!');
		
        var tok = engGetTokens(widGetRawTokens(), glCurrentDB.hash);
        var extCb = function (data) {
			widPreBlockingRequestStep2($obj);
        }
		led($obj).set(imgLoading, msg);
		widFillOutTokList($obj, tok, extCb);
        break;
    }
}

function widBlockingRequestStep2($obj, data) {
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
			closestTextArea($obj).add(tkLine);
        } 
		
		widShowProgressbar(100 * (i + 1) / data.items.length);
        widShowTokensLog('Generation...');
    }
	
	var msg, img;
	if (closestTextArea($obj).val().length == 0) {
		msg = 'Inappropriate tokens!';
		img = imgError;
	} else {
		var rawTransKeys = $(widGetClosestTextarea($obj)).val().replace(/\s/g, '');
		var prLine = engGetHash(rawTransKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '124252';
		//var prLine = engGetHash(rawTransKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '24252';
		closestTextArea($obj).add(prLine);
		msg = 'OK';
		img = imgOk;
	}
	
	led($obj).set(img, msg);
    widDone($obj, msg);
}

function widPreBlockingAcceptStep1($obj, click) {
	led($obj).clear();	
    var rawTransKeys = widGetClosestTextarea($obj).val();
    if (!engIsRawTransKeys(rawTransKeys)) return widDone($obj, 'Bad TransKeys!');
	if (!widIsPassword()) return widDone($obj, 'Empty password!');
	
	if (widGetRawTokens().length > 0 && (typeof click == 'undefined')) {
		//if there is tokens make users request for continue;
		//if "Continue" button will pressed "click" will stay true
		return widContinueButtonClick(widGetClosestContinueButton($obj));
	} 
	
    widCleanCL();
    glTokList.clear();

	var tok = engGetTokens(widGetRawTokens(), glCurrentDB.hash);
    var transKeys = engGetTransKeys(rawTransKeys);
	tok = engGetMergedTokensList(engGetHashedTokensList(transKeys), engGetRawTokensList(tok), glCurrentDB.hash); 
	widShowOrderedTokensNames(tok);
	widUpgradeTransKeys($obj, transKeys, widBlockingAcceptStep1); 
}

function widBlockingAcceptStep1($obj, titleKeys) {
    var cbFunc = function (cbData, cmdIdx, progress) {
		widShowProgressbar(progress);
		
		var resp = engGetResp(cbData);
        (resp.msg !== 'ERROR') ? widWarningLed($obj, imgOk, 'OK') : widWarningLed($obj, imgError, 'Error occurred: ' + resp.cnt);
		
        if (glCL.items.length == 0) return widDone($obj, 'Operation cancelled!');
		(cmdIdx + 1 < glCL.items.length) ? widShowTokensLog('Obtaining keys...') : widDone($obj, 'Done.');
    }

    for (var i = 0; i < titleKeys.length; i++) {
        var n1 = titleKeys[i].n1;
        var s = titleKeys[i].s;
        var k1 = titleKeys[i].k1;
        var g1 = titleKeys[i].g1;
        var o1 = titleKeys[i].o1;
		
        var addCmd = 'add * ' + glCurrentDB.name + ' ' + n1 + ' ' + s + ' ' + k1 + ' ' + g1 + ' ' + o1;

        glCL.items[i] = {};
        glCL.items[i].cmd = addCmd;
        glCL.items[i].s = s;
        glCL.items[i].r = '';

    }

    engRunCL(glCL, cbFunc);
}

function widPreBlockingAcceptStep2($obj, click) {
	led($obj).clear();	
    var rawTransKeys = widGetClosestTextarea($obj).val();
    if (!engIsRawTransKeys(rawTransKeys)) return widDone($obj, 'Bad TransKeys!');
	if (!widIsPassword()) return widDone($obj, 'Empty password!');
	
	if (widGetRawTokens().length > 0 && (typeof click == 'undefined')) {
		//if there is tokens make users request for continue;
		//if "Continue" button will pressed "click" will stay true
		return widContinueButtonClick(widGetClosestContinueButton($obj));
	} 
	
    widCleanCL();
    glTokList.clear();

	var tok = engGetTokens(widGetRawTokens(), glCurrentDB.hash);
    var transKeys = engGetTransKeys(rawTransKeys);
	tok = engGetMergedTokensList(engGetHashedTokensList(transKeys), engGetRawTokensList(tok), glCurrentDB.hash); 
	widShowOrderedTokensNames(tok);
	widUpgradeTransKeys($obj, transKeys, widBlockingAcceptStep2); 
}

function widBlockingAcceptStep2($obj, titleKeys) {
    var cbFunc = function (cbData, cmdIdx, progress) {
        widShowProgressbar(progress);
		
		var resp = engGetResp(cbData);
        (resp.msg !== 'ERROR') ? widWarningLed($obj, imgOk, 'OK') : widWarningLed($obj, imgError, 'Error occurred: ' + resp.cnt);
		
        if (glCL.items.length == 0) return widDone($obj, 'Operation cancelled!');
		(cmdIdx + 1 < glCL.items.length) ? widShowTokensLog('Obtaining keys...') : widDone($obj, 'Done.');
    }

    for (var i = 0; i < titleKeys.length; i++) {
        var n2 = titleKeys[i].n2;
        var s = titleKeys[i].s;
        var k2 = titleKeys[i].k2;
        var g2 = titleKeys[i].g2;
        var o2 = titleKeys[i].o2;

        var addCmd = 'add * ' + glCurrentDB.name + ' ' + n2 + ' ' + s + ' ' + k2 + ' ' + g2 + ' ' + o2;

        glCL.items[i] = {};
        glCL.items[i].cmd = addCmd;
        glCL.items[i].s = s;
        glCL.items[i].r = '';
    }

    engRunCL(glCL, cbFunc);
}
