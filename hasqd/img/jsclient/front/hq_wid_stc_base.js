// Hasq Technology Pty Ltd (C) 2013-2015

function widTableCell(x) {
    return '<td>' + x + '';
}

function widTableCellSpan(x, y, z) {
    if (!y)
        y = '';
    return '<td><span id="' + x + '"></span>&nbsp;' + '' + y + '';
}

function widAddRow(data) {
    var r = '<tr>\n' + data + '</tr>\n';
    return r;
}

function widLink(x) {
    var r = '';
    r += '<a href="http://' + x + '"><b>' + x + '</b></a>\n';
    return r;
}

function widGlobalTable(tabs){
    var r = '';
    r += '<table width="100%" border="0" nowrap>\n';

    r += '<tr nowrap>\n';
    r += '<td nowrap>\n' + widClientTitle(glClientTitle);
    r += '<td style="text-align:right;">&nbsp;' + '' + widClientLed('progress_led');
    r += '</tr>\n';

    r += '<tr>\n';
    r += '<td width="100%" colspan="2" nowrap>\n' + widMainTabs(tabs);
    r += '</tr>\n';
    r += '</table>\n';
    return r;
}

function widClientTitle(text) {
    var r = '';
    r += '<table border="0">\n';
    r += '<tr>\n';
    r += '<td>\n';
    r += '<div style="font-size:20px">\n' + text + '</div>\n';
    r += '</tr>\n';
    r += '</table>\n';
    return r;
}

function widClientLed(span_id) {
    var r = '';
    r += '<span id="' + span_id + '"></span>\n';
    return r;
}

function widMainTabs(items) {
    var r = '';

    r += '<div id="tabs">\n';

    r += '\t<ul>\n';
    for (var i = 0; i < items.length; i++)
        r += '\t<li><a href="#tabs-' + (i + 1) + '">' + items[i].title + '</a>\n';

    r += '\t</ul>\n';

    for (var i = 0; i < items.length; i++)
        r += '\t<div id="tabs-' + (i + 1) + '">' + items[i].data + '</div>\n';

    r += '</div>\n';

    return r;
}

function widServerTab() {
    var r = '';

    r += '<table>\n';
    r += '<tr>\n';
    r += '<td>\n';
    r += '<table border="1" style="font-family: monospace;">\n';
    r += '<tr>\n' + widTableCell('Host') + widTableCellSpan('server_host', widServerRefreshButton()) + '</tr>\n';
    r += '<tr>\n' + widTableCell('Server') + widTableCellSpan('server_id') + '</tr>\n';
    r += '<tr>\n' + widTableCell('System') + widTableCellSpan('server_sys') + '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';
    r += '<tr><td><hr/></tr>\n';
    r += '<tr>\n';
    r += widTableCellSpan('server_fam') + '\n';
    r += '</tr>\n';
    r += '</table>\n';
    return r;
}

function widServerRefreshButton() {
    var r = '';
    r += '<button id="srv_refresh_button" onclick="widServerRefreshBtnClk()">Refresh</button>\n';
    return r;
}

function widServerFamilyTable(data) {
    var r = '';

    r += '<table border="1" style="font-family:monospace;">\n';
    r += '<tr><th>Name</th><th>Link</th><th>Neighbour</th><th>Alive</th><th>Locked</th></tr>\n';

    var contentData = data.content;

    if (contentData != 'NO_FAMILY') {
        for (var i = 0; i < contentData.list.length; i++) {
            r += '<tr>\n';
			r += widTableCell(contentData.list[i].name);
            r += widTableCell(widLink(contentData.list[i].link));
            r += widTableCell(contentData.list[i].neighbor ? 'Yes' : 'No');
            r += widTableCell(contentData.list[i].alive ? 'Yes' : 'No');
            r += widTableCell(contentData.list[i].unlock ? 'No' : 'Yes');
			r += '</tr>\n';
        }
    }

    r += '</table>\n';

    return r;
}

