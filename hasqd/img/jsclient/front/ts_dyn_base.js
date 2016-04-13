// Hasq Technology Pty Ltd (C) 2013-2016
function textArea($textarea)
{
    var obj =
    {
        add : function (data)
        {
            return this.val(this.val() + data);
        },
        clear : function ()
        {
            return this.val('');
        },
        clearExcept : function ($exceptTextarea)
        {
            return $('textarea').not($exceptTextarea).val('');
        },
        val : function (data)
        {
            if (typeof(data) !== 'undefined' && typeof(data) !== 'null')
                $textarea.val(data);
            else
                return $textarea.val();
        }
    }

    return obj;
}

function widDatePickerInit()
{
    $('#input_from_datepicker').datepicker(
    {
        dateFormat : 'yy/mm/dd',
        minDate : new Date(2016, 0, 1),
        maxDate : new Date(),
        showMonthAfterYear : true,
        showOtherMonths : true,
        selectOtherMonths : true,
        changeMonth : true,
        changeYear : true,
        onClose : function (selectedDate)
        {
            $('#input_to_datepicker')
            .datepicker('option', 'minDate', selectedDate);
        }
    }
    );

    $('#input_to_datepicker').datepicker(
    {
        dateFormat : 'yy/mm/dd',
        minDate : new Date(2016, 0, 1),
        maxDate : new Date(),
        showMonthAfterYear : true,
        showOtherMonths : true,
        selectOtherMonths : true,
        changeMonth : true,
        changeYear : true,
        onClose : function (selectedDate)
        {
            $('#input_from_datepicker')
            .datepicker('option', 'maxDate', selectedDate);
        }
    }
    );

    $('#input_from_datepicker')
    .attr('maxlength', '10')
    .datepicker('setDate', new Date());

    $('#input_to_datepicker')
    .attr('maxlength', '10')
    .datepicker('setDate', new Date());
}

function widShowHidePassword()
{
    $('#input_show_hide_checkbox').click(function ()
    {
        (this.checked)
        ? $('.password').attr('type', 'text')
        : $('.password').attr('type', 'password');
    });
}

function widModalWindow(msg, func)
{
    $('#div_modal_window_content')
    .click
    (function ()
    {
        $(this).find('p').empty();
        $('#div_modal_window').css('display', 'none');

        if (func) func();

        $(this).off('click');
    });

    $('#div_modal_window').css('display', 'block');
    $('#div_modal_window_content')
    .find('p')
    .html(msg);
}

function widHelpMessageBox ($obj)
{
    var str = $obj.html();

    if (str[0] !== '<')
     str = str.replace(/\s/g, '_').replace(/[^A-Za-z09_]/g, '').toLowerCase();
        else
            str = $obj.find('span').attr('id');

    return widModalWindow(gHelp(str));
}

function widSetDefaultDb(hash)
{
    // Searching for database and save it in variable.
    var cb = function (resp, db)
    {
        if (resp === gResponse.OK && db.length !== 0)
            gCurrentDB = engGetDbByHash (db, hash);
        else
            widModalWindow(gMsg.badDataBase);
    }

    engNcInfoDb(cb);
}

function widShowPwdGuessTime(d)
{
    // Shows password guess time
    var $Zxcvbn = $('#td_password_zxcvbn');
    return (d) ? $Zxcvbn.html(d) : $Zxcvbn.empty();
}

function widShowTokenName(dn, raw)
{
    // Shows hashed value of token (if the value is not a default hash)
    var $TokText = $('#textarea_token_text');

    if (arguments.length !== 2)
        return $TokText.empty();

    return (dn === engGetHash(raw, gCurrentDB.hash))
           ? $TokText.val(raw)
           : $TokText.val(dn);
}

function widShowTokenHash(dn)
{
    // Shows hashed value of token (if the value is not a default hash)
    var $TokHash = $('#td_token_hash');

    if (!dn)
        return $TokHash.empty();

    $TokHash.html(widGetToken(dn, gCurrentDB.hash));
}


function widShowTokenSearch() // Shows message or image about tokens existense.
{
    var $Pic = $('#span_token_pic img');
    $Pic.removeAttr('src').removeProp('title').hide();

    var obj =
    {
        show : function (d)
        {
            var title,
            src;

            if (!d)
            {
                title = 'Searching for token...';
                src = imgMsgWait;
            }

            if (d === gResponse.IDX_NODN)
            {
                title = 'No such token';
                src = imgLockOpen;
            }

            if (d === gResponse.OK)
            {
                title = 'Token exists';
                src = imgLockClosed;
            }

            $Pic.attr('src', src).prop('title', title).show();

            return true;
        },
    }

    return obj;
}

