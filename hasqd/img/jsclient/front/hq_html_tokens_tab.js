// Hasq Technology Pty Ltd (C) 2013-2016

function widGetHTMLTokensTab()
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
    r += '<td />' + widGetHTMLTokensInitialData() + '\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td />' + widGetHTMLTokensProgressbar() + '\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td />' + widGetHTMLTokensTabWrite(tabs) + '\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td /><hr/>\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td />' + widGetHTMLTokensLog() + '\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td /><hr/>\n';
    r += '</tr>\n';
    r += '</table>\n';

    return r;
}

function widGetHTMLTokensTabWrite(items)
{
    var r = '';
    r += '<div id="tokens_tabs">\n';

    r += '\t<ul>\n';
    for (var i = 0; i < items.length; i++)//
        r += '\t<li style="list-style-type:none;"><a href="#tokens_tabs-' + (i + 1) + '_div">' + items[i].title + '</a>\n';

    r += '\t</ul>\n';

    for (var i = 0; i < items.length; i++)//
        r += '\t<div id="tokens_tabs-' + (i + 1) + '_div">\n' + items[i].data + '</div>\n';

    r += '</div>\n';

    return r;
}

function widGetHTMLTokensInitialData()
{
    var r = '';

    r += '<table>\n';
    r += '<tr>\n';
    r += '<td />\n';
    r += '<textarea rows="3" id="tokens_names_textarea" maxlength="16511" oninput="widTokensNamesOninput($(this));" placeholder="Enter tokens \[raw names\] or hashes here."></textarea>\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td />\n';
    r += '<div id="tokens_add_range_accordion">\n';
    r += '<h3>Add tokens range</h3>\n';
    r += '<div>\n';
    r += '<table style="width:auto">\n';
    r += '<tr>\n';
    r += '<td class="td-label" align="left" />\n';
    r += 'Base name&nbsp\n';
    r += '<td colspan="3" align="left" />\n';
    r += '<input type="text" size="24" id="tokens_basename_input" >\n';
    r += '<td align="right" valign="middle" rowspan="2" />\n';
    r += '<button onclick="widMainButtonClick($(this))" data-title="Add" data-function="widAddTokens">Add</button>\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td class="td-label" align="left" />\n';
    r += 'Start index&nbsp\n';
    r += '<td align="left" />\n';
    r += '<input type="text" size="3" id="tokens_first_idx_input" oninput="return $(this).val(engGetOnlyNumber($(this).val()))">\n';
    r += '<td class="td-label" align="right" />\n';
    r += 'End index\n';
    r += '<td align="right" />\n';
    r += '<input type="text" size="3" id="tokens_last_idx_input" oninput="return $(this).val(engGetOnlyNumber($(this).val()))">\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</div>\n';
    r += '</div>\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td align="left" />\n';
    r += '<table style="width:auto;">\n';
    r += '<tr>\n';
    r += '<td class="td-label" align="left" />\n';
    r += 'Password&nbsp\n';
    r += '<td align="left" />\n';
    r += '<input type="text" id="tokens_input_password" placeholder="Enter a password" oninput="widTokensPasswordOninput(this.value);" />\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';
    r += '</table>\n';

    return r;
}

function widGetHTMLTokensProgressbar()
{
    var r = '';
    r += '<div id="tokens_progressbar" align="center" valign="middle">\n';
    r +='<div class="tokens-progressbar-label" align="center" valign="middle"></div>\n';
    r += '</div>\n';
    return r;
}


function widGetHTMLTokensLog()
{
    var r = '';
    r += '<pre id="tokens_log_pre">&nbsp</pre>\n';
    return r;
}


function widGetHTMLTokensCreateTab()
{
    var r = '';
    r += '<table class="wrap" style="width: auto;">\n';
    r += '<tr>\n';
    r += '<td align="left">\n';
    r += '<button class="shared-button" data-title="Create" data-function="widPreCreate" onclick="widMainButtonClick($(this))">Create</button>\n';
    r += '<td align="right">\n';
    r += widGetHTMLSpanImg('', 'led-span') + '\n';
    r += '</tr>\n';
    r += '</table>\n';
    return r;
}

function widGetHTMLTokensVerifyTab()
{
    var r = '';
    r += '<table class="wrap">\n';
    r += '<tr>\n';
    r += '<td width="70" align="left">\n';
    r += '<button id="tokens_verify_button" data-title="Verify" class="shared-button" data-function="widPreVerify" onclick="widMainButtonClick($(this))">Verify</button>\n';
    r += '<td align="left">\n';
    r += widGetHTMLSpanImg('', 'led-span') + '\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '<div id="tokens_verify_div" class="div-hidden">\n';
    r += '<table id="tokens_verify_table" border="1" style="font-family:monospace;">\n';
    r += '<tr>\n';
    r +='<th nowrap>Status</th><th nowrap>Raw name</th><th>Hash</th><th nowrap>Last rec. N</th><th>Data</th>\n';
    r += '</tr>\n';
    r += '</table>\n';
    r += '</div>\n';
    return r;
}

