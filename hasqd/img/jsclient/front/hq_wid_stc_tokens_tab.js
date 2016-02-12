// Hasq Technology Pty Ltd (C) 2013-2016

function widGetHTMLTokensTab() {
    var r = '';
    var tabs = [];
    var item;

    item = {};
    item.title = 'Create';
    item.data = widGetHTMLTokensCreateTab();
    tabs[tabs.length] = item;

    item = {};
    item.title = 'Verify';
    item.data = widGetHTMLTokensVerifyTab();
    tabs[tabs.length] = item;

    item = {};
    item.title = 'Data';
    item.data = widGetHTMLTokensDataTab();
    tabs[tabs.length] = item;

    item = {};
    item.title = 'Send';
    item.data = widGetHTMLTokensSendTab();
    tabs[tabs.length] = item;

    item = {};
    item.title = 'Receive';
    item.data = widTokensReceiveTab();
    tabs[tabs.length] = item;

	r = widGetHTMLTokensTabBody(tabs);
    return r;
}

function widGetHTMLTokensTabBody(tabs){
	var r = '';
    
	r += '<table width="70%" border="0">\n';
    r += '<tr>\n';
    r += '<td width="100%">' + widGetHTMLTokensInitialData() + '\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td width="100%">' + widGetHTMLTokensProgressbar() + '\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td width="100%">' + widGetHTMLTokensTabWrite(tabs) + '\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td width="100%"><hr/>\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td width="100%">' + widGetHTMLTokensLog() + '\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td width="100%"><hr/>\n';
    r += '</tr>\n';
    r += '</table>\n';	
	
	return r;
}
function widGetHTMLTokensTabWrite(items) {
    var r = '';
    r += '<div id="tokens_tabs">\n';

    r += '\t<ul>\n';
    for (var i = 0; i < items.length; i++)
        r += '\t<li style="list-style-type:none;"><a href="#tokens_tabs-' + (i + 1) + '_div">' + items[i].title + '</a>\n';

    r += '\t</ul>\n';

    for (var i = 0; i < items.length; i++)
        r += '\t<div id="tokens_tabs-' + (i + 1) + '_div">\n' + items[i].data + '</div>\n';

    r += '</div>\n';

    return r;
}

function widGetHTMLTokensInitialData() {
    var r = '';

    r += '<table width="100%" border="0">\n';
    //r += '<table border="0">\n';
    r += '<tr>\n';
    r += '<td width="100%">\n';
    r += '<table width="100%">\n';
    r += '<tr>\n';
    r += '<td width="100%">\n';
    r += '<textarea rows="3" type="text" id="tokens_names_textarea" maxlength="16511" oninput="widTokensNamesOninput($(this));" placeholder="Enter tokens \[raw names\] or hashes here."></textarea>\n';
    r += '</tr>\n';
    r += '</table width="100%">\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td>\n';
    r += '<div id="tokens_add_range_accordion">\n';
    r += '<h3>Add tokens range</h3>\n';
    r += '<div>\n';
    r += '<table>\n';
    r += '<tr>\n';
    r += '<td style="text-align:left">Base name&nbsp\n';
    r += '<td colspan="3" style="text-align:left"><input type="text" size="24" id="tokens_basename_input" value="">\n';
    r += '<td style="text-align:right" rowspan="2">\n';
	r += '<button onclick="widMainButtonClick($(this))" data-title="Add" data-function="widAddTokens">Add</button>\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td style="text-align:left">Start index&nbsp\n'; 
    r += '<td style="text-align:left"><input type="text" size="3" id="tokens_first_idx_input" oninput="return $(this).val(engGetOnlyNumber($(this).val()))">\n';
    r += '<td style="text-align:right">End index\n';
    r += '<td style="text-align:right"><input type="text" size="3" id="tokens_last_idx_input" oninput="return $(this).val(engGetOnlyNumber($(this).val()))">\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</div>\n';
    r += '</div>\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td>\n';
    r += '<table>\n';
    r += '<tr>\n';
    r += '<td style="text-align:left">Password&nbsp\n';
    r += '<td style="text-align:left"><input type="text" id="tokens_password_input" size="24" placeholder="Enter a password" oninput="widTokensPasswordOninput(this.value);">\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';

    r += '</table>\n';

    return r;
}

function widGetHTMLTokensProgressbar() {
    var r = '';
    r += '<div id="tokens_progressbar" style="text-align:center">\n<div class="tokens-progressbar-label" style="text-align:center">\n</div>\n</div>\n';
    return r;
}


function widGetHTMLTokensLog() {
    var r = '';
    r += '<pre id="tokens_log_pre">&nbsp</pre>\n';
    return r;
}


