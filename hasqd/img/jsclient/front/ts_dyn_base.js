// Hasq Technology Pty Ltd ( C ) 2013-2016
function textArea( $textarea )
{
    return {
        add : function ( data )
        {
            return $textarea.val( this.val( $textarea ) + data );
        },
        set : function ( data )
        {
            return $textarea.val( data );
        },
        clear : function ( data )
        {
            data = data || '';
            return $textarea.val( data );
        },
        clearExcept : function ( $exceptTextarea )
        {
            return $( 'textarea' ).not( $exceptTextarea ).val( '' );
        },
        val : function ()
        {
            return $textarea.val();
        }
    }
}

function widSendPing( timeDelay )
{
    // Ping server every 5s,10s,15s,...,60s,...,60s,...
    var timerId = glPingTimerId;

    if ( timeDelay < 60000 )
    {
        timeDelay += 5000;
    }

    var cb = function ( data )
    {
        //var now = new Date();
        //var ct = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + '.' + now.getMilliseconds();
        if ( engGetResp( data ).msg !== 'OK' )
            return widShowLog( 'Server gave a suspicious response to the ping!' );
    }

    ajxSendCommand( 'ping', cb, hasqLogo )
    var ping = function ()
    {
        widSendPing( timeDelay )
    };
    glPingTimerId = setTimeout( ping, timeDelay );
    clearInterval( timerId );
}

function widButtonClick( obj )
{
    // Shared button click function
    var obj = $( obj );
    var f = obj.attr( 'data-onclick' );

    eval( f );
}

function widCompleteEvent( text )
{
    // Completes actions and enables UI

    if ( arguments.length == 0 )
        text = '&nbsp';
    return widShowLog( text );
}

function widSetDefaultDb( dbHash )
{
    // Searching for database and save it in variable.
    var cb = function ( d )
    {
        var db = engGetRespInfoDb( d );

        if ( db.length > 0 )
        {
            for ( var i = 0; i < db.length; i++ )
            {
                if ( db[i].hash === dbHash )
                {
                    glCurrentDB = db[i];
                    break;
                }
            }
        }

        if ( glCurrentDB.name === undefined )
        {
            widShowDBError();
        }
    }

    ajxSendCommand( 'info db', cb, hasqLogo );
}

function widShowDBError()
{
    // displays error message and blocks all UI;
    var warning = 'Database is not accessible!';
    alert( warning );
}

function widEmptyTab()
{
    var $Tabs = $( '#tabs_div' );
	var $Buttons = $( '.tab-buttons-table' ).find('.tab-button-on');
    return {
        show : function ()
        {
			$Buttons.toggleClass( 'tab-button-on tab-button-off' );			
            $Tabs.tabs( 'option', 'active', 0 );
        }
    }
}

function widDataTab()
{
    var $Textarea = $( '#setdata_textarea' );
    var $Table = $( '#setdata_table' );
    var $Tabs = $( '#tabs_div' );

    return {
        set : function ( data )
        {
            data = data || '';
            textArea( $Textarea ).set( data );
        },
        disable : function ( comm )
        {
            $Table.find( 'textarea' ).prop( 'readonly', comm );
            $Table.find( 'button' ).prop( 'disabled', comm );
        },
        show : function ()
        {
            if ( glLastRec.st == 'OK' )
                this.disable( false );
            $Tabs.tabs( 'option', 'active', 1 );
        }
    }
}

function widCreateTab()
{
    var $Table = $( '#create_table' );
    var $Tabs = $( '#tabs_div' );

    return {
        disable : function ( comm )
        {
            $Table.find( 'button' ).prop( 'disabled', comm );
        },
        show : function ()
        {
            $Tabs.tabs( 'option', 'active', 2 );
        }
    }
}

function widSendTab()
{
    var $Table = $( '#send_table' );
    var $Tabs = $( '#tabs_div' );

    return {
        disable : function ( comm )
        {
            $Table.find( 'button, input' ).prop( 'disabled', comm );
        },
        show : function ()
        {
            $Tabs.tabs( 'option', 'active', 3 );
        }
    }
}

function widReceiveTab()
{
    var $Table = $( '#receive_table' );
    var $Tabs = $( '#tabs_div' );

    return {
        disable : function ( comm )
        {
            $Table.find( 'textarea' ).prop( 'readonly', comm );
            $Table.find( 'button' ).prop( 'disabled', comm );
        },
        show : function ()
        {
            $Tabs.tabs( 'option', 'active', 4 );
        }
    }
}