function widShowLog(text)
{
    // Shows messages in log
    var $Log = $('#' + 'div_log_area');

    text = text || '';
    $Log.html(text);
}

function widIsPassword()
{
    return ($('#input_password').val().length > 0);
}

function widIsTokenText()
{
    return ($('#textarea_token_text').val().length > 0);
}

function widGetToken(data, hash)
{
    //Returns hash of raw tokens value;
    return (engIsHash(data, hash)) ? data : engGetHash(data, hash);
}

function widGetTokenStateImg(status)
{
    // Returns an image displaying the password match
    var r = {};

    switch (status)
    {
        case 'OK':
            r.img = imgPwdOk;
            r.title = 'OK';
            break;
        case 'PWD_SNDNG':
            r.img = imgPwdSndng;
            r.title = 'Token is locked (sending)';
            break;
        case 'PWD_RCVNG':
            r.img = imgPwdRcvng;
            r.title = 'Token is locked (receiving)';
            break;
        case 'PWD_WRONG': //'PWD_WRONG'
            r.img = imgPwdWrong;
            r.title = 'Token is locked (wrong password)';
            break;
        default:
                r.img = imgPwdDummy;
            r.title = '';
            break;
    }
    return r;
}

function widShowPwdInfo(status)
{
    // Shows an image displaying the password match
    var $Span = $('#span_password_pic');
    var r = widGetTokenStateImg(status);

    $Span.find('img').attr('src', r.img).prop('title', r.title);
}

function widGetPwdGuessTime(pwd)
{
    // Returns guess time of specified password
    return (pwd) ? ('Guess time: ' + zxcvbn(pwd).crack_times_display.offline_slow_hashing_1e4_per_second) : undefined;
}

function widToggleUI(lr, pwd)
{
    var tokState = lr.state;
    var tokData = lr.d;
    console.log(gLastRec);
    widCreateTab().disable(true);
    widSetDataTab().disable(true);
    widSetDataTab().readonly(true);
    widReceiveTab().disable(true);
    widReceiveTab().readonly(true);
    widShowKeysTab().disable(true);

    (pwd) ? widSearchTab().disable(false) : widSearchTab().disable(true);

    if (typeof tokState === 'undefined')
    {
        widSetDataTab().val('');
        widReceiveTab().readonly(false);

        if (widReceiveTab().isKeys() && pwd)
            widReceiveTab().disable(false);
    }

    if (tokState === gResponse.IDX_NODN)
    {
        if (pwd)
            widCreateTab().disable(false);

        widSetDataTab().val('');
    }

    if (tokState === 'OK')
    {
        widReceiveTab().readonly(false);

        if (widReceiveTab().isKeys())
            widReceiveTab().disable(false);

        widSetDataTab().readonly(false);

        var d = widSetDataTab().val();
        var e = engDataToRecErrorLevel(d);

        if (e === 0 && tokData !== engGetDataToRec(d))
            widSetDataTab().disable(false);

        widShowKeysTab().disable(false);
        widShowKeysTab().release(false);
    }

    if (tokState === 'PWD_WRONG')
    {
        widReceiveTab().readonly(false);

        if (widReceiveTab().isKeys())
            widReceiveTab().disable(false);
    }

    if (tokState === 'PWD_SNDNG')
    {
        widShowKeysTab().release(true);
        widReceiveTab().readonly(false);

        if (widReceiveTab().isKeys())
            widReceiveTab().disable(false);
    }

    if (tokState === 'PWD_RCVNG')
    {
        widShowKeysTab().release(true);
        widReceiveTab().readonly(false);

        if (widReceiveTab().isKeys())
            widReceiveTab().disable(false);
    }
}

function widFileButtonOff(data)
{
    var $Input = $('#input_file_upload');
    var $InputLabel = $('#label_file_upload');

    if (data)
    {
        $Input.attr('type', 'file');
        $Input.val('');
        $Input.off('click');
        $InputLabel.css('background', '#FCFCFC');
    }
    else
    {
        $Input.attr('type', 'text');
        $InputLabel.css('background', '#FF0000');
    }
}

function widClearInitialData(isFile)
{
    var $TokenText = $('#textarea_token_text');

    clearTimeout(gTimerId);
    gLastRec = {};

    widShowPwdInfo();
    widShowTokenSearch();

    if (!widShowKeysTab().isOn() && !widReceiveTab().isOn() && !widSearchTab().isOn())
        widEmptyTab().show();

    if (isFile) $TokenText.val('');
    $TokenText.prop('disabled', false);
    widShowTokenHash();
}

