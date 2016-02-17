// Hasq Technology Pty Ltd (C) 2013-2016

function widGetHTMLBody(tabs) {
	var r = '';
    r += '<table width="70%" id="body_table" border="0" nowrap>\n';
		r += '<tr>\n';
			r += '<td align="center" nowrap>\n';
				r += '<span style="font-size:40px">\n' + glClientTitle + '</span>\n'
			r += '<td width="14px" align="right" valign="center" onclick="engSendPing(5000)">' + widGetHTMLSpan('hasqd_led') + '\n';
		r += '</tr>\n';
			r += '<tr>\n';
				r += '<td colspan="2" nowrap>&nbsp\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td colspan="2" nowrap>' + widGetHTMLInitialData() + '\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td colspan="2" nowrap>' + widGetHTMLMainTabs(tabs) + '\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td colspan="2" nowrap>\n';
				r += '<hr/>\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td colspan="2" nowrap>' + widGetHTMLLogArea() + '\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td colspan="2" nowrap>\n';
				r += '<hr/>\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td colspan="2" style="text-align: right; font: monospace; font-style: italic;" nowrap>\n';
				r += 'Hasq Technology Pty Ltd \u00A9 2013-2016 ';
		r += '</tr>\n';		
    r += '</table>\n';
	
    return r;
}

function widGetHTMLSpan(span_id) {
    var r = '';
    r += '<span id="' + span_id + '"></span>\n';
    return r;
}

function widGetHTMLInitialData() {
	var r = '';
	
	r += '<table id="initial_data_table" width="100%" border="0" style="border: 1px solid #DDDDDD;">';
		r += '<tr>';
			r += '<td align="center" style="font-size:15px">';
				r += '<b>Token text<b>';
		r += '</tr>';
		r += '<tr>';
			r += '<td align="left" nowrap>\n';
					r += '<textarea oninput="widTokenTextOninput();" id="token_text_textarea" type="text" rows="1" placeholder="Enter token text"></textarea>\n';
					r += '</tr>';
		r += '<tr>';
			r += '<td align="right" class="token-hash">';
				r += '<table>';
					r += '<tr>';
						r += '<td width="100" align="right" class="token-hash" nowrap>\n';
							r += '<i>Token hash:</i>\n';
						r += '<td width="250" id="token_hash_td" colspan="2" class="token-hash" align="left" style="font-style: italic;" nowrap>';
						r += '<td width="14" id="token_pic_td" align="right" valign="center" class="token-hash">\n';
					r += '</tr>';
				r += '</table>';
		r += '</tr>';
		r += '<tr>';
			r += '<td align="center" style="font-size:15px">';
				r += '<b>Master key<b>';
		r += '</tr>';
		r += '<tr>';
			r += '<td align="center">';
				r += '<table border="0">';
					r += '<tr>';
						r += '<td width="250">\n';
							r += '<input oninput="widPasswordOninput($(this));" oncontextmenu="return widPasswordOncontextmenu($(this));" id="password_input" type="password" class="password" placeholder="Enter token password"/>\n';
						r += '<td width="14" id="password_pic_td">\n';
					r += '</tr>';
					r += '<tr>';
						r += '<td id="password_zxcvbn_td" align="right" style="font-style: italic">\n';
						r += '<td>&nbsp';
					r += '</tr>';					
				r += '</table>';
		r += '</tr>';
		r += '<tr>';
			r += '<td><hr/>';
		r += '</tr>';
		r += '<tr>';
			r += '<td align="center" style="font-size:15px">';
				r += '<b>Token data</b>';
		r += '</tr>';		
		r += '<tr>';
			r += '<td>';
				r += '<pre id="tokens_data_pre"></pre>';
		r += '</tr>';		
	
	r += '</table>';



	
	return r;
}

