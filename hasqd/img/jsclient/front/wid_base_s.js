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
	r += '<P>This tab provides information about the server the Client is connected to. The information includes system parameters (disk and memory use, CPU load) as well as specifics like server name, version etc. Pressing the [Refresh] button in the top right corner causes the Client to update this information.</P>';
	r += '<P>The lower part of the tab window contains a table of neighbouring Hasq servers connected to the current server. A mouse click on any of the links in the table causes the Client to connect to the corresponding server. Information in all of the Client\'s tabs will be updated accordingly. This feature allows for exploration of the network of servers that the current server belongs to.</P>';
	r += '</td>';
	r += '</tr>';
	r += '</table>';
	r += '</div>';

	r += '<H3>Database tab</H3>';
	r += '<div>';
	r += '<table>';
	r += '<tr>';
	r += '<td>';	
	r += '<P>The Hasq server may have a number of databases that it maintains. When the Client first connects to a server, it requests a list of databases located on this server. It then selects the first database to be current. Any user command (except direct commands issued in the Command tab) is performed on the current database.</P>';
	r += '<P>This tab allows users to change the current database. This is achieved by clicking on the button at the top of the tab window and choosing a name from the list. The table below the button contains properties (traits) of the chosen database. While all properties are important, some of them are more informative for users than others. These include the database name, hash type (e.g. MD5) used by this database, and the record\'s data limit.</P>';
	r += '<P>The data limit shown in the table has the following format:</P>';
	r += '<P>';
	r += '( <I>n</I>';
	r += '| <I><U>n</U></I>b\n';
	r += '| <I>n</I>B\n';
	r += ') | (<I><U>n</U></I>k\n';
	r += '| <I>n</I>K\n';
	r += ') | (<I><U>n</U></I>m\n';
	r += '| <I>n</I>M\n';
	r += ') | (<I><U>n</U></I>h\n';
	r += '| <I>n</I>H\n';
	r += ') | -1';
	r += '</P>';
	r += '<P>where</P>';
	r += '<P>';
	r += '<I>n </I>is a number';
	r += '</P>';
	r += '<P>';
	r += '<I>n</I>';
	r += '| <I><U>n</U></I>b\n';
	r += '| <I>n</I>B\n';
	r += 'specifies data limit in bytes, e.g. 512B (512 bytes)';
	r += '</P>';
	r += '<P>';
	r += '<I><U>n</U></I>k\n';
	r += '| <I>n</I>K specifies data limit in kilobytes, e.g. 4k (4096 bytes)';
	r += '</P>';
	r += '<P>';
	r += '<I><U>n</U></I>m\n';
	r += '| <I>n</I>M specifies data limit in megabytes, e.g. 2M (2097152 bytes)';
	r += '</P>';
	r += '<P>';
	r += '<I><U>n</U></I>h\n';
	r += '| <I>n</I>H specifies data limit in hashes used by this database. The orresponding size in bytes can be calculated using the following formula:';
	r += '</P>';
	r += '<P>';
	r += 'data-limit-in-bytes = <I>n</I>';
	r += '* <I>hex-hash-size</I>';
	r += '+ <I>n</I>';
	r += '</P>';
	r += '<P>Example. Say, a database uses MD5. The hexadecimal text representation of any MD5 hash is 32 characters long, so if the data limit is specified as 4H, its size in bytes will be 132 (4 * 32 + 4 = 132)</P>';
	r += '<P>-1 means that there is no record\'s data limit in place</P>';
	r += '</td>';
	r += '</tr>';
	r += '</table>';	
	r += '</div>';

	r += '<H3>Records tab</H3>';
	r += '<div>';
	r += '<table>';
	r += '<tr>';
	r += '<td>';	
	r += '<P>This tab is used to manipulate records in the chosen database. The name of the current database is shown at the top left corner of the tab window.</P>';
	r += '<P>Two operations with records can be performed here - extraction of the last record in a chain and creation of a new record.</P>';
	r += '<P>Either operation requires a DN (token) to be specified first. A DN can be typed directly in the [DN] window or automatically generated from the content of the [Raw DN] field above. Since any DN is a hash-like string, some checks are performed if the [DN] field is changed manually. The purpose of the checks is to prevent incorrect characters from being used in a hash as well as to make sure that the length of a string in the [DN] field matches the length of a hexadecimal text representation of the database\'s hash. If there is no match, a red frame will be displayed around the [DN] field. The same applies to all other editable fields where a hash-like string is expected. For example, if the databases hash is MD5, the content of the [DN] field must be 32 characters long.</P>';
	r += '<P>Pressing the [Get Last Record] button causes the Client to send a request to the server to extract the last record for the DN specified in the [DN] field. If the request is fulfilled successfully, the components of the extracted record (Record number, Key, Generator, Owner and Data) will be displayed in the corresponding fields on the right hand side of the button. The status of the operation (success or failure) will be shown at the bottom of the tab window.</P>';
	r += '<P>The lower part of the window contains controls for creating a new record for the DN shown in the [DN] field above. These include fields for the record\'s passwords and for the record\'s components. All of the component fields can be edited manually or filled in automatically.</P>';
	r += '<P>Key, Generator and Owner hashes can be produced with the help of passwords. There are two options available: one password for all three components or a separate password for each component. Two checkboxes in the lower part of the window are provided for switchingbetween these options.</P>';
	r += '<P>Typing in the password fields causes the Client to produce Key, Generator and Owner components of the new record. The newly generated values will be displayed in the corresponding fields above the [Submit] button.</P>';
	r += '<P>Once the components of the new record are known (either generated automatically or entered manually), the Client checks if this record can be linked to the previous record in a chain. A message, containing the result of the check is displayed at the bottom of the tab window. The Client may not have enough information to perform such a check in which case the corresponding message is also displayed. If, however, the check returns a negative result, a red frame around the [Submit] button will be shown. A green frame indicates that the check was successful. Pressing the [Submit] button causes the Client to send a command to the server to add a new record to the DN\'s chain. The result of this command (success or failure) will be displayed at the bottom of the window.</P>';
	r += '</td>';
	r += '</tr>';
	r += '</table>';	
	r += '</div>';

	r += '<H3>Hash calc tab</H3>';
	r += '<div>';
	r += '<table>';
	r += '<tr>';
	r += '<td>';	
	r += '<P>This tab provides users with a handy hash calculator. The types of hash functions supported include MD5, RIPEMD-160, SHA2-256, SHA2-512 and WORD.</P>';
	r += '<P>WORD is a Hasq own hash type. Records built with the use of WORD are short, which makes them easy to read/print. This makes WORD an ideal hash type for anyone who wants to better understand how records link to each other and needs to use hashes in their calculations/modelling. WORD can also be used by developers as a temporary replacement for other hashes while they debug their source code. Due to the short length of WORD hashes (4 characters only), other real life applications are limited.</P>';
	r += '<P>The type of hash used by the calculator can be chosen by pressing a button at the top of the tab window. Text data whose hash value needs to be calculated should be typed in or copied into the area directly below the button. Every time the content of this area changes, its hash value is calculated and displayed in the window below.</P>';
	r += '<P>Three buttons at the bottom of the tab window are provided for user convenience. They copy the calculated hash value into the Key, Generator or Owner fields located in the \'Records\' tab. This may be handy if a user needs to manually calculate hash values for those fields.</P>';
	r += '</td>';
	r += '</tr>';
	r += '</table>';
	r += '</div>';

	r += '<H3>Command tab</H3>';
	r += '<div>';
	r += '<table>';
	r += '<tr>';
	r += '<td>';		
	r += '<P>The \'Command\' tab provides users with a way to communicate with Hasq servers directly. Any Hasq network command can be typed in the text field on the right-hand side of the [Send] button. Pressing the button causes the Client to send this command to the server. The complete server reply is displayed below.</P>';
	r += '</td>';
	r += '</tr>';
	r += '</table>';
	r += '</div>';
	
	r += '<H3>Tokens tab</H3>';
	r += '<div>';
	r += '<table>';
	r += '<tr>';
	r += '<td>';		
	r += '<P>Help coming soon</P>';
	r += '</td>';
	r += '</tr>';
	r += '</table>';	
	r += '<div id="tokens_tab_help_accordion">';
	
	r += '<H2>Create tab</H2>';
	r += '<div>';
	r += '<table>';
	r += '<tr>';
	r += '<td>';		
	r += '<P>\'Create\' tab help </P>';
	r += '</td>';
	r += '</tr>';
	r += '</table>';	
	r += '</div>';
	
	r += '<H2>Verify tab</H2>';
	r += '<div>';
	r += '<table>';
	r += '<tr>';
	r += '<td>';		
	r += '<P>\'Verify\' tab help </P>';
	r += '</td>';
	r += '</tr>';
	r += '</table>';	
	r += '</div>';
	
	r += '<H2>Data tab</H2>';
	r += '<div>';
	r += '<table>';
	r += '<tr>';
	r += '<td>';		
	r += '<P>\'Data\' tab help </P>';
	r += '</td>';
	r += '</tr>';
	r += '</table>';	
	r += '</div>';
	
	r += '<H2>Send tab</H2>';
	r += '<div>';
	r += '<table>';
	r += '<tr>';
	r += '<td>';	
	r += '<P>\'Send\' tab help </P>';
	r += '</td>';
	r += '</tr>';
	r += '</table>';	
	r += '</div>';
	
	r += '<H2>Receive tab</H2>';
	r += '<div>';
	r += '<table>';
	r += '<tr>';
	r += '<td>';		
	r += '<P>\'Receive\' tab help </P>';
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
