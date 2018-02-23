// Hasq Technology Pty Ltd (C) 2013-2015

function closestTextArea($Obj) {
    var $textarea = undefined;

    if ($Obj)
        $textarea = $Obj.closest('.wrap').find('textarea');

    var retObj = {
        add: function (data) {
            $textarea.val($textarea.val() + data);
        },
        clear: function (data) {
            if (typeof data == 'undefined')
                return $textarea.val('');

            $textarea.val('');
            $textarea.val(data);
        },
        clearExcept: function ($Obj) {
            (arguments.length == 0) ? $textarea.val('') : $('textarea .wrap').not($textarea).val('');
        },
        val: function () {
            return $textarea.val();
        }
    }

    return retObj;
}

function led($Obj) {
    var $led = undefined;

    if ($Obj)
        $led = $Obj.closest('.wrap').find('img:first');

    var retObj = {
        set: function (img, title) {
            if (typeof img == 'undefined')
                return this.clear($Obj);

            if ($led.attr('src') != img)
                $led.attr('src', img);

            if (typeof(title) === 'undefined')
                $led.removeAttr('title');
            else if ($led.prop('title', title) != title)
                $led.prop('title', title);

        },
        clear: function () {
            if (typeof $led == 'undefined')
                return $('.led-span')
                .find($('img')).removeAttr('src').removeAttr('title');

            $led.removeAttr('src').removeAttr('title');
        },
        source: function () {
            if (typeof $led !== 'undefined')
                return $led.attr('src');
        }
    }

    return retObj;
}

function widWarningLed($Obj, image, text) {
    var source = led($Obj).source();

    if (source == imgMsgError || source == imgMsgWarning || source == image)
        return;

    led($Obj).set(image, text);
}

function widShowProgressbar(val) {
    var $Progressbar = $('#div_progressbar_main');
    val = Math.ceil(val) || 0;
    $Progressbar.progressbar('value', val);
}

function widShowTokensLog(text) {
    var $Log = $('#div_tokens_log');
    text = text || '&nbsp';
    $Log.html(text);
}

function widShowOrderedTokensNames(arr) {
    for (var i = 0; i < arr.length; i++) {
        if (i == 0)
            widGetRawTokens(arr[i]);
        else
            widGetRawTokens(widGetRawTokens() + ' ' + arr[i]);
    }
}

function widCleanUI($Obj) {
    widShowProgressbar();
    widShowTokensLog();

    var retObj = {
        full: function () {
            led().clear();
            $('textarea .wrap').val('');
            widCleanVerifyTab();
        },
        near: function () {
            led($Obj).clear();
            closestTextArea($Obj).clear();
        }
    }

    return retObj;
}

function widCleanVerifyTab() {
    $('#table_verify').find('tr:gt(0)').remove();
    led($('#button_verify')).clear();
    $('#div_table_verify').hide();
}

function widGetClosestMainButton($Obj) {
    return $Obj.closest('.wrap').find($('.shared-button'));
}

function widGetClosestContinueButton($Obj) {
    return $Obj.closest('.wrap').find($('.continue-button'));
}

function widGetClosestWarningTd($Obj) {
    return $Obj.closest('.wrap').find($('td .td-warning'));
}

function widGetClosestLed($Obj) {
    return $Obj.closest('.wrap').find($('.led-span'));
}

function widGetClosestTextarea($Obj) {
    return $Obj.closest('.wrap').find($('textarea'));
}

function widDisableTokensInput() {
    var $Obj = $('#div_tokens_tabs');
    $Obj.tabs('option', 'disabled', true);
    $Obj
    .closest('div[id^="tabs"]')
    .find('button, input, textarea')
    .prop('disabled', true);

    $Obj
    .closest('div[id^="tabs"]')
    .find('textarea:first')
    .prop('disabled', false);
}

function widEnableTokensInput() {
    var $Obj = $('#div_tokens_tabs');
    $Obj.tabs('enable');

    $Obj
    .closest('div[id^="tabs"]')
    .find('button, input, textarea')
    .prop('disabled', false);
}

function widDisableAllTokensUI($Obj) {
    var $Tabs = $('#div_tokens_tabs');
    $Tabs.tabs('option', 'disabled', true);

    $Tabs
    .closest('div[id^="tabs"]')
    .find('button, input, textarea')
    .prop('disabled', true);

    $(widGetClosestContinueButton($Obj)).prop('disabled', false);
    $(widGetClosestMainButton($Obj)).prop('disabled', false);
}

function widEnableAllTokensUI() {
    var $Obj = $('#div_tokens_tabs');
    $Obj.tabs('enable');

    $Obj.closest('div[id^="tabs"]')
    .find('button, input, textarea')
    .prop('disabled', false);
}

function widSwitchShowHide($Obj) {
    if ($Obj.css('display') === 'none')
        $Obj.fadeIn();
    else
        $Obj.hide();
}

function widGetWarningsMode($Obj) {
    return ($Obj.button('option', 'label') == gButton.continueBtn) ? true : false;
}

function widGetButtonsMode($Obj) {
    var label = $Obj.button('option', 'label');
    var title = $Obj.attr('data-title');
    var objC = widGetClosestContinueButton($Obj);
    var cMode = widGetWarningsMode(objC);

    if ($Obj == objC && cMode)
        return true;

    if (label == title)
        return true;

    return false;
}

function widGetFunctionById($Obj, click) {
    glCmdList.clear();
    var fName = $Obj.attr('data-function');

    fName = (arguments.length > 1) ? fName + '($Obj, click)' : fName + '($Obj)';

    return function () {
        eval(fName);
    }
}

function widSwitchButtonsMode($Obj) {
    var title = $Obj.attr('data-title');
    var label = $Obj.button('option', 'label');
    var objWarning = widGetClosestWarningTd($Obj);
    var objContinue = widGetClosestContinueButton($Obj);

    if (label === title && title === gButton.continueBtn) {
        widSwitchShowHide($Obj);
        widSwitchShowHide(objWarning);
        $Obj.button('option', 'label', gButton.hiddenBtn);
        return;
    }

    if (label !== title && title === gButton.continueBtn) {
        widSwitchShowHide($Obj);
        widSwitchShowHide(objWarning);
        $Obj.button('option', 'label', title);
        return;
    }

    if (label === title)
        return $Obj.button('option', 'label', 'Cancel');

    $Obj.button('option', 'label', title);

    if (widGetWarningsMode(objContinue)) {
        widSwitchShowHide(objContinue);
        widSwitchShowHide(objWarning);
        $(objContinue).button('option', 'label', gButton.hiddenBtn);
    }
}

function widMainButtonClick($Obj, text) {
    var f;

    if (widGetButtonsMode($Obj)) {
        widDisableAllTokensUI($Obj);
        f = widGetFunctionById($Obj);
    } else {
        f = function () {
            widCancel($Obj, text);
        }
    }

    widSwitchButtonsMode($Obj);
    setTimeout(f);
}