function widTokenTextOninput(delay) // Events when tokens value changed.
{
    var $TokText = $('#textarea_token_text');
    var dnOrRaw = textArea($TokText).val();
    delay = +delay || 0;

    //clearTimeout(gTimerId);
    //gLastRec = {};

    widClearInitialData(false);

    if (0)
        textArea().clearExcept($TokText);

    var tok = {};
    tok.s = widGetToken(dnOrRaw, gCurrentDB.hash);
    tok.raw = (dnOrRaw !== tok.s) ? dnOrRaw : '';

    widShowTokenHash(tok.s);

    if (!tok.s)
        return widPasswordOninput();

    widReloadTokenInfo(tok, delay);
}

function widLoadFiles(files)
{
    var $TokenText = $('#textarea_token_text');
    var $Input = $('#input_file_upload');

    //clearTimeout(gTimerId);
    //gLastRec = {};

    widClearInitialData(true);
    widShowTokenSearch().show();

    if (!files[0]) return widShowTokenSearch();

    var cb = function (data)
    {
        if (data.error === null) return widShowTokenSearch();

        if (typeof(data.error) === 'string' || !data.size)
        {
            widShowTokenSearch();
            return widModalWindow(data.error);
        }

        textArea($TokenText).val('File: ' + data.name + '\nSize: ' + data.size);
        widShowTokenHash(data.s);

        $TokenText.prop('disabled', true);
        widFileButtonOff(false);

        $Input.click (function ()
        {
            widClearInitialData(true);
            widFileButtonOff(true);
            return false;
        });

        widReloadTokenInfo(data, 0);
    }

    engLoadFiles(files, gCurrentDB.hash, cb);
}

function widReloadTokenInfo(tok, delay)
{
    delay = +delay || 0;
    if (!tok)
    {
        var tok = {};
        tok.s = gLastRec.s;
        tok.raw = gLastRec.r;
    }

    if (tok.s)
    {
        widShowTokenSearch().show();
        widGetLastRecord(tok, delay);
    }
}

/*
function gLastRecFill(rec)
{
    gLastRec = {};
    gLastRec.n = '';
    gLastRec.s = '';
    gLastRec.raw = '';
    gLastRec.k = '';
    gLastRec.g = '';
    gLastRec.o = '';
    gLastRec.d = '';
    gLastRec.state = undefined;

    if (!rec) return;

    for (i in rec)
        gLastRec[i] = rec[i];
}
*/

function widGetLastRecord(tok, delay)
{
    var cb = function (resp, record)
    {
        if (resp !== gResponse.OK && resp !== gResponse.IDX_NODN)
        {
            widShowTokenSearch();
            return widModalWindow(resp);
        }

        if (resp === gResponse.IDX_NODN)
        {
            gLastRec.s = tok.s;
            gLastRec.state = resp;

            if (!widShowKeysTab().isOn() && !widReceiveTab().isOn() && !widSearchTab().isOn())
                widCreateTab().show();
        }
        else
        {
            gLastRec = record;
            gLastRec.state = 'PWD_WRONG';
            widSetDataTab().val(engGetDataFromRec(gLastRec.d));

            if (!widShowKeysTab().isOn() && !widReceiveTab().isOn() && !widSearchTab().isOn())
                widSetDataTab().show();
        }

        widShowTokenSearch().show(resp);
        widShowTokenHash(tok.s);
     //widShowTokenName(tok.s, tok.raw);
        gLastRec.raw = (engDataToRecErrorLevel(tok.raw) === 0) ? engGetDataToRec(tok.raw) : '';

        updateGWalletOnLast(record);
	widWalletRefresh();

        widPasswordOninput();
    }

    return engNcDeferredLast(cb, tok.s, delay);
}

function widPasswordOninput()
{
    // Events when passwords value changed.
    var $PwdInp = $('#input_password');
    gPassword = $PwdInp.val() || '';

    // set current wallet
    if ( !gAllWallets[gPassword] ) gAllWallets[gPassword] = {};
    gWallet = gAllWallets[gPassword];
    widSearchProgress.refresh();

    widShowPwdGuessTime(widGetPwdGuessTime(gPassword));

    if (gLastRec.state === gResponse.IDX_NODN || typeof gLastRec.state === 'undefined')
        return widToggleUI(gLastRec, gPassword);

    var rec = engGetRecord(gLastRec.n, gLastRec.s, gPassword, null, null, gCurrentDB.magic, gCurrentDB.hash);

    gLastRec.state = (gPassword) ? engGetTokensStatus(gLastRec, rec) : gLastRec.state = 'PWD_WRONG';

    if (gPassword)
        widShowPwdInfo(gLastRec.state);
    else
        widShowPwdInfo();

    widToggleUI(gLastRec, gPassword);
}