function widSearchTab()
{
    var $Table = $( '#search_table' );
    var $Tabs = $( '#tabs_div' );

    return {
        disable : function ( comm )
        {
            $Table.find( 'button, input' ).prop( 'disabled', comm );
        },
        show : function ()
        {
            $Tabs.tabs( 'option', 'active', 5 );
        }
    }
}

function widDisableInitialDataUI( v )
{
    // Disables UI
    $( '#initial_data_table' ).find( 'input' ).prop( 'disabled', v ); //closest( 'table[id^="initial"]' ).
}

function widDisableTabsUI( v )
{
    // To enable/disable specified selectors into the tabs area
    $( '#tabs_div' ).find( 'button, input' ).prop( 'disabled', v );
}

function widShowPwdGuessTime( d )
{
    // Shows password guess time
    var jqZxcvbn = $( '#password_zxcvbn_td' );

    if ( arguments.length > 0 && d != undefined )
    {
        jqZxcvbn.html( d );
    }
    else
    {
        jqZxcvbn.empty();
    }
}

function widShowToken( tok )
{
    // Shows hashed value of token ( if the value is not a default hash )
    var jqTokText = $( '#token_hash_td' );
    if ( arguments.length == 0 || typeof tok == 'undefined' )
        return jqTokText.empty();
    if ( tok.length == 0 )
        return widShowToken();

    jqTokText.html( widGetToken( tok, glCurrentDB.hash ) );
}

function widShowLog( text )
{
    // Shows messages in log
    var jqLog = $( '#' + 'tokens_log_div' );
    text = text || '';
    jqLog.html( text );
}

function widShowTokenSearchProcess()
{ // Shows message or image about tokens existense.
    var $Pic = $( '#token_pic_span' );
    $Pic.hide();
    widShowLog();

    return {
        show : function ( d )
        {
            if ( typeof d == 'undefined' )
            {
                $Pic.show();
                return widShowLog( 'Searching for token...' );
            }

            ( d ) ? widShowLog( 'Token exists.' ) : widShowLog( 'No such token.' );
        }
    }
}

function widIsPassword()
{
    return ( $( '#password_input' ).val().length > 0 );
}

function widIsTokenText()
{
    return ( $( '#token_text_textarea' ).val().length > 0 );
}

function widGetToken( data, hash )
{
    //Returns hash of raw tokens value or
    return ( engIsHash( data, hash ) ) ? data : engGetHash( data, hash );
}

function widGetTokenStatus( lr, nr )
{
    if ( lr.msg === 'IDX_NODN' )
        return lr.msg;
    switch ( engGetTokensStatus( lr, nr ) )
    {
    case 1:
        return 'OK';
    case 2:
        return 'TKN_SNDNG';
    case 3:
        return 'TKN_RCVNG';
    default: //case 0:
        return 'WRONG_PWD';
    }
}

function widGetTokenStateImg( status )
{
    // Returns an image displaying the password match
    var r = {};

    switch ( status )
    {
    case 'OK':
        r.img = imgTknOk;
        r.title = 'OK';
        break;
    case 'TKN_SNDNG':
        r.img = imgTknSndng;
        r.title = 'Token is locked ( sending )';
        break;
    case 'TKN_RCVNG':
        r.img = imgTknRcvng;
        r.title = 'Token is locked ( receiving )';
        break;
    case 'WRONG_PWD': //'WRONG_PWD'
        r.img = imgTknWrong;
        r.title = 'Token locked ( wrong password )';
        break;
    default:
        r.img = imgPwdDummy;
        r.title = '';
        break;
    }
    return r;
}

function widShowPwdMatch( status )
{
    // Shows an image displaying the password match
    var objT = $( '#password_pic_span' );
    var objI = $( '#password_input' );

    var r = widGetTokenStateImg( status );

    objT.find( 'img' ).attr( 'src', r.img );
    objT.find( 'img' ).prop( 'title', r.title );
}

function widGetPwdGuessTime( pwd )
{
    // Returns guess time of specified password
    return 'Guess time: ' + zxcvbn( pwd ).crack_times_display.offline_slow_hashing_1e4_per_second;
}

