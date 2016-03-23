// Hasq Technology Pty Ltd (C) 2013-2016
function textArea($textarea)
{
    var obj =
    {
        add : function (data)
        {
            return $textarea.val(this.val($textarea) + data);
        },
        set : function (data)
        {
            return $textarea.val(data);
        },
        clear : function (data)
        {
            data = data || '';
            return $textarea.val(data);
        },
        clearExcept : function ($exceptTextarea)
        {
            return $('textarea').not($exceptTextarea).val('');
        },
        val : function ()
        {
            return $textarea.val();
        }
    }

    return obj;
}

function widModalWindow(msg, func)
{
    $('#modal_window_content').click(function ()
    {
        $(this).find('p').empty();
        $('#modal_window').css('display', 'none');

        if (func)
            func();

        $(this).off('click');
    }
    );

    $('#modal_window').css('display', 'block');
    $('#modal_window_content').find('p').html(msg);

}

function widSetDefaultDb(dbHash)
{
    // Searching for database and save it in variable.
    var cb = function (d)
    {
        var db = engGetRespInfoDb(d);

        if (db.length > 0)
        {
            for (var i = 0; i < db.length; i++)
            {
                if (db[i].hash === dbHash)
                {
                    glCurrentDB = db[i];
                    break;
                }
            }
        }

        if (glCurrentDB.name === undefined)
            widShowDBError();
    }

    ajxSendCommand('info db', cb, hasqLogo);
}

function widShowDBError()
{
    // displays error message and blocks all UI;
    widModalWindow('Database is not accessible!<br/>Please, reload the page.');
}

function widShowPwdGuessTime(d)
{
    // Shows password guess time
    var $Zxcvbn = $('#password_zxcvbn_td');
    return (d) ? $Zxcvbn.html(d) : $Zxcvbn.empty();
}

function widShowToken(tok)
{
    // Shows hashed value of token (if the value is not a default hash)
    var $TokenText = $('#token_hash_td');

    if (!tok)
        return $TokenText.empty();

    $TokenText.html(widGetToken(tok, glCurrentDB.hash));
}

function widShowLog(text)
{
    // Shows messages in log
    var $Log = $('#' + 'log_area_div');

    text = text || '';
    $Log.html(text);
}

function widShowSearch()
{ // Shows message or image about tokens existense.
    var $Pic = $('#token_pic_span img');
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
    return ($('#password_input').val().length > 0);
}

function widIsTokenText()
{
    return ($('#token_text_textarea').val().length > 0);
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
    var $Span = $('#password_pic_span');
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
    var tokState = lr.st;
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

        if (widReceiveTab().isTransKeys() && pwd)
            widReceiveTab().disable(false);
    }

    if (tokState === 'IDX_NODN')
    {
        if (pwd)
            widCreateTab().disable(false);
    }

    if (tokState === 'OK')
    {
        widReceiveTab().readonly(false);

        if (widReceiveTab().isTransKeys())
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

        if (widReceiveTab().isTransKeys())
            widReceiveTab().disable(false);
    }

    if (tokState === 'PWD_SNDNG')
    {
        widShowKeysTab().onhold(true);
        widReceiveTab().readonly(false);

        if (widReceiveTab().isTransKeys())
            widReceiveTab().disable(false);
    }

    if (tokState === 'PWD_RCVNG')
    {
        widShowKeysTab().release(true);
        widReceiveTab().readonly(false);

        if (widReceiveTab().isTransKeys())
            widReceiveTab().disable(false);
    }
}

