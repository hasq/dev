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


function widSelectAndCopy($Obj)
{
    $Obj.select();
    var selectedText = window.getSelection().toString();

    try
    {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        //console.log('Copying text command was ' + msg);
    }
    catch (err)
    {
        //console.log('Unable to copy');
    }
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
 //var $Window = $('#div_modal_window_content');
    var $Window = $('#div_modal_window');
    var $Content = $('#div_modal_window_content');
    var width = $('body').outerWidth();
    $Content.width(width);
 //console.log(width);
    var click = function()
    {
        $Window.find('p').empty();
        //$('#div_modal_window').css('display', 'none');
        $Window.css('display', 'none');

        if (func) func();

        $Window.off('click');
        $(document).off('keyup');
    };

    var esc = function(e)
    {
        if (e.keyCode == 27)
            click();
    }

    $Window.click(function()
    {
        click()
    });

    $(document).keyup(function(event)
    {
        esc(event);
    });

    //$('#div_modal_window').css('display', 'block');
    $Window.css('display', 'block');
    //$('#div_modal_window_content')
    $Window.find('p').html(msg);
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
    var $Zxcvbn = $('#span_password_zxcvbn');
    return (d) ? $Zxcvbn.html(d) : $Zxcvbn.empty();
}

function widShowTokenName(tok)
{
    // Shows hashed value of token (if the value is not a default hash)
    var $TokName = $('#textarea_token_name');
    var possibleRaw = engGetClearData($TokName.val());

    if (arguments.length === 0)
        return $TokName.empty();

    if (tok.s === engGetHash(possibleRaw, gCurrentDB.hash))
        return;

    return (tok.s === engGetHash(tok.raw, gCurrentDB.hash))
           ? $TokName.val(tok.raw)
           : $TokName.val(tok.s);
}

function widShowTokenHash(dn)
{
    // Shows hashed value of token (if the value is not a default hash)
    var $TokHash = $('#td_token_hash');

    if (!dn)
        return $TokHash.empty();

    $TokHash.html(engGetTokenHash(dn, gCurrentDB.hash));
}


function widShowTokenState() // Shows message or image about tokens existense.
{
    var $Pic = $('#span_token_pic img');
    $Pic
    .removeAttr('src')
    .removeProp('title')
    .hide();

    var obj =
    {
        show : function (d)
        {
            if (d === gResponse.IDX_NODN)
                return $Pic
                .attr('src', imgLockOpen)
                .prop('title', 'No such token')
                .show();

            if (d === gResponse.OK)
                return $Pic
                .attr('src', imgLockClosed)
                .prop('title', 'Token exists')
                .show();


            return $Pic
            .attr('src', imgMsgWait)
            .prop('title', 'Searching for token...')
            .show();
        }
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
    return ($('#textarea_token_name').val().length > 0);
}

function engGetTokenHash(data, hash)
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
        case 'PWD_WRONG':
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

    widCreateTab().disable(true);
    widSetDataTab().disable(true);
    widSetDataTab().readonly(true);
    widReceiveTab().disable(true);
    widShowKeysTab().disable(true);

    (pwd) ? widSearchTab().disable(false) : widSearchTab().disable(true);

    if (typeof tokState === 'undefined')
    {
        widSetDataTab().val('');

        if (widReceiveTab().isKeys() && pwd)
            widReceiveTab().disable(false);

        return;
    }

    if (tokState === gResponse.IDX_NODN)
    {
        if (pwd)
            widCreateTab().disable(false);

        widSetDataTab().val('');

        return;
    }

    if (tokState === 'OK')
    {
        if (widReceiveTab().isKeys())
            widReceiveTab().disable(false);

        widSetDataTab().readonly(false);

        var d = widSetDataTab().val();
        var e = engDataToRecErrorLevel(d, +gCurrentDB.datalim);

        if (e === 0 && tokData !== engGetDataToRec(d))
            widSetDataTab().disable(false);

        widShowKeysTab().disable(false);
        widShowKeysTab().release(false);

        return;
    }

    if (tokState === 'PWD_WRONG')
    {
        if (widReceiveTab().isKeys())
            widReceiveTab().disable(false);

        return;
    }

    if (tokState === 'PWD_SNDNG')
    {
        widShowKeysTab().release(true);

        if (widReceiveTab().isKeys())
            widReceiveTab().disable(false);

        return;
    }

    if (tokState === 'PWD_RCVNG')
    {
        widShowKeysTab().release(true);

        if (widReceiveTab().isKeys())
            widReceiveTab().disable(false);
    }
}

