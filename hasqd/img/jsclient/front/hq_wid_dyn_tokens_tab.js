// Hasq Technology Pty Ltd (C) 2013-2015

function widCleanCL() {
    glCL.idx = 0;
    glCL.counter = 100;
    glCL.items.length = 0;
}

function widCleanVerifyTab() {
    $('#tokens_verify_table').find('tr:gt(0)').remove();
    $('#tokens_verify_hidden_div').hide(); //css('display', 'none');
    $('#tokens_verify_led_div').empty();
}

function widCleanSS1() {
    $('#tokens_ss1_led_div').empty();
    $('#tokens_ss1_textarea').val('');
}

function widCleanSS2() {
    $('#tokens_ss2_led_div').empty();
}

function widCleanSS3() {
    $('#tokens_ss3_s1_led_div').empty();
    $('#tokens_ss3_s1_textarea').val('');
    $('#tokens_ss3_s2_led_div').empty();
    $('#tokens_ss3_s2_textarea').val('');
}

function widCleanSS4() {
    $('#tokens_ss3_s1_led_div').empty();
    $('#tokens_ss3_s2_led_div').empty();
}

function widCleanRS1() {
    $('#tokens_rs1_led_div').empty();
}

function widCleanRS2() {
    $('#tokens_rs2_led_div').empty();
    $('#tokens_rs2_textarea').val('');
}

function widCleanRS3() {
    $('#tokens_rs3_s1_led_div').empty();
    $('#tokens_rs3_s2_led_div').empty();
}

