// Hasq Technology Pty Ltd (C) 2013-2015


function widAnimateProgbar() {
	$('#progressbar').html('<img src="images/greypoint.gif">');
}

function widTableCell(x) {
	return '<td>' + x + '</td>';
}

function widTableCellSpan(x, y, z) {
	if (!y)
		y = '';
	return '<td><span id="' + x + '"></span>&nbsp;' + y + '</td>';
}

function widAddRow(data) {
	var r = '<tr>' + data + '</tr>';
	return r;
}

function widLink(x) {
	var r = '';
	r += '<a href="http://' + x + '"><b>' + x + '</b></a>';
	return r;
}

function widGlobalTable(tabs){
	var r = '';
	r += '<table width="100%" border="0">\n';
	
	r += '<tr>\n';
	r += '<td>\n';
	r += widClientTitle(glClientTitle);
	r += '</td>\n';
	r += '<td style="text-align:right;">&nbsp';
	r += widClientLed('progressbar');
	r += '</td>\n';
	r += '</tr>\n';	
	
	r += '<tr>\n';
	r += '<td width="100%" colspan="2">\n';
	r += widMainTabs(tabs);
	r += '</td>\n';
	r += '</tr>\n';
	r += '</table>\n';		
	return r;
}

function widClientTitle(text) {
	var r = '';	
	r += '<table border="0" style="padding:0;border-collapse:collapse;border-spacing:0;">\n';
	r += '<tr>\n';
	r += '<td>\n';
	r += '<div style="font-size:20px">' + text + '</div>\n';
	r += '</td>\n';
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
	
	r += '<div id="tabs">';

	r += '\t<ul>';
	for (var i = 0; i < items.length; i++)
		r += '\t<li><a href="#tabs-' + (i + 1) + '">' + items[i].title + '</a></li>';

	r += '\t</ul>';

	for (var i = 0; i < items.length; i++)
		r += '\t<div id="tabs-' + (i + 1) + '">' + items[i].data + '</div>';

	r += '</div>';

	return r;
}

function widServerTab() {
	var r = '';

	r += '<table>';
	r += '<tr>';
	r += '<td>';
	r += '<table border="1" style="font-family: monospace;padding:0;border-collapse:collapse;border-spacing:0;">';
	r += '<tr>' + widTableCell('Host') + widTableCellSpan('server_host', widServerRefreshButton()) + '</tr>';
	r += '<tr>' + widTableCell('Server') + widTableCellSpan('server_id') + '</tr>';
	r += '<tr>' + widTableCell('System') + widTableCellSpan('server_sys') + '</tr>';
	r += '</table>';
	r += '</td>';
	r += '</tr>';
	r += '<tr><td><hr/></td></tr>';
	r += '<tr>';
	//r += '<td>';
	r += widTableCellSpan('server_fam') + '\n';
	//r += '</td>';
	r += '</tr>';

	r += '</table>';
	return r;
}

function widServerRefreshButton() {
	var r = '';
	r += '<button id="srv_refresh_button" onclick="widServerRefreshBtnClk()">Refresh</button>';
	return r;
}

function widServerFamilyTable(data) {
	var r = '';

	r += '<table border="1" style="font-family:monospace;padding:0;border-collapse:collapse;border-spacing:0;">';
	r += '<tr><th>Name</th><th>Link</th><th>Neighbour</th><th>Alive</th><th>Locked</th></tr>';

	var contentData = data.content;

	if (contentData != 'NO_FAMILY') {
		for (var i = 0; i < contentData.list.length; i++) {
			r += '<tr>' + widTableCell(contentData.list[i].name);
			r += widTableCell(widLink(contentData.list[i].link));
			r += widTableCell(contentData.list[i].neighbor ? 'Yes' : 'No');
			r += widTableCell(contentData.list[i].alive ? 'Yes' : 'No');
			r += widTableCell(contentData.list[i].unlock ? 'No' : 'Yes') + '</tr>';
		}
	}

	r += '</table>';

	return r;
}