function widTurnOnFileButton(data)
{
    var $Input = $('#input_file_upload');
    var $Label = $('#label_file_upload');
    $Input.attr('type', 'text');
    $Label.css('background', '#FF0000');
    $Label.hover(function()
    {
        $(this).css('background', '#FF0000')
    },
    function()
    {
        $(this).css('background', '#FF0000')
    });
}

function widTurnOffFileButton()
{
    var $Input = $('#input_file_upload');
    var $Label = $('#label_file_upload');

    $Input.attr('type', 'file');
    $Input.val('');
    $Input.off('click');
    $Label.css('background', '#FCFCFC');
    $Label.hover(function()
    {
        $(this).css('background', '#87CEEB')
    },
    function()
    {
        $(this).css('background', '#FCFCFC')
    });
    return false;
}

function wrapWaitForToken(tok)
{
    if (!widShowKeysTab().isOn() && !widReceiveTab().isOn() && !widSearchTab().isOn())
        widEmptyTab().show();

    widShowTokenName(tok);
    widShowTokenHash(tok.s);
    widShowTokenState().show();
    return;
}

function widTokenTextRO(state)
{
    $('#textarea_token_name').prop('disabled', state);
}

function widTokenTextOninput($Obj, delay) // Events when tokens value changed.
{

    if ( gCurrentDB === null )
        return;

    var dnOrRaw = $Obj.val().replace(/\t/g, '\u0020');

    if (!engIsAsciiOrLF(dnOrRaw))
        return widModalWindow(gMsg.nonASCII, function() { $Obj.focus()});

    delay = +delay || 0;
    var tok = engGetTokenObj(engGetClearData(dnOrRaw));

    if (1)
        textArea().clearExcept($Obj);

    widReloadTokenInfo(tok, delay);
}

function widLoadFiles(files)
{
    var $TokName = $('#textarea_token_name');
    var $FileInp = $('#input_file_upload');

    if (1)
        textArea().clearExcept($TokName);

    if ( !files[0] )
        return widShowTokenState();

    var cb = function (data)
    {
        if (data.error === null)
            return;

        if (typeof(data.error) === 'string' || !data.size)
        {
            widTokenTextRO(false);
            widTurnOffFileButton();
            return widModalWindow(data.error);
        }

        widTurnOnFileButton();
        $FileInp.click (function ()
        {
            var tok = engGetTokenObj('');

            widReloadTokenInfo(tok);
            return widTurnOffFileButton();
        });

        $TokName.val('File: ' + data.name + '\nSize: ' + data.size);

        var tok = engGetTokenObj(engGetClearData(data.raw));

        widTokenTextRO(true);
        widReloadTokenInfo(tok, 0, true);
    }

    var progress = function (data)
    {
        console.log(data + '%');
    };

    engLoadFiles(files, gCurrentDB.hash, cb, progress);
}