function widDatabaseTab() {
    var r = '';

    r += '<table>\n';
    r += '<tr>\n';
    r += '<td>\n';
    r += '<div>' + widTableCellSpan('server_db', widDatabaseDBTable()) + '</div>\n';
    r += '</tr>\n';
    r += '</table>\n';
    return r;
}

function widDatabaseDBTable() {
    var r = '';

    r += '<table border="0" style=" table-layout:fixed ">\n';
    r += '<tr>\n';
    r += '<td colspan="2"><select name="database_smenu" id="database_smenu">';
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

function widDatabaseTraitTable(data) {
    var r = '';
    r += '<table border="1" style="font-family:monospace;">\n';
    r += '<tr><th>Trait</th><th>Value</th></tr>\n';

    for (var key in data) {
        r += '<tr><td>' + key + '<td>' + data[key] + '</tr>\n';
    }
    r += '</table>\n';

    return r;
}

function widRecordsTab() {
    var r = '';
    r += '<table width="70%" border="0">\n'; //style="table-layout:fixed;"
		r += '<tr>\n';
			r += '<td colspan="2" rowspan="4">\n';
				r += '<b>Current DB:&nbsp;</b>\n';
				r += '<b><span id="current_db">No database</span></b>\n';
			//r += '<td width="2%">\n';
			r += '<td width="80px">\n';
				r += '&nbspRecord #\n';
			r += '<td><input type="text" id="lastrec_n_input" disabled>\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td>\n';
		r += '</tr>\n';
		r += '<tr>\n';
			//r += '<td>\n';
			r += '<td >&nbsp;' + 'Key&nbsp\n';
			r += '<td >\n';
				r += '<input type="text" id="lastrec_k_input" disabled>\n';
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
						r += '<button id="lastrec_button" onclick="widRecordsGetLastRecordBtnClk()">Get Last Record</button>\n';
					r += '</tr>\n';
				r += '</table>\n';
				
			r += '<td >\n';
				r += '&nbsp;Generator' + '&nbsp;\n';
			r += '<td >\n';
				r += '<input type="text" id="lastrec_g_input" disabled>\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td >&nbsp;' + 'Owner' + '&nbsp;\n';
			r += '<td >\n';
				r += '<input type="text" id="lastrec_o_input" disabled>\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td >&nbsp;' + 'Data' + '&nbsp;\n';
			r += '<td >\n';
				r += '<input type="text" id="lastrec_d_input" disabled>\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td colspan="4" rowspan="1"><hr/>\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td colspan="2" rowspan="2"><b>New record</b>\n';
			r += '<td >&nbsp;' + 'Record #' + '&nbsp;\n';
			r += '<td >\n';
				r += '<input type="text" id="newrec_n_input" oninput="widGetNewRecordOninput();" >\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td >&nbsp;' + 'Key' + '&nbsp;\n';
			r += '<td >\n';
				r += '<input type="text" id="newrec_k_input" oninput="widCheckNewRecordKeys(this.id)">\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td width="120px" style="text-align:left">\n';
				r += '<input type="checkbox" id="onepass_checkbox" onclick="widRecordsOnePwdChkboxClk(this);" unchecked>\n';
				r += '&nbsp;' + 'One password' + '&nbsp;\n';
			r += '<td style="text-align:left">\n';
				r += '<input type="password" class="password" id="newrec_pass0_input" oninput="widGetNewRecordOninput()" disabled>\n';
			r += '<td>&nbsp;' + 'Generator' + '&nbsp;\n';
			r += '<td>\n';
				r += '<input type="text" id="newrec_g_input" oninput="widCheckNewRecordKeys(this.id)">\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td  style="text-align:left">\n';
				r += '<input type="checkbox" id="threepass_checkbox" onclick="widRecordsThreePwdChkboxClk(this)" unchecked/>\n';
				r += '&nbsp;' + 'Three passwords' + '&nbsp;';
			r += '<td  style="text-align:left">\n';
				r += '<input type="password" class="password" id="newrec_pass1_input" oninput="widGetNewRecordOninput()" disabled>\n';
			r += '<td >&nbsp;' + 'Owner' + '&nbsp;\n';
			r += '<td >\n';
				r += '<input type="text" id="newrec_o_input" oninput="widCheckNewRecordKeys(this.id)">\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td  style="text-align:left">';
				r += '<input nowrap type="checkbox" id="show_hide_input"/>\n';
				r += '<label for="show_hide_input" id="show_hide_label">&nbsp;' + 'Show Password&nbsp;</label>\n';
			r += '<td  style="text-align:left">\n';
				r += '<input type="password" class="password" id="newrec_pass2_input" oninput="widGetNewRecordOninput()" disabled>\n';
			r += '<td >&nbsp;' + 'Data' + '&nbsp;\n';
			r += '<td >\n';
				r += '<input type="text" id="newrec_d_input" oninput="">\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td colspan="4" style="text-align:right">\n';
				r += '<button id="submit_button" onclick="widSubmitBtnClk()">Submit</button>\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td  colspan="4"><hr/>\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td colspan="2"><b>History</b>\n';	
			r += '<td style="text-align:right;vertical-align:middle;">\n';
				r += '<select name="tokens_history" id="tokens_history_selectmenu">\n';
					r += '<option selected="selected">0</option>\n';
					r += '<option>3</option>\n';    
					r += '<option>10</option>\n';
					r += '<option>30</option>\n';
				r += '</select>\n';
			r += '<td style="text-align:left;vertical-align: middle">\n';
				r += '<label for="tokens_history_selectmenu">last records</label>\n';
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
				r += '<pre id="records_last_operation_pre">&nbsp;' + '</pre>\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td  colspan="4"><hr/>\n';
		r += '</tr>\n';

	r += '</table>\n';

    return r;
}

function widHashcalcTab() {
    var r = '';

    r += '<table width="70%" border="0">\n';
		r += '<tr>\n';
			r += '<td style="text-align:left">' + widHashCalcSMenu();
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td>\n';
				r += '<textarea rows="5" type="text" id="hashcalc_textarea" oninput="widHashcalcOninput()"></textarea>';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td>';
				r += '<textarea rows="3" type="text" id="hashcalc_input" readonly></textarea>';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td style="text-align:right" nowrap>\n';
				r += '<button id="send_to_k_button" onclick="return document.getElementById(\'newrec_k_input\').value = document.getElementById(\'hashcalc_input\').value;">Send to K</button>\n';
				r += '<button id="send_to_g_button" onclick="return document.getElementById(\'newrec_g_input\').value = document.getElementById(\'hashcalc_input\').value;">Send to G</button>\n';
				r += '<button id="send_to_o_button" onclick="return document.getElementById(\'newrec_o_input\').value = document.getElementById(\'hashcalc_input\').value;">Send to O</button>\n';
		r += '</tr>\n';
    r += '</table>\n';

    return r;
}

function widHashCalcSMenu() {
    var r = '';

    r += '<select id="hashcalc_smenu">\n';
    r += '<option value="0">MD5</option>\n';
    r += '<option value="1">RIPEMD-160</option>\n';
    r += '<option value="2">SHA2-256</option>\n';
    r += '<option value="3">SHA2-512</option>\n';
	r += '<option value="4">SMD</option>\n';
    r += '<option value="4">WORD</option>\n';
    r += '</select>\n';

    return r;
}

function widCommandTab() {
    var r = '';

    r += '<table width="70%" border="0">\n';
		r += '<tr>\n';
			r += '<td width="5%">\n';
				r += '<button type="submit" id="cmd_button" onclick="widCommandSendBtnClk()">Send</button>\n';
			r += '<td width="45%" style="text-align:left">\n';
				r += '<input type="text" id="cmd_input" title="type a command;" value="ping" onkeypress="return widCheckEnterKey(this.value, event);"/>\n';
			r += '<td width="50%">\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td width="100%" colspan="3" rowspan="5" style="text-align:left">\n';
			r += '<textarea rows="5" type="text" id="cmd_output" wrap="off" readonly></textarea>\n';
		r += '</tr>\n';
    r += '</table>\n';

    return r;
}
