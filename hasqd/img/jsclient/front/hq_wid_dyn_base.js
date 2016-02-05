// Hasq Technology Pty Ltd (C) 2013-2015

function HasqdLed(){
    //this.counter = 0;
}

HasqdLed.prototype.fail = function(){
    $('#hasqd_led').html(picRed);
    widShowRecordsTabLog('Connection failed!');
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

function widShowBordersColor(obj, color) {
	var borders = [ 'borderLeftColor', 'borderTopColor', 'borderRightColor', 'borderBottomColor' ];
	for (var i = 0; i < borders.length; i++) {
		if (color !== undefined) {
			obj.css(borders[i], color);
		} else {
			obj.css(borders[i], '');
		}
	}
}

function widShowLastRecord(data) {
	var objN = $('#lastrec_n_input');
	var objK = $('#lastrec_k_input');
	var objG = $('#lastrec_g_input');
	var objO = $('#lastrec_o_input');
	var objD = $('#lastrec_d_input');
	
	if (arguments.length === 0)	{
		objN.val('');
		objK.val('');
		objG.val('');
		objO.val('');
		objD.val('');
	} else {
        objN.val(data.n);
        objK.val(data.k);
        objG.val(data.g);
        objO.val(data.o);
        objD.val(data.d);
	}
}

function widShowNewRecord(data) {
	var objN = $('#newrec_n_input');
	var objK = $('#newrec_k_input');
	var objG = $('#newrec_g_input');
	var objO = $('#newrec_o_input');
	var objD = $('#newrec_d_input');
	
	if (arguments.length === 0)	{	
		objN.val('');
		objK.val('');
		objG.val('');
		objO.val('');
		objD.val('');
		widShowBordersColor(objK);
		widShowBordersColor(objG);
		widShowBordersColor(objO);
	} else {
		objN.val(data.n);
		objK.val(data.k);
		objG.val(data.g);
		objO.val(data.o);
	}
}

function widCleanHistoryData() {
	var obj = $('#tokens_history_select');
	obj.get(0).selectedIndex = 0;
	obj.selectmenu('refresh');
}

function widServerRefreshButtonClick() {
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

        var obj4 =  $('#database_smenu');//document.getElementById('database_smenu');
        for (var i = 0; i < glDataBase.length; i++) {
            switch (i) {
            case 0:
				obj4.html(new Option(glDataBase[i].name + '(' + glDataBase[i].hash + ')', glDataBase[i].name, true, true)).selectmenu('refresh');;
				var db_table = widGetHTMLDatabaseTraitTable(glDataBase[i]);
				$('#database_table').html(db_table);
				
				var current_db = glDataBase[0].name + '(' + glDataBase[0].hash + ')';
                $('#current_db').html(current_db);
				
				glCurrentDB = glDataBase[0];
                glHashCalcHash = glCurrentDB.hash; //
				widShowNewRecordOninput();  
                break;
            default:
				obj4.append(new Option(glDataBase[i].name + '(' + glDataBase[i].hash + ')', glDataBase[i].name)).selectmenu('refresh');;
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
	
    widShowNewRecord();
	widCleanHistoryData();
    widShowLastRecord();

    objDn.val('');
    widShowLastRecord();

    if (objRawDn.val() == '') {
		objHistorySelect.selectmenu('disable');
        widShowBordersColor(objDn);
        widShowBordersColor(objSubmitButton);
        widShowRecordsTabLog();
    } else {
        widShowBordersColor(objDn);
		objHistorySelect.selectmenu('enable');
        widShowBordersColor(objSubmitButton);
        objDn.val(engGetHash(objRawDn.val(), glCurrentDB.hash));
        widShowNewRecordOninput();
        widShowRecordsTabLog('OK');
    }
}

function widDNOninput() {
	var objDn = $('#dn_input');
	var objRawDn = $('#rdn_input');
	var objSubmitButton = $('#submit_button');
	var s = objDn.val();

    widShowNewRecord();
    widShowLastRecord();
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
        widShowRecordsTabLog('BAD_HASH');
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
	
    widShowNewRecordsCompability();
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
	var objLastRecN = $('#lastrec_n_input');
	var objDn = $('#dn_input');
	var objNewRecPwd0 = $('#newrec_pass0_input');
	var objNewRecPwd1 = $('#newrec_pass1_input');
	var objNewRecPwd2 = $('#newrec_pass2_input');
	var objOnePwd = $('#onepass_checkbox');
	var objThreePwd = $('#threepass_checkbox')
	
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

    widShowNewRecordsCompability();
}

function widShowNewRecordOninput() {
	var objNewRecN = $('#newrec_n_input');
	var objNewRecK = $('#newrec_k_input');
	var objNewRecG = $('#newrec_g_input');
	var objNewRecO = $('#newrec_o_input');
	var objOnePwd = $('#onepass_checkbox');
	var objThreePwd = $('#threepass_checkbox');
	var objNewRecPwd0 = $('#newrec_pass0_input');
	var objNewRecPwd1 = $('#newrec_pass1_input');
	var objNewRecPwd2 = $('#newrec_pass2_input');
	
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
    widShowNewRecordsCompability();
}

function widRecordsOnePwdCheckboxClick(obj) {
    if (obj.checked == true) {
        $('#threepass_checkbox').prop('checked', false);
        $('#newrec_pass0_input').prop('disabled', false);
        $('#newrec_pass1_input').prop('disabled', true);
        $('#newrec_pass2_input').prop('disabled', true);
        widShowNewRecordOninput();
    } else {
        $('#newrec_pass0_input').prop('disabled', true);
        widShowNewRecordsCompability();
    }
}

function widRecordsThreePwdCheckboxClick(obj) {
	var objNewRecPwd0 = $('#newrec_pass0_input');
	var objNewRecPwd1 = $('#newrec_pass1_input');
	var objNewRecPwd2 = $('#newrec_pass2_input');
	var objNewRecOnePwdCheckbox = $('#onepass_checkbox');

    objNewRecPwd0.prop('disabled', !obj.checked);
    objNewRecPwd1.prop('disabled', !obj.checked);
    objNewRecPwd2.prop('disabled', !obj.checked);
		
    if (obj.checked) {
        objNewRecOnePwdCheckbox.prop('checked', !obj.checked);
        widShowNewRecordOninput();
    } else {
        widShowNewRecordsCompability();
    }
}

function widShowNewRecordsCompability() {
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
		var r = resp.content.substr(i+1);
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
	var objT = $('#hashcalc_textarea');
	var objI = $('#hashcalc_input');
	
    if (objT.val().length > 0) {
        objI.val(engGetHash(objT.val(), glHashCalcHash));
    } else {
        objI.val('');
    }
}

function widSubmitButtonClick() {
    var s = $('#dn_input').val();
    var p0 = $('#newrec_pass0_input').val();
    var p1 = $('#newrec_pass1_input').val();
    var p2 = $('#newrec_pass2_input').val();
    var nr_n = $('#newrec_n_input').val();
    var nr_k = $('#newrec_k_input').val();
    var nr_g = $('#newrec_g_input').val();
    var nr_o = $('#newrec_o_input').val();
    var nr_d = $('#newrec_d_input').val();
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
