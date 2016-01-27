// Hasq Technology Pty Ltd (C) 2013-2015

function widTokensTab() {
    var r = '';
    var tabs = [];
    var item;

    item = {};
    item.title = 'Create';
    item.data = widTokensCreateTab();
    tabs[tabs.length] = item;

    item = {};
    item.title = 'Verify';
    item.data = widTokensVerifyTab();
    tabs[tabs.length] = item;

    item = {};
    item.title = 'Data';
    item.data = widTokensDataTab();
    tabs[tabs.length] = item;

    item = {};
    item.title = 'Send';
    item.data = widTokensSendTab();
    tabs[tabs.length] = item;

    item = {};
    item.title = 'Receive';
    item.data = widTokensReceiveTab();
    tabs[tabs.length] = item;

    r += '<table width="70%" border="0">\n';
    r += '<tr>\n';
    r += '<td width="100%">' + widTokensNamesAddArea() + '\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td width="100%">' + widProgressBarArea() + '\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td width="100%">' + widTokensTabWrite(tabs) + '\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td width="100%"><hr/>\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td width="100%">' + widLogArea() + '\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td width="100%"><hr/>\n';
    r += '</tr>\n';
    r += '</table>\n';

    return r;
}

function widTokensNamesAddArea(){
    var r = '';

    r += '<table width="100%" border="0">\n';
    //r += '<table border="0">\n';
    r += '<tr>\n';
    r += '<td width="100%">\n';
    r += '<table width="100%">\n';
    r += '<tr>\n';
    r += '<td width="100%">\n';
    r += '<textarea rows="3" type="text" id="tokens_names_textarea" maxlength="16511" oninput="widTokensNamesOninput(this.value);" placeholder="Enter tokens \[raw names\] or hashes here."></textarea>\n';
    r += '</tr>\n';
    r += '</table width="100%">\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td>\n';
    r += '<div id="tokens_range_gen_accordion">\n';
    r += '<h3>Add tokens range</h3>\n';
    r += '<div>\n';
    r += '<table>\n';
    r += '<tr>\n';
    r += '<td style="text-align:left">Base name&nbsp\n';
    r += '<td colspan="3" style="text-align:left"><input type="text" size="24" id="tokens_basename_input" value="">\n';
    r += '<td style="text-align:right" rowspan="2"><button id="tokens_add_button" data-title="Add" onclick="widMainButtonClick(this.id)">Add</button>\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td style="text-align:left">Start index&nbsp\n';
    r += '<td style="text-align:left"><input type="text" size="3" id="tokens_first_idx_input" oninput="widTokensIdxOninput(this.id, this.value)">\n';
    r += '<td style="text-align:right">End index\n';
    r += '<td style="text-align:right"><input type="text" size="3" id="tokens_last_idx_input" oninput="widTokensIdxOninput(this.id, this.value)">\n';
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

function widProgressBarArea(){
    var r = '';
    r += '<div id="tokens_progressbar" style="text-align:center">\n<div class="tokens-progressbar-label" style="text-align:center">\n</div>\n</div>\n';
    return r;
}


function widLogArea(){
    var r = '';
    r += '<pre id="tokens_log_pre">&nbsp</pre>\n';
    return r;
}

function widTokensTabWrite(items) {
    var r = '';
    r += '<div id="tokens_tabs">\n';

    r += '\t<ul>\n';
    for (var i = 0; i < items.length; i++)
        r += '\t<li style="list-style-type:none;"><a href="#tokens_tabs-' + (i + 1) + '">' + items[i].title + '</a>\n';

    r += '\t</ul>\n';

    for (var i = 0; i < items.length; i++)
        r += '\t<div id="tokens_tabs-' + (i + 1) + '">\n' + items[i].data + '</div>\n';

    r += '</div>\n';

    return r;
}

function widTokensCreateTab() {
    var r = '';
    r += '<div data-class="div">\n';
    r += '<table width="100%">\n';
    r += '<tr>\n';
    r += '<td style="text-align:left"><button id="tokens_create_button" data-class="main" data-title="Create" onclick="widMainButtonClick(this.id)">Create</button>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</div>\n';
    return r;
}

function widTokensVerifyTab() {
    var r = '';
    r += '<div data-class="div">\n';
    r += '<table>\n';
    r += '<tr>\n';
    r += '<td style="text-align:left">\n';
    r += '<button data-title="Verify" data-class="main" id="tokens_verify_button" onclick="widMainButtonClick(this.id)">Verify</button>\n';
    r += '<td style="text-align:left">\n<div id="tokens_verify_led_div">\n</div>\n';
    r += '</tr>\n';
    r += '</table">\n';
    r += '<table width="100%">\n';
    r += '<tr>\n';
    r += '<td width="100%" colspan="2">\n<div class="verify-table-div" id="tokens_verify_hidden_div">\n';
    r += '<table id="tokens_verify_table" border="1" style="font-family:monospace;">\n';
    r += '<tr><th>Status</th><th>Raw name</th><th>Hash</th><th>Last rec. N</th><th>Data</th></tr>\n';
    r += '</table>\n';
    r += '</div>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</div>\n';

    return r;
}

function widTokensDataTab() {
    var r = '';

    r += '<div data-class="div">\n';
    r += '<table border="0">\n';
    r += '<tr>\n';
    r += '<td style="text-align:left">New data&nbsp;\n';
    r += '<td style="text-align:right"><input type="text" id="tokens_data_newdata_input" size="28" title="Enter a new data." value="">\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td colspan="2" align="right">\n';
    r += '<button id="tokens_data_continue_button" data-title="Continue" data-class="hide" onclick="widContinueButtonClick(this.id, true)">Hidden</button>\n';
    r += '<button id="tokens_data_update_button" data-title="Update" data-class="main" onclick="widMainButtonClick(this.id)">Update</button>\n';
    r += '<td data-class="hide" id="tokens_data_warning_text" style="background:pink" colspan="3" align="center">\n';
    r += '<pre>The specified range contains unknown tokens. Continue?</pre>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</div>\n';
    return r;
}

function widTokensSendTab() {
    var r = '';
    r += '<div id="tokens_send_accordion">\n';
    r += '<h3>Scenario 1: Simple send</h3>\n';
    r += widTokensSS1();
    r += '<h3>Scenario 2: Simple accept</h3>\n';
    r += widTokensSS2();
    r += '<h3>Scenario 3: Blocking send</h3>\n';
    r += widTokensSS3();
    r += '<h3>Scenario 4: Blocking accept</h3>\n';
    r += widTokensSS4();
    r += '</div>\n';

    return r;
}

function widTokensSS1() {
    var r = '';

    r += '<div>\n';
    r += '<div data-class="div" id="divSS1">\n';
    r += '<table width="100%">\n';
    r += '<tr>\n';
    r += '<td>\n';
    r += '<table>\n';
    r += '<tr>\n';
    r += '<td style="text-align:left">\n';
    r += '<button id="tokens_ss1_continue_button" data-title="Continue" data-class="hide" onclick="widContinueButtonClick(this.id, true)">Hidden</button>\n';
    r += '<button id="tokens_ss1_showkeys_button" data-title="Initiate" data-class="main" onclick="widMainButtonClick(this.id)">Initiate</button>\n';
    r += '<td style="text-align:left">\n';
    r += '<div id="tokens_ss1_led_div"></div>\n';
    r += '<td id="tokens_ss1_warning_text" data-class="hide" style="background:pink" colspan="3" align="center">\n';
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

function widTokensSS2() {
    var r = '';

    r += '<div>\n';

    r += '<div data-class="div" id="divSS2">\n';
    r += '<table width="100%" >\n';
    r += '<tr>\n';
    r += '<td>\n';
    r += '<table width="100%">\n';
    r += '<tr rowspan="5">\n';
    r += '<td colspan="2">\n';
    r += '<textarea wrap="off" rows="5" type="text" maxlength="66435" id="tokens_ss2_textarea"></textarea>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td align="right">\n';
    r += '<table>\n';
    r += '<tr>\n';
    r += '<td id="tokens_ss2_warning_text" data-class="hide" style="background:pink" colspan="3" align="center">\n';
    r += '<pre>Tokens names will be updated. Continue?</pre>\n';
    r += '<td align="right">\n';
    r += '<div id="tokens_ss2_led_div">\n</div>\n';
    r += '<td align="right">\n';
    r += '<button id="tokens_ss2_continue_button" data-title="Continue" data-class="hide" onclick="widContinueButtonClick(this.id, true)">Hidden</button>\n';
    r += '<button id="tokens_ss2_obtainkeys_button" data-title="Finalize" data-class="main" onclick="widMainButtonClick(this.id)">Finalize</button>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</div>\n';

    r += '</div>\n';

    return r;
}

function widTokensSS3() {
    var r = '';
    r += '<div>\n';

    r += '<div data-class="div" id="divSS3S1">\n';
    r += '<table width="100%">\n';
    r += '<tr>\n';
    r += '<td>\n';
    r += '<table>\n';
    r += '<tr>\n';
    r += '<td style="text-align:left">\n';
    r += '<button id="tokens_ss3_s1_showkeys_button" data-title="Initiate Step 1" data-class="main" onclick="widMainButtonClick(this.id)">Initiate Step 1</button>\n';
    r += '<td style="text-align:left">\n';
    r += '<div id="tokens_ss3_s1_led_div">\n</div>\n';
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

    r += '<div data-class="div" id="divSS3S2">\n';
    r += '<table width="100%">\n';
    r += '<tr>\n';
    r += '<td>\n';
    r += '<table>\n';
    r += '<tr>\n';
    r += '<td style="text-align:left">\n';
    r += '<button id="tokens_ss3_s2_showkeys_button" data-title="Initiate Step 2" data-class="main" onclick="widMainButtonClick(this.id)">Initiate Step 2</button>\n';
    r += '<td style="text-align:left">\n';
    r += '<div id="tokens_ss3_s2_led_div"></div>\n';
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

function widTokensSS4() {
    var r = '';
    r += '<div>\n';

    r += '<div data-class="div" id="divSS4S1">\n';
    r += '<table width="100%" >\n';
    //r += '<table border="0">\n';
    r += '<tr>\n';
    r += '<td>\n';
    r += '<table width="100%">\n';
    r += '<tr rowspan="5">\n';
    r += '<td colspan="3">\n';
    r += '<textarea wrap="off" rows="5" type="text" maxlength="66435" id="tokens_ss4_s1_textarea"></textarea>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td align="right">\n';
    r += '<table border="0">\n';
    r += '<tr>\n';
    r += '<td id="tokens_ss4_s1_warning_text" data-class="hide" style="background:pink" colspan="3" align="center">\n';
    r += '<pre>Tokens names will be updated. Continue?</pre>\n';
    r += '<td align="left">\n';
    r += '<div id="tokens_ss4_s1_led_div"></div>\n';
    r += '<td align="right">\n';
    r += '<button id="tokens_ss4_s1_continue_button" data-title="Continue" data-class="hide" onclick="widContinueButtonClick(this.id, true)">Hidden</button>\n';
    r += '<button id="tokens_ss4_s1_obtainkeys_button" data-title="Finalize Step 1" data-class="main" onclick="widMainButtonClick(this.id)">Finalize Step 1</button>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</div>\n';

    r += '<div data-class="div" id="divSS4S2">\n';
    r += '<table width="100%" >\n';
    r += '<tr>\n';
    r += '<td>\n';
    r += '<table width="100%">\n';
    r += '<tr rowspan="5">\n';
    r += '<td colspan="3">\n';
    r += '<textarea wrap="off" rows="5" type="text" maxlength="66435" id="tokens_ss4_s2_textarea"></textarea>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td align="right">\n';
    r += '<table border="0">\n';
    r += '<tr>\n';
    r += '<td id="tokens_ss4_s2_warning_text" data-class="hide" style="background:pink" colspan="3" align="center">\n';
    r += '<pre>Tokens names will be updated. Continue?</pre>\n';
    r += '<td align="left">\n';
    r += '<div id="tokens_ss4_s2_led_div"></div>\n';
    r += '<td align="right">\n';
    r += '<button id="tokens_ss4_s2_continue_button" data-title="Continue" data-class="hide" onclick="widContinueButtonClick(this.id, true)">Hidden</button>\n';
    r += '<button id="tokens_ss4_s2_obtainkeys_button" data-title="Finalize Step 2" data-class="main" onclick="widMainButtonClick(this.id)">Finalize Step 2</button>\n';

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
    r += widTokensRS1();
    r += '<h3>Scenario 2: Simple request</h3>\n';
    r += widTokensRS2();
    r += '<h3>Scenario 3: Blocking receive</h3>\n';
    r += widTokensRS3();
    r += '<h3>Scenario 4: Blocking request</h3>\n';
    r += widTokensRS4();
    r += '</div>\n';

    return r;
}

function widTokensRS1() {
    var r = '';
    r += '<div>\n';

    r += '<div data-class="div" id="divRS1">\n';
    r += '<table width="100%" >\n';
    r += '<tr>\n';
    r += '<td>\n';
    r += '<table width="100%">\n';
    r += '<tr rowspan="5">\n';
    r += '<td colspan="3">\n';
    r += '<textarea wrap="off" rows="5" type="text" maxlength="66435" id="tokens_rs1_textarea"></textarea>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td align="right">\n';
    r += '<table  border="0">\n';
    r += '<tr>\n';
    r += '<td id="tokens_rs1_warning_text" data-class="hide" style="background:pink" colspan="3" align="center">\n';
    r += '<pre>Tokens names will be updated. Continue?</pre>\n';
    r += '<td align="left">\n';
    r += '<div id="tokens_rs1_led_div"></div>\n';
    r += '<td align="right">\n';
    r += '<button id="tokens_rs1_continue_button" data-title="Continue" data-class="hide" onclick="widContinueButtonClick(this.id, true)">Hidden</button>\n';
    r += '<button id="tokens_rs1_obtainkeys_button" data-title="Finalize" data-class="main" onclick="widMainButtonClick(this.id)">Finalize</button>\n';

    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</div>\n';

    r += '</div>\n';
    return r;
}

function widTokensRS2(){
    var r = '';

    r += '<div>\n';

    r += '<div data-class="div" id="divRS2">\n';
    r += '<table width="100%">\n';
    r += '<tr>\n';
    r += '<td>\n';
    r += '<table>\n';
    r += '<tr>\n';
    r += '<td style="text-align:left">\n';
    r += '<button id="tokens_rs2_continue_button" data-title="Continue" data-class="hide" onclick="widContinueButtonClick(this.id, true)">Hidden</button>\n';
    r += '<button id="tokens_rs2_showkeys_button" data-title="Initiate" data-class="main" onclick="widMainButtonClick(this.id)">Initiate</button>\n';
    r += '<td style="text-align:left">\n';
    r += '<div id="tokens_rs2_led_div"></div>\n';
    r += '<td id="tokens_rs2_warning_text" data-class="hide" style="background:pink" colspan="3" align="center">\n';
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

function widTokensRS3() {
    var r = '';
    r += '<div>\n';

    r += '<div data-class="div" id="divRS3S1">\n';
    r += '<table width="100%" >\n';
    //r += '<table border="0">\n';
    r += '<tr>\n';
    r += '<td>\n';
    r += '<table width="100%">\n';
    r += '<tr rowspan="5">\n';
    r += '<td colspan="3">\n';
    r += '<textarea wrap="off" rows="5" type="text" maxlength="66435" id="tokens_rs3_s1_textarea"></textarea>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td align="right">\n';
    r += '<table border="0">\n';
    r += '<tr>\n';
    r += '<td id="tokens_rs3__s1_warning_text" data-class="hide" style="background:pink" colspan="3" align="center">\n';
    r += '<pre>Tokens names will be updated. Continue?</pre>\n';
    r += '<td align="left">\n';
    r += '<div id="tokens_rs3_s1_led_div"></div>\n';
    r += '<td align="right">\n';
    r += '<button id="tokens_rs3_s1_continue_button" data-title="Continue" data-class="hide" onclick="widContinueButtonClick(this.id, true)">Hidden</button>\n';
    r += '<button id="tokens_rs3_s1_obtainkeys_button" data-title="Finalize Step 1" data-class="main" onclick="widMainButtonClick(this.id)">Finalize Step 1</button>\n';

    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</div>\n';

    r += '<div data-class="div" id="divRS3S2">\n';
    r += '<table width="100%" >\n';
    r += '<tr>\n';
    r += '<td>\n';
    r += '<table width="100%">\n';
    r += '<tr rowspan="5">\n';
    r += '<td colspan="3">\n';
    r += '<textarea wrap="off" rows="5" type="text" maxlength="66435" id="tokens_rs3_s2_textarea"></textarea>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td align="right">\n';
    r += '<table border="0">\n';
    r += '<tr>\n';
    r += '<td id="tokens_rs3_s2_warning_text" data-class="hide" style="background:pink" colspan="3" align="center">\n';
    r += '<pre>Tokens names will be updated. Continue?</pre>\n';
    r += '<td align="left">\n';
    r += '<div id="tokens_rs3_s2_led_div"></div>\n';
    r += '<td align="right">\n';
    r += '<button id="tokens_rs3_s2_continue_button" data-title="Continue" data-class="hide" onclick="widContinueButtonClick(this.id, true)">Hidden</button>\n';
    r += '<button id="tokens_rs3_s2_obtainkeys_button" data-title="Finalize Step 2" data-class="main" onclick="widMainButtonClick(this.id)">Finalize Step 2</button>\n';

    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</div>\n';

    r += '</div>\n';
    return r;
}

function widTokensRS4() {
    var r = '';
    r += '<div>\n';

    r += '<div data-class="div" id="divRS4S1">\n';
    r += '<table width="100%">\n';
    r += '<tr>\n';
    r += '<td>\n';
    r += '<table>\n';
    r += '<tr>\n';
    r += '<td style="text-align:left">\n';
    r += '<button id="tokens_rs4_s1_showkeys_button" data-title="Initiate Step 1" data-class="main" onclick="widMainButtonClick(this.id)">Initiate Step 1</button>\n';
    r += '<td style="text-align:left">\n';
    r += '<div id="tokens_rs4_s1_led_div"></div>\n';
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

    r += '<div data-class="div" id="divRS4S2">\n';
    r += '<table width="100%">\n';
    r += '<tr>\n';
    r += '<td>\n';
    r += '<table>\n';
    r += '<tr>\n';
    r += '<td style="text-align:left">\n';
    r += '<button id="tokens_rs4_s2_showkeys_button" data-title="Initiate Step 2" data-class="main" onclick="widMainButtonClick(this.id)">Initiate Step 2</button>\n';
    r += '<td style="text-align:left">\n';
    r += '<div id="tokens_rs4_s2_led_div"></div>\n';
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