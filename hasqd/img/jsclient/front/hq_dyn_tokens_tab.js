// Hasq Technology Pty Ltd (C) 2013-2015

function closestTextArea($obj)
{
    var $textarea = undefined;

    if ($obj)
        $textarea = $obj.closest('.wrap').find('textarea');

    var retObj =
    {
        add : function (data)
        {
            $textarea.val($textarea.val() + data);
        },
        clear : function (data)
        {
            if (typeof data == 'undefined')
                return $textarea.val('');
            $textarea.val('');
            $textarea.val(data);
        },
        clearExcept : function ($obj)
        {
            (arguments.length == 0) ? $textarea.val('') : $('textarea .wrap').not($textarea).val('');
        },
        val : function ()
        {
            return $textarea.val();
        }
    }

    return retObj;
}

function led($obj)
{
    var $led = undefined;

    if ($obj)
        $led = $obj.closest('.wrap').find('img');

    var retObj =
    {
        set : function (img, title)
        {
            if (typeof img == 'undefined')
                return this.clear($obj);

            if ($led.attr('src') != img)
                $led.attr('src', img);

            if (typeof(title) === 'undefined')
                $led.removeAttr('title');
            else if ($led.prop('title', title) != title)
                $led.prop('title', title);

        },
        clear : function ()
        {
            if (typeof $led == 'undefined')
                return $('.led-span')
                .find($('img')).removeAttr('src').removeAttr('title');

            $led.removeAttr('src').removeAttr('title');
        },
        source : function ()
        {
            if (typeof $led !== 'undefined')
                return $led.attr('src');
        }
    }

    return retObj;
}

function widWarningLed($obj, image, text)
{
    var source = led($obj).source();

    if (source == imgMsgError || source == imgMsgWarning || source == image)
        return;

    led($obj).set(image, text);
}

function widShowProgressbar(val)
{
    var $Progressbar = $('#div_progressbar_main');
    val = Math.ceil(val) || 0;
    $Progressbar.progressbar('value', val);
}

function widShowTokensLog(text)
{
    var $Log = $('#div_tokens_log');
    text = text || '&nbsp';
    $Log.html(text);
}

function widShowOrderedTokensNames(arr)
{
    for (var i = 0; i < arr.length; i++)
    {
        if (i == 0)
            widGetRawTokens(arr[i]);
        else
            widGetRawTokens(widGetRawTokens() + ' ' + arr[i]);
    }
}

function widCleanUI($obj)
{
    widShowProgressbar();
    widShowTokensLog();

    var retObj =
    {
        full : function ()
        {
            led().clear();
            $('textarea .wrap').val('');
            widCleanVerifyTab();
        },
        near : function ()
        {
            led($obj).clear();
            closestTextArea($obj).clear();
        }
    }

    return retObj;
}

function widCleanVerifyTab()
{
    $('#table_verify').find('tr:gt(0)').remove();
    led($('#button_verify')).clear();
    $('#div_table_verify').hide();
}

function widGetClosestMainButton($obj)
{
    return $obj.closest('.wrap').find($('.shared-button'));
}

function widGetClosestContinueButton($obj)
{
    return $obj.closest('.wrap').find($('.continue-button'));
}

function widGetClosestWarningTd($obj)
{
    return $obj.closest('.wrap').find($('td .td-warning'));
}

function widGetClosestLed($obj)
{
    return $obj.closest('.wrap').find($('.led-span'));
}

function widGetClosestTextarea($obj)
{
    return $obj.closest('.wrap').find($('textarea'));
}

function widDisableTokensInput()
{
    var $obj = $('#div_tokens_tabs');
    $obj.tabs('option', 'disabled', true);
    $obj
    .closest('div[id^="tabs"]')
    .find('button, input, textarea')
    .prop('disabled', true);

    $obj
    .closest('div[id^="tabs"]')
    .find('textarea:first')
    .prop('disabled', false);
}

function widEnableTokensInput()
{
    var $obj = $('#div_tokens_tabs');
    $obj.tabs('enable');

    $obj
    .closest('div[id^="tabs"]')
    .find('button, input, textarea')
    .prop('disabled', false);
}

function widDisableAllTokensUI($obj)
{
    var $Tabs = $('#div_tokens_tabs');
    $Tabs.tabs('option', 'disabled', true);

    $Tabs
    .closest('div[id^="tabs"]')
    .find('button, input, textarea')
    .prop('disabled', true);

    $(widGetClosestContinueButton($obj)).prop('disabled', false);
    $(widGetClosestMainButton($obj)).prop('disabled', false);
}

function widEnableAllTokensUI()
{
    var $obj = $('#div_tokens_tabs');
    $obj.tabs('enable');

    $obj.closest('div[id^="tabs"]')
    .find('button, input, textarea')
    .prop('disabled', false);
}

function widSwitchShowHide($obj)
{
    if ($obj.css('display') === 'none')
        $obj.fadeIn();
    else
        $obj.hide();
}

function widGetWarningsMode($obj)
{
    return ($obj.button('option', 'label') == gButton.continueBtn) ? true : false;
}

function widGetButtonsMode($obj)
{
    var label = $obj.button('option', 'label');
    var title = $obj.attr('data-title');
    var objC = widGetClosestContinueButton($obj);
    var cMode = widGetWarningsMode(objC);

    if ($obj == objC && cMode)
        return true;

    if (label == title)
        return true;

    return false;
}

function widGetFunctionById($obj, click)
{
    glCmdList.clear();
    var fName = $obj.attr('data-function');

    fName = (arguments.length > 1) ? fName + '($obj, click)' : fName + '($obj)';

    return function ()
    {
        eval(fName);
    }
}

function widSwitchButtonsMode($obj)
{
    var title = $obj.attr('data-title');
    var label = $obj.button('option', 'label');
    var objWarning = widGetClosestWarningTd($obj);
    var objContinue = widGetClosestContinueButton($obj);

    if (label === title && title === gButton.continueBtn)
    {
        widSwitchShowHide($obj);
        widSwitchShowHide(objWarning);
        $obj.button('option', 'label', gButton.hiddenBtn);
        return;
    }

    if (label !== title && title === gButton.continueBtn)
    {
        widSwitchShowHide($obj);
        widSwitchShowHide(objWarning);
        $obj.button('option', 'label', title);
        return;
    }

    if (label === title)
        return $obj.button('option', 'label', 'Cancel');

    $obj.button('option', 'label', title);

    if (widGetWarningsMode(objContinue))
    {
        widSwitchShowHide(objContinue);
        widSwitchShowHide(objWarning);
        $(objContinue).button('option', 'label', gButton.hiddenBtn);
    }
}