function widDone($Obj, text) {
    widMainButtonClick($Obj, text);
}

function widCancel($Obj, text) {
    glCmdList.clear();

    if (!text) {
        text = gMsg.cancel;
        glTokList.clear();
        widWarningLed($Obj, imgMsgError, text);
    };

    widShowTokensLog(text);
    widEnableAllTokensUI();
}

function widContinueButtonClick($Obj, click) {
    var label = $Obj.button('option', 'label');
    widSwitchButtonsMode($Obj);

    (click)
     ? setTimeout(widGetFunctionById(widGetClosestMainButton($Obj), click))
     : widShowTokensLog(gMsg.userWait);

}

function widTokensIdxOninput($Obj) {
    $Obj.val(engGetOnlyNumber($Obj.val()));
}

function widTokensPasswordOninput(data) {
    gPassword = data;
    glTokList.clear();
    led().clear();
    widCleanVerifyTab();
}

function widGetRawTokens(data) {
    $Text = $('#textarea_tokens_names');

    if (data)
        return $Text.val(data);

    return $Text.val();
}

function widIsPassword() {
    return ($('#input_tokens_password').val().length > 0);
}

function widIsRawTokens() {
    return (widGetRawTokens().length > 0 && engIsRawTokens(widGetRawTokens(), gCurrentDB.hash));
}

function widGetRangeDataState() {
    var baseName = $('#input_tokens_basename').val();
    var idx0 = +$('#input_fst_idx').val();
    var idx1 = +$('#input_lst_idx').val();
    var r = gMsg.ok;

    if (baseName == '')
        r = gMsg.emptyName;
    else if (/[\s]/g.test(baseName))
        r = gMsg.incorrectName;
    else if (idx0 > idx1)
        r = gMsg.incorrectIdx;
    else if (idx1 - idx0 > 127)
        r = g.Msg.manyTokens;

    return r;
}

function widTokensNamesOninput($Obj) {
    glTokList.clear();
    widCleanUI().full();
    widShowBordersColor($Obj);

    var tokens = $Obj.val();

    if (!engIsRawTokens(tokens, gCurrentDB.hash)) {
        widDisableTokensInput();
        widShowBordersColor($Obj, '#FF0000'); //RED BORDER
        widShowTokensLog(gMsg.namePlaceholder);
    } else if (tokens.length >= 15479) {
        widEnableTokensInput();
        widShowBordersColor($Obj, '#FFFF00'); //YELLOW BORDER
        var l = 16511 - tokens.length;
        $Obj.prop('title', gMsg.charsLeft + l);
        widShowTokensLog();
    } else {
        widEnableTokensInput();
        widShowBordersColor($Obj);
        widShowTokensLog();
    }
}

function widAddTokens($Obj, data) {
    var $Basename = $('#input_tokens_basename');
    var $FirstIdx = $('#input_fst_idx');
    var $LastIdx = $('#input_lst_idx');
    var chk = widGetRangeDataState();

    if (chk !== gMsg.ok)
        return widDone($Obj, chk);

    var baseName = $Basename.val();
    var idx0 = $FirstIdx.val();
    var idx1 = $LastIdx.val();
    var rawTok = widGetRawTokens().replace(/\s+$/g, '');
    var l = rawTok.length;
    var lastChar = rawTok.charAt(l - 1);
    var newTokens = (
        l == 0 ||
        lastChar == '\u0020' ||
        lastChar == '\u0009' ||
        lastChar == '\u000A' ||
        lastChar == '\u000B' ||
        lastChar == '\u000D')
     ? ''
     : '\u0020';

    if (idx0 == '' && idx1 == '')
        newTokens += '[' + baseName + ']';
    else if (idx0 != '' && idx1 != '') {
        var idx0 = +idx0;
        var idx1 = +idx1;

        for (var i = idx0; i <= idx1; i++)
            newTokens =
                (i == idx1)
             ? newTokens + '[' + baseName + i + ']'
             : newTokens + '[' + baseName + i + ']' + '\u0020';
    } else {
        newTokens += '[' + baseName + ']' + '\u0020';
        var idx0 = +idx0;
        var idx1 = +idx1;

        for (var i = idx0; i <= idx1; i++) {
            newTokens =
                (i == idx1)
             ? newTokens + '[' + baseName + i + ']'
             : newTokens + '[' + baseName + i + ']' + '\u0020';
        }
    }

    rawTok += newTokens;

    if (rawTok.length <= 16511) {
        widGetRawTokens(rawTok);
        widGetRawTokens();
        //objNames[0].oninput();
        $Basename.val('');
        $FirstIdx.val('');
        $LastIdx.val('');
        widDone($Obj, gMsg.ok);
    } else
        widDone($Obj, gMsg.manyTokens);
}

function widPreCreate($Obj) {
    glCmdList.clear();
    glTokList.clear();

    if (!widIsRawTokens())
        return widDone($Obj, gMsg.badTokens);

    if (!widIsPassword())
        return widDone($Obj, gMsg.emptyPassword);

    led($Obj).set(imgMsgBlink, gMsg.wait);

    var tokens = engGetTokens(widGetRawTokens(), gCurrentDB.hash);
    widCreateTokens($Obj, tokens);
}

function widCreateTokens($Obj, tokens) {
    var enc = $('#input_tokens_encrypt').prop('checked');

    var cbFunc = function (cbData, cmdIdx, progress) {
        if (glCmdList.items.length === 0)
            return;

        widShowProgressbar(progress);
        widShowTokensLog(gMsg.creating);

        var resp = engGetResponseHeader(cbData);

        if (resp === 'REQ_ZERO_POLICY' || resp === 'REQ_BAD_CRYPT') {
            widWarningLed($Obj, imgMsgError, gMsg.error + resp);
            return widDone($Obj, resp);
        }

        if (resp !== 'OK')
            widWarningLed($Obj, imgMsgWarning, gMsg.error + resp);

        if (!(cmdIdx + 1 < glCmdList.items.length)) {
            widWarningLed($Obj, imgMsgOk, resp);
            widDone($Obj, resp);
        }
    }

    for (var i = 0; i < tokens.length; i++) {
        var r = engGetRecord(0, tokens[i].s, gPassword, null, null, gCurrentDB.magic, gCurrentDB.hash);
        var zCmd = 'z * ' + gCurrentDB.name + ' 0 ' + tokens[i].s + ' ' + r.k + ' ' + r.g + ' ' + r.o + ' ';
        var lastCmd = 'last ' + gCurrentDB.name + ' ' + tokens[i].s;

        if (enc) {
            zCmd = '#' + engGetCipher(zCmd);
            lastCmd = '#' + engGetCipher(lastCmd);
        }

        var zCmdIdx = (i == 0) ? 0 : i * 2;
        var lastCmdIdx = zCmdIdx + 1;

        glCmdList.items[zCmdIdx] = {};
        glCmdList.items[zCmdIdx].cmd = zCmd;
        glCmdList.items[zCmdIdx].raw = tokens[i].raw;
        glCmdList.items[zCmdIdx].s = tokens[i].s;

        glCmdList.items[lastCmdIdx] = {};
        glCmdList.items[lastCmdIdx].cmd = lastCmd;
        glCmdList.items[lastCmdIdx].raw = tokens[i].raw;
        glCmdList.items[lastCmdIdx].s = tokens[i].s;
    }

    engRunCmdList(glCmdList, cbFunc);
}

