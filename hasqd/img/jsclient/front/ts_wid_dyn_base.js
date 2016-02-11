// Hasq Technology Pty Ltd (C) 2013-2016

function HasqdLed() {
    //this.counter = 0;
}

HasqdLed.prototype.fail = function () {
    $('#hasqd_led').html(picRed);
    widShowLog('Server connection failure!');
};

HasqdLed.prototype.inc = function () {
    setTimeout(function () {
        $('#hasqd_led').html(picGryGrn);
    }, 500);
};

HasqdLed.prototype.dec = function () {
    setTimeout(function () {
        $('#hasqd_led').html(picGry);
    }, 500);
};

var hasqdLed = new HasqdLed();

function widAnimateProgbar() {
    $('#hasqd_led').html(picGry);
}

function widShowDBError() {
    // displays error message and blocks all UI;
    var warning = 'Database is not accessible!';
    alert(warning);
    widShowLog(warning);
    widDisableInitialDataUI(true);
    widDisableTabsUI(true);
}

function widSetDefaultDb(dbHash) {
    // Searching for database and save it in variable.
    var cb = function (d) {
        var db = engGetResponseInfoDb(d);

        if (db.length > 0) {
            for (var i = 0; i < db.length; i++) {
                if (db[i].hash === dbHash) {
                    glCurrentDB = db[i];
                    break;
                }
            }
        }

        if (glCurrentDB.name === undefined) {
            widShowDBError();
        }
    }

    ajxSendCommand('info db', cb, hasqdLed);
}

function widStringsGrow(s, l) {
    // workaround for html, not used now
    var r = '';

    for (var i = 0; i < l; i++) {
        r += s;
    }

    return r;
}

function widGetToken(d, h) {
    //It returns hash of raw tokens value

    if (engIsHash(d, h))
        return d;

    return engGetHash(d, h)
}

function widEnDisPasswordInput(d) {
    // It enable/disable passwords field.
    var obj = $('#' + 'password_input');
    if (d.length !== 0) {
        obj.attr('disabled', false);
    } else {
        obj.attr('disabled', true);
    }
}

function widShowLog(d) {
    // Shows messages in log
    var obj = $('#' + 'tokens_log_pre');
    if (arguments.length === 0) {
        obj.html('&nbsp');
    } else {
        obj.html(d);
    }
}

function widShowData(d) {
    // Shows tokens data field if it length greater then zero.
    var obj = $('#' + 'tokens_data_pre');
    if (arguments.length === 0) {
        obj.hide();
        obj.empty();
    } else if (String(d).length > 0) {
        obj.show();
        obj.html(d);
    } else {
        obj.hide();
        obj.empty();
    }
}

function widShowToken() {
    // Shows hashed value of token (if the value is not a default hash)
    var objT = $('#token_hash_td');
    var objH = $('#token_text_input');
    var tok = objH.val();

    if (tok.length == 0) {
        objT.empty();
        return;
    }

    tok = widGetToken(tok, glCurrentDB.hash);

    objT.html(tok);
}

function widSetLastRecChanges(d) {
    glLastRec = engGetResponseLast(d);

    if (glLastRec.message === 'OK') {
        widShowTokenState(true);
        widShowPasswordMatch(glLastRec);
        widShowPasswordGuessTime(widGetPasswordGuessTime(glPassword));
        widShowData(engGetOutputDataValue(glLastRec.d));
    } else if (glLastRec.message === 'IDX_NODN') {
        widShowTokenState(false);
        widShowPasswordMatch();
        widShowData();
    } else {
        widShowTokenState();
        widShowPasswordMatch();
        widShowData(glLastRec.message + ':\n' + glLastRec.content);
    }
}

function widShowTokenState(d) {
    // Shows message or image about tokens existense.
    var obj = $('#token_pic_td');

    if (arguments.length === 0) {
        obj.empty();
        widShowLog();
    } else if (d === undefined) {
        obj.html(picL12);
        widShowLog('Searching for token...');
    } else if (d === true) {
        widShowLog('Token exists.');
        obj.empty();
    } else if (d === false) {
        obj.empty();
        widShowLog('No such token.');
    }
}

function widTokenTextOninput(id) {
    // Events when tokens value changed.
    clearTimeout(glTimerId);
    glLastRec = {};
    widShowLog(); //clear log
    widShowData(); //clear and hide data field
    widShowTokenState(undefined); // show animation

    var obj = $('#token_text_input');
    var tokenText = obj.val();
    glLastRec = {};

    //widEnDisPasswordInput(tokenText);
    widShowToken();
    if (tokenText.length > 0) {
        var s = widGetToken(tokenText, glCurrentDB.hash);
        var cmd = 'last' + ' ' + glCurrentDB.name + ' ' + s;
        engSendDeferredRequest(cmd, 1000, widSetLastRecChanges);
    } else {
        widShowTokenState();
        widShowPasswordMatch();
    }
}

function widTokensPasswordOninput() {
    // Events when passwords value changed.
    glPassword = $('#password_input').val();

    if (glPassword.length == 0) {
        widShowPasswordMatch();
        widShowPasswordGuessTime();
    } else if (glLastRec.message === 'OK') {
        widShowPasswordMatch(glLastRec);
        widShowPasswordGuessTime(widGetPasswordGuessTime(glPassword));
    } else {
        widShowPasswordMatch();
        widShowPasswordGuessTime(widGetPasswordGuessTime(glPassword));
    }
}