function widDatabaseTab() {
	var r = '';
	
	r += '<table>';
	r += '<tr>';
	r += '<td>';
	r += '<div>' + widTableCellSpan('server_db', widDatabaseDBTable()) + '</div>';
	r += '</td>';
	r += '</tr>';
	r += '</table>';
	return r;
}

function widDatabaseDBTable() {
	var r = '';

	r += '<table border="0" style="padding:0;border-collapse:collapse;border-spacing:0;">';
	r += '<tr>';
	r += '<td colspan="2">'
	r += '<select name="database_smenu" id="database_smenu">';
	r += '<option>No database</option>';
	r += '</select>';
	r += '<td>';
	r += '</tr>';
	r += '<tr>';
	r += '<td>';
	r += '<div id="database_table"></div>';
	r += '</td>';
	r += '</tr>';
	r += '</table>';

	return r;
}

function widDatabaseTraitTable(data) {
	var r = '';
	r += '<table border="1" style="font-family: monospace;padding:0;border-collapse:collapse;border-spacing:0;">';
	r += '<tr><th>Trait</th><th>Value</th></tr>';

	for (var key in data) {
		r += '<tr><td>' + key + '</td><td>' + data[key] + '</td></tr>';
	}
	r += '</table>';

	return r;
}

function widRecordsTab() {
	var r = '';
	r += '<table border="0">';
	r += '<tr><td colspan="2" rowspan="4"><b>Current DB:&nbsp;</b><b><span id="current_db">No database</span></b></td>';
	r += '<td width="20px"></td><td>Record #</td><td><input type="text" id="lastrec_n_input" size="35" title="" value="" disabled></td></tr>';
	r += '<tr><td></td></tr>'; //
	r += '<tr><td></td><td>Key</td><td><input type="text" id="lastrec_k_input" size="35" title="" value="" disabled></td></tr>';
	r += '<tr><td></td></tr>'; //
	r += '<tr>';
	r += '<td colspan="2" rowspan="3">';
	r += '<table border="0">';
	r += '<tr>';
	r += '<td>Raw DN&nbsp;</td>';
	r += '<td><input type="text" id="rdn_input" oninput="widRawDNOninput()" size="35" title="" value=""></td>';
	r += '</tr>';
	r += '<tr>';
	r += '<td>DN</td>';
	r += '<td><input type="text" id="dn_input" oninput="widDNOninput()" size="35" title="" value=""></td>';
	r += '</tr>';
	r += '<tr>';
	r += '<td></td>';
	r += '<td style="text-align:right">';
	r += '<button id="lastrec_button" onclick="widRecordsGetLastRecordBtnClk()">Get Last Record</button>';
	r += '</td>';
	r += '</tr>';
	r += '</table>';
	r += '</td>';
	r += '<td></td><td>Generator</td>';
	r += '<td><input type="text" id="lastrec_g_input" size="35" title="" value="" disabled></td>';
	r += '</tr>';

	r += '<tr>';
	r += '<td></td><td>Owner</td>';
	r += '<td><input type="text" id="lastrec_o_input" size="35" title="" value="" disabled></td>';
	r += '</tr>';

	r += '<tr>';
	r += '<td></td><td>Data</td>';
	r += '<td><input type="text" id="lastrec_d_input" size="35" title="" value="" disabled></td>';
	r += '</tr>';

	r += '<tr>';
	r += '<td colspan="5">';
	r += '<hr/>';
	r += '</td>';
	r += '</tr>';

	r += '<tr>';
	r += '<td colspan="2" rowspan="2"><b>New record</b></td>';
	r += '<td></td><td>Record #</td>';
	r += '<td><input type="text" id="newrec_n_input" oninput="widGetNewRecordOninput();" size="35" value="" ></td>';
	r += '</tr>';

	r += '<tr>';
	r += '<td></td><td>Key</td>';
	r += '<td><input type="text" id="newrec_k_input" oninput="widCheckNewRecordKeys(this.id)" size="35" title="" value=""></td>';
	r += '</tr>';

	r += '<tr>';
	r += '<td><input type="checkbox" id="onepass_checkbox" name="" value="" onclick="widRecordsOnePwdChkboxClk(this)" unchecked>One password</td>';
	r += '<td style="text-align:right"><input type="text" id="newrec_pass0_input" oninput="widGetNewRecordOninput()" title="" value="" disabled></td>';
	r += '<td></td><td>Generator</td>';
	r += '<td><input type="text" id="newrec_g_input" oninput="widCheckNewRecordKeys(this.id)" size="35" title="" value=""></td>';
	r += '</tr>';

	r += '<tr>';
	r += '<td><input type="checkbox" id="threepass_checkbox" name="" value="" onclick="widRecordsThreePwdChkboxClk(this)" unchecked>Three passwords</td>';
	r += '<td style="text-align:right"><input type="text" id="newrec_pass1_input" oninput="widGetNewRecordOninput()" title="" value="" disabled></td>';
	r += '<td></td><td>Owner</td>';
	r += '<td><input type="text" id="newrec_o_input" oninput="widCheckNewRecordKeys(this.id)" size="35" title="" value=""></td>';
	r += '</tr>';

	r += '<tr>';
	r += '<td></td>';
	r += '<td style="text-align:right"><input type="text" id="newrec_pass2_input" oninput="widGetNewRecordOninput()" title="" value="" disabled></td>';
	r += '<td></td><td>Data</td>';
	r += '<td><input type="text" id="newrec_d_input" oninput="" size="35" title="" value=""></td>';
	r += '</tr>';

	r += '<tr>';
	r += '<td colspan="4"></td>';
	r += '<td style="text-align:right"><button id="submit_button" onclick="widSubmitBtnClk()">Submit</button></td>';
	r += '</tr>';

	r += '<tr>';
	r += '<td colspan="5"><hr/></td>';
	r += '</tr>';

	r += '<tr>';
	r += '<td colspan="5"><pre id="records_last_operation_pre">&nbsp</pre></td>';
	r += '</tr>';

	r += '<tr>';
	r += '<td colspan="5"><hr/></td>';
	r += '</tr>';

	r += '</table>';

	return r;
}

