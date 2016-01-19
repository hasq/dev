// Hasq Technology Pty Ltd (C) 2013-2015

function ProgressLed() {
    //this.counter = 0;
}

ProgressLed.prototype.fail = function () {
    $('#progress_led').html(picRed);
    widPrintRecordsLastOperation('Connection failed!');
};

ProgressLed.prototype.inc = function () {
    setTimeout(function(){ $('#progress_led').html(picGryGrn); }, 500);
};

ProgressLed.prototype.dec = function () {
    setTimeout(function(){ $('#progress_led').html(picGry); }, 500);
};

var progressLed = new ProgressLed();

function widAnimateProgbar() {
    $('#progress_led').html(picGry);
}

function widPrintBorderColor(id, color) {
    $('#' + id).css('borderLeftColor', color);
    $('#' + id).css('borderTopColor', color);
    $('#' + id).css('borderRightColor', color);
    $('#' + id).css('borderBottomColor', color);
}

function widCleanLastRecordData() {
    $('#lastrec_n_input').val('');
    $('#lastrec_k_input').val('');
    $('#lastrec_g_input').val('');
    $('#lastrec_o_input').val('');
    $('#lastrec_d_input').val('');
}

function widCleanHistoryData() {
	$('#tokens_history_selectmenu').get(0).selectedIndex = 0;
	$('#tokens_history_selectmenu').selectmenu('refresh');
}

function widCleanNewRecordData() {
    $('#newrec_n_input').val('');
    $('#newrec_k_input').val('');
    $('#newrec_g_input').val('');
    $('#newrec_o_input').val('');
    widPrintBorderColor('newrec_k_input', '');
    widPrintBorderColor('newrec_g_input', '');
    widPrintBorderColor('newrec_o_input', '');
}

function widCleanPasswordData() {
    $('#newrec_pass0_input').val('');
    $('#newrec_pass1_input').val('');
    $('#newrec_pass2_input').val('');
}

function widServerRefreshBtnClk() {
    var cb1 = function (data) {
        var r = engGetInfoId(data);
        if (r.message == 'ERROR') {
            $('#server_id').html('<pre>' + r.message + '\n' + r.content + '</pre>');
        } else {
            $('#server_id').html('<pre>' + r.content + '</pre>');
        }
    }
    ajxSendCommand('info id', cb1, progressLed);

    var cb2 = function (data) {
        var r = engGetInfoSys(data);
        if (r.message == 'ERROR') {
            $('#server_sys').html('<pre>' + r.message + '\n' + r.content + '</pre>');
        } else {
            $('#server_sys').html('<pre>' + r.content + '</pre>');
        }
    }
    ajxSendCommand('info sys', cb2, progressLed);

    var cb3 = function (data) {
        var r = engGetInfoFam(data);

        if (r.message == 'OK') {
            table = widServerFamilyTable(r);
            $('#server_fam').html('<pre>' + table + '</pre>');
        } else {
            $('#server_fam').html('<pre>' + r.message + '\n' + r.content + '</pre>');
        }
    }
    ajxSendCommand('info fam', cb3, progressLed);

    var cb4 = function (data) {
        glDataBase = engGetInfoDb(data);
        if (glDataBase.length < 1) {
            return "No database"
        }

        var dbs_smenu = document.getElementById('database_smenu');
        for (var i = 0; i < glDataBase.length; i++) {
            switch (i) {
            case 0:
                dbs_smenu.options[i] = new Option(glDataBase[i].name + '(' + glDataBase[i].hash + ')', glDataBase[i].name, true, true);
                var db_table = widDatabaseTraitTable(glDataBase[i]);
                var current_db = glDataBase[dbs_smenu.selectedIndex].name + '(' + glDataBase[dbs_smenu.selectedIndex].hash + ')';

                glCurrentDB = glDataBase[dbs_smenu.selectedIndex];
                glHashCalcHash = glCurrentDB.hash; //
                $('#database_table').html(db_table);
                $('#current_db').html(current_db);
                widGetNewRecordOninput();
                break;
            default:
                dbs_smenu.options[i] = new Option(glDataBase[i].name + '(' + glDataBase[i].hash + ')', glDataBase[i].name);
                break;
            }
        }
        $('#database_smenu').selectmenu('refresh');
    }
    ajxSendCommand('info db', cb4, progressLed);
}

function widCommandSendBtnClk() {
    var cmd = $('#cmd_input').val();
    var cb = function (data) {
        $('#cmd_output').html(data);
    }
    ajxSendCommand(cmd, cb, progressLed);
}