function widAddVerifyTR(rec, statePic) {
    var $Table = $('#table_verify');
    var pic = '<img src="' + statePic.img + '" title="' + statePic.title + '"></img>' + '&nbsp;' + rec.status;
    var tr = widGetHTMLTr(widGetHTMLTd(pic) + widGetHTMLTd(rec.raw) + widGetHTMLTd(rec.s) + widGetHTMLTd(rec.n) + widGetHTMLTd(rec.d));

    $Table.append(tr);
}

function widGetTokenStatusImg(status) {
    // Returns an image source and title displaying tokens/password state
    var r = {};
    console.log(status)
    switch (status) {
    case 1:
        r.img = imgPwdOk;
        r.title = gTokStateMsg.ok;
        break;
    case 2:
        r.img = imgPwdSndng;
        r.title = gTokStateMsg.sending;
        break;
    case 3:
        r.img = imgPwdRcvng;
        r.title = gTokStateMsg.receiving;
        break;
    case 4:
        r.img = imgPwdWrong;
        r.title = gTokStateMsg.wrong;
        break;
    default:
        r.img = imgTknNodn;
        r.title = gTokStateMsg.nodn;
        break;
    }
    return r;
}

function widPreVerify($Obj) {
    glCmdList.clear();
    glTokList.clear();
    widCleanVerifyTab();

    if (!widIsRawTokens())
        return widDone($Obj, gMsg.badTokens);

    if (!widIsPassword())
        return widDone($Obj, gMsg.emptyPassword);

    var $TableArea = $('#div_table_verify');
    var width = $Obj.closest('.wrap').outerWidth() - 6;
    var maxHeight =
        (($(window).height() - $('body').height()) > 200)
     ? ($(window).height() - $('body').height()) / 2
     : 100;

    $TableArea.outerWidth(width);
    $TableArea.css('max-height', maxHeight + 'px');
    $TableArea.show();

    var tokens = engGetTokens(widGetRawTokens(), gCurrentDB.hash);
    widVerifyTokens($Obj, tokens);
}

function widVerifyTokens($Obj, tokens) {
    var enc = $('#input_tokens_encrypt').prop('checked');
    var cbFunc = function (ajxData, cmdIdx, progress) {
        if (glCmdList.items.length == 0)
            return;

        var resp = engGetResponseHeader(ajxData);

        if (resp !== 'OK' && resp !== 'IDX_NODN') {
            widWarningLed($Obj, imgMsgError, gMsg.error + resp);
            return widDone($Obj, resp);
        }

        widShowProgressbar(progress);
        widShowTokensLog(gMsg.verifying);

        var item = engGetTokenInfo(ajxData, glCmdList.items[cmdIdx].raw, glCmdList.items[cmdIdx].s);
        glTokList.add(item);

        var idx = glTokList.items.length - 1;

        if (glTokList.unfit)
            widWarningLed($Obj, imgMsgWarning, gMsg.someUnavailable);

        var lineLed = widGetTokenStatusImg(glTokList.items[idx].status);
        widAddVerifyTR(glTokList.items[idx], lineLed);

        if (!(cmdIdx + 1 < glCmdList.items.length)) {
            widWarningLed($Obj, imgMsgOk, gMsg.ok);
            widDone($Obj, gMsg.ok);
        }
    }

    for (var i = 0; i < tokens.length; i++) {
        var lastCmd = 'last ' + gCurrentDB.name + ' ' + tokens[i].s;

        if (enc)
            lastCmd = '#' + engGetCipher(lastCmd);

        glCmdList.items[i] = {};
        glCmdList.items[i].cmd = lastCmd;
        glCmdList.items[i].raw = tokens[i].raw;
        glCmdList.items[i].s = tokens[i].s;
    }

    led($Obj).set(imgMsgBlink, gMsg.wait);
    engRunCmdList(glCmdList, cbFunc);
}

function widFillOutTokList($Obj, tokens, extCb) {
    glTokList.clear();
    glCmdList.clear();

    var enc = $('#input_tokens_encrypt').prop('checked');
    var cbFunc = function (cbData, cmdIdx, progress) {
        if (glCmdList.items.length == 0)
            return led().clear();

        var resp = engGetResponseHeader(cbData);

        if (resp !== 'OK' && resp !== 'IDX_NODN') {
            widWarningLed($Obj, imgMsgError, gMsg.error + resp)
            return widDone($Obj, resp);
        }

        widShowProgressbar(progress);

        var item = engGetTokenInfo(cbData, glCmdList.items[cmdIdx].raw, glCmdList.items[cmdIdx].s);

        glTokList.add(item);

        var idx = glTokList.items.length - 1;

        (cmdIdx + 1 < glCmdList.items.length)
         ? widShowTokensLog(gMsg.makelist)
         : setTimeout(extCb);
    }

    for (var i = 0; i < tokens.length; i++) {
        var lastCmd = 'last ' + gCurrentDB.name + ' ' + tokens[i].s;

        if (enc)
            lastCmd = '#' + engGetCipher(lastCmd);

        glCmdList.items[i] = {};
        glCmdList.items[i].cmd = lastCmd;
        glCmdList.items[i].raw = (tokens[i].raw !== undefined) ? tokens[i].raw : '';
        glCmdList.items[i].s = tokens[i].s;
    }

    engRunCmdList(glCmdList, cbFunc);
}

function cbTokensUpdate(cbData, cmdIdx, progress, $Obj) {
    // callback function for all functions which update tokens;
    var msg = gMsg.noTokensOrKeys;
    var resp = engGetResponseHeader(cbData);

    if (glCmdList.items.length == 0) {
        widWarningLed($Obj, imgMsgWarning, msg);
        return widDone($Obj, msg);
    }

    msg = gMsg.processing;
    widShowProgressbar(progress);
    widShowTokensLog(msg);

    if (resp === 'REQ_BAD_CRYPT') {
        widWarningLed($Obj, imgMsgError, gMsg.error + resp);
        return widDone($Obj, resp);
    }

    (resp !== 'OK' && resp !== 'IDX_NODN')
     ? widWarningLed($Obj, imgMsgWarning, gMsg.error + resp)
     : widWarningLed($Obj, imgMsgBlink, msg)

    if (!(cmdIdx + 1 < glCmdList.items.length)) {
        widWarningLed($Obj, imgMsgOk, gMsg.ok);
        return widDone($Obj, gMsg.done);
    }
}

