// Hasq Technology Pty Ltd ( C ) 2013-2016

function widGetHTMLSpanImg( id, func ) {
	var r = '';
	if ( arguments.length > 1 ) {
		r += '<span id="' + id + '" onclick="' + func +'" align="center" valign="middle"><img src=""></img></span>\n';
	} else {
		r += '<span id="' + id + '" align="center" valign="middle"><img src=""></img></span>\n';
	}

    return r;
}


function widGetHTMLSpan( id, func ) {
	var r = '';
	if ( arguments.length > 1 ) {
		r += '<span align="center" valign="middle" id="' + id + '" onclick="' + func +'"></span>\n';
	} else {
		r += '<span align="center" valign="middle" id="' + id + '"></span>\n';;
	}

    return r;
}

function widGetHTMLBody( tabs ) {
	var r = '';
    r += '<table width="100%" id="body_table" border="0" nowrap>\n';
		r += '<tr>\n';
			r += '<td colspan="2" align="left" nowrap>\n';
				r += widGetHTMLTitleArea();
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td colspan="2" nowrap>';
				r += widGetHTMLTokenTextArea() + '\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td colspan="2" nowrap>';
				r += '<table width="100%" style="border: 1px solid #DDDDDD;">';
					r += '<tr>\n';
						r += '<td valign="top" />\n';
							r += widGetHTMLMainTabs( tabs ) + '\n';
						r += '<td width="74" align="right" valign="top" />'
							r += widGetHTMLButtonsArea() + '\n';
					r += '</tr>\n';
				r += '</table>';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td />\n';
				r += widGetHTMLLogArea() + '\n';
			r += '<td class="td-subscribe" width="160" nowrap>\n';
				r += 'Powered by ' + '<a href="http://hasq.org">' + 'Hasq Technology' + '</a>' + '<sup>\u00A9</sup>' + '2016';
		r += '</tr>\n';		
    r += '</table>\n';
    return r;
}


function widGetHTMLTitleArea() {
	var r = '';
	r += '<table width="100%" border="0">';
		r += '<tr>';
			r += '<td class="td-title"/>';
				r += '<span>\n' + glClientTitle + '</span>\n';
			r += '<td width="30" height="30" align="center" valign="middle">';
				r += widGetHTMLSpanImg( 'logo_span', 'widSendPing( 5000 )' ) + '\n';
		r += '<tr>';
	r += '</table>';
	
	return r;
}

function widGetHTMLTokenTextArea() {
	var r = '';
	r += '<table width="100%" style="border: 0px solid #DDDDDD;">';
		r += '<tr>';
			r += '<td class="td-subtitle" align="center"/>';
				r += '<b>Token name<b>';
		r += '</tr>';
		
		r += '<tr>';
			r += '<td align="center" nowrap>\n';
					r += '<textarea oninput="widTokenTextOninput();" id="token_text_textarea" type="text" rows="2" maxlength="65536" placeholder="Enter token text" required></textarea>\n';
		r += '</tr>';
		
		r += '<tr>';
			r += '<td align="left" class="td-info">';
				r += '<table>';
					r += '<tr>';
						r += '<td width="20" height="20" valign="center" title="Update token info"/>';
							r += widGetHTMLSpanImg( 'reload_span', 'widTokenTextOninput()' );
						r += '<td nowrap/>\n';
							r += 'Token hash:&nbsp\n';
						r += '<td width="280" id="token_hash_td" nowrap/>';
						r += '<td width="20" height="20" />\n';
							r += widGetHTMLSpanImg( 'token_pic_span', 'widTokenTextOninput()' );
					r += '</tr>';
				r += '</table>';
		r += '</tr>';
		r += '<tr>';
			r += '<td class="td-subtitle"/>';
				r += 'Master key';
		r += '</tr>';
		r += '<tr>';
			r += '<td align="center">';
				r += '<table border="0">';
					r += '<tr>';
						r += '<td width="20" valign="center" align="center">';
							r += widGetHTMLSpanImg( 'password_eye_span', 'widPasswordEyeClick( $( this ) )' );
						r += '<td width="250"/>\n';
							r += '<input oninput="widPasswordOninput( $( this ) );" id="password_input" type="password" class="password" placeholder="Enter token master key" required/>\n';
						r += '<td width="20" valign="center">';
							r += widGetHTMLSpanImg( 'password_pic_span' );						
					r += '</tr>';
					r += '<tr>';
						r += '<td width="20"/>&nbsp';
						r += '<td id="password_zxcvbn_td" align="left" style="font-style: italic"/>\n';
						r += '<td/>';
					r += '</tr>';					
				r += '</table>';
		r += '</tr>';		
		
	r += '</table>';
	return r;
}

