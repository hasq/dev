// Hasq Technology Pty Ltd (C) 2013-2016
function widGetHTMLSpanImg(id, htmlClass) {
	var r = '';
	if ( arguments.length > 1 ) {
		r += '<span id="' + id + '" class="' + htmlClass +'" align="center" valign="middle"><img></img></span>\n';
	} else {
		r += '<span id="' + id + '" align="center" valign="middle"><img></img></span>\n';
	}

    return r;
}

function widGetHTMLTd(x) {
    return '<td nowrap style="text-align: left">\n' + x + '';
}

function widGetHTMLTdSpan(x, y, z) {
    if (!y)
        y = '';
    return '<td>\n<span id="' + x + '"></span>&nbsp;' + '' + y + '';
}

function widGetHTMLTr(x) {
    var r = '<tr>\n' + x + '</tr>\n';
    return r;
}

function widGetHTMLHref(x) {
    var r = '';
    r += '<a href="http://' + x + '"><b>' + x + '</b></a>\n';
    return r;
}

function widGetHTMLBody(tabs){
    var r = '';
    r += '<table id="#body_table" border="0" nowrap>\n';
		r += '<tr>\n';
			r += '<td nowrap>\n' + widGetHTMLTitle(glClientTitle);
			r += '<td style="text-align:right;">&nbsp;';
				r += widGetHTMLSpanImg('logo_span') + '\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td colspan="2" nowrap>\n' + widGetHTMLTabs(tabs);
		r += '</tr>\n';
    r += '</table>\n';
    return r;
}

function widGetHTMLTitle(text) {
    var r = '';
    r += '<table border="0">\n';
    r += '<tr>\n';
    r += '<td>\n';
    r += '<div style="font-size:20px">\n' + text + '</div>\n';
    r += '</tr>\n';
    r += '</table>\n';
    return r;
}

function widGetHTMLSpan(span_id) {
    var r = '';
    r += '<span id="' + span_id + '"></span>\n';
    return r;
}

function widGetHTMLTabs(items) {
    var r = '';

    r += '<div id="main_tabs">\n';

    r += '\t<ul>\n';
    for (var i = 0; i < items.length; i++)
        r += '\t<li><a href="#tabs-' + (i + 1) + '_div">' + items[i].title + '</a>\n';

    r += '\t</ul>\n';

    for (var i = 0; i < items.length; i++)
        r += '\t<div id="tabs-' + (i + 1) + '_div">' + items[i].data + '</div>\n';

    r += '</div>\n';

    return r;
}

function widGetHTMLServerTab() {
    var r = '';

    r += '<table>\n';
		r += '<tr>\n';
			r += '<td>\n';
				r += '<table border="1" style="width:auto; font-family:monospace;">\n';
					r += '<tr>\n' + widGetHTMLTd('Host') + widGetHTMLTdSpan('server_host', widGetHTMLRefreshButton()) + '</tr>\n';
					r += '<tr>\n' + widGetHTMLTd('Server') + widGetHTMLTdSpan('server_id') + '</tr>\n';
					r += '<tr>\n' + widGetHTMLTd('System') + widGetHTMLTdSpan('server_sys') + '</tr>\n';
				r += '</table>\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td/>\n';
			r += '<hr/>\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += widGetHTMLTdSpan('server_fam') + '\n';
		r += '</tr>\n';
    r += '</table>\n';
	
    return r;
}

function widGetHTMLRefreshButton() {
    var r = '';
    r += '<button id="srv_refresh_button" onclick="widRefreshButtonClick()">Refresh</button>\n';
    return r;
}

function widGetHTMLFamilyTable(data) {
    var r = '';

    r += '<table border="1" style="width:auto; font-family:monospace;">\n';
    r += '<tr><th>Name</th><th>Link</th><th>Neighbour</th><th>Alive</th><th>Locked</th></tr>\n';

    if (data != 'NO_FAMILY') {
        for (var i = 0; i < data.list.length; i++) {
            r += '<tr>\n';
			r += widGetHTMLTd(data.list[i].name);
            r += widGetHTMLTd(widGetHTMLHref(data.list[i].link));
            r += widGetHTMLTd(data.list[i].neighbor ? 'Yes' : 'No');
            r += widGetHTMLTd(data.list[i].alive ? 'Yes' : 'No');
            r += widGetHTMLTd(data.list[i].unlock ? 'No' : 'Yes');
			r += '</tr>\n';
        }
    }

    r += '</table>\n';

    return r;
}

function widGetHTMLDatabaseTab() {
    var r = '';

    r += '<table>\n';
		r += '<tr>\n';
			r += '<td>\n';
				r += '<div>' + widGetHTMLTdSpan('server_db', widGetHTMLDatabaseSelect()) + '</div>\n';
		r += '</tr>\n';
    r += '</table>\n';
	
    return r;
}

