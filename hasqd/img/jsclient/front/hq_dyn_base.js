// Hasq Technology Pty Ltd (C) 2013-2015

function widShowBordersColor($obj, color) {
    var borders = ['borderLeftColor', 'borderTopColor', 'borderRightColor', 'borderBottomColor'];

    for (var i = 0; i < borders.length; i++) {
        if (color !== undefined)
            $obj.css(borders[i], color);
        else
            $obj.css(borders[i], '');
    }
}

function widShowLastRecord(lastRec) {
    var $N = $('#lr_n_input');
    var $K = $('#lr_k_input');
    var $G = $('#lr_g_input');
    var $O = $('#lr_o_input');
    var $D = $('#lr_d_input');

    if (arguments.length == 0) {
        $N.val('');
        $K.val('');
        $G.val('');
        $O.val('');
        $D.val('');
    } else {
        $N.val(lastRec.n);
        $K.val(lastRec.k);
        $G.val(lastRec.g);
        $O.val(lastRec.o);
        $D.val(lastRec.d);
    }
}

function widShowNewRecord(newRec) {
    var $N = $('#nr_n_input');
    var $K = $('#nr_k_input');
    var $G = $('#nr_g_input');
    var $O = $('#nr_o_input');
    var $D = $('#nr_d_input');

    if (arguments.length === 0) {
        $N.val('');
        $K.val('');
        $G.val('');
        $O.val('');
        $D.val('');
        widShowBordersColor($K);
        widShowBordersColor($G);
        widShowBordersColor($O);
    } else {
        $N.val(newRec.n);
        $K.val(newRec.k);
        $G.val(newRec.g);
        $O.val(newRec.o);
        $D.val('');
    }
}

function widCleanHistoryData() {
    var $obj = $('#select_records_history');
    $obj.get(0).selectedIndex = 0;
    $obj.selectmenu('refresh');
}

function widRefreshButtonClick() {
    var cb1 = function (resp, id) {
        var $Id = $('#server_id');

        if (resp === HASQD_RESP.OK && id)
            $Id.html('<pre>' + id + '</pre>');
        else
            return;
    }

    var cb2 = function (resp, sys) {
        var $Sys = $('#server_sys');

        if (resp === HASQD_RESP.OK && sys)
            $Sys.html('<pre>' + sys + '</pre>');
        else
            return;
    }

    var cb3 = function (resp, fam) {
        var $Fam = $('#server_fam');

        if (resp === HASQD_RESP.OK && fam && fam.length > 0) {
            var table = widGetHTMLFamilyTable(fam);
            $Fam.html('<pre>' + table + '</pre>');
        } else
            return;
    }

    var cb4 = function (resp, db) {
        gDataBase = db;
        if (resp === HASQD_RESP.OK && gDataBase.length !== 0) {
            var $Db = $('#database_select');

            for (var i = 0; i < gDataBase.length; i++) {
                if (i == 0) {
                    $Db.html(new Option(gDataBase[i].name + '(' + gDataBase[i].hash + ')', gDataBase[i].name, true, true)).selectmenu('refresh');
                    var db_table = widGetHTMLDatabaseTraitTable(gDataBase[i]);
                    $('#div_database_table').html(db_table);

                    var current_db = gDataBase[0].name + '(' + gDataBase[0].hash + ')';
                    $('#current_db').html(current_db);

                    gCurrentDB = gDataBase[0];
                    gHashCalcHash = gCurrentDB.hash;
                    //widShowNewRecOninput();
                } else
                    $Db.append(new Option(gDataBase[i].name + '(' + gDataBase[i].hash + ')', gDataBase[i].name)).selectmenu('refresh');
            }
        } else
            return;
    }

    engNcInfoId(cb1);
    engNcInfoSys(cb2);
    engNcInfoFam(cb3);
    engNcInfoDb(cb4);
}

function widAddSkc() {
    var $Img = $('#span_skc img');

    gSkc = prompt('Enter SKC key:', gSkc || '') || null;

    if (gSkc && !engIsValidString(gSkc))
        gSkc = null;

    if (gSkc) {
        $Img.attr('src', imgSkcOn);
        $('#td_label_records_encrypt').show();
        $('#td_input_records_encrypt').show();
        $('#td_tokens_encrypt').show();
    } else {
        $Img.attr('src', imgSkcOff);
        $('#td_label_records_encrypt').hide();
        $('#td_input_records_encrypt').hide();
        $('#td_tokens_encrypt').hide();
        $('#input_records_encrypt').prop('checked', false);
        $('#input_tokens_encrypt').prop('checked', false);
    }
    return;
}

function widCommandSendButtonClick() {
    var $CmdInput = $('#input_cmd');
    var $CmdOutput = $('#textarea_cmd');

    var cmd = $CmdInput.val();
    if (!cmd)
        return;
    if (!engIsValidString(cmd))
        return $CmdOutput.val('');

    if (gSkc)
        cmd = '#' + engGetCipher(cmd);

    var cb = function (data) {
        $CmdOutput.val(data);
    }

    engNcRawCommand(cmd, cb);
}