function widTokenTextOninput(delay)
{ // Events when tokens value changed.
	delay = +delay || 0;
	
    glLastRec = {};
    clearTimeout(glTimerId)
    widButtonsTable().toggleOff(); 
    widShowPwdInfo();
    widShowSearch();

    var $TokText = $('#token_text_textarea');
    textArea().clearExcept($TokText);

    var tok = widGetToken(textArea($TokText).val(), glCurrentDB.hash);
    widShowToken(tok);

    if (!tok)
		return widWelcomeTab().show();
	
    var cb = function (data)
    {
        var resp = engGetResp(data);

        if (resp.msg === 'ERROR')
        {
            widShowSearch();
            return widModalWindow(resp.msg + ': ' + data);
        }

        //widButtonsTable().toggleOff();

        if (resp.msg === 'IDX_NODN')
        {
            glLastRec.st = resp.msg;
            glLastRec.s = tok;
            widCreateTab().show();
        }
        else
        {
            glLastRec = engGetRespLast(data);

            var nr = engGetNewRecord(glLastRec.n, glLastRec.s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);

            glLastRec.st = engGetTokensStatus(glLastRec, nr);
            widSetDataTab().set(engGetDataValToDisplay(glLastRec.d));
            widSetDataTab().show();
        }

        widShowSearch().show(resp.msg);
        glLastRec.r = (textArea($TokText).val() !== tok) ? textArea($TokText).val() : '';
        widPasswordOninput(); //updates info about last records and password matching
    }
	
    widEmptyTab().show();
    widShowSearch().show();
	
    var cmd = 'last' + '\u0020' + glCurrentDB.name + '\u0020' + tok;

    return engSendDeferredRequest(cmd, cb, delay);

}

function widPasswordOninput()
{
    // Events when passwords value changed.
    var $PwdInp = $('#password_input');

    glPassword = $PwdInp.val() || '';
    widShowPwdGuessTime(widGetPwdGuessTime(glPassword));

    if (glLastRec.st == 'IDX_NODN' || typeof glLastRec.st == 'undefined')
        return widToggleUI(glLastRec, glPassword);

    var nr = engGetNewRecord(glLastRec.n, glLastRec.s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);

    glLastRec.st = (glPassword) ? engGetTokensStatus(glLastRec, nr) : glLastRec.st = 'PWD_WRONG';

    widShowPwdInfo(glLastRec.st);
    widToggleUI(glLastRec, glPassword);
}