function widPreUpdate($Obj, click) {
    glCmdList.clear();
    widCleanUI().full();

    var d = $Obj.closest('.wrap').find('input').val();
    var msg = gMsg.wait;

    switch (glTokList.status()) {
    case true:
        led($Obj).set(imgMsgBlink, msg);
        widUpdateTokens($Obj, d, glTokList.items);
        break;
    case false:
        msg = gMsg.unknown;
        led($Obj).set(imgMsgError, msg);
        widDone($Obj, msg);
        break;
    case undefined:
        (typeof click == 'undefined')
         ? widContinueButtonClick(widGetClosestContinueButton($Obj))
         : widUpdateTokens($Obj, d, glTokList.items);
        break;
    default:
        if (!widIsRawTokens())
            return widDone($Obj, gMsg.badTokens);
        if (!widIsPassword())
            return widDone($Obj, gMsg.emptyPassword);

        led($Obj).set(imgMsgBlink, msg);

        var tokens = engGetTokens(widGetRawTokens(), gCurrentDB.hash);
        var extCb = function () {
            widPreUpdate($Obj, click);
        }

        widFillOutTokList($Obj, tokens, extCb);
        break;
    }
}

function widUpdateTokens($Obj, data, items) {
    var enc = $('#input_tokens_encrypt').prop('checked');

    glTokList.clear();

    for (var i = 0; i < items.length; i++) {
        if (items[i].status === 1 && items[i].d !== data) {
            var n = +items[i].n + 1;
            var s = items[i].s;
            var r = engGetRecord(n, s, gPassword, null, null, gCurrentDB.magic, gCurrentDB.hash);
            var addCmd = 'add *' + ' ' + gCurrentDB.name + ' ' + n + ' ' + s + ' ' + r.k + ' ' + r.g + ' ' + r.o + ' ' + data;
            var lastCmd = 'last' + ' ' + gCurrentDB.name + ' ' + s;

            if (enc) {
                addCmd = '#' + engGetCipher(addCmd);
                lastCmd = '#' + engGetCipher(lastCmd);
            }

            var idx = (glCmdList.items.length == 0) ? 0 : glCmdList.items.length;

            glCmdList.items[idx] = {};
            glCmdList.items[idx].cmd = addCmd;
            glCmdList.items[idx].raw = items[i].raw;
            glCmdList.items[idx].s = items[i].s;

            idx++;

            glCmdList.items[idx] = {};
            glCmdList.items[idx].cmd = lastCmd;
            glCmdList.items[idx].raw = items[i].raw;
            glCmdList.items[idx].s = items[i].s;
        }
    }

    var cb = function (cbData, cmdIdx, progress) {
        cbTokensUpdate(cbData, cmdIdx, progress, $Obj);
    }

    engRunCmdList(glCmdList, cb);
}

function widUpgradeAsgmtKeys($Obj, asgmtKeys, func) {
    //if asgmtKeys not contains numbers of records , makes 'last' and update asgmtKeys records numbers;
    glCmdList.clear();
    var prCode = asgmtKeys[0].prcode;

    if (prCode.charAt(0) === '2' && glTokList.items.length === 0) {
        var extCb = function () {
            widUpgradeAsgmtKeys($Obj, asgmtKeys, func);
        }

        return widFillOutTokList($Obj, asgmtKeys, extCb);
    } else if (prCode.charAt(0) === '2' && glTokList.items.length > 0) {
        if (AsgmtKeys.length !== glTokList.items.length)
            return widDone($Obj, gMsg.keysError);

        asgmtKeys = engGetNumberedAsgmtKeys(AsgmtKeys, glTokList.items);
    }

    var titleRecord = engGetTitleRecord(AsgmtKeys, gPassword, gCurrentDB.hash, gCurrentDB.magic);
    var f = function () {
        func($Obj, titleRecord);
    }
    setTimeout(f);
}

function widPreSimpleSend($Obj) {
    glCmdList.clear();
    widCleanUI($Obj).near();
    var msg = gMsg.wait;

    switch (glTokList.status()) {
    case true:

        led($Obj).set(imgMsgBlink, msg);
        widSimpleSend($Obj, glTokList.items);

        break;
    case false:
        msg = gMsg.allUnavailable;
        led($Obj).set(imgMsgError, msg);

        if (closestTextArea($Obj).val().length > 0)
            closestTextArea($Obj).clear();

        widDone($Obj, msg);

        break;
    case undefined:
        msg = gMsg.someUnavailable;
        led($Obj).set(imgMsgError, msg);

        if (closestTextArea($Obj).val().length > 0)
            closestTextArea($Obj).clear();

        widDone($Obj, msg);

        break;
    default:
        if (!widIsRawTokens())
            return widDone($Obj, gMsg.badTokens);

        if (!widIsPassword())
            return widDone($Obj, gMsg.emptyPassword);

        led($Obj).set(imgMsgBlink, msg);

        var tok = engGetTokens(widGetRawTokens(), gCurrentDB.hash);
        var extCb = function () {
            widPreSimpleSend($Obj);
        }

        widFillOutTokList($Obj, tok, extCb);

        break;
    }
}

function widSimpleSend($Obj, items) {
    var k1;
    var k2;
    var line;
    console.log(items);
    for (let i = 0; i < items.length; i++) {
        if (items[i].status === 1) {
            k1 = engGetKey(items[i].n + 1, items[i].s, gPassword, gCurrentDB.magic, gCurrentDB.hash);
            k2 = engGetKey(items[i].n + 2, items[i].s, gPassword, gCurrentDB.magic, gCurrentDB.hash);
            line = items[i].n + ' ' + items[i].s + ' ' + k1 + ' ' + k2 + '\n';

            if (0)
                line = items[i].s + ' ' + k1 + ' ' + k2 + '\n';

            closestTextArea($Obj).add(line);
        }

        widShowProgressbar(100 * (i + 1) / items.length);
        widShowTokensLog(gMsg.generation);
    }

    var mergedKeys = widGetClosestTextarea($Obj).val().replace(/\s/g, '');
    line = engGetHash(mergedKeys, 's22').substring(0, 4) + ' ' + gCurrentDB.altname + ' ' + '123132';

    if (0)
        line = engGetHash(mergedKeys, 's22').substring(0, 4) + ' ' + gCurrentDB.altname + ' ' + '23132';

    closestTextArea($Obj).add(line);
    led($Obj).set(imgMsgOk, gMsg.ok);

    widDone($Obj, gMsg.ok);
}

function widPreSimpleReceive($Obj, click) {
    led($Obj).clear();
    var rawAsgmtKeys = widGetClosestTextarea($Obj).val();

    if (!engIsAsgmtKeys(rawAsgmtKeys))
        return widDone($Obj, gMsg.badKeys);

    if (!widIsPassword)
        return widDone($Obj, gMsg.emptyPassword);

    if (widGetRawTokens().length > 0 && (typeof click == 'undefined'))
        return widContinueButtonClick(widGetClosestContinueButton($Obj));

    glCmdList.clear();
    glTokList.clear();

    var tok = engGetTokens(widGetRawTokens(), gCurrentDB.hash);
    var asgmtKeys = engGetParsedAsgmtKeys(rawAsgmtKeys);
    tok = engGetDnOrRawList(engGetDnList(AsgmtKeys), engGetRawList(tok), gCurrentDB.hash);
    widShowOrderedTokensNames(tok);
    widUpgradeAsgmtKeys($Obj, asgmtKeys, widSimpleReceive);
}

