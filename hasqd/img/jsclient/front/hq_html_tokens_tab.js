// Hasq Technology Pty Ltd (C) 2013-2016

function widGetHTMLTokensTabs()
{
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

function widGetHTMLTokensTabBody(tabs)
{
    var r = '';

    r += '<table >\n';
    r += '<tr>\n';
    r += '<td/>' + widGetHTMLTokensInitialData() + '\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td/>' + widGetHTMLTokensProgressbar() + '\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td/>' + widGetHTMLTabsDivs(tabs, 'div_tokens_tab') + '\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td/><hr/>\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td/>' + widGetHTMLTokensLog() + '\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td/><hr/>\n';
    r += '</tr>\n';
    r += '</table>\n';

    return r;
}

function widGetHTMLTokensInitialData()
{
    var r = '';

    r += '<table id="table_tokens_init_data">\n';
    r += '<tr>\n';
    r += '<td/>\n';
    r += '<textarea rows="3" id="textarea_tokens_names" oninput="widTokensNamesOninput($(this));"></textarea>\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td/>\n';
    r += '<div id="div_add_range_accordion">\n';
    r += '<h3>Add tokens range</h3>\n';
    r += '<div>\n';
    r += '<table id="table_tokens_range">\n';
    r += '<tr>\n';
    r += '<td/>\n';
    r += '<label for="input_tokens_basename">Base name</label>\n';
    r += '<td colspan="3"/>\n';
    r += '<input type="text" id="input_tokens_basename" >\n';
    r += '<td rowspan="2"/>\n';
    r += '<button onclick="widMainButtonClick($(this))" data-title="Add" data-function="widAddTokens">Add</button>\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td/>\n';
    r += '<label for="input_fst_idx">Start index</label>\n';
    r += '<td/>\n';
    r += '<input id="input_fst_idx" type="text" oninput="return $(this).val(engGetOnlyNumber($(this).val()))">\n';
    r += '<td id="td_label_lst_idx"/>\n';
    r += '<label for="input_lst_idx">End index</label>\n';
    r += '<td id="td_input_lst_idx"/>\n';
    r += '<input id="input_lst_idx" type="text" oninput="return $(this).val(engGetOnlyNumber($(this).val()))">\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</div>\n';
    r += '</div>\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td/>\n';
    r += '<table id="table_tokens_password">\n';
    r += '<tr>\n';
    r += '<td/>\n';
    r += '<label for="input_tokens_password">Password</label>\n';
    r += '<td/>\n';
    r += '<input id="input_tokens_password" type="text" oninput="widTokensPasswordOninput(this.value);" />\n';
    r += '<td id="td_tokens_encrypt"/>\n';
    r += '<label for="input_tokens_encrypt">&nbsp;Admin mode</label>\n';
    r += '<input id="input_tokens_encrypt" type="checkbox">\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';
    r += '</table>\n';

    return r;
}

function widGetHTMLTokensProgressbar()
{
    var r = '';
    r += '<div id="div_progressbar_main">\n';
    r += '<div id="div_progressbar_label">\n';
    r += '</div>\n';
    r += '</div>\n';
    return r;
}

function widGetHTMLTokensLog()
{
    var r = '';
    r += '<div id="div_tokens_log">&nbsp</div>\n';
    return r;
}


function widGetHTMLTokensCreateTab()
{
    var r = '';
    r += '<table id="table_create_tab" class="wrap">\n';
    r += '<tr>\n';
    r += '<td/>\n';
    r += '<button class="shared-button" data-title="Create" data-function="widPreCreate" onclick="widMainButtonClick($(this))">Create</button>\n';
    r += '<td id="td_create_led"/>\n';
    r += widGetHTMLSpanLed('', 'led-span') + '\n';
    r += '</tr>\n';
    r += '</table>\n';
    return r;
}

function widGetHTMLTokensVerifyTab()
{
    var r = '';
    r += '<table class="wrap">';
    r += '<tr>';
    r += '<td>';
    r += '<table id="table_button_verify">\n';
    r += '<tr>\n';
    r += '<td id="td_button_verify"/>\n';
    r += '<button id="button_verify" data-title="Verify" class="shared-button" data-function="widPreVerify" onclick="widMainButtonClick($(this))">Verify</button>\n';
    r += '<td id="td_verify_led"/>\n';
    r += widGetHTMLSpanLed('', 'led-span') + '\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>';

    r += '<tr>';
    r += '<td>';
    r += '<div id="div_table_verify">\n';
    r += '<table id="table_verify" border="1">\n';
    r += '<tr>\n';
    r +='<th>Status</th><th>Raw name</th><th>Hash</th><th>Last rec. N</th><th>Data</th>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</div>\n';
    r += '</tr>';
    r += '</table>';
    return r;
}

function widGetHTMLTokensDataTab()
{
    var r = '';

    r += '<table class="wrap">\n';
    r += '<tr>\n';
    r += '<td id="td_label_tokens_data"/>\n';
    r += '<label for="input_tokens_data">New data</label>\n';
    r += '<td/>\n';
    r += '<input type="text" id="input_tokens_data"/>\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td colspan="2"/>\n';
    r += '<table>\n';
    r += '<tr>\n';
    r += '<td class="td-warning"/>\n';
    r += '&nbsp;The specified range contains unknown tokens.&nbsp;\n';
    r += '<td id="td_tokens_data_led"/>\n';
    r += widGetHTMLSpanLed('', 'led-span') + '\n';
    r += '<td/>\n';
    r += '<button class="continue-button" onclick="return widContinueButtonClick($(this), true)" data-title="Continue">Hidden</button>\n';
    r += '<button class="shared-button" onclick="widMainButtonClick($(this))" data-function="widPreUpdate" data-title="Update">Update</button>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';
    r += '</table>\n';
    return r;
}

function widGetHTMLTokensSendTab()
{
    var r = '';
    r += '<div id="div_tokens_send">\n';
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

function widGetHTMLTokensSS1()
{
    var r = '';
    r += '<div id="div_ss1">';
    r += '<table class="wrap">\n';
    r += '<tr>\n';
    r += '<td/>\n';
    r += '<table>\n';
    r += '<tr>\n';
    r += '<td/>\n';
    r += '<button class="shared-button" onclick="widMainButtonClick($(this))" data-function="widPreSimpleSend" data-title="Initiate">Initiate</button>\n';
    r += '<td id="td_tokens_ss1_led"/>\n';
    r += widGetHTMLSpanLed('span_tokens_ss1_led', 'led-span') + '\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td/>\n';
    r += '<textarea id="textarea_tokens_ss1" readonly></textarea>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</div>';
    return r;
}

function widGetHTMLTokensSS2()
{
    var r = '';
    r += '<div id="div_ss2">';
    r += '<table class="wrap">\n';
    r += '<tr>\n';
    r += '<td/>\n';
    r += '<textarea id="textarea_tokens_ss2" oninput="return led($(this)).clear();"></textarea>\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td/>\n';
    r += '<table>\n';
    r += '<tr>\n';
    r += '<td class="td-warning"/>\n';
    r += '&nbsp;Tokens names will be updated.&nbsp;\n';
    r += '<td id="td_tokens_ss2_led"/>\n';
    r += widGetHTMLSpanLed('span_tokens_ss2_led', 'led-span') + '\n';
    r += '<td/>\n';
    r += '<button class="continue-button" onclick="widContinueButtonClick($(this), true)" data-title="Continue">Hidden</button>\n';
    r += '<button class="shared-button" onclick="widMainButtonClick($(this))"data-function="widPreSimpleAccept" data-title="Finalize">Finalize</button>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</div>';
    return r;
}

function widGetHTMLTokensSS3()
{
    var r = '';
    r += '<div id="div_ss3">\n';

    r += '<table class="wrap">\n';
    r += '<tr>\n';
    r += '<td/>\n';
    r += '<table>\n';
    r += '<tr>\n';
    r += '<td/>\n';
    r += '<button class="shared-button long-button" onclick="widMainButtonClick($(this))" data-function="widPreBlockingSendStep1" data-title="Initiate Step 1" >Initiate Step 1</button>\n';
    r += '<td id="td_tokens_ss3_s1_led"/>\n';
    r += widGetHTMLSpanLed('span_tokens_ss3_s1_led', 'led-span') + '\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td/>\n';
    r += '<textarea id="textarea_tokens_ss3_s1" readonly></textarea>\n';
    r += '</tr>\n';
    r += '</table>\n';

    r += '<table class="wrap">\n';
    r += '<tr>\n';
    r += '<td/>\n';
    r += '<table >\n';
    r += '<tr>\n';
    r += '<td/>\n';
    r += '<button class="shared-button long-button" onclick="widMainButtonClick($(this))" data-function="widPreBlockingSendStep2" data-title="Initiate Step 2">Initiate Step 2</button>\n';
    r += '<td id="td_tokens_ss3_s2_led"/>\n';
    r += widGetHTMLSpanLed('span_tokens_ss3_s2_led', 'led-span') + '\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td/>\n';
    r += '<textarea id="textarea_tokens_ss3_s2" readonly></textarea>\n';
    r += '</tr>\n';
    r += '</table>\n';

    r += '</div>\n';
    return r;
}

function widGetHTMLTokensSS4()
{
    var r = '';
    r += '<div id="div_ss4">\n';

    r += '<table class="wrap">\n';
    r += '<tr>\n';
    r += '<td/>\n';
    r += '<textarea id="textarea_tokens_ss4_s1" oninput="led($(this)).clear();"></textarea>\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td/>\n';
    r += '<table>\n';
    r += '<tr>\n';
    r += '<td class="td-warning">\n';
    r += '&nbsp;Tokens names will be updated.&nbsp;\n';
    r += '<td id="td_tokens_ss4_s1_led"/>\n';
    r += widGetHTMLSpanLed('span_tokens_ss4_s1_led', 'led-span') + '\n';
    r += '<td align="right" />\n';
    r += '<button data-title="Continue" class="continue-button" onclick="widContinueButtonClick($(this), true)">Hidden</button>\n';
    r += '<button data-function="widPreBlockingAcceptStep1" data-title="Finalize Step 1" class="shared-button long-button" onclick="widMainButtonClick($(this))">Finalize Step 1</button>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';
    r += '</table>\n';

    r += '<table class="wrap">\n';
    r += '<tr>\n';
    r += '<td>\n';
    r += '<textarea id="textarea_tokens_ss4_s2" oninput="led($(this)).clear();"></textarea>\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td/>\n';
    r += '<table>\n';
    r += '<tr>\n';
    r += '<td class="td-warning" />\n';
    r += '&nbsp;Tokens names will be updated.&nbsp;\n';
    r += '<td id="td_tokens_ss4_s2_led"/>\n';
    r += widGetHTMLSpanLed('span_tokens_ss4_s2_led', 'led-span') + '\n';
    r += '<td/>\n';
    r += '<button data-title="Continue" class="continue-button" onclick="widContinueButtonClick($(this), true)">Hidden</button>\n';
    r += '<button data-function="widPreBlockingAcceptStep2" data-title="Finalize Step 2" class="shared-button long-button" onclick="widMainButtonClick($(this))">Finalize Step 2</button>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';
    r += '</table>\n';

    r += '</div>\n';
    return r;
}

function widTokensReceiveTab()
{
    var r = '';
    r += '<div id="div_tokens_receive">\n';
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

function widGetHTMLTokensRS1()
{
    var r = '';
    r += '<div id="div_rs1">';
    r += '<table class="wrap">\n';
    r += '<tr>\n';
    r += '<td/>\n';
    r += '<textarea id="textarea_tokens_rs1" oninput="led($(this)).clear();"></textarea>\n';
    r += '</tr>\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td/>\n';
    r += '<table>\n';
    r += '<tr>\n';
    r += '<td class="td-warning"/>\n';
    r += '&nbsp;Tokens names will be updated.&nbsp;\n';
    r += '<td id="td_tokens_rs1_led">\n';
    r += widGetHTMLSpanLed('span_tokens_rs1_led', 'led-span') + '\n';
    r += '<td/>\n';
    r += '<button class="continue-button" data-title="Continue" onclick="widContinueButtonClick($(this), true)">Hidden</button>\n';
    r += '<button class="shared-button" data-function="widPreSimpleReceive" data-title="Finalize" onclick="widMainButtonClick($(this))">Finalize</button>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</div>';
    return r;
}


function widGetHTMLTokensRS2()
{
    var r = '';
    r += '<div id="div_rs2">\n';
    r += '<table class="wrap">\n';
    r += '<tr>\n';
    r += '<td/>\n';
    r += '<table>\n';
    r += '<tr>\n';
    r += '<td/>\n';
    r += '<button data-title="Continue" class="continue-button" onclick="widContinueButtonClick($(this), true)">Hidden</button>\n';
    r += '<button data-function="widPreSimpleRequest" data-title="Initiate" class="shared-button" onclick="widMainButtonClick($(this))">Initiate</button>\n';
    r += '<td id="td_tokens_rs2_led"/>\n';
    r += widGetHTMLSpanLed('span_tokens_rs2_led', 'led-span') + '\n';
    r += '<td class="td-warning"/>\n';
    r += '&nbsp;Tokens names will be updated.&nbsp;\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td/>\n';
    r += '<textarea id="textarea_tokens_rs2" readonly></textarea>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</div>\n';
    return r;
}

function widGetHTMLTokensRS3()
{
    var r = '';
    r += '<div id="div_rs3">\n';
    r += '<table class="wrap">\n';
    r += '<tr>\n';
    r += '<td>\n';
    r += '<textarea id="textarea_tokens_rs3_s1" oninput="led($(this)).clear();"></textarea>\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td/>\n';
    r += '<table>\n';
    r += '<tr>\n';
    r += '<td class="td-warning" />\n';
    r += '&nbsp;Tokens names will be updated.&nbsp;\n';
    r += '<td id="td_tokens_rs3_s1_led" />\n';
    r += widGetHTMLSpanLed('span_tokens_rs3_s1_led', 'led-span') + '\n';
    r += '<td/>\n';
    r += '<button data-title="Continue" class="continue-button" onclick="widContinueButtonClick($(this), true)">Hidden</button>\n';
    r += '<button data-function="widPreBlockingReceiveStep1" data-title="Finalize Step 1" class="shared-button long-button" onclick="widMainButtonClick($(this))">Finalize Step 1</button>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';
    r += '</table>\n';

    r += '<table class="wrap">\n';
    r += '<tr>\n';
    r += '<td/>\n';
    r += '<textarea id="textarea_tokens_rs3_s2" oninput="led($(this)).clear();"></textarea>\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td/>\n';
    r += '<table>\n';
    r += '<tr>\n';
    r += '<td class="td-warning"/>\n';
    r += '&nbsp;Tokens names will be updated.&nbsp;\n';
    r += '<td id="td_tokens_rs3_s2_led"/>\n';
    r += widGetHTMLSpanLed('span_tokens_rs3_s2_led', 'led-span') + '\n';
    r += '<td/>\n';
    r += '<button data-title="Continue" class="continue-button" onclick="widContinueButtonClick($(this), true)">Hidden</button>\n';
    r += '<button data-function="widPreBlockingReceiveStep2" data-title="Finalize Step 2" class="shared-button long-button" onclick="widMainButtonClick($(this))">Finalize Step 2</button>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</div>\n';
    return r;
}

function widGetHTMLTokensRS4()
{
    var r = '';
    r += '<div id="div_rs4">\n';

    r += '<table class="wrap">\n';
    r += '<tr>\n';
    r += '<td/>\n';
    r += '<table>\n';
    r += '<tr>\n';
    r += '<td/>\n';
    r += '<button data-function="widPreBlockingRequestStep1" data-title="Initiate Step 1" class="shared-button long-button" onclick="widMainButtonClick($(this))">Initiate Step 1</button>\n';
    r += '<td id="td_tokens_rs4_s1_led"/>\n';
    r += widGetHTMLSpanLed('span_tokens_rs4_s1_led', 'led-span') + '\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td/>\n';
    r += '<textarea id="textarea_tokens_rs4_s1" readonly></textarea>\n';
    r += '</tr>\n';
    r += '</table>\n';

    r += '<table class="wrap">\n';
    r += '<tr>\n';
    r += '<td/>\n';
    r += '<table>\n';
    r += '<tr>\n';
    r += '<td/>\n';
    r += '<button data-function="widPreBlockingRequestStep2" data-title="Initiate Step 2" class="shared-button long-button" onclick="widMainButtonClick($(this))">Initiate Step 2</button>\n';
    r += '<td id="td_tokens_rs4_s2_led"/>\n';
    r += widGetHTMLSpanLed('span_tokens_rs4_s2_led', 'led-span') + '\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td/>\n';
    r += '<textarea id="textarea_tokens_rs4_s2" readonly></textarea>\n';
    r += '</tr>\n';
    r += '</table>\n';

    r += '</div>\n';
    return r;
}