function widTokenTextOninput()
{
    // Events when tokens value changed.
    clearTimeout( glTimerId );
    widEmptyTab().show();
    widShowPwdMatch();
    widShowTokenSearchProcess();

    glLastRec = {};

    var $TokText = $( '#token_text_textarea' );
    textArea().clearExcept( $TokText );
    var tok = widGetToken( textArea( $TokText ).val(), glCurrentDB.hash );
    widShowToken( tok );

    var cb = function ( data )
    {
        var resp = engGetResp( data );
        widShowTokenSearchProcess();
        if ( resp.msg === 'ERROR' )
            return widShowLog( resp.msg + ': ' + data );

        if ( resp.msg === 'IDX_NODN' )
        {
            glLastRec.st = 'IDX_NODN';
            glLastRec.s = tok;
            widCreateTab().show();
            widShowTokenSearchProcess().show( false );
        }
        else
        {
            glLastRec = engGetRespLast( data );
            var nr = engGetNewRecord( glLastRec.n, glLastRec.s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash );
            glLastRec.st = widGetTokenStatus( glLastRec, nr );
            widDataTab().set( engGetOutputDataValue( glLastRec.d ) );
            widDataTab().show();
            widShowTokenSearchProcess().show( true );
        }

        glLastRec.r = ( textArea( $TokText ).val() !== tok ) ? textArea( $TokText ).val() : '';
        widPasswordOninput(); //updates info about last records and password matching
    }

    if ( tok.length > 0 )
    {
        widShowTokenSearchProcess().show();
        var cmd = 'last' + '\u0020' + glCurrentDB.name + '\u0020' + tok;
        engSendDeferredRequest( cmd, 1000, cb );
    }
}

function widPasswordOninput()
{
    // Events when passwords value changed.
    widDataTab().disable( true );
    widCreateTab().disable( true );
    widSendTab().disable( true );
    widReceiveTab().disable( true );
    widSearchTab().disable( true );
	
    var $Pwd = $( '#password_input' );
    glPassword = $Pwd.val() || '';

    if ( glPassword.length > 0 )
    {
        widSearchTab().disable( false );
        widShowPwdGuessTime( widGetPwdGuessTime( glPassword ) );

        if ( typeof glLastRec.st === 'undefined' )
            return;
        if ( glLastRec.st === 'IDX_NODN' )
            return widCreateTab().disable( false );

        var nr = engGetNewRecord( glLastRec.n, glLastRec.s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash );
        glLastRec.st = widGetTokenStatus( glLastRec, nr );
        widShowPwdMatch( glLastRec.st );

        if ( glLastRec.st == 'TKN_SNDNG' )
            return widSendTab().disable( false );
		
        if ( glLastRec.st == 'WRONG_PWD' || glLastRec.st == 'TKN_RCVNG' )
            return widReceiveTab().disable( false );
		
        if ( glLastRec.st == 'OK' )
        {
            widDataTab().disable( false );
            widSendTab().disable( false );
            widReceiveTab().disable( true );
        }
    }
    else
    {
        widShowPwdMatch();
        widShowPwdGuessTime();

        if ( typeof glLastRec.st === 'undefined' )
            return;
		
        if ( glLastRec.st !== 'IDX_NODN' )
            glLastRec.st = 'WRONG_PWD';
    }
}

function widPasswordEyeClick( jqEye )
{
    //shows/hides passwords	by click;
    var jqPwd = $( '#password_input' );
    if ( jqPwd.attr( 'type' ) == 'text' )
    {
        jqPwd.attr( 'type', 'password' );
        jqEye.find( 'img' ).attr( 'src', imgEyeOpen );
        jqEye.attr( 'title', 'Unmask password' );
    }
    else
    {
        jqPwd.attr( 'type', 'text' );
        jqEye.find( 'img' ).attr( 'src', imgEyeClosed );
        jqEye.attr( 'title', 'Mask password' );
    }
}

function widCreateButtonClick()
{
    // Creates a new token record
    widEmptyTab().show();
    var jqPwd = $( '#password_input' );

    if ( typeof glLastRec.st === 'undefined' )
        return widCompleteEvent( 'Empty token text!' );
    if ( glLastRec.st !== 'IDX_NODN' )
        return widCompleteEvent( 'Token already exists.' );
    if ( !widIsPassword() )
        return widCompleteEvent( 'Empty master key!' );

    var nr = engGetNewRecord( 0, glLastRec.s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash );
    var nr_d = ( glLastRec.r.length > 0 && glLastRec.r.length <= 160 && glLastRec.r !== glLastRec.s ) ? '[' + glLastRec.r + ']' : '';
    var cmd = 'z *' + '\u0020' + glCurrentDB.name + '\u0020' + '0' + '\u0020' + glLastRec.s + '\u0020' + nr.k + '\u0020' + nr.g + '\u0020' + nr.o + '\u0020' + nr_d;

    var cb = function ( data )
    {
        var r = engGetResp( data );
        if ( r.msg == 'OK' )
        {
            widCompleteEvent( r.msg );
            widTokenTextOninput(); //update token info after create;
        }
        else
        {
            widCompleteEvent( r.msg + ': ' + r.cnt );
        }
    }

    var f = function ()
    {
        ajxSendCommand( cmd, cb, hasqLogo );
    }

    setTimeout( f, 1000 );
    widShowLog( 'Creating token...' );
}