function widGetHTMLTokensCreateTab() {
    var r = '';
    r += '<div data-class="capsule">\n';
    r += '<table width="100%">\n';
    r += '<tr>\n';
    r += '<td style="text-align:left"><button data-class="shared_button" data-title="Create" data-function="widPreCreate" onclick="widMainButtonClick($(this))">Create</button>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</div>\n';
    return r;
}

function widGetHTMLTokensVerifyTab() {
    var r = '';
    r += '<div data-class="capsule">\n';
    r += '<table>\n';
    r += '<tr>\n';
    r += '<td style="text-align:left">\n';
    r += '<button  id="tokens_verify_button" data-title="Verify" data-class="shared_button" data-function="widPreVerify" onclick="widMainButtonClick($(this))">Verify</button>\n';
    r += '<td style="text-align:left"><div data-class="led_div"></div>\n';
    r += '</tr>\n';
    r += '</table">\n';
    r += '<table width="100%">\n';
    r += '<tr>\n';
    r += '<td width="100%" colspan="2">\n<div class="verify-table" id="tokens_verify_table_div">\n';
    r += '<table id="tokens_verify_table" border="1" style="font-family:monospace;">\n';
    r += '<tr><th>Status</th><th>Raw name</th><th>Hash</th><th>Last rec. N</th><th>Data</th></tr>\n';
    r += '</table>\n';
    r += '</div>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</div>\n';

    return r;
}

function widGetHTMLTokensDataTab() {
    var r = '';

    r += '<div data-class="capsule">\n';
    r += '<table border="0">\n';
    r += '<tr>\n';
    r += '<td style="text-align:left">New data&nbsp;\n';
    r += '<td style="text-align:right"><input type="text" id="tokens_data_newdata_input" size="28" title="Enter a new data." value="">\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td colspan="2" align="right">\n';
    r += '<button data-title="Continue" data-class="continue_button" onclick="widContinueButtonClick($(this), true)">Hidden</button>\n';
    r += '<button data-function="widPreUpdate" onclick="widMainButtonClick($(this))" data-title="Update" data-class="shared_button">Update</button>\n';
    r += '<td data-class="warning_text" style="background:pink" colspan="3" align="center">\n';
    r += '<pre>The specified range contains unknown tokens. Continue?</pre>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</div>\n';
    return r;
}

function widGetHTMLTokensSendTab() {
    var r = '';
    r += '<div id="tokens_send_accordion">\n';
    r += '<h3>Scenario 1: Simple send</h3>\n';
    r += widGetHTMLTokensSS1();
    r += '<h3>Scenario 2: Simple accept</h3>\n';
    r += widGetHTMLTokensSS2();
    r += '<h3>Scenario 3: Blocking send</h3>\n';
    r += widGetHTMLTokensSS3();
    r += '<h3>Scenario 4: Blocking accept</h3>\n';
    r += widGetHTMLTokensSS4();
    r += '</div>\n';

    return r;
}

function widGetHTMLTokensSS1() {
    var r = '';

    r += '<div id="SS1_div">\n';
    r += '<div data-class="capsule">\n';
    r += '<table width="100%">\n';
    r += '<tr>\n';
    r += '<td>\n';
    r += '<table>\n';
    r += '<tr>\n';
    r += '<td style="text-align:left">\n';
    r += '<button data-title="Continue" data-class="continue_button" onclick="widContinueButtonClick($(this), true)">Hidden</button>\n';
    r += '<button data-function="widPreSimpleSend" data-title="Initiate" data-class="shared_button" onclick="widMainButtonClick($(this))">Initiate</button>\n';
    r += '<td style="text-align:left">\n';
    r += '<div id="tokens_ss1_led_div" data-class="led_div"></div>\n';
    r += '<td data-class="warning_text" style="background:pink" colspan="3" align="center">\n';
    r += '<pre>Tokens names will be updated. Continue?</pre>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td>\n';
    r += '<table width="100%">\n';
    r += '<tr rowspan="5">\n';
    r += '<td>\n';
    r += '<textarea wrap="off" rows="5" type="text" id="tokens_ss1_textarea" readonly></textarea>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</div>\n';
    r += '</div>\n';

    return r;
}