function widReloadTokenInfo(tok, delay, noRefresh)
{
    delay = +delay || 0;

    clearTimeout(gTimerId);

    widShowTokenState();
    widShowPwdInfo();
    widShowTokenHash();
    widShowTokenDataLength();

    if ( tok === null && !gTokInfo.s )
        return;

    if ( gCurrentDB === null )
        return;

    if ( tok && !tok.s ) // textarea erased;
    {
        gTokInfo = {};
        widShowTokenName(tok);
        widTokenTextRO(false);
        return ;
    }

    if ( tok === null && gTokInfo.s )
    {
        var tok = {};
        tok.s = gTokInfo.s;
        tok.raw = gTokInfo.raw;
        gTokInfo = {};
    }

    gTokInfo = {};
    widShowTokenState().show();

    if (!noRefresh)
    {
        widShowTokenName(tok);
        widTokenTextRO(false);
     widTurnOffFileButton(); ///***
    }

    widShowTokenHash(tok.s);
    widGetLastRecord(tok, delay);
}

function widGetLastRecord(tok, delay)
{
    var cb = function (resp, record)
    {
        if (resp !== gResponse.OK && resp !== gResponse.IDX_NODN)
        {
            widShowTokenState();
            return widModalWindow(resp);
        }

        if (resp === gResponse.IDX_NODN)
        {
            gTokInfo.s = tok.s;
            gTokInfo.state = resp;

            if (!widShowKeysTab().isOn() && !widReceiveTab().isOn() && !widSearchTab().isOn())
                widCreateTab().show();
        }
        else
        {
            gTokInfo = record;
            gTokInfo.state = 'PWD_WRONG';
            widSetDataTab().val(engGetDataFromRec(gTokInfo.d));

            if (!widShowKeysTab().isOn() && !widReceiveTab().isOn() && !widSearchTab().isOn())
                widSetDataTab().show();
        }

        widShowTokenState().show(resp);
        gTokInfo.raw = (engDataToRecErrorLevel(tok.raw, +gCurrentDB.datalim) === 0) ? tok.raw : '';
        widPasswordOninput();
    }

    return widRequestLast(cb, tok.s, delay);
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

    if (gTokInfo.state === gResponse.IDX_NODN || typeof gTokInfo.state === 'undefined')
        return widToggleUI(gTokInfo, gPassword);

    var rec = engGetRecord(gTokInfo.n, gTokInfo.s, gPassword, null, null, gCurrentDB.magic, gCurrentDB.hash);

    gTokInfo.state = (gPassword) ? engGetTokensStatus(gTokInfo, rec) : gTokInfo.state = 'PWD_WRONG';

    if (gPassword)
        widShowPwdInfo(gTokInfo.state);
    else
        widShowPwdInfo();

    widToggleUI(gTokInfo, gPassword);
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
        $Eye.attr('title', gTooltip.password_eye);
    }
    else
    {
        $PwdInp.attr('type', 'text');
        $Eye.attr('src', imgEyeClosed);
        $Eye.attr('title', gTooltip.password_eye);
    }
}

function widHideOnclick()
{
    $Obj = $('.td-visible, .td-hidden');
    $Obj.toggleClass('td-visible td-hidden');
    var $Inits = $('#td_search_inits');
    var $Results = $('#td_search_results');
    $Div = $('.div-overflow');
 //var $Div = $('#div_search_result_tabs');

    var tdWidth = $Results.innerWidth();
    var initsWidth = $Inits.innerWidth();
 var pdnLeft = +$Inits.css('padding-left').replace(/[px]/g, '');
 var pdnRight = +$Inits.css('padding-right').replace(/[px]/g, '');

    if ( $Obj.hasClass('td-visible') )
    {
        $Inits.css('display', 'inline-block');
        var decW = tdWidth - initsWidth - pdnLeft - pdnRight;
        $Div.innerWidth(decW);
        $Obj.html('>');
    }
    else
    {
        $Inits.css('display', 'none');
        //var incW = tdWidth + initsWidth;
        $Div.innerWidth('100%');
        $Obj.html('<');
    }

    widSetDivOverflowSize();

    return false;
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
            $Tabs.tabs('option', 'active', 0);
         ///$('.tab-button-on').toggleClass('tab-button-on tab-button-off');
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

    var tok = {};
    tok.s = gTokInfo.s;
    tok.raw = gTokInfo.raw;

    if (!widIsPassword())
        return widModalWindow(gMsg.enterMasterKey, function () { $PwdInp.focus() });

    wrapWaitForToken(tok);
    //widTokenTextRO(true);

    var rec0 = engGetRecord(0, tok.s, gPassword, null, null, gCurrentDB.magic, gCurrentDB.hash);
    var rec1 = engGetRecord(1, tok.s, gPassword, null, null, gCurrentDB.magic, gCurrentDB.hash);

    var addCb1 = function (resp)
    {
        if (resp !== gResponse.OK)
            widModalWindow(gResponse[resp]);

        widReloadTokenInfo(tok);
    }

    var addCb0 = function (resp)
    {
        if (resp === gResponse.OK)
            return engNcAdd(addCb1, gCurrentDB.name, rec1, null);

        widModalWindow(gResponse[resp]);
        widReloadTokenInfo(tok);
    }

    var fmd = engGetDataToRec(tok.raw);

    engNcZ(addCb0, gCurrentDB.name, rec0, fmd);
}

