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
            $('#input_to_datepicker').datepicker('option', 'minDate', selectedDate);
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
            $('#input_from_datepicker').datepicker('option', 'maxDate', selectedDate);
        }
    }
    );

    $('#input_from_datepicker').attr('maxlength', '10').datepicker('setDate', new Date());
    $('#input_to_datepicker').attr('maxlength', '10').datepicker('setDate', new Date());
}

function widShowHidePassword()
{
    $('#input_show_hide_checkbox').click(function ()
    {
        if (this.checked)
            $('.password').attr('type', 'text');
        else
            $('.password').attr('type', 'password');
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

        if (func)
            func();

        $(this).off('click');
    });

    $('#div_modal_window').css('display', 'block');
    $('#div_modal_window_content').find('p').html(msg);
}

function widHelpMessageBox ($obj)
{
    var str = $obj.html();

    if (str[0] !== '<')
     str = str.replace(/\s/g, '_').replace(/[^A-Za-z09_]/g, '').toLowerCase();
        else
        {
            str = $obj.find('span').attr('id')
        }
    return widModalWindow(gHelp[str]);
}

function widSetDefaultDb(hash)
{
    // Searching for database and save it in variable.
    var cb = function (resp, db)
    {
        if (resp === 'OK' && db.length !== 0)
            glCurrentDB = engGetDbByHash (db, hash);
        else
            return widModalWindow(glMsg.badDataBase);
    }

    engNcInfoDb(cb);
}

function widShowPwdGuessTime(d)
{
    // Shows password guess time
    var $Zxcvbn = $('#td_password_zxcvbn');
    return (d) ? $Zxcvbn.html(d) : $Zxcvbn.empty();
}

function widShowToken(tok)
{
    // Shows hashed value of token (if the value is not a default hash)
    var $TokenText = $('#td_token_hash');

    if (!tok)
        return $TokenText.empty();

    $TokenText.html(widGetToken(tok, glCurrentDB.hash));
}

function widShowLog(text)
{
    // Shows messages in log
    var $Log = $('#' + 'div_log_area');

    text = text || '';
    $Log.html(text);
}

function widShowSearch() // Shows message or image about tokens existense.
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

            if (d === 'IDX_NODN')
            {
                title = 'No such token';
                src = imgLockOpen;
            }

            if (d === 'OK')
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
    //Returns hash of raw tokens value or
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

    widCreateTab().disable(true);
    widSetDataTab().disable(true);
    widSetDataTab().readonly(true);
    widReceiveTab().disable(true);
    widReceiveTab().readonly(true);
    widShowKeysTab().disable(true);

    (pwd) ? widSearchTab().disable(false) : widSearchTab().disable(true);

    if (typeof tokState === 'undefined')
    {
        widReceiveTab().readonly(false);

        if (widReceiveTab().isKeys() && pwd)
            widReceiveTab().disable(false);

        widSetDataTab().val('');
    }

    if (tokState === 'IDX_NODN')
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

        var newData = engGetDataValToRecord(widSetDataTab().val()) || '';
        widSetDataTab().readonly(false);

        if (tokData !== newData)
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

function widFileButtonReset(data)
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
        $InputLabel.css('background', '#FFD700');
    }
}

function widClearInitialData(isFile)
{
    var $TokenText = $('#textarea_token_text');

    clearTimeout(glTimerId);
    glLastRec = {};
    widShowPwdInfo();
    widShowSearch();

    if (!widShowKeysTab().isOn() && !widReceiveTab().isOn() && !widSearchTab().isOn())
        widEmptyTab().show();

    if (isFile) $TokenText.val('');
    $TokenText.prop('disabled', false);
    widShowToken();
    widToggleUI(glLastRec, glPassword);
}

function widTokenTextOninput(delay) // Events when tokens value changed.
{
    var $TokText = $('#textarea_token_text');
    var tokText = textArea($TokText).val();
    delay = +delay || 0;

    widClearInitialData(false);

    if (0)
        textArea().clearExcept($TokText);

    var tok = {};
    tok.hash = widGetToken(tokText, glCurrentDB.hash);
    tok.raw = (tokText !== tok.hash) ? tokText : '';

    widShowToken(tok.hash);

    if (!tok.hash)
        return widPasswordOninput();

    widReloadTokenInfo(tok, delay);
}

function widLoadFiles(files)
{
    var $TokenText = $('#textarea_token_text');
    var $Input = $('#input_file_upload');

    widClearInitialData(true);
    widShowSearch().show();

    if (!files[0]) return widShowSearch();

    var cb = function (data)
    {
        if (data.error === null) return widShowSearch();

        if (typeof(data.error) === 'string' || !data.size)
        {
            widShowSearch();
            return widModalWindow(data.error);
        }

        textArea($TokenText).val('File: ' + data.name + '\nSize: ' + data.size);
        widShowToken(data.hash);

        $TokenText.prop('disabled', true);
        widFileButtonReset(true);

        $Input.click (function ()
        {
            widClearInitialData(true);
            widFileButtonReset(true);
            return false;
        });

        widReloadTokenInfo(data, 0);
    }

    engLoadFiles(files, glCurrentDB.hash, cb);
}

