// Hasq Technology Pty Ltd (C) 2013-2015

function HasqdLed(){
    //this.counter = 0;
}

HasqdLed.prototype.fail = function(){
    $('#hasqd_led').html(picRed);
    widShowRecordsLastOperation('Connection failed!');
};

HasqdLed.prototype.inc = function(){
    setTimeout(function(){ $('#hasqd_led').html(picGryGrn); }, 500);
};

HasqdLed.prototype.dec = function(){
    setTimeout(function(){ $('#hasqd_led').html(picGry); }, 500);
};

var hasqdLed = new HasqdLed();

function widAnimateProgbar(){
    $('#hasqd_led').html(picGry);
}

function widShowBorderColor(id, color) {
    $('#' + id).css('borderLeftColor', color);
    $('#' + id).css('borderTopColor', color);
    $('#' + id).css('borderRightColor', color);
    $('#' + id).css('borderBottomColor', color);
}

function widShowLastRecord(data) {
	if (arguments.length === 0)	{
		$('#lastrec_n_input').val('');
		$('#lastrec_k_input').val('');
		$('#lastrec_g_input').val('');
		$('#lastrec_o_input').val('');
		$('#lastrec_d_input').val('');
	} else {
        $('#lastrec_n_input').val(data.n);
        $('#lastrec_k_input').val(data.k);
        $('#lastrec_g_input').val(data.g);
        $('#lastrec_o_input').val(data.o);
        $('#lastrec_d_input').val(data.d);
	}
}

function widShowNewRecord(data) {
	if (arguments.length === 0)	{	
		$('#newrec_n_input').val('');
		$('#newrec_k_input').val('');
		$('#newrec_g_input').val('');
		$('#newrec_o_input').val('');
		$('#newrec_d_input').val('');
		widShowBorderColor('newrec_k_input', '');
		widShowBorderColor('newrec_g_input', '');
		widShowBorderColor('newrec_o_input', '');
	} else {
		$('#newrec_n_input').val(data.n);
		$('#newrec_k_input').val(data.k);
		$('#newrec_g_input').val(data.g);
		$('#newrec_o_input').val(data.o);
	}
}

function widCleanHistoryData() {
	$('#tokens_history_selectmenu').get(0).selectedIndex = 0;
	$('#tokens_history_selectmenu').selectmenu('refresh');
}

function widCleanPasswordData() {
    $('#newrec_pass0_input').val('');
    $('#newrec_pass1_input').val('');
    $('#newrec_pass2_input').val('');
}

function widServerRefreshBtnClk() {
	var cb1 = function (data) {
        var r = engGetInfoId(data);
		var obj1 = $('#server_id');
		
        if (r.message == 'ERROR') {
            obj1.html('<pre>' + r.message + '\n' + r.content + '</pre>');
        } else {
            obj1.html('<pre>' + r.content + '</pre>');
        }
    }
	
    ajxSendCommand('info id', cb1, hasqdLed);
	
    var cb2 = function (data) {
		var r = engGetInfoSys(data);
		var obj2 = $('#server_sys');
		
        if (r.message == 'ERROR') {
            obj2.html('<pre>' + r.message + '\n' + r.content + '</pre>');
        } else {
            obj2.html('<pre>' + r.content + '</pre>');
        }
    }
	
    ajxSendCommand('info sys', cb2, hasqdLed);
	
    var cb3 = function (data) {
		var obj3 = $('#server_fam');
        var r = engGetInfoFam(data);

        if (r.message == 'OK') {
            table = widServerFamilyTable(r);
            obj3.html('<pre>' + table + '</pre>');
        } else {
            obj3.html('<pre>' + r.message + '\n' + r.content + '</pre>');
        }
    }
	
    ajxSendCommand('info fam', cb3, hasqdLed);

    var cb4 = function (data) {
        glDataBase = engGetInfoDb(data);
        if (glDataBase.length < 1) {
            return 'No database';
        }

        var obj4 =  $('#database_smenu');//document.getElementById('database_smenu');
        for (var i = 0; i < glDataBase.length; i++) {
            switch (i) {
            case 0:
				obj4.html(new Option(glDataBase[i].name + '(' + glDataBase[i].hash + ')', glDataBase[i].name, true, true)).selectmenu('refresh');;
				var db_table = widDatabaseTraitTable(glDataBase[i]);
				$('#database_table').html(db_table);
				
				var current_db = glDataBase[0].name + '(' + glDataBase[0].hash + ')';
                $('#current_db').html(current_db);
				
				glCurrentDB = glDataBase[0];
                glHashCalcHash = glCurrentDB.hash; //
				widGetNewRecordOninput();  
                break;
            default:
				obj4.append(new Option(glDataBase[i].name + '(' + glDataBase[i].hash + ')', glDataBase[i].name)).selectmenu('refresh');;
                break;
            }
        }
    }
	
    ajxSendCommand('info db', cb4, hasqdLed);
}

