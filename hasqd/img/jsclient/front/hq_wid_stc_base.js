// Hasq Technology Pty Ltd (C) 2013-2016

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
    r += '<table width="100%" border="0" nowrap>\n';

    r += '<tr>\n';
    r += '<td nowrap>\n' + widGetHTMLTitle(glClientTitle);
    r += '<td style="text-align:right;">&nbsp;' + '' + widGetHTMLSpan('hasqd_led');
    r += '</tr>\n';

    r += '<tr>\n';
    r += '<td width="600" colspan="2" nowrap>\n' + widGetHTMLTabs(tabs);
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

    r += '<table width="70%">\n';
    r += '<tr>\n';
    r += '<td>\n';
    r += '<table border="1" style="font-family: monospace;">\n';
    r += '<tr>\n' + widGetHTMLTd('Host') + widGetHTMLTdSpan('server_host', widGetHTMLRefreshButton()) + '</tr>\n';
    r += '<tr>\n' + widGetHTMLTd('Server') + widGetHTMLTdSpan('server_id') + '</tr>\n';
    r += '<tr>\n' + widGetHTMLTd('System') + widGetHTMLTdSpan('server_sys') + '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';
    r += '<tr><td><hr/></tr>\n';
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

    r += '<table border="1" style="font-family:monospace;">\n';
    r += '<tr><th>Name</th><th>Link</th><th>Neighbour</th><th>Alive</th><th>Locked</th></tr>\n';

    var contentData = data.content;

    if (contentData != 'NO_FAMILY') {
        for (var i = 0; i < contentData.list.length; i++) {
            r += '<tr>\n';
			r += widGetHTMLTd(contentData.list[i].name);
            r += widGetHTMLTd(widGetHTMLHref(contentData.list[i].link));
            r += widGetHTMLTd(contentData.list[i].neighbor ? 'Yes' : 'No');
            r += widGetHTMLTd(contentData.list[i].alive ? 'Yes' : 'No');
            r += widGetHTMLTd(contentData.list[i].unlock ? 'No' : 'Yes');
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

    r += '<table border="0" style=" table-layout:fixed ">\n';
    r += '<tr>\n';
    r += '<td colspan="2"><select name="database_select" id="database_select">';
    r += '<option>No database</option>\n';
    r += '</select>\n';
    r += '<td>\n';
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
    r += '<table border="1" style="font-family:monospace;">\n';
    r += '<tr><th>Trait</th><th>Value</th></tr>\n';

    for (var key in data) {
        r += '<tr><td>' + key + '<td>' + data[key] + '</tr>\n';
    }
    r += '</table>\n';

    return r;
}

function widGetHTMLRecordsTab() {
    var r = '';
    r += '<table width="70%" border="0">\n'; //style="table-layout:fixed;"
		r += '<tr>\n';
			r += '<td colspan="2" rowspan="4">\n';
				r += '<b>Current DB:&nbsp;</b>\n';
				r += '<b><span id="current_db">No database</span></b>\n';
			//r += '<td width="2%">\n';
			r += '<td width="80px">\n';
				r += '&nbspRecord #\n';
			r += '<td><input type="text" id="lr_n_input" disabled>\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td>\n';
		r += '</tr>\n';
		r += '<tr>\n';
			//r += '<td>\n';
			r += '<td >&nbsp;' + 'Key&nbsp\n';
			r += '<td >\n';
				r += '<input type="text" id="lr_k_input" disabled>\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td  colspan="2">\n';
		r += '</tr>\n';

		r += '<tr>\n';
			r += '<td colspan="2" rowspan="3">\n';
				r += '<table width="100%" border="0">\n';
					r += '<tr>\n';
						r += '<td width="5%">\n';
							r += '&nbsp;Raw token' + '&nbsp;\n';
						r += '<td >\n';
							r += '<input type="text" id="rdn_input" oninput="widRawDNOninput()">\n';
					r += '</tr>\n';
					r += '<tr>\n';
						r += '<td width="5%">&nbsp;' + 'Token&nbsp;';
						r += '<td>\n';
							r += '<input type="text" id="dn_input" oninput="widDNOninput()">\n';
					r += '</tr>\n';
					r += '<tr>\n';
						r += '<td colspan="2" style="text-align:right">\n';
						r += '<button id="lr_button" onclick="widGetLastRecordButtonClick()">Get Last Record</button>\n';
					r += '</tr>\n';
				r += '</table>\n';
				
			r += '<td >\n';
				r += '&nbsp;Generator' + '&nbsp;\n';
			r += '<td >\n';
				r += '<input type="text" id="lr_g_input" disabled>\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td >&nbsp;' + 'Owner' + '&nbsp;\n';
			r += '<td >\n';
				r += '<input type="text" id="lr_o_input" disabled>\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td >&nbsp;' + 'Data' + '&nbsp;\n';
			r += '<td >\n';
				r += '<input type="text" id="lr_d_input" disabled>\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td colspan="4" rowspan="1"><hr/>\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td colspan="2" rowspan="2"><b>New record</b>\n';
			r += '<td >&nbsp;' + 'Record #' + '&nbsp;\n';
			r += '<td >\n';
				r += '<input type="text" id="nr_n_input" oninput="widShowNewRecOninput();" >\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td >&nbsp;' + 'Key' + '&nbsp;\n';
			r += '<td >\n';
				r += '<input type="text" id="nr_k_input" oninput="widShowKeysPropriety(this.id)">\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td width="120px" style="text-align:left">\n';
				r += '<input type="checkbox" id="one_pwd_checkbox" onclick="widRecordsOnePwdCheckboxClick(this);" unchecked>\n';
				r += '&nbsp;' + 'One password' + '&nbsp;\n';
			r += '<td style="text-align:left">\n';
				r += '<input type="password" class="password" id="nr_pwd0_input" oninput="widShowNewRecOninput()" disabled>\n';
			r += '<td>&nbsp;' + 'Generator' + '&nbsp;\n';
			r += '<td>\n';
				r += '<input type="text" id="nr_g_input" oninput="widShowKeysPropriety(this.id)">\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td  style="text-align:left">\n';
				r += '<input type="checkbox" id="three_pwd_checkbox" onclick="widRecordsThreePwdCheckboxClick(this)" unchecked/>\n';
				r += '&nbsp;' + 'Three passwords' + '&nbsp;';
			r += '<td  style="text-align:left">\n';
				r += '<input type="password" class="password" id="nr_pwd1_input" oninput="widShowNewRecOninput()" disabled>\n';
			r += '<td >&nbsp;' + 'Owner' + '&nbsp;\n';
			r += '<td >\n';
				r += '<input type="text" id="nr_o_input" oninput="widShowKeysPropriety(this.id)">\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td  style="text-align:left">';
			r += '<td  style="text-align:left">\n';
				r += '<input type="password" class="password" id="nr_pwd2_input" oninput="widShowNewRecOninput()" disabled>\n';
			r += '<td >&nbsp;' + 'Data' + '&nbsp;\n';
			r += '<td >\n';
				r += '<input type="text" id="nr_d_input" oninput="">\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td colspan="4" style="text-align:right">\n';
				r += '<button id="submit_button" onclick="widSubmitButtonClick()">Submit</button>\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td  colspan="4"><hr/>\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td colspan="2"><b>History</b>\n';	
			r += '<td style="text-align:right;vertical-align:middle;">\n';
				r += '<select name="tokens_history" id="tokens_history_select">\n';
					r += '<option selected="selected">0</option>\n';
					r += '<option>3</option>\n';    
					r += '<option>10</option>\n';
					r += '<option>30</option>\n';
				r += '</select>\n';
			r += '<td style="text-align:left;vertical-align: middle">\n';
				r += '<label for="tokens_history_select">last records</label>\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td colspan="4">\n';
				r += '<textarea id="tokens_history_textarea" type="text" wrap="off" rows="4" readonly></textarea>\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td  colspan="4"><hr/>\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td  colspan="4">\n';
				r += '<pre id="records_log_pre">&nbsp;' + '</pre>\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td  colspan="4"><hr/>\n';
		r += '</tr>\n';

	r += '</table>\n';

    return r;
}

function widGetHTMLHashcalcTab() {
    var r = '';

    r += '<table width="70%" border="0">\n';
		r += '<tr>\n';
			r += '<td style="text-align:left">' + widGetHTMLHashcalcSelect();
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td>\n';
				r += '<textarea rows="5" type="text" id="hashcalc_in_textarea" oninput="widHashcalcOninput()"></textarea>';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td>';
				r += '<textarea rows="3" type="text" id="hashcalc_out_textarea" readonly></textarea>';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td style="text-align:right" nowrap>\n';
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

    r += '<table width="70%" border="0">\n';
		r += '<tr>\n';
			r += '<td width="5%">\n';
				r += '<button type="submit" id="cmd_button" onclick="widCommandSendButtonClick()">Send</button>\n';
			r += '<td width="45%" style="text-align:left">\n';
				r += '<input type="text" id="cmd_input" title="type a command;" value="ping" onkeypress="return widSendCommandInputOnpresskey(this.value, event);"/>\n';
			r += '<td width="50%">\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td width="100%" colspan="3" rowspan="5" style="text-align:left">\n';
			r += '<textarea rows="5" type="text" id="cmd_output" wrap="off" readonly></textarea>\n';
		r += '</tr>\n';
    r += '</table>\n';

    return r;
}