function widMainButtonClick($obj, text)
{
    var f;

    if (widGetButtonsMode($obj))
    {
        widDisableAllTokensUI($obj);
        f = widGetFunctionById($obj);
    }
    else
    {
        f = function ()
        {
            widCancel($obj, text);
        }
    }

    widSwitchButtonsMode($obj);
    setTimeout(f);
}

function widDone($obj, text)
{
    widMainButtonClick($obj, text);
}

function widCancel($obj, text)
{
    glCmdList.clear();

    if (!text)
    {
        text = gMsg.cancel;
        glTokList.clear();
        widWarningLed($obj, imgMsgError, text);
    };

    widShowTokensLog(text);
    widEnableAllTokensUI();
}

function widContinueButtonClick($obj, click)
{
    var label = $obj.button('option', 'label');
    widSwitchButtonsMode($obj);

    (click)
    ? setTimeout(widGetFunctionById(widGetClosestMainButton($obj), click))
    : widShowTokensLog(gMsg.userWait);

}

function widTokensIdxOninput($obj)
{
    $obj.val(engGetOnlyNumber($obj.val()));
}

function widTokensPasswordOninput(data)
{
    gPassword = data;
    glTokList.clear();
    led().clear();
    widCleanVerifyTab();
}

function widGetRawTokens(data)
{
    $Text = $('#textarea_tokens_names');

    if (data)
        return $Text.val(data);

    return $Text.val();
}

function widIsPassword()
{
    return ($('#input_tokens_password').val().length > 0);
}

function widIsRawTokens()
{
    return (widGetRawTokens().length > 0 && engIsRawTokens(widGetRawTokens(), gCurrentDB.hash));
}