function widGetHTMLMasterKeyArea() {
	var r = '';
	r += '<table width="100%" style="border: 1px solid #DDDDDD;">';
		r += '<tr>';
			r += '<td class="td-subtitle"/>';
				r += 'Master key';
		r += '</tr>';
		r += '<tr>';
			r += '<td align="center">';
				r += '<table border="0">';
					r += '<tr>';
						r += '<td width="20" valign="center" align="center">';
							r += widGetHTMLSpanImg( 'password_eye_span', 'widPasswordEyeClick( $( this ) )' );
						r += '<td width="250"/>\n';
							r += '<input oninput="widPasswordOninput( $( this ) );" id="password_input" type="password" class="password" placeholder="Enter token master key" required/>\n';
						r += '<td width="20" valign="center">';
							r += widGetHTMLSpanImg( 'password_pic_span' );						
					r += '</tr>';
					r += '<tr>';
						r += '<td width="20"/>&nbsp';
						r += '<td id="password_zxcvbn_td" align="left" style="font-style: italic"/>\n';
						r += '<td/>';
					r += '</tr>';					
				r += '</table>';
		r += '</tr>';
	r += '</table>';
	return r;
}

function widGetHTMLEmptyTab() {
	var r ='';
	r += '<table width="100%" border="0">';
		r += '<tr>';
			r += '<td class="welcome-p" />';
				r += '<p>';
					r += 'Welcome to TokenSwap. This is a place where you can create your own tokens, ';
					r += 'associate data with them, pass the ownership to another person, or to receive';
					r += 'the ownership from somebody else. A token is a hash taken from any text or file. ';
					r += 'The master key is a secure password to control your tokens. It is not shared if ';
					r += 'you pass your token to another person.';
				r += '</p>';
		r += '</tr>';
	r += '</table>';	
	return r;
}

function widGetHTMLButtonsArea() {
	var r = '';
	r += '<table class="tab-buttons-table">';
		r += '<tr>';
			r += '<td/>';
				r += '<button id="show_send_tab_button" class="tab-button-off" onclick="return widSendTabButtonClick( $( this ) );">' + imgBtnSend + '</button>';
		r += '</tr>';		
		r += '<tr>';
			r += '<td/>';
				r += '<button id="show_receive_tab_button" class="tab-button-off" onclick="return widReceiveTabButtonClick( $( this ) );">' + imgBtnReceive + '</button>';
		r += '</tr>';
		r += '<tr>';
			r += '<td/>';
				r += '<button id="show_search_tab_button" class="tab-button-off" onclick="return widSearchTabButtonClick( $( this ) );">' + imgBtnSearch + '</button>';
		r += '</tr>';		
	r += '</table>';
	return r;	
}


function widGetHTMLInitialData() {
	var r = '';
	
	r += '<div class="initial-data-div">';
	
	r += '<table id="initial_data_table" width="100%" border="0" style="border: 1px solid #DDDDDD;">';
		r += '<tr>';
			r += '<td align="center" style="font-size:16">';
				r += '<b>Token text<b>';
		r += '</tr>';
		r += '<tr>';
			r += '<td align="left" nowrap>\n';
					r += '<textarea oninput="return widTokenTextOninput();" id="token_text_textarea" type="text" rows="1" maxlength="65536" placeholder="Enter token text" required></textarea>\n';
					r += '</tr>';
		r += '<tr>';
			r += '<td align="right" class="token-hash">';
				r += '<table>';
					r += '<tr>';
					    r += '<td width="20" align="center" valign="center">' + widGetHTMLSpan( 'reload_span', 'widTokenTextOninput()' );
						r += '<td width="95" align="right" nowrap>\n';
							r += '<i>Token hash:&nbsp</i>\n';
						r += '<td width="270" id="token_hash_td" colspan="2" align="left" style="font-style: italic;" nowrap>';
						r += '<td width="20" id="token_pic_span" align="right" valign="center">\n';
					r += '</tr>';
				r += '</table>';
		r += '</tr>';
		r += '<tr>';
			r += '<td align="center" style="font-size:16">';
				r += '<b>Master key<b>';
		r += '</tr>';
		r += '<tr>';
			r += '<td align="center">';
				r += '<table border="0">';
					r += '<tr>';
						r += '<td width="20" valign="center" align="center">' + widGetHTMLSpan( 'password_eye_span', 'widPasswordEyeClick( $( this ) )' );
						r += '<td width="250">\n';
							r += '<input oninput="return widPasswordOninput();" id="password_input" type="password" class="password" placeholder="Enter token master key" required/>\n';
						r += '<td width="20" valign="center" id="password_pic_span">\n';
					r += '</tr>';
					r += '<tr>';
						r += '<td>&nbsp';
						r += '<td id="password_zxcvbn_td" align="right" style="font-style: italic">\n';
						r += '<td>&nbsp';
					r += '</tr>';					
				r += '</table>';
		r += '</tr>';

	return r;
}

function widGetHTMLMainTabs( items ) {
    var r = '';

    r += '<div id="tabs_div" class="tabs-div">\n';
    r += '\t<ul>\n';

    for ( var i = 0; i < items.length; i++ ) {
        r += '\t<li><a href="#tabs_' + ( i + 1 ) + '_div">' + items[i].title + '</a>\n';
	}
	
    r += '\t</ul>\n';

    for ( var i = 0; i < items.length; i++ ) {
        r += '\t<div id="tabs_' + ( i + 1 ) + '_div">' + items[i].data + '</div>\n';
	}
	
    r += '</div>\n';

    return r;
}