function widPasswordEyeClick($obj)
{
    //shows/hides passwords by click;
    var $PwdInp = $('#input_password');
    var $Eye = $obj.find('img');

    if ($PwdInp.attr('type') == 'text')
    {
        $PwdInp.attr('type', 'password');
        $Eye.attr('src', imgEyeOpen);
        $Eye.attr('title', 'Unmask password');
    }
    else
    {
        $PwdInp.attr('type', 'text');
        $Eye.attr('src', imgEyeClosed);
        $Eye.attr('title', 'Mask password');
    }
}

function widButtonsTable()
{
    var $Buttons = $('.tab-buttons-table');

    var retObj =
    {
        toggleOff : function ()
        {
            $Buttons.find('.tab-button-on').toggleClass('tab-button-on tab-button-off');
        }
    }

    return retObj;
}

function widEmptyTab()
{
    var $Tabs = $('#div_tabs');
    //widPasswordOninput();

    var retObj =
    {
        show : function ()
        {
            return $Tabs.tabs('option', 'active', 0);
        },
        isOn : function ()
        {
            return ($Tabs.tabs('option', 'active') === 0) ? true : false;
        }
    }

    return retObj;
}

function widCreateTab()
{
    var $Table = $('#table_create_tab');
    var $Button = $Table.find('button');
    var $Tabs = $('#div_tabs');

    var retObj =
    {
        disable : function (comm)
        {
            (comm)
            ? $Button.addClass('button-disabled').removeClass('button-enabled')
            : $Button.addClass('button-enabled').removeClass('button-disabled');
        },
        show : function ()
        {
            $('.tab-button-on').toggleClass('tab-button-on tab-button-off');
            $Tabs.tabs('option', 'active', 1);
        },
        isOn : function ()
        {
            return ($Tabs.tabs('option', 'active') === 1) ? true : false;
        }
    }

    return retObj;
}

function widCreateButtonClick()
{
    // Creates a new token record
    var $PwdInp = $('#input_password');
    var $TokenText = $('#textarea_token_text');

    var tok = {};
    tok.s = gLastRec.s;
    tok.raw = gLastRec.raw;

    widClearInitialData(true);
    widFileButtonOff(true);

    if (!widIsPassword())
        return widModalWindow(gMsg.enterMasterKey, function () { $PwdInp.focus() });

    widEmptyTab().show();

    var rec0 = engGetRecord(0, tok.s, gPassword, null, null, gCurrentDB.magic, gCurrentDB.hash);
    var rec1 = engGetRecord(1, tok.s, gPassword, null, null, gCurrentDB.magic, gCurrentDB.hash);

    var addCb1 = function (resp)
    {
        if (resp !== gResponse.OK)
            widModalWindow(gResponse[resp]);

        widReloadTokenInfo(tok, 0);
    }

    var addCb0 = function (resp)
    {
        if (resp === gResponse.OK)
            return engNcAdd(addCb1, gCurrentDB.name, rec1, null);

        widModalWindow(gResponse[resp]);
        widReloadTokenInfo(tok, 0);
    }

    engNcZ(addCb0, gCurrentDB.name, rec0, tok.raw);
}

function widSetDataTab()
{
    var $Tabs = $('#div_tabs');
    var $Button = $('#table_set_data_tab').find('button');
    var $Textarea = $('#table_set_data_tab').find('textarea');

    var retObj =
    {
        readonly : function (comm)
        {
            $Textarea.prop('readonly', comm);
        },
        disable : function (comm)
        {
            (comm) ? $Button.addClass('button-disabled').removeClass('button-enabled') : $Button.addClass('button-enabled').removeClass('button-disabled');
        },
        show : function ()
        {
            $('.tab-button-on').toggleClass('tab-button-on tab-button-off');
            $Tabs.tabs('option', 'active', 2);
        },
        val : function (data)
        {
            return (typeof(data) !== 'undefined' && typeof(data) !== 'null')
            ? textArea($Textarea).val(data)
            : textArea($Textarea).val();
        },
        isOn : function ()
        {
            return ($Tabs.tabs('option', 'active') === 2) ? true : false;
        }
    }

    return retObj;
}

function widSetDataButtonClick()
{
    // Adds a new record with a specified data
    var $PwdInp = $('#input_password');
    var $Data = $('#textarea_set_data');
    var tok = {};
    tok.s = gLastRec.s;
    tok.raw = gLastRec.raw;

    if (!widIsPassword())
        return widModalWindow(gMsg.enterMasterKey, function () { $PwdInp.focus() });

    if (gLastRec.state !== 'OK')
        return widModalWindow(gMsg.changeMasterKey, function () { $PwdInp.focus() });

    var data = $Data.val();
    var err = engDataToRecErrorLevel(data);

    if (err !== 0)
        return widModalWindow(gDataErrorMsg[err], function () { $Data.focus() });

    var data = engGetDataToRec(data);

    if (data === gLastRec.d)
        return widModalWindow(gMsg.dataNotChanged, function () { $Data.focus() });

    widSetDataTab().disable(true);

    var cb = function (resp, jobId)
    {
        if (resp !== gResponse.OK)
            widModalWindow(gResponse[resp]);

        widReloadTokenInfo(tok, 0);
    }
    var rec = engGetRecord(gLastRec.n + 1, gLastRec.s, gPassword, null, null, gCurrentDB.magic, gCurrentDB.hash);
    engNcAdd(cb, gCurrentDB.name, rec, data);
}