function widGetHTMLTokensSS2() {
    var r = '';

    r += '<div id="SS2_div">\n';

    r += '<div data-class="capsule">\n';
    r += '<table width="100%" >\n';
		r += '<tr>\n';
			r += '<td>\n';
				r += '<table width="100%">\n';
					r += '<tr rowspan="5">\n';
						r += '<td colspan="2">\n';
							r += '<textarea wrap="off" rows="5" type="text" maxlength="66435" oninput="objLed.empty($(this));" id="tokens_ss2_textarea"></textarea>\n';
					r += '</tr>\n';
				r += '</table>\n';
			r += '</tr>\n';
			r += '<tr>\n';
				r += '<td align="right">\n';
					r += '<table>\n';
						r += '<tr>\n';
							r += '<td data-class="warning_text" style="background:pink" colspan="3" align="center">\n';
								r += '<pre>Tokens names will be updated. Continue?</pre>\n';
							r += '<td align="right">\n';
								r += '<div id="tokens_ss2_led_div" data-class="led_div">\n</div>\n';
							r += '<td align="right">\n';
								r += '<button data-title="Continue" data-class="continue_button" onclick="widContinueButtonClick($(this), true)">Hidden</button>\n';
								r += '<button data-function="widPreSimpleAccept" data-title="Finalize" data-class="shared_button" onclick="widMainButtonClick($(this))">Finalize</button>\n';
						r += '</tr>\n';
					r += '</table>\n';
			r += '</tr>\n';
		r += '</table>\n';
    r += '</div>\n';

    r += '</div>\n';

    return r;
}

function widGetHTMLTokensSS3() {
    var r = '';
    r += '<div id="SS3_div">\n';

    r += '<div data-class="capsule">\n';
    r += '<table width="100%">\n';
    r += '<tr>\n';
    r += '<td>\n';
    r += '<table>\n';
    r += '<tr>\n';
    r += '<td style="text-align:left">\n';
    r += '<button data-function="widPreBlockingSendStep1" data-title="Initiate Step 1" data-class="shared_button" onclick="widMainButtonClick($(this))">Initiate Step 1</button>\n';
    r += '<td style="text-align:left">\n';
    r += '<div id="tokens_ss3_s1_led_div" data-class="led_div">\n</div>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td>\n';
    r += '<table width="100%">\n';
    r += '<tr rowspan="5">\n';
    r += '<td>\n';
    r += '<textarea wrap="off" rows="5" type="text" id="tokens_ss3_s1_textarea" readonly></textarea>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</div>\n';

    r += '<div data-class="capsule">\n';
    r += '<table width="100%">\n';
    r += '<tr>\n';
    r += '<td>\n';
    r += '<table>\n';
    r += '<tr>\n';
    r += '<td style="text-align:left">\n';
    r += '<button data-function="widPreBlockingSendStep2" data-title="Initiate Step 2" data-class="shared_button" onclick="widMainButtonClick($(this))">Initiate Step 2</button>\n';
    r += '<td style="text-align:left">\n';
    r += '<div id="tokens_ss3_s2_led_div" data-class="led_div"></div>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td>\n';
    r += '<table width="100%">\n';
    r += '<tr rowspan="5">\n';
    r += '<td>\n';
    r += '<textarea wrap="off" rows="5" type="text" id="tokens_ss3_s2_textarea" readonly></textarea>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</div>\n';

    r += '</div>\n';
    return r;
}

function widGetHTMLTokensSS4() {
    var r = '';
    r += '<div id="SS4_div">\n';

    r += '<div data-class="capsule">\n';
    r += '<table width="100%" >\n';
    r += '<tr>\n';
    r += '<td>\n';
    r += '<table width="100%">\n';
    r += '<tr rowspan="5">\n';
    r += '<td colspan="3">\n';
    r += '<textarea wrap="off" rows="5" type="text" maxlength="66435" oninput="objLed.empty($(this));" id="tokens_ss4_s1_textarea"></textarea>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td align="right">\n';
    r += '<table border="0">\n';
    r += '<tr>\n';
    r += '<td data-class="warning_text" style="background:pink" colspan="3" align="center">\n';
    r += '<pre>Tokens names will be updated. Continue?</pre>\n';
    r += '<td align="left">\n';
    r += '<div id="tokens_ss4_s1_led_div" data-class="led_div"></div>\n';
    r += '<td align="right">\n';
    r += '<button data-title="Continue" data-class="continue_button" onclick="widContinueButtonClick($(this), true)">Hidden</button>\n';
    r += '<button data-function="widPreBlockingAcceptStep1" data-title="Finalize Step 1" data-class="shared_button" onclick="widMainButtonClick($(this))">Finalize Step 1</button>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</div>\n';

    r += '<div data-class="capsule">\n';
    r += '<table width="100%" >\n';
    r += '<tr>\n';
    r += '<td>\n';
    r += '<table width="100%">\n';
    r += '<tr rowspan="5">\n';
    r += '<td colspan="3">\n';
    r += '<textarea wrap="off" rows="5" type="text" maxlength="66435" oninput="objLed.empty($(this));" id="tokens_ss4_s2_textarea"></textarea>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td align="right">\n';
    r += '<table border="0">\n';
    r += '<tr>\n';
    r += '<td data-class="warning_text" style="background:pink" colspan="3" align="center">\n';
    r += '<pre>Tokens names will be updated. Continue?</pre>\n';
    r += '<td align="left">\n';
    r += '<div id="tokens_ss4_s2_led_div" data-class="led_div"></div>\n';
    r += '<td align="right">\n';
    r += '<button data-title="Continue" data-class="continue_button" onclick="widContinueButtonClick($(this), true)">Hidden</button>\n';
    r += '<button data-function="widPreBlockingAcceptStep2" data-title="Finalize Step 2" data-class="shared_button" onclick="widMainButtonClick($(this))">Finalize Step 2</button>\n';

    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</div>\n';

    r += '</div>\n';
    return r;
}