function widGetHTMLDatabaseSelect() {
    var r = '';

    r += '<table>\n';
		r += '<tr>\n';
			r += '<td />';
				r += '<select name="database_select" id="database_select">';
					r += '<option>No database</option>\n';
				r += '</select>\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td>\n';
				r += '<div id="database_table">\n</div>\n';
		r += '</tr>\n';
    r += '</table>\n';

    return r;
}

function widGetHTMLDatabaseTraitTable(data) {
    var r = '';
	
    r += '<table border="1" style="width:auto;font-family:monospace;">\n';
    r += '<tr><th>Trait</th><th>Value</th></tr>\n';

    for (var key in data) {
        r += '<tr><td>' + key + '<td>' + data[key] + '</tr>\n';
    }
	
    r += '</table>\n';

    return r;
}

function widGetHTMLRecTabTokArea() {
	var r = '';
	r += '<table>\n';
		r += '<tr>\n';
			r += '<td colspan="2" class="title-td" />\n';
				r += '<b>&nbsp;Current DB:</b>\n';
				r += '<b><span id="current_db">No database</span></b>\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td colspan="2" height="5px"/>';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td width="70" class="text" />\n';
				r += '&nbsp;Raw token&nbsp;\n';
			r += '<td >\n';
				r += '<input type="text" id="rdn_input" oninput="return widTokenNameOninput()">\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td class="text" />\n';
				r += '&nbsp;Token&nbsp;\n';
			r += '<td />\n';
				r += '<input type="text" id="dn_input" oninput="return widTokenHashOninput()">\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td colspan="2" align="right" />\n';
				r += '<button id="lr_button" onclick="widGetLastRecordButtonClick()">Get Last Record</button>\n';
		r += '</tr>\n';
	r += '</table>\n';	
	
	return r;
}

function widGetHTMLRecTabLRArea() {
	var r = '';
	r += '<table>\n';
		r += '<tr>\n';
			r += '<td class="text" width="70"/>\n';
				r += '&nbspRecord #\n';
			r += '<td />\n';
				r += '<input type="text" id="lr_n_input" readonly />\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td class="text"/>\n';
				r += '&nbsp;Key&nbsp;\n';
			r += '<td />\n';
				r += '<input type="text" id="lr_k_input" readonly>\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td class="text"/>\n';
				r += '&nbsp;Generator&nbsp;\n';
			r += '<td />\n';
				r += '<input type="text" id="lr_g_input" readonly>\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td class="text"/>\n';
				r += '&nbsp;Owner&nbsp;\n';
			r += '<td />\n';
				r += '<input type="text" id="lr_o_input" readonly>\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td class="text"/>\n';
				r += '&nbsp;Data&nbsp;\n';
			r += '<td />\n';
				r += '<input type="text" id="lr_d_input" readonly>\n';
		r += '</tr>\n';		
	r += '</table>\n';	
	
	return r;
}

function widGetHTMLRecTabPwdArea() {
	var r = '';
	r += '<table border="0">';
		r += '<tr>\n';
			r += '<td class="title-td" colspan="2"/>\n';
				r += '<b>&nbsp;New record</b>\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td colspan="2" height="5px"/>';
		r += '</tr>\n';		
		r += '<tr>\n';
			r += '<td class="text" width="40%" align="left" />\n';
				r += '<input type="checkbox" id="one_pwd_checkbox" onclick="widRecordsOnePwdCheckboxClick(this);" unchecked>\n';
				r += '&nbsp;' + 'One password' + '&nbsp;\n';
			r += '<td align="left">\n';
				r += '<input type="password" class="password" id="nr_pwd0_input" oninput="widShowNewRecOninput()" disabled>\n';

		r += '<tr>\n';
			r += '<td class="text" />\n';
				r += '<input type="checkbox" id="three_pwd_checkbox" onclick="widRecordsThreePwdCheckboxClick(this)" unchecked/>\n';
				r += '&nbsp;' + 'Three passwords' + '&nbsp;';
			r += '<td align="left" />\n';
				r += '<input type="password" class="password" id="nr_pwd1_input" oninput="widShowNewRecOninput()" disabled>\n';

		r += '<tr>\n';
			r += '<td  align="left">';
			r += '<td  align="left">\n';
				r += '<input type="password" class="password" id="nr_pwd2_input" oninput="widShowNewRecOninput()" disabled>\n';

	r += '</table>';	

	return r;
}

function widGetHTMLRecTabNRArea() {
	var r = '';
	r += '<table>\n';
		r += '<tr>\n';
			r += '<td class="text" width="70"/>\n';
				r += '&nbsp;Record #&nbsp;\n';
			r += '<td />\n';
				r += '<input type="text" id="nr_n_input" oninput="widShowNewRecOninput();" >\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td />\n';
				r += '&nbsp;Key&nbsp;\n';
			r += '<td />\n';
				r += '<input type="text" id="nr_k_input" oninput="widShowKeysPropriety(this.id)">\n';
		r += '</tr>\n';		
		r += '<tr>\n';
			r += '<td class="text"/>\n';
				r += '&nbsp;Generator&nbsp;\n';
			r += '<td />\n';
				r += '<input type="text" id="nr_g_input" oninput="widShowKeysPropriety(this.id)">\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td class="text"/>\n';
				r += '&nbsp;Owner&nbsp;\n';
			r += '<td />\n';
				r += '<input type="text" id="nr_o_input" oninput="widShowKeysPropriety(this.id)">\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td class="text"/>\n';
				r += '&nbsp;Data&nbsp;\n';
			r += '<td />\n';
				r += '<input type="text" id="nr_d_input" oninput="">\n';
		r += '</tr>\n';
	r += '</table>\n';	
	
	return r;
}