function widSetDataTextareaOninput($Obj)
{
 var data = $Obj.val().replace(/\t/g, '\u0020');
    $Obj.val(data);
    widToggleUI(gLastRec, gPassword);
}

function widShowKeysTab()
{
    var $Table = $('#table_show_keys_tab');
    var $Tabs = $('#div_tabs');
    var $AllButton = $Table.find('button');
    var $OnHoldButton = $('#button_show_on_hold');
    var $ReleaseButton = $('#button_show_release');

    var retObj =
    {
        disable : function (comm)
        {
            (comm)
            ? $AllButton
            .addClass('button-disabled').removeClass('button-enabled')
            : $AllButton
            .addClass('button-enabled').removeClass('button-disabled');

            $('.show-keys-button-on')
            .toggleClass('show-keys-button-on show-keys-button-off');
        },
        onhold : function (comm)
        {
            (comm)
            ? $OnHoldButton
            .addClass('button-enabled').removeClass('button-disabled')
            : $OnHoldButton
            .addClass('button-disabled').removeClass('button-enabled');
        },
        release : function (comm)
        {
            (comm)
            ? $ReleaseButton
            .addClass('button-enabled').removeClass('button-disabled')
            : $ReleaseButton
            .addClass('button-disabled').removeClass('button-enabled');
        },
        show : function ()
        {
            $Tabs.tabs('option', 'active', 3);
            $('.show-keys-button-on')
            .toggleClass('show-keys-button-on show-keys-button-off');
        },
        isOn : function ()
        {
            return ($Tabs.tabs('option', 'active') === 3) ? true : false;
        }

    }

    return retObj;
}

function widTabButtonClick($obj, tabId)
{
    widPasswordOninput();
    $obj.toggleClass('tab-button-on tab-button-off');
    $('.tab-button-on').not($obj).toggleClass('tab-button-on tab-button-off');
    textArea($('#textarea_show_keys')).clear();

    var f;
    switch (+tabId)
    {
        case 0 : f = function() { return widShowKeysTab().show() }; break;
        case 1 : f = function() { return widReceiveTab().show() }; break;
        case 2 : f = function() { return widSearchTab().show() }; break;
        default : return;
    }

    if (typeof gLastRec.state === 'undefined')
        return ($obj.hasClass('tab-button-on')) ? f() : widEmptyTab().show();

    if (gLastRec.state === gResponse.IDX_NODN)
        return ($obj.hasClass('tab-button-on')) ? f() : widCreateTab().show();

    return ($obj.hasClass('tab-button-on')) ? f() : widSetDataTab().show();
}

function widShowInstantButtonClick($obj)
{
    var $PwdInp = $('#input_password');
    var $TokenArea = $('#textarea_token_text');
    var $KeyArea = $('#textarea_show_keys');

    textArea($KeyArea).clear();
    $('.show-keys-button-on').not($obj).toggleClass('show-keys-button-on show-keys-button-off');

    if ($obj.hasClass('button-disabled'))
    {
        if ($obj.hasClass('show-keys-button-on'))
            return $obj.toggleClass('show-keys-button-on show-keys-button-off');

        if (typeof gLastRec.state === 'undefined')
            return widModalWindow(gMsg.enterTokenName, function () { $TokenArea.focus() });

        if (gLastRec.state === gResponse.IDX_NODN)
            return widModalWindow(gMsg.createToken);

        if (!widIsPassword())
            return widModalWindow(gMsg.enterMasterKey, function () { $PwdInp.focus() });

        if (gLastRec.state === 'PWD_SNDNG' || gLastRec.state === 'PWD_RCVNG')
        {
            $('.show-keys-button-on').toggleClass('show-keys-button-on show-keys-button-off');
            return widModalWindow(gMsg.tokenLocked);
        }

        if (gLastRec.state !== 'OK')
            return widModalWindow(gMsg.changeMasterKey, function () { $PwdInp.focus() });
    }

    $obj.toggleClass('show-keys-button-on show-keys-button-off');

    if ($obj.hasClass('show-keys-button-on'))
    {
        var k1 = engGetKey(gLastRec.n + 1, gLastRec.s, gPassword, gCurrentDB.magic, gCurrentDB.hash);
        var k2 = engGetKey(gLastRec.n + 2, gLastRec.s, gPassword, gCurrentDB.magic, gCurrentDB.hash);
        var line = gLastRec.s + '\u0020' + k1 + '\u0020' + k2 + '\u0020';

        textArea($KeyArea).add(line);

        var mergedKeys = $KeyArea.val().replace(/\s+/g, '');
        line = engGetHash(mergedKeys, 's22').substring(0, 4) + '\u0020' + gCurrentDB.altname + '\u0020' + '23132';

        textArea($KeyArea).add(line);
    }
}