function widSetDataTab()
{
    var $Tabs = $('#div_tabs');
    var $Button = $('#button_set_data');
    var $Textarea = $('#textarea_set_data');

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
            if (typeof(data) !== 'undefined' && typeof(data) !== 'null')
            {
                widShowTokenDataLength(data);
                return $Textarea.val(data);
            }
            else
                return $Textarea.val();
        },
        isOn : function ()
        {
            return ($Tabs.tabs('option', 'active') === 2) ? true : false;
        }
    }

    return retObj;
}

function widSetDataTextareaOninput($Obj)
{
 var data = $Obj.val().replace(/\t/g, '\u0020');

    $Obj.val(data);

    widShowTokenDataLength(data);
    widToggleUI(gTokInfo, gPassword);
}

function widSetDataButtonClick()
{
    // Adds a new record with a specified data
    var $PwdInp = $('#input_password');
    var $Data = $('#textarea_set_data');

    if (!widIsPassword())
        return widModalWindow(gMsg.enterMasterKey, function () { $PwdInp.focus() });

    if (gTokInfo.state !== 'OK')
        return widModalWindow(gMsg.changeMasterKey, function () { $PwdInp.focus() });

    var data = $Data.val();
    var err = engDataToRecErrorLevel(data, +gCurrentDB.datalim);

    if (err !== 0)
        return widModalWindow(gDataErrorMsg[err], function () { $Data.focus() });

    var data = engGetDataToRec(data);

    if (data === gTokInfo.d)
        return widModalWindow(gMsg.dataNotChanged, function () { $Data.focus() });

    widSetDataTab().disable(true);

    var rec = engGetRecord(gTokInfo.n + 1, gTokInfo.s, gPassword, null, null, gCurrentDB.magic, gCurrentDB.hash);
    var tok = {};
    tok.s = gTokInfo.s;
    tok.raw = gTokInfo.raw;

    wrapWaitForToken(tok);
    //widTokenTextRO(true);

    var cb = function (resp, jobId)
    {
        if (resp !== gResponse.OK)
            widModalWindow(gResponse[resp]);

        widReloadTokenInfo(tok);
    }

    engNcAdd(cb, gCurrentDB.name, rec, data);
}

function widShowTokenDataLength(data)
{
    var $DataLength = $('#span_data_length');
    $DataLength.empty();

    if (!data)
        return;

    var l = engGetDataToRec(data).length;

    (l) ? $DataLength.html(l) : $DataLength.empty();
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

    if (typeof gTokInfo.state === 'undefined')
        return ($obj.hasClass('tab-button-on')) ? f() : widEmptyTab().show();

    if (gTokInfo.state === gResponse.IDX_NODN)
        return ($obj.hasClass('tab-button-on')) ? f() : widCreateTab().show();

    return ($obj.hasClass('tab-button-on')) ? f() : widSetDataTab().show();
}