function widReloadTokenInfo(tok, delay)
{
    delay = +delay || 0;
    if (!tok)
    {
        var tok = {};
        tok.hash = glLastRec.s;
        tok.raw = glLastRec.r;
    }

    if (tok.hash)
    {
        widShowSearch().show();
        widGetLastRecord(tok, delay);
    }
}

function widGetLastRecord(tok, delay)
{
    var cb = function (resp, record)
    {

        if (resp !== 'OK' && resp !== 'IDX_NODN')
        {
            widShowSearch();
            return widModalWindow(resp);
        }

        if (resp === 'IDX_NODN')
        {
            glLastRec.state = resp;
            glLastRec.s = tok.hash;

            if (!widShowKeysTab().isOn() && !widReceiveTab().isOn() && !widSearchTab().isOn())
                widCreateTab().show();
        }
        else
        {
            glLastRec = record;
            glLastRec.state = 'PWD_WRONG';
            widSetDataTab().val(engGetDataValToDisplay(glLastRec.d));

            if (!widShowKeysTab().isOn() && !widReceiveTab().isOn() && !widSearchTab().isOn())
                widSetDataTab().show();
        }

        widShowSearch().show(resp);
        widShowToken(glLastRec.s);
        glLastRec.raw = (tok.raw && tok.raw.length <= 160) ? tok.raw : '';

        widPasswordOninput();
    }

    return engNcDeferredLast(cb, tok.hash, delay);
}

function widPasswordOninput()
{
    // Events when passwords value changed.
    var $PwdInp = $('#input_password');
    glPassword = $PwdInp.val() || '';

    widShowPwdGuessTime(widGetPwdGuessTime(glPassword));

    if (glLastRec.state === 'IDX_NODN' || typeof glLastRec.state === 'undefined')
        return widToggleUI(glLastRec, glPassword);

    var rec = engGetRecord(glLastRec.n, glLastRec.s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);

    glLastRec.state = (glPassword) ? engGetTokensStatus(glLastRec, rec) : glLastRec.state = 'PWD_WRONG';

    if (glPassword)
        widShowPwdInfo(glLastRec.state);
    else
        widShowPwdInfo();

    widToggleUI(glLastRec, glPassword);
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
    widPasswordOninput();

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
            (comm) ? $Button.addClass('button-disabled').removeClass('button-enabled') : $Button.addClass('button-enabled').removeClass('button-disabled');
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
    tok.hash = glLastRec.s;
    tok.raw = glLastRec.raw;

    if (!widIsPassword())
        return widModalWindow(glMsg.enterMasterKey, function () { $PwdInp.focus() });

    widEmptyTab().show();

    var cb = function (resp)
    {
        if (resp !== 'OK')
            widModalWindow(resp);

        widReloadTokenInfo(tok, 0);
    };

    (tok.raw) ? $TokenText.val(tok.raw) : $TokenText.val(tok.hash);

    widClearInitialData(false);
    widFileButtonReset(true);
    widShowToken(tok.hash);

    var rec = engGetRecord(0, tok.hash, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);

    engNcZ(cb, glCurrentDB.name, rec, tok.raw);
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
    tok.hash = glLastRec.s;
    tok.raw = glLastRec.raw;

    if (!widIsPassword())
        return widModalWindow(glMsg.enterMasterKey, function () { $PwdInp.focus() });

    if (glLastRec.state !== 'OK')
        return widModalWindow(glMsg.changeMasterKey, function () { $PwdInp.focus() });

    if (engGetDataValToRecord($Data.val()) === glLastRec.d)
        return widModalWindow(glMsg.dataNotChanged, function () { $Data.focus() });

    widSetDataTab().disable(true);

    var cb = function (resp, jobId)
    {
        if (resp !== 'OK')
            widModalWindow(glResponse[resp]);

        widReloadTokenInfo(tok, 0);
    }
    var rec = engGetRecord(glLastRec.n + 1, glLastRec.s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);
    engNcAdd(cb, glCurrentDB.name, rec, $Data.val());
}

