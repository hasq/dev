// Hasq Technology Pty Ltd (C) 2013-2015

function widShowBordersColor($obj, color)
{
    var borders = ['borderLeftColor', 'borderTopColor', 'borderRightColor', 'borderBottomColor'];

    for (var i = 0; i < borders.length; i++)
    {
        if (color !== undefined)
            $obj.css(borders[i], color);
        else
            $obj.css(borders[i], '');
    }
}

function widShowLastRecord(lastRec)
{
    var $N = $('#lr_n_input');
    var $K = $('#lr_k_input');
    var $G = $('#lr_g_input');
    var $O = $('#lr_o_input');
    var $D = $('#lr_d_input');

    if (arguments.length == 0)
    {
        $N.val('');
        $K.val('');
        $G.val('');
        $O.val('');
        $D.val('');
    }
    else
    {
        $N.val(lastRec.n);
        $K.val(lastRec.k);
        $G.val(lastRec.g);
        $O.val(lastRec.o);
        $D.val(lastRec.d);
    }
}

function widShowNewRecord(newRec)
{
    var $N = $('#nr_n_input');
    var $K = $('#nr_k_input');
    var $G = $('#nr_g_input');
    var $O = $('#nr_o_input');
    var $D = $('#nr_d_input');

    if (arguments.length === 0)
    {
        $N.val('');
        $K.val('');
        $G.val('');
        $O.val('');
        $D.val('');
        widShowBordersColor($K);
        widShowBordersColor($G);
        widShowBordersColor($O);
    }
    else
    {
        $N.val(newRec.n);
        $K.val(newRec.k);
        $G.val(newRec.g);
        $O.val(newRec.o);
        $D.val(''); //
    }
}

function widCleanHistoryData()
{
    var $obj = $('#select_records_history');
    $obj.get(0).selectedIndex = 0;
    $obj.selectmenu('refresh');
}

function widRefreshButtonClick()
{
    var cb1 = function (resp, id)
    {
		var $Id = $('#server_id');
		
        if (resp === gResponse.OK && id)
             $Id.html('<pre>' + id + '</pre>');
        else
            return;
    }

	engNcInfoId(cb1);

    var cb2 = function (resp, sys)
    {
        var $Sys = $('#server_sys');

        if (resp === gResponse.OK && sys)
             $Sys.html('<pre>' + sys + '</pre>');
        else
            return;
    }

	engNcInfoSys(cb2);

    var cb3 = function (resp, fam)
    {
        var $Fam = $('#server_fam');

        if ( resp === gResponse.OK && fam && fam.length > 0 )
		{
			var table = widGetHTMLFamilyTable(fam);
			$Fam.html('<pre>' + table + '</pre>');			
		}
        else
            return;
    }
	
	engNcInfoFam(cb3);

    var cb4 = function (resp, db)
    {
		glDataBase = db;
        if (resp === gResponse.OK && glDataBase.length !== 0)
        {
			var $Db = $('#database_select');
			
			for (var i = 0; i < glDataBase.length; i++)
			{
				if ( i == 0 )
				{
					$Db.html(new Option(glDataBase[i].name + '(' + glDataBase[i].hash + ')', glDataBase[i].name, true, true)).selectmenu('refresh');
					var db_table = widGetHTMLDatabaseTraitTable(glDataBase[i]);
					$('#div_database_table').html(db_table);

					var current_db = glDataBase[0].name + '(' + glDataBase[0].hash + ')';
					$('#current_db').html(current_db);

					gCurrentDB = glDataBase[0];
					glHashCalcHash = gCurrentDB.hash;
					//widShowNewRecOninput();
				}
				else
					$Db.append(new Option(glDataBase[i].name + '(' + glDataBase[i].hash + ')', glDataBase[i].name)).selectmenu('refresh');
			}			
		}    
        else
			return;
    }
		
	engNcInfoDb(cb4);
	
    //ajxSendCommand('info db', cb4, hasqLogo);
}


function widAddSkc()
{
    var $Img = $('#span_skc img');

    gSkc = prompt('Enter SKC key:', gSkc || '') || null;

    if ( gSkc && !engIsAsciiOrLF(gSkc) )
        gSkc = null;

    if ( gSkc )
    {
        $Img.attr('src', imgSkcOn);
        $('#td_label_records_encrypt').show();
        $('#td_input_records_encrypt').show();
        $('#td_tokens_encrypt').show();
    }
    else
    {
        $Img.attr('src', imgSkcOff);
        $('#td_label_records_encrypt').hide();
        $('#td_input_records_encrypt').hide();
        $('#td_tokens_encrypt').hide();
        $('#input_records_encrypt').prop('checked', false);
        $('#input_tokens_encrypt').prop('checked', false);
    }
    return;
}

function widCommandSendButtonClick()
{
    var $CmdInput = $('#input_cmd');
    var $CmdOutput = $('#textarea_cmd');

    var cmd = $CmdInput.val();

    if ( !engIsAsciiOrLF(cmd))
        return $CmdOutput.empty();

    if ( gSkc )
        cmd = '#' + engGetCipher(cmd);

    var cb = function (d)
    {
        $CmdOutput.html(d);
    }

    ajxSendCommand(cmd, cb, hasqLogo);
}