function widShowOnHoldButtonClick($obj)
{
    var $PwdInp = $('#input_password');
    var $TokenArea = $('#textarea_token_text');
    var $KeyArea = $('#textarea_show_keys');

    textArea($KeyArea).clear();
    $('.show-keys-button-on').not($obj).toggleClass('show-keys-button-on show-keys-button-off');

    if ($obj.hasClass('button-disabled'))
    {
        if ($obj.hasClass('show-keys-button-on'))
            return $obj.toggleClass('show-keys-button-on show-keys-button-off');

        if (typeof gLastRec.state === 'undefined')
            return widModalWindow(gMsg.enterTokenName, function () { $TokenArea.focus() });

        if (gLastRec.state === gResponse.IDX_NODN)
            return widModalWindow(gMsg.createToken);

        if (!widIsPassword())
            return widModalWindow(gMsg.enterMasterKey, function () { $PwdInp.focus() });

        if (gLastRec.state !== 'OK' && gLastRec.state !== 'PWD_SNDNG')
            return widModalWindow(gMsg.changeMasterKey, function () { $PwdInp.focus() });
    }

    $obj.toggleClass('show-keys-button-on show-keys-button-off');

    if ($obj.hasClass('show-keys-button-on'))
    {
        if (gLastRec.state === 'OK')  // Blocking Send
        {
            var k1 = engGetKey(gLastRec.n + 1, gLastRec.s, gPassword, gCurrentDB.magic, gCurrentDB.hash);
            var k2 = engGetKey(gLastRec.n + 2, gLastRec.s, gPassword, gCurrentDB.magic, gCurrentDB.hash);
            var g1 = engGetKey(gLastRec.n + 2, gLastRec.s, k2, gCurrentDB.magic, gCurrentDB.hash);
            var line = gLastRec.s + '\u0020' + k1 + '\u0020' + g1 + '\u0020';

            textArea($KeyArea).add(line);

            var mergedKeys = $KeyArea.val().replace(/\s+/g, '');
            line = engGetHash(mergedKeys, 's22').substring(0, 4) + '\u0020' + gCurrentDB.altname + '\u0020' + '23141';

            textArea($KeyArea).add(line);
        }
    }
}

function widShowReleaseButtonClick($obj)
{
    var $PwdInp = $('#input_password');
    var $TokenArea = $('#textarea_token_text');
    var $KeyArea = $('#textarea_show_keys');

    textArea($KeyArea).clear();
    $('.show-keys-button-on').not($obj).toggleClass('show-keys-button-on show-keys-button-off');

    if ($obj.hasClass('button-disabled'))
    {
        if ($obj.hasClass('show-keys-button-on'))
            return $obj.toggleClass('show-keys-button-on show-keys-button-off');

        if (typeof gLastRec.state === 'undefined')
            return widModalWindow(gMsg.enterTokenName, function () { $TokenArea.focus() });

        if (gLastRec.state === gResponse.IDX_NODN)
            return widModalWindow(gMsg.createToken);

        if (!widIsPassword())
            return widModalWindow(gMsg.enterMasterKey, function () { $PwdInp.focus() });

        if (gLastRec.state === 'PWD_WRONG')
            return widModalWindow(gMsg.changeMasterKey, function () { $PwdInp.focus() });

        if (gLastRec.state === 'OK')
            return widModalWindow(gMsg.changeTokenName);
    }

    $obj.toggleClass('show-keys-button-on show-keys-button-off');

    if ($obj.hasClass('show-keys-button-on'))
    {
        var k;
        var prCode;

        if (gLastRec.state === 'PWD_RCVNG')
        {
            k = engGetKey(gLastRec.n + 2, gLastRec.s, gPassword, gCurrentDB.magic, gCurrentDB.hash);
            prCode = '232';
        }

        if (gLastRec.state === 'PWD_SNDNG')
        {
            var k = engGetKey(gLastRec.n + 1, gLastRec.s, gPassword, gCurrentDB.magic, gCurrentDB.hash);
            prCode = '231';
        }

        var line = gLastRec.s + '\u0020' + k + '\u0020';
        textArea($KeyArea).add(line);

        var mergedKeys = $KeyArea.val().replace(/\s+/g, '');
        line = engGetHash(mergedKeys, 's22').substring(0, 4) + '\u0020' + gCurrentDB.altname + '\u0020' + prCode;

        textArea($KeyArea).add(line);
    }
}