/*
function widGetHTMLInitialData() {
    var r = '';

    r += '<table width="100%" border="0" id="initial_data_table" style="border: 1px solid #DDDDDD;">\n';
		r += '<tr>\n';
			r += '<td width="3%" style="text-align:left;" nowrap>\n'
				r += '&nbsp;' + '<b>Token text</b>' + '&nbsp;\n';
			r += '<td colspan="2" style="text-align:left;" nowrap>\n';
					r += '<input type="text" id="token_text_textarea" oninput="widTokenTextOninput();" placeholder="Enter token text"/>\n';
			r += '<td width="30%" id="token_pic_td" style="text-align:left">\n'; //picGry;
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td width="3%" style="text-align:left;" nowrap>\n';
				r += '&nbsp;' + '<b>Token hash</b>' + '&nbsp;\n';
			r += '<td id="token_hash_td" colspan="2" class="monospace" style="font-style: italic;" nowrap>';
			r += '<td width="30%">';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td width="3%" style="text-align:left">\n';
				r += '&nbsp;' + '<b>Master key</b>' + '&nbsp\n';
			r += '<td colspan="2" style="text-align:left">\n';
				r += '<input type="password" id="password_input" oninput="widTokensPasswordOninput(this.id);" class="password" placeholder="Enter token password" oninput=""/>\n'; // disabled/>\n';
			r += '<td width="30%" id="password_pic_td" style="text-align:left">\n'; //picGry;
		r += '<tr>\n';
			r += '<td width="3%">';
			r += '<td width="100px" style="text-align:left">\n';
				r += '<input type="checkbox" id="show_hide_checkbox"/>\n';
				r += '<label for="show_hide_checkbox" id="show_hide_label">Show password</label>\n';
			r += '<td id="password_zxcvbn_td" style="text-align:right; font-style: italic">\n';
			r += '<td width="30%">';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td colspan="4">\n';
				r += '<table width="100%">\n';
					r += '<tr>\n';
						r += '<td>\n';
							r += '<pre id="tokens_data_pre"  style="white-space: pre"></pre>';
					r += '</tr>\n';
				r += '</table>\n';
		r += '</tr>\n';
    r += '</table>\n';

    return r;
}

*/

function widGetHTMLMainTabs(items) {
    var r = '';

    r += '<div id="tabs_div">\n';
    r += '\t<ul>\n';

    for (var i = 0; i < items.length; i++) {
        r += '\t<li><a href="#tabs-' + (i + 1) + '_div">' + items[i].title + '</a>\n';
	}
	
    r += '\t</ul>\n';

    for (var i = 0; i < items.length; i++) {
        r += '\t<div id="tabs-' + (i + 1) + '_div">' + items[i].data + '</div>\n';
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
				r += '<textarea type="text" id="setdata_textarea" rows="5" cols="64" wrap="on"></textarea>';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td style="text-align:center">\n'
				r += '<button id="setdata_button" onclick="widButtonClick(this)" data-onclick="widSetDataButtonClick()">Set data';
		r += '</tr>\n';
	r += '</table>\n';
	
	return r;
}

function widGetHTMLSendTab() {
	var r = '';
	
	r += '<table width="100%" border="0">\n';
		r += '<tr>\n';
			r += '<td style="text-align:center"/>\n';
				r += '<button id="send_button" onclick="widButtonClick(this)" data-onclick="widSendButtonClick()">Show keys</button>';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td style="text-align:center"/>\n';
				r += '<input type="checkbox" id="send_type_checkbox">';
				r += '<label for="send_type_checkbox" style="font:130% monospace"><i>Blocking</i></label>\n';				
		r += '</tr>\n';		
		r += '<tr>\n';
			r += '<td/>\n'
				r += '<textarea wrap="off" rows="3" type="text" id="send_simple_textarea" readonly></textarea>';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td>\n'
				r += '<textarea wrap="off" rows="3" type="text" id="send_blocking_textarea" readonly></textarea>';
		r += '</tr>\n';		
	r += '</table>\n';
	
	return r;	
}

function widGetHTMLReceiveTab() {
	var r = '';
	
	
	r += '<table width="100%" border="0" >\n';
		r += '<tr>\n';
			r += '<td style="text-align: center">\n'
				r += '<textarea wrap="off" rows="4" type="text" id="receive_textarea"></textarea>';
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
	r += '<table width="60%" border="1">\n';
		r += '<tr>\n';
			r += '<td>\n';
				r += 'From' + '&nbsp';
			r += '<td>\n';	
				r += '<input id="from_datepicker_input" type="text">\n';
			r += '<td>\n'
				r += '&nbsp' + 'to' + '&nbsp';
			r += '<td>\n';
				r += '<input id="to_datepicker_input" type="text">\n';
			r += '<td>\n';
				r += '<button id="search_button" onclick="widButtonClick(this);" data-onclick="widSearchButtonClick()">Search';
		r += '</tr>\n';		
	r += '</table>\n';	
	return r;	
}


function widGetHTMLLogArea() {
    var r = '';
    r += '<pre id="tokens_log_pre">&nbsp</pre>\n';
    return r;
}
