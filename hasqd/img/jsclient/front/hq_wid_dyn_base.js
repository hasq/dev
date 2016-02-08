// Hasq Technology Pty Ltd (C) 2013-2015

function HasqdLed() {
    //this.counter = 0;
}

HasqdLed.prototype.fail = function () {
    $('#hasqd_led').html(picRed);
    widShowRecordsTabLog('Connection failed!');
};

HasqdLed.prototype.inc = function () {
    setTimeout(function () { $('#hasqd_led').html(picGryGrn) }, 500);
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

function widShowBordersColor(obj, color) {
    var borders = ['borderLeftColor', 'borderTopColor', 'borderRightColor', 'borderBottomColor'];
	
    for (var i = 0; i < borders.length; i++) {
        if (color !== undefined) {
            obj.css(borders[i], color);
        } else {
            obj.css(borders[i], '');
        }
    }
}

function widShowLastRecord(lastRec) {
    var objN = $('#lr_n_input');
    var objK = $('#lr_k_input');
    var objG = $('#lr_g_input');
    var objO = $('#lr_o_input');
    var objD = $('#lr_d_input');

    if (arguments.length == 0) {
        objN.val('');
        objK.val('');
        objG.val('');
        objO.val('');
        objD.val('');
    } else {
        objN.val(lastRec.n);
        objK.val(lastRec.k);
        objG.val(lastRec.g);
        objO.val(lastRec.o);
        objD.val(lastRec.d);
    }
}

function widShowNewRecord(newRec) {
    var objN = $('#nr_n_input');
    var objK = $('#nr_k_input');
    var objG = $('#nr_g_input');
    var objO = $('#nr_o_input');
    var objD = $('#nr_d_input');

    if (arguments.length === 0) {
        objN.val('');
        objK.val('');
        objG.val('');
        objO.val('');
        objD.val('');
        widShowBordersColor(objK);
        widShowBordersColor(objG);
        widShowBordersColor(objO);
    } else {
        objN.val(newRec.n);
        objK.val(newRec.k);
        objG.val(newRec.g);
        objO.val(newRec.o);
		objD.val(''); //
    }
}

function widCleanHistoryData() {
    var obj = $('#tokens_history_select');
    obj.get(0).selectedIndex = 0;
    obj.selectmenu('refresh');
}

function widRefreshButtonClick() {
    var cb1 = function (d) {
        var r = engGetParsedResponseInfoId(d);
        var obj1 = $('#server_id');

        if (r.message == 'ERROR') {
            obj1.html('<pre>' + r.message + '\n' + r.content + '</pre>');
        } else {
            obj1.html('<pre>' + r.content + '</pre>');
        }
    }

    ajxSendCommand('info id', cb1, hasqdLed);

    var cb2 = function (d) {
        var r = engGetParsedResponseInfoSys(d);
        var obj2 = $('#server_sys');

        if (r.message == 'ERROR') {
            obj2.html('<pre>' + r.message + '\n' + r.content + '</pre>');
        } else {
            obj2.html('<pre>' + r.content + '</pre>');
        }
    }

    ajxSendCommand('info sys', cb2, hasqdLed);

    var cb3 = function (d) {
        var obj3 = $('#server_fam');
        var r = engGetParsedResponseInfoFam(d);

        if (r.message == 'OK') {
            table = widGetHTMLFamilyTable(r);
            obj3.html('<pre>' + table + '</pre>');
        } else {
            obj3.html('<pre>' + r.message + '\n' + r.content + '</pre>');
        }
    }

    ajxSendCommand('info fam', cb3, hasqdLed);

    var cb4 = function (d) {
        glDataBase = engGetParsedResponseInfoDb(d);
        if (glDataBase.length < 1) {
            return 'No database';
        }

        var obj4 = $('#database_smenu'); //document.getElementById('database_smenu');
        for (var i = 0; i < glDataBase.length; i++) {
            switch (i) {
            case 0:
                obj4.html(new Option(glDataBase[i].name + '(' + glDataBase[i].hash + ')', glDataBase[i].name, true, true)).selectmenu('refresh'); ;
                var db_table = widGetHTMLDatabaseTraitTable(glDataBase[i]);
                $('#database_table').html(db_table);

                var current_db = glDataBase[0].name + '(' + glDataBase[0].hash + ')';
                $('#current_db').html(current_db);

                glCurrentDB = glDataBase[0];
                glHashCalcHash = glCurrentDB.hash; //
                widShowNewRecOninput();
                break;
            default:
                obj4.append(new Option(glDataBase[i].name + '(' + glDataBase[i].hash + ')', glDataBase[i].name)).selectmenu('refresh'); ;
                break;
            }
        }
    }

    ajxSendCommand('info db', cb4, hasqdLed);
}

function widCommandSendButtonClick() {
    var objCmdInput = $('#cmd_input');
    var objCmdOutput = $('#cmd_output');
    var cmd = objCmdInput.val();
    var cb = function (d) {
        objCmdOutput.html(d);
    }

    ajxSendCommand(cmd, cb, hasqdLed);
}

function widRawDNOninput() {
    var objHistorySelect = $('#tokens_history_select');
    var objDn = $('#dn_input');
    var objRawDn = $('#rdn_input');
    var objSubmitButton = $('submit_button');

    widShowLastRecord();
    widShowNewRecord();
    widCleanHistoryData();
	
	objDn.val('');

    if (objRawDn.val() == '') {
        objHistorySelect.selectmenu('disable');
        widShowBordersColor(objDn);
        widShowBordersColor(objSubmitButton);
        widShowRecordsTabLog();
    } else {
		objHistorySelect.selectmenu('enable');
        widShowBordersColor(objDn);
        widShowBordersColor(objSubmitButton);		
        objDn.val(engGetHash(objRawDn.val(), glCurrentDB.hash));
        widShowNewRecOninput();
        widShowRecordsTabLog('OK');
    }
}

function widDNOninput() {
    var objDn = $('#dn_input');
    var objRawDn = $('#rdn_input');
    var objSubmitButton = $('#submit_button');
    var s = objDn.val();

	widShowLastRecord();
    widShowNewRecord();
    widCleanHistoryData();

    objDn.val(engGetOnlyHex(objDn.val()));
    objRawDn.val('');

    if (s.length === 0) {
        widShowBordersColor(objDn);
        widShowBordersColor(objSubmitButton);
        widShowRecordsTabLog();
    } else if (engIsHash(objDn.val(), glCurrentDB.hash)) {
        widShowBordersColor(objDn);
        widShowBordersColor(objSubmitButton);
        widShowRecordsTabLog('OK');
    } else {
        widShowBordersColor(objDn, 'red');
        widShowBordersColor(objSubmitButton, 'red');
        widShowRecordsTabLog('Dn is not a hash.');
    }
}

function widShowRecordsTabLog(d) {
    var obj = $('#' + 'records_log_pre');
    if (arguments.length == 0) {
        obj.html('&nbsp');
    } else {
        obj.html(d);
    }
}

function widShowKeysPropriety(id) {
    var objSubmitButton = $('#submit_button');
    var objId = $('#' + id);

    objId.val(engGetOnlyHex(objId.val()));

    if (engIsHash(objId.val(), glCurrentDB.hash) || objId.val() == '') {
        widShowBordersColor(objId);
        widShowBordersColor(objSubmitButton);
        widShowRecordsTabLog();
    } else {
        widShowBordersColor(objId, 'red');
        widShowBordersColor(objSubmitButton, 'red');
        widShowRecordsTabLog('BAD_HASH');
    }

    widShowNewRecCompability();
}

function widGetLastRecordButtonClick() {
    var objDn = $('#dn_input');
    var s = objDn.val();
    var getlast = 'last' + ' ' + glCurrentDB.name + ' ' + s;
    var cb = function (d) {
        var r = engGetParsedResponseLast(d);

        if (r.message == 'OK') {
            widShowLastRecord(r);
            widShowNewRecordAuto();
        } else {
            widShowLastRecord();
        }
        widShowRecordsTabLog(r.content);
    }

    ajxSendCommand(getlast, cb, hasqdLed);
}

function widShowNewRecordAuto() {
    var objLastRecN = $('#lr_n_input');
    var objDn = $('#dn_input');
    var objNewRecPwd0 = $('#nr_pwd0_input');
    var objNewRecPwd1 = $('#nr_pwd1_input');
    var objNewRecPwd2 = $('#nr_pwd2_input');
    var objOnePwd = $('#one_pwd_checkbox');
    var objThreePwd = $('#three_pwd_checkbox')

        var lr_n = objLastRecN.val();
    var s = objDn.val();
    var p0 = objNewRecPwd0.val();

    if (objOnePwd.prop('checked') === 'enabled') {
        var p1 = null;
        var p2 = null;
    } else if (objThreePwd.prop('checked')) {
        var p1 = objNewRecPwd1.val();
        var p2 = objNewRecPwd2.val();
    }

    widShowNewRecord();

    if (lr_n != '') {
        var nr_n = +lr_n + 1;
        widShowNewRecord(engGetNewRecord(nr_n, s, p0, p1, p2, glCurrentDB.magic, glCurrentDB.hash));
    }

    widShowNewRecCompability();
}

function widShowNewRecOninput() {
    var objNewRecN = $('#nr_n_input');
    var objNewRecK = $('#nr_k_input');
    var objNewRecG = $('#nr_g_input');
    var objNewRecO = $('#nr_o_input');
    var objOnePwd = $('#one_pwd_checkbox');
    var objThreePwd = $('#three_pwd_checkbox');
    var objNewRecPwd0 = $('#nr_pwd0_input');
    var objNewRecPwd1 = $('#nr_pwd1_input');
    var objNewRecPwd2 = $('#nr_pwd2_input');

    var s = $('#dn_input').val();
    var nr_n = +objNewRecN.val();
    var p0 = objNewRecPwd0.val();

    if (objNewRecN.val() == '' && objNewRecK.val() == '' && objNewRecG.val() == '' && objNewRecO.val() == '') {
        return;
    }

    objNewRecN.val(engGetOnlyNumber(objNewRecN.val()));

    if (objOnePwd.prop('checked')) {
        var p1 = null;
        var p2 = null;
    } else if (objThreePwd.prop('checked')) {
        var p1 = objNewRecPwd1.val();
        var p2 = objNewRecPwd2.val();
    }

    var pwdCheckboxIsOn = objOnePwd.prop('checked') + objThreePwd.prop('checked');

    if ((s != '') && pwdCheckboxIsOn == 1) {
        widShowNewRecord(engGetNewRecord(nr_n, s, p0, p1, p2, glCurrentDB.magic, glCurrentDB.hash));
        widShowRecordsTabLog();
    }
    widShowNewRecCompability();
}

function widRecordsOnePwdCheckboxClick(obj) {
    if (obj.checked == true) {
        $('#three_pwd_checkbox').prop('checked', false);
        $('#nr_pwd0_input').prop('disabled', false);
        $('#nr_pwd1_input').prop('disabled', true);
        $('#nr_pwd2_input').prop('disabled', true);
        widShowNewRecOninput();
    } else {
        $('#nr_pwd0_input').prop('disabled', true);
        widShowNewRecCompability();
    }
}

function widRecordsThreePwdCheckboxClick(obj) {
    var objNewRecPwd0 = $('#nr_pwd0_input');
    var objNewRecPwd1 = $('#nr_pwd1_input');
    var objNewRecPwd2 = $('#nr_pwd2_input');
    var objNewRecOnePwdCheckbox = $('#one_pwd_checkbox');

    objNewRecPwd0.prop('disabled', !obj.checked);
    objNewRecPwd1.prop('disabled', !obj.checked);
    objNewRecPwd2.prop('disabled', !obj.checked);

    if (obj.checked) {
        objNewRecOnePwdCheckbox.prop('checked', !obj.checked);
        widShowNewRecOninput();
    } else {
        widShowNewRecCompability();
    }
}

function widShowNewRecCompability() {
    var s = $('#dn_input').val();
    var p0 = $('#nr_pwd0_input').val();
    var p1 = $('#nr_pwd1_input').val();
    var p2 = $('#nr_pwd2_input').val();
    var lr_n = $('#lr_n_input').val();
    var lr_k = $('#lr_k_input').val();
    var lr_g = $('#lr_g_input').val();
    var lr_o = $('#lr_o_input').val();
    var nr_n = $('#nr_n_input').val();
    var nr_k = $('#nr_k_input').val();
    var nr_g = $('#nr_g_input').val();
    var nr_o = $('#nr_o_input').val();

    var g0 = engGetKey(nr_n, s, nr_k, glCurrentDB.magic, glCurrentDB.hash);
    var o0 = engGetKey(nr_n, s, nr_g, glCurrentDB.magic, glCurrentDB.hash);

    var objSubmitButton = $('#submit_button');

    if (nr_n == '') //new record number is required
    {
        widShowBordersColor(objSubmitButton);
        widShowRecordsTabLog();
    } else if (lr_n == '') {
        widShowBordersColor(objSubmitButton);
        widShowRecordsTabLog('New records compatible is unknown.');
    } else if ((g0 === lr_g) && (o0 === lr_o)) {
        widShowBordersColor(objSubmitButton, 'green');
        widShowRecordsTabLog('New record is compatible.');
    } else {
        widShowBordersColor(objSubmitButton, 'red');
        widShowRecordsTabLog('New record is uncompatible.');
    }
}

function widTokensHistorySelect(range) {
    var objHistorySelect = $('#tokens_history_textarea');
    var s = $('#dn_input').val();
    var cb = function (data) {
        var resp = engGetParsedResponse(data);
        var objHistorySelect = $('#tokens_history_textarea');

        if (resp.message !== 'OK') {
            objHistorySelect.val('');
            return;
        }

        var i = resp.content.indexOf('\n');
        var r = resp.content.substr(i + 1);
        objHistorySelect.val(r);
    }

    if (range === 0) {
        objHistorySelect.val('');
        return;
    }

    var cmd = 'range' + ' ' + glCurrentDB.name + ' ' + '-' + range + ' ' + '-1' + ' ' + s;

    ajxSendCommand(cmd, cb, hasqdLed);
}

function widHashcalcOninput() {
    var objIn = $('#hashcalc_in_textarea');
    var objOut = $('#hashcalc_out_textarea');

    if (objIn.val().length > 0) {
        objOut.val(engGetHash(objIn.val(), glHashCalcHash));
    } else {
        objOut.val('');
    }
}

function widSubmitButtonClick() {
    var s = $('#dn_input').val();
    var p0 = $('#nr_pwd0_input').val();
    var p1 = $('#nr_pwd1_input').val();
    var p2 = $('#nr_pwd2_input').val();
    var nr_n = $('#nr_n_input').val();
    var nr_k = $('#nr_k_input').val();
    var nr_g = $('#nr_g_input').val();
    var nr_o = $('#nr_o_input').val();
    var nr_d = $('#nr_d_input').val();
	
    var cb = function (data) {
        var objHistorySelect = $('#tokens_history_select');
        var r = engGetParsedResponse(data)
            widShowRecordsTabLog(r.message);
        var i = objHistorySelect.get(0).selectedIndex;
        var d = +objHistorySelect.get(0).options[i].text;
        widTokensHistorySelect(d);
    }

    var nr = 'add * ' + glCurrentDB.name + ' ' + nr_n + ' ' + s + ' ' + nr_k + ' ' + nr_g + ' ' + nr_o + ' ' + engGetInParsedDataValue(nr_d);

    ajxSendCommand(nr, cb, hasqdLed);
}

function widSendCommandInputOnpresskey(d, e) {
    if (e.keyCode == 13) {
        widCommandSendButtonClick();
    }
}