function widGetRangeDataState()
{
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

function widTokensNamesOninput($obj)
{
    glTokList.clear();
    widCleanUI().full();
    widShowBordersColor($obj);

    var tokens = $obj.val();

    if (!engIsRawTokens(tokens, gCurrentDB.hash))
    {
        widDisableTokensInput();
        widShowBordersColor($obj, '#FF0000'); //RED BORDER
        widShowTokensLog(gMsg.namePlaceholder);
    }
    else if (tokens.length >= 15479)
    {
        widEnableTokensInput();
        widShowBordersColor($obj, '#FFFF00'); //YELLOW BORDER
        var l = 16511 - tokens.length;
        $obj.prop('title', gMsg.charsLeft + l );
        widShowTokensLog();
    }
    else
    {
        widEnableTokensInput();
        widShowBordersColor($obj);
        widShowTokensLog();
    }
}

function widAddTokens($obj, data)
{
    var $Basename = $('#input_tokens_basename');
    var $FirstIdx = $('#input_fst_idx');
    var $LastIdx = $('#input_lst_idx');
    var chk = widGetRangeDataState();

    if (chk !== gMsg.ok)
        return widDone($obj, chk);

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
    else if (idx0 != '' && idx1 != '')
    {
        var idx0 = +idx0;
        var idx1 = +idx1;

        for (var i = idx0; i <= idx1; i++)
            newTokens =
                (i == idx1)
                ? newTokens + '[' + baseName + i + ']'
                : newTokens + '[' + baseName + i + ']' + '\u0020';
    }
    else
    {
        newTokens += '[' + baseName + ']' + '\u0020';
        var idx0 = +idx0;
        var idx1 = +idx1;

        for (var i = idx0; i <= idx1; i++)
        {
            newTokens =
                (i == idx1)
                ? newTokens + '[' + baseName + i + ']'
                : newTokens + '[' + baseName + i + ']' + '\u0020';
        }
    }

    rawTok += newTokens;

    if (rawTok.length <= 16511)
    {
        widGetRawTokens(rawTok);
        widGetRawTokens();
        //objNames[0].oninput();
        $Basename.val('');
        $FirstIdx.val('');
        $LastIdx.val('');
        widDone($obj, gMsg.ok);
    }
    else
        widDone($obj, gMsg.manyTokens);
}

function widPreCreate($obj)
{
    glCmdList.clear();
    glTokList.clear();

    if (!widIsRawTokens())
        return widDone($obj, gMsg.badTokens);

    if (!widIsPassword())
        return widDone($obj, gMsg.emptyPassword);

    led($obj).set(imgMsgBlink, gMsg.wait);

    var tokens = engGetTokens(widGetRawTokens(), gCurrentDB.hash);
    widCreateTokens($obj, tokens);
}

function widCreateTokens($obj, tokens)
{
    var enc = $('#input_tokens_encrypt').prop('checked');

    var cbFunc = function (cbData, cmdIdx, progress)
    {
        if (glCmdList.items.length === 0)
            return;

        widShowProgressbar(progress);
        widShowTokensLog(gMsg.creating);

        var resp = engGetResponseHeader(cbData);


        if ( resp === 'REQ_ZERO_POLICY' || resp === 'REQ_BAD_CRYPT')
        {
            widWarningLed($obj, imgMsgError, gMsg.error + resp);
            return widDone($obj, resp);
        }

        if ( resp !== 'OK' )
            widWarningLed($obj, imgMsgWarning, gMsg.error + resp);

        if ( !(cmdIdx + 1 < glCmdList.items.length) )
        {
            widWarningLed($obj, imgMsgOk, resp);
            widDone($obj, resp);
        }
    }

    for (var i = 0; i < tokens.length; i++)
    {
        var r = engGetRecord(0, tokens[i].s, gPassword, null, null, gCurrentDB.magic, gCurrentDB.hash);
        var zCmd = 'z * ' + gCurrentDB.name + ' 0 ' + tokens[i].s + ' ' + r.k + ' ' + r.g + ' ' + r.o + ' ';
        var lastCmd = 'last ' + gCurrentDB.name + ' ' + tokens[i].s;

        if ( enc )
        {
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

function widAddVerifyTR(rec, statePic)
{
    var $Table = $('#table_verify');
    var pic = '<img src="' + statePic.img + '" title="' + statePic.title + '"></img>';
    var tr = widGetHTMLTr(widGetHTMLTd(pic + rec.state) + widGetHTMLTd(rec.raw) + widGetHTMLTd(rec.s) + widGetHTMLTd(rec.n) + widGetHTMLTd(rec.d));
    $Table.append(tr);
}

function widGetTokenStateImg(status)
{
    // Returns an image source and title displaying tokens/password state
    var r = {};

    switch (status)
    {
        case 'OK':
            r.img = imgPwdOk;
            r.title = gTokStateMsg.ok;
            break;
        case 'PWD_SNDNG':
            r.img = imgPwdSndng;
            r.title = gTokStateMsg.sending;
            break;
        case 'PWD_RCVNG':
            r.img = imgPwdRcvng;
            r.title = gTokStateMsg.receiving;
            break;
        case 'PWD_WRONG':
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

function widPreVerify($obj)
{
    glCmdList.clear();
    glTokList.clear();
    widCleanVerifyTab();

    if (!widIsRawTokens())
        return widDone($obj, gMsg.badTokens);

    if (!widIsPassword())
        return widDone($obj, gMsg.emptyPassword);

    var $TableArea = $('#div_table_verify');
    var width = $obj.closest('.wrap').outerWidth() - 6;
    var maxHeight =
        (($(window).height() - $('body').height()) > 200)
         ? ($(window).height() - $('body').height()) / 2
        : 100;

    $TableArea.outerWidth(width);
    $TableArea.css('max-height', maxHeight + 'px');
    $TableArea.show();

    var tokens = engGetTokens(widGetRawTokens(), gCurrentDB.hash);
    led($obj).set(imgMsgBlink, gMsg.wait);
    widVerifyTokens($obj, tokens);
}

function widVerifyTokens($obj, tokens)
{
    var enc = $('#input_tokens_encrypt').prop('checked');
    var cbFunc = function (ajxData, cmdIdx, progress)
    {
        if (glCmdList.items.length == 0)
            return;

        var resp = engGetResponseHeader(ajxData);

        if (resp !== 'OK' && resp !== 'IDX_NODN')
        {
            widWarningLed($obj, imgMsgError, gMsg.error + resp);
            return widDone($obj, resp);
        }

        widShowProgressbar(progress);
        widShowTokensLog(gMsg.verifying);

        var item = engGetTokenInfo(ajxData, glCmdList.items[cmdIdx].raw, glCmdList.items[cmdIdx].s);
        glTokList.add(item);

        var idx = glTokList.items.length - 1;

        var lineLed = widGetTokenStateImg(glTokList.items[idx].state);
        console.log(glTokList.items[idx].state);
        console.log(lineLed);
        widAddVerifyTR(glTokList.items[idx], lineLed);

        if (glTokList.unfit)
            widWarningLed($obj, imgMsgWarning, gMsg.someUnavailable);

        if (!(cmdIdx + 1 < glCmdList.items.length))
        {
            widWarningLed($obj, imgMsgOk, gMsg.ok);
            widDone($obj, gMsg.ok);
        }
    }

    for (var i = 0; i < tokens.length; i++)
    {
        var lastCmd = 'last ' + gCurrentDB.name + ' ' + tokens[i].s;

        if ( enc )
            lastCmd = '#' + engGetCipher(lastCmd);

        glCmdList.items[i] = {};
        glCmdList.items[i].cmd = lastCmd;
        glCmdList.items[i].raw = tokens[i].raw;
        glCmdList.items[i].s = tokens[i].s;
    }

    engRunCmdList(glCmdList, cbFunc);
}

function widFillOutTokList($obj, tokens, extCb)
{
    glTokList.clear();
    glCmdList.clear();

    var enc = $('#input_tokens_encrypt').prop('checked');
    var cbFunc = function (cbData, cmdIdx, progress)
    {
        if (glCmdList.items.length == 0)
            return led().clear();

        var resp = engGetResponseHeader(cbData);

        if (resp !== 'OK' && resp !== 'IDX_NODN')
        {
            widWarningLed($obj, imgMsgError, gMsg.error + resp)
            return widDone($obj, resp);
        }

        widShowProgressbar(progress);

        var item = engGetTokenInfo(cbData, glCmdList.items[cmdIdx].raw, glCmdList.items[cmdIdx].s);

        glTokList.add(item);

        var idx = glTokList.items.length - 1;

        (cmdIdx + 1 < glCmdList.items.length)
        ? widShowTokensLog(gMsg.makelist)
        : setTimeout(extCb);
    }

    for (var i = 0; i < tokens.length; i++)
    {
        var lastCmd = 'last ' + gCurrentDB.name + ' ' + tokens[i].s;

        if ( enc )
            lastCmd = '#' + engGetCipher(lastCmd);

        glCmdList.items[i] = {};
        glCmdList.items[i].cmd = lastCmd;
        glCmdList.items[i].raw = (tokens[i].raw !== undefined) ? tokens[i].raw : '';
        glCmdList.items[i].s = tokens[i].s;
    }

    engRunCmdList(glCmdList, cbFunc);
}

function cbTokensUpdate(cbData, cmdIdx, progress, $obj)
{
    // callback function for all functions which update tokens;
    var msg = gMsg.noTokensOrKeys;
    var resp = engGetResponseHeader(cbData);

    if (glCmdList.items.length == 0)
    {
        widWarningLed($obj, imgMsgWarning, msg);
        return widDone($obj, msg);
    }

    msg = gMsg.processing;
    widShowProgressbar(progress);
    widShowTokensLog(msg);

    if ( resp === 'REQ_BAD_CRYPT')
    {
        widWarningLed($obj, imgMsgError, gMsg.error + resp);
        return widDone($obj, resp);
    }

    (resp !== 'OK' && resp !== 'IDX_NODN')
    ? widWarningLed($obj, imgMsgWarning, gMsg.error + resp)
    : widWarningLed($obj, imgMsgBlink, msg)

    if (!(cmdIdx + 1 < glCmdList.items.length))
    {
        widWarningLed($obj, imgMsgOk, gMsg.ok);
        return widDone($obj, gMsg.done);
    }
}

function widPreUpdate($obj, click)
{
    glCmdList.clear();
    widCleanUI().full();

    var d = $obj.closest('.wrap').find('input').val();
    var msg = gMsg.wait;

    switch (glTokList.state())
    {
        case true:
            led($obj).set(imgMsgBlink, msg);
            widUpdateTokens($obj, d, glTokList.items);
            break;
        case false:
            msg = gMsg.unknown;
            led($obj).set(imgMsgError, msg);
            widDone($obj, msg);
            break;
        case undefined:
            (typeof click == 'undefined')
            ? widContinueButtonClick(widGetClosestContinueButton($obj))
            : widUpdateTokens($obj, d, glTokList.items);
            break;
        default:
                if (!widIsRawTokens())
                    return widDone($obj, gMsg.badTokens);
            if (!widIsPassword())
                return widDone($obj, gMsg.emptyPassword);

            led($obj).set(imgMsgBlink, msg);

            var tokens = engGetTokens(widGetRawTokens(), gCurrentDB.hash);
            var extCb = function ()
            {
                widPreUpdate($obj, click);
            }

            widFillOutTokList($obj, tokens, extCb);
            break;
    }
}

function widUpdateTokens($obj, data, items)
{
    var enc = $('#input_tokens_encrypt').prop('checked');

    glTokList.clear();

    for (var i = 0; i < items.length; i++)
    {
        if (items[i].state == 'OK' && items[i].d != data)
        {
            var n = +items[i].n + 1;
            var s = items[i].s;
            var r = engGetRecord(n, s, gPassword, null, null, gCurrentDB.magic, gCurrentDB.hash);
            var addCmd = 'add *' + ' ' + gCurrentDB.name + ' ' + n + ' ' + s + ' ' + r.k + ' ' + r.g + ' ' + r.o + ' ' + data;
            var lastCmd = 'last' + ' ' + gCurrentDB.name + ' ' + s;

            if ( enc )
            {
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

    var cb = function (cbData, cmdIdx, progress)
    {
        cbTokensUpdate(cbData, cmdIdx, progress, $obj);
    }

    engRunCmdList(glCmdList, cb);
}

function widUpgradeAcceptKeys($obj, acceptKeys, func)
{
    //if acceptKeys not contains numbers of records , makes 'last' and update acceptKeys records numbers;
    glCmdList.clear();
    var prCode = acceptKeys[0].prcode;

    if (prCode.charAt(0) === '2' && glTokList.items.length === 0)
    {
        var extCb = function ()
        {
            widUpgradeAcceptKeys($obj, acceptKeys, func);
        }

        return widFillOutTokList($obj, acceptKeys, extCb);
    }
    else if (prCode.charAt(0) === '2' && glTokList.items.length > 0)
    {
        if (acceptKeys.length !== glTokList.items.length)
            return widDone($obj, gMsg.keysError);

        acceptKeys = engGetNumberedAcceptKeys(acceptKeys, glTokList.items);
    }

    var titleRecord = engGetTitleRecord(acceptKeys, gPassword, gCurrentDB.hash, gCurrentDB.magic);
    var f = function ()
    {
        func($obj, titleRecord);
    }
    setTimeout(f);
}

function widPreSimpleSend($obj)
{
    glCmdList.clear();
    widCleanUI($obj).near();
    var msg = gMsg.wait;

    switch (glTokList.state())
    {
        case true:

            led($obj).set(imgMsgBlink, msg);
            widSimpleSend($obj, glTokList.items);

            break;
        case false:
            msg = gMsg.allUnavailable;
            led($obj).set(imgMsgError, msg);

            if (closestTextArea($obj).val().length > 0)
                closestTextArea($obj).clear();

            widDone($obj, msg);

            break;
        case undefined:
            msg = gMsg.someUnavailable;
            led($obj).set(imgMsgError, msg);

            if (closestTextArea($obj).val().length > 0)
                closestTextArea($obj).clear();

            widDone($obj, msg);

            break;
        default:
                if (!widIsRawTokens())
                    return widDone($obj, gMsg.badTokens);

            if (!widIsPassword())
                return widDone($obj, gMsg.emptyPassword);

            led($obj).set(imgMsgBlink, msg);

            var tok = engGetTokens(widGetRawTokens(), gCurrentDB.hash);
            var extCb = function ()
            {
                widPreSimpleSend($obj);
            }

            widFillOutTokList($obj, tok, extCb);

            break;
    }
}

function widSimpleSend($obj, items)
{
    var k1,
        k2,
        line;

    for (var i = 0; i < items.length; i++)
    {
        if (items[i].state == 'OK')
        {
            k1 = engGetKey(items[i].n + 1, items[i].s, gPassword, gCurrentDB.magic, gCurrentDB.hash);
            k2 = engGetKey(items[i].n + 2, items[i].s, gPassword, gCurrentDB.magic, gCurrentDB.hash);
            line = items[i].n + ' ' + items[i].s + ' ' + k1 + ' ' + k2 + '\n';

            if (0)
                line = items[i].s + ' ' + k1 + ' ' + k2 + '\n';

            closestTextArea($obj).add(line);
        }

        widShowProgressbar(100 * (i + 1) / items.length);
        widShowTokensLog(gMsg.generation);
    }

    var mergedKeys = widGetClosestTextarea($obj).val().replace(/\s/g, '');
    line = engGetHash(mergedKeys, 's22').substring(0, 4) + ' ' + gCurrentDB.altname + ' ' + '123132';

    if (0)
        line = engGetHash(mergedKeys, 's22').substring(0, 4) + ' ' + gCurrentDB.altname + ' ' + '23132';

    closestTextArea($obj).add(line);
    led($obj).set(imgMsgOk, gMsg.ok);

    widDone($obj, gMsg.ok);
}

function widPreSimpleReceive($obj, click)
{
    led($obj).clear();
    var rawAcceptKeys = widGetClosestTextarea($obj).val();

    if (!engIsAcceptKeys(rawAcceptKeys))
        return widDone($obj, gMsg.badKeys);

    if (!widIsPassword)
        return widDone($obj, gMsg.emptyPassword);

    if (widGetRawTokens().length > 0 && (typeof click == 'undefined'))
        return widContinueButtonClick(widGetClosestContinueButton($obj));

    glCmdList.clear();
    glTokList.clear();

    var tok = engGetTokens(widGetRawTokens(), gCurrentDB.hash);
    var acceptKeys = engGetParsedAcceptKeys(rawAcceptKeys);
    tok = engGetDnOrRawList(engGetDnList(acceptKeys), engGetRawList(tok), gCurrentDB.hash);
    widShowOrderedTokensNames(tok);
    widUpgradeAcceptKeys($obj, acceptKeys, widSimpleReceive);
}

function widSimpleReceive($obj, titleRecord)
{
    var enc = $('#input_tokens_encrypt').prop('checked');

    for (var i = 0; i < titleRecord.length; i++)
    {
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

        if ( enc )
        {
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

    var cb = function (cbData, cmdIdx, progress)
    {
        cbTokensUpdate(cbData, cmdIdx, progress, $obj);
    }

    engRunCmdList(glCmdList, cb);
}

function widPreSimpleRequest($obj)
{
    glCmdList.clear();
    widCleanUI($obj).near();
    var msg = gMsg.wait;

    switch (glTokList.state())
    {
        case true:
            msg = gMsg.allAvailable;
            led($obj).set(imgMsgError, msg);
            widDone($obj, msg);
            break;
        case false:
            led($obj).set(imgMsgBlink, msg);
            widSimpleRequest($obj, glTokList.items);
            break;
        case undefined:
            msg = gMsg.someAvailable;
            led($obj).set(imgMsgError, msg);
            widDone($obj, msg);
            break;
        default:
                if (!widIsRawTokens())
                    return widDone($obj, gMsg.badTokens);

            if (!widIsPassword())
                return widDone($obj, gMsg.emptyPassword);

            var tok = engGetTokens(widGetRawTokens(), gCurrentDB.hash);
            var extCb = function ()
            {
                widPreSimpleRequest($obj);
            }

            led($obj).set(imgMsgBlink, msg);
            widFillOutTokList($obj, tok, extCb);
            break;
    }
}

function widSimpleRequest($obj, items)
{
    var k3,
        k4,
        g2,
        g3,
        o2,
        line;

    for (var i = 0; i < items.length; i++)
    {
        if (items[i].state === 'PWD_WRONG')
        {
            k3 = engGetKey(items[i].n + 3, items[i].s, gPassword, gCurrentDB.magic, gCurrentDB.hash);
            k4 = engGetKey(items[i].n + 4, items[i].s, gPassword, gCurrentDB.magic, gCurrentDB.hash);
            g2 = engGetKey(items[i].n + 3, items[i].s, k3, gCurrentDB.magic, gCurrentDB.hash);
            g3 = engGetKey(items[i].n + 4, items[i].s, k4, gCurrentDB.magic, gCurrentDB.hash);
            o2 = engGetKey(items[i].n + 3, items[i].s, g3, gCurrentDB.magic, gCurrentDB.hash);
            line = items[i].n + ' ' + items[i].s + ' ' + g2 + ' ' + o2 + '\n';

            if (0)
                line = items[i].s + ' ' + g2 + ' ' + o2 + '\n';

            closestTextArea($obj).add(line);
        }

        widShowProgressbar(100 * (i + 1) / items.length);
        widShowTokensLog(gMsg.generation);
    }

    var msg = gMsg.nonexistentTokens;
    var img = imgMsgError;

    if (closestTextArea($obj).val().length > 0)
    {
        var mergedKeys = $(widGetClosestTextarea($obj)).val().replace(/\s/g, '');
        line = engGetHash(mergedKeys, 's22').substring(0, 4) + ' ' + gCurrentDB.altname + ' ' + '124252';

        if (0)
            line = engGetHash(mergedKeys, 's22').substring(0, 4) + ' ' + gCurrentDB.altname + ' ' + '24252';

        closestTextArea($obj).add(line);

        msg = gMsg.ok;
        img = imgMsgOk;
    }

    led($obj).set(img, msg);
    widDone($obj, msg);
}

function widPreSimpleAccept($obj, click)
{
    led($obj).clear();

    var rawAcceptKeys = widGetClosestTextarea($obj).val();

    if (!engIsAcceptKeys(rawAcceptKeys))
        return widDone($obj, gMsg.badKeys);

    if (!widIsPassword())
        return widDone($obj, gMsg.emptyPassword);

    if (widGetRawTokens().length > 0 && (typeof click == 'undefined'))
        return widContinueButtonClick(widGetClosestContinueButton($obj));

    glCmdList.clear();
    glTokList.clear();

    var tok = engGetTokens(widGetRawTokens(), gCurrentDB.hash);
    var acceptKeys = engGetParsedAcceptKeys(rawAcceptKeys);

    tok = engGetDnOrRawList(engGetDnList(acceptKeys), engGetRawList(tok), gCurrentDB.hash);
    widShowOrderedTokensNames(tok);
    widUpgradeAcceptKeys($obj, acceptKeys, widSimpleAccept);
}

function widSimpleAccept($obj, titleRecord)
{
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

    for (var i = 0; i < titleRecord.length; i++)
    {
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

        if ( enc )
        {
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

    var cb = function (cbData, cmdIdx, progress)
    {
        cbTokensUpdate(cbData, cmdIdx, progress, $obj);
    }

    engRunCmdList(glCmdList, cb);
}

function widPreBlockingSendStep1($obj)
{
    glCmdList.clear();
    widCleanUI($obj).near();

    var msg = gMsg.wait;

    switch (glTokList.state())
    {
        case true:
            led($obj).set(imgMsgBlink, msg);
            widBlockingSendStep1($obj, glTokList.items);

            break;
        case false:
            msg = gMsg.allUnavailable;
            led($obj).set(imgMsgError, msg);

            if (closestTextArea($obj).val().length > 0)
                closestTextArea($obj).clear();

            widDone($obj, msg);

            break;
        case undefined:
            msg = gMsg.someUnavailable;
            led($obj).set(imgMsgError, msg);

            if (closestTextArea($obj).val().length > 0)
                closestTextArea($obj).clear();

            widDone($obj, msg);

            break;
        default:
                if (!widIsRawTokens())
                    return widDone($obj, gMsg.badTokens);

            if (!widIsPassword())
                return widDone($obj, gMsg.emptyPassword);

            led($obj).set(imgMsgBlink, msg);

            var tok = engGetTokens(widGetRawTokens(), gCurrentDB.hash);
            var extCb = function ()
            {
                widPreBlockingSendStep1($obj);
            }

            widFillOutTokList($obj, tok, extCb);

            break;
    }
}

function widBlockingSendStep1($obj, items)
{
    var n0,
        k1,
        k2,
        g1,
        line;

    for (var i = 0; i < items.length; i++)
    {
        if (items[i].state === 'OK')
        {
            k1 = engGetKey(items[i].n + 1, items[i].s, gPassword, gCurrentDB.magic, gCurrentDB.hash);
            k2 = engGetKey(items[i].n + 2, items[i].s, gPassword, gCurrentDB.magic, gCurrentDB.hash);
            g1 = engGetKey(items[i].n + 2, items[i].s, k2, gCurrentDB.magic, gCurrentDB.hash);
            line = items[i].n + ' ' + items[i].s + ' ' + k1 + ' ' + g1 + '\n';

            if (0)
                line = items[i].s + ' ' + k1 + ' ' + g1 + '\n';

            closestTextArea($obj).add(line);
        }

        widShowProgressbar(100 * (i + 1) / items.length);
        widShowTokensLog(gMsg.generation);
    }

    var mergedKeys = widGetClosestTextarea($obj).val().replace(/\s/g, '');
    line = engGetHash(mergedKeys, 's22').substring(0, 4) + ' ' + gCurrentDB.altname + ' ' + '123141';

    if (0)
        line = engGetHash(mergedKeys, 's22').substring(0, 4) + ' ' + gCurrentDB.altname + ' ' + '23141';

    closestTextArea($obj).add(line);
    led($obj).set(imgMsgOk, gMsg.ok);

    widDone($obj, gMsg.ok);
}

function widPreBlockingSendStep2($obj)
{
    glCmdList.clear();
    widCleanUI($obj).near();
    var msg = gMsg.wait;

    switch (glTokList.state())
    {
        case true:
            msg = gMsg.allAvailable;
            led($obj).set(imgMsgError, msg);

            if (closestTextArea($obj).val().length > 0)
                closestTextArea($obj).clear();

            widDone($obj, msg);

            break;
        case false:
            led($obj).set(imgMsgBlink, msg);
            widBlockingSendStep2($obj, glTokList.items);

            break;
        case undefined:
            msg = gMsg.someAvailable;
            led($obj).set(imgMsgError, msg);

            if (closestTextArea($obj).val().length > 0)
                closestTextArea($obj).clear();

            widDone($obj, msg);

            break;
        default:
                if (!widIsRawTokens())
                    return widDone($obj, gMsg.badTokens);

            if (!widIsPassword())
                return widDone($obj, gMsg.emptyPassword);

            led($obj).set(imgMsgBlink, msg);

            var tok = engGetTokens(widGetRawTokens(), gCurrentDB.hash);
            var extCb = function ()
            {
                widPreBlockingSendStep2($obj);
            }

            widFillOutTokList($obj, tok, extCb);

            break;
    }
}

function widBlockingSendStep2($obj, items)
{
    for (var i = 0; i < items.length; i++)
    {
        if (items[i].state === 'PWD_SNDNG')
        {
            //include only tokens in sending state;
            var n0 = items[i].n;
            var n1 = items[i].n + 1;
            var k1 = engGetKey(n1, items[i].s, gPassword, gCurrentDB.magic, gCurrentDB.hash);
            var line = n0 + ' ' + items[i].s + ' ' + k1 + '\n';

            if (0)
                line = items[i].s + ' ' + k1 + '\n';

            closestTextArea($obj).add(line);
        }

        widShowProgressbar(100 * (i + 1) / items.length);
        widShowTokensLog(gMsg.generation);
    }

    var msg,
        img;

    if (closestTextArea($obj).val().length == 0)
    {
        msg = gMsg.nonexistentTokens;
        img = imgMsgError;
    }
    else
    {
        var mergedKeys = widGetClosestTextarea($obj).val().replace(/\s/g, '');
        line = engGetHash(mergedKeys, 's22').substring(0, 4) + ' ' + gCurrentDB.altname + ' ' + '1231';

        if (0)
            var line = engGetHash(mergedKeys, 's22').substring(0, 4) + ' ' + gCurrentDB.altname + ' ' + '231';

        closestTextArea($obj).add(line);
        msg = gMsg.ok;
        img = imgMsgOk;
    }

    led($obj).set(img, msg);
    widDone($obj, msg);
}

function widPreBlockingReceiveStep1($obj, click)
{
    led($obj).clear();
    var rawAcceptKeys = widGetClosestTextarea($obj).val();

    if (!engIsAcceptKeys(rawAcceptKeys))
        return widDone($obj, gMsg.badKeys);

    if (!widIsPassword)
        return widDone($obj, gMsg.emptyPassword);

    if (widGetRawTokens().length > 0 && (typeof click == 'undefined'))
        return widContinueButtonClick(widGetClosestContinueButton($obj));

    glCmdList.clear();
    glTokList.clear();

    var tok = engGetTokens(widGetRawTokens(), gCurrentDB.hash);
    var acceptKeys = engGetParsedAcceptKeys(rawAcceptKeys);
    tok = engGetDnOrRawList(engGetDnList(acceptKeys), engGetRawList(tok), gCurrentDB.hash);
    widShowOrderedTokensNames(tok);
    widUpgradeAcceptKeys($obj, acceptKeys, widBlockingReceiveStep1);
}

function widBlockingReceiveStep1($obj, titleRecord)
{
    var n1,
        s,
        k1,
        g1,
        o1,
        addCmd;
    var enc = $('#input_tokens_encrypt').prop('checked');

    for (var i = 0; i < titleRecord.length; i++)
    {
        n1 = titleRecord[i].n1;
        s = titleRecord[i].s;
        k1 = titleRecord[i].k1;
        g1 = titleRecord[i].g1;
        o1 = titleRecord[i].o1;

        addCmd = 'add * ' + gCurrentDB.name + ' ' + n1 + ' ' + s + ' ' + k1 + ' ' + g1 + ' ' + o1;

        if ( enc )
            addCmd = '#' + engGetCipher(addCmd);

        glCmdList.items[i] = {};
        glCmdList.items[i].cmd = addCmd;
        glCmdList.items[i].s = s;
        glCmdList.items[i].raw = '';
    }

    var cb = function (cbData, cmdIdx, progress)
    {
        cbTokensUpdate(cbData, cmdIdx, progress, $obj);
    }

    engRunCmdList(glCmdList, cb);
}

function widPreBlockingReceiveStep2($obj, click)
{
    led($obj).clear();

    var rawAcceptKeys = widGetClosestTextarea($obj).val();

    if (!engIsAcceptKeys(rawAcceptKeys))
        return widDone($obj, gMsg.badKeys);

    if (!widIsPassword)
        return widDone($obj, gMsg.emptyPassword);

    if (widGetRawTokens().length > 0 && (typeof click == 'undefined'))
        return widContinueButtonClick(widGetClosestContinueButton($obj));

    glCmdList.clear();
    glTokList.clear();

    var tok = engGetTokens(widGetRawTokens(), gCurrentDB.hash);
    var acceptKeys = engGetParsedAcceptKeys(rawAcceptKeys);

    tok = engGetDnOrRawList(engGetDnList(acceptKeys), engGetRawList(tok), gCurrentDB.hash);
    widShowOrderedTokensNames(tok);
    widUpgradeAcceptKeys($obj, acceptKeys, widBlockingReceiveStep2);
}

function widBlockingReceiveStep2($obj, titleRecord)
{
    var n1,
        s,
        k1,
        g1,
        o1,
        addCmd;
    var enc = $('#input_tokens_encrypt').prop('checked');

    for (var i = 0; i < titleRecord.length; i++)
    {
        n1 = titleRecord[i].n1;
        s = titleRecord[i].s;
        k1 = titleRecord[i].k1;
        g1 = titleRecord[i].g1;
        o1 = titleRecord[i].o1;

        addCmd = 'add * ' + gCurrentDB.name + ' ' + n1 + ' ' + s + ' ' + k1 + ' ' + g1 + ' ' + o1;

        if ( enc )
            addCmd = '#' + engGetCipher(addCmd);

        glCmdList.items[i] = {};
        glCmdList.items[i].cmd = addCmd;
        glCmdList.items[i].s = s;
        glCmdList.items[i].raw = '';
    }

    var cb = function (cbData, cmdIdx, progress)
    {
        cbTokensUpdate(cbData, cmdIdx, progress, $obj);
    }

    engRunCmdList(glCmdList, cb);
}

function widPreBlockingRequestStep1($obj)
{
    glCmdList.clear();
    widCleanUI($obj).near();

    var msg = gMsg.wait;

    switch (glTokList.state())
    {
        case true:
            msg = gMsg.allAvailable;
            led($obj).set(imgMsgError, msg);

            widDone($obj, msg);

            break;
        case false:
            led($obj).set(imgMsgBlink, msg);
            widBlockingRequestStep1($obj, glTokList.items);

            break;
        case undefined:
            msg = gMsg.someAvailable;
            led($obj).set(imgMsgError, msg);

            widDone($obj, msg);

            break;
        default:
                if (!widIsRawTokens())
                    return widDone($obj, gMsg.badTokens);

            if (!widIsPassword())
                return widDone($obj, gMsg.emptyPassword);

            var tok = engGetTokens(widGetRawTokens(), gCurrentDB.hash);
            var extCb = function ()
            {
                widPreBlockingRequestStep1($obj);
            }

            led($obj).set(imgMsgBlink, msg);

            widFillOutTokList($obj, tok, extCb);

            break;
    }
}

function widBlockingRequestStep1($obj, items)
{
    var n0,
        k3,
        g2,
        o1,
        line;

    for (var i = 0; i < items.length; i++)
    {
        if (items[i].state === 'PWD_WRONG')
        {
            n0 = items[i].n;
            k3 = engGetKey(n0 + 3, items[i].s, gPassword, gCurrentDB.magic, gCurrentDB.hash);
            g2 = engGetKey(n0 + 3, items[i].s, k3, gCurrentDB.magic, gCurrentDB.hash);
            o1 = engGetKey(n0 + 2, items[i].s, g2, gCurrentDB.magic, gCurrentDB.hash);
            line = items[i].n + ' ' + items[i].s + ' ' + o1 + '\n';

            if (0)
                line = items[i].s + ' ' + o1 + '\n';

            closestTextArea($obj).add(line);
        }

        widShowProgressbar(100 * (i + 1) / items.length);
        widShowTokensLog(gMsg.generation);
    }

    var msg = gMsg.nonexistentTokens
              var img = imgMsgError;

    if (closestTextArea($obj).val().length > 0)
    {
        var rawAcceptKeys = $(widGetClosestTextarea($obj)).val().replace(/\s/g, '');
        line = engGetHash(rawAcceptKeys, 's22').substring(0, 4) + ' ' + gCurrentDB.altname + ' ' + '1251';

        if (0)
            line = engGetHash(rawAcceptKeys, 's22').substring(0, 4) + ' ' + gCurrentDB.altname + ' ' + '251';

        closestTextArea($obj).add(line);
        msg = gMsg.ok;
        img = imgMsgOk;
    }

    led($obj).set(img, msg);
    widDone($obj, msg);
}

function widPreBlockingRequestStep2($obj)
{
    glCmdList.clear();
    widCleanUI($obj).near();

    var msg = gMsg.wait;

    switch (glTokList.state())
    {
        case true:
            msg = gMsg.allAvailable;

            led($obj).set(imgMsgError, msg);
            widDone($obj, msg);

            break;
        case false:
            led($obj).set(imgMsgBlink, msg);
            widBlockingRequestStep2($obj, glTokList.items);

            break;
        case undefined:
            msg = gMsg.someAvailable;

            led($obj).set(imgMsgError, msg);
            widDone($obj, msg);

            break;
        default:
                if (!widIsRawTokens())
                    return widDone($obj, gMsg.badTokens);

            if (!widIsPassword())
                return widDone($obj, gMsg.emptyPassword);

            var tok = engGetTokens(widGetRawTokens(), gCurrentDB.hash);
            var extCb = function ()
            {
                widPreBlockingRequestStep2($obj);
            }

            led($obj).set(imgMsgBlink, msg);
            widFillOutTokList($obj, tok, extCb);

            break;
    }
}

function widBlockingRequestStep2($obj, items)
{
    var n0,
        n1,
        k2,
        g1,
        k3,
        g2,
        o1,
        s,
        line;

    for (var i = 0; i < items.length; i++)
    {
        if (items[i].state === 'PWD_RCVNG')
        {
            s = items[i].s
                n0 = items[i].n;
            k2 = engGetKey(n0 + 2, s, gPassword, gCurrentDB.magic, gCurrentDB.hash);
            g1 = engGetKey(n0 + 2, s, k2, gCurrentDB.magic, gCurrentDB.hash);
            k3 = engGetKey(n0 + 3, s, gPassword, gCurrentDB.magic, gCurrentDB.hash);
            g2 = engGetKey(n0 + 3, s, k3, gCurrentDB.magic, gCurrentDB.hash);
            o1 = engGetKey(n0 + 2, s, g2, gCurrentDB.magic, gCurrentDB.hash);

            line = n0 + ' ' + s + ' ' + g1 + ' ' + o1 + '\n';

            if (0)
                line = s + ' ' + g1 + ' ' + o1 + '\n';

            closestTextArea($obj).add(line);

        }

        widShowProgressbar(100 * (i + 1) / items.length);
        widShowTokensLog(gMsg.generation);
    }

    var msg = gMsg.nonexistentTokens;
    var img = imgMsgError;

    if (closestTextArea($obj).val().length > 0)
    {
        var mergedKeys = $(widGetClosestTextarea($obj)).val().replace(/\s/g, '');
        line = engGetHash(mergedKeys, 's22').substring(0, 4) + ' ' + gCurrentDB.altname + ' ' + '124151';

        if (0)
            line = engGetHash(mergedKeys, 's22').substring(0, 4) + ' ' + gCurrentDB.altname + ' ' + '24151';

        closestTextArea($obj).add(line);

        msg = gMsg.ok;
        img = imgMsgOk;
    }

    led($obj).set(img, msg);
    widDone($obj, msg);
}

function widPreBlockingAcceptStep1($obj, click)
{
    led($obj).clear();

    var rawAcceptKeys = widGetClosestTextarea($obj).val();

    if (!engIsAcceptKeys(rawAcceptKeys))
        return widDone($obj, gMsg.badKeys);

    if (!widIsPassword())
        return widDone($obj, gMsg.emptyPassword);

    if (widGetRawTokens().length > 0 && (typeof click == 'undefined'))
        return widContinueButtonClick(widGetClosestContinueButton($obj));

    glCmdList.clear();
    glTokList.clear();

    var tok = engGetTokens(widGetRawTokens(), gCurrentDB.hash);
    var acceptKeys = engGetParsedAcceptKeys(rawAcceptKeys);
    tok = engGetDnOrRawList(engGetDnList(acceptKeys), engGetRawList(tok), gCurrentDB.hash);

    widShowOrderedTokensNames(tok);
    widUpgradeAcceptKeys($obj, acceptKeys, widBlockingAcceptStep1);
}

function widBlockingAcceptStep1($obj, titleRecord)
{
    var n1,
        s,
        k1,
        g1,
        o1,
        addCmd;
    var enc = $('#input_tokens_encrypt').prop('checked');

    for (var i = 0; i < titleRecord.length; i++)
    {
        n1 = titleRecord[i].n1;
        s = titleRecord[i].s;
        k1 = titleRecord[i].k1;
        g1 = titleRecord[i].g1;
        o1 = titleRecord[i].o1;

        addCmd = 'add * ' + gCurrentDB.name + ' ' + n1 + ' ' + s + ' ' + k1 + ' ' + g1 + ' ' + o1;

        if ( enc )
            addCmd = '#' + engGetCipher(addCmd);

        glCmdList.items[i] = {};
        glCmdList.items[i].cmd = addCmd;
        glCmdList.items[i].s = s;
        glCmdList.items[i].raw = '';

    }

    var cb = function (cbData, cmdIdx, progress)
    {
        cbTokensUpdate(cbData, cmdIdx, progress, $obj);
    }

    engRunCmdList(glCmdList, cb);
}

function widPreBlockingAcceptStep2($obj, click)
{
    led($obj).clear();

    var rawAcceptKeys = widGetClosestTextarea($obj).val();

    if (!engIsAcceptKeys(rawAcceptKeys))
        return widDone($obj, gMsg.badKeys);

    if (!widIsPassword())
        return widDone($obj, gMsg.emptyPassword);

    if (widGetRawTokens().length > 0 && (typeof click == 'undefined'))
        return widContinueButtonClick(widGetClosestContinueButton($obj));

    glCmdList.clear();
    glTokList.clear();

    var tok = engGetTokens(widGetRawTokens(), gCurrentDB.hash);
    var acceptKeys = engGetParsedAcceptKeys(rawAcceptKeys);
    tok = engGetDnOrRawList(engGetDnList(acceptKeys), engGetRawList(tok), gCurrentDB.hash);

    widShowOrderedTokensNames(tok);
    widUpgradeAcceptKeys($obj, acceptKeys, widBlockingAcceptStep2);
}

function widBlockingAcceptStep2($obj, titleRecord)
{
    var n1,
        s,
        k1,
        g1,
        o1,
        addCmd;
    var enc = $('#input_tokens_encrypt').prop('checked');

    for (var i = 0; i < titleRecord.length; i++)
    {
        n1 = titleRecord[i].n1;
        s = titleRecord[i].s;
        k1 = titleRecord[i].k1;
        g1 = titleRecord[i].g1;
        o1 = titleRecord[i].o1;

        addCmd = 'add * ' + gCurrentDB.name + ' ' + n1 + ' ' + s + ' ' + k1 + ' ' + g1 + ' ' + o1;

        if ( enc )
            addCmd = '#' + engGetCipher(addCmd);

        glCmdList.items[i] = {};
        glCmdList.items[i].cmd = addCmd;
        glCmdList.items[i].s = s;
        glCmdList.items[i].raw = '';
    }

    var cb = function (cbData, cmdIdx, progress)
    {
        cbTokensUpdate(cbData, cmdIdx, progress, $obj);
    }

    engRunCmdList(glCmdList, cb);
}