function widRawDNOninput() {
    widCleanNewRecordData();
	widCleanHistoryData();
    widCleanLastRecordData();

    $('#dn_input').val('');
    widCleanLastRecordData();

    if ($('#rdn_input').val() == '') {
		$('#tokens_history_selectmenu').selectmenu('disable');
        widPrintBorderColor('dn_input', '');
        widPrintBorderColor('submit_button', '');
        widPrintRecordsLastOperation('&nbsp');
    } else {
        widPrintBorderColor('dn_input', '');
		$('#tokens_history_selectmenu').selectmenu('enable');
        widPrintBorderColor('submit_button', '');
        $('#dn_input').val(engGetHash($('#rdn_input').val(), glCurrentDB.hash));
        widGetNewRecordOninput();
        widPrintRecordsLastOperation('OK');
    }
}

function widDNOninput() {
    widCleanNewRecordData();
    widCleanLastRecordData();
	widCleanHistoryData();
	
    $('#dn_input').val(engSetHex($('#dn_input').val()));

    $('#rdn_input').val('');

    if (engIsHash($('#dn_input').val(), glCurrentDB.hash)) {
        widPrintBorderColor('dn_input', '');
        widPrintBorderColor('submit_button', '');
        widPrintRecordsLastOperation('OK');
        widGetNewRecordOninput();
    } else {
        widPrintBorderColor('dn_input', 'red');
        widPrintBorderColor('submit_button', 'red');
        widPrintRecordsLastOperation('BAD_HASH');
    }
}

function widPrintRecordsLastOperation(data) {
    $('#records_last_operation_pre').html(data);
}

function widCheckNewRecordKeys(id) {
    $('#' + id).val(engSetHex($('#' + id).val()));

    if (engIsHash($('#' + id).val(), glCurrentDB.hash) || $('#' + id).val() == '') {
        widPrintBorderColor(id, '');
        widPrintBorderColor('submit_button', '');
        widPrintRecordsLastOperation('&nbsp');
    } else {
        widPrintBorderColor(id, 'red');
        widPrintBorderColor('submit_button', 'red');
        widPrintRecordsLastOperation('BAD_HASH');
    }
    widCheckNewRecord();
}

function widRecordsGetLastRecordBtnClk() {
    var s = $('#dn_input').val();
    var getlast = 'last' + ' ' + glCurrentDB.name + ' ' + s;

    var cb = function (data) {
        var r = engGetLastRecord(data);

        if (r.message == 'OK') {
            $('#lastrec_n_input').val(r.n);
            $('#lastrec_k_input').val(r.k);
            $('#lastrec_g_input').val(r.g);
            $('#lastrec_o_input').val(r.o);
            $('#lastrec_d_input').val(r.d);
            widGetNewRecordAuto();
        } else {
            widCleanLastRecordData();
        }
        widPrintRecordsLastOperation(r.content);
    }

    ajxSendCommand(getlast, cb, progressLed);
}

function widGetNewRecordAuto() {
    var lastrec_n_input = $('#lastrec_n_input').val();
    var newrec_n_input = $('#newrec_n_input').val();
    var s = $('#dn_input').val();
    var p0 = $('#newrec_pass0_input').val();

    if ($('#onepass_checkbox').prop('checked') == 'enabled') {
        var p1 = null;
        var p2 = null;
    } else if ($('#threepass_checkbox').prop('checked')) {
        var p1 = $('#newrec_pass1_input').val();
        var p2 = $('#newrec_pass2_input').val();
    }

    widCleanNewRecordData();

    if (lastrec_n_input != '') {
        var n = +lastrec_n_input + 1;
        widSetNewRecord(engGetNewRecord(n, s, p0, p1, p2, glCurrentDB.magic, glCurrentDB.hash));
    }

    widCheckNewRecord();
}

function widGetNewRecordOninput() {
    if ($('#newrec_n_input').val() == '' && $('#newrec_k_input').val() == '' && $('#newrec_g_input').val() == '' && $('#newrec_o_input').val() == '') {
        return;
    }

    $('#newrec_n_input').val(engSetNumber($('#newrec_n_input').val()));

    var newrec_n_input = $('#newrec_n_input').val();
    var s = $('#dn_input').val();
    var p0 = $('#newrec_pass0_input').val();

    if ($('#onepass_checkbox').prop('checked')) {
        var p1 = null;
        var p2 = null;
    } else if ($('#threepass_checkbox').prop('checked')) {
        var p1 = $('#newrec_pass1_input').val();
        var p2 = $('#newrec_pass2_input').val();
    }

    var pwdCheckBoxIsOn = $('#onepass_checkbox').prop('checked') + $('#threepass_checkbox').prop('checked');

    if ((s != '') && pwdCheckBoxIsOn == 1) {
        var n = +newrec_n_input;
        widSetNewRecord(engGetNewRecord(n, s, p0, p1, p2, glCurrentDB.magic, glCurrentDB.hash));
        widPrintRecordsLastOperation('&nbsp');
    }
    widCheckNewRecord();
}

function widSetNewRecord(data) {
    $('#newrec_n_input').val(data.n);
    $('#newrec_k_input').val(data.k);
    $('#newrec_g_input').val(data.g);
    $('#newrec_o_input').val(data.o);
}

