// Hasq Technology Pty Ltd (C) 2013-2016

function widGetHTMLSpan(span_id, func) {
	var r = '';
	if ( arguments.length > 1 ) {
		r += '<span align="center" valign="middle" id="' + span_id + '" onclick="' + func +'"></span>\n';
	} else {
		r += '<span align="center" valign="middle" id="' + span_id + '"></span>\n';;
	}

    return r;
}

function widGetHTMLBody(tabs) {
	var r = '';
    r += '<table width="100%" id="body_table" border="1" nowrap>\n';
		r += '<tr>\n';
			r += '<td colspan="2" align="left" nowrap>\n';
				r += widGetHTMLTitleArea();
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td colspan="2" nowrap>';
				r += widGetHTMLTokenTextArea() + '\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td nowrap>' + widGetHTMLMasterKeyArea() + '\n'; 
			r += '<td width="84px" nowrap>' + widGetHTMLCreateButtonArea() + '\n';
		r += '</tr>\n';		
		r += '<tr>\n';
			r += '<td nowrap>';
				r += widGetHTMLMainTabs(tabs) + '\n';
			r += '<td width="84px" rowspan="2">';
				r += widGetHTMLButtonsArea() + '\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td nowrap>';
				r += widGetHTMLLogArea() + '\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td colspan="2" class="info-td" align="right" nowrap>\n';
				r += 'Powered by ';
				r += '<a href="http://hasq.org">';
				r += 'Hasq Technology';
				r += '</a>';
				r +='<sup>\u00A9</sup>';
		r += '</tr>\n';		
    r += '</table>\n';
	
    return r;
}


function widGetHTMLTitleArea() {
	var r = '';
	r += '<table width="100%" border="0">';
		r += '<tr>';
			r += '<td class="title-td"/>';
				r += '<span>\n' + glClientTitle + '</span>\n';
			r += '<td width="30px" align="center" valign="middle" onclick="engSendPing(5000)">';
				r += widGetHTMLSpan('hasqd_logo') + '\n';
		r += '<tr>';
	r += '</table>';
	
	return r;
}

function widGetHTMLTokenTextArea() {
	var r = '';
	r += '<table width="100%" border="0">';
		r += '<tr>';
			r += '<td class="subtitle-td" align="center"/>';
				r += '<b>Token name<b>';
		r += '</tr>';
		
		r += '<tr>';
			r += '<td align="center" nowrap>\n';
					r += '<textarea oninput="widTokenTextOninput();" id="token_text_textarea" type="text" rows="2" maxlength="65536" placeholder="Enter token text" required></textarea>\n';
		r += '</tr>';
		
		r += '<tr>';
			r += '<td align="left" class="info-td">';
				r += '<table>';
					r += '<tr>';
						r += '<td width="20" valign="center"/>' + widGetHTMLSpan('pic_reload', 'widTokenTextOninput()');								
						r += '<td nowrap/>\n';
							r += 'Token hash:&nbsp\n';
						r += '<td width="280px" id="token_hash_td" nowrap/>';
						r += '<td width="20" id="token_pic_td"/>\n';
					r += '</tr>';
				r += '</table>';
		r += '</tr>';
		
		
	r += '</table>';
	return r;
}