function widShowInstantButtonClick($obj)
{
    var $PwdInp = $('#input_password');
    var $TokName = $('#textarea_token_name');
    var $Keys = $('#textarea_show_keys');

    textArea($Keys).clear();
    $('.show-keys-button-on').not($obj).toggleClass('show-keys-button-on show-keys-button-off');

    if ($obj.hasClass('button-disabled'))
    {
        if ($obj.hasClass('show-keys-button-on'))
            return $obj.toggleClass('show-keys-button-on show-keys-button-off');

        if (typeof gTokInfo.state === 'undefined')
            return widModalWindow(gMsg.enterTokenName, function () { $TokName.focus() });

        if (gTokInfo.state === gResponse.IDX_NODN)
            return widModalWindow(gMsg.createToken);

        if (!widIsPassword())
            return widModalWindow(gMsg.enterMasterKey, function () { $PwdInp.focus() });

        if (gTokInfo.state === 'PWD_SNDNG' || gTokInfo.state === 'PWD_RCVNG')
        {
            $('.show-keys-button-on').toggleClass('show-keys-button-on show-keys-button-off');
            return widModalWindow(gMsg.tokenLocked);
        }

        if (gTokInfo.state !== 'OK')
            return widModalWindow(gMsg.changeMasterKey, function () { $PwdInp.focus() });
    }

    $obj.toggleClass('show-keys-button-on show-keys-button-off');

    if ($obj.hasClass('show-keys-button-on'))
    {
        var k1 = engGetKey(gTokInfo.n + 1, gTokInfo.s, gPassword, gCurrentDB.magic, gCurrentDB.hash);
        var k2 = engGetKey(gTokInfo.n + 2, gTokInfo.s, gPassword, gCurrentDB.magic, gCurrentDB.hash);
        var line = gTokInfo.s + '\u0020' + k1 + '\u0020' + k2 + '\u0020';

        textArea($Keys).add(line);

        var mergedKeys = $Keys.val().replace(/\s+/g, '');
        line = engGetHash(mergedKeys, 's22').substring(0, 4) + '\u0020' + gCurrentDB.altname + '\u0020' + '23132';

        textArea($Keys).add(line);

        widSelectAndCopy($Keys);
    }
}

function widShowOnHoldButtonClick($obj)
{
    var $PwdInp = $('#input_password');
    var $TokName = $('#textarea_token_name');
    var $Keys = $('#textarea_show_keys');

    textArea($Keys).clear();
    $('.show-keys-button-on').not($obj).toggleClass('show-keys-button-on show-keys-button-off');

    if ($obj.hasClass('button-disabled'))
    {
        if ($obj.hasClass('show-keys-button-on'))
            return $obj.toggleClass('show-keys-button-on show-keys-button-off');

        if (typeof gTokInfo.state === 'undefined')
            return widModalWindow(gMsg.enterTokenName, function () { $TokName.focus() });

        if (gTokInfo.state === gResponse.IDX_NODN)
            return widModalWindow(gMsg.createToken);

        if (!widIsPassword())
            return widModalWindow(gMsg.enterMasterKey, function () { $PwdInp.focus() });

        if (gTokInfo.state !== 'OK' && gTokInfo.state !== 'PWD_SNDNG')
            return widModalWindow(gMsg.changeMasterKey, function () { $PwdInp.focus() });
    }

    $obj.toggleClass('show-keys-button-on show-keys-button-off');

    if ($obj.hasClass('show-keys-button-on'))
    {
        if (gTokInfo.state === 'OK')
        {
            var k1 = engGetKey(gTokInfo.n + 1, gTokInfo.s, gPassword, gCurrentDB.magic, gCurrentDB.hash);
            var k2 = engGetKey(gTokInfo.n + 2, gTokInfo.s, gPassword, gCurrentDB.magic, gCurrentDB.hash);
            var g1 = engGetKey(gTokInfo.n + 2, gTokInfo.s, k2, gCurrentDB.magic, gCurrentDB.hash);
            var line = gTokInfo.s + '\u0020' + k1 + '\u0020' + g1 + '\u0020';

            textArea($Keys).add(line);

            var mergedKeys = $Keys.val().replace(/\s+/g, '');
            line = engGetHash(mergedKeys, 's22').substring(0, 4) + '\u0020' + gCurrentDB.altname + '\u0020' + '23141';

            textArea($Keys).add(line);

            widSelectAndCopy($Keys);
        }
    }
}