function widReceiveTab()
{
    var $Tabs = $('#div_tabs');
    var $Table = $('#table_receive_tab');
    var $Textarea = $Table.find('textarea');
    var $Button = $Table.find('button');

    var retObj =
    {
        readonly : function (comm)
        {
            $Textarea.prop('readonly', comm);
        },
        disable : function (comm)
        {
            (comm) ? $Button.addClass('button-disabled').removeClass('button-enabled') : $Button.addClass('button-enabled').removeClass('button-disabled');
        },
        show : function ()
        {
            $Tabs.tabs('option', 'active', 4);
        },
        isKeys : function ()
        {
            return engIsAcceptKeys(textArea($Textarea).val());
        },
        isOn : function ()
        {
            return ($Tabs.tabs('option', 'active') === 4) ? true : false;
        }

    }

    return retObj;
}

function widReceiveTextareaOninput()
{
    widToggleUI(gLastRec, gPassword);
}

function widReceiveButtonClick()
{
    var $TokenArea = $('#textarea_token_text');
    var $AcceptKeysArea = $('#textarea_receive_keys');
    var $PwdInp = $('#input_password');

    var rawAcceptKeys = $AcceptKeysArea.val();
    var acceptKeys = engGetParsedAcceptKeys($AcceptKeysArea.val());

    if (!widIsPassword())
        return widModalWindow(gMsg.enterMasterKey, function () { $PwdInp.focus() });

    if (!engIsAcceptKeys(rawAcceptKeys))
        return widModalWindow(gMsg.badAcceptKeys, function () { $AcceptKeysArea.focus() });

    var tok = {};
    tok.s = acceptKeys[0].s;
    tok.raw = (gLastRec && gLastRec.raw && tok.s === engGetHash(gLastRec.raw, gCurrentDB.hash))
              ? gLastRec.raw
              : '';

    clearTimeout(gTimerId);
    gLastRec = {};

    widReceiveTab().disable(true);

    var f = function ()
    {
        widReceiveKey(acceptKeys);
    }

    widSearchTokenName(tok, f);
}

function widSearchTokenName(tok, func)
{
    console.log(gLastRec);
    var $TokenArea = $('#textarea_token_text');

    if (tok.s === engGetHash(tok.raw, gCurrentDB.hash))
        return func();

    var cb = function (resp, record)
    {
        if (resp !== gResponse.OK && resp !== gResponse.NO_RECS)
            widModalWindow(gResponse[resp]);

        var r = (record === null) ? tok.s : record.d;

        widFileButtonOff(true);
        widClearInitialData(true);
        textArea($TokenArea).val(engGetRawFromZRec(tok.s, r, gCurrentDB.hash));

        if (resp === gResponse.IDX_NODN)
        {
            gLastRec.s = tok.s;
            gLastRec.state = resp;
            widShowTokenSearch().show(resp);
            widShowTokenHash(tok.s);
            return;
        }
        else
            func();
    }

    engNcRecordZero(cb, tok.s);
}

function widReceiveKey(keys)
{
    var $TokText = $('#textarea_token_text');
    var tok = widGetToken(textArea($TokText).val(), gCurrentDB.hash);

    var cb = function (resp, record)
    {
        if (resp !== gResponse.OK)
            return widModalWindow(gResponse[resp]);

        if (record === null)
            return widModalWindow(gMsg.recordParseError);

        updateGWalletOnLast(record);
	widWalletRefresh();
        widTokensTakeover(engGetNumberedAcceptKeys(keys, [record]));
    }

    engNcLast(cb, tok)
}

function widTokensTakeover(keys)
{
    keys = engGetTitleRecord(keys, gPassword, gCurrentDB.hash, gCurrentDB.magic);

    switch (keys[0].prcode)
    {
        case '23132': widInstantReceive(keys); break;
        case '23141': widBlockingReceive(keys); break;
        case '231': widBlockingReceive(keys); break;
        case '232': widInstantReceive(keys); break;
        default: widModalWindow(gMsg.badAcceptKeys);
    }
}

function widInstantReceive(keys)
{
    var tok = {};
    tok.s = keys[0].s;

    var addCb1 = function (resp)
    {
        if (resp !== gResponse.OK)
            widModalWindow(gResponse[resp]);

        widReloadTokenInfo(tok, 0);
    }

    var addCb0 = function (resp, keys)
    {
        if (resp === gResponse.OK)
            return engNcAdd(addCb1, gCurrentDB.name, keys, null);

        widModalWindow(gResponse[resp]);
        widReloadTokenInfo(tok, 0);
    }

    engNcAdd(addCb0, gCurrentDB.name, keys[0], null);

}