function widSimpleReceive($Obj, titleRecord) {
    var enc = $('#input_tokens_encrypt').prop('checked');

    for (var i = 0; i < titleRecord.length; i++) {
        var n1 = titleRecord[i].n1;
        var n2 = titleRecord[i].n2;
        var s = titleRecord[i].s;
        var k1 = titleRecord[i].k1;
        var g1 = titleRecord[i].g1;
        var o1 = titleRecord[i].o1;
        var k2 = titleRecord[i].k2;
        var g2 = titleRecord[i].g2;
        var o2 = titleRecord[i].o2;

        var addCmd1 = 'add * ' + gCurrentDB.name + ' ' + n1 + ' ' + s + ' ' + k1 + ' ' + g1 + ' ' + o1;
        var addCmd2 = 'add * ' + gCurrentDB.name + ' ' + n2 + ' ' + s + ' ' + k2 + ' ' + g2 + ' ' + o2;

        if (enc) {
            addCmd1 = '#' + engGetCipher(addCmd1);
            addCmd2 = '#' + engGetCipher(addCmd2);
        }

        var idx = (i == 0) ? 0 : i * 2;

        glCmdList.items[idx] = {};
        glCmdList.items[idx].cmd = addCmd1;
        glCmdList.items[idx].s = s;
        glCmdList.items[idx].raw = '';

        idx++;

        glCmdList.items[idx] = {};
        glCmdList.items[idx].cmd = addCmd2;
        glCmdList.items[idx].s = s;
        glCmdList.items[idx].raw = '';
    }

    var cb = function (cbData, cmdIdx, progress) {
        cbTokensUpdate(cbData, cmdIdx, progress, $Obj);
    }

    engRunCmdList(glCmdList, cb);
}

function widPreSimpleRequest($Obj) {
    glCmdList.clear();
    widCleanUI($Obj).near();
    var msg = gMsg.wait;

    switch (glTokList.status()) {
    case true:
        msg = gMsg.allAvailable;
        led($Obj).set(imgMsgError, msg);
        widDone($Obj, msg);
        break;
    case false:
        led($Obj).set(imgMsgBlink, msg);
        widSimpleRequest($Obj, glTokList.items);
        break;
    case undefined:
        msg = gMsg.someAvailable;
        led($Obj).set(imgMsgError, msg);
        widDone($Obj, msg);
        break;
    default:
        if (!widIsRawTokens())
            return widDone($Obj, gMsg.badTokens);

        if (!widIsPassword())
            return widDone($Obj, gMsg.emptyPassword);

        var tok = engGetTokens(widGetRawTokens(), gCurrentDB.hash);
        var extCb = function () {
            widPreSimpleRequest($Obj);
        }

        led($Obj).set(imgMsgBlink, msg);
        widFillOutTokList($Obj, tok, extCb);
        break;
    }
}

function widSimpleRequest($Obj, items) {
    var k3,
    k4,
    g2,
    g3,
    o2,
    line;

    for (var i = 0; i < items.length; i++) {
        if (items[i].status === 4) {
            k3 = engGetKey(items[i].n + 3, items[i].s, gPassword, gCurrentDB.magic, gCurrentDB.hash);
            k4 = engGetKey(items[i].n + 4, items[i].s, gPassword, gCurrentDB.magic, gCurrentDB.hash);
            g2 = engGetKey(items[i].n + 3, items[i].s, k3, gCurrentDB.magic, gCurrentDB.hash);
            g3 = engGetKey(items[i].n + 4, items[i].s, k4, gCurrentDB.magic, gCurrentDB.hash);
            o2 = engGetKey(items[i].n + 3, items[i].s, g3, gCurrentDB.magic, gCurrentDB.hash);
            line = items[i].n + ' ' + items[i].s + ' ' + g2 + ' ' + o2 + '\n';

            if (0)
                line = items[i].s + ' ' + g2 + ' ' + o2 + '\n';

            closestTextArea($Obj).add(line);
        }

        widShowProgressbar(100 * (i + 1) / items.length);
        widShowTokensLog(gMsg.generation);
    }

    var msg = gMsg.nonexistentTokens;
    var img = imgMsgError;

    if (closestTextArea($Obj).val().length > 0) {
        var mergedKeys = $(widGetClosestTextarea($Obj)).val().replace(/\s/g, '');
        line = engGetHash(mergedKeys, 's22').substring(0, 4) + ' ' + gCurrentDB.altname + ' ' + '124252';

        if (0)
            line = engGetHash(mergedKeys, 's22').substring(0, 4) + ' ' + gCurrentDB.altname + ' ' + '24252';

        closestTextArea($Obj).add(line);

        msg = gMsg.ok;
        img = imgMsgOk;
    }

    led($Obj).set(img, msg);
    widDone($Obj, msg);
}

function widPreSimpleAccept($Obj, click) {
    led($Obj).clear();

    var rawAsgmtKeys = widGetClosestTextarea($Obj).val();

    if (!engIsAsgmtKeys(rawAsgmtKeys))
        return widDone($Obj, gMsg.badKeys);

    if (!widIsPassword())
        return widDone($Obj, gMsg.emptyPassword);

    if (widGetRawTokens().length > 0 && (typeof click == 'undefined'))
        return widContinueButtonClick(widGetClosestContinueButton($Obj));

    glCmdList.clear();
    glTokList.clear();

    var tok = engGetTokens(widGetRawTokens(), gCurrentDB.hash);
    var asgmtKeys = engGetParsedAsgmtKeys(rawAsgmtKeys);

    tok = engGetDnOrRawList(engGetDnList(AsgmtKeys), engGetRawList(tok), gCurrentDB.hash);
    widShowOrderedTokensNames(tok);
    widUpgradeAsgmtKeys($Obj, asgmtKeys, widSimpleAccept);
}