function widSetDataButtonClick()
{
    // Adds a new record with a specified data
    var jqPwd = $( '#password_input' );
    var jqData = $( '#setdata_textarea' );

    if ( typeof glLastRec.st === 'undefined' )
        return widCompleteEvent( 'Empty token text!' );
    if ( glLastRec.st === 'IDX_NODN' )
        return widCompleteEvent( 'First create a token!' );
    if ( !widIsPassword() )
        return widCompleteEvent( 'Empty master key!' );
    if ( glLastRec.st !== 'OK' )
        return widCompleteEvent( 'Incorrect master key - token is unavailable!' );

    var nr = engGetNewRecord( glLastRec.n + 1, glLastRec.s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash );
    var nr_d = engGetInputDataValue( jqData.val() );
    var cmd = 'add * ' + glCurrentDB.name + '\u0020' + nr.n + '\u0020' + glLastRec.s + '\u0020' + nr.k + '\u0020' + nr.g + '\u0020' + nr.o + '\u0020' + nr_d;

    var cb = function ( d )
    {
        var r = engGetResp( d );
        if ( r.msg == 'OK' )
        {
            widTokenTextOninput();
            return widCompleteEvent( r.msg );
        }

        return widCompleteEvent( r.msg + ': ' + r.cnt );
    }

    var f = function ()
    {
        ajxSendCommand( cmd, cb, hasqLogo );
    }

    widShowLog( 'Giving token data...' );
    setTimeout( f );
}

function widShowKeysButtonClick()
{
    var jqPwd = $( '#password_input' );
    var jqArea0 = $( '#send_simple_textarea' );
    var jqArea1 = $( '#send_blocking_textarea' );
    var jqSendType = $( '#send_type_checkbox' );

    if ( typeof glLastRec.st === 'undefined' )
        return widCompleteEvent( 'Empty token text!' );
    if ( glLastRec.st === 'IDX_NODN' )
        return widCompleteEvent( 'First create a token!' );
    if ( !widIsPassword() )
        return widCompleteEvent( 'Empty master key!' );
    if ( glLastRec.st !== 'OK' && glLastRec.st !== 'TKN_SNDNG' )
        return widCompleteEvent( 'Unavailable token!' );

    textArea( jqArea0 ).clear();
    textArea( jqArea1 ).clear();

    var k1,
    k2,
    g1,
    tkLine,
    rawTransKeys,
    prLine;

    if ( !jqSendType.prop( 'checked' ) )
    { // Simple Send
        if ( glLastRec.st !== 'OK' )
            return widCompleteEvent( 'Unavailable token!' );

        k1 = engGetKey( glLastRec.n + 1, glLastRec.s, glPassword, glCurrentDB.magic, glCurrentDB.hash );
        k2 = engGetKey( glLastRec.n + 2, glLastRec.s, glPassword, glCurrentDB.magic, glCurrentDB.hash );
        tkLine = glLastRec.s + '\u0020' + k1 + '\u0020' + k2 + '\u0020';

        textArea( jqArea0 ).add( tkLine );

        rawTransKeys = jqArea0.val().replace( /\s/g, '' );
        prLine = engGetHash( rawTransKeys, 's22' ).substring( 0, 4 ) + '\u0020' + glCurrentDB.altname + '\u0020' + '23132';

        textArea( jqArea0 ).add( prLine );

        return widCompleteEvent( 'OK' );
    }

    if ( glLastRec.st === 'OK' )
    { // Blocking Send
        k1 = engGetKey( glLastRec.n + 1, glLastRec.s, glPassword, glCurrentDB.magic, glCurrentDB.hash );
        k2 = engGetKey( glLastRec.n + 2, glLastRec.s, glPassword, glCurrentDB.magic, glCurrentDB.hash );
        g1 = engGetKey( glLastRec.n + 2, glLastRec.s, k2, glCurrentDB.magic, glCurrentDB.hash );
        tkLine = glLastRec.s + '\u0020' + k1 + '\u0020' + g1 + '\u0020';
        textArea( jqArea0 ).add( tkLine );

        rawTransKeys = jqArea0.val().replace( /\s/g, '' );
        prLine = engGetHash( rawTransKeys, 's22' ).substring( 0, 4 ) + '\u0020' + glCurrentDB.altname + '\u0020' + '23141';

        textArea( jqArea0 ).add( prLine );

        tkLine = glLastRec.s + '\u0020' + k2 + '\u0020';

        textArea( jqArea1 ).add( tkLine );

        rawTransKeys = jqArea1.val().replace( /\s/g, '' );
        prLine = engGetHash( rawTransKeys, 's22' ).substring( 0, 4 ) + '\u0020' + glCurrentDB.altname + '\u0020' + '232';

        textArea( jqArea1 ).add( prLine );

        return widCompleteEvent( 'OK' );
    }

    if ( glLastRec.st === 'TKN_SNDNG' )
    {
        textArea( jqArea0 ).clear();

        k2 = engGetKey( glLastRec.n + 1, glLastRec.s, glPassword, glCurrentDB.magic, glCurrentDB.hash );
        tkLine = glLastRec.s + '\u0020' + k2 + '\u0020';

        textArea( jqArea1 ).add( tkLine );

        rawTransKeys = jqArea1.val().replace( /\s/g, '' );
        prLine = engGetHash( rawTransKeys, 's22' ).substring( 0, 4 ) + '\u0020' + glCurrentDB.altname + '\u0020' + '232';

        textArea( jqArea1 ).add( prLine );

        return widCompleteEvent( 'OK' );
    }

}