function widShowReleaseButtonClick($obj)
{
    var $PwdInp = $('#input_password');
    var $TokName = $('#textarea_token_name');
    var $Keys = $('#textarea_show_keys');

    textArea($Keys).clear();
    $('.show-keys-button-on').not($obj).toggleClass('show-keys-button-on show-keys-button-off');

    if ($obj.hasClass('button-disabled'))
    {
        if ($obj.hasClass('show-keys-button-on'))
            return $obj.toggleClass('show-keys-button-on show-keys-button-off');

        if (typeof gTokInfo.state === 'undefined')
            return widModalWindow(gMsg.enterTokenName, function () { $TokName.focus() });

        if (gTokInfo.state === gResponse.IDX_NODN)
            return widModalWindow(gMsg.createToken);

        if (!widIsPassword())
            return widModalWindow(gMsg.enterMasterKey, function () { $PwdInp.focus() });

        if (gTokInfo.state === 'PWD_WRONG')
            return widModalWindow(gMsg.changeMasterKey, function () { $PwdInp.focus() });

        if (gTokInfo.state === 'OK')
            return widModalWindow(gMsg.changeTokenName);
    }

    $obj.toggleClass('show-keys-button-on show-keys-button-off');

    if ($obj.hasClass('show-keys-button-on'))
    {
        var k;
        var prCode;

        if (gTokInfo.state === 'PWD_RCVNG')
        {
            k = engGetKey(gTokInfo.n + 2, gTokInfo.s, gPassword, gCurrentDB.magic, gCurrentDB.hash);
            prCode = '232';
        }

        if (gTokInfo.state === 'PWD_SNDNG')
        {
            var k = engGetKey(gTokInfo.n + 1, gTokInfo.s, gPassword, gCurrentDB.magic, gCurrentDB.hash);
            prCode = '231';
        }

        var line = gTokInfo.s + '\u0020' + k + '\u0020';
        textArea($Keys).add(line);

        var mergedKeys = $Keys.val().replace(/\s+/g, '');
        line = engGetHash(mergedKeys, 's22').substring(0, 4) + '\u0020' + gCurrentDB.altname + '\u0020' + prCode;

        textArea($Keys).add(line);

        widSelectAndCopy($Keys);
    }
}

function widReceiveTab()
{
    var $Tabs = $('#div_tabs');
    var $Table = $('#table_receive_tab');
    var $Keys = $('#textarea_receive_keys');
    var $Button = $('#button_receive');

    var retObj =
    {
        disable : function (comm)
        {
            (comm) ? $Button.addClass('button-disabled').removeClass('button-enabled') : $Button.addClass('button-enabled').removeClass('button-disabled');
        },
        show : function ()
        {
            $Tabs.tabs('option', 'active', 4);
            $Keys.val('');
        },
        isKeys : function ()
        {
            return engIsAcceptKeys($Keys.val());
        },
        isOn : function ()
        {
            return ($Tabs.tabs('option', 'active') === 4) ? true : false;
        }

    }

    return retObj;
}

function widReceiveTextareaOninput($Obj)
{
    var rawAccKeys = $Obj.val();

    if (engIsAcceptKeys(rawAccKeys))
    {
        var dn = engGetParsedAcceptKeys(rawAccKeys)[0].s;

        if (!gTokInfo.raw || dn !== engGetHash(gTokInfo.raw, gCurrentDB.hash))
            return widSearchTokenRaw(dn);
        else
        {
            var tok = {};
            tok.s = dn;
            tok.raw = gTokInfo.raw || '';
            widReloadTokenInfo(tok, 0);
        }
    }

    widToggleUI(gTokInfo, gPassword);
}