function widSimpleAccept($Obj, titleRecord) {
    var n1,
    n2,
    s,
    k1,
    g1,
    o1,
    k2,
    g2,
    o2,
    addCmd1,
    addCmd2,
    idx;

    var enc = $('#input_tokens_encrypt').prop('checked');

    for (var i = 0; i < titleRecord.length; i++) {
        n1 = titleRecord[i].n1;
        n2 = titleRecord[i].n2;
        s = titleRecord[i].s;
        k1 = titleRecord[i].k1;
        g1 = titleRecord[i].g1;
        o1 = titleRecord[i].o1;
        k2 = titleRecord[i].k2;
        g2 = titleRecord[i].g2;
        o2 = titleRecord[i].o2;
        addCmd1 = 'add * ' + gCurrentDB.name + ' ' + n1 + ' ' + s + ' ' + k1 + ' ' + g1 + ' ' + o1;
        addCmd2 = 'add * ' + gCurrentDB.name + ' ' + n2 + ' ' + s + ' ' + k2 + ' ' + g2 + ' ' + o2;

        if (enc) {
            addCmd1 = '#' + engGetCipher(addCmd1);
            addCmd2 = '#' + engGetCipher(addCmd2);
        }

        idx = (i == 0) ? 0 : i * 2;

        glCmdList.items[idx] = {};
        glCmdList.items[idx].cmd = addCmd1;
        glCmdList.items[idx].s = s;
        glCmdList.items[idx].raw = '';

        idx++;

        glCmdList.items[idx] = {};
        glCmdList.items[idx].cmd = addCmd2;
        glCmdList.items[idx].s = s;
        glCmdList.items[idx].raw = '';
    }

    var cb = function (cbData, cmdIdx, progress) {
        cbTokensUpdate(cbData, cmdIdx, progress, $Obj);
    }

    engRunCmdList(glCmdList, cb);
}

function widPreBlockingSendStep1($Obj) {
    glCmdList.clear();
    widCleanUI($Obj).near();

    var msg = gMsg.wait;

    switch (glTokList.status()) {
    case true:
        led($Obj).set(imgMsgBlink, msg);
        widBlockingSendStep1($Obj, glTokList.items);

        break;
    case false:
        msg = gMsg.allUnavailable;
        led($Obj).set(imgMsgError, msg);

        if (closestTextArea($Obj).val().length > 0)
            closestTextArea($Obj).clear();

        widDone($Obj, msg);

        break;
    case undefined:
        msg = gMsg.someUnavailable;
        led($Obj).set(imgMsgError, msg);

        if (closestTextArea($Obj).val().length > 0)
            closestTextArea($Obj).clear();

        widDone($Obj, msg);

        break;
    default:
        if (!widIsRawTokens())
            return widDone($Obj, gMsg.badTokens);

        if (!widIsPassword())
            return widDone($Obj, gMsg.emptyPassword);

        led($Obj).set(imgMsgBlink, msg);

        var tok = engGetTokens(widGetRawTokens(), gCurrentDB.hash);
        var extCb = function () {
            widPreBlockingSendStep1($Obj);
        }

        widFillOutTokList($Obj, tok, extCb);

        break;
    }
}

function widBlockingSendStep1($Obj, items) {
    var n0,
    k1,
    k2,
    g1,
    line;

    for (var i = 0; i < items.length; i++) {
        if (items[i].status === 1) {
            k1 = engGetKey(items[i].n + 1, items[i].s, gPassword, gCurrentDB.magic, gCurrentDB.hash);
            k2 = engGetKey(items[i].n + 2, items[i].s, gPassword, gCurrentDB.magic, gCurrentDB.hash);
            g1 = engGetKey(items[i].n + 2, items[i].s, k2, gCurrentDB.magic, gCurrentDB.hash);
            line = items[i].n + ' ' + items[i].s + ' ' + k1 + ' ' + g1 + '\n';

            if (0)
                line = items[i].s + ' ' + k1 + ' ' + g1 + '\n';

            closestTextArea($Obj).add(line);
        }

        widShowProgressbar(100 * (i + 1) / items.length);
        widShowTokensLog(gMsg.generation);
    }

    var mergedKeys = widGetClosestTextarea($Obj).val().replace(/\s/g, '');
    line = engGetHash(mergedKeys, 's22').substring(0, 4) + ' ' + gCurrentDB.altname + ' ' + '123141';

    if (0)
        line = engGetHash(mergedKeys, 's22').substring(0, 4) + ' ' + gCurrentDB.altname + ' ' + '23141';

    closestTextArea($Obj).add(line);
    led($Obj).set(imgMsgOk, gMsg.ok);

    widDone($Obj, gMsg.ok);
}

function widPreBlockingSendStep2($Obj) {
    glCmdList.clear();
    widCleanUI($Obj).near();
    var msg = gMsg.wait;

    switch (glTokList.status()) {
    case true:
        msg = gMsg.allAvailable;
        led($Obj).set(imgMsgError, msg);

        if (closestTextArea($Obj).val().length > 0)
            closestTextArea($Obj).clear();

        widDone($Obj, msg);

        break;
    case false:
        led($Obj).set(imgMsgBlink, msg);
        widBlockingSendStep2($Obj, glTokList.items);

        break;
    case undefined:
        msg = gMsg.someAvailable;
        led($Obj).set(imgMsgError, msg);

        if (closestTextArea($Obj).val().length > 0)
            closestTextArea($Obj).clear();

        widDone($Obj, msg);

        break;
    default:
        if (!widIsRawTokens())
            return widDone($Obj, gMsg.badTokens);

        if (!widIsPassword())
            return widDone($Obj, gMsg.emptyPassword);

        led($Obj).set(imgMsgBlink, msg);

        var tok = engGetTokens(widGetRawTokens(), gCurrentDB.hash);
        var extCb = function () {
            widPreBlockingSendStep2($Obj);
        }

        widFillOutTokList($Obj, tok, extCb);

        break;
    }
}

function widBlockingSendStep2($Obj, items) {
    for (var i = 0; i < items.length; i++) {
        if (items[i].status === 2) {
            //include only tokens in sending state;
            var n0 = items[i].n;
            var n1 = items[i].n + 1;
            var k1 = engGetKey(n1, items[i].s, gPassword, gCurrentDB.magic, gCurrentDB.hash);
            var line = n0 + ' ' + items[i].s + ' ' + k1 + '\n';

            if (0)
                line = items[i].s + ' ' + k1 + '\n';

            closestTextArea($Obj).add(line);
        }

        widShowProgressbar(100 * (i + 1) / items.length);
        widShowTokensLog(gMsg.generation);
    }

    var msg,
    img;

    if (closestTextArea($Obj).val().length == 0) {
        msg = gMsg.nonexistentTokens;
        img = imgMsgError;
    } else {
        var mergedKeys = widGetClosestTextarea($Obj).val().replace(/\s/g, '');
        line = engGetHash(mergedKeys, 's22').substring(0, 4) + ' ' + gCurrentDB.altname + ' ' + '1231';

        if (0)
            var line = engGetHash(mergedKeys, 's22').substring(0, 4) + ' ' + gCurrentDB.altname + ' ' + '231';

        closestTextArea($Obj).add(line);
        msg = gMsg.ok;
        img = imgMsgOk;
    }

    led($Obj).set(img, msg);
    widDone($Obj, msg);
}

