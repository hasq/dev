// Hasq Technology Pty Ltd (C) 2013-2016

function textArea($textarea) {
    return {
        add: function (data) {
            var _this = this;

            return _this.val(_this.val() + data);
        },
        clear: function () {
            var _this = this;

            return _this.val('');
        },
        clearExcept: function ($exceptTextarea) {
            return $('textarea')
                .not($exceptTextarea)
                .val('');
        },
        val: function (data) {
            return (['undefined', 'null'].indexOf(typeof(data)) === -1)
                ? $textarea.val(data)
                : $textarea.val();
        }
    }
}

function widSelectAndCopy($Obj) {
    var selectedText;

    $Obj.select();

    selectedText = window.getSelection().toString();

    try {
        let successful = document.execCommand('copy');
        let msg = successful ? 'successful' : 'unsuccessful';
    } catch (err) {}
}

function widDatePickerInit() {
    $('#input_from_datepicker').datepicker({
        dateFormat: 'yy/mm/dd',
        minDate: new Date(2016, 0, 1),
        maxDate: new Date(),
        showMonthAfterYear: true,
        showOtherMonths: true,
        selectOtherMonths: true,
        changeMonth: true,
        changeYear: true,
        onClose: function (selectedDate) {
            $('#input_to_datepicker')
                .datepicker('option', 'minDate', selectedDate);
        }
    });

    $('#input_to_datepicker').datepicker({
        dateFormat: 'yy/mm/dd',
        minDate: new Date(2016, 0, 1),
        maxDate: new Date(),
        showMonthAfterYear: true,
        showOtherMonths: true,
        selectOtherMonths: true,
        changeMonth: true,
        changeYear: true,
        onClose: function (selectedDate) {
            $('#input_from_datepicker')
                .datepicker('option', 'maxDate', selectedDate);
        }
    });

    $('#input_from_datepicker')
        .attr('maxlength', '10')
        .datepicker('setDate', new Date());

    $('#input_to_datepicker').attr('maxlength', '10')
        .datepicker('setDate', new Date());
}

function widShowHidePassword() {
    $('#input_show_hide_checkbox').click(function () {
        (this.checked)
            ? $('.password').attr('type', 'text')
            : $('.password').attr('type', 'password');
    });
}

function widModalWindow(msg, func) {
    var $Window = $('#div_modal_window');
    var $Content = $('#div_modal_window_content');
    var width = $('body').outerWidth();
    var click, esc;

    $Content.width(width);

    click = function () {
        $Window.find('p').empty();
        $Window.css('display', 'none');

        if (Boolean(func)) {
            func();
        }

        $Window.off('click');
        $(document).off('keyup');
        $(window).off('beforeunload');
    };

    esc = function (e) {
        e.keyCode == 27 && click();
    }

    $Window.click(function () {
        click();
    });

    $(document).keyup(function (event) {
        esc(event);
    });

    $(window).on('beforeunload', function () {
        return 'Do you realy wont to leave this page?'
    });

    $Window.css('display', 'block');
    $Window.find('p').html(msg);
}

function widHelpMessageBox($Obj) {
    var str = $Obj.html();

    if (str[0] !== '<') {
        str = str
            .replace(/\s/g, '_')
            .replace(/[^A-Za-z09_]/g, '')
            .toLowerCase();
    } else {
        str = $Obj.find('span').attr('id');
    }

    return widModalWindow(gHelp(str));
}

// Searching for database and save it in variable.
function widSetDefaultDb(hash) {
    var cb = function (resp, db) {
        if (resp === HASQD_RESP.OK && db.length !== 0) {
            gCurrentDB = engGetDbByHash(db, hash);
        } else {
            widModalWindow(gMsg.badDataBase);
        }
    }

    engNcInfoDb(cb);
}

// Shows password guess time
function widShowPwdGuessTime(d) {
    var $Zxcvbn = $('#span_password_zxcvbn');

    return (d) ? $Zxcvbn.html(d) : $Zxcvbn.empty();
}

function widShowTokName(tok) {
// Shows token raw name (if the value is not a default hash)
    var $TokName = $('#textarea_token_name');
    var possibleRaw = engGetClearData($TokName.val());

    if (arguments.length === 0) {
        return $TokName.empty();
    }

    if (tok.s === engGetHash(possibleRaw, gCurrentDB.hash)) {
        return;
    }

    return (tok.s === engGetHash(tok.raw, gCurrentDB.hash))
        ? $TokName.val(tok.raw)
        : $TokName.val(tok.s);
}

// Shows hashed value of token (if the value is not a default hash)
function widShowTokHash(dn) {
    var $TokHash = $('#td_token_hash');

    if (arguments.length == 0) {
        return $TokHash.empty();
    } else if (dn === null) {
        return $TokHash.html(gMsg.badTokenName);
    }

    $TokHash.html(engGetTokenHash(dn, gCurrentDB.hash));
}

function widShowTokStatus() // Shows message or image about tokens existense.
{
    var $Pic = $('#span_token_lock img');

    $Pic
        .removeAttr('src')
        .removeProp('title')
        .hide();

    return {
        show: function (d) {
            if (d === HASQD_RESP.IDX_NODN) {
                return $Pic
                    .attr('src', imgLockOpen)
                    .prop('title', 'No such token')
                    .show();
            }

            if (d === HASQD_RESP.OK) {
                return $Pic
                    .attr('src', imgLockClosed)
                    .prop('title', 'Token exists')
                    .show();
            }

            return $Pic
                .attr('src', imgMsgWait)
                .prop('title', 'Searching for token...')
                .show();
        }
    }
}