function widHashcalcTab() {
	var r = '';

	r += '<table width="100%">';
	r += '<tr><td style="text-align:right colspan="4">' + widHashCalcSMenu() + '</td></tr>';
	r += '<tr><td style="text-align:left colspan="4"><textarea rows="5" cols="64" type="text" id="hashcalc_textarea" oninput="widHashcalcOninput()"></textarea></b></td></tr>';
	r += '<tr><td style="text-align:left colspan="4"><textarea rows="3" cols="64" type="text" id="hashcalc_input" readonly></textarea></td></tr>';
	r += '<tr><td colspan="4" style="text-align:right">';
	r += '<button id="send_to_k_button" onclick="return document.getElementById(\'newrec_k_input\').value = document.getElementById(\'hashcalc_input\').value;">Send to K</button>';
	r += '<button id="send_to_g_button" onclick="return document.getElementById(\'newrec_g_input\').value = document.getElementById(\'hashcalc_input\').value;">Send to G</button>';
	r += '<button id="send_to_o_button" onclick="return document.getElementById(\'newrec_o_input\').value = document.getElementById(\'hashcalc_input\').value;">Send to O</button>';
	r += '</td></tr>';
	r += '</table>';

	return r;
}

function widHashCalcSMenu() {
	var r = '';

	r += '<select id="hashcalc_smenu">';
	r += '<option>MD5</option>';
	r += '<option>RIPEMD-160</option>';
	r += '<option>SHA2-256</option>';
	r += '<option>SHA2-512</option>';
	r += '<option>WORD</option>';
	r += '</select>';

	return r;
}

function widCommandTab() {
	var r = '';

	r += '<table width="100%" border="0" style="padding:0;border-collapse:collapse;border-spacing:0;">';
	r += '<tr>';
	r += '<td width="5%">';
	r += '<button type="submit" id="cmd_button" onclick="widCommandSendBtnClk()">Send</button>';
	r += '</td>';
	r += '<td width="100%" style="text-align:left">';
	r += '<input type="text" style="width:50%" id="cmd_input" size="32" title="type a command;" value="ping" onkeypress="return widCheckEnterKey(this.value, event);">';
	r += '</td>';
	r += '</tr>';
	r += '<tr>';
	r += '<td colspan="2" rowspan="5" style="text-align:left">';
	r += '<textarea rows="5" type="text" id="cmd_output" wrap="off" readonly></textarea>';
	r += '</td>';
	r += '</tr>';
	r += '</table>';

	return r;
}