function widCommandSendBtnClk() {
    var cmd = $('#cmd_input').val();
    var cb = function (data) {
        $('#cmd_output').html(data);
    }
    ajxSendCommand(cmd, cb, hasqdLed);
}

function widRawDNOninput() {
	var objH = $('#tokens_history_selectmenu');
	var objS = $('#dn_input');
	var objRDn = $('#rdn_input');
	
    widShowNewRecord();
	widCleanHistoryData();
    widShowLastRecord();

    objS.val('');
    widShowLastRecord();

    if (objRDn.val() == '') {
		objH.selectmenu('disable');
        widShowBorderColor('dn_input', '');
        widShowBorderColor('submit_button', '');
        widShowRecordsLastOperation();
    } else {
        widShowBorderColor('dn_input', '');
		objH.selectmenu('enable');
        widShowBorderColor('submit_button', '');
        objS.val(engGetHash(objRDn.val(), glCurrentDB.hash));
        widGetNewRecordOninput();
        widShowRecordsLastOperation('OK');
    }
}

function widDNOninput() {
    widShowNewRecord();
    widShowLastRecord();
	widCleanHistoryData();
	var obj = $('#dn_input');
    obj.val(engSetHex(obj.val()));
	
    $('#rdn_input').val('');
	var s = obj.val();
	if (s.length === 0) {
		widShowBorderColor('dn_input', '');
        widShowBorderColor('submit_button', '');		
		widShowRecordsLastOperation();
	} else if (engIsHash(obj.val(), glCurrentDB.hash)) {
        widShowBorderColor('dn_input', '');
        widShowBorderColor('submit_button', '');
        widShowRecordsLastOperation('OK');
        //widGetNewRecordOninput();
    } else {
        widShowBorderColor('dn_input', 'red');
        widShowBorderColor('submit_button', 'red');
        widShowRecordsLastOperation('BAD_HASH');
    }
}

function widShowRecordsLastOperation(data) {
	var obj = $('#' + 'records_last_operation_pre');
	if (arguments.length === 0) {
		obj.html('&nbsp');
	} else {
		obj.html(data);
	}	
}

function widCheckNewRecordKeys(id) {
    $('#' + id).val(engSetHex($('#' + id).val()));

    if (engIsHash($('#' + id).val(), glCurrentDB.hash) || $('#' + id).val() == '') {
        widShowBorderColor(id, '');
        widShowBorderColor('submit_button', '');
        widShowRecordsLastOperation();
    } else {
        widShowBorderColor(id, 'red');
        widShowBorderColor('submit_button', 'red');
        widShowRecordsLastOperation('BAD_HASH');
    }
    widCheckNewRecord();
}

function widRecordsGetLastRecordBtnClk() {
    var s = $('#dn_input').val();
    var getlast = 'last' + ' ' + glCurrentDB.name + ' ' + s;

    var cb = function (data) {
        var r = engGetLastRecord(data);

        if (r.message == 'OK') {
			widShowLastRecord(r);
            widGetNewRecordAuto();
        } else {
            widShowLastRecord();
        }
        widShowRecordsLastOperation(r.content);
    }

    ajxSendCommand(getlast, cb, hasqdLed);
}