function widGetHTMLTokensDataTab()
{
    var r = '';

    r += '<table class="wrap">\n';
    r += '<tr>\n';
    r += '<td class="td-label" style="width:70px" align="left" />\n';
    r += 'New data&nbsp;\n';
    r += '<td align="right" />\n';
    r += '<input type="text" id="tokens_data_input" size="28" placeholder="Enter a new data" />\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td align="right" colspan="2"/>\n';
    r += '<table style="width:auto;">\n';
    r += '<tr>\n';
    r += '<td class="td-warning" align="center">\n';
    r += '&nbsp;The specified range contains unknown tokens. Continue?&nbsp;\n';
    r += '<td align="right">\n';
    r += widGetHTMLSpanImg('', 'led-span') + '\n';
    r += '<td align="right">\n';
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

function widGetHTMLTokensSS1()
{
    var r = '';
    r += '<div id="SS1_div">';
    r += '<table class="wrap">\n';
    r += '<tr>\n';
         r += '<td />\n';
    r += '<table style="width:auto;">\n';
    r += '<tr>\n';
                     r += '<td align="left" />\n';
                         r += '<button class="shared-button" onclick="widMainButtonClick($(this))" data-function="widPreSimpleSend" data-title="Initiate">Initiate</button>\n';
                     r += '<td align="left" />\n';
    r += widGetHTMLSpanImg('tokens_ss1_led_span', 'led-span') + '\n';
                 r += '</tr>\n';
             r += '</table>\n';
     r += '</tr>\n';
    r += '<tr>\n';
         r += '<td />\n';
                 r += '<textarea wrap="off" rows="4" id="tokens_ss1_textarea" readonly></textarea>\n';
     r += '</tr>\n';
    r += '</table>\n';
 r += '</div>';
    return r;
}

function widGetHTMLTokensSS2()
{
    var r = '';
    r += '<div id="SS2_div">';
    r += '<table class="wrap">\n';
    r += '<tr>\n';
         r += '<td />\n';
                 r += '<textarea wrap="off" rows="4" maxlength="66435" oninput="led($(this)).clear();" id="tokens_ss2_textarea"></textarea>\n';
     r += '</tr>\n';
    r += '<tr>\n';
         r += '<td align="right" />\n';
    r += '<table style="width:auto;">\n';
    r += '<tr>\n';
                     r += '<td class="td-warning" align="center" />\n';
    r += '&nbsp;Tokens names will be updated. Continue?&nbsp;\n';
                     r += '<td align="right" />\n';
    r += widGetHTMLSpanImg('tokens_ss2_led_span', 'led-span') + '\n';
                     r += '<td align="right" />\n';
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
    r += '<div id="SS3_div">\n';

    r += '<table class="wrap">\n';
    r += '<tr>\n';
         r += '<td />\n';
    r += '<table style="width:auto;">\n';
    r += '<tr>\n';
                     r += '<td align="left" />\n';
                         r += '<button class="shared-button" onclick="widMainButtonClick($(this))" data-function="widPreBlockingSendStep1" data-title="Initiate Step 1" >Initiate Step 1</button>\n';
                     r += '<td align="left" />\n';
    r += widGetHTMLSpanImg('tokens_ss3_s1_led_span', 'led-span') + '\n';
                 r += '</tr>\n';
             r += '</table>\n';
     r += '</tr>\n';
    r += '<tr>\n';
             r += '<td />\n';
                 r += '<textarea wrap="off" rows="4" id="tokens_ss3_s1_textarea" readonly></textarea>\n';
     r += '</tr>\n';
    r += '</table>\n';

    r += '<table class="wrap">\n';
    r += '<tr>\n';
         r += '<td />\n';
    r += '<table style="width:auto;" >\n';
    r += '<tr>\n';
                     r += '<td align="left" />\n';
                         r += '<button class="shared-button" onclick="widMainButtonClick($(this))" data-function="widPreBlockingSendStep2" data-title="Initiate Step 2">Initiate Step 2</button>\n';
                     r += '<td align="left" />\n';
    r += widGetHTMLSpanImg('tokens_ss3_s2_led_span', 'led-span') + '\n';
                 r += '</tr>\n';
             r += '</table>\n';
     r += '</tr>\n';
    r += '<tr>\n';
         r += '<td />\n';
             r += '<textarea wrap="off" rows="4" id="tokens_ss3_s2_textarea" readonly></textarea>\n';
     r += '</tr>\n';
    r += '</table>\n';

    r += '</div>\n';
    return r;
}

function widGetHTMLTokensSS4()
{
    var r = '';
    r += '<div id="SS4_div">\n';

    r += '<table class="wrap">\n';
    r += '<tr>\n';
         r += '<td />\n';
             r += '<textarea wrap="off" rows="4" maxlength="66435" oninput="led($(this)).clear();" id="tokens_ss4_s1_textarea"></textarea>\n';
     r += '</tr>\n';
    r += '<tr>\n';
         r += '<td align="right" />\n';
    r += '<table style="width:auto;">\n';
    r += '<tr>\n';
    r += '<td class="td-warning">\n';
    r += '&nbsp;Tokens names will be updated. Continue?&nbsp;\n';
                     r += '<td align="right" />\n';
    r += widGetHTMLSpanImg('tokens_ss4_s1_led_span', 'led-span') + '\n';
                     r += '<td align="right" />\n';
                         r += '<button data-title="Continue" class="continue-button" onclick="widContinueButtonClick($(this), true)">Hidden</button>\n';
                         r += '<button data-function="widPreBlockingAcceptStep1" data-title="Finalize Step 1" class="shared-button" onclick="widMainButtonClick($(this))">Finalize Step 1</button>\n';
                 r += '</tr>\n';
             r += '</table>\n';
     r += '</tr>\n';
    r += '</table>\n';

    r += '<table class="wrap">\n';
    r += '<tr>\n';
    r += '<td>\n';
             r += '<textarea wrap="off" rows="4" maxlength="66435" oninput="led($(this)).clear();" id="tokens_ss4_s2_textarea"></textarea>\n';
     r += '</tr>\n';
    r += '<tr>\n';
         r += '<td align="right" />\n';
    r += '<table style="width:auto;">\n';
    r += '<tr>\n';
                     r += '<td class="td-warning" />\n';
    r += '&nbsp;Tokens names will be updated. Continue?&nbsp;\n';
                     r += '<td align="right" />\n';
    r += widGetHTMLSpanImg('tokens_ss4_s2_led_span', 'led-span') + '\n';
                     r += '<td align="right" />\n';
                         r += '<button data-title="Continue" class="continue-button" onclick="widContinueButtonClick($(this), true)">Hidden</button>\n';
                         r += '<button data-function="widPreBlockingAcceptStep2" data-title="Finalize Step 2" class="shared-button" onclick="widMainButtonClick($(this))">Finalize Step 2</button>\n';
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

function widGetHTMLTokensRS1()
{
    var r = '';
    r += '<div id="RS1_div">';
    r += '<table class="wrap">\n';
    r += '<tr>\n';
    r += '<td />\n';
    r += '<textarea wrap="off" rows="4" maxlength="66435" oninput="led($(this)).clear();" id="tokens_rs1_textarea"></textarea>\n';
    r += '</tr>\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td align="right" />\n';
    r += '<table style="width:auto">\n';
    r += '<tr>\n';
    r += '<td class="td-warning" align="center" />\n';
    r += '&nbsp;Tokens names will be updated. Continue?&nbsp;\n';
    r += '<td align="right">\n';
    r += widGetHTMLSpanImg('tokens_rs1_led_span', 'led-span') + '\n';
    r += '<td align="right" />\n';
    r += '<button data-title="Continue" class="continue-button" onclick="widContinueButtonClick($(this), true)">Hidden</button>\n';
    r += '<button data-function="widPreSimpleReceive" data-title="Finalize" class="shared-button" onclick="widMainButtonClick($(this))">Finalize</button>\n';
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
    r += '<div id="RS2_div">\n';
    r += '<table class="wrap">\n';
    r += '<tr>\n';
         r += '<td />\n';
    r += '<table style="width:auto;">\n';
    r += '<tr>\n';
                     r += '<td align="left" />\n';
                         r += '<button data-title="Continue" class="continue-button" onclick="widContinueButtonClick($(this), true)">Hidden</button>\n';
                         r += '<button data-function="widPreSimpleRequest" data-title="Initiate" class="shared-button" onclick="widMainButtonClick($(this))">Initiate</button>\n';
                     r += '<td align="left" />\n';
    r += widGetHTMLSpanImg('tokens_rs2_led_span', 'led-span') + '\n';
                     r += '<td class="td-warning" align="center" />\n';
    r += '&nbsp;Tokens names will be updated. Continue?&nbsp;\n';
                 r += '</tr>\n';
             r += '</table>\n';
     r += '</tr>\n';
    r += '<tr>\n';
         r += '<td />\n';
             r += '<textarea wrap="off" rows="4" id="tokens_rs2_textarea" readonly></textarea>\n';
     r += '</tr>\n';
    r += '</table>\n';
    r += '</div>\n';
    return r;
}

function widGetHTMLTokensRS3()
{
    var r = '';
    r += '<div id="RS3_div">\n';
    r += '<table class="wrap">\n';
    r += '<tr>\n';
    r += '<td>\n';
                     r += '<textarea wrap="off" rows="4" maxlength="66435" oninput="led($(this)).clear();" id="tokens_rs3_s1_textarea"></textarea>\n';
         r += '</tr>\n';
    r += '<tr>\n';
             r += '<td align="right" />\n';
    r += '<table style="width:auto">\n';
    r += '<tr>\n';
                         r += '<td class="td-warning" align="center" />\n';
    r += '&nbsp;Tokens names will be updated. Continue?&nbsp;\n';
                         r += '<td align="right" />\n';
    r += widGetHTMLSpanImg('tokens_rs3_s1_led_span', 'led-span') + '\n';
                         r += '<td align="right" />\n';
                             r += '<button data-title="Continue" class="continue-button" onclick="widContinueButtonClick($(this), true)">Hidden</button>\n';
                             r += '<button data-function="widPreBlockingReceiveStep1" data-title="Finalize Step 1" class="shared-button" onclick="widMainButtonClick($(this))">Finalize Step 1</button>\n';
                     r += '</tr>\n';
                 r += '</table>\n';
         r += '</tr>\n';
     r += '</table>\n';

    r += '<table class="wrap">\n';
    r += '<tr>\n';
             r += '<td />\n';
                 r += '<textarea wrap="off" rows="4" maxlength="66435" oninput="led($(this)).clear();" id="tokens_rs3_s2_textarea"></textarea>\n';
         r += '</tr>\n';
    r += '<tr>\n';
             r += '<td align="right" />\n';
    r += '<table style="width:auto">\n';
    r += '<tr>\n';
                         r += '<td class="td-warning" align="center" />\n';
    r += '&nbsp;Tokens names will be updated. Continue?&nbsp;\n';
                         r += '<td align="left" />\n';
    r += widGetHTMLSpanImg('tokens_rs3_s2_led_span', 'led-span') + '\n';
                         r += '<td align="right" />\n';
                             r += '<button data-title="Continue" class="continue-button" onclick="widContinueButtonClick($(this), true)">Hidden</button>\n';
                             r += '<button data-function="widPreBlockingReceiveStep2" data-title="Finalize Step 2" class="shared-button" onclick="widMainButtonClick($(this))">Finalize Step 2</button>\n';
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
    r += '<div id="RS4_div">\n';

    r += '<table class="wrap">\n';
    r += '<tr>\n';
         r += '<td />\n';
    r += '<table style="width:auto;">\n';
    r += '<tr>\n';
                     r += '<td align="left" />\n';
                         r += '<button data-function="widPreBlockingRequestStep1" data-title="Initiate Step 1" class="shared-button" onclick="widMainButtonClick($(this))">Initiate Step 1</button>\n';
                     r += '<td align="left" />\n';
    r += widGetHTMLSpanImg('tokens_rs4_s1_led_span', 'led-span') + '\n';
                 r += '</tr>\n';
             r += '</table>\n';
     r += '</tr>\n';
    r += '<tr>\n';
         r += '<td />\n';
                 r += '<textarea wrap="off" rows="4" id="tokens_rs4_s1_textarea" readonly></textarea>\n';
         r += '</tr>\n';
    r += '</table>\n';

    r += '<table class="wrap">\n';
    r += '<tr>\n';
         r += '<td />\n';
    r += '<table style="width:auto;">\n';
    r += '<tr>\n';
                         r += '<td align="left" />\n';
                             r += '<button data-function="widPreBlockingRequestStep2" data-title="Initiate Step 2" class="shared-button" onclick="widMainButtonClick($(this))">Initiate Step 2</button>\n';
                         r += '<td align="left" />\n';
    r += widGetHTMLSpanImg('tokens_rs4_s2_led_span', 'led-span') + '\n';
                 r += '</tr>\n';
             r += '</table>\n';
     r += '</tr>\n';
    r += '<tr>\n';
         r += '<td />\n';
                 r += '<textarea wrap="off" rows="4" id="tokens_rs4_s2_textarea" readonly></textarea>\n';
     r += '</tr>\n';
    r += '</table>\n';

    r += '</div>\n';
    return r;
}