function widHelpTab() {
	var r = '';

	r += '<table width="90%" style="table-layout:inherit;">';
	//r += '<col width="860" valign="top">';
	r += '<tr>';
	r += '<td >';	
	
	r += '<div id="main_help_accordion">';
	
	r += '<H3>Server tab</H3>';
	r += '<div>';
	r += '<table>';
	r += '<tr>';
	r += '<td>';
    INCLUDEFILE
    txt/help_server_tab.htm
	r += '</td>';
	r += '</tr>';
	r += '</table>';
	r += '</div>';

	r += '<H3>Database tab</H3>';
	r += '<div>';
	r += '<table>';
	r += '<tr>';
	r += '<td>';	
    INCLUDEFILE
    txt/help_database_tab.htm
	r += '</td>';
	r += '</tr>';
	r += '</table>';	
	r += '</div>';

	r += '<H3>Records tab</H3>';
	r += '<div>';
	r += '<table>';
	r += '<tr>';
	r += '<td>';	
    INCLUDEFILE
    txt/help_records_tab.htm
	r += '</td>';
	r += '</tr>';
	r += '</table>';	
	r += '</div>';

	r += '<H3>Hash calc tab</H3>';
	r += '<div>';
	r += '<table>';
	r += '<tr>';
	r += '<td>';	
    INCLUDEFILE
    txt/help_hash_calc_tab.htm
	r += '</td>';
	r += '</tr>';
	r += '</table>';
	r += '</div>';

	r += '<H3>Command tab</H3>';
	r += '<div>';
	r += '<table>';
	r += '<tr>';
	r += '<td>';		
    INCLUDEFILE
    txt/help_command_tab.htm
	r += '</td>';
	r += '</tr>';
	r += '</table>';
	r += '</div>';
	
	r += '<H3>Tokens tab</H3>';
	r += '<div>';
	r += '<table>';
	r += '<tr>';
	r += '<td>';		
    INCLUDEFILE
    txt/help_tokens_tab.htm
	r += '</td>';
	r += '</tr>';
	r += '</table>';	
	r += '<div id="tokens_tab_help_accordion">';
	
	r += '<H2>Create tab</H2>';
	r += '<div>';
	r += '<table>';
	r += '<tr>';
	r += '<td>';		
    INCLUDEFILE
    txt/help_tokens_create_tab.htm
	r += '</td>';
	r += '</tr>';
	r += '</table>';	
	r += '</div>';
	
	r += '<H2>Verify tab</H2>';
	r += '<div>';
	r += '<table>';
	r += '<tr>';
	r += '<td>';		
    INCLUDEFILE
    txt/help_tokens_verify_tab.htm
	r += '</td>';
	r += '</tr>';
	r += '</table>';	
	r += '</div>';
	
	r += '<H2>Data tab</H2>';
	r += '<div>';
	r += '<table>';
	r += '<tr>';
	r += '<td>';		
    INCLUDEFILE
    txt/help_tokens_data_tab.htm
	r += '</td>';
	r += '</tr>';
	r += '</table>';	
	r += '</div>';
	
	r += '<H2>Send tab</H2>';
	r += '<div>';
	r += '<table>';
	r += '<tr>';
	r += '<td>';	
    INCLUDEFILE
    txt/help_tokens_send_tab.htm
	r += '</td>';
	r += '</tr>';
	r += '</table>';	
	r += '</div>';
	
	r += '<H2>Receive tab</H2>';
	r += '<div>';
	r += '<table>';
	r += '<tr>';
	r += '<td>';		
    INCLUDEFILE
    txt/help_tokens_receive_tab.htm
	r += '</td>';
	r += '</tr>';
	r += '</table>';	
	r += '</div>';
	
	r += '</div>';
	r += '</div>';
	
	r += '</div>';

	r += '</td>';	
	r += '</tr>';
	r += '</table>';	

	return r;
}