function widReceiveButtonClick()
{
    var rawTransKeys = $( '#receive_textarea' ).val();
    var jqTok = $( '#token_text_textarea' );

    if ( !engIsRawTransKeys( rawTransKeys ) )
        return widCompleteEvent( 'Bad TransKeys!' );
    if ( !widIsPassword )
        return widCompleteEvent( 'Empty password!' );

    var tokText = [glLastRec.r]

    var transKeys = engGetTransKeys( rawTransKeys );
    var tok = engGetMergedTokensList( engGetHashedTokensList( transKeys ), tokText, glCurrentDB.hash );
    tok = tok[0].replace( /\[|\]/g, '' );

    var cb = function ( data )
    {
        var r = engGetResp( data );
        if ( r.msg !== 'OK' )
            return widCompleteEvent( r.msg + ': ' + r.cnt );
        var lr = engGetRespLast( data );
        if ( lr.msg === 'ERROR' )
            return widCompleteEvent( lr.msg + ': ' + lr.cnt ); //just in case
        var nr = engGetNewRecord( lr.n, lr.s, glPassword, null, null, glCurrentDB.magic, glCurrentDB.hash );
        lr.st = widGetTokenStatus( lr, nr );
        if ( lr.st === 'OK' )
            return widCompleteEvent( 'Token already available!' );
        transKeys[0].n = ( transKeys[0].prcode == '232' ) ? lr.n - 1 : lr.n; // beacause '232' is code of the second step of the transfer process
        textArea( jqTok ).clear( tok );

        widTokensTakeover( transKeys );
    }

    var cmd = 'last' + '\u0020' + glCurrentDB.name + '\u0020' + transKeys[0].s;

    var f = function ()
    {
        ajxSendCommand( cmd, cb, hasqLogo );
    }

    widShowLog( 'Receiving token...' );
    setTimeout( f, 1000 );
}

function widTokensTakeover( keys )
{
    keys = engGetTitleKeys( keys, glPassword, glCurrentDB.hash, glCurrentDB.magic );
    switch ( keys[0].prcode )
    {
    case '23132':
        widSimpleReceive( keys );
        break;
    case '23141':
        widBlockingReceiveStep1( keys );
        break;
    case '232':
        widBlockingReceiveStep2( keys );
        break;
    default:
        return widCompleteEvent( 'Bad TransKeys!' );
    }
}

function widSimpleReceive( keys )
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

    var cb2 = function ( data )
    {
        var resp = engGetResp( data );
        ( resp.msg === 'ERROR' ) ? widCompleteEvent( resp.msg + ': ' + resp.cnt ) : widTokenTextOninput();
    }

    var cb1 = function ( data )
    {
        var resp = engGetResp( data );
        ( resp.msg === 'ERROR' ) ? widCompleteEvent( resp.msg + ': ' + resp.cnt ) : ajxSendCommand( addCmd2, cb2, hasqLogo );
    }

    ajxSendCommand( addCmd1, cb1, hasqLogo );
}