function widRecordsOnePwdChkboxClk(obj) {
    if (obj.checked == true) {
        $('#threepass_checkbox').prop('checked', false);
        $('#newrec_pass0_input').prop('disabled', false);
        $('#newrec_pass1_input').prop('disabled', true);
        $('#newrec_pass2_input').prop('disabled', true);
        widGetNewRecordOninput();
    } else {
        $('#newrec_pass0_input').prop('disabled', true);
        widCheckNewRecord();
    }
}

function widRecordsThreePwdChkboxClk(obj) {
    if (obj.checked == true) {
        $('#onepass_checkbox').prop('checked', false);
        $('#newrec_pass0_input').prop('disabled', false);
        $('#newrec_pass1_input').prop('disabled', false);
        $('#newrec_pass2_input').prop('disabled', false);
        widGetNewRecordOninput();
    } else {
        //document.getElementById('onepass_checkbox').checked = true;
        $('#newrec_pass0_input').prop('disabled', true);
        $('#newrec_pass1_input').prop('disabled', true);
        $('#newrec_pass2_input').prop('disabled', true);
        widCheckNewRecord();
    }
}

function widCheckNewRecord() {
    var s = $('#dn_input').val();
    var p0 = $('#newrec_pass0_input').val();
    var p1 = $('#newrec_pass1_input').val();
    var p2 = $('#newrec_pass2_input').val();
    var lr_n = $('#lastrec_n_input').val();
    var lr_k = $('#lastrec_k_input').val();
    var lr_g = $('#lastrec_g_input').val();
    var lr_o = $('#lastrec_o_input').val();
    var nr_n = $('#newrec_n_input').val();
    var nr_k = $('#newrec_k_input').val();
    var nr_g = $('#newrec_g_input').val();
    var nr_o = $('#newrec_o_input').val();
    var k1 = $('#newrec_k_input').val();
    var g1 = $('#newrec_g_input').val();
    var g0 = engGetKey(nr_n, s, k1, glCurrentDB.magic, glCurrentDB.hash);
    var o0 = engGetKey(nr_n, s, g1, glCurrentDB.magic, glCurrentDB.hash);

    if (nr_n == '') //new record number is required
    {
        widPrintBorderColor('submit_button', '');
        widPrintRecordsLastOperation('&nbsp');
    } else if (lr_n == '') {
        widPrintBorderColor('submit_button', '');
        widPrintRecordsLastOperation('UNTESTABLE_REC');
    } else if ((g0 == lr_g) && (o0 == lr_o)) {
        widPrintBorderColor('submit_button', 'green');
        widPrintRecordsLastOperation('COMPATIBLE_REC');
    } else {
        widPrintBorderColor('submit_button', 'red');
        widPrintRecordsLastOperation('UNCOMPATIBLE_REC');
    }
}

function widTokensHistorySMenu(range) {
	var cb = function (data) {
		var r = engGetHasqdOk(data);
		if (r !== 'OK') {
			$('#tokens_history_textarea').val('');
			return;
		}
		//$('#' + 'tokens_history_div').css('display', 'block');
		var i = data.indexOf('\r\n');
		var data = data.substr(i+2);
		$('#tokens_history_textarea').val(data);
	}
	
	if (range === 0) {
		$('#tokens_history_textarea').val('');
		return;
	}
	
	var cmd = 'range' + ' ' + glCurrentDB.name + ' ' + '-' + range + ' ' + '-1' + ' ' + $('#dn_input').val();;
	ajxSendCommand(cmd, cb, progressLed);
}

function widHashcalcOninput() {
    if ($('#hashcalc_textarea').val().length > 0) {
        $('#hashcalc_input').val(engGetHash($('#hashcalc_textarea').val(), glHashCalcHash));
    } else {
        $('#hashcalc_input').val('');
    }
}

function widSubmitBtnClk() {
    var cb = function (data) { 
        var r = engGetSubmit(data);
        widPrintRecordsLastOperation(r);
		var i = $('#tokens_history_selectmenu').get(0).selectedIndex;
		var d = +$('#tokens_history_selectmenu').get(0).options[i].text;
		widTokensHistorySMenu(d);
    }
	
    var s = $('#dn_input').val();
    var p0 = $('#newrec_pass0_input').val();
    var p1 = $('#newrec_pass1_input').val();
    var p2 = $('#newrec_pass2_input').val();
    var nr_n = $('#newrec_n_input').val();
    var nr_k = $('#newrec_k_input').val();
    var nr_g = $('#newrec_g_input').val();
    var nr_o = $('#newrec_o_input').val();
    var nr_d = $('#newrec_d_input').val();
    var newRec = 'add * ' + glCurrentDB.name + ' ' + nr_n + ' ' + s + ' ' + nr_k + ' ' + nr_g + ' ' + nr_o + ' ' + nr_d;

    ajxSendCommand(newRec, cb, progressLed);
}

function widCheckEnterKey(d, e) {
    if (e.keyCode == 13) {
        widCommandSendBtnClk();
    }
}