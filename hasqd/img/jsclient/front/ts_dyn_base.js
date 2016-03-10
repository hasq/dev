// Hasq Technology Pty Ltd (C) 2013-2016
function textArea($textarea)
{
    return {
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
}

function widModalWindow(msg, func) 
{
	$('#modal_content_div').click(function () 
	{
		$(this).find('p').empty();
		$('#modal_window_div').css('display', 'none');

		if (func) 
			func();

		$(this).off('click');
	});
	
	$('#modal_window_div').css('display', 'block');
	$('#modal_content_div').find('p').html(msg);
	
}

function widSendPing(timeDelay)
{
    // Ping server every 5s,10s,15s,...,60s,...,60s,...
    var timerId = glPingTimerId;

    if (timeDelay < 60000)
    {
        timeDelay += 5000;
    }

    var cb = function (data)
    {
        //var now = new Date();
        //var ct = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + '.' + now.getMilliseconds();
        if (engGetResp(data).msg !== 'OK')
            return widShowLog('Server gave a suspicious response to the ping!');
    }

    ajxSendCommand('ping', cb, hasqLogo)
    var ping = function ()
    {
        widSendPing(timeDelay)
    };
    glPingTimerId = setTimeout(ping, timeDelay);
    clearInterval(timerId);
}

function widButtonClick(obj)
{
    // Shared button click function
    var obj = $(obj);
    var f = obj.attr('data-onclick');

    eval(f);
}

function widCompleteEvent(text)
{
    // Completes actions and enables UI

    if (arguments.length == 0)
        text = '&nbsp';
    return widShowLog(text);
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
	var f = function()
	{
		location.reload(true);
	}
	
    widModalWindow('Database is not accessible!', f);
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
    if (arguments.length == 0 || typeof tok == 'undefined')
        return $TokenText.empty();
    if (tok.length == 0)
        return widShowToken();

    $TokenText.html(widGetToken(tok, glCurrentDB.hash));
}

function widShowLog(text)
{
    // Shows messages in log
    var jqLog = $('#' + 'log_area_div');
    text = text || '';
    jqLog.html(text);
}

function widShowTokenSearchProcess()
{ // Shows message or image about tokens existense.
    var $Pic = $('#token_pic_span');
    $Pic.hide();
    widShowLog();

    return {
        show : function (d)
        {
            if (typeof d == 'undefined')
            {
                $Pic.show();
                return widShowLog('Searching for token...');
            }

            (d) ? widShowLog('Token exists.') : widShowLog('No such token.');
        }
    }
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
        r.img = imgTknOk;
        r.title = 'OK';
        break;
    case 'TKN_SNDNG':
        r.img = imgTknSndng;
        r.title = 'Token is locked (sending)';
        break;
    case 'TKN_RCVNG':
        r.img = imgTknRcvng;
        r.title = 'Token is locked (receiving)';
        break;
    case 'WRONG_PWD': //'WRONG_PWD'
        r.img = imgTknWrong;
        r.title = 'Token locked (wrong password)';
        break;
    default:
        r.img = imgPwdDummy;
        r.title = '';
        break;
    }
    return r;
}

function widShowPwdMatch(status)
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