function widPasswordEyeClick($obj)
{
    //shows/hides passwords by click;
    var $PwdInp = $('#password_input');
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

function widTokensTakeover(keys)
{
    keys = engGetTitleKeys(keys, glPassword, glCurrentDB.hash, glCurrentDB.magic);

    switch (keys[0].prcode)
    {
    case '23132':
        widInstantReceive(keys);
        break;
    case '23141':
        widBlockingReceiveOnHold(keys);
        break;
    case '231':
        widBlockingReceiveFull(keys);
        break;
    case '232':
        widBlockingReceiveRevert(keys);
        break;
    default:
        return widModalWindow('Bad TransKeys!');
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

function widWelcomeTab()
{
    var $Tabs = $('#tabs');
    widPasswordOninput();

    var retObj =
    {
        show : function ()
        {
            return $Tabs.tabs('option', 'active', 0);
        }
    }

    return retObj;
}

function widCreateTab()
{
    var $Table = $('#create_table');
    var $Button = $Table.find('button');
    var $Tabs = $('#tabs');

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
        }
    }

    return retObj;
}

function widCreateButtonClick()
{
    // Creates a new token record
    var $PwdInp = $('#password_input');

    if (!widIsPassword())
        return widModalWindow('Enter master key.', function ()
        {
            $PwdInp.focus()
        }
        );

    widEmptyTab().show();

    var nr = engGetNewRecord(0, glLastRec.s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);
    var nr_d = (glLastRec.r.length > 0 && glLastRec.r.length <= 160 && glLastRec.r !== glLastRec.s) ? '[' + glLastRec.r + ']' : '';
    var cmd = 'z *' + '\u0020' + glCurrentDB.name + '\u0020' + '0' + '\u0020' + glLastRec.s + '\u0020' + nr.k + '\u0020' + nr.g + '\u0020' + nr.o + '\u0020' + nr_d;

    var cb = function (data)
    {
        var r = engGetResp(data);
        if (r.msg == 'OK')
            widTokenTextOninput(); //update token info after create;
        else
            widModalWindow(r.msg + ': ' + r.cnt);
    }

    var f = function ()
    {
        ajxSendCommand(cmd, cb, hasqLogo);
    }

    setTimeout(f);
}

function widSetDataTab()
{
    var $Tabs = $('#tabs');
    var $Button = $('#set_data_table').find('button');
    var $Textarea = $('#set_data_table').find('textarea');

    var retObj =
    {
        set : function (data)
        {
            data = data || '';
            textArea($Textarea).set(data);
        },
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
        val : function ()
        {
            return textArea($Textarea).val();
        }
    }

    return retObj;
}

function widSetDataButtonClick()
{
    // Adds a new record with a specified data
    var $PwdInp = $('#password_input');
    var $Data = $('#set_data_textarea');

    if (!widIsPassword())
        return widModalWindow('Enter master key...', function ()
        {
            $PwdInp.focus()
        }
        );

    if (glLastRec.st !== 'OK')
        return widModalWindow('Token is unaccessible.<br/>Incorrect master key.', function ()
        {
            $PwdInp.focus()
        }
        );

    if (engGetDataValToRecord($Data.val()) === glLastRec.d)
        return widModalWindow('Token data is not changed...', function ()
        {
            $Data.focus()
        }
        );

    var nr = engGetNewRecord(glLastRec.n + 1, glLastRec.s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);
    var nr_d = engGetDataValToRecord($Data.val());
    var cmd = 'add * ' + glCurrentDB.name + '\u0020' + nr.n + '\u0020' + glLastRec.s + '\u0020' + nr.k + '\u0020' + nr.g + '\u0020' + nr.o + '\u0020' + nr_d;

    var cb = function (d)
    {
        var r = engGetResp(d);
        if (r.msg == 'OK')
            widTokenTextOninput();
        else
            widModalWindow(r.msg + ': ' + r.cnt);
    }

    var f = function ()
    {
        ajxSendCommand(cmd, cb, hasqLogo);
    }

    setTimeout(f);
}

function widSetDataTextareaOninput()
{
    widToggleUI(glLastRec, glPassword);
}

function widShowKeysTab()
{
    var $Table = $('#show_keys_table');
    var $Tabs = $('#tabs');
    var $AllButton = $Table.find('button');
    var $OnHoldButton = $('#show_on_hold_button');
    var $ReleaseButton = $('#show_release_button');

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
        }
    }

    return retObj;
}

function widShowKeysTabButtonClick($obj)
{
    widPasswordOninput();
    $obj.toggleClass('tab-button-on tab-button-off');
    $('.tab-button-on').not($obj).toggleClass('tab-button-on tab-button-off');
    
	var $KeyArea = $('#show_keys_textarea');
    textArea($KeyArea).clear();
	
    if (typeof glLastRec.st === 'undefined')
        return ($obj.hasClass('tab-button-on')) ? widShowKeysTab().show() : widWelcomeTab().show();

    if (glLastRec.st === 'IDX_NODN')
        return ($obj.hasClass('tab-button-on')) ? widShowKeysTab().show() : widCreateTab().show();

    return ($obj.hasClass('tab-button-on')) ? widShowKeysTab().show() : widSetDataTab().show();
}