function widTokenNameOninput() {
    var $Dn = $('#input_dn');
    var $RawDn = $('#input_rdn');
    var $SubmitButton = $('#button_submit');
    var $HistorySelect = $('#select_records_history');

    widShowLastRecord();
    widShowNewRecord();
    widCleanHistoryData();

    $Dn.val('');
    if ($RawDn.val().length == 0) {
        $HistorySelect.selectmenu('disable');
        widShowBordersColor($Dn);
        widShowBordersColor($SubmitButton);
        widShowRecordsTabLog();
    } else {
        $HistorySelect.selectmenu('enable');
        widShowBordersColor($Dn);
        widShowBordersColor($SubmitButton);
        $Dn.val(engGetHash($RawDn.val(), gCurrentDB.hash));
        widShowNewRecOninput();
        widShowRecordsTabLog('OK');
    }
}

function widTokenHashOninput() {
    var $Dn = $('#input_dn');
    var $RawDn = $('#input_rdn');
    var $SubmitButton = $('#button_submit');
    var $HistorySelect = $('#select_records_history');
    var tok = $Dn.val();

    widShowLastRecord();
    widShowNewRecord();
    widCleanHistoryData();

    $Dn.val(engGetOnlyHex($Dn.val()));
    $RawDn.val('');

    if (tok.length === 0) {
        $HistorySelect.selectmenu('disable');
        widShowBordersColor($Dn);
        widShowBordersColor($SubmitButton);
        widShowRecordsTabLog();
        return;
    }

    if (engIsHash($Dn.val(), gCurrentDB.hash)) {
        $HistorySelect.selectmenu('enable');
        widShowBordersColor($Dn);
        widShowBordersColor($SubmitButton);
        widShowRecordsTabLog('OK');
    } else {
        widShowBordersColor($Dn, 'red');
        widShowBordersColor($SubmitButton, 'red');
        widShowRecordsTabLog('Dn is not a hash.');
    }
}

function widShowRecordsTabLog(d) {
    var $obj = $('#' + 'div_records_log');
    if (arguments.length == 0)
        $obj.html('&nbsp');
    else
        $obj.html(d);
}

function widShowKeysPropriety($Obj) {
    var $SubmitButton = $('#button_submit');

    $Obj.val(engGetOnlyHex($Obj.val()));

    if (engIsHash($Obj.val(), gCurrentDB.hash) || $Obj.val() == '') {
        widShowBordersColor($Obj);
        widShowBordersColor($SubmitButton);
        widShowRecordsTabLog();
    } else {
        widShowBordersColor($Obj, 'red');
        widShowBordersColor($SubmitButton, 'red');
        widShowRecordsTabLog('BAD_HASH');
    }

    widShowNewRecCompability();
}

function widGetLastRecordButtonClick() {
    var $Dn = $('#input_dn');
    var s = $Dn.val();

    var cb = function (resp, rec) {
        if (resp === HASQD_RESP.OK && rec)
            widShowLastRecord(rec);
        else
            return widShowRecordsTabLog(resp);

        widShowNewRecordAuto();
    }

    widShowLastRecord();
    engNcLast(s, gCurrentDB.name, cb)
}

function widShowNewRecordAuto() {
    var $LastRecN = $('#lr_n_input');
    var $Dn = $('#input_dn');
    var $NewRecPwd0 = $('#nr_pwd0_input');
    var $NewRecPwd1 = $('#nr_pwd1_input');
    var $NewRecPwd2 = $('#nr_pwd2_input');
    var $OnePwd = $('#one_pwd_checkbox');
    var $ThreePwd = $('#three_pwd_checkbox');

    var lr_n = $LastRecN.val();
    var s = $Dn.val();
    var p0 = $NewRecPwd0.val();

    if ($OnePwd.prop('checked')) {
        var p1 = null;
        var p2 = null;
    } else if ($ThreePwd.prop('checked')) {
        var p1 = $NewRecPwd1.val();
        var p2 = $NewRecPwd2.val();
    }

    widShowNewRecord();

    if (lr_n != '') {
        var nr_n = +lr_n + 1;
        widShowNewRecord(engGetRecord(nr_n, s, p0, p1, p2, gCurrentDB.magic, gCurrentDB.hash));
    }

    widShowNewRecCompability();
}