function widToggleUI(lr, pwd) {
	var tokState = lr.st;
	var tokData = lr.d;

	widCreateTab().disable(true);
	widAssignDataTab().disable(true);
	widAssignDataTab().readonly(true);	
	widReceiveTab().disable(true);
	widReceiveTab().readonly(true);
	widShowKeysTab().disable(true);
	
	(pwd) ? widSearchTab().disable(false) : widSearchTab().disable(true);
	
	if (typeof tokState == 'undefined')
	{ 
		widReceiveTab().readonly(false);
		
		if (widReceiveTab().isTransKeys() && pwd)
			widReceiveTab().disable(false);
	}
	
	if (tokState == 'IDX_NODN')
	{ 
		if (pwd)
			widCreateTab().disable(false);
	}
	
	if (tokState == 'OK')
	{
		widReceiveTab().readonly(false);
		
		if (widReceiveTab().isTransKeys())
			widReceiveTab().disable(false);	

		var newData = widAssignDataTab().val() || '';
		widAssignDataTab().readonly(false);

		(tokData !== newData) ? widAssignDataTab().disable(false) : widAssignDataTab().disable(true);
		
		widShowKeysTab().disable(false);
	}
	
	if (tokState == 'WRONG_PWD')
	{ 
		widReceiveTab().readonly(false);
		
		if (widReceiveTab().isTransKeys())
			widReceiveTab().disable(false);	
	}

	if (tokState == 'TKN_SNDNG')
	{ 
		widShowKeysTab().disable(false);
	}

	if (tokState == 'TKN_RCVNG')
	{ 
		widReceiveTab().readonly(false);
		
		if (widReceiveTab().isTransKeys())
			widReceiveTab().disable(false);	
	}
}

function widTokenTextOninput()
{    // Events when tokens value changed.

	glLastRec = {}; 				//clear last record
    clearTimeout(glTimerId);		//clear last request to hasqd 
	widButtonsTable().toggleOff();	//disable tabs switch buttons
    widShowPwdMatch();				//clear info about password match
    widShowTokenSearchProcess();

    var $TokText = $('#token_text_textarea');
    textArea().clearExcept($TokText);
    var tok = widGetToken(textArea($TokText).val(), glCurrentDB.hash);
    widShowToken(tok);

    var cb = function (data)
    {
        widShowTokenSearchProcess();
		var resp = engGetResp(data);
		
        if (resp.msg === 'ERROR')
            return widShowLog(resp.msg + ': ' + data);

		widButtonsTable().toggleOff();
		
        if (resp.msg === 'IDX_NODN')
        {
			widShowTokenSearchProcess().show(false);
            glLastRec.st = 'IDX_NODN';
            glLastRec.s = tok;
            widCreateTab().show();
        }
        else
        {
            glLastRec = engGetRespLast(data);
            var nr = engGetNewRecord(glLastRec.n, glLastRec.s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);
            glLastRec.st = engGetTokensStatus(glLastRec, nr);
			widShowTokenSearchProcess().show(true);
            widAssignDataTab().set(engGetOutputDataValue(glLastRec.d));
			widAssignDataTab().show();
        }

        glLastRec.r = (textArea($TokText).val() !== tok) ? textArea($TokText).val() : '';
        widPasswordOninput(); //updates info about last records and password matching
    }

    if (tok.length > 0)
    {
		widEmptyTab().show();
        widShowTokenSearchProcess().show();
        var cmd = 'last' + '\u0020' + glCurrentDB.name + '\u0020' + tok;
        return engSendDeferredRequest(cmd, 500, cb);
    }
	
	widWelcomeTab().show();
}

function widPasswordOninput()
{
    // Events when passwords value changed.
    var $Pwd = $('#password_input');
	
	glPassword = $Pwd.val() || '';
	widShowPwdGuessTime(widGetPwdGuessTime(glPassword));
	
	if (glLastRec.st == 'IDX_NODN' || typeof glLastRec.st == 'undefined')
		return widToggleUI(glLastRec, glPassword);
	
    if (glPassword.length > 0)
    {
        var nr = engGetNewRecord(glLastRec.n, glLastRec.s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);
        glLastRec.st = engGetTokensStatus(glLastRec, nr);
    }
    else
    {
		glLastRec.st = 'WRONG_PWD';
    }
	
	widShowPwdMatch(glLastRec.st);	
	widToggleUI(glLastRec, glPassword);
}