function widShowInstantButtonClick($obj)
{
    var $PwdInp = $('#password_input');
    var $TokenArea = $('#token_text_textarea');
    var $KeyArea = $('#show_keys_textarea');

    textArea($KeyArea).clear();
    $('.show-keys-button-on').not($obj).toggleClass('show-keys-button-on show-keys-button-off');

    if ($obj.hasClass('button-disabled'))
    {
        if ($obj.hasClass('show-keys-button-on'))
            return $obj.toggleClass('show-keys-button-on show-keys-button-off');

        if (typeof glLastRec.st === 'undefined')
            return widModalWindow('Enter token name...', function ()
            {
                $TokenArea.focus()
            }
            );

        if (glLastRec.st === 'IDX_NODN')
            return widModalWindow('Create token first...');

        if (!widIsPassword())
            return widModalWindow('Enter master key...', function ()
            {
                $PwdInp.focus()
            }
            );

        if (glLastRec.st === 'PWD_SNDNG')
        {
            $('.show-keys-button-on').toggleClass('show-keys-button-on show-keys-button-off');
            return widModalWindow('Token is locked.</br>Use \"On Hold\" button.');
        }

        if (glLastRec.st === 'PWD_RCVNG')
        {
            $('.show-keys-button-on').toggleClass('show-keys-button-on show-keys-button-off');
            return widModalWindow('Token is locked.</br>Use \"Release\" button.');
        }

        if (glLastRec.st !== 'OK')
            return widModalWindow('Token is unaccessible</br>or incorrect master key.', function ()
            {
                $PwdInp.focus()
            }
            );
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
    var $PwdInp = $('#password_input');
    var $TokenArea = $('#token_text_textarea');
    var $KeyArea = $('#show_keys_textarea');

    textArea($KeyArea).clear();
    $('.show-keys-button-on').not($obj).toggleClass('show-keys-button-on show-keys-button-off');

    if ($obj.hasClass('button-disabled'))
    {
        if ($obj.hasClass('show-keys-button-on'))
            return $obj.toggleClass('show-keys-button-on show-keys-button-off');

        if (typeof glLastRec.st === 'undefined')
            return widModalWindow('Enter token name...', function ()
            {
                $TokenArea.focus()
            }
            );

        if (glLastRec.st === 'IDX_NODN')
            return widModalWindow('Create token first...');

        if (!widIsPassword())
            return widModalWindow('Enter master key...', function ()
            {
                $PwdInp.focus()
            }
            );

        if (glLastRec.st !== 'OK' && glLastRec.st !== 'PWD_SNDNG')
            return widModalWindow('Token is unaccessible</br>or incorrect master key.', function ()
            {
                $PwdInp.focus()
            }
            );
    }

    $obj.toggleClass('show-keys-button-on show-keys-button-off');

    if ($obj.hasClass('show-keys-button-on'))
    {
        var k2,
        line,
        mergedKeys;

        if (glLastRec.st === 'OK')
        { // Blocking Send
            var k1 = engGetKey(glLastRec.n + 1, glLastRec.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
            k2 = engGetKey(glLastRec.n + 2, glLastRec.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
            var g1 = engGetKey(glLastRec.n + 2, glLastRec.s, k2, glCurrentDB.magic, glCurrentDB.hash);
            line = glLastRec.s + '\u0020' + k1 + '\u0020' + g1 + '\u0020';

            textArea($KeyArea).add(line);

            mergedKeys = $KeyArea.val().replace(/\s+/g, '');
            line = engGetHash(mergedKeys, 's22').substring(0, 4) + '\u0020' + glCurrentDB.altname + '\u0020' + '23141';

            textArea($KeyArea).add(line);

            if (0)
            {
                line = glLastRec.s + '\u0020' + k1 + '\u0020';
                textArea($KeyArea).add(line);

                mergedKeys = $KeyArea.val().replace(/\s+/g, '');
                line = engGetHash(mergedKeys, 's22').substring(0, 4) + '\u0020' + glCurrentDB.altname + '\u0020' + '231';

                textArea($KeyArea).add(line);
            }
        }

        if (glLastRec.st === 'PWD_SNDNG')
        {
            k1 = engGetKey(glLastRec.n + 1, glLastRec.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
            line = glLastRec.s + '\u0020' + k1 + '\u0020';

            textArea($KeyArea).add(line);

            mergedKeys = $KeyArea.val().replace(/\s+/g, '');
            line = engGetHash(mergedKeys, 's22').substring(0, 4) + '\u0020' + glCurrentDB.altname + '\u0020' + '231';

            textArea($KeyArea).add(line);
        }
    }
}

function widShowReleaseButtonClick($obj)
{
    var $PwdInp = $('#password_input');
    var $TokenArea = $('#token_text_textarea');
    var $KeyArea = $('#show_keys_textarea');

    textArea($KeyArea).clear();
    $('.show-keys-button-on').not($obj).toggleClass('show-keys-button-on show-keys-button-off');

    if ($obj.hasClass('button-disabled'))
    {
        if ($obj.hasClass('show-keys-button-on'))
            return $obj.toggleClass('show-keys-button-on show-keys-button-off');

        if (typeof glLastRec.st === 'undefined')
            return widModalWindow('Enter token name...', function ()
            {
                $TokenArea.focus()
            }
            );

        if (glLastRec.st === 'IDX_NODN')
            return widModalWindow('Create token first...');

        if (!widIsPassword())
            return widModalWindow('Enter master key...', function ()
            {
                $PwdInp.focus()
            }
            );

        if (glLastRec.st === 'OK')
            return widModalWindow('Token is fully accessible.');

        if (glLastRec.st !== 'PWD_RCVNG')
        {
            $('.show-keys-button-on').toggleClass('show-keys-button-on show-keys-button-off');
            return widModalWindow('Token is unaccessible</br>or incorrect master key.', function ()
            {
                $PwdInp.focus()
            }
            );
        }
    }

    $obj.toggleClass('show-keys-button-on show-keys-button-off');

    if ($obj.hasClass('show-keys-button-on'))
    {
        var n2 = glLastRec.n + 2;
        var k2 = engGetKey(n2, glLastRec.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
        var line = glLastRec.s + '\u0020' + k2 + '\u0020';

        textArea($KeyArea).add(line);

        var mergedKeys = $KeyArea.val().replace(/\s+/g, '');
        line = engGetHash(mergedKeys, 's22').substring(0, 4) + '\u0020' + glCurrentDB.altname + '\u0020' + '232';

        textArea($KeyArea).add(line);
    }
}

function widReceiveTab()
{
    var $Tabs = $('#tabs');
    var $Table = $('#receive_table');
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
        isTransKeys : function ()
        {
            return engIsTransKeys(textArea($Textarea).val());
        }
    }

    return retObj;
}

function widReceiveTabButtonClick($obj)
{
    widPasswordOninput();
    $obj.toggleClass('tab-button-on tab-button-off');
    $('.tab-button-on').not($obj).toggleClass('tab-button-on tab-button-off');

	var $KeyArea = $('#show_keys_textarea');
    textArea($KeyArea).clear();
	
    if (typeof glLastRec.st === 'undefined')
        return ($obj.hasClass('tab-button-on')) ? widReceiveTab().show() : widWelcomeTab().show();

    if (glLastRec.st === 'IDX_NODN')
        return ($obj.hasClass('tab-button-on')) ? widReceiveTab().show() : widCreateTab().show();

    return ($obj.hasClass('tab-button-on')) ? widReceiveTab().show() : widSetDataTab().show();

}

function widReceiveButtonClick()
{
    var $TransKeysArea = $('#receive_keys_textarea');
    var $TokenArea = $('#token_text_textarea');
    var $PwdInp = $('#password_input');
    var rawTransKeys = $('#receive_keys_textarea').val();

    if (glLastRec.st === 'IDX_NODN')
        return widModalWindow('Token is free</br>You can assign it...');

    if (!widIsPassword())
        return widModalWindow('Enter master key...', function ()
        {
            $PwdInp.focus()
        }
        );

    if (!engIsTransKeys(rawTransKeys))
        return widModalWindow('Transkeys is missing or corrupt.</br>Enter correct keys...', function ()
        {
            $TransKeysArea.focus()
        }
        );

    var tokText = [glLastRec.r];

    var transKeys = engGetTransKeys(rawTransKeys);
    var tok = engGetMergedTokensList(engGetHashedTokensList(transKeys), tokText, glCurrentDB.hash);
    tok = tok[0].replace(/\[|\]/g, '');

    var cb = function (data)
    {
        var r = engGetResp(data);

        if (r.msg !== 'OK')
            return widModalWindow(r.msg + ': ' + r.cnt);

        var lr = engGetRespLast(data);

        if (lr.msg === 'ERROR')
            return widModalWindow(lr.msg + ': ' + lr.cnt); //just in case

        var nr = engGetNewRecord(lr.n, lr.s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);

        lr.st = engGetTokensStatus(lr, nr);
        transKeys[0].n = (transKeys[0].prcode == '231') ? lr.n - 1 : lr.n;
        textArea($TokenArea).clear(tok);

        widTokensTakeover(transKeys);
    }

    var cmd = 'last' + '\u0020' + glCurrentDB.name + '\u0020' + transKeys[0].s;

    var f = function ()
    {
        ajxSendCommand(cmd, cb, hasqLogo);
    }

    setTimeout(f);
}

function widReceiveTextareaOninput()
{
    widToggleUI(glLastRec, glPassword);
}

function widInstantReceive(keys)
{
    var n1 = keys[0].n + 1;
    var n2 = keys[0].n + 2;
    var s = keys[0].s;
    var k1 = keys[0].k1;
    var g1 = keys[0].g1;
    var o1 = keys[0].o1;
    var k2 = keys[0].k2;
    var g2 = keys[0].g2;
    var o2 = keys[0].o2;

    var addCmd1 = 'add * ' + glCurrentDB.name + ' ' + n1 + ' ' + s + ' ' + k1 + ' ' + g1 + ' ' + o1;
    var addCmd2 = 'add * ' + glCurrentDB.name + ' ' + n2 + ' ' + s + ' ' + k2 + ' ' + g2 + ' ' + o2;

    var cb2 = function (data)
    {
        var resp = engGetResp(data);
        (resp.msg === 'ERROR') ? widModalWindow(resp.msg + ': ' + resp.cnt) : widTokenTextOninput();
    }

    var cb1 = function (data)
    {
        var resp = engGetResp(data);
        (resp.msg === 'ERROR') ? widModalWindow(resp.msg + ': ' + resp.cnt) : ajxSendCommand(addCmd2, cb2, hasqLogo);
    }

    ajxSendCommand(addCmd1, cb1, hasqLogo);
}

function widBlockingReceiveOnHold(keys)
{
    var n1 = keys[0].n + 1;
    var s = keys[0].s;
    var k1 = keys[0].k1;
    var g1 = keys[0].g1;
    var o1 = keys[0].o1;

    var addCmd = 'add * ' + glCurrentDB.name + ' ' + n1 + ' ' + s + ' ' + k1 + ' ' + g1 + ' ' + o1;

    var cb = function (data)
    {
        var resp = engGetResp(data);
        (resp.msg === 'ERROR') ? widModalWindow(resp.msg + ': ' + resp.cnt) : widTokenTextOninput();
    }

    ajxSendCommand(addCmd, cb, hasqLogo);
}

function widBlockingReceiveFull(keys)
{
    var n2 = keys[0].n + 2;
    var s = keys[0].s;
    var k2 = keys[0].k2;
    var g2 = keys[0].g2;
    var o2 = keys[0].o2;

    var addCmd = 'add * ' + glCurrentDB.name + ' ' + n2 + ' ' + s + ' ' + k2 + ' ' + g2 + ' ' + o2;

    var cb = function (data)
    {
        var resp = engGetResp(data);
        (resp.msg === 'ERROR') ? widModalWindow(resp.msg + ': ' + resp.cnt) : widTokenTextOninput();
    }

    ajxSendCommand(addCmd, cb, hasqLogo);
}

function widBlockingReceiveRevert(keys)
{
    var n1 = keys[0].n1;
    var n2 = keys[0].n2;
    var s = keys[0].s;
    var k1 = keys[0].k1;
    var g1 = keys[0].g1;
    var o1 = keys[0].o1;
    var k2 = keys[0].k2;
    var g2 = keys[0].g2;
    var o2 = keys[0].o2;

    var addCmd1 = 'add * ' + glCurrentDB.name + ' ' + n1 + ' ' + s + ' ' + k1 + ' ' + g1 + ' ' + o1;
    var addCmd2 = 'add * ' + glCurrentDB.name + ' ' + n2 + ' ' + s + ' ' + k2 + ' ' + g2 + ' ' + o2;

    var cb2 = function (data)
    {
        var resp = engGetResp(data);
        (resp.msg === 'ERROR') ? widModalWindow(resp.msg + ': ' + resp.cnt) : widTokenTextOninput();
    }

    var cb1 = function (data)
    {
        var resp = engGetResp(data);
        (resp.msg === 'ERROR') ? widModalWindow(resp.msg + ': ' + resp.cnt) : ajxSendCommand(addCmd2, cb2, hasqLogo);
    }

    ajxSendCommand(addCmd1, cb1, hasqLogo);
}

function widSearchTab()
{
    var $Table = $('#search_table');
    var $Button = $Table.find('button');
    var $Tabs = $('#tabs');

    var retObj =
    {
        disable : function (comm)
        {
            (comm) ? $Button.addClass('button-disabled').removeClass('button-enabled') : $Button.addClass('button-enabled').removeClass('button-disabled');
        },
        show : function ()
        {
            $Tabs.tabs('option', 'active', 5);
        }
    }

    return retObj;
}

function widSearchTabButtonClick($obj)
{
    widPasswordOninput();
    $obj.toggleClass('tab-button-on tab-button-off');
    $('.tab-button-on').not($obj).toggleClass('tab-button-on tab-button-off');

	var $KeyArea = $('#show_keys_textarea');
    textArea($KeyArea).clear();

    if (typeof glLastRec.st == 'undefined')
        return ($obj.hasClass('tab-button-on')) ? widSearchTab().show() : widWelcomeTab().show();

    if (glLastRec.st == 'IDX_NODN')
        return ($obj.hasClass('tab-button-on')) ? widSearchTab().show() : widCreateTab().show();

    return ($obj.hasClass('tab-button-on')) ? widSearchTab().show() : widSetDataTab().show();
}

function widSearchButtonClick()
{
    var $PwdInp = $('#password_input');
    var $From = $('#from_datepicker_input');
    var $To = $('#to_datepicker_input');

    var fromDate = new Date($From.datepicker('getDate'));
    var toDate = new Date($To.datepicker('getDate'));

    if (!widIsPassword())
        return widModalWindow('Master key is empty', function ()
        {
            $PwdInp.focus()
        }
        );

    if (fromDate > toDate)
        return widModalWindow('Date "From" must be earlier than "To"', function ()  {}

        );

    var dates = engSearchClick(fromDate, toDate, widSearchProgress);

    // set new dates FIXME

}

function widSearchProgress(fn, data, dat2)
//  1   Set button according to g_searchOn
//  2   Show current file
//  3   Update results
{
	var width = $('#mine_search_results_div').innerWidth();
	$('#mine_search_results_div').css('max-width', width);
	
    if( fn==1 )
    {
        if( data ) {} // set Button to "Searching/Stop"
        else {} // set Button to "Start"
        return;
    }

    if( fn==2 )
    {
        var name = data.substr(12);
        var x = "Block: <a href=\"/file "+dat2+"\">"+name+"</a>";
        $('#current_slice_span').html(x);
        return;
    }
	
    if( fn==3 )
    {
		$('#mine_search_results_div').html(widSearchUpdate());
        return;
    }
}

function widSearchUpdate()
{
    var r = glSearch.result;

    var t = "";

    for( var i in r )
    {
        var x = r[i];
        t += x.s + " Status:"+x.state+'\n';
    }

    return t;
}

function widEmptyTab()
{
    var $Tabs = $('#tabs');
    widPasswordOninput();

    var retObj =
    {
        show : function ()
        {
            $Tabs.tabs('option', 'active', 6);
        }
    }

    return retObj;
}