function widSetDataTextareaOninput()
{
    widToggleUI(glLastRec, glPassword);
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
            (comm) ? $AllButton.addClass('button-disabled').removeClass('button-enabled') : $AllButton.addClass('button-enabled').removeClass('button-disabled');
            $('.show-keys-button-on').toggleClass('show-keys-button-on show-keys-button-off');
        },
        onhold : function (comm)
        {
            (comm) ? $OnHoldButton.addClass('button-enabled').removeClass('button-disabled') : $OnHoldButton.addClass('button-disabled').removeClass('button-enabled');
        },
        release : function (comm)
        {
            (comm) ? $ReleaseButton.addClass('button-enabled').removeClass('button-disabled') : $ReleaseButton.addClass('button-disabled').removeClass('button-enabled');
        },
        show : function ()
        {
            $Tabs.tabs('option', 'active', 3);
            $('.show-keys-button-on').toggleClass('show-keys-button-on show-keys-button-off');
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

    if (typeof glLastRec.state === 'undefined')
        return ($obj.hasClass('tab-button-on')) ? f() : widEmptyTab().show();

    if (glLastRec.state === 'IDX_NODN')
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

        if (typeof glLastRec.state === 'undefined')
            return widModalWindow(glMsg.enterTokenName, function () { $TokenArea.focus() });

        if (glLastRec.state === 'IDX_NODN')
            return widModalWindow(glMsg.createToken);

        if (!widIsPassword())
            return widModalWindow(glMsg.enterMasterKey, function () { $PwdInp.focus() });

        if (glLastRec.state === 'PWD_SNDNG' || glLastRec.state === 'PWD_RCVNG')
        {
            $('.show-keys-button-on').toggleClass('show-keys-button-on show-keys-button-off');
            return widModalWindow(glMsg.tokenLocked);
        }

        if (glLastRec.state !== 'OK')
            return widModalWindow(glMsg.changeMasterKey, function () { $PwdInp.focus() });
    }

    $obj.toggleClass('show-keys-button-on show-keys-button-off');

    if ($obj.hasClass('show-keys-button-on'))
    {
        var k1 = engGetKey(glLastRec.n + 1, glLastRec.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
        var k2 = engGetKey(glLastRec.n + 2, glLastRec.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
        var line = glLastRec.s + '\u0020' + k1 + '\u0020' + k2 + '\u0020';

        textArea($KeyArea).add(line);

        var mergedKeys = $KeyArea.val().replace(/\s+/g, '');
        line = engGetHash(mergedKeys, 's22').substring(0, 4) + '\u0020' + glCurrentDB.altname + '\u0020' + '23132';

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

        if (typeof glLastRec.state === 'undefined')
            return widModalWindow(glMsg.enterTokenName, function () { $TokenArea.focus() });

        if (glLastRec.state === 'IDX_NODN')
            return widModalWindow(glMsg.createToken);

        if (!widIsPassword())
            return widModalWindow(glMsg.enterMasterKey, function () { $PwdInp.focus() });

        if (glLastRec.state !== 'OK' && glLastRec.state !== 'PWD_SNDNG')
            return widModalWindow(glMsg.changeMasterKey, function () { $PwdInp.focus() });
    }

    $obj.toggleClass('show-keys-button-on show-keys-button-off');

    if ($obj.hasClass('show-keys-button-on'))
    {
        if (glLastRec.state === 'OK')  // Blocking Send
        {
            var k1 = engGetKey(glLastRec.n + 1, glLastRec.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
            var k2 = engGetKey(glLastRec.n + 2, glLastRec.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
            var g1 = engGetKey(glLastRec.n + 2, glLastRec.s, k2, glCurrentDB.magic, glCurrentDB.hash);
            var line = glLastRec.s + '\u0020' + k1 + '\u0020' + g1 + '\u0020';

            textArea($KeyArea).add(line);

            var mergedKeys = $KeyArea.val().replace(/\s+/g, '');
            line = engGetHash(mergedKeys, 's22').substring(0, 4) + '\u0020' + glCurrentDB.altname + '\u0020' + '23141';

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

        if (typeof glLastRec.state === 'undefined')
            return widModalWindow(glMsg.enterTokenName, function () { $TokenArea.focus() });

        if (glLastRec.state === 'IDX_NODN')
            return widModalWindow(glMsg.createToken);

        if (!widIsPassword())
            return widModalWindow(glMsg.enterMasterKey, function () { $PwdInp.focus() });

        if (glLastRec.state === 'PWD_WRONG')
            return widModalWindow(glMsg.changeMasterKey, function () { $PwdInp.focus() });

        if (glLastRec.state === 'OK')
            return widModalWindow(glMsg.changeTokenName);
    }

    $obj.toggleClass('show-keys-button-on show-keys-button-off');

    if ($obj.hasClass('show-keys-button-on'))
    {
        var k;
        var prCode;

        if (glLastRec.state === 'PWD_RCVNG')
        {
            k = engGetKey(glLastRec.n + 2, glLastRec.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
            prCode = '232';
        }

        if (glLastRec.state === 'PWD_SNDNG')
        {
            var k = engGetKey(glLastRec.n + 1, glLastRec.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
            prCode = '231';
        }

        var line = glLastRec.s + '\u0020' + k + '\u0020';
        textArea($KeyArea).add(line);

        var mergedKeys = $KeyArea.val().replace(/\s+/g, '');
        line = engGetHash(mergedKeys, 's22').substring(0, 4) + '\u0020' + glCurrentDB.altname + '\u0020' + prCode;

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
    widToggleUI(glLastRec, glPassword);
}

function widReceiveButtonClick()
{
    var $AcceptKeysArea = $('#textarea_receive_keys');
    var $PwdInp = $('#input_password');
    var rawAcceptKeys = $AcceptKeysArea.val();

    if (glLastRec.state === 'IDX_NODN')
        return widModalWindow(glMsg.createToken);

    if (!widIsPassword())
        return widModalWindow(glMsg.enterMasterKey, function () { $PwdInp.focus() });

    if (!engIsAcceptKeys(rawAcceptKeys))
        return widModalWindow(glMsg.badAcceptKeys, function () { $AcceptKeysArea.focus() });

    widReceiveTab().disable(true);

    widShowTokenName();
}

function widShowTokenName()
{
    var $TokenArea = $('#textarea_token_text');
    var $AcceptKeysArea = $('#textarea_receive_keys');
    var acceptKeys = engGetParsedAcceptKeys($AcceptKeysArea.val());
    var tokText = [$TokenArea.val()] || [''];
    var tok = engGetMergedTokensList(engGetHashedTokensList(acceptKeys), tokText, glCurrentDB.hash)[0].replace(/^\[|\]$/g, '');

    if (acceptKeys[0].s === engGetHash(tok, glCurrentDB.hash))
        widReceiveKey(acceptKeys);
    else
    {
        var cb = function (resp, record)
        {
            if (resp !== 'OK' && resp !== glResponse.noRecs)
                widModalWindow(glResponse[resp]);
            else if (resp === 'OK' && record === null)
                widModalWindow(glMsg.recordParseError);

            textArea($TokenArea).val(engGetTokenName(record.d, acceptKeys[0].s));

            widReceiveKey(acceptKeys);
        }

        engNcRecordZero(cb, tok);
    }
}

function widReceiveKey(keys)
{
    var $TokText = $('#textarea_token_text');
    var tok = widGetToken(textArea($TokText).val(), glCurrentDB.hash);

    var cb = function (resp, record)
    {
        if (resp !== 'OK')
            return widModalWindow(glResponse[resp]);

        if (record === null)
            return widModalWindow(glMsg.recordParseError);

        widTokensTakeover(engGetNumberedAcceptKeys(keys, [record]));
    }

    engNcLast(cb, tok)
}

function widTokensTakeover(keys)
{
    keys = engGetTitleRecord(keys, glPassword, glCurrentDB.hash, glCurrentDB.magic);

    switch (keys[0].prcode)
    {
        case '23132':
            widInstantReceive(keys);
            break;
        case '23141':
            widBlockingReceive(keys);
            break;
        case '231':
            widBlockingReceive(keys);
            break;
        case '232':
            widInstantReceive(keys);
            break;
        default:
                return widModalWindow(glMsg.badAcceptKeys);
    }
}

function widInstantReceive(keys)
{
    var tok = {};
    tok.hash = glLastRec.s;
    tok.raw = glLastRec.raw;

    var addCb1 = function (resp)
    {
        if (resp !== 'OK')
            widModalWindow(glResponse[resp]);

        widReloadTokenInfo(tok, 0);
    }

    var addCb0 = function (resp, keys)
    {
        if (resp !== 'OK')
        {
            widModalWindow(glResponse[resp]);
            widReloadTokenInfo(tok, 0);
        }
        else
            engNcAdd(addCb1, glCurrentDB.name, keys, null);
    }

    engNcAdd(addCb0, glCurrentDB.name, keys[0], null);

}

function widBlockingReceive(keys)
{
    var tok = {};
    tok.hash = glLastRec.s;
    tok.raw = glLastRec.raw;

    var cb = function (resp)
    {
        if (resp !== 'OK')
            widModalWindow(glResponse[resp])

            widReloadTokenInfo(tok, 0);
    }

    engNcAdd(cb, glCurrentDB.name, keys[0], null);
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
        return widModalWindow(glMsg.enterMasterKey, function () { $PwdInp.focus() });

    if (fromDate > toDate)
        return widModalWindow(glMsg.enterDate);

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
    if (str.number[2] > 0) update( $('#span_search_onhold'), '(' + str.number[2] + ')' );
    if (str.number[2] > 0) update( $('#span_search_tocome'), '(' + str.number[3] + ')' );

    return;
}

function widSearchUpdate()
{
    var w = glSearch.wallet;

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