function widGetHTMLRecTabHistoryMenuArea() {
	var r = '';
	
	r += '<table>';
		r += '<tr>\n';
			r += '<td class="title-td" width="50%">\n';
				r += '<b>&nbsp;History</b>\n';	
			r += '<td align="right" valign="middle" width="70">\n';
				r += '<select name="tokens_history" id="tokens_history_select">\n';
					r += '<option selected="selected">0</option>\n';
					r += '<option>3</option>\n';    
					r += '<option>10</option>\n';
					r += '<option>30</option>\n';
				r += '</select>\n';
			r += '<td align="left" valign="middle" />\n';
				r += '<label for="tokens_history_select">last records</label>\n';
		r += '</tr>\n';
	r += '</table>';
	return r;
}

function widGetHTMLRecordsTab() {
    var r = '';
	
	r += '<table border="0">\n';
		r += '<tr>\n';
			r += '<td width="50%"/>\n';
				r += widGetHTMLRecTabTokArea();
			r += '<td width="50%"/>\n';
				r += widGetHTMLRecTabLRArea();
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td colspan="2" />\n';
				r += '<hr/>';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td width="50%"/>\n';
				r += widGetHTMLRecTabPwdArea();
			r += '<td width="50%"/>\n';
				r += widGetHTMLRecTabNRArea();
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td colspan="2" align="right"/>\n';
				r += '<button id="submit_button" onclick="widSubmitButtonClick()">Submit</button>\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td colspan="2" />\n';
				r += '<hr/>';
		r += '</tr>\n';		
		r += '<tr>\n';
			r += '<td colspan="2"/>\n';
				r += widGetHTMLRecTabHistoryMenuArea();
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td colspan="2"/>\n';
				r += '<textarea id="tokens_history_textarea" wrap="off" rows="4" readonly></textarea>\n';	
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td colspan="2"/>\n';
				r += '<hr/>';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td colspan="2"/>\n';
				r += '<pre id="records_log_pre">&nbsp;' + '</pre>\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td colspan="2"/>\n';
				r += '<hr/>';
		r += '</tr>\n';

	r += '</table>\n';

    return r;
}

function widGetHTMLHashcalcTab() {
    var r = '';

    r += '<table>\n';
		r += '<tr>\n';
			r += '<td align="left">' + widGetHTMLHashcalcSelect();
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td>\n';
				r += '<textarea rows="5" id="hashcalc_in_textarea" oninput="widHashcalcOninput()"></textarea>';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td>';
				r += '<textarea rows="3" id="hashcalc_out_textarea" readonly></textarea>';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td align="right" nowrap>\n';
				r += '<button id="send_to_k_button" onclick="return $(\'#newrec_k_input\').val($(\'#hashcalc_out_textarea\').val())">Send to K</button>\n';
				r += '<button id="send_to_g_button" onclick="return $(\'#newrec_g_input\').val($(\'#hashcalc_out_textarea\').val())">Send to G</button>\n';
				r += '<button id="send_to_o_button" onclick="return $(\'#newrec_o_input\').val($(\'#hashcalc_out_textarea\').val())">Send to O</button>\n';
		r += '</tr>\n';
    r += '</table>\n';

    return r;
}

function widGetHTMLHashcalcSelect() {
    var r = '';

    r += '<select id="hashcalc_select">\n';
    r += '<option value="0">MD5</option>\n';
    r += '<option value="1">RIPEMD-160</option>\n';
    r += '<option value="2">SHA2-256</option>\n';
    r += '<option value="3">SHA2-512</option>\n';
	r += '<option value="4">SMD</option>\n';
    r += '<option value="4">WORD</option>\n';
    r += '</select>\n';

    return r;
}

function widGetHTMLCommandTab() {
    var r = '';

    r += '<table>\n';
		r += '<tr>\n';
			r += '<td width="70"/>\n';
				r += '<button type="submit" id="cmd_button" onclick="widCommandSendButtonClick()">Send</button>\n';
			r += '<td align="left" />\n';
				r += '<input type="text" id="cmd_input" title="type a command;" value="ping" onkeypress="return widSendCommandInputOnpresskey(this.value, event);"/>\n';						
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td colspan="2"/>\n';
				r += '<textarea rows="5" id="cmd_output" wrap="off" readonly></textarea>\n';
		r += '</tr>\n';
    r += '</table>\n';

    return r;
}