function widTokenNameOninput()
{
    var $Dn = $('#dn_input');
    var $RawDn = $('#rdn_input');
    var $SubmitButton = $('#submit_button');
    var $HistorySelect = $('#select_records_history');

    widShowLastRecord();
    widShowNewRecord();
    widCleanHistoryData();

    $Dn.val('');
    if ($RawDn.val().length == 0)
    {
        $HistorySelect.selectmenu('disable');
        widShowBordersColor($Dn);
        widShowBordersColor($SubmitButton);
        widShowRecordsTabLog();
    }
    else
    {
        $HistorySelect.selectmenu('enable');
        widShowBordersColor($Dn);
        widShowBordersColor($SubmitButton);
        $Dn.val(engGetHash($RawDn.val(), gCurrentDB.hash));
        widShowNewRecOninput();
        widShowRecordsTabLog('OK');
    }
}

function widTokenHashOninput()
{
    var $Dn = $('#dn_input');
    var $RawDn = $('#rdn_input');
    var $SubmitButton = $('#submit_button');
    var $HistorySelect = $('#select_records_history');
    var tok = $Dn.val();

    widShowLastRecord();
    widShowNewRecord();
    widCleanHistoryData();

    $Dn.val(engGetOnlyHex($Dn.val()));
    $RawDn.val('');

    if (tok.length === 0)
    {
        $HistorySelect.selectmenu('disable');
        widShowBordersColor($Dn);
        widShowBordersColor($SubmitButton);
        widShowRecordsTabLog();
        return;
    }

    if (engIsHash($Dn.val(), gCurrentDB.hash))
    {
        $HistorySelect.selectmenu('enable');
        widShowBordersColor($Dn);
        widShowBordersColor($SubmitButton);
        widShowRecordsTabLog('OK');
    }
    else
    {
        widShowBordersColor($Dn, 'red');
        widShowBordersColor($SubmitButton, 'red');
        widShowRecordsTabLog('Dn is not a hash.');
    }
}

function widShowRecordsTabLog(d)
{
    var $obj = $('#' + 'div_records_log');
    if (arguments.length == 0)
        $obj.html('&nbsp');
    else
        $obj.html(d);
}

function widShowKeysPropriety($Obj)
{
    var $SubmitButton = $('#submit_button');

    $Obj.val(engGetOnlyHex($Obj.val()));

    if (engIsHash($Obj.val(), gCurrentDB.hash) || $Obj.val() == '')
    {
        widShowBordersColor($Obj);
        widShowBordersColor($SubmitButton);
        widShowRecordsTabLog();
    }
    else
    {
        widShowBordersColor($Obj, 'red');
        widShowBordersColor($SubmitButton, 'red');
        widShowRecordsTabLog('BAD_HASH');
    }

    widShowNewRecCompability();
}

function widGetLastRecordButtonClick()
{
    var $Dn = $('#dn_input');
    var s = $Dn.val();
    var getlast = 'last' + ' ' + gCurrentDB.name + ' ' + s;
    var cb = function (data)
    {
        if (engGetResponseHeader(data) !== 'OK')
            return widShowRecordsTabLog(data);

        var lastRec = engGetParsedRecord(data);

        if (typeof(lastRec) === 'null')
            return widShowRecordsTabLog(data);

        widShowLastRecord(lastRec);
        widShowNewRecordAuto();
    }

    widShowLastRecord();
    ajxSendCommand(getlast, cb, hasqLogo);
}

function widShowNewRecordAuto()
{
    var $LastRecN = $('#lr_n_input');
    var $Dn = $('#dn_input');
    var $NewRecPwd0 = $('#nr_pwd0_input');
    var $NewRecPwd1 = $('#nr_pwd1_input');
    var $NewRecPwd2 = $('#nr_pwd2_input');
    var $OnePwd = $('#one_pwd_checkbox');
    var $ThreePwd = $('#three_pwd_checkbox')

                    var lr_n = $LastRecN.val();
    var s = $Dn.val();
    var p0 = $NewRecPwd0.val();

    if ($OnePwd.prop('checked'))
    {
        var p1 = null;
        var p2 = null;
    }
    else if ($ThreePwd.prop('checked'))
    {
        var p1 = $NewRecPwd1.val();
        var p2 = $NewRecPwd2.val();
    }

    widShowNewRecord();

    if (lr_n != '')
    {
        var nr_n = +lr_n + 1;
        widShowNewRecord(engGetRecord(nr_n, s, p0, p1, p2, gCurrentDB.magic, gCurrentDB.hash));
    }

    widShowNewRecCompability();
}