function widPasswordEyeClick($obj)
{
    //shows/hides passwords	by click;
    var $Pwd = $('#password_input');
	var $Eye = $obj.find('img')
    if ($Pwd.attr('type') == 'text')
    {
        $Pwd.attr('type', 'password');
        $Eye.attr('src', imgEyeOpen);
        $Eye.attr('title', 'Unmask password');
    }
    else
    {
        $Pwd.attr('type', 'text');
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
        widSimpleReceive(keys);
        break;
    case '23141':
        widBlockingReceiveStep1(keys);
        break;
    case '232':
        widBlockingReceiveStep2(keys);
        break;
    default:
        return widCompleteEvent('Bad TransKeys!');
    }
}

function widButtonsTable()
{
	var $Buttons = $('.tab-buttons-table');

    return {
        toggleOff: function ()
        {
			$Buttons.find('.tab-button-on').toggleClass('tab-button-on tab-button-off');
        }
    }
}

function widWelcomeTab()
{
    var $Tabs = $('#tabs_div');
	widPasswordOninput();
	
    return {
        show: function ()
        {
            $Tabs.tabs('option', 'active', 0);
        }
    }
}

function widCreateTab()
{
    var $Table = $('#create_table');
    var $Button = $Table.find('button');	
    var $Tabs = $('#tabs_div');

    return {
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
}

function widCreateButtonClick()
{
    // Creates a new token record
    var $Pwd = $('#password_input');

    if (!widIsPassword())
        return widModalWindow('Enter master key.', function() { $Pwd.focus() } );

	widEmptyTab().show();
	
    var nr = engGetNewRecord(0, glLastRec.s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);
    var nr_d = (glLastRec.r.length > 0 && glLastRec.r.length <= 160 && glLastRec.r !== glLastRec.s) ? '[' + glLastRec.r + ']' : '';
    var cmd = 'z *' + '\u0020' + glCurrentDB.name + '\u0020' + '0' + '\u0020' + glLastRec.s + '\u0020' + nr.k + '\u0020' + nr.g + '\u0020' + nr.o + '\u0020' + nr_d;

    var cb = function (data)
    {
        var r = engGetResp(data);
        if (r.msg == 'OK')
        {
            widCompleteEvent(r.msg);
            widTokenTextOninput(); //update token info after create;
        }
        else
        {
            widCompleteEvent(r.msg + ': ' + r.cnt);
        }
    }

    var f = function ()
    {
        ajxSendCommand(cmd, cb, hasqLogo);
    }

	widShowLog('Creating token...');
	
    setTimeout(f);
}

function widAssignDataTab()
{
    var $Tabs = $('#tabs_div');
    var $Button = $('#setdata_table').find('button');
    var $Textarea = $('#setdata_table').find('textarea');

    return {
        set: function (data)
        {
            data = data || '';
            textArea($Textarea).set(data);
        },
        readonly: function (comm)
        {
			$Textarea.prop('readonly', comm);
        },
		disable: function (comm)
		{
			(comm) ? $Button.addClass('button-disabled').removeClass('button-enabled') : $Button.addClass('button-enabled').removeClass('button-disabled');
		},
        show: function ()
        {
			$('.tab-button-on').toggleClass('tab-button-on tab-button-off');
            $Tabs.tabs('option', 'active', 2);
        },
		val: function () {
			return textArea($Textarea).val();
		}
    }
}

function widAssignDataButtonClick()
{
    // Adds a new record with a specified data
    var $Pwd = $('#password_input');
    var $Data = $('#setdata_textarea');

    if (!widIsPassword())
        return widModalWindow('Enter master key...', function() { $Pwd.focus() } );

    if (glLastRec.st !== 'OK')
        return widModalWindow('Token is unaccessible.<br/>Incorrect master key.', function() { $Pwd.focus() } );
	
	if ($Data.val() == glLastRec.d) 
	{
		return widModalWindow('Token data is not changed...', function() { $Data.focus() } );
	}
        
	
    var nr = engGetNewRecord(glLastRec.n + 1, glLastRec.s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);
    var nr_d = engGetInputDataValue($Data.val());
    var cmd = 'add * ' + glCurrentDB.name + '\u0020' + nr.n + '\u0020' + glLastRec.s + '\u0020' + nr.k + '\u0020' + nr.g + '\u0020' + nr.o + '\u0020' + nr_d;

    var cb = function (d)
    {
        var r = engGetResp(d);
        if (r.msg == 'OK')
        {
            widTokenTextOninput();
            return widCompleteEvent(r.msg);
        }

        return widCompleteEvent(r.msg + ': ' + r.cnt);
    }

    var f = function ()
    {
        ajxSendCommand(cmd, cb, hasqLogo);
    }

    widShowLog('Assigning token data...');
    setTimeout(f);
}

function widAssignDataTextareaOninput()
{
	widToggleUI(glLastRec, glPassword);
}

function widShowKeysTab()
{
    var $Table = $('#send_table');
	var $Button = $Table.find('button');
    var $Tabs = $('#tabs_div');

    return {
        disable: function (comm)
        {
			(comm) ? $Button.addClass('button-disabled').removeClass('button-enabled') : $Button.addClass('button-enabled').removeClass('button-disabled');
            $Table.find('input').prop('disabled', comm);
        },
		firstdStep: function () {
			
		},
		secondStep: function () {
			
		},		
        show: function ()
        {
            $Tabs.tabs('option', 'active', 3);
        }
    }
}

function widShowKeysTabButtonClick($obj)
{
	widPasswordOninput();
    $obj.toggleClass('tab-button-on tab-button-off');
    $('.tab-button-on').not($obj).toggleClass('tab-button-on tab-button-off');

    if (typeof glLastRec.st === 'undefined')
        return ($obj.hasClass('tab-button-on')) ? widShowKeysTab().show() : widWelcomeTab().show();
	
    if (glLastRec.st === 'IDX_NODN')
        return ($obj.hasClass('tab-button-on')) ? widShowKeysTab().show() : widCreateTab().show();
	
    return ($obj.hasClass('tab-button-on')) ? widShowKeysTab().show() : widAssignDataTab().show();
}

function widShowKeysButtonClick()
{
    var $Pwd = $('#password_input');
	var $Token = $('#token_text_textarea');
    var $Area0 = $('#send_simple_textarea');
    var $Area1 = $('#send_blocking_textarea');
    var $SendType = $('#send_type_checkbox');

    if (typeof glLastRec.st === 'undefined')
        return widModalWindow('Enter token name...', function() { $Token.focus() } );

    if (glLastRec.st === 'IDX_NODN')
        return widModalWindow('Create token first...', function() { widCreateTab().show() } );

    if (!widIsPassword())
        return widModalWindow('Enter master key...', function() { $Pwd.focus() } );
	
    if (glLastRec.st !== 'OK' && glLastRec.st !== 'TKN_SNDNG')
        return widModalWindow('Token is unaccessible</br>or incorrect master key.', function() { $Pwd.focus() } );

    textArea($Area0).clear();
    textArea($Area1).clear();

    var k1,
    k2,
    g1,
    tkLine,
    rawTransKeys,
    prLine;

    if (!$SendType.prop('checked'))
    { // Simple Send
        if (glLastRec.st !== 'OK')
            return widCompleteEvent('Unavailable token!');

        k1 = engGetKey(glLastRec.n + 1, glLastRec.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
        k2 = engGetKey(glLastRec.n + 2, glLastRec.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
        tkLine = glLastRec.s + '\u0020' + k1 + '\u0020' + k2 + '\u0020';

        textArea($Area0).add(tkLine);

        rawTransKeys = $Area0.val().replace(/\s/g, '');
        prLine = engGetHash(rawTransKeys, 's22').substring(0, 4) + '\u0020' + glCurrentDB.altname + '\u0020' + '23132';

        textArea($Area0).add(prLine);

        return widCompleteEvent('OK');
    }

    if (glLastRec.st === 'OK')
    { // Blocking Send
        k1 = engGetKey(glLastRec.n + 1, glLastRec.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
        k2 = engGetKey(glLastRec.n + 2, glLastRec.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
        g1 = engGetKey(glLastRec.n + 2, glLastRec.s, k2, glCurrentDB.magic, glCurrentDB.hash);
        tkLine = glLastRec.s + '\u0020' + k1 + '\u0020' + g1 + '\u0020';
        textArea($Area0).add(tkLine);

        rawTransKeys = $Area0.val().replace(/\s/g, '');
        prLine = engGetHash(rawTransKeys, 's22').substring(0, 4) + '\u0020' + glCurrentDB.altname + '\u0020' + '23141';

        textArea($Area0).add(prLine);

        tkLine = glLastRec.s + '\u0020' + k2 + '\u0020';

        textArea($Area1).add(tkLine);

        rawTransKeys = $Area1.val().replace(/\s/g, '');
        prLine = engGetHash(rawTransKeys, 's22').substring(0, 4) + '\u0020' + glCurrentDB.altname + '\u0020' + '232';

        textArea($Area1).add(prLine);

        return widCompleteEvent('OK');
    }

    if (glLastRec.st === 'TKN_SNDNG')
    {
        textArea($Area0).clear();

        k2 = engGetKey(glLastRec.n + 1, glLastRec.s, glPassword, glCurrentDB.magic, glCurrentDB.hash);
        tkLine = glLastRec.s + '\u0020' + k2 + '\u0020';

        textArea($Area1).add(tkLine);

        rawTransKeys = $Area1.val().replace(/\s/g, '');
        prLine = engGetHash(rawTransKeys, 's22').substring(0, 4) + '\u0020' + glCurrentDB.altname + '\u0020' + '232';

        textArea($Area1).add(prLine);

        return widCompleteEvent('OK');
    }

}

function widReceiveTab()
{
	var $Tabs = $('#tabs_div');
    var $Table = $('#receive_table');
	var $Textarea = $Table.find('textarea');
	var $Button = $Table.find('button');

    return {
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
		isTransKeys: function () {
			return engIsRawTransKeys(textArea($Textarea).val());
		}
    }
}

function widReceiveTabButtonClick($obj)
{
	widPasswordOninput();
    $obj.toggleClass('tab-button-on tab-button-off');
    $('.tab-button-on').not($obj).toggleClass('tab-button-on tab-button-off');

    if (typeof glLastRec.st === 'undefined')
        return ($obj.hasClass('tab-button-on')) ? widReceiveTab().show() : widWelcomeTab().show();
	
    if (glLastRec.st === 'IDX_NODN')
        return ($obj.hasClass('tab-button-on')) ? widReceiveTab().show() : widCreateTab().show();
	
    return ($obj.hasClass('tab-button-on')) ? widReceiveTab().show() : widAssignDataTab().show();

}

function widReceiveButtonClick()
{
	var $TransKeysArea = $('#receive_textarea');
    var $Token = $('#token_text_textarea');	
	var $Pwd = $('password_input');
    var rawTransKeys = $('#receive_textarea').val();

    if (typeof glLastRec.st === 'undefined')
        return widModalWindow('Enter token name...', function() { $Token.focus() } );

    if (glLastRec.st === 'IDX_NODN')
        return widModalWindow('Token is free</br>You can assign it...', function() { widCreateTab().show() } );
    
	if (!widIsPassword())
        return widModalWindow('Enter master key...', function() { $Pwd.focus() } );
	
    if (!engIsRawTransKeys(rawTransKeys))
        return widModalWindow('Transkeys is missing or corrupt.</br>Enter correct keys...', function() { $TransKeysArea.focus() } );


    var tokText = [glLastRec.r];

    var transKeys = engGetTransKeys(rawTransKeys);
    var tok = engGetMergedTokensList(engGetHashedTokensList(transKeys), tokText, glCurrentDB.hash);
    tok = tok[0].replace(/\[|\]/g, '');

    var cb = function (data)
    {
        var r = engGetResp(data);
        if (r.msg !== 'OK')
            return widCompleteEvent(r.msg + ': ' + r.cnt);
        var lr = engGetRespLast(data);
        if (lr.msg === 'ERROR')
            return widCompleteEvent(lr.msg + ': ' + lr.cnt); //just in case
        var nr = engGetNewRecord(lr.n, lr.s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash);
        lr.st = engGetTokensStatus(lr, nr);
        /*
		if (lr.st === 'OK')
            return widCompleteEvent('Token already available!');
		*/
        transKeys[0].n = (transKeys[0].prcode == '232') ? lr.n - 1 : lr.n; // beacause '232' is code of the second step of the transfer process
        textArea($Token).clear(tok);

        widTokensTakeover(transKeys);
    }

    var cmd = 'last' + '\u0020' + glCurrentDB.name + '\u0020' + transKeys[0].s;

    var f = function ()
    {
        ajxSendCommand(cmd, cb, hasqLogo);
    }

    widShowLog('Receiving token...');
    setTimeout(f);
}

function widReceiveTextareaOninput()
{
	widToggleUI(glLastRec, glPassword);
}

function widSimpleReceive(keys)
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
        (resp.msg === 'ERROR') ? widCompleteEvent(resp.msg + ': ' + resp.cnt) : widTokenTextOninput();
    }

    var cb1 = function (data)
    {
        var resp = engGetResp(data);
        (resp.msg === 'ERROR') ? widCompleteEvent(resp.msg + ': ' + resp.cnt) : ajxSendCommand(addCmd2, cb2, hasqLogo);
    }

    ajxSendCommand(addCmd1, cb1, hasqLogo);
}

function widBlockingReceiveStep1(keys)
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
        (resp.msg === 'ERROR') ? widCompleteEvent(resp.msg + ': ' + resp.cnt) : widTokenTextOninput();
    }

    ajxSendCommand(addCmd, cb, hasqLogo);
}

function widBlockingReceiveStep2(keys)
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
        (resp.msg === 'ERROR') ? widCompleteEvent(resp.msg + ': ' + resp.cnt) : widTokenTextOninput();
    }

    ajxSendCommand(addCmd, cb, hasqLogo);
}