function widTokensReceiveTab() {
    var r = '';
    r += '<div id="tokens_receive_accordion">\n';
    r += '<h3>Scenario 1: Simple receive</h3>\n';
    r += widGetHTMLTokensRS1();
    r += '<h3>Scenario 2: Simple request</h3>\n';
    r += widGetHTMLTokensRS2();
    r += '<h3>Scenario 3: Blocking receive</h3>\n';
    r += widGetHTMLTokensRS3();
    r += '<h3>Scenario 4: Blocking request</h3>\n';
    r += widGetHTMLTokensRS4();
    r += '</div>\n';

    return r;
}

function widGetHTMLTokensRS1() {
    var r = '';
    r += '<div id="RS1_div">\n';

    r += '<div data-class="capsule">\n';
    r += '<table width="100%" >\n';
    r += '<tr>\n';
    r += '<td>\n';
    r += '<table width="100%">\n';
    r += '<tr rowspan="5">\n';
    r += '<td colspan="3">\n';
    r += '<textarea wrap="off" rows="5" type="text" maxlength="66435" oninput="objLed.empty($(this));" id="tokens_rs1_textarea"></textarea>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td align="right">\n';
    r += '<table  border="0">\n';
    r += '<tr>\n';
    r += '<td data-class="warning_text" style="background:pink" colspan="3" align="center">\n';
    r += '<pre>Tokens names will be updated. Continue?</pre>\n';
    r += '<td align="left">\n';
    r += '<div id="tokens_rs1_led_div" data-class="led_div"></div>\n';
    r += '<td align="right">\n';
    r += '<button data-title="Continue" data-class="continue_button" onclick="widContinueButtonClick($(this), true)">Hidden</button>\n';
    r += '<button data-function="widPreSimpleReceive" data-title="Finalize" data-class="shared_button" onclick="widMainButtonClick($(this))">Finalize</button>\n';

    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</div>\n';

    r += '</div>\n';
    return r;
}

function widGetHTMLTokensRS2() {
    var r = '';

    r += '<div id="RS2_div">\n';

    r += '<div data-class="capsule">\n';
    r += '<table width="100%">\n';
    r += '<tr>\n';
    r += '<td>\n';
    r += '<table>\n';
    r += '<tr>\n';
    r += '<td style="text-align:left">\n';
    r += '<button data-title="Continue" data-class="continue_button" onclick="widContinueButtonClick($(this), true)">Hidden</button>\n';
    r += '<button data-function="widPreSimpleRequest" data-title="Initiate" data-class="shared_button" onclick="widMainButtonClick($(this))">Initiate</button>\n';
    r += '<td style="text-align:left">\n';
    r += '<div id="tokens_rs2_led_div" data-class="led_div"></div>\n';
    r += '<td data-class="warning_text" style="background:pink" colspan="3" align="center">\n';
    r += '<pre>Tokens names will be updated. Continue?</pre>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td>\n';
    r += '<table width="100%">\n';
    r += '<tr rowspan="5">\n';
    r += '<td>\n';
    r += '<textarea wrap="off" rows="5" type="text" id="tokens_rs2_textarea" readonly></textarea>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</div>\n';

    r += '</div>\n';

    return r;
}

