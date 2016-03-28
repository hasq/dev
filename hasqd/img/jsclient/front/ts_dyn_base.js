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
        clear : function ()
        {
            return $textarea.val('');
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
    $('#modal_window_content')
    .click
    (function ()
    {
        $(this).find('p').empty();
        $('#modal_window').css('display', 'none');

        if (func)
            func();

        $(this).off('click');
    });

    $('#modal_window').css('display', 'block');
    $('#modal_window_content').find('p').html(msg);
}

function widSetDefaultDb(dbHash)
{
    // Searching for database and save it in variable.
    var cb = function (resp, db)
    {
        if (resp.msg === 'OK' && typeof db !== 'null')
            for (var i = 0; i < db.length; i++)
                if (db[i].hash === dbHash)
                    return glCurrentDB = db[i];

         return widModalWindow('Database is not accessible!<br/>Please, reload the page.');
    }

    engNcInfoDb(cb);
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

function widShowSearch() // Shows message or image about tokens existense.
{
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

        if (widReceiveTab().isKeys() && pwd)
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

function widTokenTextOninput(delay) // Events when tokens value changed.
{
    delay = +delay || 0;
    glLastRec = {};
    clearTimeout(glTimerId)
    widShowPwdInfo();
    widShowSearch();

    var $TokText = $('#token_text_textarea');

    if (0)
        textArea().clearExcept($TokText);

    var tok = widGetToken(textArea($TokText).val(), glCurrentDB.hash);
    widShowToken(tok);

    if (!widShowKeysTab().isOn() && !widReceiveTab().isOn() && !widSearchTab().isOn())
        widEmptyTab().show();

    if (!tok)
        return widPasswordOninput();

    var cb = function (resp, record)
    {
        ///var resp = engGetResponseHeader(data);

        if (resp.msg === 'ERROR')
        {
            widShowSearch();
            return widModalWindow(resp.msg + ': ' + data);
        }

        if (resp.msg === 'IDX_NODN')
        {
            glLastRec.st = resp.msg;
            glLastRec.s = tok;

            if (!widShowKeysTab().isOn() && !widReceiveTab().isOn() && !widSearchTab().isOn())
                widCreateTab().show();
        }
        else
        {
            ///glLastRec = engGetParsedLastRecord(data);
            glLastRec = record;
            glLastRec.st = 'PWD_WRONG';
            widSetDataTab().set(engGetDataValToDisplay(glLastRec.d));

            if (!widShowKeysTab().isOn() && !widReceiveTab().isOn() && !widSearchTab().isOn())
                widSetDataTab().show();
        }

        widShowSearch().show(resp.msg);
        glLastRec.r = (textArea($TokText).val() !== tok) ? textArea($TokText).val() : '';
        widPasswordOninput(); //updates info about last records and password matching
    }

    widShowSearch().show();

    ///var cmd = 'last' + '\u0020' + glCurrentDB.name + '\u0020' + tok;

    ///return engSendDeferredRequest(cmd, cb, delay);

    return engNcDeferredLast(cb, tok, delay);
}

function widPasswordOninput()
{
    // Events when passwords value changed.
    var $PwdInp = $('#password_input');
    glPassword = $PwdInp.val() || '';

    widShowPwdGuessTime(widGetPwdGuessTime(glPassword));

    if (glLastRec.st === 'IDX_NODN' || typeof glLastRec.st === 'undefined')
        return widToggleUI(glLastRec, glPassword);

    var rec = engGetNewRecord(glLastRec.n, glLastRec.s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);

    glLastRec.st = (glPassword) ? engGetTokensStatus(glLastRec, rec) : glLastRec.st = 'PWD_WRONG';

    if (glPassword)
        widShowPwdInfo(glLastRec.st);
    else
        widShowPwdInfo();

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
    var $Tabs = $('#tabs_div');
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
    var $Tabs = $('#tabs_div');

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
    var $PwdInp = $('#password_input');

    if (!widIsPassword())
        return widModalWindow('Enter master key.', function () { $PwdInp.focus() });

    widEmptyTab().show();

    var cb = function (resp)
    {
        if (resp.msg === 'OK')
            widTokenTextOninput(); //update token info after create;
            else
                widModalWindow(resp.msg + ': ' + r.cnt);
    }

    engNcZ(cb);
}

function widSetDataTab()
{
    var $Tabs = $('#tabs_div');
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
    var $PwdInp = $('#password_input');
    var $Data = $('#set_data_textarea');

    if (!widIsPassword())
        return widModalWindow('Enter master key...', function ()
    {
        $PwdInp.focus()
    });

    if (glLastRec.st !== 'OK')
        return widModalWindow('Token is unaccessible.<br/>Incorrect master key.', function ()
    {
        $PwdInp.focus()
    });

    if (engGetDataValToRecord($Data.val()) === glLastRec.d)
        return widModalWindow('Token data is not changed...', function ()
    {
        $Data.focus()
    });

    var cb = function (resp, jobId)
    {
        if (resp.msg === 'OK')
            widTokenTextOninput();
        else
            widModalWindow(resp.msg + ': ' + resp.cnt);
    }

    engNcAdd(cb, $Data.val());

}

function widSetDataTextareaOninput()
{
    widToggleUI(glLastRec, glPassword);
}

function widShowKeysTab()
{
    var $Table = $('#show_keys_table');
    var $Tabs = $('#tabs_div');
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
        },
        isOn : function ()
        {
            return ($Tabs.tabs('option', 'active') === 3) ? true : false;
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
        return ($obj.hasClass('tab-button-on')) ? widShowKeysTab().show() : widEmptyTab().show();

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
        });

        if (glLastRec.st === 'IDX_NODN')
            return widModalWindow('Create token first...');

        if (!widIsPassword())
            return widModalWindow('Enter master key...', function ()
        {
            $PwdInp.focus()
        });

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
        });
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
        });

        if (glLastRec.st === 'IDX_NODN')
            return widModalWindow('Create token first...');

        if (!widIsPassword())
            return widModalWindow('Enter master key...', function ()
        {
            $PwdInp.focus()
        });

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
        if (glLastRec.st === 'OK')  // Blocking Send
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
        });

        if (glLastRec.st === 'IDX_NODN')
            return widModalWindow('Create token first...');

        if (!widIsPassword() || glLastRec.st === 'PWD_WRONG')
            return widModalWindow('Enter valid master key...', function ()
        {
            $PwdInp.focus()
        });

        if (glLastRec.st === 'OK')
            return widModalWindow('Token is fully accessible.');
    }

    $obj.toggleClass('show-keys-button-on show-keys-button-off');

    if ($obj.hasClass('show-keys-button-on'))
    {
        var k;
        var prCode;

        if (glLastRec.st === 'PWD_RCVNG')
        {
            k = engGetKey(glLastRec.n + 2, glLastRec.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
            prCode = '232';
        }

        if (glLastRec.st === 'PWD_SNDNG')
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
    var $Tabs = $('#tabs_div');
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
        isKeys : function ()
        {
            return engIsTransKeys(textArea($Textarea).val());
        },
        isOn : function ()
        {
            return ($Tabs.tabs('option', 'active') === 4) ? true : false;
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
        return ($obj.hasClass('tab-button-on')) ? widReceiveTab().show() : widEmptyTab().show();

    if (glLastRec.st === 'IDX_NODN')
        return ($obj.hasClass('tab-button-on')) ? widReceiveTab().show() : widCreateTab().show();

    return ($obj.hasClass('tab-button-on')) ? widReceiveTab().show() : widSetDataTab().show();

}

function widReceiveTextareaOninput()
{
    widToggleUI(glLastRec, glPassword);
}

function widReceiveButtonClick()
{
    var $TransKeysArea = $('#receive_keys_textarea');
    var $PwdInp = $('#password_input');
    var rawTransKeys = $TransKeysArea.val();

    if (glLastRec.st === 'IDX_NODN')
        return widModalWindow('Token is free</br>You can assign it...');

        if (!widIsPassword())
            return widModalWindow('Enter master key...', function () { $PwdInp.focus() });

    if (!engIsTransKeys(rawTransKeys))
        return widModalWindow(glMsg.badAcceptKeys, function () { $TransKeysArea.focus() });

    widShowTokenName();
}

function widShowTokenName()
{
    var $TokenArea = $('#token_text_textarea');
    var $TransKeysArea = $('#receive_keys_textarea');
    var transKeys = engGetTransKeys($TransKeysArea.val());
    var tokText = [$TokenArea.val()] || [''];
    var tok = engGetMergedTokensList(engGetHashedTokensList(transKeys), tokText, glCurrentDB.hash)[0].replace(/^\[|\]$/g, '');

    if (transKeys[0].s === engGetHash(tok, glCurrentDB.hash))
    {
        textArea($TokenArea).set(tok);
        widReceiveKey(transKeys);
    }
    else
    {
        var cb = function (resp, record)
        {
            if (resp.msg !== 'OK')
                return widModalWindow(resp.msg + ': ' + resp.cnt);

            if (record.msg === 'ERROR')
             return widModalWindow(record.msg + ': ' + record.cnt); //just in case

                var d = record.d;
            var dLen = d.length;

            if (d && d.charAt(0) === '[' && d.charAt(dLen - 1) === ']' && engGetHash(d.substring(1, dLen - 1), glCurrentDB.hash) === transKeys[0].s)
                textArea($TokenArea).set(d.substring(1, dLen - 1));
            else
                textArea($TokenArea).set(transKeys[0].s);

            widReceiveKey(transKeys);
        }

        engNcRecord(cb, tok);
    }
}

function widReceiveKey(keys)
{
    var cb = function (data)
    {
        var r = engGetResponseHeader(data);

        if (r.msg !== 'OK')
            return widModalWindow(r.msg + ': ' + r.cnt);

        var lr = engGetParsedLastRecord(data);

        if (lr.msg === 'ERROR')
            return widModalWindow(lr.msg + ': ' + lr.cnt); //just in case

            keys[0].n = lr.n;

        widTokensTakeover(keys);
    }

    var cmd = 'last' + '\u0020' + glCurrentDB.name + '\u0020' + keys[0].s;

    ajxSendCommand(cmd, cb, hasqLogo);
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

    var cb1 = function (data)
    {
        var cb2 = function (data)
        {
            var resp = engGetResponseHeader(data);
            console.log(data);
            (resp.msg === 'ERROR') ? widModalWindow(resp.msg + ': ' + resp.cnt) : widTokenTextOninput(500);
        }

        var resp = engGetResponseHeader(data);
        console.log(data);
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
        var resp = engGetResponseHeader(data);

        (resp.msg === 'ERROR') ? widModalWindow(resp.msg + ': ' + resp.cnt) : widTokenTextOninput(500);
    }

    ajxSendCommand(addCmd, cb, hasqLogo);
}

function widBlockingReceiveFull(keys)
{
    var n1 = keys[0].n + 1;
    var s = keys[0].s;
    var k1 = keys[0].k1;
    var g1 = keys[0].g1;
    var o1 = keys[0].o1;

    var addCmd = 'add * ' + glCurrentDB.name + ' ' + n1 + ' ' + s + ' ' + k1 + ' ' + g1 + ' ' + o1;

    var cb = function (data)
    {
        var resp = engGetResponseHeader(data);

        (resp.msg === 'ERROR') ? widModalWindow(resp.msg + ': ' + resp.cnt) : widTokenTextOninput(500);
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

    var cb1 = function (data)
    {
        var cb2 = function (data)
        {
            var resp = engGetResponseHeader(data);
            console.log(data);
            (resp.msg === 'ERROR') ? widModalWindow(resp.msg + ': ' + resp.cnt) : widTokenTextOninput(500);
        }

        var resp = engGetResponseHeader(data);
        console.log(data);
        (resp.msg === 'ERROR') ? widModalWindow(resp.msg + ': ' + resp.cnt) : ajxSendCommand(addCmd2, cb2, hasqLogo);
    }

    ajxSendCommand(addCmd1, cb1, hasqLogo);
}

function widSearchTab()
{
    var $Table = $('#search_table');
    var $Button = $Table.find('button').not('.search-tab-button').not('.search-tab-button-active');
    var $Tabs = $('#tabs_div');

    var retObj =
    {
        disable : function (comm)
        {
            (comm) ? $Button.addClass('button-disabled').removeClass('button-enabled') : $Button.addClass('button-enabled').removeClass('button-disabled');
        },
        show : function ()
        {
            $Tabs.tabs('option', 'active', 5);
        },
        isOn : function ()
        {
            return ($Tabs.tabs('option', 'active') === 5) ? true : false;
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
        return ($obj.hasClass('tab-button-on')) ? widSearchTab().show() : widEmptyTab().show();

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

function widSearchMineButtonClick($obj)
{
    var $Tabs = $('#search_inner_tabs_div');
    var $AllButtons = $('#search_tab_buttons_area_td button');

    $('#search_inner_tabs_div').tabs('option', 'active', 0);
    $AllButtons.addClass('search-tab-button').removeClass('search-tab-button-active');
    $obj.addClass('search-tab-button-active').removeClass('search-tab-button');

}

function widSearchOnHoldButtonClick($obj)
{
    var $Tabs = $('#search_inner_tabs_div');
    var $AllButtons = $('#search_tab_buttons_area_td button');

    $('#search_inner_tabs_div').tabs('option', 'active', 1);
    $AllButtons.addClass('search-tab-button').removeClass('search-tab-button-active');
    $obj.addClass('search-tab-button-active').removeClass('search-tab-button');
}

function widSearchToComeButtonClick($obj)
{
    var $Tabs = $('#search_inner_tabs_div');
    var $AllButtons = $('#search_tab_buttons_area_td button');

    $('#search_inner_tabs_div').tabs('option', 'active', 2);
    $AllButtons.addClass('search-tab-button').removeClass('search-tab-button-active');
    $obj.addClass('search-tab-button-active').removeClass('search-tab-button');
}

function widSearchPastButtonClick($obj)
{
    var $Tabs = $('#search_inner_tabs_div');
    var $AllButtons = $('#search_tab_buttons_area_td button');

    $('#search_inner_tabs_div').tabs('option', 'active', 3);
    $AllButtons.addClass('search-tab-button').removeClass('search-tab-button-active');
    $obj.addClass('search-tab-button-active').removeClass('search-tab-button');
}


function widSearchProgress(fn, data, dat2)
//  1   Set button according to g_searchOn
//  2   Show current file
//  3   Update results
{
    var width = $('#search_tab_area_td').innerWidth() - 4;
    var height = $('#search_tab_area_td').innerHeight() - 4;
    $('#mine_search_results_div').css('width', width);

    if (fn == 1)
    {
        if (data)
        {}
        // set Button to "Searching/Stop"
        else
        {}
        // set Button to "Start"
        return;
    }

    if (fn == 2)
    {
        var name = data.substr(12);
        var x = "Block: <a href=\"/file " + dat2 + "\">" + name + "</a>";
        $('#current_slice_span').html(x);
        return;
    }

    if (fn == 3)
    {
        var str = widSearchUpdate();

        // update widgit only if required
        function update(o, newstr)
        {
            var oldstr = o.html();

            if (newstr.length != oldstr.length || newstr != oldstr)
                o.html(newstr);
        }

        update( $('#mine_search_results_div'), str[1] );
        update( $('#onhold_search_results_div'), str[2] );
        update( $('#receivable_search_results_div'), str[3] );
        update( $('#old_search_results_div'), str[4] );

        return;
    }
}

function widSearchUpdate()
{
    var r = glSearch.result;

    var t = ["", "", "", "", ""];

    for (var i in r)
    {
        var x = r[i];

        t[x.state] += x.s + " : " + x.state + '\n';
    }

    return t;
}

function widEmptyTab()
{
    var $Tabs = $('#tabs_div');
    widPasswordOninput();

    var retObj =
    {
        show : function ()
        {
            return $Tabs.tabs('option', 'active', 6);
        },
        isOn : function ()
        {
            return ($Tabs.tabs('option', 'active') === 6) ? true : false;
        }
    }

    return retObj;
}