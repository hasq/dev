// Hasq Technology Pty Ltd (C) 2013-2016

function widGetHTMLSpanLed(id, htmlClass)
{
    var r = '';
    var style = 'style="text-align:center; vertical-align:middle;"';

    if (arguments.length > 1)
    {
     r += '<span id="' + id + '" class="' + htmlClass + '" ' + style + '><img></img></span>\n';
    }
    else
    {
     r += '<span id="' + id + '" ' + style + '><img></img></span>\n';
    }

    return r;
}


function widGetHTMLSpanImg(id, func)
{
    var r = '';
    var style = 'style="text-align:center;"';

    if (func)
     r += '<span id="' + id + '" onclick="' + func + '" ' + style + '><img src=""></img></span>\n';
        else
     r += '<span id="' + id + '" ' + style + '><img src=""></img></span>\n';

            return r;
}

function widGetHTMLTd(x)
{
    return '<td nowrap style="text-align: left">\n' + x + '';
}

function widGetHTMLTdSpan(x, y, z)
{
    if (!y)
        y = '';

 return '<td>\n<span id="' + x + '"></span>' + '' + y + '';
}

function widGetHTMLTr(x)
{
 var r = '<tr>\n' + x + '</tr>\n';

    return r;
}

function widGetHTMLHref(x)
{
    var r = '';

 r += '<a href="http://' + x + '"><b>' + x + '</b></a>\n';

    return r;
}

function widGetHTMLMainBody(tabs)
{
    var r = '';

    r += '<table id="table_body" border="0">\n';
    r += '<tr>\n';
    r += '<td>\n' + widGetHTMLTitle(gClientTitle);
 r += '<td style="text-align:right;"/>&nbsp;\n';
    r += widGetHTMLSpanLed('span_logo') + '\n';
 r += '</tr>\n';
    r += '<tr>\n';
 r += '<td colspan="2"/>\n' + widGetHTMLTabsDivs(tabs, 'div_main_tab');
 r += '</tr>\n';
    r += '<tr>\n';
    {
     r += '<td class="td-subscribe" width="160" style="text-align: left;"/>\n';
     r += 'Powered by ' + '<a href="http://hasq.org">Hasq Technology</a>\n';
     r += '<td class="td-subscribe" width="40" style="text-align: right;"/>\n';
     r += '<a href="tsclnt.html">TokenSwap</a>\n';
    }

 r += '</tr>\n';
 r += '</table>\n';

    return r;
}

function widGetHTMLTitle(text)
{
    var r = '';

    r += '<table border="0">\n';
    r += '<tr>\n';
 r += '<td id="td_client_title"/>' + text + '\n';
 r += '</tr>\n';
 r += '</table>\n';

    return r;
}

function widGetHTMLSpan(span_id)
{
    var r = '';

 r += '<span id="' + span_id + '"></span>\n';

    return r;

}

function widGetHTMLTabsDivs(items, id)
{
    var r = '';

    r += '<div id="' + id + 's">\n';

    r += '\t<ul>\n';

    for (var i = 0; i < items.length; i++)
     r += '\t<li><a href="#' + id + '_' + (i + 1) + '">' + items[i].title + '</a>\n';

 r += '\t</ul>\n';

        for (var i = 0; i < items.length; i++)
     r += '\t<div id="' + id + '_' + (i + 1) + '">' + items[i].data + '</div>\n';

 r += '</div>\n';

            return r;
}