function widGetHTMLTokensRS3() {
    var r = '';
    r += '<div id="RS3_div">\n';

    r += '<div data-class="capsule"">\n';
		r += '<table width="100%" >\n';
			r += '<tr>\n';
				r += '<td>\n';
					r += '<table width="100%">\n';
						r += '<tr rowspan="5">\n';
							r += '<td colspan="3">\n';
								r += '<textarea wrap="off" rows="5" type="text" maxlength="66435" oninput="objLed.empty($(this));" id="tokens_rs3_s1_textarea"></textarea>\n';
						r += '</tr>\n';
					r += '</table>\n';
			r += '</tr>\n';
			r += '<tr>\n';
				r += '<td align="right">\n';
					r += '<table border="0">\n';
						r += '<tr>\n';
							r += '<td data-class="warning_text" style="background:pink" colspan="3" align="center">\n';
								r += '<pre>Tokens names will be updated. Continue?</pre>\n';
							r += '<td align="left">\n';
								r += '<div id="tokens_rs3_s1_led_div" data-class="led_div"></div>\n';
							r += '<td align="right">\n';
								r += '<button data-title="Continue" data-class="continue_button" onclick="widContinueButtonClick($(this), true)">Hidden</button>\n';
								r += '<button data-function="widPreBlockingReceiveStep1" data-title="Finalize Step 1" data-class="shared_button" onclick="widMainButtonClick($(this))">Finalize Step 1</button>\n';

						r += '</tr>\n';
					r += '</table>\n';
			r += '</tr>\n';
		r += '</table>\n';
    r += '</div>\n';

    r += '<div data-class="capsule">\n';
		r += '<table width="100%" >\n';
			r += '<tr>\n';
				r += '<td>\n';
					r += '<table width="100%">\n';
						r += '<tr rowspan="5">\n';
							r += '<td colspan="3">\n';
								r += '<textarea wrap="off" rows="5" type="text" maxlength="66435" oninput="objLed.empty($(this));" id="tokens_rs3_s2_textarea"></textarea>\n';
						r += '</tr>\n';
					r += '</table>\n';
			r += '</tr>\n';
			r += '<tr>\n';
				r += '<td align="right">\n';
					r += '<table border="0">\n';
						r += '<tr>\n';
							r += '<td data-class="warning_text" style="background:pink" colspan="3" align="center">\n';
								r += '<pre>Tokens names will be updated. Continue?</pre>\n';
							r += '<td align="left">\n';
								r += '<div id="tokens_rs3_s2_led_div" data-class="led_div"></div>\n';
							r += '<td align="right">\n';
								r += '<button data-title="Continue" data-class="continue_button" onclick="widContinueButtonClick($(this), true)">Hidden</button>\n';
								r += '<button data-function="widPreBlockingReceiveStep2" data-title="Finalize Step 2" data-class="shared_button" onclick="widMainButtonClick($(this))">Finalize Step 2</button>\n';

						r += '</tr>\n';
					r += '</table>\n';
			r += '</tr>\n';
		r += '</table>\n';
    r += '</div>\n';

    r += '</div>\n';
    return r;
}

function widGetHTMLTokensRS4() {
    var r = '';
    r += '<div id="RS4_div">\n';

    r += '<div data-class="capsule">\n';
    r += '<table width="100%">\n';
    r += '<tr>\n';
    r += '<td>\n';
    r += '<table>\n';
    r += '<tr>\n';
    r += '<td style="text-align:left">\n';
    r += '<button data-function="widPreBlockingRequestStep1" data-title="Initiate Step 1" data-class="shared_button" onclick="widMainButtonClick($(this))">Initiate Step 1</button>\n';
    r += '<td style="text-align:left">\n';
    r += '<div id="tokens_rs4_s1_led_div" data-class="led_div"></div>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td>\n';
    r += '<table width="100%">\n';
    r += '<tr rowspan="5">\n';
    r += '<td>\n';
    r += '<textarea wrap="off" rows="5" type="text" id="tokens_rs4_s1_textarea" readonly></textarea>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</div>\n';

    r += '<div data-class="capsule">\n';
    r += '<table width="100%">\n';
    r += '<tr>\n';
    r += '<td>\n';
    r += '<table>\n';
    r += '<tr>\n';
    r += '<td style="text-align:left">\n';
    r += '<button data-function="widPreBlockingRequestStep2" data-title="Initiate Step 2" data-class="shared_button" onclick="widMainButtonClick($(this))">Initiate Step 2</button>\n';
    r += '<td style="text-align:left">\n';
    r += '<div id="tokens_rs4_s2_led_div" data-class="led_div"></div>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td>\n';
    r += '<table width="100%">\n';
    r += '<tr rowspan="5">\n';
    r += '<td>\n';
    r += '<textarea wrap="off" rows="5" type="text" id="tokens_rs4_s2_textarea" readonly></textarea>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</div>\n';

    r += '</div>\n';
    return r;
}