function widSearchTab()
{
    var $Table = $('#search_table');
	var $Button = $Table.find('button');
    var $Tabs = $('#tabs_div');

    return {
        disable : function (comm)
        {
			(comm) ? $Button.addClass('button-disabled').removeClass('button-enabled') : $Button.addClass('button-enabled').removeClass('button-disabled');			
        },
        show : function ()
        {
            $Tabs.tabs('option', 'active', 5);
        }
    }
}

function widSearchTabButtonClick($obj)
{
	widPasswordOninput();
    $obj.toggleClass('tab-button-on tab-button-off');
    $('.tab-button-on').not($obj).toggleClass('tab-button-on tab-button-off');

    if (typeof glLastRec.st == 'undefined')
        return ($obj.hasClass('tab-button-on')) ? widSearchTab().show() : widWelcomeTab().show();
	
    if (glLastRec.st == 'IDX_NODN')
        return ($obj.hasClass('tab-button-on')) ? widSearchTab().show() : widCreateTab().show();
	
    return ($obj.hasClass('tab-button-on')) ? widSearchTab().show() : widAssignDataTab().show();
}

function widSearchButtonClick()
{
	var $Pwd = $('#password_input');
    var $From = $('#from_datepicker_input');
    var $To = $('#to_datepicker_input');

    var fromDate = new Date($From.datepicker('getDate'));
    var toDate = new Date($To.datepicker('getDate'));

	if (!widIsPassword())
        return widModalWindow('Enter master key...', function() { $Pwd.focus() } );
	
    // needs to check correctness of specified date range if entered manually
    console.log(fromDate);
    console.log(toDate);
    var folders = engGetDateRangeFolders(fromDate, toDate);

    widCompleteEvent();
}


function widEmptyTab()
{
    var $Tabs = $('#tabs_div');
	widPasswordOninput();
	
    return {
        show: function ()
        {
            $Tabs.tabs('option', 'active', 6);
        }
    }
}