function widGetHTMLSetDataTab() {
	var r = '';
	
	r += '<table id="setdata_table" width="100%" border="0">\n';
		r += '<tr>\n';
			r += '<td height="10">\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td class="td-subtitle" align="center" />\n';
				r += 'Token data';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td align="center">\n';
				r += '<textarea id="setdata_textarea" oninput="return widTokenDataTextareaOninput($(this))" type="text" rows="4" cols="64"></textarea>';
		r += '</tr>\n';
		r += '<tr>\n';				
			r += '<td width="74" align="center">\n'
				r += '<button id="setdata_button" onclick="return widButtonClick( this );" data-onclick="widSetDataButtonClick()">' + imgBtnData;
		r += '</tr>\n';
	r += '</table>\n';
	
	return r;
}

function widGetHTMLCreateTab() {
	var r = '';
	
	r += '<table id="create_table" width="100%">\n';
		r += '<tr>\n';
			r += '<td height="10">\n';
		r += '</tr>\n';	
		r += '<tr>\n';
			r += '<td class="td-subtitle" align="center" colspan="2" >\n';
				r += 'Create new token';
		r += '</tr>\n';	
		r += '<tr>\n';
			r += '<td align="center">\n'
				r += '<button id="create_button" onclick="return widButtonClick( this );" data-onclick="widCreateButtonClick()">' + imgBtnCreate + '</button>';
		r += '</tr>\n';
	r += '</table>\n';
	
	return r;
}

function widGetHTMLSendTab() {
	var r = '';
	
	r += '<table id="send_table" width="100%" border="0">\n';
		r += '<tr>\n';
			r += '<td height="10" />\n';
		r += '</tr>\n';	
		r += '<tr>\n';
			r += '<td class="td-subtitle" align="center" >\n';
				r += 'Give away token';
		r += '</tr>\n';	
		r += '<tr>\n';
			r += '<td align="center" />\n';
				r += '<button id="show_keys_button" onclick="return widButtonClick( this )" data-onclick="widShowKeysButtonClick()">Show keys</button>';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td align="center" />\n';
				r += '<input type="checkbox" id="send_type_checkbox">';
				r += '<label for="send_type_checkbox" style="font:70% monospace"><i>Blocking</i></label>\n';	
		r += '</tr>\n';			
		r += '<tr>\n';				
			r += '<td rowspan="2" />\n';
				r += '<table width="100%">';
					r += '<tr>';
						r += '<td />';
							r += '<textarea class="textarea-transkeys" wrap="on" rows="3" type="text" id="send_simple_textarea" readonly></textarea>';
					r += '</tr>';
					r += '<tr>';
						r += '<td />';
							r += '<textarea class="textarea-transkeys" wrap="on" rows="3" type="text" id="send_blocking_textarea" readonly></textarea>';
					r += '</tr>';					
				r += '</table>';
		r += '</tr>\n';
	r += '</table>\n';
	
	return r;	
}

function widGetHTMLReceiveTab() {
	var r = '';
	
	r += '<table id="receive_table" width="100%" border="0" >\n';
		r += '<tr>\n';
			r += '<td height="10" />\n';
		r += '</tr>\n';	
		r += '<tr>\n';
			r += '<td class="td-subtitle" align="center" />\n';
				r += 'Receive token';
		r += '</tr>\n';	
		r += '<tr>\n';
			r += '<td align="center">\n'
				r += '<textarea id="receive_textarea" type="text" rows="4" cols="64" maxlength="65536" wrap="on" required></textarea>';
		r += '</tr>\n';	
		r += '<tr>\n';				
			r += '<td width="74" style="text-align: center">\n';
				r += '<button id="receive_button" onclick="return widButtonClick( this )" data-onclick="widReceiveButtonClick()">Receive';
		r += '</tr>\n';
	r += '</table>\n';

	return r;	
}

function widGetHTMLSearchTab() {
	var r = '';
	r += '<table id="search_table" align="center" border="0">\n';
		r += '<tr>\n';
			r += '<td height="10" />\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td class="td-subtitle" align="center" />\n';
				r += 'View my token';
		r += '</tr>\n';	
		r += '<tr>\n';
			r += '<td>\n';	
				r += '<label for="from_date">From:</label>';
				r += '<input id="from_datepicker_input" name="from_date">\n';
				r += '<label for="to_date">to:</label>';
				r += '<input id="to_datepicker_input" name="to_date">\n';
		r += '</tr>\n';		
		r += '<tr>\n';				
			r += '<td>\n';
				r += '<button id="search_button" onclick="return widButtonClick( this );" data-onclick="widSearchButtonClick()">Search';
		r += '</tr>\n';		
	r += '</table>\n';	
	return r;	
}


function widGetHTMLLogArea() {
    var r = '';
	r += '<table width="100%">';
		r += '<tr>';
			r += '<td/>';
				r += '<div id="tokens_log_div" class="div-log-area" >&nbsp</div>\n';
		r += '</tr>';		
	r += '</table>';
    return r;
}