function widShowLog(text) {
    // Shows messages in log
    var $Log = $('#' + 'div_log_area');

    text = text || '';
    $Log.html(text);
}

function widIsPassword() {
    return ($('#input_password').val().length > 0);
}

function widIsTokenText() {
    return ($('#textarea_token_name').val().length > 0);
}

//Returns hash of raw tokens value;
function engGetTokenHash(data, hash) {
    return (engIsHash(data, hash)) ? data : engGetHash(data, hash);
}

// Returns an image displaying the password match
function widGetImgOfTokStatus(status) {
    var r = {};

    switch (status) {
        case 1:
            r.img = imgPwdOk;
            r.title = 'OK';
            break;
        case 2:
            r.img = imgPwdSndng;
            r.title = 'Token is locked (sending)';
            break;
        case 3:
            r.img = imgPwdRcvng;
            r.title = 'Token is locked (receiving)';
            break;
        case 4:
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

// Shows an image displaying the password match
function widShowPwdInfo(status) {
    var $Span = $('#span_password_pic');
    var r = widGetImgOfTokStatus(status);

    $Span.find('img').attr('src', r.img).prop('title', r.title);
}

function widGetPwdGuessTime(pwd) {
    // Returns guess time of specified password
    return (pwd)
        ? 'Guess time: ' + zxcvbn(pwd)
            .crack_times_display
            .offline_slow_hashing_1e4_per_second
        : undefined;
}

function widBlockUI() {
    widCreateTab().disable(true);
    widSetDataTab().disable(true);
    widSetDataTab().readonly(true);
    widReceiveTab().disable(true);
    widShowKeysTab().disable(true);
    widSearchTab().disable(true);
}

function widToggleUI(tok, pwd) {
    var status = tok.status;

    widBlockUI();
    (pwd && !gNonValid)
        ? widSearchTab().disable(false)
        : widSearchTab().disable(true);

    switch (tok.status) {
        case -1:
            if (pwd) widCreateTab().disable(false);
            widSetDataTab().val('');

            break;
        case 0:
            if (widSetDataTab().isOn() || widCreateTab().isOn()) {
                widEmptyTab().show();
            }
            if (widReceiveTab().isKeys() && pwd) {
                widReceiveTab().disable(false);
            }

            widSetDataTab().val('');

            break;
        case 1:
            let d = widSetDataTab().val();
            let e = engDataToRecErrorLevel(d, +gCurrentDB.datalim);

            if (widReceiveTab().isKeys()) {
                widReceiveTab().disable(false);
            }

            widSetDataTab().readonly(false);

            if (e === 0 && tok.d !== engGetDataToRec(d)) {
                widSetDataTab().disable(false);
            }

            widShowKeysTab().disable(false);
            widShowKeysTab().release(false);

            break;
        case 2:
            widShowKeysTab().release(true);

            if (widReceiveTab().isKeys()) {
                widReceiveTab().disable(false);
            }

            break;
        case 3:
            widShowKeysTab().release(true);

            if (widReceiveTab().isKeys()) {
                widReceiveTab().disable(false);
            }

            break;
        default:
            if (widReceiveTab().isKeys()) {
                widReceiveTab().disable(false);
            }

            break;
    }
}

function widTurnOnFileButton(data) {
    var $Input = $('#input_file_upload');
    var $Label = $('#label_file_upload');

    $Input.attr('type', 'text');
    $Label.css('background', '#FF0000');
    $Label.hover(
        function () {
            $(this).css('background', '#FF0000')
        },
        function () {
            $(this).css('background', '#FF0000')
        }
    );
}

function widTurnOffFileButton() {
    var $Input = $('#input_file_upload');
    var $Label = $('#label_file_upload');

    $Input.attr('type', 'file');
    $Input.val('');
    $Input.off('click');
    $Label.css('background', '#FCFCFC');
    $Label.hover(
        function () {
            $(this).css('background', '#87CEEB')
        },
        function () {
            $(this).css('background', '#FCFCFC')
        }
    );

    return false;
}

function wrapWaitForTok(tok) {
    if (!widShowKeysTab().isOn() &&
            !widReceiveTab().isOn() &&
            !widSearchTab().isOn()) {
        widEmptyTab().show();
    }

    widShowTokName(tok);
    widShowTokHash(tok.s);
    widShowTokStatus().show();
}

function widTokenTextRO(state) {
    $('#textarea_token_name').prop('disabled', state);
}

function widTokTextOninput($Obj, delay) {
    var dnOrRaw, tok;

    widSetClearTokInfo();
    widBlockUI();

    if (gCurrentDB === null) {
        return;
    }

    $Obj.val($Obj.val().replace(/\t/g, '\u0020'));
    dnOrRaw = $Obj.val();

    if (!engIsValidString(dnOrRaw)) {
        if (!gNonValid) {
            gNonValid = true;
            $Obj.blur();

            return widModalWindow(gMsg.nonASCII, function () {
                widReloadTokInfo();
                $Obj.focus();
            });
        }

        return;
    }

    gNonValid = false;
    delay = +delay || 0;
    tok = engGetTokObj(engGetClearData(dnOrRaw));
    gTokInfo.s = tok.s;
    gTokInfo.raw = tok.raw;

    if (1) textArea().clearExcept($Obj);

    widReloadTokInfo(gTokInfo, delay);
}

function widLoadFiles(files) {
    var $TokName = $('#textarea_token_name');
    var $FileInp = $('#input_file_upload');

    if (1) {
        textArea().clearExcept($TokName);
    }

    if (!Boolean(files[0])) {
        return widShowTokStatus();
    }

    var cb = function (data) {
        var tok;

        if (data.error === null) {
            return;
        }

        if (typeof(data.error) === 'string' || !data.size) {
            widTokenTextRO(false);
            widTurnOffFileButton();

            return widModalWindow(data.error);
        }

        widTurnOnFileButton();
        $FileInp.click(function () {
            var tok = engGetTokObj('');

            widReloadTokInfo(tok);
            return widTurnOffFileButton();
        });

        $TokName.val('File: ' + data.name + '\nSize: ' + data.size);

        tok = (!engIsValidString(data.raw))
            ? engGetTokObj(data.raw)
            : engGetTokObj(engGetClearData(data.raw));

        gNonValid = false;
        widTokenTextRO(true);
        widReloadTokInfo(tok, 0, true);
    }

    var progress = function (data) {
        console.log(data + '%');
    };

    engLoadFiles(files, gCurrentDB.hash, cb, progress);
}

function widReloadButtonOnclick($Obj) {
    var id = $Obj.prop('id');
    var text = $('#textarea_token_name').val();

    if (gTokInfo.s === '' && text === '') {
        return widModalWindow(gHelp(id));
    }

    widReloadTokInfo(gTokInfo, 0, true);
}

function widSetClearTokInfo() {
    gTokInfo = {
        status: 0,
        raw: '',
        s: ''
    };
}

function widReloadTokInfo(tok, delay, noRefresh) {
    delay = +delay || 0;

    clearTimeout(gTimerId);

    widShowTokStatus();
    widShowPwdInfo();
    widShowTokHash();
    widShowTokenDataLength();

    if (gNonValid) {
        return widShowTokHash(null);
    }

    if (gCurrentDB === null) {
        return;
    }

    if (tok && tok.s == '') {
        widShowTokName(tok);
        widTokenTextRO(false);
        widPasswordOninput();

        return;
    }

    widShowTokStatus().show();

    if (!noRefresh) {
        widShowTokName(tok);
        widTokenTextRO(false);
        widTurnOffFileButton();
    }

    widShowTokHash(tok.s);
    widGetLastRecord(tok, delay);
}

function widGetLastRecord(tok, delay) {
    var cb = function (resp, record) {
        if (resp !== HASQD_RESP.OK && resp !== HASQD_RESP.IDX_NODN) {
            widShowTokStatus();

            return widModalWindow(resp);
        }

        if (resp === HASQD_RESP.IDX_NODN) {
            gTokInfo.s = tok.s;
            gTokInfo.status = -1;

            if (!widShowKeysTab().isOn() &&
                    !widReceiveTab().isOn() &&
                    !widSearchTab().isOn())
                widCreateTab().show();
        } else {
            gTokInfo = record;
            gTokInfo.status = 4;
            widSetDataTab().val(engGetDataFromRec(gTokInfo.d));

            if (!widShowKeysTab().isOn() && !widReceiveTab().isOn()
                    && !widSearchTab().isOn()) {
                widSetDataTab().show();
            }
        }

        widShowTokStatus().show(resp);

        gTokInfo.raw =
            (engDataToRecErrorLevel(tok.raw, +gCurrentDB.datalim) === 0)
                ? tok.raw
                : '';

        widPasswordOninput();
    }

    return widRequestLast(cb, tok.s, delay);
}

function widPasswordOninput() {
    var rec;
    gPassword = $('#input_password').val() || '';

    // set current wallet
    if (!gAllWallets[gPassword])
        gAllWallets[gPassword] = {};

    gWallet = gAllWallets[gPassword];
    widSearchProgress.refresh();

    widShowPwdGuessTime(widGetPwdGuessTime(gPassword));

    ///NEW
    if (gTokInfo.status <= 0) {
        return widToggleUI(gTokInfo, gPassword);
    }

    rec = engGetRecord(gTokInfo.n, gTokInfo.s, gPassword,
            null, null, gCurrentDB.magic, gCurrentDB.hash);
    gTokInfo.status = (gPassword)
        ? engGetTokStatus(gTokInfo, rec)
        : gTokInfo.status = 4; // TODO: may be 0
    (gPassword) ? widShowPwdInfo(gTokInfo.status) : widShowPwdInfo();

    widToggleUI(gTokInfo, gPassword);
}

function widPasswordEyeClick($Obj) {
    var $PwdInp = $('#input_password');
    var $Eye = $Obj.find('img');

    if ($PwdInp.attr('type') == 'text') {
        $PwdInp.attr('type', 'password');
        $Eye.attr('src', imgEyeOpen);
        $Eye.attr('title', gTooltip.password_eye);
    } else {
        $PwdInp.attr('type', 'text');
        $Eye.attr('src', imgEyeClosed);
        $Eye.attr('title', gTooltip.password_eye);
    }
}

function widButtonsTable() {
    return {
        toggleOff: function () {
            $('.tab-buttons-table')
                .find('.tab-btn-down')
                .toggleClass('tab-btn-down tab-btn-up');
        }
    }
}

function widEmptyTab() {
    var $Tabs = $('#div_tabs');

    return {
        show: function () {
            $Tabs.tabs('option', 'active', 0);
            widShowTokStatus();
            widShowPwdInfo();
            widShowTokHash();
            widShowTokenDataLength();
        },
        isOn: function () {
            return ($Tabs.tabs('option', 'active') === 0) ? true : false;
        }
    }
}

function widCreateTab() {
    var $Table = $('#table_create_tab');
    var $Button = $Table.find('button');
    var $Tabs = $('#div_tabs');

    return {
        disable: function (comm) {
            (comm)
                ? $Button
                    .addClass('button-disabled')
                    .removeClass('button-enabled')
                : $Button
                    .addClass('button-enabled')
                    .removeClass('button-disabled');
        },
        show: function () {
            $('.tab-btn-down').toggleClass('tab-btn-down tab-btn-up');
            $Tabs.tabs('option', 'active', 1);
        },
        isOn: function () {
            return ($Tabs.tabs('option', 'active') === 1) ? true : false;
        }
    }
}

function widCreateButtonClick() {
    // Creates a new token record
    var $PwdInp = $('#input_password');
    var tok = {};
    var rec0, rec1, addCb0, addCb1, fmd;
    tok.s = gTokInfo.s;
    tok.raw = gTokInfo.raw;

    if (!widIsPassword())
        return widModalWindow(gMsg.enterMasterKey, function () {
                $PwdInp.focus()
            });

    wrapWaitForTok(tok);

    rec0 = engGetRecord(0, tok.s, gPassword, null, null, gCurrentDB.magic,
        gCurrentDB.hash);
    rec1 = engGetRecord(1, tok.s, gPassword, null, null, gCurrentDB.magic,
        gCurrentDB.hash);

    addCb1 = function (resp) {
        if (resp !== HASQD_RESP.OK) {
            widModalWindow(HASQD_RESP[resp]);
        }

        widReloadTokInfo(tok);
    }

    addCb0 = function (resp) {
        if (resp === HASQD_RESP.OK)
            return engNcAdd(addCb1, gCurrentDB.name, rec1, null);

        /// FIX 'FAIL'
        if (resp === 'FAIL') {
            widModalWindow(gMsg.fail);
        }
        else {
            widModalWindow(gMsg.unexpected + HASQD_RESP[resp]);
        }

        widReloadTokInfo(tok);
    }

    fmd = engGetDataToRec(tok.raw);

    engNcZ(addCb0, gCurrentDB.name, rec0, fmd);
}

function widSetDataTab() {
    var $Tabs = $('#div_tabs');
    var $Button = $('#button_set_data');
    var $Textarea = $('#textarea_set_data');

    return {
        readonly: function (comm) {
            $Textarea.prop('readonly', comm);
        },
        disable: function (comm) {
            (comm)
                ? $Button.addClass('button-disabled')
                    .removeClass('button-enabled')
                : $Button.addClass('button-enabled')
                    .removeClass('button-disabled');
        },
        show: function () {
            $('.tab-btn-down').toggleClass('tab-btn-down tab-btn-up');
            $Tabs.tabs('option', 'active', 2);
        },
        val: function (data) {
            if (typeof(data) !== 'undefined' && typeof(data) !== 'null') {
                widShowTokenDataLength(data);

                return $Textarea.val(data);
            } else {
                return $Textarea.val();
            }
        },
        isOn: function () {
            return ($Tabs.tabs('option', 'active') === 2) ? true : false;
        }
    }
}

function widSetDataTextareaOninput($Obj) {
    var data = $Obj.val().replace(/\t/g, '\u0020');

    $Obj.val(data);
    widShowTokenDataLength(data);
    widToggleUI(gTokInfo, gPassword);
}

function widSetDataButtonClick() {
    // Adds a new record with a specified data
    var $PwdInp = $('#input_password');
    var $Data, dt, err, rec, tok;

    if (!widIsPassword())
        return widModalWindow(gMsg.enterMasterKey,
            function () {
                $PwdInp.focus()
        });

    if (gTokInfo.status !== 1) {
        return widModalWindow(gMsg.changeMasterKey,
            function () {
                $PwdInp.focus()
        });
    }

    $Data = $('#textarea_set_data');
    dt = $Data.val();
    err = engDataToRecErrorLevel(dt, +gCurrentDB.datalim);

    if (err !== 0) {
        return widModalWindow(gDataErrorMsg[err],
            function () {
            $Data.focus()
        });
    }

    dt = engGetDataToRec(dt);

    if (dt === gTokInfo.d) {
        return widModalWindow(gMsg.dataNotChanged,
            function () {
            $Data.focus()
        });
    }

    widSetDataTab().disable(true);

    rec = engGetRecord(gTokInfo.n + 1, gTokInfo.s, gPassword, null, null,
            gCurrentDB.magic, gCurrentDB.hash);
    tok = {};
    tok.s = gTokInfo.s;
    tok.raw = gTokInfo.raw;

    wrapWaitForTok(tok);

    var cb = function (resp, jobId) {
        resp !== HASQD_RESP.OK && widModalWindow(HASQD_RESP[resp]);
        widReloadTokInfo(tok);
    }

    engNcAdd(cb, gCurrentDB.name, rec, dt);
}

function widShowTokenDataLength(data) {
    var $DataLength = $('#span_data_length');
    var l;

    $DataLength.empty();

    if (!data) {
        return;
    }

    l = engGetDataToRec(data).length;

    (l) ? $DataLength.html(l) : $DataLength.empty();
}

function widShowKeysTab() {
    var $Table = $('#table_show_keys_tab');
    var $Tabs = $('#div_tabs');
    var $AllButton = $Table.find('button');
    var $OnHoldButton = $('#button_show_on_hold');
    var $ReleaseButton = $('#button_show_release');
    var $Keys = $('#textarea_show_keys');

    return {
        disable: function (comm) {
            comm && textArea($Keys).clear();
            (comm)
                ? $AllButton
                    .addClass('button-disabled')
                    .removeClass('button-enabled')
                : $AllButton
                    .addClass('button-enabled')
                    .removeClass('button-disabled');

            $('.show-keys-btn-down')
                .toggleClass('show-keys-btn-down show-keys-btn-up');
        },
        onhold: function (comm) {
            (comm)
                ? $OnHoldButton
                    .addClass('button-enabled')
                    .removeClass('button-disabled')
                : $OnHoldButton
                    .addClass('button-disabled')
                    .removeClass('button-enabled');
        },
        release: function (comm) {
            (comm)
                ? $ReleaseButton
                    .addClass('button-enabled')
                    .removeClass('button-disabled')
                : $ReleaseButton
                    .addClass('button-disabled')
                    .removeClass('button-enabled');
        },
        show: function () {
            $Tabs.tabs('option', 'active', 3);
            $('.show-keys-btn-down')
                .toggleClass('show-keys-btn-down show-keys-btn-up');
        },
        isOn: function () {
            return ($Tabs.tabs('option', 'active') === 3) ? true : false;
        }

    }
}

function widTabButtonClick($Obj, tabId) {
    var f;

    widPasswordOninput();
    $Obj.toggleClass('tab-btn-down tab-btn-up');
    $('.tab-btn-down')
        .not($Obj)
        .toggleClass('tab-btn-down tab-btn-up');
    textArea($('#textarea_show_keys')).clear();

    switch (+tabId) {
        case 0:
            f = function () {
                return widShowKeysTab().show()
            };
            break;
        case 1:
            f = function () {
                return widReceiveTab().show()
            };
            break;
        default:
            f = function () {
                return widSearchTab().show()
            };
            break;
    }

    switch (gTokInfo.status) {
        case -1:
            return ($Obj.hasClass('tab-btn-down'))
                ? f()
                : widCreateTab().show();
        case 0:
            return ($Obj.hasClass('tab-btn-down'))
                ? f()
                : widEmptyTab().show();
        default:
            return ($Obj.hasClass('tab-btn-down'))
                ? f()
                : widSetDataTab().show();
    }
}

function widShowInstantButtonClick($Obj) {
    var $PwdInp = $('#input_password');
    var $TokName = $('#textarea_token_name');
    var $Keys = $('#textarea_show_keys');
    var cl = 'show-keys-btn-down show-keys-btn-up';

    textArea($Keys).clear();
    $('.show-keys-btn-down')
        .not($Obj)
        .toggleClass(cl);

    if ($Obj.hasClass('button-disabled')) {
        switch (true) {
            case ($Obj.hasClass('show-keys-btn-down')):
                console('#######');
                return $Obj.toggleClass(cl);
            case (gTokInfo.status === -1):
                return widModalWindow(gMsg.createToken);
            case (gTokInfo.status === 0):
                return widModalWindow(gMsg.enterTokenName, function () {
                    $TokName.focus()
                });
            case ([2,3].includes(gTokInfo.status)):
                $('.show-keys-btn-down').toggleClass(cl);
                return widModalWindow(gMsg.tokenIsHeld);
            case (gTokInfo.status === 4):
                return widModalWindow(gMsg.changeMasterKey, function () {
                        $PwdInp.focus()
                });
            //case (!widIsPassword()):
            case (!widIsPassword()):
                return widModalWindow(gMsg.enterMasterKey, function () {
                    $PwdInp.focus()
                });
            default:
                return widModalWindow(gMsg.unknownError);
        }
    }

    $Obj.toggleClass(cl);

    if ($Obj.hasClass('show-keys-btn-down')) {
        let k1 = engGetKey(gTokInfo.n + 1, gTokInfo.s, gPassword, gCurrentDB.magic,
            gCurrentDB.hash);
        let k2 = engGetKey(gTokInfo.n + 2, gTokInfo.s, gPassword, gCurrentDB.magic,
            gCurrentDB.hash);
        let kk = [gTokInfo.s, k1, k2]
        let pl = [engGetHash(kk.join(''), 's22').substring(0, 4),
            gCurrentDB.altname, '23132'].join(' ')

        textArea($Keys).add(kk.join(' ') + ' ' + pl);
        widSelectAndCopy($Keys);
    }
}

function widShowOnHoldButtonClick($Obj) {
    var $PwdInp = $('#input_password');
    var $TokName = $('#textarea_token_name');
    var $Keys = $('#textarea_show_keys');
    var cl = 'show-keys-btn-down show-keys-btn-up';

    textArea($Keys).clear();
    $('.show-keys-btn-down')
        .not($Obj)
        .toggleClass(cl);

    if ($Obj.hasClass('button-disabled')) {
        switch (true) {
            case ($Obj.hasClass('show-keys-btn-down')):
                console('#######');
                return $Obj.toggleClass(cl);
            case (gTokInfo.status === -1):
                return widModalWindow(gMsg.createToken);
            case (gTokInfo.status === 0):
                return widModalWindow(gMsg.enterTokenName, function () {
                    $TokName.focus()
                });
            case ([2,3].includes(gTokInfo.status)):
                $('.show-keys-btn-down').toggleClass(cl);
                return widModalWindow(gMsg.tokenIsHeld);
            case (gTokInfo.status === 4):
                return widModalWindow(gMsg.changeMasterKey, function () {
                    $PwdInp.focus()
                });
            case (!widIsPassword()):
                return widModalWindow(gMsg.enterMasterKey, function () {
                    $PwdInp.focus()
                });
            default:
                return widModalWindow(gMsg.unknownError);
        }
    }

    $Obj.toggleClass(cl);

    if ($Obj.hasClass('show-keys-btn-down')) {
        if (gTokInfo.status === 1) {
            let k1 = engGetKey(gTokInfo.n + 1, gTokInfo.s, gPassword,
                gCurrentDB.magic, gCurrentDB.hash);
            let k2 = engGetKey(gTokInfo.n + 2, gTokInfo.s, gPassword,
                gCurrentDB.magic, gCurrentDB.hash);
            let g1 = engGetKey(gTokInfo.n + 2, gTokInfo.s, k2,
                gCurrentDB.magic, gCurrentDB.hash);
            let kk = [gTokInfo.s, k1, g1]
            let pl = [engGetHash(kk.join(''), 's22').substring(0, 4),
                gCurrentDB.altname, '23141'].join(' ')

            textArea($Keys).add(kk.join(' ') + ' ' + pl);
            widSelectAndCopy($Keys);
        }
    }
}

function widShowReleaseButtonClick($Obj) {
    var $PwdInp = $('#input_password');
    var $TokName = $('#textarea_token_name');
    var $Keys = $('#textarea_show_keys');
    var cl = 'show-keys-btn-down show-keys-btn-up';

    textArea($Keys).clear();
    $('.show-keys-btn-down')
        .not($Obj)
        .toggleClass(cl);

    if ($Obj.hasClass('button-disabled')) {
        switch (true) {
            case ($Obj.hasClass('show-keys-btn-down')):
                console('#######');
                return $Obj.toggleClass(cl);
            case (gTokInfo.status === -1):
                return widModalWindow(gMsg.createToken);
            case (gTokInfo.status === 0):
                return widModalWindow(gMsg.enterTokenName, function () {
                    $TokName.focus()
                });
            case (gTokInfo.status === 1):
                return widModalWindow(gMsg.tokenIsAvailable, function () {
                    $TokName.focus()
                });
            case (gTokInfo.status === 4):
                return widModalWindow(gMsg.changeMasterKey, function () {
                    $PwdInp.focus()
                });
            case (!widIsPassword()):
                return widModalWindow(gMsg.enterMasterKey, function () {
                    $PwdInp.focus()
                });
            default:
                return widModalWindow(gMsg.unknownError);
        }
    }

    $Obj.toggleClass(cl);

    if ($Obj.hasClass('show-keys-btn-down')) {
        let k, code, kk, pl;

        switch (true) {
            case (gTokInfo.status === 2):
                k = engGetKey(gTokInfo.n + 1, gTokInfo.s, gPassword,
                        gCurrentDB.magic, gCurrentDB.hash);
                code = '231';

                break;
            case (gTokInfo.status === 3):
                k = engGetKey(gTokInfo.n + 2, gTokInfo.s, gPassword,
                    gCurrentDB.magic, gCurrentDB.hash);
                code = '232';

                break;
            default:
                return widModalWindow(gMsg.unknownError);
        }

        kk = [gTokInfo.s, k];
        pl = [engGetHash(kk.join(''), 's22').substring(0, 4),
            gCurrentDB.altname, code].join(' ');

        textArea($Keys).add(kk.join(' ') + ' ' + pl);
        widSelectAndCopy($Keys);
    }
}

function widReceiveTab() {
    var $Tabs = $('#div_tabs');
    var $Table = $('#table_receive_tab');
    var $Keys = $('#textarea_receive_keys');
    var $Button = $('#button_receive');

    return {
        disable: function (comm) {
            (comm)
                ? $Button.addClass('button-disabled')
                    .removeClass('button-enabled')
                : $Button.addClass('button-enabled')
                    .removeClass('button-disabled');
        },
        show: function () {
            $Tabs.tabs('option', 'active', 4);
            $Keys.val('');
        },
        isKeys: function () {
            return engIsAsgmtKeys($Keys.val());
        },
        isOn: function () {
            return ($Tabs.tabs('option', 'active') === 4) ? true : false;
        }

    }
}

function widReceiveTextareaOninput($Obj) {
    var keys = $Obj.val();

    if (engIsAsgmtKeys(keys)) {
        var dn = engGetParsedAsgmtKeys(keys)[0].s;

        if (!Boolean(gTokInfo.raw) || dn !== engGetHash(gTokInfo.raw, gCurrentDB.hash)){
            return widSearchRawTok(dn);
        } else {
            var tok = {};
            tok.s = dn;
            tok.raw = gTokInfo.raw || '';
            widReloadTokInfo(tok, 0);
        }
    }

    widToggleUI(gTokInfo, gPassword);
}

function widSearchRawTok(dn) {
    var $TokName = $('#textarea_token_name');
    var tok = engGetTokObj(dn);

    wrapWaitForTok(tok);

    var cb = function (resp, rec) {

        if (resp !== HASQD_RESP.OK && resp !== HASQD_RESP.NO_RECS)
            widModalWindow(HASQD_RESP[resp]);

        var asgmtKeysTok = {};
        asgmtKeysTok.s = (rec === null) ? tok.s : rec.s;
        var sOrD = (rec === null) ? tok.s : rec.d;
        asgmtKeysTok.raw = engGetTokNameFromZ(AsgmtKeysTok.s, sOrD, gCurrentDB.hash);

        return widReloadTokInfo(AsgmtKeysTok, 0, false);
    }

    engNcRecordZero(cb, tok.s);
}

function widReceiveButtonClick() {
    var $TokName = $('#textarea_token_name');
    var $Keys = $('#textarea_receive_keys');
    var $PwdInp = $('#input_password');
    var keys, asgmtKeys, tokName;

    if ([0, -1].includes(gTokInfo.status)) {
        return widModalWindow(gMsg.noDn, function () { $TokName.focus() });
    }

    if (!widIsPassword()) {
        return widModalWindow(gMsg.enterMasterKey,
            function () {
                $PwdInp.focus()
        });
    }
    
    keys = $Keys.val();
    
    if (!engIsAsgmtKeys(keys)) {
        return widModalWindow(gMsg.badAsgmtKeys, function () {
            $Keys.focus()
        });
    }
    
    asgmtKeys = engGetParsedAsgmtKeys(keys);
    tokName = $TokName.val();
    asgmtKeys[0].raw = (Boolean(gTokInfo.raw) && asgmtKeys[0].s ===
            engGetHash(gTokInfo.raw, gCurrentDB.hash))
        ? gTokInfo.raw
        : (asgmtKeys[0].s === engGetHash(tokName, gCurrentDB.hash))
            ? tokName
            : '';

    wrapWaitForTok(asgmtKeys[0]);
    widReceiveTab().disable(true);
    widReceiveKey(asgmtKeys);
}

function widReceiveKey(keys) {
    var cb = function (resp, record) {
        if (resp !== HASQD_RESP.OK){
            return widModalWindow(HASQD_RESP[resp]);
        }
        if (record === null) {
            return widModalWindow(gMsg.recordParseError);
        }

        widTokensTakeover(engGetNumberedAsgmtKeys(keys, [record]));
    }

    widRequestLast(cb, keys[0].s, 0);
}

function widTokensTakeover(keys) {
    keys = engGetTitleRecord(keys, gPassword, gCurrentDB.hash,
            gCurrentDB.magic);

    switch (keys[0].prcode) {
            //FIX make const for code
        case '23132':
            widInstantReceive(keys[0]);
            break; //INSTANT_CODE
        case '123132':
            widInstantReceive(keys[0]);
            break; //INSTANT_CODE_N
        case '23141':
            widBlockingReceive(keys[0]);
            break; //ONHOLD_CODE
        case '123141':
            widBlockingReceive(keys[0]);
            break; //ONHOLD_CODE_N
        case '231':
            widBlockingReceive(keys[0]);
            break; //RELEASE_S_CODE
        case '1231':
            widBlockingReceive(keys[0]);
            break; //RELEASE_S_CODE_N
        case '232':
            widInstantReceive(keys[0]);
            break; //RELEASE_R_CODE
        case '1232':
            widInstantReceive(keys[0]);
            break; //RELEASE_R_CODE_N
        default:
            widModalWindow(gMsg.badAsgmtKeys);
    }
}

function widInstantReceive(keys) {
    var addCb1 = function (resp) {
        if (resp !== HASQD_RESP.OK)
            widModalWindow(HASQD_RESP[resp]);

        $('#textarea_receive_keys').val('');

        widReloadTokInfo(keys);
    }

    var addCb0 = function (resp, keys) {
        if (resp === HASQD_RESP.OK)
            return engNcAdd(addCb1, gCurrentDB.name, keys, null);

        widModalWindow(HASQD_RESP[resp]);
        widReloadTokInfo(keys);
    }

    engNcAdd(addCb0, gCurrentDB.name, keys, null);
}

function widBlockingReceive(keys) {
    var cb = function (resp) {
        if (resp !== HASQD_RESP.OK)
            widModalWindow(HASQD_RESP[resp]);

        $('#textarea_receive_keys').val('');

        widReloadTokInfo(keys);
    }

    engNcAdd(cb, gCurrentDB.name, keys, null);
}

function widSearchTab() {
    var $Table = $('#table_search_tab');
    var $Button = $('#button_search');
    var $Tabs = $('#div_tabs');
    var retObj = {
        disable: function (comm) {
            (comm)
                ? $Button.addClass('button-disabled')
                    .removeClass('button-enabled')
                : $Button.addClass('button-enabled')
                    .removeClass('button-disabled');
        },
        show: function () {
            $Tabs.tabs('option', 'active', 5);
            widSetDivOverflowSize();
        },
        isOn: function () {
            return ($Tabs.tabs('option', 'active') === 5) ? true : false;
        }
    }

    return retObj;
}

function widWelcomeTab() {
    var $Tabs = $('#div_tabs');
    return {
        show: function () {
            $Tabs.tabs('option', 'active', 6);
            widShowTokStatus();
            widShowPwdInfo();
            widShowTokHash();
            widShowTokenDataLength();
        },
        isOn: function () {
            return ($Tabs.tabs('option', 'active') === 0) ? true : false;
        }
    }
}

function widSearchButtonClick() {
    var $PwdInp = $('#input_password');
    var $From = $('#input_from_datepicker');
    var $To = $('#input_to_datepicker');

    var fromDate = new Date($From.datepicker('getDate'));
    var toDate = new Date($To.datepicker('getDate'));

    if (!widIsPassword())
        return widModalWindow(gMsg.enterMasterKey,
            function () {
            $PwdInp.focus()
        });

    if (fromDate > toDate)
        return widModalWindow(gMsg.enterDate);

    engSearchClick(fromDate, toDate, widSearchProgress);
}

function widSearchResultsTabsClick($Obj, tabId) {
    var $Tabs = $('#div_search_result_tabs');
    var $AllButtons = $('#td_search_tabs_buttons button');

    if ($Obj.hasClass('search-tabs-buttons-active'))
        widHideOnclick();

    $Tabs.tabs('option', 'active', tabId);
    $AllButtons.addClass('search-tabs-buttons')
    .removeClass('search-tabs-buttons-active');
    $Obj.addClass('search-tabs-buttons-active')
    .removeClass('search-tabs-buttons');

}

function widSetDivOverflowSize() {
    var $Results = $('#td_search_results');
    var $Div = $('.div-overflow');
    var pdnLeft = +$Results.css('padding-left').replace(/[px]/g, '');
    var pdnRight = +$Results.css('padding-right').replace(/[px]/g, '');
    var tdWidth = $Results.innerWidth() - pdnLeft - pdnRight;
    var divWidth = $Div.innerWidth();
    $Div.css('max-width', tdWidth + 'px');
}

function widHideOnclick() {
    $Obj = $('.td-visible, .td-hidden');
    $Obj.toggleClass('td-visible td-hidden');
    var $Inits = $('#td_search_inits');
    var $Results = $('#td_search_results');
    $Div = $('.div-overflow');
    var tdWidth = $Results.innerWidth();
    var initsWidth = $Inits.innerWidth();
    var pdnLeft = +$Inits.css('padding-left').replace(/[px]/g, '');
    var pdnRight = +$Inits.css('padding-right').replace(/[px]/g, '');

    if ($Obj.hasClass('td-visible')) {
        $Inits.css('display', 'inline-block');
        var decW = tdWidth - initsWidth - pdnLeft - pdnRight;
        $Div.innerWidth(decW);
        $Obj.html('>');
    } else {
        $Inits.css('display', 'none');
        var incW = tdWidth + initsWidth;
        $Div.innerWidth('100%');
        $Obj.html('<');
    }

    widSetDivOverflowSize();

    return false;
}

//  1   Set button according to g_searchOn
//  2   Show current file
//  3   Update results
var widSearchProgress = {};

widSearchProgress.button = function (on) {
    if (on)
        $('#button_search').html(imgBtnStop);
    else
        $('#button_search').html(imgBtnStart);

    return;
}

widSearchProgress.block = function (txt, lnk) {
    var n = lnk.match(/\d+(?=\.)/g);
    var x = 'Block <a href="/file ' + lnk + '" target="_blank">' +
        txt.substr(2) + '-' + n + '</a>';
    $('#span_current_slice').html(x);
    return;
}

widSearchProgress.refresh = function () {
    widWalletRefresh();
}

function widWalletRefresh() {
    var str = widSearchUpdate();

    // update widgit only if required
    function update(o, newstr) {
        var oldstr = o.html();

        if (newstr.length != oldstr.length || newstr != oldstr)
            o.html(newstr);
    }

    update($('#div_mine_search_results'), str.text[1]);
    update($('#div_onhold_search_results'), str.text[2]);
    update($('#div_expected_search_results'), str.text[3]);

    update($('#span_search_mine'), '(' +
        engGetNumberLevel(str.number[1]) + ')');

    var $Onhold = $('#span_search_onhold');

    if (str.number[2] > 0)
        update($Onhold, '(' + str.number[2] + ')');
    else
        update($Onhold, '');

    var $Expected = $('#span_search_expected');

    if (str.number[3] > 0)
        update($Expected, '(' + str.number[3] + ')');
    else
        update($Expected, '');

    return;
}

function widSearchUpdate() {
    var w = gWallet;

    var t = ["", "", "", "", ""];
    var n = [0, 0, 0, 0, 0];

    for (var i in w) {
        var x = w[i];
        var xs = x.s;
        if (x.raw != "")
            xs = engGetDataToRec(x.raw);

        xs = '<button class="search-dn" onclick="widDnSelect(\''
             + window.btoa(xs) + '\')">' + xs + '</button>';

        var xn = '' + x.n + ' ';
        ///for ( var i = 0; i < 2 - xn.length; i++ ) xn += ' ';

        if (x.status > 0 && x.status < 4)
            t[x.status] += xs + ' <span class="span-search-dn">' + xn +
            '</span>' + '\n';
        n[x.status]++;
    }

    return {
        text: t,
        number: n
    };
}

function widDnSelect(b64) {
    var fmd = window.atob(b64);
    var raw = engGetDataFromRec(fmd);
    widReloadTokInfo(engGetTokObj(raw));
}

function widRequestLast(extCb, tok, delay) {
    var possible_raw = $('#textarea_token_name').val();

    var cb = function (resp, record) {
        if (resp === HASQD_RESP.OK) {
            updateGWalletOnLast(record, possible_raw);
            widWalletRefresh();
        }

        extCb(resp, record);
    }

    return engNcDeferredLast(cb, tok, delay);
}