function widGetHTMLServerTab()
{
    var r = '';

    r += '<table>\n';
    r += '<tr>\n';
    r += '<td>\n';
    r += '<table id="table_server">\n';
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

function widGetHTMLRefreshButton()
{
    var r = '';

 r += '<button id="srv_refresh_button" onclick="widRefreshButtonClick()">Refresh</button>\n';

    return r;
}

function widGetHTMLFamilyTable(data)
{
    var r = '';

    if (data.length === 0 )
        return r;

    r += '<table id="table_family">\n';

 r += '<tr><th>Name</th><th>Link</th><th>Neighbour</th><th>Alive</th><th>Locked</th></tr>\n';

    for (var i = 0; i < data.length; i++)
    {
        r += '<tr>\n';
        r += widGetHTMLTd(data[i].name);
        r += widGetHTMLTd(widGetHTMLHref(data[i].link));
        r += widGetHTMLTd(data[i].neighbor ? 'Yes' : 'No');
        r += widGetHTMLTd(data[i].alive ? 'Yes' : 'No');
        r += widGetHTMLTd(data[i].unlock ? 'No' : 'Yes');
     r += '</tr>\n';
    }

 r += '</table>\n';

    return r;
}

function widGetHTMLDatabaseTab()
{
    var r = '';

    r += '<table>\n';
    r += '<tr>\n';
    r += '<td>\n';
 r += '<div>' + widGetHTMLTdSpan('server_db', widGetHTMLDatabaseSelect()) + '</div>\n';
 r += '</tr>\n';
 r += '</table>\n';

    return r;
}

function widGetHTMLDatabaseSelect()
{
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

function widGetHTMLDatabaseTraitTable(data)
{
    var r = '';

    r += '<table id="table_database">\n';
 r += '<tr><th>Trait</th><th>Value</th></tr>\n';

    for (var key in data)
    {
     r += '<tr><td>' + key + '<td>' + data[key] + '</tr>\n';
    }

 r += '</table>\n';

    return r;
}

function widGetHTMLRecTabTokArea()
{
    var r = '';

    r += '<table id="table_tok_area">\n';
    r += '<tr>\n';
 r += '<td colspan="2" class="td-records-title"/>\n';
 r += '<b>&nbsp;Current DB:</b>\n';
 r += '<b><span id="current_db">No database</span></b>\n';
 r += '</tr>\n';
    r += '<tr>\n';
 r += '<td class="td-label"/>\n';
 r += '<label for="rdn_input">Raw token</label>\n';
 r += '<td/>\n';
    r += '<input type="text" id="rdn_input" oninput="return widTokenNameOninput()">\n';
 r += '</tr>\n';
    r += '<tr>\n';
 r += '<td class="td-label"/>\n';
 r += '<label for="dn_input">Token</label>\n';
 r += '<td/>\n';
    r += '<input type="text" id="dn_input" oninput="return widTokenHashOninput()">\n';
 r += '</tr>\n';
    r += '<tr>\n';
 r += '<td colspan="2" id="td_lr_button"/>\n';
 r += '<button id="lr_button" class="long-button" onclick="widGetLastRecordButtonClick()">Get Last Record</button>\n';
 r += '</tr>\n';
 r += '</table>\n';

    return r;
}

function widGetHTMLRecTabLRArea()
{
    var r = '';

    r += '<table id="table_lr_area" border="0">\n';
    r += '<tr>\n';
 r += '<td class="td-label"/>\n';
 r += '<label for="lr_n_input">Record #</label>\n';
 r += '<td/>\n';
 r += '<input type="text" id="lr_n_input" readonly/>\n';
 r += '</tr>\n';
    r += '<tr>\n';
 r += '<td class="td-label"/>\n';
 r += '<label for="lr_k_input">Key</label>\n';
 r += '<td/>\n';
    r += '<input type="text" id="lr_k_input" readonly>\n';
 r += '</tr>\n';
    r += '<tr>\n';
 r += '<td class="td-label"/>\n';
 r += '<label for="lr_g_input">Generator</label>\n';
 r += '<td/>\n';
    r += '<input type="text" id="lr_g_input" readonly>\n';
 r += '</tr>\n';
    r += '<tr>\n';
 r += '<td class="td-label"/>\n';
 r += '<label for="lr_o_input">Owner</label>\n';
 r += '<td/>\n';
    r += '<input type="text" id="lr_o_input" readonly>\n';
 r += '</tr>\n';
    r += '<tr>\n';
 r += '<td class="td-label"/>\n';
 r += '<label for="lr_d_input">Data</label>\n';
 r += '<td/>\n';
    r += '<input type="text" id="lr_d_input" readonly>\n';
 r += '</tr>\n';
 r += '</table>\n';

    return r;
}

function widGetHTMLRecTabPwdArea()
{
    var r = '';

    r += '<table id="table_pwd_area">';
    r += '<tr>\n';
 r += '<td class="td-records-title" colspan="2"/>\n';
 r += '<b>&nbsp;New record</b>\n';
 r += '</tr>\n';
    r += '<tr>\n';
 r += '<td class="td-label"/>\n';
    r += '<input type="checkbox" id="one_pwd_checkbox" onclick="widRecordsOnePwdCheckboxClick($(this));" unchecked>\n';
 r += '<label for="one_pwd_checkbox">One password</label>\n';
 r += '<td/>\n';
    r += '<input type="password" class="password" id="nr_pwd0_input" oninput="widShowNewRecOninput()" disabled>\n';

    r += '<tr>\n';
 r += '<td class="td-label"/>\n';
 r += '<input type="checkbox" id="three_pwd_checkbox" onclick="widRecordsThreePwdCheckboxClick($(this))" unchecked/>\n';
 r += '<label for="three_pwd_checkbox">Three passwords</label>\n';
 r += '<td/>\n';
    r += '<input type="password" class="password" id="nr_pwd1_input" oninput="widShowNewRecOninput()" disabled>\n';

    r += '<tr>\n';
 r += '<td/>';
 r += '<td/>\n';
    r += '<input type="password" class="password" id="nr_pwd2_input" oninput="widShowNewRecOninput()" disabled>\n';

 r += '</table>';

    return r;
}

function widGetHTMLRecTabNRArea()
{
    var r = '';

    r += '<table id="table_nr_area">\n';
    r += '<tr>\n';
 r += '<td class="td-label"/>\n';
 r += '<label for="nr_n_input">Record #</label>\n';
 r += '<td/>\n';
    r += '<input type="text" id="nr_n_input" oninput="widShowNewRecOninput();" >\n';
 r += '</tr>\n';
    r += '<tr>\n';
 r += '<td class="td-label"/>\n';
 r += '<label for="nr_k_input">Key</label>\n';
 r += '<td/>\n';
    r += '<input type="text" id="nr_k_input" oninput="widShowKeysPropriety($(this))">\n';
 r += '</tr>\n';
    r += '<tr>\n';
 r += '<td class="td-label"/>\n';
 r += '<label for="nr_g_input">Generator</label>\n';
 r += '<td/>\n';
    r += '<input type="text" id="nr_g_input" oninput="widShowKeysPropriety($(this))">\n';
 r += '</tr>\n';
    r += '<tr>\n';
 r += '<td class="td-label"/>\n';
 r += '<label for="nr_o_input">Owner</label>\n';
 r += '<td/>\n';
    r += '<input type="text" id="nr_o_input" oninput="widShowKeysPropriety($(this))">\n';
 r += '</tr>\n';
    r += '<tr>\n';
 r += '<td class="td-label"/>\n';
 r += '<label for="nr_d_input">Data</label>\n';
 r += '<td/>\n';
    r += '<input type="text" id="nr_d_input" oninput="">\n';
 r += '</tr>\n';
 r += '</table>\n';

    return r;
}

function widGetHTMLRecTabSubmitArea()
{
    var r = '';

    r += '<table id="table_submit_area">\n';
    r += '<tr>\n';
 r += '<td id="td_label_records_encrypt" class="td-label"/>\n';
 r += '<label for="input_records_encrypt">Admin mode</label>';
 r += '<td id="td_input_records_encrypt"/>\n';
    r += '<input id="input_records_encrypt" type="checkbox">\n';
 r += '<td id="td_submit_button"/>\n';
 r += '<button id="submit_button" onclick="widSubmitButtonClick()">Submit</button>\n';
 r += '</tr>\n';
 r += '</table>\n';

    return r;
}

function widGetHTMLRecTabHistoryArea()
{
    var r = '';

    r += '<table>';
    r += '<tr>\n';
    r += '<td class="td-records-title td-50">\n';
 r += '<b>&nbsp;History</b>\n';
    r += '<td id="td_select_records_history">\n';
    r += '<select name="tokens_history" id="select_records_history">\n';
 r += '<option selected="selected">0</option>\n';
 r += '<option>3</option>\n';
 r += '<option>10</option>\n';
 r += '<option>30</option>\n';
 r += '</select>\n';
 r += '<td/>\n';
 r += '<label for="select_records_history">last records</label>\n';
 r += '</tr>\n';
    r += '<tr>\n';
 r += '<td colspan="3"/>\n';
 r += '<textarea id="textarea_records_history" readonly></textarea>\n';
 r += '</tr>\n';
 r += '</table>';

    return r;
}

function widGetHTMLRecTabLogArea()
{
    var r = '';
 r += '<div id="div_records_log">&nbsp;</div>\n';
    return r;
}

function widGetHTMLRecordsTab()
{
    var r = '';

    r += '<table border="0">\n';
    r += '<tr>\n';
 r += '<td class="td-50"/>\n';
    r += widGetHTMLRecTabTokArea();
 r += '<td class="td-50"/>\n';
    r += widGetHTMLRecTabLRArea();
 r += '</tr>\n';
    r += '<tr>\n';
 r += '<td colspan="2"/>\n';
 r += '<hr/>';
 r += '</tr>\n';
    r += '<tr>\n';
 r += '<td class="td-50"/>\n';
    r += widGetHTMLRecTabPwdArea();
 r += '<td class="td-50"/>\n';
    r += widGetHTMLRecTabNRArea();
 r += '</tr>\n';
    r += '<tr>\n';
 r += '<td/>\n';
 r += '<td/>\n';
    r += widGetHTMLRecTabSubmitArea();
 r += '</tr>\n';
    r += '<tr>\n';
 r += '<td colspan="2"/>\n';
 r += '<hr/>';
 r += '</tr>\n';
    r += '<tr>\n';
 r += '<td colspan="2"/>\n';
    r += widGetHTMLRecTabHistoryArea();
 r += '</tr>\n';
    r += '<tr>\n';
 r += '<td colspan="2"/>\n';
 r += '<hr/>';
 r += '</tr>\n';
    r += '<tr>\n';
 r += '<td colspan="2"/>\n';
    r += widGetHTMLRecTabLogArea();
 r += '</tr>\n';
    r += '<tr>\n';
 r += '<td colspan="2"/>\n';
 r += '<hr/>';
 r += '</tr>\n';
 r += '</table>\n';

    return r;
}

function widGetHTMLHashcalcTab()
{
    var r = '';

    r += '<table>\n';
    r += '<tr>\n';
 r += '<td/>' + widGetHTMLHashcalcSelect();
 r += '</tr>\n';
    r += '<tr>\n';
 r += '<td/>\n';
 r += '<textarea rows="5" id="textarea_hashcalc_in" oninput="widHashcalcOninput()"></textarea>';
 r += '</tr>\n';
    r += '<tr>\n';
 r += '<td/>';
 r += '<textarea rows="3" id="textarea_hashcalc_out" readonly></textarea>';
 r += '</tr>\n';
    r += '<tr>\n';
 r += '<td id="td_hashcalc_buttons"/>\n';
 r += '<button id="send_to_k_button" onclick="return $(\'#nr_k_input\').val($(\'#textarea_hashcalc_out\').val())">Send to K</button>\n';
 r += '<button id="send_to_g_button" onclick="return $(\'#nr_g_input\').val($(\'#textarea_hashcalc_out\').val())">Send to G</button>\n';
 r += '<button id="send_to_o_button" onclick="return $(\'#nr_o_input\').val($(\'#textarea_hashcalc_out\').val())">Send to O</button>\n';
 r += '</tr>\n';
 r += '</table>\n';

    return r;
}

function widGetHTMLHashcalcSelect()
{
    var r = '';

    r += '<select id="select_hashcalc">\n';
 r += '<option value="0">MD5</option>\n';
 r += '<option value="1">RIPEMD-160</option>\n';
 r += '<option value="2">SHA2-256</option>\n';
 r += '<option value="3">SHA2-512</option>\n';
 r += '<option value="4">SMD</option>\n';
 r += '<option value="4">WORD</option>\n';
 r += '</select>\n';

    return r;
}

function widGetHTMLCommandTab()
{
    var r = '';

    r += '<table border="0">\n';
    r += '<tr>\n';
 r += '<td id="td_button_cmd"/>\n';
 r += '<button type="submit" id="button_cmd" onclick="widCommandSendButtonClick()">Send</button>\n';
 r += '<td/>\n';
 r += '<input type="text" id="input_cmd" title="type a command;" value="ping" onkeypress="return widSendCommandInputOnpresskey($(this), event);"/>\n';
 r += '<td id="td_skc"/>\n';
    r += widGetHTMLSpanImg('span_skc', 'widAddSkc()');
 r += '<img></img>';
 r += '</tr>\n';
    r += '<tr>\n';
 r += '<td colspan="3"/>\n';
 r += '<textarea id="textarea_cmd" readonly></textarea>\n';
 r += '</tr>\n';
 r += '</table>\n';

    return r;
}