function widBlockingReceiveStep1( keys )
{
    var n1 = keys[0].n + 1;
    var s = keys[0].s;
    var k1 = keys[0].k1;
    var g1 = keys[0].g1;
    var o1 = keys[0].o1;

    var addCmd = 'add * ' + glCurrentDB.name + ' ' + n1 + ' ' + s + ' ' + k1 + ' ' + g1 + ' ' + o1;

    var cb = function ( data )
    {
        var resp = engGetResp( data );
        ( resp.msg === 'ERROR' ) ? widCompleteEvent( resp.msg + ': ' + resp.cnt ) : widTokenTextOninput();
    }

    ajxSendCommand( addCmd, cb, hasqLogo );
}

function widBlockingReceiveStep2( keys )
{
    var n2 = keys[0].n + 2;
    var s = keys[0].s;
    var k2 = keys[0].k2;
    var g2 = keys[0].g2;
    var o2 = keys[0].o2;

    var addCmd = 'add * ' + glCurrentDB.name + ' ' + n2 + ' ' + s + ' ' + k2 + ' ' + g2 + ' ' + o2;

    var cb = function ( data )
    {
        var resp = engGetResp( data );
        ( resp.msg === 'ERROR' ) ? widCompleteEvent( resp.msg + ': ' + resp.cnt ) : widTokenTextOninput();
    }

    ajxSendCommand( addCmd, cb, hasqLogo );
}

function widSearchButtonClick()
{
    var jqFrom = $( '#from_datepicker_input' );
    var jqTo = $( '#to_datepicker_input' );

    var fromDate = new Date( jqFrom.datepicker( 'getDate' ) );
    var toDate = new Date( jqTo.datepicker( 'getDate' ) );

    // needs to check correctness of specified date range if entered manually
    console.log( fromDate );
    console.log( toDate );
    var folders = engGetDateRangeFolders( fromDate, toDate );

    widCompleteEvent();
}

function widSendTabButtonClick( $obj )
{
    if ( glLastRec.st == 'WRONG_PWD' && $obj.hasClass( 'tab-button-on' ) ) 
	{
		$obj.toggleClass( 'tab-button-on tab-button-off' );
		return widDataTab().show();
	}
	
    if ( glLastRec.st == 'OK' || glLastRec.st == 'TKN_SNDNG' )
    {
        $obj.toggleClass( 'tab-button-on tab-button-off' );
        $( '.tab-button-on' ).not( $obj ).toggleClass( 'tab-button-on tab-button-off' );
		
        return ( $obj.hasClass( 'tab-button-on' ) ) ? widSendTab().show() : widDataTab().show();
    }
}

function widReceiveTabButtonClick( $obj )
{
    if ( glLastRec.st == 'OK' && $obj.hasClass( 'tab-button-on' ) )
	{
		$obj.toggleClass( 'tab-button-on tab-button-off' );
		return widDataTab().show();
	}	
	
	if ( typeof glLastRec.st == 'undefined' ) 
	{
		$obj.toggleClass( 'tab-button-on tab-button-off' );
		$( '.tab-button-on' ).not( $obj ).toggleClass( 'tab-button-on tab-button-off' );
        return ( $obj.hasClass( 'tab-button-on' ) ) ? widReceiveTab().show() : widEmptyTab().show();		
	}
	
    if ( glLastRec.st == 'WRONG_PWD' || glLastRec.st == 'TKN_RCVNG' )
	{
		$obj.toggleClass( 'tab-button-on tab-button-off' );
		$( '.tab-button-on' ).not( $obj ).toggleClass( 'tab-button-on tab-button-off' );
        return ( $obj.hasClass( 'tab-button-on' ) ) ? widReceiveTab().show() : widDataTab().show();		
	}

}

function widSearchTabButtonClick( $obj )
{
    $obj.toggleClass( 'tab-button-on tab-button-off' );
    $( '.tab-button-on' ).not( $obj ).toggleClass( 'tab-button-on tab-button-off' );

    if ( typeof glLastRec.st == 'undefined' )
        return ( $obj.hasClass( 'tab-button-on' ) ) ? widSearchTab().show() : widEmptyTab().show();
	
    if ( glLastRec.st == 'IDX_NODN' )
        return ( $obj.hasClass( 'tab-button-on' ) ) ? widSearchTab().show() : widCreateTab().show();
	
    return ( $obj.hasClass( 'tab-button-on' ) ) ? widSearchTab().show() : widDataTab().show();
}