function widBlockingReceive(keys)
{
    var tok = {};
    tok.s = keys[0].s;

    var cb = function (resp)
    {
        if (resp !== gResponse.OK)
            widModalWindow(gResponse[resp]);

        widReloadTokenInfo(tok, 0);
    }

    engNcAdd(cb, gCurrentDB.name, keys[0], null);
}

function widSearchTab()
{
    var $Table = $('#table_search_tab');
    //var $Button = $Table.find('button').not('.search-tab-button').not('.search-tab-button-active');
    var $Button = $('#button_search');
    var $Tabs = $('#div_tabs');

    var retObj =
    {
        disable : function (comm)
        {
            (comm) ? $Button.addClass('button-disabled').removeClass('button-enabled') : $Button.addClass('button-enabled').removeClass('button-disabled');
        },
        show : function ()
        {
            $Tabs.tabs('option', 'active', 5);

            var width = $('#td_search_tabs_content').innerWidth() - 6;

            $('.div-overflow')
            .css('width', width + 'px')
            .css('max-width', width + 'px');

        },
        isOn : function ()
        {
            return ($Tabs.tabs('option', 'active') === 5) ? true : false;
        }
    }

    return retObj;
}

function widSearchButtonClick()
{
    var $PwdInp = $('#input_password');
    var $From = $('#input_from_datepicker');
    var $To = $('#input_to_datepicker');

    var fromDate = new Date($From.datepicker('getDate'));
    var toDate = new Date($To.datepicker('getDate'));

    if (!widIsPassword())
        return widModalWindow(gMsg.enterMasterKey, function () { $PwdInp.focus() });

    if (fromDate > toDate)
        return widModalWindow(gMsg.enterDate);

    var dates = engSearchClick(fromDate, toDate, widSearchProgress);

    // set new dates FIXME

}

function widSearchResultsTabsClick($obj, tabId)
{
    var $Tabs = $('#div_search_result_tabs');
    var $AllButtons = $('#td_search_tabs_buttons button');

    $Tabs.tabs('option', 'active', tabId);
    $AllButtons.addClass('search-tab-button').removeClass('search-tab-button-active');
    $obj.addClass('search-tab-button-active').removeClass('search-tab-button');
}

//  1   Set button according to g_searchOn
//  2   Show current file
//  3   Update results
var widSearchProgress = {};

widSearchProgress.button = function(on)
{
    if (on)
    {
        console.log('1');
        $('#button_search').html(imgBtnStop);
    }
    else
    {
        console.log('2');
        $('#button_search').html(imgBtnStart);
    }
    return;
}

widSearchProgress.block = function(txt, lnk)
{
    var n = lnk.match(/\d+(?=\.)/g);
    var x = "Block <a href=\"/file " + lnk + "\">" + txt + ' (' +n+ ")</a>";
    $('#span_current_slice').html(x);
    return;
}

widSearchProgress.refresh = function()
{
    widWalletRefresh();
}

function widWalletRefresh()
{
    var str = widSearchUpdate();

    // update widgit only if required
    function update(o, newstr)
    {
        var oldstr = o.html();

        if (newstr.length != oldstr.length || newstr != oldstr)
            o.html(newstr);
    }

    update( $('#div_mine_search_results'), str.text[1] );
    update( $('#div_onhold_search_results'), str.text[2] );
    update( $('#div_tocome_search_results'), str.text[3] );

    update( $('#span_search_mine'), '(' + str.number[1] + ')' );

    var $Onhold = $('#span_search_onhold');

    if (str.number[2] > 0)
        update( $Onhold, '(' + str.number[2] + ')' );
    else
        update( $Onhold, '');

    var $Tocome = $('#span_search_tocome');

    if (str.number[3] > 0)
        update( $Tocome, '(' + str.number[3] + ')' );
    else
        update( $Tocome, '' );

    return;
}

function widSearchUpdate()
{
    var w = gWallet;

    var t = ["", "", "", "", ""];
    var n = [0, 0, 0, 0, 0];

    for (var i in w)
    {
        var x = w[i];
        var xs = x.s;
        if ( x.raw != "" ) xs = x.raw;

        xs = '<button class="search-dn" style="margin-bottom: 1px;" onclick="widDnSelect(\''+xs+'\')">'+xs+'</button>';

        var xn = ' ' + x.n;
        for ( var i = 0; i < 5 - xn.length; i++ ) xn += ' ';

        if ( x.state > 0 && x.state < 4 )
            t[x.state] += xn + " " + xs + '\n';

        n[x.state]++;
    }

    return {text:t, number:n};
}

function widDnSelect(dnOrRaw)
{
    $('#textarea_token_text').val(dnOrRaw);
    widTokenTextOninput();
}