function widGetNewRecordAuto() {
    var lr_n = $('#lastrec_n_input').val();
    var s = $('#dn_input').val();
    var p0 = $('#newrec_pass0_input').val();
	var objOP = $('#onepass_checkbox');
	var objTP = $('#threepass_checkbox')
	var objP1 = $('#newrec_pass1_input');
	var objP2 = $('#newrec_pass2_input');
	
    if (objOP.prop('checked') == 'enabled') {
        var p1 = null;
        var p2 = null;
    } else if (objTP.prop('checked')) {
        var p1 = objP1.val();
        var p2 = objP2.val();
    }

    widShowNewRecord();

    if (lr_n != '') {
        var nr_n = +lr_n + 1;
		widShowNewRecord(engGetNewRecord(nr_n, s, p0, p1, p2, glCurrentDB.magic, glCurrentDB.hash));
    }

    widCheckNewRecord();
}

function widGetNewRecordOninput() {
	var objNRN = $('#newrec_n_input');
	var objNRK = $('#newrec_k_input');
	var objNRG = $('#newrec_g_input');
	var objNRO = $('#newrec_o_input');
	var objOPC = $('#onepass_checkbox');
	var objTPC = $('#threepass_checkbox');
	var objP0 = $('#newrec_pass0_input');
	var objP1 = $('#newrec_pass1_input');
	var objP2 = $('#newrec_pass2_input');
	
    var s = $('#dn_input').val();	
	
    if (objNRN.val() == '' && objNRK.val() == '' && objNRG.val() == '' && objNRO.val() == '') {
        return;
    }

    objNRN.val(engSetNumber(objNRN.val()));

    var nr_n = +objNRN.val();

    var p0 = objP0.val();

    if (objOPC.prop('checked')) {
        var p1 = null;
        var p2 = null;
    } else if (objTPC.prop('checked')) {
        var p1 = objP1.val();
        var p2 = objP2.val();
    }

    var pwdCheckBoxIsOn = objOPC.prop('checked') + objTPC.prop('checked');

    if ((s != '') && pwdCheckBoxIsOn == 1) {
        widShowNewRecord(engGetNewRecord(nr_n, s, p0, p1, p2, glCurrentDB.magic, glCurrentDB.hash));
        widShowRecordsLastOperation();
    }
    widCheckNewRecord();
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
        widShowBorderColor('submit_button', '');
        widShowRecordsLastOperation();
    } else if (lr_n == '') {
        widShowBorderColor('submit_button', '');
        widShowRecordsLastOperation('UNTESTABLE_REC');
    } else if ((g0 == lr_g) && (o0 == lr_o)) {
        widShowBorderColor('submit_button', 'green');
        widShowRecordsLastOperation('COMPATIBLE_REC');
    } else {
        widShowBorderColor('submit_button', 'red');
        widShowRecordsLastOperation('UNCOMPATIBLE_REC');
    }
}

function widTokensHistorySMenu(range) {
	var cb = function (data) {
		var resp = engGetHasqdResponse(data);
		var obj = $('#tokens_history_textarea');
		if (resp.message !== 'OK') {
			obj.val('');
			return;
		}
		var i = resp.content.indexOf('\n');
		var r = resp.content.substr(i+1);
		obj.val(r);
	}

	var obj = $('#tokens_history_textarea');
	var t = $('#dn_input').val();
	
	if (range === 0) {
		obj.val('');
		return;
	}
	
	var cmd = 'range' + ' ' + glCurrentDB.name + ' ' + '-' + range + ' ' + '-1' + ' ' + t;
	ajxSendCommand(cmd, cb, hasqdLed);
}

function widHashcalcOninput() {
	var objT = $('#hashcalc_textarea');
	var objI = $('#hashcalc_input');
	
    if (objT.val().length > 0) {
        objI.val(engGetHash(objT.val(), glHashCalcHash));
    } else {
        objI.val('');
    }
}

function widSubmitBtnClk() {
    var cb = function (data) { 
		var r = engGetHasqdResponse(data)
        widShowRecordsLastOperation(r.message);
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
    var newRec = 'add * ' + glCurrentDB.name + ' ' + nr_n + ' ' + s + ' ' + nr_k + ' ' + nr_g + ' ' + nr_o + ' ' + engSetParsedDataValue(nr_d);

    ajxSendCommand(newRec, cb, hasqdLed);
}

function widCheckEnterKey(d, e) {
    if (e.keyCode == 13) {
        widCommandSendBtnClk();
    }
}
