// Hasq Technology Pty Ltd (C) 2013-2015

function widCleanCRL() {
    glCRL.idx = 0;
    glCRL.counter = 100;
    glCRL.items.length = 0;
}

function widCleanVTL() {
    glVTL.items.length = 0;
    glVTL.known = false;
    glVTL.unknown = false;
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

function widTokensIdxOninput(id, data) {
    if ($('#' + id).val() !== '') {
        $('#' + id).val(engGetOnlyNumber(data));
    }
}

function widTokensPasswordOninput(data) {
    glPassword = data;
    widCleanVTL();
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

function widDisableAllTokensOperations(id) {
	var obj = $('#tokens_tabs');	
    obj.tabs('option', 'disabled', true);
    obj.closest('div[id^="tabs"]').find('button, input, textarea').prop('disabled', true);
    $('#' + widGetClosestContinueButtonId(id)).prop('disabled', false);
    $('#' + widGetClosestMainButtonId(id)).prop('disabled', false);
}

function widEnableAllTokensOperations() {
	var obj = $('#tokens_tabs');	
    obj.tabs('enable');
    obj.closest('div[id^="tabs"]').find('button, input, textarea').prop('disabled', false);
}

function widGetTokensNamesCheckResults() {
    var r = {};
    r.message = 'OK';
    r.content = 'OK';

    if ($('#tokens_names_textarea').val() == '') {
        r.message = 'ERROR';
        r.content = 'REQ_TOKENS_BAD';
    } else if (widGetTokensPasswordCheckResults().message == 'ERROR') {
        r.message = 'ERROR';
        r.content = widGetTokensPasswordCheckResults().content;
    }

    return r;
}

function widGetTokensPasswordCheckResults() {
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

function widGetTokensRangeCheckResults() {
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

function widTokensNamesOninput(data) {
	objNamesTextarea = $('#tokens_names_textarea')
    widCleanVTL();
    widCleanAllTabs();
    widShowBordersColor(objNamesTextarea);

    var namesArray = data;


    if (!engIsTokensNamesGood(data, glCurrentDB.hash)) {
        widDisableTokensInput();
        widShowBordersColor(objNamesTextarea, '#FF0000'); //RED BORDER
        widShowTokensLog('Please enter a hashes or raw value in square brackets.');
    } else if (namesArray.length >= 15479) {
        widEnableTokensInput();
        widShowBordersColor(objNamesTextarea, '#FFFF00'); //YELLOW BORDER
        var l = 16511 - namesArray.length;
        objNamesTextarea.prop('title', 'Warning! ' + l + ' chars left.');
        widShowTokensLog();
    } else {
        widEnableTokensInput();
        widShowBordersColor(objNamesTextarea);
        widShowTokensLog();
    }
}

function widTokensAdd(id, data) {
	var objBasename = $('#tokens_basename_input')
	var objFirstIdx = $('#tokens_first_idx_input')
	var objLastIdx = $('#tokens_last_idx_input')
	var objNames = $('#tokens_names_textarea')
	
    var tChk = widGetTokensRangeCheckResults();

    if (tChk.message == 'ERROR') {
        widCancelByEvent(id, tChk.content);
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
        widCancelByEvent(id, 'OK');
    } else {
        widCancelByEvent(id, 'REQ_TOKENS_TOO_MANY');
    }


}

function widSwitchShowHide(id) {
	var obj = $('#' + id);
    if (obj.css('display') === 'none') {
        obj.show();
    } else {
        obj.hide();
    }
}

function widGetWarningsMode(id){
    var label = $('#' + id).button('option', 'label');

    if (label == 'Continue') {
        return true;
    } else {
        return false;
    }
}

function widGetButtonsMode(id) {
    var label = $('#' + id).button('option', 'label');
    var title = document.getElementById(id).dataset.title;
    var cId = widGetClosestContinueButtonId(id);
    var cMode = widGetWarningsMode(cId);

    if (id == cId && cMode) {
        return true;
    } else if (label == title ) {
        return true; // Main button in action-mode is visible
    } else {
        return false; // Cancel is visible
    }
}

function widGetFunctionToRun(id, data) {
    widCleanCRL;
    switch (id) {
    case 'tokens_add_button':
        var f = function () {
            widTokensAdd(id);
        }
        break;
    case 'tokens_create_button':
        var f = function () {
            widPrepareToCreate(id);
        }
        break;
    case 'tokens_verify_button':
        var f = function () {
            widPrepareToVerify(id);
        }
        break;
    case 'tokens_data_update_button':
        var f = function () {
            widPrepareToUpdate(id, data);
        }
        break;
    case 'tokens_ss1_showkeys_button':
        var f = function () {
            widPrepareToSS1ShowK1K2Keys(id);
        }
        break;
    case 'tokens_rs1_obtainkeys_button':
        var f = function () {
            widPrepareToRS1ObtainK1K2Keys(id, data);
        }
        break;
    case 'tokens_ss2_obtainkeys_button':
        var f = function () {
            widPrepareToSS2ObtainG2O2Keys(id, data);
        }
        break;
    case 'tokens_rs2_showkeys_button':
        var f = function () {
            widPrepareToRS2ShowG2O2Keys(id);
        }
        break;
    case 'tokens_ss3_s1_showkeys_button':
        var f = function () {
            widPrepareToSS3ShowK1G1Keys(id);
        }
        break;
    case 'tokens_ss3_s2_showkeys_button':
        var f = function () {
            widPrepareToSS3ShowK2Keys(id);
        }
        break;
    case 'tokens_ss4_s1_obtainkeys_button':
        var f = function () {
            widPrepareToSS4ObtainO1Keys(id, data);
        }
        break;
    case 'tokens_ss4_s2_obtainkeys_button':
        var f = function () {
            widPrepareToSS4ObtainG2O2Keys(id, data);
        }
        break;

    case 'tokens_rs3_s1_obtainkeys_button':
        var f = function () {
            widPrepareToRS3ObtainK1G1Keys(id, data);
        }
        break;
    case 'tokens_rs3_s2_obtainkeys_button':
        var f = function () {
            widPrepareToRS3ObtainK2Keys(id, data);
        }
        break;
    case 'tokens_rs4_s1_showkeys_button':
        var f = function () {
            widPrepareToRS4ShowO1Keys(id);
        }
        break;
    case 'tokens_rs4_s2_showkeys_button':
        var f = function () {
            widPrepareToRS4ShowG2O2Keys(id);
        }
        break;
    default:
        break;
    }
    return f;
}

function widCancelFunction(id, data) {
    if (typeof(data) != 'string') {
        widCleanVTL();
        data = 'CANCELLED_BY_USER';
    } else if (id != 'tokens_verify_button') {
        widCleanVTL();
    }

    widCleanCRL();
    widShowTokensLog(data);
    widEnableAllTokensOperations();
}

function widGetClosestMainButtonId(id) {
    return $('#' + id).closest('div[data-class="div"]').find('button[data-class="main"]').attr('id');
}

function widGetClosestContinueButtonId(id) {
    return $('#' + id).closest('div[data-class="div"]').find('button[data-class="hide"]').attr('id');
}

function widGetClosestWarningMessageId(id) {
    return $('#' + id).closest('div[data-class="div"]').find('td[data-class="hide"]').attr('id');
}

function widGetClosestLedId(id) {
    return $('#' + id).closest('div[data-class="div"]').find('div[id^="_led_"]').attr('id');
}

function widGetClosestTextareaId(id) {
    return $('#' + id).closest('div[data-class="div"]').find('textarea').attr('id');
}

function widSwitchButtonsMode(id) {
	var obj = $('#' + id);
    var dataset = document.getElementById(id).dataset.title;
    var label = obj.button('option', 'label');
    if (label === dataset && dataset === 'Continue') {
        var idM = widGetClosestWarningMessageId(id);
        widSwitchShowHide(id);
        widSwitchShowHide(idM);
        obj.button('option', 'label', 'Hidden');
    } else if (label !== dataset && dataset === 'Continue') {
        obj.button('option', 'label', dataset );
        var idM = widGetClosestWarningMessageId(id);
        widSwitchShowHide(id);
        widSwitchShowHide(idM);
    } else if (label === dataset) {
        obj.button('option', 'label', 'Cancel');
    } else {
        obj.button('option', 'label', dataset);
        var idC = widGetClosestContinueButtonId(id);
        var idM = widGetClosestWarningMessageId(id);
        if (widGetWarningsMode(idC)) {
            $('#' + idC).button('option', 'label', 'Hidden');
            widSwitchShowHide(idC);
            widSwitchShowHide(idM);
        }
    }
}

function widMainButtonClick(id, data) {
    if (widGetButtonsMode(id)) {
        widDisableAllTokensOperations(id);
        var f = widGetFunctionToRun(id);
    } else {
        var f = function(){
            widCancelFunction(id, data);
        }
    }
    widSwitchButtonsMode(id);
    setTimeout(f);
}

function widCancelByEvent(id, data){
    widMainButtonClick(id, data);
}

function widContinueButtonClick(id, data) {
    widSwitchButtonsMode(id);
    var label = $('#' + id).button('option', 'label');
    var idC = widGetClosestContinueButtonId(id);
    if (data === true) {
        var idB = widGetClosestMainButtonId(id);
        var f = widGetFunctionToRun(idB, true);
        setTimeout(f);
    }
}

function widPrepareToCreate(id) {
    widCleanCRL();
    widCleanVTL();

    var inp = 'tokens_names_textarea';
    var tChk = widGetTokensNamesCheckResults();

    if (tChk.message == 'ERROR') {
        widCancelByEvent(id, tChk.content);
        return;
    }

    var tokensSet = engGetParsedTokens($('#' + inp).val(), glCurrentDB.hash);
    widCreateTokens(id, tokensSet);
}

function widCreateTokens(id, tokens) {
    var cbFunc = function (cbData, cmdItemIdx, progress) {
        if (glCRL.items.length == 0) {
            return;
        }

        widShowProgressbar(progress);

        var cbResponse = engGetParsedResponse(cbData);

        if (cbResponse.message == 'ERROR') {
            widCancelByEvent(id, cbResponse.content);
        } else if (cmdItemIdx + 1 < glCRL.items.length) {
            widShowTokensLog('Creating... ');
        } else {
            widMainButtonClick(id, 'OK');
        }
    }

    for (var i = 0; i < tokens.length; i++) {
        var r = engGetNewRecord(0, tokens[i].s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);
        var zCmd = 'z * ' + glCurrentDB.name + ' 0 ' + tokens[i].s + ' ' + r.k + ' ' + r.g + ' ' + r.o + ' ';
        var lastCmd = 'last ' + glCurrentDB.name + ' ' + tokens[i].s;
        var zCmdIdx = (i == 0) ? 0 : i * 2;
        var lastCmdIdx = zCmdIdx + 1;

        glCRL.items[zCmdIdx] = {};
        glCRL.items[zCmdIdx].cmd = zCmd;
        glCRL.items[zCmdIdx].rawS = tokens[i].rawS;
        glCRL.items[zCmdIdx].s = tokens[i].s;
        glCRL.items[lastCmdIdx] = {};
        glCRL.items[lastCmdIdx].cmd = lastCmd;
        glCRL.items[lastCmdIdx].rawS = tokens[i].rawS;
        glCRL.items[lastCmdIdx].s = tokens[i].s;
    }

    engRunCRL(glCRL, cbFunc);
}

function widPrepareToVerify(id, data) {
    widCleanCRL();
    widCleanVTL();
    widCleanVerifyTab();

    var tChk = widGetTokensNamesCheckResults();

    if (tChk.message == 'ERROR') {
        widCancelByEvent(id, tChk.content);
        return;
    }

    var inp = 'tokens_names_textarea';
    var hid = 'tokens_verify_hidden_div';

    $('#' + hid).css('display', 'block');
    var tokensSet = engGetParsedTokens($('#' + inp).val(), glCurrentDB.hash);

    widVerifyTokens(id, tokensSet, null, null);
}

function widPrintVerifyTableRow(data, pic) {
    var table = 'tokens_verify_table';
    $('#' + table).append(widGetHTMLTr(widGetHTMLTd(pic + data.message) + widGetHTMLTd(data.rawS) + widGetHTMLTd(data.s) + widGetHTMLTd(data.n) + widGetHTMLTd(data.d)));
}

function widGetVerifyRowLed(data) {
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

function widPrintVerifyMainLed(data) {
    var obj = $('#tokens_verify_led_div');

    if (data && obj.outerHTML != picRed) {
        obj.html(picRed);
        obj.prop('title', 'TOKENS MISMATCH DETECTED');
    } else if (obj.outerHTML != picGrn) {
        obj.html(picGrn);
        obj.prop('title', 'OK');
    }
}

function widVerifyTokens(id, tokens, nextFunc, nextFuncData) {
    var cbFunc = function (cbData, cmdItemIdx, progress) {
        if (glCRL.items.length == 0) {
            return;
        }

        var cbResponse = engGetParsedResponse(cbData);

        if (cbResponse.message == 'ERROR') {
            widCancelByEvent(id, cbResponse.content);
            return;
        }

        widShowProgressbar(progress);

        cbData = cbData.replace(/^\s+|\s+$/g, '');
        glVTL = engAddVTLItem(cbData, cmdItemIdx, glVTL, glCRL.items);

        var idx = glVTL.items.length - 1;
        var pic = widGetVerifyRowLed(glVTL.items[idx].message);

        if (nextFunc == null) {
            widPrintVerifyTableRow(glVTL.items[idx], pic);
            widPrintVerifyMainLed(glVTL.unknown);
        }

        if (cmdItemIdx + 1 < glCRL.items.length) {
            widShowTokensLog('Verifying...');
        } else if (nextFunc != null) {
            widShowTokensLog('Verified tokens list is ready.');
            widCleanCRL();
            var f = (nextFuncData === null) ? function () {
                nextFunc(id);
            }
             : function () {
                nextFunc(id, nextFuncData);
            }
            setTimeout(f);
        } else {
            widMainButtonClick(id, 'OK');
        }
    }

    for (var i = 0; i < tokens.length; i++) {
        var lastCmd = 'last ' + glCurrentDB.name + ' ' + tokens[i].s;
        glCRL.items[i] = {};
        glCRL.items[i].cmd = lastCmd;
        glCRL.items[i].rawS = tokens[i].rawS;
        glCRL.items[i].s = tokens[i].s;
    }

    engRunCRL(glCRL, cbFunc);
}

function widPrepareToUpdate(id, data) {
    widCleanCRL();

    var tChk = widGetTokensNamesCheckResults();
    var tblState = engCheckVTL(glVTL);

    switch (tblState) {
    case true:
        var d = $('#' + 'tokens_data_newdata_input').val();
        if (d == '') {
            widCancelByEvent(id, 'REQ_BAD_NEWDATA');
            return;
        } else {
            widUpdateTokens(id, d);
        }
        break;
    case false:
        widCancelByEvent(id, 'TOKENS_MISMATCH');
        break;
    case undefined:
        var d = $('#' + 'tokens_data_newdata_input').val();
        if (d == '') {
            widCancelByEvent(id, 'REQ_BAD_NEWDATA');
        } else if (data === true) {
            widUpdateTokens(id, d);
        } else {
            var idC = widGetClosestContinueButtonId(id);
            widContinueButtonClick(idC);
        }
        break;
    default:
        var d = $('#' + 'tokens_data_newdata_input').val();

        if (tChk.message == 'ERROR') {
            widCancelByEvent(id, tChk.content);
            return;
        } else if (d == '') {
            widCancelByEvent(id, 'REQ_BAD_NEWDATA');
            return;
        }

        var inp = $('#' + 'tokens_names_textarea').val();
        var tokensSet = engGetParsedTokens(inp, glCurrentDB.hash);
        var f = function () {
            widVerifyTokens(id, tokensSet, widPrepareToUpdate, false);
        }

        setTimeout(f);

        break;
    }
}

function widUpdateTokens(id, data) {
    var cbFunc = function (cbData, cmdItemIdx, progress) {
        if (glCRL.items.length === 0) {
            widCancelByEvent(id, cbData);
            return;
        }

        widShowProgressbar(progress);

        var cbResponse = engGetParsedResponse(cbData);

        if (cbResponse.message === 'ERROR') {
            widCancelByEvent(id, cbResponse.content);
        } else if (cmdItemIdx + 1 < glCRL.items.length) {
            widShowTokensLog('Update data... ');
        } else {
            widCancelByEvent(id, 'OK');
        }
    }

    for (var i = 0; i < glVTL.items.length; i++) {
        if (glVTL.items[i].message == 'OK' && glVTL.items[i].d != data) {

            var n = +glVTL.items[i].n + 1; //new records number;
            var s = engGetHash(glVTL.items[i].rawS, glCurrentDB.hash);
            var r = engGetNewRecord(n, s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);
            var addCmd = 'add *' + ' ' + glCurrentDB.name + ' ' + n + ' ' + s + ' ' + r.k + ' ' + r.g + ' ' + r.o + ' ' + data;
            var lastCmd = 'last' + ' ' + glCurrentDB.name + ' ' + s;
            var idx = (glCRL.items.length == 0) ? 0 : glCRL.items.length;

            glCRL.items[idx] = {};
            glCRL.items[idx].cmd = addCmd;
            glCRL.items[idx].rawS = glVTL.items[i].rawS;
            glCRL.items[idx].s = glVTL.items[i].s;

            idx++;

            glCRL.items[idx] = {};
            glCRL.items[idx].cmd = lastCmd;
            glCRL.items[idx].rawS = glVTL.items[i].rawS;
            glCRL.items[idx].s = glVTL.items[i].s;
        }
    }
    engRunCRL(glCRL, cbFunc);
}

function widPrintSendReceiveOut(id, data){
    var idOut = widGetClosestTextareaId(id);
    if (data != '') {
        $('#' + idOut).val($('#' + idOut).val() + data);
    }
}

function widPrintSendReceiveLed(id, data) {
	var obj = $('#' + id);
    if (data) {
        obj.html(picGrn);
        obj.prop('title', 'OK');
    } else {
        obj.html(picRed);
        obj.prop('title', 'MISMATCHED TOKENS DETECTED');
    }
}

function widPrepareToSS1ShowK1K2Keys(id) {
    widCleanCRL();
    widCleanSS1();

    var tChk = widGetTokensNamesCheckResults();

    if (tChk.message == 'ERROR') {
        widCancelByEvent(id, tChk.content);
        return;
    }

    var led = 'tokens_ss1_led_div';
    var tblState = engCheckVTL(glVTL);

    switch (tblState) {
    case true:
        widPrintSendReceiveLed(led, true);
        var f = function () {
            widSS1ShowK1K2Keys(id, glVTL);
        }
        setTimeout(f);
        break;
    case false:
        widPrintSendReceiveLed(led, false);
        widCancelByEvent(id, 'TOKENS_MISMATCH');
        break;
    case undefined:
        widPrintSendReceiveLed(led, false);
        var f = function () {
            widSS1ShowK1K2Keys(id, glVTL);
        }
        setTimeout(f);
        break;
    default:
        var idInp = 'tokens_names_textarea';
        var tokensSet = engGetParsedTokens($('#' + idInp).val(), glCurrentDB.hash);
        var f = function () {
            widVerifyTokens(id, tokensSet, widPrepareToSS1ShowK1K2Keys, false);
        }
        setTimeout(f);
        break;
    }
}

function widSS1ShowK1K2Keys(id, data) {
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

        widPrintSendReceiveOut(id, newRow);
        widShowTokensLog('Generation...');
    }

    var extractKeys = $('#' + widGetClosestTextareaId(id)).val().replace(/[\n|\s]/g, '');
    var lastRow = engGetHash(extractKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '123132';
    widPrintSendReceiveOut(id, lastRow);
    widMainButtonClick(id, 'OK');
}

function widPrintUpdatedTokensNames(arr, id) {
	var obj = $('#' + id);
    for (var i = 0; i < arr.length; i++) {
        if (i == 0) {
            obj.val(arr[i]);
        } else {
            obj.val(obj.val() + ' ' + arr[i]);
        }
    }
}

function widPrepareToRS1ObtainK1K2Keys(id, data) {
    widCleanCRL();
    widCleanVTL();
    widCleanRS1();

    var pChk = widGetTokensPasswordCheckResults()

    if (pChk.message == 'ERROR') {
        widCancelByEvent(id, pChk.content);
        return;
    }

    var idInp = 'tokens_names_textarea';
    var rawTokens = $('#' + idInp).val();
    var rawTransferKeys = $('#' + widGetClosestTextareaId(id)).val();
    var sKey = '123132';

    var kChk = engGetKeysSetCheckResults(rawTransferKeys, glCurrentDB.altname, sKey);

    if (kChk.message == 'ERROR') {
        widCancelByEvent(id, kChk.content);
        return;
    }

    if (rawTokens == '' || data ) {
        var transferKeys = engGetParsedTransferKeys(rawTransferKeys, sKey);
        transferKeys = engGetUpdatedTransferKeys(transferKeys, glPassword, glCurrentDB.hash, glCurrentDB.magic, sKey);
        var tokens = engGetParsedTokens(rawTokens, glCurrentDB.hash);
        tokens = engGetTokensUpdatedNames(engGetTokensHashedNames(transferKeys), engGetTokensRawNames(tokens));

        widPrintUpdatedTokensNames(tokens, idInp);
        var f = function () {
            widRS1ObtainK1K2Keys(id, transferKeys);
        }
        setTimeout(f);
    } else {
        var idC = widGetClosestContinueButtonId(id);
        widContinueButtonClick(idC);
    }
}

function widRS1ObtainK1K2Keys(id, data) {
    var cbFunc = function (cbData, cmdItemIdx, progress) {
        var cbResponse = engGetParsedResponse(cbData);
		var objL = $('#tokens_rs1_led_div');
		
        if (cbResponse.message != 'ERROR' && objL.html() != picRed) {
            objL.html(picGrn);
            objL.prop('title', 'Operation successfull.\nPlease, check the results on the Verify tab.');
        } else if (cbResponse.message == 'ERROR' && objL.html() != picRed) {
            objL.html(picRed);
            objL.prop('title', 'Operation error occurred.\nPlease use the \"Verify\" tab for more info\nor try to repeat operation.');
        }

        widShowProgressbar(progress);

        if (glCRL.items.length == 0) {
            widCancelByEvent(id, 'CANCELLED_BY_USER');
        } else if (cmdItemIdx + 1 < glCRL.items.length) {
            widShowTokensLog('Obtaining keys...');
        } else {
            widMainButtonClick(id, 'OK');
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

        glCRL.items[idx] = {};
        glCRL.items[idx].cmd = addCmd1;
        glCRL.items[idx].s = s;
        glCRL.items[idx].rawS = '';

        idx++;

        glCRL.items[idx] = {};
        glCRL.items[idx].cmd = addCmd2;
        glCRL.items[idx].s = s;
        glCRL.items[idx].rawS = '';

    }

    engRunCRL(glCRL, cbFunc);
}

function widPrepareToSS2ObtainG2O2Keys(id, data) {
    widCleanCRL();
    widCleanVTL();
    widCleanSS2();

    var pChk = widGetTokensPasswordCheckResults()

    if (pChk.message == 'ERROR') {
        widCancelByEvent(id, pChk.content);
        return;
    }

    var idInp = 'tokens_names_textarea';
    var rawTokens = $('#' + idInp).val();
    var rawTransferKeys = $('#' + widGetClosestTextareaId(id)).val();
    var sKey = '124252';
    var kChk = engGetKeysSetCheckResults(rawTransferKeys, glCurrentDB.altname, sKey);

    if (kChk.message == 'ERROR') {
        widCancelByEvent(id, kChk.content);
        return;
    }

    if (rawTokens == '' || data ) {
        var transferKeys = engGetParsedTransferKeys(rawTransferKeys, sKey);
        transferKeys = engGetUpdatedTransferKeys(transferKeys, glPassword, glCurrentDB.hash, glCurrentDB.magic, sKey);

        var tokens = engGetParsedTokens(rawTokens, glCurrentDB.hash);
        tokens = engGetTokensUpdatedNames(engGetTokensHashedNames(transferKeys), engGetTokensRawNames(tokens));

        widPrintUpdatedTokensNames(tokens, idInp);

        var f = function () {
            widSS2ObtainG2O2Keys(id, transferKeys);
        }
        setTimeout(f);
    } else {
        var idC = widGetClosestContinueButtonId(id);
        widContinueButtonClick(idC);
    }
}

function widSS2ObtainG2O2Keys(id, data) {
    var cbFunc = function (cbData, cmdItemIdx, progress) {
        var cbResponse = engGetParsedResponse(cbData);
		var objL = $('#tokens_ss2_led_div');
		
        if (cbResponse.message != 'ERROR' && objL.html() != picRed) {
            objL.html(picGrn);
            objL.prop('title', 'Operation successfull.\nPlease, check the results on the Verify tab.');
        } else if (cbResponse.message == 'ERROR' && objL.html() != picRed) {
            objL.html(picRed);
            objL.prop('title', 'Operation error occurred.\nPlease use the \"Verify\" tab for more info\nor try to repeat operation.');
        }

        widShowProgressbar(progress);

        if (glCRL.items.length == 0) {
            widCancelByEvent(id, 'CANCELLED_BY_USER');
        } else if (cmdItemIdx + 1 < glCRL.items.length) {
            widShowTokensLog('Obtaining keys...');
        } else {
            widMainButtonClick(id, 'OK');
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

        glCRL.items[idx] = {};
        glCRL.items[idx].cmd = addCmd1;
        glCRL.items[idx].s = s;
        glCRL.items[idx].rawS = '';

        idx++;

        glCRL.items[idx] = {};
        glCRL.items[idx].cmd = addCmd2;
        glCRL.items[idx].s = s;
        glCRL.items[idx].rawS = '';
    }

    engRunCRL(glCRL, cbFunc);
}

function widPrepareToRS2ShowG2O2Keys(id) {
    widCleanCRL();
    widCleanRS2();

    var tChk = widGetTokensNamesCheckResults();

    if (tChk.message == 'ERROR') {
        widCancelByEvent(id, tChk.content);
        return;
    }

    var led = 'tokens_rs2_led_div';
    var tblState = engCheckVTL(glVTL);

    switch (tblState) {
    case null:
        var idInp = 'tokens_names_textarea';
        var tokens = engGetParsedTokens($('#' + idInp).val(), glCurrentDB.hash);
        var f = function () {
            widVerifyTokens(id, tokens, widPrepareToRS2ShowG2O2Keys, false);
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
            widPrintSendReceiveLed(led, true);
            var f = function () {
                widRS2ShowG2O2Keys(id, glVTL);
            }
            setTimeout(f);
        } else {
            widPrintSendReceiveLed(led, false);
            widCancelByEvent(id, 'TOKENS_MISMATCH');
        }
        break;
    }
}

function widRS2ShowG2O2Keys(id, data) {
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

        widPrintSendReceiveOut(id, newRow);
        widShowTokensLog('Generation...');
    }

    idOut = widGetClosestTextareaId(id);
    var extractKeys = $('#' + widGetClosestTextareaId(id)).val().replace(/[\n|\s]/g, '');
    var lastRow = engGetHash(extractKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '124252';
    widPrintSendReceiveOut(id, lastRow);
    widMainButtonClick(id, 'OK');
}

function widPrepareToSS3ShowK1G1Keys(id) {
    widCleanCRL();
    widCleanSS3();

    var tChk = widGetTokensNamesCheckResults();

    if (tChk.message == 'ERROR') {
        widCancelByEvent(id, tChk.content);
        return;
    }

    var led = 'tokens_ss3_s1_led_div';
    var tblState = engCheckVTL(glVTL);

    switch (tblState) {
    case true:
        widPrintSendReceiveLed(led, true);
        var f = function () {
            widSS3ShowK1G1Keys(id, glVTL);
        }
        setTimeout(f);
        break;
    case false:
        widPrintSendReceiveLed(led, false);
        widCancelByEvent(id, 'TOKENS_MISMATCH');
        break;
    case undefined:
        widPrintSendReceiveLed(led, false);
        var f = function () {
            widSS3ShowK1G1Keys(id, glVTL);
        }
        setTimeout(f);
        break;
    default:
        var idInp = 'tokens_names_textarea';
        var tokensSet = engGetParsedTokens($('#' + idInp).val(), glCurrentDB.hash);
        var f = function () {
            widVerifyTokens(id, tokensSet, widPrepareToSS3ShowK1G1Keys, false);
        }
        setTimeout(f);
        break;
    }
}

function widSS3ShowK1G1Keys(id, data) {
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

        widPrintSendReceiveOut(id, newRow);
        widShowTokensLog('Generation...');
    }

    idOut = widGetClosestTextareaId(id);
    var extractKeys = $('#' + widGetClosestTextareaId(id)).val().replace(/[\n|\s]/g, '');
    var lastRow = engGetHash(extractKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '123141';
    widPrintSendReceiveOut(id, lastRow);
    widMainButtonClick(id, 'OK');
}

function widPrepareToSS3ShowK2Keys(id) {
    widCleanCRL();
    widCleanSS3();

    var tChk = widGetTokensNamesCheckResults();

    if (tChk.message == 'ERROR') {
        widCancelByEvent(id, tChk.content);
        return;
    }

    var led = 'tokens_ss3_s2_led_div';
    var tblState = engCheckVTL(glVTL);

    switch (tblState) {
    case null:
        var idInp = 'tokens_names_textarea';
        var tokens = engGetParsedTokens($('#' + idInp).val(), glCurrentDB.hash);
        var f = function () {
            widVerifyTokens(id, tokens, widPrepareToSS3ShowK2Keys, false);
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
            widPrintSendReceiveLed(led, true);
            var f = function () {
                widSS3ShowK2Keys(id, glVTL);
            }
            setTimeout(f);
        } else {
            widPrintSendReceiveLed(led, false);
            widCancelByEvent(id, 'TOKENS_MISMATCH');
        }
        break;
    }
}

function widSS3ShowK2Keys(id, data) {
    for (var i = 0; i < data.items.length; i++) {
        widShowProgressbar(100 * (i + 1) / data.items.length);
        if (data.items[i].message != 'IDX_NODN' && data.items[i].n !== 0) {
            var r = data.items[i];
            var n0 = r.n - 1;
            var n2 = r.n + 1;
            var k2 = engGetKey(n2, r.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
            var newRow = n0  + ' ' + r.s + ' ' + k2 + '\n';
        } else {
            var newRow = '';
        }

        widPrintSendReceiveOut(id, newRow);
        widShowTokensLog('Generation...');
    }

    if (newRow.length !== 0) {
        var extractKeys = $('#' + widGetClosestTextareaId(id)).val().replace(/[\n|\s]/g, '');
        var lastRow = engGetHash(extractKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '1232';
        widPrintSendReceiveOut(id, lastRow);
    }

    widMainButtonClick(id, 'OK');
}

function widPrepareToRS3ObtainK1G1Keys(id, data) {
    widCleanCRL();
    widCleanVTL();

    var pChk = widGetTokensPasswordCheckResults()

    if (pChk.message == 'ERROR') {
        widCancelByEvent(id, pChk.content);
        return;
    }

    var idInp = 'tokens_names_textarea';
    var rawTokens = $('#' + idInp).val();
    var rawTransferKeys = $('#' + widGetClosestTextareaId(id)).val();
    var sKey = '123141';

    var kChk = engGetKeysSetCheckResults(rawTransferKeys, glCurrentDB.altname, sKey);

    if (kChk.message == 'ERROR') {
        widCancelByEvent(id, kChk.content);
        return;
    }

    if (rawTokens == '' || data ) {
        var transferKeys = engGetParsedTransferKeys(rawTransferKeys, sKey);
        transferKeys = engGetUpdatedTransferKeys(transferKeys, glPassword, glCurrentDB.hash, glCurrentDB.magic, sKey);
        var tokens = engGetParsedTokens(rawTokens, glCurrentDB.hash);
        tokens = engGetTokensUpdatedNames(engGetTokensHashedNames(transferKeys), engGetTokensRawNames(tokens));
        widPrintUpdatedTokensNames(tokens, idInp);
        var f = function () {
            widRS3ObtainK1G1Keys(id, transferKeys);
        }
        setTimeout(f);
    } else {
        var idC = widGetClosestContinueButtonId(id);
        widContinueButtonClick(idC);
    }
}

function widRS3ObtainK1G1Keys(id, data) {
    var cbFunc = function (cbData, cmdItemIdx, progress) {
        var cbResponse = engGetParsedResponse(cbData);
		var objL = $('#tokens_rs3_s1_led_div');
		
        if (cbResponse.message != 'ERROR' && objL.html() != picRed) {
            objL.html(picGrn);
            objL.prop('title', 'Operation successfull.\nPlease, check the results on the Verify tab.');
        } else if (cbResponse.message == 'ERROR' && objL.html() != picRed) {
            objL.html(picRed);
            objL.prop('title', 'Operation error occurred.\nPlease use the \"Verify\" tab for more info\nor try to repeat operation.');
        }
        widShowProgressbar(progress);

        if (glCRL.items.length == 0) {
            widCancelByEvent(id, 'CANCELLED_BY_USER');
        } else if (cmdItemIdx + 1 < glCRL.items.length) {
            widShowTokensLog('Obtaining keys...');
        } else {
            widMainButtonClick(id, 'OK');
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

        glCRL.items[i] = {};
        glCRL.items[i].cmd = addCmd;
        glCRL.items[i].s = s;
        glCRL.items[i].rawS = '';
    }

    engRunCRL(glCRL, cbFunc);
}

function widPrepareToRS3ObtainK2Keys(id, data) {
    widCleanCRL();
    widCleanVTL();

    var pChk = widGetTokensPasswordCheckResults()

    if (pChk.message == 'ERROR') {
        widCancelByEvent(id, pChk.content);
        return;
    }

    var idInp = 'tokens_names_textarea';
    var rawTokens = $('#' + idInp).val();
    var rawTransferKeys = $('#' + widGetClosestTextareaId(id)).val();
    var sKey = '1232';

    var kChk = engGetKeysSetCheckResults(rawTransferKeys, glCurrentDB.altname, sKey);

    if (kChk.message == 'ERROR') {
        widCancelByEvent(id, kChk.content);
        return;
    }

    if (rawTokens == '' || data ) {
        var transferKeys = engGetParsedTransferKeys(rawTransferKeys, sKey);
        transferKeys = engGetUpdatedTransferKeys(transferKeys, glPassword, glCurrentDB.hash, glCurrentDB.magic, sKey);
        var tokens = engGetParsedTokens(rawTokens, glCurrentDB.hash);
        tokens = engGetTokensUpdatedNames(engGetTokensHashedNames(transferKeys), engGetTokensRawNames(tokens));

        widPrintUpdatedTokensNames(tokens, idInp);
        var f = function () {
            widRS3ObtainK2Keys(id, transferKeys);
        }
        setTimeout(f);
    } else {
        var idC = widGetClosestContinueButtonId(id);
        widContinueButtonClick(idC);
    }
}

function widRS3ObtainK2Keys(id, data) {
    var cbFunc = function (cbData, cmdItemIdx, progress) {

        var cbResponse = engGetParsedResponse(cbData);
		var objL = $('#tokens_rs3_s2_led_div');
		
        if (cbResponse.message != 'ERROR' && objL.html() != picRed) {
            objL.html(picGrn);
            objL.prop('title', 'Operation successfull.\nPlease, check the results on the Verify tab.');
        } else if (cbResponse.message == 'ERROR' && objL.html() != picRed) {
            objL.html(picRed);
            objL.prop('title', 'Operation error occurred.\nPlease use the \"Verify\" tab for more info\nor try to repeat operation.');
        }

        widShowProgressbar(progress);

        if (glCRL.items.length == 0) {
            widCancelByEvent(id, 'CANCELLED_BY_USER');
        } else if (cmdItemIdx + 1 < glCRL.items.length) {
            widShowTokensLog('Obtaining keys...');
        } else {
            widMainButtonClick(id, 'OK');
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

        glCRL.items[i] = {};
        glCRL.items[i].cmd = addCmd;
        glCRL.items[i].s = s;
        glCRL.items[i].rawS = '';

    }

    engRunCRL(glCRL, cbFunc);
}


function widPrepareToSS4ObtainO1Keys(id, data) {
    widCleanCRL();
    widCleanVTL();

    var pChk = widGetTokensPasswordCheckResults()

    if (pChk.message == 'ERROR') {
        widCancelByEvent(id, pChk.content);
        return;
    }

    var idInp = 'tokens_names_textarea';
    var rawTokens = $('#' + idInp).val();
    var rawTransferKeys = $('#' + widGetClosestTextareaId(id)).val();
    var sKey = '1251';

    var kChk = engGetKeysSetCheckResults(rawTransferKeys, glCurrentDB.altname, sKey);

    if (kChk.message == 'ERROR') {
        widCancelByEvent(id, kChk.content);
        return;
    }

    if (rawTokens == '' || data ) {
        var transferKeys = engGetParsedTransferKeys(rawTransferKeys, sKey);
        transferKeys = engGetUpdatedTransferKeys(transferKeys, glPassword, glCurrentDB.hash, glCurrentDB.magic, sKey);
        var tokens = engGetParsedTokens(rawTokens, glCurrentDB.hash);
        tokens = engGetTokensUpdatedNames(engGetTokensHashedNames(transferKeys), engGetTokensRawNames(tokens));

        widPrintUpdatedTokensNames(tokens, idInp);
        var f = function () {
            widSS4ObtainO1Keys(id, transferKeys);
        }
        setTimeout(f);
    } else {
        var idC = widGetClosestContinueButtonId(id);
        widContinueButtonClick(idC);
    }
}

function widSS4ObtainO1Keys(id, data) {
    var cbFunc = function (cbData, cmdItemIdx, progress) {

        var cbResponse = engGetParsedResponse(cbData);
        var objL = $('#tokens_ss4_s1_led_div' + idLed);
		
        if (cbResponse.message != 'ERROR' && objL.html() != picRed) {
            objL.html(picGrn);
            objL.prop('title', 'Operation successfull.\nPlease, check the results on the Verify tab.');
        } else if (cbResponse.message == 'ERROR' && objL.html() != picRed) {
            objL.html(picRed);
            objL.prop('title', 'Operation error occurred.\nPlease use the \"Verify\" tab for more info\nor try to repeat operation.');
        }

        widShowProgressbar(progress);

        if (glCRL.items.length == 0) {
            widCancelByEvent(id, 'CANCELLED_BY_USER');
        } else if (cmdItemIdx + 1 < glCRL.items.length) {
            widShowTokensLog('Obtaining keys...');
        } else {
            widMainButtonClick(id, 'OK');
        }
    }

    for (var i = 0; i < data.length; i++) {
        var n1 = data[i].n1;
        var s = data[i].s;
        var k1 = data[i].k1;
        var g1 = data[i].g1;
        var o1 = data[i].o1;
        var addCmd = 'add * ' + glCurrentDB.name + ' ' + n1 + ' ' + s + ' ' + k1 + ' ' + g1 + ' ' + o1;

        glCRL.items[i] = {};
        glCRL.items[i].cmd = addCmd;
        glCRL.items[i].s = s;
        glCRL.items[i].rawS = '';

    }

    engRunCRL(glCRL, cbFunc);
}

function widPrepareToSS4ObtainG2O2Keys(id, data) {
    widCleanCRL();
    widCleanVTL();

    var pChk = widGetTokensPasswordCheckResults()

    if (pChk.message == 'ERROR') {
        widCancelByEvent(id, pChk.content);
        return;
    }

    var idInp = 'tokens_names_textarea';
    var rawTokens = $('#' + idInp).val();
    var rawTransferKeys = $('#' + widGetClosestTextareaId(id)).val();
    var sKey = '124252';

    var kChk = engGetKeysSetCheckResults(rawTransferKeys, glCurrentDB.altname, sKey);

    if (kChk.message == 'ERROR') {
        widCancelByEvent(id, kChk.content);
        return;
    }

    if (rawTokens == '' || data ) {
        var transferKeys = engGetParsedTransferKeys(rawTransferKeys, sKey);
        transferKeys = engGetUpdatedTransferKeys(transferKeys, glPassword, glCurrentDB.hash, glCurrentDB.magic, sKey);
        var tokens = engGetParsedTokens(rawTokens, glCurrentDB.hash);
        tokens = engGetTokensUpdatedNames(engGetTokensHashedNames(transferKeys), engGetTokensRawNames(tokens));
        widPrintUpdatedTokensNames(tokens, idInp);
        var f = function () {
            widSS4ObtainG2O2Keys(id, transferKeys);
        }
        setTimeout(f);
    } else {
        var idC = widGetClosestContinueButtonId(id);
        widContinueButtonClick(idC);
    }
}

function widSS4ObtainG2O2Keys(id, data) {
    var cbFunc = function (cbData, cmdItemIdx, progress) {
        var cbResponse = engGetParsedResponse(cbData);
		var objL = $('#tokens_ss4_s2_led_div');
		
        if (cbResponse.message != 'ERROR' && objL.html() != picRed) {
            objL.html(picGrn);
            objL.prop('title', 'Operation successfull.\nPlease, check the results on the Verify tab.');
        } else if (cbResponse.message == 'ERROR' && objL.html() != picRed) {
            objL.html(picRed);
            objL.prop('title', 'Operation error occurred.\nPlease use the \"Verify\" tab for more info\nor try to repeat operation.');
        }
        widShowProgressbar(progress);

        if (glCRL.items.length == 0) {
            widCancelByEvent(id, 'CANCELLED_BY_USER');
        } else if (cmdItemIdx + 1 < glCRL.items.length) {
            widShowTokensLog('Obtaining keys...');
        } else {
            widMainButtonClick(id, 'OK');
        }
    }

    for (var i = 0; i < data.length; i++) {
        var n2 = data[i].n2;
        var s = data[i].s;
        var k2 = data[i].k2;
        var g2 = data[i].g2;
        var o2 = data[i].o2;

        var addCmd = 'add * ' + glCurrentDB.name + ' ' + n2 + ' ' + s + ' ' + k2 + ' ' + g2 + ' ' + o2;

        glCRL.items[i] = {};
        glCRL.items[i].cmd = addCmd;
        glCRL.items[i].s = s;
        glCRL.items[i].rawS = '';
    }

    engRunCRL(glCRL, cbFunc);
}


function widPrepareToRS4ShowO1Keys(id) {
    widCleanCRL();
    widCleanRS4();

    var tChk = widGetTokensNamesCheckResults();

    if (tChk.message == 'ERROR') {
        widCancelByEvent(id, tChk.content);
        return;
    }

    var led = 'tokens_rs4_s1_led_div';
    var tblState = engCheckVTL(glVTL);

    switch (tblState) {
    case null:
        var idInp = 'tokens_names_textarea';
        var tokens = engGetParsedTokens($('#' + idInp).val(), glCurrentDB.hash);
        var f = function () {
            widVerifyTokens(id, tokens, widPrepareToRS4ShowO1Keys, false);
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
            widPrintSendReceiveLed(led, true);
            var f = function () {
                widRS4ShowO1Keys(id, glVTL);
            }
            setTimeout(f);
        } else {
            widPrintSendReceiveLed(led, false);
            widCancelByEvent(id, 'TOKENS_MISMATCH');
        }
        break;
    }
}

function widRS4ShowO1Keys(id, data) {
    for (var i = 0; i < data.items.length; i++) {
        widShowProgressbar(100 * (i + 1) / data.items.length);
        if (data.items[i].message != 'IDX_NODN') {
            var r = data.items[i];
            var n0 = r.n;
            var k3 = engGetKey(n0 + 3, r.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
            var g2 = engGetKey(n0 + 3, r.s, k3, glCurrentDB.magic, glCurrentDB.hash);
            var o1 = engGetKey(n0 + 2, r.s, g2, glCurrentDB.magic, glCurrentDB.hash);
            var newRow = r.n  + ' ' + r.s + ' ' + o1 + '\n';
        } else {
            var newRow = '';
        }

        widPrintSendReceiveOut(id, newRow);
        widShowTokensLog('Generation...');
    }

    var extractKeys = $('#' + widGetClosestTextareaId(id)).val().replace(/[\n|\s]/g, '');
    var lastRow = engGetHash(extractKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '1251';
    widPrintSendReceiveOut(id, lastRow);
    widMainButtonClick(id, 'OK');
}

function widPrepareToRS4ShowG2O2Keys(id) {
    widCleanCRL();
    widCleanRS4();

    var tChk = widGetTokensNamesCheckResults();

    if (tChk.message == 'ERROR') {
        widCancelByEvent(id, tChk.content);
        return;
    }

    var led = 'tokens_rs4_s2_led_div';
    var tblState = engCheckVTL(glVTL);

    switch (tblState) {
    case null:
        var idInp = 'tokens_names_textarea';
        var tokens = engGetParsedTokens($('#' + idInp).val(), glCurrentDB.hash);
        var f = function () {
            widVerifyTokens(id, tokens, widPrepareToRS4ShowG2O2Keys, false);
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
            widPrintSendReceiveLed(led, true);
            var f = function () {
                widRS4ShowG2O2Keys(id, glVTL);
            }
            setTimeout(f);
        } else {
            widPrintSendReceiveLed(led, false);
            widCancelByEvent(id, 'TOKENS_MISMATCH');
        }
        break;
    }
}

function widRS4ShowG2O2Keys(id, data) {
    for (var i = 0; i < data.items.length; i++) {
        widShowProgressbar(100 * (i + 1) / data.items.length);
        if (data.items[i].message != 'IDX_NODN' && data.items[i].n !== 0) {
            var r = data.items[i];
            var n0 = r.n - 1;
            var k3 = engGetKey(n0 + 3, r.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
            var g2 = engGetKey(n0 + 3, r.s, k3, glCurrentDB.magic, glCurrentDB.hash);//
            var k4 = engGetKey(n0 + 4, r.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
            var g3 = engGetKey(n0 + 4, r.s, k4, glCurrentDB.magic, glCurrentDB.hash);
            var o2 = engGetKey(n0 + 3, r.s, g3, glCurrentDB.magic, glCurrentDB.hash);//
            var newRow = n0  + ' ' + r.s + ' ' + g2 + ' ' + o2 + '\n';
        } else {
            var newRow = '';
        }

        widPrintSendReceiveOut(id, newRow);
        widShowTokensLog('Generation...');
    }

    if  (newRow.length !== 0) {
        var extractKeys = $('#' + widGetClosestTextareaId(id)).val().replace(/[\n|\s]/g, '');
        var lastRow = engGetHash(extractKeys, 's22').substring(0, 4) + ' ' + glCurrentDB.altname + ' ' + '124252';
        widPrintSendReceiveOut(id, lastRow);
    }

    widMainButtonClick(id, 'OK');
}