function widGetPasswordPicture(d) {
    // Returns an image displaying the password match
    switch (d) {
    case 1:
        return picGrn;
        break;
    case 2:
        return picYlwGrn;
        break;
    case 3:
        return picGrnYlw;
        break;
    default:
        return picRed;
        break;
    }
}

function widShowPasswordMatch(lr) {
    // Shows an image displaying the password match
    var objT = $('#password_pic_td');
    var objI = $('#password_input');

    if (arguments.length !== 0 && objI.val() !== '') {
        var nr = engGetNewRecord(lr.n, lr.s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);
        var p = engGetTokensState(lr, nr);
        var pic = widGetPasswordPicture(p);
        objT.html(pic);
    } else {
        objT.empty();
        //objI.val('');
    }
}

function widGetPasswordGuessTime(pwd) {
    // Returns guess time of specified password
    return 'Guess time: ' + zxcvbn(pwd).crack_times_display.offline_slow_hashing_1e4_per_second;
}

function widShowPasswordGuessTime(d) {
    // Shows password guess time
    var obj = $('#password_zxcvbn_td');

    if (arguments.length > 0 && d != undefined) {
        obj.html(d);
    } else {
        obj.empty();
    }
}

function widDisableInitialDataUI(f) {
    // Disables UI
    var obj = $('#initial_data_table');

    if (arguments.length == 0) {
        var f = true;
    }

    obj.find('input').prop('disabled', f); //closest('table[id^="initial"]').
}

function widDisableTabsUI(f) {
    // To enable/disable specified selectors into the tabs area
    var obj = $('#tabs_div');

    if (arguments.length == 0) {
        var f = true;
    }

    obj.find('button, input, textarea').prop('disabled', f);
}

function widGetInitialDataState() {
    // Returns state of initial data
    var objT = $('#token_text_input');
    var objP = $('#password_input');
    var r = {};
    r.message = false;
    r.content = '';

    if (objT.val() == '') {
        r.message = false;
        r.content = 'Empty token value.';
    } else if (objP.val() == '') {
        r.message = false;
        r.content = 'Empty token password.';
    } else {
        r.message = true;
        r.content = '&nbsp';
    }
    return r;
}

function widButtonClick(obj) {
    // Shared button click function
    var obj = $(obj);
    var f = obj.attr('data-onclick');

    widDisableInitialDataUI();
    widDisableTabsUI();

    eval(f);
}

function widCompleteEvent(t) {
    // Completes actions and enables UI
    widDisableInitialDataUI(false);
    widDisableTabsUI(false);
    widShowLog(t);
}

function widCreateButtonClick() {
    // Creates a new token record
    var objT = $('#token_text_input');
    var objP = $('#password_input');
    var s = engGetHash(objT.val(), glCurrentDB.hash);
    var e = widGetInitialDataState();

    if (glLastRec.message === 'OK') {
        widCompleteEvent('Token already exists.');
        return;
    } else if (!e.message) {
        widCompleteEvent(e.content);
        return;
    } else if (glLastRec.message === undefined) {
        widCompleteEvent('');
        return;
    }

    var nr = engGetNewRecord(0, s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);
    var nr_d = (objT.val().length <= 160) ? '[' + objT.val() + ']' : '';
    var cmd = 'z * ' + glCurrentDB.name + ' 0 ' + s + ' ' + nr.k + ' ' + nr.g + ' ' + nr.o + ' ' + nr_d;

    var cb = function (d) {
        var r = engGetResponse(d);
        if (r.message == 'OK') {
            widCompleteEvent(r.message);
            widTokenTextOninput();
        } else {
            widCompleteEvent(r.message + ':\n' + r.content);
        }
    }

    var f = function () {
        ajxSendCommand(cmd, cb, hasqdLed);
    }

    setTimeout(f, 1000);
    widShowLog('Creating token...');
}

function widSetDataButtonClick() {
    // Adds a new record with a specified data
    var objT = $('#token_text_input');
    var objP = $('#password_input');
    var objP = $('#setdata_textarea');

    var e = widGetInitialDataState();

    if (glLastRec.message !== 'OK') {
        widCompleteEvent('First create a token.');
        return;
    } else if (!e.message) {
        widCompleteEvent(e.content);
        return;
    }

    var s = engGetHash(objT.val(), glCurrentDB.hash);
    var nr = engGetNewRecord(glLastRec.n + 1, s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);
    var nr_d = engGetInputDataValue(objP.val());
    var cmd = 'add * ' + glCurrentDB.name + ' ' + nr.n + ' ' + s + ' ' + nr.k + ' ' + nr.g + ' ' + nr.o + ' ' + nr_d;

    var cb = function (d) {
        var r = engGetResponse(d);
        if (r.message == 'OK') {
            widCompleteEvent(r.message);
            widTokenTextOninput();
        } else {
            widCompleteEvent(r.message + ':\n' + r.content);
        }
    }

    var f = function () {
        ajxSendCommand(cmd, cb, hasqdLed)
    }

    widShowLog('Giving token data...');
    setTimeout(f);
}

function widSearchButtonClick() {
    var objFrom = $('#from_datepicker_input');
    var objTo = $('#to_datepicker_input');

    var fromDate = new Date(objFrom.datepicker('getDate'));
    var toDate = new Date(objTo.datepicker('getDate'));

    // needs to check correctness of specified date range if entered manually
    console.log(fromDate);
    console.log(toDate);
    var folders = engGetDateRangeFolders(fromDate, toDate);

    widCompleteEvent();
}