function widCleanRS4() {
    $('#tokens_rs4_s1_led_div').empty();
    $('#tokens_rs4_s1_textarea').val('');
    $('#tokens_rs4_s2_led_div').empty();
    $('#tokens_rs4_s2_textarea').val('');
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

function widCleanAllTabs() {
    widCleanVerifyTab();
    widCleanSS1();
    widCleanSS2();
    widCleanSS3();
    widCleanSS4();
    widCleanRS1();
    widCleanRS2();
    widCleanRS3();
    widCleanRS4();
    widShowProgressbar(0);
}

function widTokensIdxOninput(obj) {
	obj.val(engGetOnlyNumber(obj.val()));
}

function widTokensPasswordOninput(data) {
    glPassword = data;
    glVTL = engGetVTL(glVTL);
    widCleanAllTabs();
}

function widDisableTokensInput() {
    var obj = $('#tokens_tabs');
    obj.tabs('option', 'disabled', true);
    obj.closest('div[id^="tabs"]').find('button, input, textarea').prop('disabled', true);
    obj.closest('div[id^="tabs"]').find('textarea:first').prop('disabled', false);
}

function widEnableTokensInput() {
    var obj = $('#tokens_tabs');
    obj.tabs('enable');
    obj.closest('div[id^="tabs"]').find('button, input, textarea').prop('disabled', false);
}

function widDisableAllTokensOperations(obj) {
    var tabs = $('#tokens_tabs');
    tabs.tabs('option', 'disabled', true);
    tabs.closest('div[id^="tabs"]').find('button, input, textarea').prop('disabled', true);
    $(widGetClosestContinueButton(obj)).prop('disabled', false);
    $(widGetClosestMainButton(obj)).prop('disabled', false);
}

function widEnableAllTokensOperations() {
    var obj = $('#tokens_tabs');
    obj.tabs('enable');
    obj.closest('div[id^="tabs"]').find('button, input, textarea').prop('disabled', false);
}

function widGetTokensNamesState() {
    var r = {};
    r.message = 'OK';
    r.content = 'OK';

    if ($('#tokens_names_textarea').val() == '') {
        r.message = 'ERROR';
        r.content = 'Bad tokens names!';
    } else if (widGetPasswordState().message == 'ERROR') {
        r.message = 'ERROR';
        r.content = widGetPasswordState().content;
    }

    return r;
}

function widGetPasswordState() {
    var objPwd = $('#tokens_password_input');
    var r = {};
    r.message = 'OK';
    r.content = 'OK';

    if (objPwd.val() == '') {
        r.message = 'ERROR';
        r.content = 'Empty password.';
    }

    return r;
}

function widGetRangeDataState() {
    var objBasename = $('#tokens_basename_input');
    var idx0 = +$('#tokens_first_idx_input').val();
    var idx1 = +$('#tokens_last_idx_input').val();
    var r = {};
    r.message = 'OK';
    r.content = 'OK';

    if (objBasename.val() == '') {
        r.message = 'ERROR';
        r.content = 'Empty basename.';
    } else if (/[\s]/g.test(objBasename.val())) {
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

function widTokensNamesOninput(obj) {
    glVTL = engGetVTL(glVTL);
    widCleanAllTabs();
    widShowBordersColor(obj);
	
    var tokens = obj.val();

    if (!engIsToken(tokens, glCurrentDB.hash)) {
        widDisableTokensInput();
        widShowBordersColor(obj, '#FF0000'); //RED BORDER
        widShowTokensLog('Please enter a hashes or raw value in square brackets.');
    } else if (tokens.length >= 15479) {
        widEnableTokensInput();
        widShowBordersColor(obj, '#FFFF00'); //YELLOW BORDER
        var l = 16511 - tokens.length;
        obj.prop('title', 'Warning! ' + l + ' chars left.');
        widShowTokensLog();
    } else {
        widEnableTokensInput();
        widShowBordersColor(obj);
        widShowTokensLog();
    }
}

function widAddTokens(id, data) {
    var objBasename = $('#tokens_basename_input')
        var objFirstIdx = $('#tokens_first_idx_input')
        var objLastIdx = $('#tokens_last_idx_input')
        var objNames = $('#tokens_names_textarea')

        var chk = widGetRangeDataState();

    if (chk.message == 'ERROR') {
        widDone(id, chk.content);
        return;
    }

    var baseName = objBasename.val();
    var idx0 = objFirstIdx.val();
    var idx1 = objLastIdx.val();
    var tokens = objNames.val().replace(/\s+$/g, '');
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
        objNames.val(tokens);
        objNames[0].oninput();
        objBasename.val('');
        objFirstIdx.val('');
        objLastIdx.val('');
        widDone(id, 'OK');
    } else {
        widDone(id, 'REQ_TOKENS_TOO_MANY');
    }

}

function widSwitchShowHide(obj) {
    if (obj.css('display') === 'none') {
        obj.show();
    } else {
        obj.hide();
    }
}

function widGetWarningsMode(obj) {
    return (obj.button('option', 'label') == 'Continue') ? true : false;
}

function widGetButtonsMode(obj) {
	var label = obj.button('option', 'label');
    var title = obj.attr('data-title');
    var objC = widGetClosestContinueButton(obj);
    var cMode = widGetWarningsMode(objC);
	
    if (obj == objC && cMode) {
        return true;
    } else if (label == title) {
        return true; // Main button in action-mode is visible
    } else {
        return false; // Cancel is visible
    }
}

function widGetFunctionById(obj, data) {
	var id = obj.attr('id');
    widCleanCL();
    switch (id) {
    case 'tokens_add_button':
        var f = function () {
            widAddTokens(obj);
        }
        break;
    case 'tokens_create_button':
        var f = function () {
            widPrepareToCreate(obj);
        }
        break;
    case 'tokens_verify_button':
        var f = function () {
            widPrepareToVerify(obj);
        }
        break;
    case 'tokens_data_update_button':
        var f = function () {
            widPrepareToUpdate(obj, data);
        }
        break;
    case 'tokens_ss1_showkeys_button':
        var f = function () {
            widPrepareToSS1(obj);
        }
        break;
    case 'tokens_rs1_obtainkeys_button':
        var f = function () {
            widPrepareToRS1(obj, data);
        }
        break;
    case 'tokens_ss2_obtainkeys_button':
        var f = function () {
            widPrepareToSS2(obj, data);
        }
        break;
    case 'tokens_rs2_showkeys_button':
        var f = function () {
            widPrepareToRS2(obj);
        }
        break;
    case 'tokens_ss3_s1_showkeys_button':
        var f = function () {
            widPrepareToSS3S1(obj);
        }
        break;
    case 'tokens_ss3_s2_showkeys_button':
        var f = function () {
            widPrepareToSS3S2(obj);
        }
        break;
    case 'tokens_ss4_s1_obtainkeys_button':
        var f = function () {
            widPrepareToSS4S1(obj, data);
        }
        break;
    case 'tokens_ss4_s2_obtainkeys_button':
        var f = function () {
            widPrepareToSS4S2(obj, data);
        }
        break;

    case 'tokens_rs3_s1_obtainkeys_button':
        var f = function () {
            widPrepareToRS3S1(obj, data);
        }
        break;
    case 'tokens_rs3_s2_obtainkeys_button':
        var f = function () {
            widPrepareToRS3S2(obj, data);
        }
        break;
    case 'tokens_rs4_s1_showkeys_button':
        var f = function () {
            widPrepareToRS4S1(obj);
        }
        break;
    case 'tokens_rs4_s2_showkeys_button':
        var f = function () {
            widPrepareToRS4S2(obj);
        }
        break;
    default:
        break;
    }
    return f;
}


function widGetClosestMainButton(obj) {
    return obj.closest('div[data-class="div"]').find('button[data-class="main"]');
}

function widGetClosestContinueButton(obj) {
    return obj.closest('div[data-class="div"]').find('button[data-class="hide"]');
}

function widGetClosestWarningMessage(obj) {
    return obj.closest('div[data-class="div"]').find('td[data-class="hide"]');
}

function widGetClosestLed(obj) {
    return obj.closest('div[data-class="div"]').find('div[id^="_led_"]');
}

function widGetClosestTextarea(obj) {
    return obj.closest('div[data-class="div"]').find('textarea');
}

function widSwitchButtonsMode(obj) {
    var title = obj.attr('data-title');
    var label = obj.button('option', 'label');
	
    if (label === title && title === 'Continue') {
        var objWarning = widGetClosestWarningMessage(obj);
        widSwitchShowHide(obj);
        widSwitchShowHide(objWarning);
        obj.button('option', 'label', 'Hidden');
    } else if (label !== title && title === 'Continue') {
        obj.button('option', 'label', title);
        var objWarning = widGetClosestWarningMessage(obj);
        widSwitchShowHide(obj);
        widSwitchShowHide(objWarning);
    } else if (label === title) {
        obj.button('option', 'label', 'Cancel');
    } else {
        obj.button('option', 'label', title);
        var objContinue = widGetClosestContinueButton(obj);
        var objWarning = widGetClosestWarningMessage(obj);
        if (widGetWarningsMode(objContinue)) {
            $(objContinue).button('option', 'label', 'Hidden');
            widSwitchShowHide(objContinue);
            widSwitchShowHide(objWarning);
        }
    }
}

function widMainButtonClick(obj, data) {
	var f;
	
    if (widGetButtonsMode(obj)) {
        widDisableAllTokensOperations(obj);
        f = widGetFunctionById(obj);
    } else {
        f = function () {
            widCancel(obj, data);
        }
    }
    widSwitchButtonsMode(obj);
    setTimeout(f);
}

function widDone(obj, data) {
    widMainButtonClick(obj, data);
}

function widCancel(obj, data) {
	excludeObj = $('#tokens_verify_button');
    if (typeof(data) != 'string') {
        glVTL = engGetVTL(glVTL);
        data = 'Operation cancelled by user';
    } else if (obj !== excludeObj) {
        glVTL = engGetVTL(glVTL);
    }

    widCleanCL();
    widShowTokensLog(data);
    widEnableAllTokensOperations();
}

function widContinueButtonClick(obj, data) {
    widSwitchButtonsMode(obj);

    var label = obj.button('option', 'label');

    if (data === true) {
        var objMainButton = widGetClosestMainButton(obj);
        setTimeout(widGetFunctionById(objMainButton, true));
    }
}

function widPrepareToCreate(obj) {
    widCleanCL();
    glVTL = engGetVTL(glVTL);

    var objNames = $('#tokens_names_textarea');
    var chk = widGetTokensNamesState();

    if (chk.message == 'ERROR') {
        widDone(obj, chk.content);
        return;
    }

    var tokens = engGetParsedTokensList(objNames.val(), glCurrentDB.hash);
    widCreateTokens(obj, tokens);
}

function widCreateTokens(obj, tokens) {
    var cbFunc = function (cbData, cmdItemIdx, progress) {
        if (glCL.items.length == 0) {
            return;
        }

        widShowProgressbar(progress);

        var cbResponse = engGetParsedResponse(cbData);

        if (cbResponse.message == 'ERROR') {
            widDone(obj, cbResponse.content);
        } else if (cmdItemIdx + 1 < glCL.items.length) {
            widShowTokensLog('Creating... ');
        } else {
            widMainButtonClick(obj, 'OK');
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

function widPrepareToVerify(obj, data) {
    widCleanCL();
    glVTL = engGetVTL(glVTL);
    widCleanVerifyTab();

    var chk = widGetTokensNamesState();

    if (chk.message == 'ERROR') {
        widDone(obj, chk.content);
        return;
    }

    var objNames = $('#tokens_names_textarea');
    var objTable = $('#tokens_verify_hidden_div');

    objTable.css('display', 'block');
    var tokens = engGetParsedTokensList(objNames.val(), glCurrentDB.hash);

    widVerifyTokens(obj, tokens, null, null);
}

function widShowVerifyTableRow(data, pic) {
    var table = $('#tokens_verify_table');
	var row = widGetHTMLTr(widGetHTMLTd(pic + data.message) + widGetHTMLTd(data.rawS) + widGetHTMLTd(data.s) + widGetHTMLTd(data.n) + widGetHTMLTd(data.d));
    table.append(row);
}

function widGetVerifyTebleRowLed(data) {
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

function widShowVerifyTableStateLed(data) {
    var obj = $('#tokens_verify_led_div');

    if (data && obj.outerHTML != picRed) {
        obj.html(picRed);
        obj.prop('title', 'TOKENS MISMATCH DETECTED');
    } else if (obj.outerHTML != picGrn) {
        obj.html(picGrn);
        obj.prop('title', 'OK');
    }
}

function widVerifyTokens(obj, tokens, nextFunc, nextFuncData) {
    var cbFunc = function (data, idx, progress) {
        if (glCL.items.length == 0) {
            return;
        }

        var r = engGetParsedResponse(data);

        if (r.message == 'ERROR') {
            widDone(obj, r.content);
            return;
        }

        widShowProgressbar(progress);

        glVTL = engGetVTL(glVTL, engGetTokensInfo(data, glCL.items[idx]));

        var idx = glVTL.items.length - 1;
        var pic = widGetVerifyTebleRowLed(glVTL.items[idx].message);

        if (nextFunc == null) {
            widShowVerifyTableRow(glVTL.items[idx], pic);
            widShowVerifyTableStateLed(glVTL.unknown);
        }

        if (idx + 1 < glCL.items.length) {
            widShowTokensLog('Verifying...');
        } else if (nextFunc != null) {
            widShowTokensLog('Verified tokens list is ready.');
            widCleanCL();
            var f = (nextFuncData === null) ? function () {
                nextFunc(obj);
            }
             : function () {
                nextFunc(obj, nextFuncData);
            }
            setTimeout(f);
        } else {
            widMainButtonClick(obj, 'OK');
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

function widPrepareToUpdate(obj, data) {
    widCleanCL();

    var chk = widGetTokensNamesState();
	var d = $('#tokens_data_newdata_input').val();
    var inp = $('#tokens_names_textarea').val();	
	
    switch (engGetVTLContent(glVTL)) {
    case true:
        if (d == '') {
            widDone(obj, 'REQ_BAD_NEWDATA');
            return;
        } else {
            widUpdateTokens(obj, d);
        }
        break;
    case false:
        widDone(obj, 'TOKENS_MISMATCH');
        break;
    case undefined:
        if (d == '') {
            widDone(obj, 'REQ_BAD_NEWDATA');
        } else if (data === true) {
            widUpdateTokens(obj, d);
        } else {
            var idC = widGetClosestContinueButton(obj);
            widContinueButtonClick(idC);
        }
        break;
    default:
        if (chk.message == 'ERROR') {
            widDone(obj, chk.content);
            return;
        } else if (d == '') {
            widDone(obj, 'REQ_BAD_NEWDATA');
            return;
        }

        var tokens = engGetParsedTokensList(inp, glCurrentDB.hash);
        var f = function () {
            widVerifyTokens(obj, tokens, widPrepareToUpdate, false);
        }

        setTimeout(f);

        break;
    }
}

function widUpdateTokens(obj, data) {
    var cbFunc = function (cbData, cmdItemIdx, progress) {
        if (glCL.items.length === 0) {
            widDone(obj, cbData);
            return;
        }

        widShowProgressbar(progress);

        var cbResponse = engGetParsedResponse(cbData);

        if (cbResponse.message === 'ERROR') {
            widDone(obj, cbResponse.content);
        } else if (cmdItemIdx + 1 < glCL.items.length) {
            widShowTokensLog('Update data... ');
        } else {
            widDone(obj, 'OK');
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

function widPrintSendReceiveOut(obj, data) {
    var objTextarea = widGetClosestTextarea(obj);
    if (data != '') {
        $(objTextarea).val($(objTextarea).val() + data);
    }
}

function widPrintSendReceiveLed(obj, data) {
    if (data) {
        obj.html(picGrn);
        obj.prop('title', 'OK');
    } else {
        obj.html(picRed);
        obj.prop('title', 'MISMATCHED TOKENS DETECTED');
    }
}

function widPrepareToSS1(obj) {
	var objTokens = $('#tokens_names_textarea');
    var objLed = $('#tokens_ss1_led_div');
	
    widCleanCL();
    widCleanSS1();

    var chk = widGetTokensNamesState();

    if (chk.message == 'ERROR') {
        widDone(obj, chk.content);
        return;
    }
	
    switch (engGetVTLContent(glVTL)) {
    case true:
        widPrintSendReceiveLed(objLed, true);
		
        var f = function () {
            widSS1ShowK1K2Keys(obj, glVTL);
        }
		
        setTimeout(f);
		
        break;
    case false:
        widPrintSendReceiveLed(objLed, false);
        widDone(obj, 'TOKENS_MISMATCH');
		
        break;
    case undefined:
        widPrintSendReceiveLed(objLed, false);
		
        var f = function () {
            widSS1ShowK1K2Keys(obj, glVTL);
        }
		
        setTimeout(f);
		
        break;
    default:
        var tokens = engGetParsedTokensList(objTokens.val(), glCurrentDB.hash);
        var f = function () {
            widVerifyTokens(obj, tokens, widPrepareToSS1, false);
        }
		
        setTimeout(f);
		
        break;
    }
}

function widSS1ShowK1K2Keys(obj, data) {
    for (var i = 0; i < data.items.length; i++) {
        widShowProgressbar(100 * (i + 1) / data.items.length);
		
        if (data.items[i].message == 'OK') {
            var r = data.items[i];
            var k1 = engGetKey(r.n + 1, r.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
            var k2 = engGetKey(r.n + 2, r.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
            var newRow = r.n + ' ' + r.s + ' ' + k1 + ' ' + k2 + '\n';
        } else {
            var newRow = '';
        }

        widPrintSendReceiveOut(obj, newRow);
        widShowTokensLog('Generation...');
    }

    var extractKeys = $(widGetClosestTextarea(obj)).val().replace(/[\n|\s]/g, '');
    var lastRow = engGetHash(extractKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '1231320';
    widPrintSendReceiveOut(obj, lastRow);
    widMainButtonClick(obj, 'OK');
}

function widShowUpdatedTokensNames(arr, obj) {
    for (var i = 0; i < arr.length; i++) {
        if (i == 0) {
            obj.val(arr[i]);
        } else {
            obj.val(obj.val() + ' ' + arr[i]);
        }
    }
}

function widPrepareToRS1(obj, data) {
	var objTokens = $('#tokens_names_textarea');
    widCleanCL();
    glVTL = engGetVTL(glVTL);
    widCleanRS1();

    var chk = widGetPasswordState()

    if (chk.message == 'ERROR') {
        widDone(obj, chk.content);
        return;
    }

    var tokens = objTokens.val();
    var rawTransferKeys = $(widGetClosestTextarea(obj)).val();
    var sKey = '1231320';

    var chk = engGetTransferKeysCheckResults(rawTransferKeys, sKey, glCurrentDB.altname);

    if (chk.message == 'ERROR') {
        widDone(obj, chk.content);
        return;
    }

    if (tokens == '' || data) {
        var transferKeys = engGetParsedTransferKeys(rawTransferKeys, sKey);
        transferKeys = engGetUpdatedTransferKeys(transferKeys, glPassword, glCurrentDB.hash, glCurrentDB.magic, sKey);
        tokens = engGetParsedTokensList(tokens, glCurrentDB.hash);
        tokens = engGetTokensUpdatedNames(engGetTokensHashedNames(transferKeys), engGetTokensRawNames(tokens));

        widShowUpdatedTokensNames(tokens, objTokens);
        var f = function () {
            widRS1ObtainK1K2Keys(obj, transferKeys);
        }
        setTimeout(f);
    } else {
        widContinueButtonClick(widGetClosestContinueButton(obj));
    }
}

function widRS1ObtainK1K2Keys(obj, data) {
    var cbFunc = function (cbData, cmdItemIdx, progress) {
        var cbResponse = engGetParsedResponse(cbData);
        var objLed = $('#tokens_rs1_led_div');

        if (cbResponse.message != 'ERROR' && objLed.html() != picRed) {
            objLed.html(picGrn);
            objLed.prop('title', 'Operation successfull.\nPlease, check the results on the Verify tab.');
        } else if (cbResponse.message == 'ERROR' && objLed.html() != picRed) {
            objLed.html(picRed);
            objLed.prop('title', 'Operation error occurred.\nPlease use the \"Verify\" tab for more info\nor try to repeat operation.');
        }

        widShowProgressbar(progress);

        if (glCL.items.length == 0) {
            widDone(obj, 'Operation cancelled by user');
        } else if (cmdItemIdx + 1 < glCL.items.length) {
            widShowTokensLog('Obtaining keys...');
        } else {
            widMainButtonClick(obj, 'OK');
        }
    }

    for (var i = 0; i < data.length; i++) {
        var n0 = data[i].n;
        var n1 = n0 + 1;
        var n2 = n0 + 2;
        var s = data[i].s;
        var k1 = data[i].k1;
        var g1 = data[i].g1;
        var o1 = data[i].o1;
        var k2 = data[i].k2;
        var g2 = data[i].g2;
        var o2 = data[i].o2;

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

function widPrepareToSS2(obj, data) {
    widCleanCL();
    glVTL = engGetVTL(glVTL);
    widCleanSS2();

    var chk = widGetPasswordState()

    if (chk.message == 'ERROR') {
        widDone(obj, chk.content);
        return;
    }

    var objTokens = $('#tokens_names_textarea');
    var tokens = objTokens.val();
    var rawTransferKeys = $(widGetClosestTextarea(obj)).val();
    var sKey = '1242520';
	
    var chk = engGetTransferKeysCheckResults(rawTransferKeys, sKey, glCurrentDB.altname);

    if (chk.message == 'ERROR') {
        widDone(obj, chk.content);
        return;
    }

    if (tokens == '' || data) {
        var transferKeys = engGetParsedTransferKeys(rawTransferKeys, sKey);
        transferKeys = engGetUpdatedTransferKeys(transferKeys, glPassword, glCurrentDB.hash, glCurrentDB.magic, sKey);

        tokens = engGetParsedTokensList(tokens, glCurrentDB.hash);
        tokens = engGetTokensUpdatedNames(engGetTokensHashedNames(transferKeys), engGetTokensRawNames(tokens));

        widShowUpdatedTokensNames(tokens, objTokens);

        var f = function () {
            widSS2ObtainG2O2Keys(obj, transferKeys);
        }
        setTimeout(f);
    } else {
        widContinueButtonClick(widGetClosestContinueButton(obj));
    }
}

function widSS2ObtainG2O2Keys(obj, data) {
    var cbFunc = function (cbData, cmdItemIdx, progress) {
        var cbResponse = engGetParsedResponse(cbData);
        var objLed = $('#tokens_ss2_led_div');

        if (cbResponse.message != 'ERROR' && objLed.html() != picRed) {
            objLed.html(picGrn);
            objLed.prop('title', 'Operation successfull.\nPlease, check the results on the Verify tab.');
        } else if (cbResponse.message == 'ERROR' && objLed.html() != picRed) {
            objLed.html(picRed);
            objLed.prop('title', 'Operation error occurred.\nPlease use the \"Verify\" tab for more info\nor try to repeat operation.');
        }

        widShowProgressbar(progress);

        if (glCL.items.length == 0) {
            widDone(obj, 'Operation cancelled by user');
        } else if (cmdItemIdx + 1 < glCL.items.length) {
            widShowTokensLog('Obtaining keys...');
        } else {
            widMainButtonClick(obj, 'OK');
        }
    }

    for (var i = 0; i < data.length; i++) {
        var n0 = data[i].n;
        var n1 = data[i].n1;
        var n2 = data[i].n2;
        var s = data[i].s;
        var k1 = data[i].k1;
        var g1 = data[i].g1;
        var o1 = data[i].o1;
        var k2 = data[i].k2;
        var g2 = data[i].g2;
        var o2 = data[i].o2;

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

function widPrepareToRS2(obj) {
    widCleanCL();
    widCleanRS2();
    
	var chk = widGetTokensNamesState();

    if (chk.message == 'ERROR') {
        widDone(obj, chk.content);
        return;
    }
	
	var objTokens = $('#tokens_names_textarea');
    var objLed = $('#tokens_rs2_led_div');
    var tblState = engGetVTLContent(glVTL);

    switch (tblState) {
    case null:
        var tokens = engGetParsedTokensList(objTokens.val(), glCurrentDB.hash);
        var f = function () {
            widVerifyTokens(obj, tokens, widPrepareToRS2, false);
        }
        setTimeout(f);
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
            widPrintSendReceiveLed(objLed, true);
            var f = function () {
                widRS2ShowG2O2Keys(obj, glVTL);
            }
            setTimeout(f);
        } else {
            widPrintSendReceiveLed(objLed, false);
            widDone(obj, 'TOKENS_MISMATCH');
        }
        break;
    }
}

function widRS2ShowG2O2Keys(obj, data) {
    for (var i = 0; i < data.items.length; i++) {
        widShowProgressbar(100 * (i + 1) / data.items.length);
        if (data.items[i].message != 'IDX_NODN') {
            var r = data.items[i];
            var k3 = engGetKey(r.n + 3, r.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
            var k4 = engGetKey(r.n + 4, r.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
            var g2 = engGetKey(r.n + 3, r.s, k3, glCurrentDB.magic, glCurrentDB.hash);
            var g3 = engGetKey(r.n + 4, r.s, k4, glCurrentDB.magic, glCurrentDB.hash);
            var o2 = engGetKey(r.n + 3, r.s, g3, glCurrentDB.magic, glCurrentDB.hash);
            var newRow = r.n + ' ' + r.s + ' ' + g2 + ' ' + o2 + '\n';
        } else {
            var newRow = '';
        }

        widPrintSendReceiveOut(obj, newRow);
        widShowTokensLog('Generation...');
    }

    idOut = widGetClosestTextarea(obj);
    var extractKeys = $(widGetClosestTextarea(obj)).val().replace(/[\n|\s]/g, '');
    var lastRow = engGetHash(extractKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '1242520';
    widPrintSendReceiveOut(obj, lastRow);
    widMainButtonClick(obj, 'OK');
}

function widPrepareToSS3S1(obj) {
    widCleanCL();
    widCleanSS3();

    var chk = widGetTokensNamesState();

    if (chk.message == 'ERROR') {
        widDone(obj, chk.content);
        return;
    }
	
    var objTokens = $('#tokens_names_textarea');
    var objLed = $('#tokens_ss3_s1_led_div');
    var tblState = engGetVTLContent(glVTL);

    switch (tblState) {
    case true:
        widPrintSendReceiveLed(objLed, true);
        var f = function () {
            widSS3ShowK1G1Keys(obj, glVTL);
        }
        setTimeout(f);
        break;
    case false:
        widPrintSendReceiveLed(objLed, false);
        widDone(obj, 'TOKENS_MISMATCH');
        break;
    case undefined:
        widPrintSendReceiveLed(objLed, false);
        var f = function () {
            widSS3ShowK1G1Keys(obj, glVTL);
        }
        setTimeout(f);
        break;
    default:
        var tokensSet = engGetParsedTokensList(objTokens.val(), glCurrentDB.hash);
        var f = function () {
            widVerifyTokens(obj, tokensSet, widPrepareToSS3S1, false);
        }
        setTimeout(f);
        break;
    }
}

function widSS3ShowK1G1Keys(obj, data) {
    for (var i = 0; i < data.items.length; i++) {
        widShowProgressbar(100 * (i + 1) / data.items.length);
        if (data.items[i].message == 'OK') {
            var r = data.items[i];
            var n0 = r.n;
            var k1 = engGetKey(r.n + 1, r.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
            var k2 = engGetKey(r.n + 2, r.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
            var g1 = engGetKey(r.n + 2, r.s, k2, glCurrentDB.magic, glCurrentDB.hash);
            var newRow = n0 + ' ' + r.s + ' ' + k1 + ' ' + g1 + '\n';
        } else {
            var newRow = '';
        }

        widPrintSendReceiveOut(obj, newRow);
        widShowTokensLog('Generation...');
    }

    idOut = widGetClosestTextarea(obj);
    var extractKeys = $(widGetClosestTextarea(obj)).val().replace(/[\n|\s]/g, '');
    var lastRow = engGetHash(extractKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '1231410';
    widPrintSendReceiveOut(obj, lastRow);
    widMainButtonClick(obj, 'OK');
}

function widPrepareToSS3S2(obj) {
    widCleanCL();
    widCleanSS3();

    var chk = widGetTokensNamesState();

    if (chk.message == 'ERROR') {
        widDone(obj, chk.content);
        return;
    }
    
	var objTokens = $('#tokens_names_textarea');
    var objLed = $('#tokens_ss3_s2_led_div');
    var tblState = engGetVTLContent(glVTL);

    switch (tblState) {
    case null:
        var tokens = engGetParsedTokensList(objTokens.val(), glCurrentDB.hash);
        var f = function () {
            widVerifyTokens(obj, tokens, widPrepareToSS3S2, false);
        }
		
        setTimeout(f);
		
        break;
    default:
        var g = false;
		
        for (var i = 0; i < glVTL.items.length; i++) {
            if (glVTL.items[i].message !== 'IDX_NODN') { //WRONG_PWD
                var g = true;
                break;
            }
        }
		
        if (g) {
            widPrintSendReceiveLed(objLed, true);
            var f = function () {
                widSS3ShowK2Keys(obj, glVTL);
            }
            setTimeout(f);
        } else {
            widPrintSendReceiveLed(objLed, false);
            widDone(obj, 'TOKENS_MISMATCH');
        }
		
        break;
    }
}

function widSS3ShowK2Keys(obj, data) {
    for (var i = 0; i < data.items.length; i++) {
        widShowProgressbar(100 * (i + 1) / data.items.length);
        if (data.items[i].message != 'IDX_NODN' && data.items[i].n !== 0) {
            var r = data.items[i];
            var n0 = r.n - 1;
            var n2 = r.n + 1;
            var k2 = engGetKey(n2, r.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
            var newRow = n0 + ' ' + r.s + ' ' + k2 + '\n';
        } else {
            var newRow = '';
        }

        widPrintSendReceiveOut(obj, newRow);
        widShowTokensLog('Generation...');
    }

    if (newRow.length !== 0) {
        var extractKeys = $(widGetClosestTextarea(obj)).val().replace(/[\n|\s]/g, '');
        var lastRow = engGetHash(extractKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '12320';
        widPrintSendReceiveOut(obj, lastRow);
    }

    widMainButtonClick(obj, 'OK');
}

function widPrepareToRS3S1(obj, data) {
    widCleanCL();
    glVTL = engGetVTL(glVTL);

    var chk = widGetPasswordState()

    if (chk.message == 'ERROR') {
        widDone(obj, chk.content);
        return;
    }

	var objTokens = $('#tokens_names_textarea');
    var tokens = objTokens.val();
    var rawTransferKeys = $(widGetClosestTextarea(obj)).val();
    var sKey = '1231410';

    var chk = engGetTransferKeysCheckResults(rawTransferKeys, sKey, glCurrentDB.altname);

    if (chk.message == 'ERROR') {
        widDone(obj, chk.content);
        return;
    }

    if (tokens == '' || data) {
        var transferKeys = engGetParsedTransferKeys(rawTransferKeys, sKey);
        transferKeys = engGetUpdatedTransferKeys(transferKeys, glPassword, glCurrentDB.hash, glCurrentDB.magic, sKey);
        tokens = engGetParsedTokensList(tokens, glCurrentDB.hash);
        tokens = engGetTokensUpdatedNames(engGetTokensHashedNames(transferKeys), engGetTokensRawNames(tokens));
        widShowUpdatedTokensNames(tokens, objTokens);
        var f = function () {
            widRS3ObtainK1G1Keys(obj, transferKeys);
        }
        setTimeout(f);
    } else {
        widContinueButtonClick(widGetClosestContinueButton(obj));
    }
}

function widRS3ObtainK1G1Keys(obj, data) {
    var cbFunc = function (cbData, cmdItemIdx, progress) {
        var cbResponse = engGetParsedResponse(cbData);
        var objLed = $('#tokens_rs3_s1_led_div');

        if (cbResponse.message != 'ERROR' && objLed.html() != picRed) {
            objLed.html(picGrn);
            objLed.prop('title', 'Operation successfull.\nPlease, check the results on the Verify tab.');
        } else if (cbResponse.message == 'ERROR' && objLed.html() != picRed) {
            objLed.html(picRed);
            objLed.prop('title', 'Operation error occurred.\nPlease use the \"Verify\" tab for more info\nor try to repeat operation.');
        }
        widShowProgressbar(progress);

        if (glCL.items.length == 0) {
            widDone(obj, 'Operation cancelled by user');
        } else if (cmdItemIdx + 1 < glCL.items.length) {
            widShowTokensLog('Obtaining keys...');
        } else {
            widMainButtonClick(obj, 'OK');
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

function widPrepareToRS3S2(obj, data) {
    widCleanCL();
    glVTL = engGetVTL(glVTL);

    var chk = widGetPasswordState()

        if (chk.message == 'ERROR') {
            widDone(obj, chk.content);
            return;
        }

	var objTokens = $('#tokens_names_textarea');
    var tokens = objTokens.val();
    var rawTransferKeys = $(widGetClosestTextarea(obj)).val();
    var sKey = '12320';

    var kChk = engGetTransferKeysCheckResults(rawTransferKeys, sKey, glCurrentDB.altname);

    if (kChk.message == 'ERROR') {
        widDone(obj, kChk.content);
        return;
    }

    if (tokens == '' || data) {
        var transferKeys = engGetParsedTransferKeys(rawTransferKeys, sKey);
        transferKeys = engGetUpdatedTransferKeys(transferKeys, glPassword, glCurrentDB.hash, glCurrentDB.magic, sKey);
        tokens = engGetParsedTokensList(tokens, glCurrentDB.hash);
        tokens = engGetTokensUpdatedNames(engGetTokensHashedNames(transferKeys), engGetTokensRawNames(tokens));

        widShowUpdatedTokensNames(tokens, objTokens);
        var f = function () {
            widRS3ObtainK2Keys(obj, transferKeys);
        }
        setTimeout(f);
    } else {
        widContinueButtonClick(widGetClosestContinueButton(obj));
    }
}

function widRS3ObtainK2Keys(obj, data) {
    var cbFunc = function (cbData, cmdItemIdx, progress) {

        var cbResponse = engGetParsedResponse(cbData);
        var objLed = $('#tokens_rs3_s2_led_div');

        if (cbResponse.message != 'ERROR' && objLed.html() != picRed) {
            objLed.html(picGrn);
            objLed.prop('title', 'Operation successfull.\nPlease, check the results on the Verify tab.');
        } else if (cbResponse.message == 'ERROR' && objLed.html() != picRed) {
            objLed.html(picRed);
            objLed.prop('title', 'Operation error occurred.\nPlease use the \"Verify\" tab for more info\nor try to repeat operation.');
        }

        widShowProgressbar(progress);

        if (glCL.items.length == 0) {
            widDone(obj, 'Operation cancelled by user');
        } else if (cmdItemIdx + 1 < glCL.items.length) {
            widShowTokensLog('Obtaining keys...');
        } else {
            widMainButtonClick(obj, 'OK');
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

function widPrepareToSS4S1(obj, data) {
    widCleanCL();
    glVTL = engGetVTL(glVTL);

    var chk = widGetPasswordState()

    if (chk.message == 'ERROR') {
        widDone(obj, chk.content);
        return;
    }

    var objTokens = $('#tokens_names_textarea');
    var tokens = objTokens.val();
    var rawTransferKeys = $(widGetClosestTextarea(obj)).val();
    var sKey = '12510';

    var chk = engGetTransferKeysCheckResults(rawTransferKeys, sKey, glCurrentDB.altname);

    if (chk.message == 'ERROR') {
        widDone(obj, chk.content);
        return;
    }

    if (tokens == '' || data) {
        var transferKeys = engGetParsedTransferKeys(rawTransferKeys, sKey);
        transferKeys = engGetUpdatedTransferKeys(transferKeys, glPassword, glCurrentDB.hash, glCurrentDB.magic, sKey);
        tokens = engGetParsedTokensList(tokens, glCurrentDB.hash);
        tokens = engGetTokensUpdatedNames(engGetTokensHashedNames(transferKeys), engGetTokensRawNames(tokens));

        widShowUpdatedTokensNames(tokens, objTokens);
        var f = function () {
            widSS4ObtainO1Keys(obj, transferKeys);
        }
        setTimeout(f);
    } else {
        widContinueButtonClick(widGetClosestContinueButton(obj));
    }
}

function widSS4ObtainO1Keys(obj, data) {
    var cbFunc = function (cbData, cmdItemIdx, progress) {

        var cbResponse = engGetParsedResponse(cbData);
        var objLed = $('#tokens_ss4_s1_led_div');

        if (cbResponse.message != 'ERROR' && objLed.html() != picRed) {
            objLed.html(picGrn);
            objLed.prop('title', 'Operation successfull.\nPlease, check the results on the Verify tab.');
        } else if (cbResponse.message == 'ERROR' && objLed.html() != picRed) {
            objLed.html(picRed);
            objLed.prop('title', 'Operation error occurred.\nPlease use the \"Verify\" tab for more info\nor try to repeat operation.');
        }

        widShowProgressbar(progress);

        if (glCL.items.length == 0) {
            widDone(obj, 'Operation cancelled by user');
        } else if (cmdItemIdx + 1 < glCL.items.length) {
            widShowTokensLog('Obtaining keys...');
        } else {
            widMainButtonClick(obj, 'OK');
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

function widPrepareToSS4S2(obj, data) {
    widCleanCL();
    glVTL = engGetVTL(glVTL);

    var chk = widGetPasswordState()

    if (chk.message == 'ERROR') {
        widDone(obj, chk.content);
        return;
    }

    var objTokens = $('#tokens_names_textarea');
    var tokens = objTokens.val();
    var rawTransferKeys = $(widGetClosestTextarea(obj)).val();
    var sKey = '1242520';

    var chk = engGetTransferKeysCheckResults(rawTransferKeys, sKey, glCurrentDB.altname);

    if (chk.message == 'ERROR') {
        widDone(obj, chk.content);
        return;
    }

    if (tokens == '' || data) {
        var transferKeys = engGetParsedTransferKeys(rawTransferKeys, sKey);
        transferKeys = engGetUpdatedTransferKeys(transferKeys, glPassword, glCurrentDB.hash, glCurrentDB.magic, sKey);
        var tokens = engGetParsedTokensList(tokens, glCurrentDB.hash);
        tokens = engGetTokensUpdatedNames(engGetTokensHashedNames(transferKeys), engGetTokensRawNames(tokens));
        widShowUpdatedTokensNames(tokens, objTokens);
		
        var f = function () {
            widSS4ObtainG2O2Keys(obj, transferKeys);
        }
		
        setTimeout(f);
    } else {
        widContinueButtonClick(widGetClosestContinueButton(obj));
    }
}

function widSS4ObtainG2O2Keys(obj, data) {
    var cbFunc = function (cbData, cmdItemIdx, progress) {
        var cbResponse = engGetParsedResponse(cbData);
        var objLed = $('#tokens_ss4_s2_led_div');

        if (cbResponse.message != 'ERROR' && objLed.html() != picRed) {
            objLed.html(picGrn);
            objLed.prop('title', 'Operation successfull.\nPlease, check the results on the Verify tab.');
        } else if (cbResponse.message == 'ERROR' && objLed.html() != picRed) {
            objLed.html(picRed);
            objLed.prop('title', 'Operation error occurred.\nPlease use the \"Verify\" tab for more info\nor try to repeat operation.');
        }
        widShowProgressbar(progress);

        if (glCL.items.length == 0) {
            widDone(obj, 'Operation cancelled by user');
        } else if (cmdItemIdx + 1 < glCL.items.length) {
            widShowTokensLog('Obtaining keys...');
        } else {
            widMainButtonClick(obj, 'OK');
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

function widPrepareToRS4S1(obj) {
    widCleanCL();
    widCleanRS4();

    var chk = widGetTokensNamesState();

    if (chk.message == 'ERROR') {
        widDone(obj, chk.content);
        return;
    }

    var objTokens = $('#tokens_names_textarea');
	var objLed = $('#tokens_rs4_s1_led_div');
    var tblState = engGetVTLContent(glVTL);

    switch (tblState) {
    case null:
        var tokens = engGetParsedTokensList(objTokens.val(), glCurrentDB.hash);
        var f = function () {
            widVerifyTokens(obj, tokens, widPrepareToRS4S1, false);
        }
        setTimeout(f);
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
            widPrintSendReceiveLed(objLed, true);
            var f = function () {
                widRS4ShowO1Keys(obj, glVTL);
            }
            setTimeout(f);
        } else {
            widPrintSendReceiveLed(objLed, false);
            widDone(obj, 'TOKENS_MISMATCH');
        }
        break;
    }
}

function widRS4ShowO1Keys(obj, data) {
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

        widPrintSendReceiveOut(obj, newRow);
        widShowTokensLog('Generation...');
    }

    var extractKeys = $(widGetClosestTextarea(obj)).val().replace(/[\n|\s]/g, '');
    var lastRow = engGetHash(extractKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '12510';
    widPrintSendReceiveOut(obj, lastRow);
    widMainButtonClick(obj, 'OK');
}

function widPrepareToRS4S2(obj) {
    widCleanCL();
    widCleanRS4();

    var chk = widGetTokensNamesState();

    if (chk.message == 'ERROR') {
        widDone(obj, chk.content);
        return;
    }

	var objTokens = $('#tokens_names_textarea');
    var objLed = $('#tokens_rs4_s2_led_div');
    var tblState = engGetVTLContent(glVTL);

    switch (tblState) {
    case null:
        var tokens = engGetParsedTokensList(objTokens.val(), glCurrentDB.hash);
        var f = function () {
            widVerifyTokens(obj, tokens, widPrepareToRS4S2, false);
        }
        setTimeout(f);
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
            widPrintSendReceiveLed(objLed, true);
            var f = function () {
                widRS4ShowG2O2Keys(obj, glVTL);
            }
            setTimeout(f);
        } else {
            widPrintSendReceiveLed(objLed, false);
            widDone(obj, 'TOKENS_MISMATCH');
        }
        break;
    }
}

function widRS4ShowG2O2Keys(obj, data) {
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

        widPrintSendReceiveOut(obj, newRow);
        widShowTokensLog('Generation...');
    }

    if (newRow.length !== 0) {
        var extractKeys = $(widGetClosestTextarea(obj)).val().replace(/[\n|\s]/g, '');
        var lastRow = engGetHash(extractKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '1242520';
        widPrintSendReceiveOut(obj, lastRow);
    }

    widMainButtonClick(obj, 'OK');
}