function widGetHTMLMasterKeyArea() {
	var r = '';
	r += '<table width="100%">';
		r += '<tr>';
			r += '<td class="subtitle-td"/>';
				r += 'Master key';
		r += '</tr>';
		r += '<tr>';
			r += '<td align="center">';
				r += '<table border="0">';
					r += '<tr>';
						r += '<td width="20" valign="center" align="center">' + widGetHTMLSpan('password_eye', 'widPasswordEyeClick($(this))');
						r += '<td width="250"/>\n';
							r += '<input oninput="widPasswordOninput($(this));" id="password_input" type="password" class="password" placeholder="Enter token master key" required/>\n';
						r += '<td width="20" valign="center" id="password_pic_td">\n';							
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

function widGetHTMLCreateButtonArea() {
	var r = '';
	r += '<table width="100%">';
		r += '<tr>';
			r += '<td/>';
				r += '<button onclick="return widCreateArea()" disabled>' + picTokCreate + '</button>';
		r += '</tr>';
	r += '</table>';
	
	return r;
}
function widGetHTMLButtonsArea() {
	var r = '';
	r += '<table width="100%">';
		r += '<tr>';
			r += '<td/>';
				r += '<button onclick="return widSendArea()">' + picTokSend + '</button>';
		r += '</tr>';		
		r += '<tr>';
			r += '<td/>';
				r += '<button onclick="return widReceiveArea()">' + picTokReceive + '</button>';
		r += '</tr>';
		r += '<tr>';
			r += '<td/>';
				r += '<button onclick="return widSearchArea()">' + picTokSearch + '</button>';
		r += '</tr>';		
	r += '</table>';
	return r;	
}


function widGetHTMLInitialData() {
	var r = '';
	
	r += '<div class="initial-data-div">';
	
	r += '<table id="initial_data_table" width="100%" border="0" style="border: 1px solid #DDDDDD;">';
		r += '<tr>';
			r += '<td align="center" style="font-size:16px">';
				r += '<b>Token text<b>';
		r += '</tr>';
		r += '<tr>';
			r += '<td align="left" nowrap>\n';
					r += '<textarea oninput="widTokenTextOninput();" id="token_text_textarea" type="text" rows="1" maxlength="65536" placeholder="Enter token text" required></textarea>\n';
					r += '</tr>';
		r += '<tr>';
			r += '<td align="right" class="token-hash">';
				r += '<table>';
					r += '<tr>';
					    r += '<td width="20" align="center" valign="center">' + widGetHTMLSpan('pic_reload', 'widTokenTextOninput()');
						r += '<td width="95" align="right" nowrap>\n';
							r += '<i>Token hash:&nbsp</i>\n';
						r += '<td width="270" id="token_hash_td" colspan="2" align="left" style="font-style: italic;" nowrap>';
						r += '<td width="20" id="token_pic_td" align="right" valign="center">\n';
					r += '</tr>';
				r += '</table>';
		r += '</tr>';
		r += '<tr>';
			r += '<td align="center" style="font-size:16px">';
				r += '<b>Master key<b>';
		r += '</tr>';
		r += '<tr>';
			r += '<td align="center">';
				r += '<table border="0">';
					r += '<tr>';
						r += '<td width="20" valign="center" align="center">' + widGetHTMLSpan('password_eye', 'widPasswordEyeClick($(this))');
						r += '<td width="250">\n';
							r += '<input oninput="widPasswordOninput($(this));" id="password_input" type="password" class="password" placeholder="Enter token master key" required/>\n';
						r += '<td width="20" valign="center" id="password_pic_td">\n';
					r += '</tr>';
					r += '<tr>';
						r += '<td>&nbsp';
						r += '<td id="password_zxcvbn_td" align="right" style="font-style: italic">\n';
						r += '<td>&nbsp';
					r += '</tr>';					
				r += '</table>';
		r += '</tr>';
/*
		r += '<tr>';
			r += '<td><hr/>';
		r += '</tr>';

		r += '<tr>';
			r += '<td align="center" id="token_data_td">';
				r += '<table>';
					r += '<tr>';
						r += '<td align="center" style="font-size:16px">';
							r += '<b>Token data</b>';
					r += '</tr>';
					r += '<tr>';
						r += '<td>';
							r += '<pre id="token_data_pre" class="hidden-data"></pre>';
					r += '</tr>';		
				r += '</table>';
		r += '</tr>';
		r += '<tr>';
			r += '<td>';
		r += '</tr>';		
	r += '</table>';

	r += '</div>';
*/
	
	return r;
}

function widGetHTMLMainTabs(items) {
    var r = '';

    r += '<div id="tabs_div" class="tabs-div">\n';
    r += '\t<ul>\n';

    for (var i = 0; i < items.length; i++) {
        r += '\t<li><a href="#tabs_' + (i + 1) + '_div">' + items[i].title + '</a>\n';
	}
	
    r += '\t</ul>\n';

    for (var i = 0; i < items.length; i++) {
        r += '\t<div id="tabs_' + (i + 1) + '_div">' + items[i].data + '</div>\n';
	}
	
    r += '</div>\n';

    return r;
}

function widGetHTMLCreateTab() {
	var r = '';
	
	r += '<table width="100%">\n';
		r += '<tr>\n';
			r += '<td style="text-align: center;">\n'
				r += '<button id="create_button" onclick="widButtonClick(this);" data-onclick="widCreateButtonClick()">Create';
		r += '</tr>\n';
	r += '</table>\n';
	
	return r;
}

function widGetHTMLSetDataTab() {
	var r = '';
	
	r += '<table width="100%" border="0">\n';
		r += '<tr>\n';
			r += '<td style="text-align:center">\n';
				r += '<textarea type="text" id="setdata_textarea" rows="4" cols="64" wrap="on"></textarea>';
			r += '<td style="text-align:center">\n'
				r += '<button id="setdata_button" onclick="widButtonClick(this)" data-onclick="widSetDataButtonClick()">' + picTokData;
		r += '</tr>\n';
	r += '</table>\n';
	
	return r;
}

function widGetHTMLSendTab() {
	var r = '';
	
	r += '<table width="100%" border="0">\n';
		r += '<tr>\n';
			r += '<td style="text-align:center"/>\n';
				r += '<button id="send_button" onclick="widButtonClick(this)" data-onclick="widShowKeysButtonClick()">Show keys</button>';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td style="text-align:center"/>\n';
				r += '<input type="checkbox" id="send_type_checkbox">';
				r += '<label for="send_type_checkbox" style="font:130% monospace"><i>Blocking</i></label>\n';				
		r += '</tr>\n';		
		r += '<tr>\n';
			r += '<td/>\n'
				r += '<textarea wrap="on" rows="2" type="text" id="send_simple_textarea" readonly></textarea>';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td>\n'
				r += '<textarea wrap="on" rows="2" type="text" id="send_blocking_textarea" readonly></textarea>';
		r += '</tr>\n';		
	r += '</table>\n';
	
	return r;	
}

function widGetHTMLReceiveTab() {
	var r = '';
	
	
	r += '<table width="100%" border="0" >\n';
		r += '<tr>\n';
			r += '<td style="text-align: center">\n'
				r += '<textarea wrap="on" rows="2" type="text" id="receive_textarea" maxlength="65536" required></textarea>';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td style="text-align: center">\n';
				r += '<button id="receive_button" onclick="widButtonClick(this)" data-onclick="widReceiveButtonClick()">Take ownership';
		r += '</tr>\n';
	r += '</table>\n';

	return r;	
}

function widGetHTMLSearchTab() {
	var r = '';
	r += '<table align="center" border="0">\n';
		r += '<tr>\n';
			r += '<td>\n';	
				r += '<label for="from_date">From:</label>';
				r += '<input id="from_datepicker_input" name="from_date">\n';
				r += '<label for="to_date">to:</label>';
				r += '<input id="to_datepicker_input" name="to_date">\n';
			r += '<td>\n';
				r += '<button id="search_button" onclick="widButtonClick(this);" data-onclick="widSearchButtonClick()">Search';
		r += '</tr>\n';		
	r += '</table>\n';	
	return r;	
}


function widGetHTMLLogArea() {
    var r = '';
	r += '<table width="100%">';
		r += '<tr>';
			r += '<td/>';
				r += '<hr/>\n';
		r += '</tr>';
		r += '<tr>';
			r += '<td/>';
				r += '<pre id="tokens_log_pre" class="log-area">&nbsp</pre>\n';
		r += '</tr>';		
		r += '<tr>';
			r += '<td/>';
				r += '<hr/>\n';
		r += '</tr>';		
	r += '</table>';
    return r;
}