function widSearchTokenRaw(dn)
{
    console.log('widSearchTokenRaw');
    var $TokName = $('#textarea_token_name');
    var tok = engGetTokenObj(dn);

    wrapWaitForToken(tok);
    //widTokenTextRO(true);

    var cb = function (resp, rec)
    {

        if (resp !== gResponse.OK && resp !== gResponse.NO_RECS)
            widModalWindow(gResponse[resp]);

        var accKeysTok = {};
        accKeysTok.s = (rec === null) ? tok.s: rec.s;
        var sOrD = (rec === null) ? tok.s : rec.d;
        accKeysTok.raw = engGetTokNameFromZ(accKeysTok.s, sOrD, gCurrentDB.hash);

        return widReloadTokenInfo(accKeysTok, 0, false);
    }

    engNcRecordZero(cb, tok.s);
}

function widReceiveButtonClick()
{
    var $TokName = $('#textarea_token_name');
    var $Keys = $('#textarea_receive_keys');
    var $PwdInp = $('#input_password');

    if (!gTokInfo.state || gTokInfo.state === 'IDX_NODN')
        return widModalWindow(gMsg.noDn, function () { $TokName.focus() });

    if (!widIsPassword())
        return widModalWindow(gMsg.enterMasterKey, function () { $PwdInp.focus() });

    var rawAccKeys = $Keys.val();

    if (!engIsAcceptKeys(rawAccKeys))
        return widModalWindow(gMsg.badAcceptKeys, function () { $Keys.focus() });

    var accKeys = engGetParsedAcceptKeys($Keys.val());
    accKeys[0].raw = (gTokInfo.raw && accKeys[0].s === engGetHash(gTokInfo.raw, gCurrentDB.hash))
                     ? gTokInfo.raw
                     : (accKeys[0].s === engGetHash($TokName.val(), gCurrentDB.hash))
                     ? $TokName.val()
                     : '';

    wrapWaitForToken(accKeys[0]);
    //widTokenTextRO(true);

    widReceiveTab().disable(true);
    widReceiveKey(accKeys);
}

function widReceiveKey(keys)
{
    var cb = function (resp, record)
    {
        if (resp !== gResponse.OK)
            return widModalWindow(gResponse[resp]);

        if (record === null)
            return widModalWindow(gMsg.recordParseError);

        widTokensTakeover(engGetNumberedAcceptKeys(keys, [record]));
    }

    widRequestLast(cb, keys[0].s, 0);
}

function widTokensTakeover(keys)
{
    keys = engGetTitleRecord(keys, gPassword, gCurrentDB.hash, gCurrentDB.magic);

    switch (keys[0].prcode)
    {
        case '23132': widInstantReceive(keys[0]); break;
        case '23141': widBlockingReceive(keys[0]); break;
        case '231': widBlockingReceive(keys[0]); break;
        case '232': widInstantReceive(keys[0]); break;
        default: widModalWindow(gMsg.badAcceptKeys);
    }
}

function widInstantReceive(keys)
{
    var addCb1 = function (resp)
    {
        if (resp !== gResponse.OK)
            widModalWindow(gResponse[resp]);

        $('#textarea_receive_keys').val('');

        widReloadTokenInfo(keys);
    }

    var addCb0 = function (resp, keys)
    {
        if (resp === gResponse.OK)
            return engNcAdd(addCb1, gCurrentDB.name, keys, null);

        widModalWindow(gResponse[resp]);
        widReloadTokenInfo(keys);
    }

    engNcAdd(addCb0, gCurrentDB.name, keys, null);
}