function widPreBlockingReceiveStep1($Obj, click) {
    led($Obj).clear();
    var rawAsgmtKeys = widGetClosestTextarea($Obj).val();

    if (!engIsAsgmtKeys(rawAsgmtKeys))
        return widDone($Obj, gMsg.badKeys);

    if (!widIsPassword)
        return widDone($Obj, gMsg.emptyPassword);

    if (widGetRawTokens().length > 0 && (typeof click == 'undefined'))
        return widContinueButtonClick(widGetClosestContinueButton($Obj));

    glCmdList.clear();
    glTokList.clear();

    var tok = engGetTokens(widGetRawTokens(), gCurrentDB.hash);
    var asgmtKeys = engGetParsedAsgmtKeys(rawAsgmtKeys);
    tok = engGetDnOrRawList(engGetDnList(AsgmtKeys), engGetRawList(tok), gCurrentDB.hash);
    widShowOrderedTokensNames(tok);
    widUpgradeAsgmtKeys($Obj, asgmtKeys, widBlockingReceiveStep1);
}

function widBlockingReceiveStep1($Obj, titleRecord) {
    var enc = $('#input_tokens_encrypt').prop('checked');
    var n1,
    s,
    k1,
    g1,
    o1,
    addCmd;

    for (let i = 0; i < titleRecord.length; i++) {
        n1 = titleRecord[i].n1;
        s = titleRecord[i].s;
        k1 = titleRecord[i].k1;
        g1 = titleRecord[i].g1;
        o1 = titleRecord[i].o1;

        addCmd = 'add * ' + gCurrentDB.name + ' ' + n1 + ' ' + s + ' ' + k1 + ' ' + g1 + ' ' + o1;

        if (enc)
            addCmd = '#' + engGetCipher(addCmd);

        glCmdList.items[i] = {};
        glCmdList.items[i].cmd = addCmd;
        glCmdList.items[i].s = s;
        glCmdList.items[i].raw = '';
    }

    var cb = function (cbData, cmdIdx, progress) {
        cbTokensUpdate(cbData, cmdIdx, progress, $Obj);
    }

    engRunCmdList(glCmdList, cb);
}

function widPreBlockingReceiveStep2($Obj, click) {
    led($Obj).clear();

    var rawAsgmtKeys = widGetClosestTextarea($Obj).val();

    if (!engIsAsgmtKeys(rawAsgmtKeys))
        return widDone($Obj, gMsg.badKeys);

    if (!widIsPassword)
        return widDone($Obj, gMsg.emptyPassword);

    if (widGetRawTokens().length > 0 && (typeof click == 'undefined'))
        return widContinueButtonClick(widGetClosestContinueButton($Obj));

    glCmdList.clear();
    glTokList.clear();

    var tok = engGetTokens(widGetRawTokens(), gCurrentDB.hash);
    var asgmtKeys = engGetParsedAsgmtKeys(rawAsgmtKeys);

    tok = engGetDnOrRawList(engGetDnList(AsgmtKeys), engGetRawList(tok), gCurrentDB.hash);
    widShowOrderedTokensNames(tok);
    widUpgradeAsgmtKeys($Obj, asgmtKeys, widBlockingReceiveStep2);
}

function widBlockingReceiveStep2($Obj, titleRecord) {
    var n1,
    s,
    k1,
    g1,
    o1,
    addCmd;
    var enc = $('#input_tokens_encrypt').prop('checked');

    for (var i = 0; i < titleRecord.length; i++) {
        n1 = titleRecord[i].n1;
        s = titleRecord[i].s;
        k1 = titleRecord[i].k1;
        g1 = titleRecord[i].g1;
        o1 = titleRecord[i].o1;

        addCmd = 'add * ' + gCurrentDB.name + ' ' + n1 + ' ' + s + ' ' + k1 + ' ' + g1 + ' ' + o1;

        if (enc)
            addCmd = '#' + engGetCipher(addCmd);

        glCmdList.items[i] = {};
        glCmdList.items[i].cmd = addCmd;
        glCmdList.items[i].s = s;
        glCmdList.items[i].raw = '';
    }

    var cb = function (cbData, cmdIdx, progress) {
        cbTokensUpdate(cbData, cmdIdx, progress, $Obj);
    }

    engRunCmdList(glCmdList, cb);
}

function widPreBlockingRequestStep1($Obj) {
    glCmdList.clear();
    widCleanUI($Obj).near();

    var msg = gMsg.wait;

    switch (glTokList.status()) {
    case true:
        msg = gMsg.allAvailable;
        led($Obj).set(imgMsgError, msg);

        widDone($Obj, msg);

        break;
    case false:
        led($Obj).set(imgMsgBlink, msg);
        widBlockingRequestStep1($Obj, glTokList.items);

        break;
    case undefined:
        msg = gMsg.someAvailable;
        led($Obj).set(imgMsgError, msg);

        widDone($Obj, msg);

        break;
    default:
        if (!widIsRawTokens())
            return widDone($Obj, gMsg.badTokens);

        if (!widIsPassword())
            return widDone($Obj, gMsg.emptyPassword);

        var tok = engGetTokens(widGetRawTokens(), gCurrentDB.hash);
        var extCb = function () {
            widPreBlockingRequestStep1($Obj);
        }

        led($Obj).set(imgMsgBlink, msg);

        widFillOutTokList($Obj, tok, extCb);

        break;
    }
}

function widBlockingRequestStep1($Obj, items) {
    var n0,
    k3,
    g2,
    o1,
    line;

    for (var i = 0; i < items.length; i++) {
        if (items[i].status === 4) {
            n0 = items[i].n;
            k3 = engGetKey(n0 + 3, items[i].s, gPassword, gCurrentDB.magic, gCurrentDB.hash);
            g2 = engGetKey(n0 + 3, items[i].s, k3, gCurrentDB.magic, gCurrentDB.hash);
            o1 = engGetKey(n0 + 2, items[i].s, g2, gCurrentDB.magic, gCurrentDB.hash);
            line = items[i].n + ' ' + items[i].s + ' ' + o1 + '\n';

            if (0)
                line = items[i].s + ' ' + o1 + '\n';

            closestTextArea($Obj).add(line);
        }

        widShowProgressbar(100 * (i + 1) / items.length);
        widShowTokensLog(gMsg.generation);
    }

    var msg = gMsg.nonexistentTokens
        var img = imgMsgError;

    if (closestTextArea($Obj).val().length > 0) {
        var rawAsgmtKeys = $(widGetClosestTextarea($Obj)).val().replace(/\s/g, '');
        line = engGetHash(rawAsgmtKeys, 's22').substring(0, 4) + ' ' + gCurrentDB.altname + ' ' + '1251';

        if (0)
            line = engGetHash(rawAsgmtKeys, 's22').substring(0, 4) + ' ' + gCurrentDB.altname + ' ' + '251';

        closestTextArea($Obj).add(line);
        msg = gMsg.ok;
        img = imgMsgOk;
    }

    led($Obj).set(img, msg);
    widDone($Obj, msg);
}