function widShowNewRecOninput()
{
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

    var s = $('#dn_input').val();
    var nr_n = +$NewRecN.val();
    var p0 = $NewRecPwd0.val();

    if ($OnePwd.is(':checked'))
    {
        var p1 = null;
        var p2 = null;
    }
    else if ($ThreePwd.is(':checked'))
    {
        var p1 = $NewRecPwd1.val();
        var p2 = $NewRecPwd2.val();
    }

    var pwdCheckboxIsOn = $OnePwd.is(':checked') + $ThreePwd.is(':checked');

    if ((s != '') && pwdCheckboxIsOn == 1)
    {
        widShowNewRecord(engGetRecord(nr_n, s, p0, p1, p2, gCurrentDB.magic, gCurrentDB.hash));
        widShowRecordsTabLog();
    }

    widShowNewRecCompability();
}

function widRecordsOnePwdCheckboxClick($Obj)
{
    var state = $Obj.is(':checked');

    if ( state )
    {
        $('#three_pwd_checkbox').prop('checked', false);
        $('#nr_pwd0_input').prop('disabled', false);
        $('#nr_pwd1_input').prop('disabled', true);
        $('#nr_pwd2_input').prop('disabled', true);
        widShowNewRecOninput();
    }
    else
    {
        $('#nr_pwd0_input').prop('disabled', true);
        widShowNewRecCompability();
    }
}

function widRecordsThreePwdCheckboxClick($Obj)
{
    var $NewRecPwd0 = $('#nr_pwd0_input');
    var $NewRecPwd1 = $('#nr_pwd1_input');
    var $NewRecPwd2 = $('#nr_pwd2_input');
    var $NewRecOnePwdCheckbox = $('#one_pwd_checkbox');

    var state = $Obj.is(':checked');

    $NewRecPwd0.prop('disabled', !state);
    $NewRecPwd1.prop('disabled', !state);
    $NewRecPwd2.prop('disabled', !state);

    if ( state )
    {
        $NewRecOnePwdCheckbox.prop('checked', !state);
        widShowNewRecOninput();
    }
    else
        widShowNewRecCompability();
}

function widShowNewRecCompability()
{
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

    var g0 = engGetKey(nr_n, s, nr_k, gCurrentDB.magic, gCurrentDB.hash);
    var o0 = engGetKey(nr_n, s, nr_g, gCurrentDB.magic, gCurrentDB.hash);

    var $SubmitButton = $('#submit_button');

    if (nr_n == '') //new record number is required
    {
        widShowBordersColor($SubmitButton);
        widShowRecordsTabLog();
    }
    else if (lr_n == '')
    {
        widShowBordersColor($SubmitButton);
        widShowRecordsTabLog('New records compatible is unknown.');
    }
    else if ((g0 === lr_g) && (o0 === lr_o))
    {
        widShowBordersColor($SubmitButton, 'green');
        widShowRecordsTabLog('New record is compatible.');
    }
    else
    {
        widShowBordersColor($SubmitButton, 'red');
        widShowRecordsTabLog('New record is uncompatible.');
    }
}

function widTokensHistorySelect(range)
{
    var $HistorySelect = $('#textarea_records_history');
    var s = $('#dn_input').val();
    $HistorySelect.val('');
    var cb = function (data)
    {
        if (engGetResponseHeader(data) !== 'OK')
            return widShowRecordsTabLog(data);

        var range = engGetParsedRange(data);
        if (typeof(range) === 'null')
            return widShowRecordsTabLog(data);

        $HistorySelect.val(range.substr(range.indexOf('\n') + 1));
    }

    if (range === 0)
        return;

    var cmd = 'range' + ' ' + gCurrentDB.name + ' ' + '-' + range + ' ' + '-1' + ' ' + s;

    ajxSendCommand(cmd, cb, hasqLogo);
}

function widHashcalcOninput()
{
    var $In = $('#textarea_hashcalc_in');
    var $Out = $('#textarea_hashcalc_out');

    if ($In.val().length > 0)
        $Out.val(engGetHash($In.val(), glHashCalcHash));
    else
        $Out.val('');
}

function widSubmitButtonClick()
{
    var s = $('#dn_input').val();
    var p0 = $('#nr_pwd0_input').val();
    var p1 = $('#nr_pwd1_input').val();
    var p2 = $('#nr_pwd2_input').val();
    var nr_n = $('#nr_n_input').val();
    var nr_k = $('#nr_k_input').val();
    var nr_g = $('#nr_g_input').val();
    var nr_o = $('#nr_o_input').val();
    var nr_d = $('#nr_d_input').val();
    var enc = $('#input_records_encrypt').prop('checked');
    var cmd = ( +nr_n == 0 ) ? 'z' : 'add';

    var cb = function (data)
    {
        var $HistorySelect = $('#select_records_history');

        widShowRecordsTabLog(engGetResponseHeader(data));

        var i = $HistorySelect.get(0).selectedIndex;
        var d = +$HistorySelect.get(0).options[i].text;
        widTokensHistorySelect(d);
    }

    var nr = cmd + ' * ' + gCurrentDB.name + ' ' + nr_n + ' ' + s + ' ' + nr_k + ' ' + nr_g + ' ' + nr_o + ' ' + engGetDataToRec(nr_d);

    if ( enc )
        nr = '#' + engGetCipher(nr);

    ajxSendCommand(nr, cb, hasqLogo);
}

function widSendCommandInputOnpresskey(d, e)
{
    if (e.keyCode == 13)
        widCommandSendButtonClick();
}