function widBlockingReceive(keys)
{
    var cb = function (resp)
    {
        if (resp !== gResponse.OK)
            widModalWindow(gResponse[resp]);

        $('#textarea_receive_keys').val('');

        widReloadTokenInfo(keys);
    }

    engNcAdd(cb, gCurrentDB.name, keys, null);
}

function widSetDivOverflowSize()
{
    var $Td = $('#td_search_results');
    var $Div = $('.div-overflow');
 //var $Div = $('#div_search_result_tabs');
 var pdnLeft = +$Td.css('padding-left').replace(/[px]/g, '');
 var pdnRight = +$Td.css('padding-right').replace(/[px]/g, '');

    var tdWidth = $Td.innerWidth() - pdnLeft - pdnRight;
    var divWidth = $Div.innerWidth();

 //console.log('td_search_result: ' + tdWidth);
 //console.log('.div-overflow: ' + divWidth);

    $Div.css('max-width', tdWidth + 'px');

}

function widSearchTab()
{
    var $Table = $('#table_search_tab');
    //var $Button = $Table.find('button').not('.search-tabs-buttons').not('.search-tabs-buttons-active');
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
            widSetDivOverflowSize();
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

    engSearchClick(fromDate, toDate, widSearchProgress);
}

function widSearchResultsTabsClick($Obj, tabId)
{
    var $Tabs = $('#div_search_result_tabs');
    var $AllButtons = $('#td_search_tabs_buttons button');

    if ( $Obj.hasClass('search-tabs-buttons-active') )
        widHideOnclick();

    $Tabs.tabs('option', 'active', tabId);
    $AllButtons.addClass('search-tabs-buttons').removeClass('search-tabs-buttons-active');
    $Obj.addClass('search-tabs-buttons-active').removeClass('search-tabs-buttons');

}

//  1   Set button according to g_searchOn
//  2   Show current file
//  3   Update results
var widSearchProgress = {};

widSearchProgress.button = function(on)
{
    if (on)
        $('#button_search').html(imgBtnStop);
    else
        $('#button_search').html(imgBtnStart);

    return;
}

widSearchProgress.block = function(txt, lnk)
{
    var n = lnk.match(/\d+(?=\.)/g);
    var x = 'Block <a href="/file ' + lnk + '" target="_blank">' + txt.substr(2) + '-' +n+ '</a>';
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
    update( $('#div_expected_search_results'), str.text[3] );

    update( $('#span_search_mine'), '(' + engGetNumberLevel(str.number[1]) + ')' );

    var $Onhold = $('#span_search_onhold');

    if (str.number[2] > 0)
        update( $Onhold, '(' + str.number[2] + ')' );
    else
        update( $Onhold, '');

    var $Expected = $('#span_search_expected');

    if (str.number[3] > 0)
        update( $Expected, '(' + str.number[3] + ')' );
    else
        update( $Expected, '' );

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
        if ( x.raw != "" ) xs = engGetDataToRec(x.raw);

        xs = '<button class="search-dn" onclick="widDnSelect(\'' + window.btoa(xs) + '\')">' + xs + '</button>';

        var xn = ' ' + x.n;
        for ( var i = 0; i < 5 - xn.length; i++ ) xn += ' ';

        if ( x.state > 0 && x.state < 4 )
            t[x.state] += '<span class="span-search-dn">' + xn + '</span> ' + xs + '\n';

            n[x.state]++;
    }

    return {text:t, number:n};
}

function widDnSelect(b64)
{
    var fmd = window.atob(b64);
    var raw = engGetDataFromRec(fmd);
    widReloadTokenInfo(engGetTokenObj(raw));
}

function widRequestLast(extCb, tok, delay)
{
    var possible_raw = $('#textarea_token_name').val();

    var cb = function (resp, record)
    {
        ///var resp = engGetResponseHeader(data);
        ///var record = null;

        if (resp === gResponse.OK)
        {
            updateGWalletOnLast(record, possible_raw);
            widWalletRefresh();
        }

        extCb(resp, record);
    }

    return engNcDeferredLast(cb, tok, delay);
}