function widPreBlockingRequestStep2($Obj) {
    glCmdList.clear();
    widCleanUI($Obj).near();

    var msg = gMsg.wait;

    switch (glTokList.status()) {
    case true:
        msg = gMsg.allAvailable;

        led($Obj).set(imgMsgError, msg);
        widDone($Obj, msg);

        break;
    case false:
        led($Obj).set(imgMsgBlink, msg);
        widBlockingRequestStep2($Obj, glTokList.items);

        break;
    case undefined:
        msg = gMsg.someAvailable;

        led($Obj).set(imgMsgError, msg);
        widDone($Obj, msg);

        break;
    default:
        if (!widIsRawTokens())
            return widDone($Obj, gMsg.badTokens);

        if (!widIsPassword())
            return widDone($Obj, gMsg.emptyPassword);

        var tok = engGetTokens(widGetRawTokens(), gCurrentDB.hash);
        var extCb = function () {
            widPreBlockingRequestStep2($Obj);
        }

        led($Obj).set(imgMsgBlink, msg);
        widFillOutTokList($Obj, tok, extCb);

        break;
    }
}

function widBlockingRequestStep2($Obj, items) {
    var n0,
    n1,
    k2,
    g1,
    k3,
    g2,
    o1,
    s,
    line;

    for (var i = 0; i < items.length; i++) {
        if (items[i].status === 3) {
            s = items[i].s;
            n0 = items[i].n;
            k2 = engGetKey(n0 + 2, s, gPassword, gCurrentDB.magic, gCurrentDB.hash);
            g1 = engGetKey(n0 + 2, s, k2, gCurrentDB.magic, gCurrentDB.hash);
            k3 = engGetKey(n0 + 3, s, gPassword, gCurrentDB.magic, gCurrentDB.hash);
            g2 = engGetKey(n0 + 3, s, k3, gCurrentDB.magic, gCurrentDB.hash);
            o1 = engGetKey(n0 + 2, s, g2, gCurrentDB.magic, gCurrentDB.hash);

            line = n0 + ' ' + s + ' ' + g1 + ' ' + o1 + '\n';

            if (0)
                line = s + ' ' + g1 + ' ' + o1 + '\n';

            closestTextArea($Obj).add(line);

        }

        widShowProgressbar(100 * (i + 1) / items.length);
        widShowTokensLog(gMsg.generation);
    }

    var msg = gMsg.nonexistentTokens;
    var img = imgMsgError;

    if (closestTextArea($Obj).val().length > 0) {
        var mergedKeys = $(widGetClosestTextarea($Obj)).val().replace(/\s/g, '');
        line = engGetHash(mergedKeys, 's22').substring(0, 4) + ' ' + gCurrentDB.altname + ' ' + '124151';

        if (0)
            line = engGetHash(mergedKeys, 's22').substring(0, 4) + ' ' + gCurrentDB.altname + ' ' + '24151';

        closestTextArea($Obj).add(line);

        msg = gMsg.ok;
        img = imgMsgOk;
    }

    led($Obj).set(img, msg);
    widDone($Obj, msg);
}

function widPreBlockingAcceptStep1($Obj, click) {
    led($Obj).clear();

    var rawAsgmtKeys = widGetClosestTextarea($Obj).val();

    if (!engIsAsgmtKeys(rawAsgmtKeys))
        return widDone($Obj, gMsg.badKeys);

    if (!widIsPassword())
        return widDone($Obj, gMsg.emptyPassword);

    if (widGetRawTokens().length > 0 && (typeof click == 'undefined'))
        return widContinueButtonClick(widGetClosestContinueButton($Obj));

    glCmdList.clear();
    glTokList.clear();

    var tok = engGetTokens(widGetRawTokens(), gCurrentDB.hash);
    var asgmtKeys = engGetParsedAsgmtKeys(rawAsgmtKeys);
    tok = engGetDnOrRawList(engGetDnList(AsgmtKeys), engGetRawList(tok), gCurrentDB.hash);

    widShowOrderedTokensNames(tok);
    widUpgradeAsgmtKeys($Obj, asgmtKeys, widBlockingAcceptStep1);
}

function widBlockingAcceptStep1($Obj, titleRecord) {
    var n1,
    s,
    k1,
    g1,
    o1,
    addCmd;
    var enc = $('#input_tokens_encrypt').prop('checked');

    for (var i = 0; i < titleRecord.length; i++) {
        n1 = titleRecord[i].n1;
        s = titleRecord[i].s;
        k1 = titleRecord[i].k1;
        g1 = titleRecord[i].g1;
        o1 = titleRecord[i].o1;

        addCmd = 'add * ' + gCurrentDB.name + ' ' + n1 + ' ' + s + ' ' + k1 + ' ' + g1 + ' ' + o1;

        if (enc)
            addCmd = '#' + engGetCipher(addCmd);

        glCmdList.items[i] = {};
        glCmdList.items[i].cmd = addCmd;
        glCmdList.items[i].s = s;
        glCmdList.items[i].raw = '';

    }

    var cb = function (cbData, cmdIdx, progress) {
        cbTokensUpdate(cbData, cmdIdx, progress, $Obj);
    }

    engRunCmdList(glCmdList, cb);
}

function widPreBlockingAcceptStep2($Obj, click) {
    led($Obj).clear();

    var rawAsgmtKeys = widGetClosestTextarea($Obj).val();

    if (!engIsAsgmtKeys(rawAsgmtKeys))
        return widDone($Obj, gMsg.badKeys);

    if (!widIsPassword())
        return widDone($Obj, gMsg.emptyPassword);

    if (widGetRawTokens().length > 0 && (typeof click == 'undefined'))
        return widContinueButtonClick(widGetClosestContinueButton($Obj));

    glCmdList.clear();
    glTokList.clear();

    var tok = engGetTokens(widGetRawTokens(), gCurrentDB.hash);
    var asgmtKeys = engGetParsedAsgmtKeys(rawAsgmtKeys);
    tok = engGetDnOrRawList(engGetDnList(AsgmtKeys), engGetRawList(tok), gCurrentDB.hash);

    widShowOrderedTokensNames(tok);
    widUpgradeAsgmtKeys($Obj, asgmtKeys, widBlockingAcceptStep2);
}

function widBlockingAcceptStep2($Obj, titleRecord) {
    var n1,
    s,
    k1,
    g1,
    o1,
    addCmd;
    var enc = $('#input_tokens_encrypt').prop('checked');

    for (var i = 0; i < titleRecord.length; i++) {
        n1 = titleRecord[i].n1;
        s = titleRecord[i].s;
        k1 = titleRecord[i].k1;
        g1 = titleRecord[i].g1;
        o1 = titleRecord[i].o1;

        addCmd = 'add * ' + gCurrentDB.name + ' ' + n1 + ' ' + s + ' ' + k1 + ' ' + g1 + ' ' + o1;

        if (enc)
            addCmd = '#' + engGetCipher(addCmd);

        glCmdList.items[i] = {};
        glCmdList.items[i].cmd = addCmd;
        glCmdList.items[i].s = s;
        glCmdList.items[i].raw = '';
    }

    var cb = function (cbData, cmdIdx, progress) {
        cbTokensUpdate(cbData, cmdIdx, progress, $Obj);
    }

    engRunCmdList(glCmdList, cb);
}