function widShowNewRecOninput() {
    var $NewRecN = $('#nr_n_input');
    var $NewRecK = $('#nr_k_input');
    var $NewRecG = $('#nr_g_input');
    var $NewRecO = $('#nr_o_input');
    var $OnePwd = $('#one_pwd_checkbox');
    var $ThreePwd = $('#three_pwd_checkbox');
    var $NewRecPwd0 = $('#nr_pwd0_input');
    var $NewRecPwd1 = $('#nr_pwd1_input');
    var $NewRecPwd2 = $('#nr_pwd2_input');

    if ($NewRecN.val() == '' && $NewRecK.val() == '' && $NewRecG.val() == '' && $NewRecO.val() == '')
        return;

    $NewRecN.val(engGetOnlyNumber($NewRecN.val()));

    var s = $('#input_dn').val();
    var nr_n = +$NewRecN.val();
    var p0 = $NewRecPwd0.val();

    if ($OnePwd.is(':checked')) {
        var p1 = null;
        var p2 = null;
    } else if ($ThreePwd.is(':checked')) {
        var p1 = $NewRecPwd1.val();
        var p2 = $NewRecPwd2.val();
    }

    var pwdCheckboxIsOn = $OnePwd.is(':checked') + $ThreePwd.is(':checked');

    if ((s != '') && pwdCheckboxIsOn == 1) {
        widShowNewRecord(engGetRecord(nr_n, s, p0, p1, p2, gCurrentDB.magic, gCurrentDB.hash));
        widShowRecordsTabLog();
    }

    widShowNewRecCompability();
}

function widRecordsOnePwdCheckboxClick($Obj) {
    var state = $Obj.is(':checked');

    if (state) {
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

function widRecordsThreePwdCheckboxClick($Obj) {
    var $NewRecPwd0 = $('#nr_pwd0_input');
    var $NewRecPwd1 = $('#nr_pwd1_input');
    var $NewRecPwd2 = $('#nr_pwd2_input');
    var $NewRecOnePwdCheckbox = $('#one_pwd_checkbox');

    var state = $Obj.is(':checked');

    $NewRecPwd0.prop('disabled', !state);
    $NewRecPwd1.prop('disabled', !state);
    $NewRecPwd2.prop('disabled', !state);

    if (state) {
        $NewRecOnePwdCheckbox.prop('checked', !state);
        widShowNewRecOninput();
    } else
        widShowNewRecCompability();
}

function widShowNewRecCompability() {
    var s = $('#input_dn').val();
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

    var g0 = engGetKey(nr_n, s, nr_k, gCurrentDB.magic, gCurrentDB.hash);
    var o0 = engGetKey(nr_n, s, nr_g, gCurrentDB.magic, gCurrentDB.hash);

    var $SubmitButton = $('#button_submit');

    if (nr_n == '') //new record number is required
    {
        widShowBordersColor($SubmitButton);
        widShowRecordsTabLog();
    } else if (lr_n == '') {
        widShowBordersColor($SubmitButton);
        widShowRecordsTabLog('New records compatible is unknown.');
    } else if ((g0 === lr_g) && (o0 === lr_o)) {
        widShowBordersColor($SubmitButton, 'green');
        widShowRecordsTabLog('New record is compatible.');
    } else {
        widShowBordersColor($SubmitButton, 'red');
        widShowRecordsTabLog('New record is uncompatible.');
    }
}

function widTokensHistorySelect(range) {
    var $HistorySelect = $('#textarea_records_history');
    var tok = $('#input_dn').val();
    var cb = function (resp, out) {
        if (resp === HASQD_RESP.OK && out)
            $HistorySelect.val(out.substr(out.indexOf('\n') + 1));
        else
            widShowRecordsTabLog(resp);
    }

    $HistorySelect.val('');

    if (!range)
        return;

    engNcRange(range, tok, gCurrentDB.name, cb);
}

function widHashcalcOninput() {
    var $In = $('#textarea_hashcalc_in');
    var $Out = $('#textarea_hashcalc_out');

    if ($In.val().length > 0)
        $Out.val(engGetHash($In.val(), gHashCalcHash));
    else
        $Out.val('');
}

function widSubmitButtonClick() {
    var rec = {};
    rec.n = +$('#nr_n_input').val();
    rec.s = $('#input_dn').val();
    rec.k = $('#nr_k_input').val();
    rec.g = $('#nr_g_input').val();
    rec.o = $('#nr_o_input').val();
    rec.d = $('#nr_d_input').val();
    var cmd = (rec.n === 0) ? 'z' : 'add';
    var p0 = $('#nr_pwd0_input').val();
    var p1 = $('#nr_pwd1_input').val();
    var p2 = $('#nr_pwd2_input').val();
    var enc = $('#input_records_encrypt').prop('checked');

    var cb = function (out) {
        widShowRecordsTabLog(engGetResponseHeader(out));
        if (out !== HASQD_RESP.OK)
            return;
        var $HistorySelect = $('#select_records_history');
        var i = $HistorySelect.get(0).selectedIndex;
        var d = +$HistorySelect.get(0).options[i].text;

        widTokensHistorySelect(d);
    }

    cmd = [cmd, '*', gCurrentDB.name, rec.n, rec.s, rec.k, rec.g, rec.o,
        engGetDataToRec(rec.d)].join(' ');

    if (enc)
        cmd = '#' + engGetCipher(cmd);

    engNcRawCommand(cmd, cb, hasqLogo);
}

function widSendCommandInputOnpresskey(d, e) {
    if (e.keyCode == 13)
        widCommandSendButtonClick();
}
