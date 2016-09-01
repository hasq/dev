// Hasq Technology Pty Ltd (C) 2013-2016

function widGetModalWindow()
{
    var r = '';
    r += '<div id="div_modal_window">\n';
    {
        r += '<div id="div_modal_window_content">\n';
        {
            r += '<div id="div_modal_window_content_header"></div>\n';
            r += '<div id="div_modal_window_content_body">\n';
            {
                r += '<p></p>\n';
            }
            r += '</div>\n';
            r += '<div id="div_modal_window_content_footer"></div>\n';
        }
        r += '</div>\n';
    }
    r += '</div>\n';

    return r;
}

function widGetHTMLSpanImg(id, func)
{
    var r = '';

    if (func)
        r += '<span id="' + id + '" onclick="' + func + '" style="text-align:center;"><img src=""></img></span>\n';
        else
        r += '<span id="' + id + '" style="text-align:center;"><img src=""></img></span>\n';

            return r;
}

function widGetHTMLSpan(id, func)
{
    var r = '';

    if (func)
        r += '<span style="text-align:center;" id="' + id + '" onclick="' + func + '"></span>\n';
        else
        r += '<span style="text-align:center;" id="' + id + '"></span>\n'; ;

            return r;
}

function widGetHTMLBody(tabs)
{
    var r = '';

    r += '<table id="table_body" style="width: 100%" border="0" nowrap>\n';
    {
        r += widGetHTMLTitleArea();
        r += widGetHTMLInitArea();
        r += widGetHTMLTabsArea(tabs);
        r += widGetHTMLLogArea();
    }
    r += '</table>\n';

    r += widGetModalWindow();

    return r;
}

function widGetHTMLTitleArea()
{
    var r = '';
    r += '<tr>\n';
    {
        r += '<td />\n';

        r += '<table id="table_title_area">\n';
        {
            r += '<tr>\n';
            {
                r += '<td/>';
                r += '<a href="' + gClientLink + '">' + gClientTitle + '</a>';
                r += '<td/>\n';
                r += '<td/>\n';
                r += widGetHTMLMessageBox(widGetHTMLSpanImg('span_info'));
                r += '<td/>\n';
                r += widGetHTMLMessageBox(widGetHTMLSpanImg('span_shield'));
                r += '<td/>\n';
                r += '<td/>\n';
                r += widGetHTMLSpanImg('span_logo', 'engSendPing()');
            }
         r += '</tr>\n';
        }
     r += '</table>\n';
    }
    r += '</tr>\n';

    return r;
}

function widGetHTMLMessageBox (obj)
{
    var r = '';

    if (obj)
     r += '<span class="span-message-box" onclick="widHelpMessageBox($(this))">' + obj + '</span>\n';

        return r;
}

function widGetHTMLTrTdSubtitle(isTr, text, htmlClass, other)
{
    var r = '';
    other = other || '';

    if (isTr) r += '<tr>\n';

 r += '<td class="' + htmlClass + '" ' + other + '/>\n';
    r += widGetHTMLMessageBox(text) + '\n';

 if (isTr) r += '</tr>\n';

    return r;
}

function widGetHTMLTrTextarea(id0, id1, oninput, style, attr)
{
    var r = '';

    r += '<tr>\n';

    if (id0)
        r += '<td id="' + id0 + '" style="text-align:center;" nowrap>\n';
    else
        r += '<td style="text-align:center;" nowrap>\n';

 r += '<textarea id="' + id1 + '" oninput="return ' + oninput + '" style="' + style + '" ' + attr + '></textarea>\n';
 r += '</tr>\n';

    return r;
}


function widGetHTMLTrTdButton(isTr, id, htmlClass, onclick, img)
{
    var r = '';

    if (isTr) r += '<tr>\n';

 r += '<td class="td-button" />\n'
    r += '<button id="' + id + '" class="' + htmlClass + '" onclick="return ' + onclick + '">' + img + '</button>\n';

    if (isTr) r += '</tr>\n';

    return r;
}

function widGetHTMLInitArea()
{
    var r = '';
    var id = 'textarea_token_name';
    var oninput = 'widTokenTextOninput($(this), 500)';
    var style = 'overflow-x:hidden;';
    var attr = 'type="text" placeholder="Enter token name" required';

    r += '<tr>\n';
    r += '<td nowrap>\n';
    r += '<table id="table_initial_data_area">\n';
    r += widGetHTMLTrTdSubtitle(1, 'Token name', 'td-subtitle');
    r += widGetHTMLTrTextarea('', id, oninput, style, attr);
    r += widGetHTMLTokenHash();
    r += widGetHTMLTrTdSubtitle(1, 'Master key', 'td-subtitle');
    r += widGetHTMLMasterKey();
 r += '</table>\n';
    r += '</tr>\n';

    return r;
}

function widGetHTMLTokenHash()
{
    var body = function()
    {
        var r = '';
        r += '<td id="td_reload_button" title="' + gTooltip.refresh_token + '"/>\n';
        r += widGetHTMLSpanImg('span_reload', 'widReloadButtonOnclick($(this))');
        r += '<td id="td_token_hash_label" class="td-info"/>\n';
        r += widGetHTMLMessageBox('Token hash:');
        r += '<td id="td_token_hash" class="td-info"/>\n';
        r += '<td id="td_token_lock"/>\n';
        r += widGetHTMLMessageBox(widGetHTMLSpanImg('span_token_lock'));
        r += '<td id="td_file_upload"/>\n';
        r += '<label id="label_file_upload" for="input_file_upload">File</label>\n';
        r += '<input id="input_file_upload" type="file" onchange="return widLoadFiles(this.files)"></input>';
        return r;
    };


    var r = '';

    r += '<tr>\n';
    {
        r += '<td/>\n';
        {
            r += '<table style="width: 100%">\n';
            {
                r += '<tr>\n';
                r += body();
                r += '</tr>\n';
            }
         r += '</table>\n';
        }
    };

    r += '</tr>\n';

    return r;
}

function widGetHTMLMasterKey()
{
    var r = '';

    r += '<tr>\n';
    {
     r += '<td />\n';
        {
            r += '<table id="table_master_key" border="0">\n';
            {
                r += '<tr>\n';
                {
                    r += '<td/>\n';
                    r += widGetHTMLSpanImg('span_password_eye', 'widPasswordEyeClick($(this))');
                 r += '<td/>\n';
                 r += '<input oninput="widPasswordOninput($(this));" id="input_password" type="password" class="password" placeholder="Enter token master key" required/>\n';
                    r += '<td/>\n';
                    r += widGetHTMLMessageBox(widGetHTMLSpanImg('span_password_pic'));
                }
             r += '</tr>\n';
                r += '<tr>\n';
                {
                 r += '<td/>\u200c';
                 r += '<td class="td-info"/>\n';
                    r += widGetHTMLMessageBox(widGetHTMLSpan('span_password_zxcvbn'));
                 r += '<td/>\n';
                }
             r += '</tr>\n';
            }
         r += '</table>\n';
        }
    }

 r += '</tr>\n';

    return r;
}

function widGetHTMLTabsArea(tabs)
{
    var r = '';

    r += '<tr>\n';
    {
        r += '<td nowrap>\n';
        r += '<table id="table_main_area" style="border: 1px solid #DDDDDD; width: 100%;">\n';
        {
            r += '<tr>\n';
            {
                r += '<td id="td_main_tabs_content" />\n';
                r += widGetHTMLTabs(tabs, 'tabs', 'tabs-div') + '\n';
                r += '<td id="td_main_tabs_buttons" />'
                r += widGetHTMLButtonsArea() + '\n';
            }
            r += '</tr>\n';
        }
        r += '</table>\n';
    }
    r += '</tr>\n';

    return r;
}

function widGetHTMLButtonsArea()
{
    var f = function (tabId, img)
    {
        var r = '';
        r += '<tr>\n';
        r += '<td/>\n';
            r += '<button class="tab-button-off" onclick="return widTabButtonClick($(this),' + tabId + ')">' + img + '</button>\n';
        r += '</tr>\n';
        return r;
    }

    var r = '';

    r += '<table>\n';
    {
        r += f (0, imgTabShowKeys);
        r += f (1, imgTabReceiveKeys);
        r += f (2, imgTabSearchTokens);
    }
    r += '</table>\n';

    return r;
}

function widGetHTMLTabs(items, id, classId)
{
    var r = '';

    if (!id && !classId)
        r += '<div>\n';
    else if (!id)
        r += '<div class="' + classId + '">\n';
    else if (!classId)
        r += '<div id="div_' + id + '">\n';
    else
        r += '<div id="div_' + id + '" class="' + classId + '">\n';

    r += '\t<ul id="ul_' + id + '">\n';

    for (var i = 0; i < items.length; i++)
        r += '\t<li><a href="#div_' + id + '_' + i + '">' + items[i].title + '</a>\n';

    r += '\t</ul>\n';

        for (var i = 0; i < items.length; i++)
        r += '\t<div id="div_' + id + '_' + i + '">' + items[i].data + '</div>\n';

    r += '</div>\n';

            return r;
}

function widGetHTMLCreateTab()
{
    var r = '';

    r += '<table id="table_create_tab" style="width: 100%" border="0">\n';
    r += widGetHTMLTrTdSubtitle(1, 'Create new token', 'td-tab-subtitle');
    r += widGetHTMLTrTdButton(1, 'button_create', 'show-keys-button-off', 'widCreateButtonClick($(this))', imgBtnCreate);
    r += '</table>\n';

    return r;
}

function widGetHTMLSetDataTab()
{
    var r = '';

    r += '<table id="table_set_data_tab" border="0">\n';
    {
        r += widGetHTMLTrTdSubtitle(1, 'Token data', 'td-tab-subtitle');
        r += widGetHTMLTrTextarea('', 'textarea_set_data', 'widSetDataTextareaOninput($(this))', '', 'type="text" wrap="off"');
        r += '<tr>';
     r += '<td/>';
        {
            r += '<table id="table_set_data_button">';
            r += '<tr>';
             r += '<td/>';
            r += widGetHTMLMessageBox(widGetHTMLSpan('span_data_length'));
            r += widGetHTMLTrTdButton(0, 'button_set_data', 'button-disabled', 'widSetDataButtonClick($(this))', imgBtnData);
             r += '<td/>';
         r += '</tr>';
         r += '</table>';
        }
        r += '<tr>';

    }
    r += '</table>\n';

    return r;
}

function widGetHTMLShowKeysTab()
{
    var r = '';
    var id0 = 'td_show_keys_textarea';
    var id1 = 'textarea_show_keys';
    var style = 'overflow-x:hidden;white-space:pre-wrap;';
    var attr = 'wrap="soft" rows="6" type="text" readonly';

    r += '<table id="table_show_keys_tab" style="width: 100%">\n';
    {
        r += widGetHTMLTrTdSubtitle(1, 'Show keys', 'td-tab-subtitle');
        r += widGetHTMLShowKeysButtons();
        r += widGetHTMLTrTextarea(id0, id1, 'null', style, attr);
    }
    r += '</table>\n';

    return r;
}

function widGetHTMLShowKeysButtons()
{
    var r = '';

    r += '<tr>\n';
    r += '<td id="td_show_keys_button"/>\n';
    r += '<table>\n';
    r += '<tr>\n';
    r += widGetHTMLTrTdButton(0, 'button_show_instant', 'show-keys-button-off', 'widShowInstantButtonClick($(this))', imgBtnInstantKeys);
    r += widGetHTMLTrTdButton(0, 'button_show_on_hold', 'show-keys-button-off', 'widShowOnHoldButtonClick($(this))', imgBtnOnHoldKeys);
    r += widGetHTMLTrTdButton(0, 'button_show_release', 'show-keys-button-off', 'widShowReleaseButtonClick($(this))', imgBtnReleaseKeys);
    r += '</tr>\n';
    r += '</table>\n';
    r += '</tr>\n';

    return r;
}

function widGetHTMLReceiveTab()
{
    var r = '';

    var id0 = 'td_receive_keys_textarea';
    var id1 = 'textarea_receive_keys';
    var oninput = 'widReceiveTextareaOninput($(this))';
    var style = 'overflow-x:hidden;white-space:pre-wrap;';
    var attr = 'type="text" rows="6" cols="64" maxlength="65536" wrap="on"';

    r += '<table id="table_receive_tab" style="width: 100%" border="0">\n';
    r += widGetHTMLTrTdSubtitle(1, 'Paste keys', 'td-tab-subtitle');
    r += widGetHTMLTrTextarea(id0, id1, oninput, style, attr);
    r += widGetHTMLTrTdButton(1, 'button_receive', 'show-keys-button-off', 'widReceiveButtonClick($(this))', imgBtnReceiveKeys);
    r += '</table>\n';

    return r;
}

function widGetHTMLSearchTab()
{
    var r = '';

    r += '<table id="table_search_tab" style="width:100%; margin: 0;" border="0">\n';
    {
        r += '<tr>\n';
        {
         r += '<td id="td_search_tabs_buttons" rowspan="2"/>\n';
            r += widGetHTMLSearchButtons();
            r += widGetHTMLTrTdSubtitle(0, 'Search for tokens', 'td-tab-subtitle', 'colspan="3"');
        }
        r += '</tr>\n';
        r += '<tr>\n';
        {
            r += '<td id="td_search_results"/>\n';
            r += widGetHTMLSearchResults();
         r += '<td class="td-visible" onclick="widHideOnclick()"/>>';
            r += widGetHTMLSearchInits();
        }
        r += '</tr>\n';
    }
    r += '</table>\n';
    return r;
}

function widGetHTMLSearchInits()
{
    var r = '';

 r += '<td id="td_search_inits"/>\n';
    {
        r += '<table border="0">\n';
        {
            r += '<tr>\n';
            {
             r += '<td id="td_label_from_datepicker"/>\n';
             r += '<label for="input_from_datepicker">From</label>\n';
             r += '<td id="td_input_from_datepicker"/>\n';
                r += '<input id="input_from_datepicker" type="text">\n';
            }
         r += '</tr>\n';
            r += '<tr>\n';
            {
             r += '<td id="td_label_to_datepicker"/>\n';
             r += '<label for="input_to_datepicker">To</label>\n';
             r += '<td id="td_input_to_datepicker"/>\n';
                r += '<input id="input_to_datepicker" type="text">\n';
            }
           r += '</tr>\n';
            r += '<tr>\n';
            {
               r += '<td id="td_search_button" colspan="2"/>\n';
                {
                    r += '<button id="button_search" class="show-keys-button-off" '
                         + 'onclick="return widSearchButtonClick($(this));">'
                     + imgBtnStart + '</button>\n';
                }
            }
           r += '</tr>\n';
            r += '<tr>\n';
            {
             r += '<td id="td_search_slice" colspan="2"/>\n';
             r += '<label for="span_current_slice">\u200c</label>';
             r += '<span id="span_current_slice"></span>';
            }
           r += '</tr>\n';
        }
       r += '</table>\n';
    }

    return r;
}

function widGetHTMLSearchButtons()
{
    var toSpan = function (data)
    {
        var r = '';

        r = '<span>' + data + '</span>';

        return r;
    }

    var toButton = function (tabId, htmlClass, img, name, spanId)
    {
        var r = '';
        var onclick = 'onclick="return widSearchResultsTabsClick($(this),' + tabId + ')" ';
        var htmlClass = 'class="' + htmlClass + '" ';
        var span = '<span id="' + spanId + '" style="vertical-align:top;"></span>';

        r += '<tr>\n';
        r += '<td/>';
        r += '<button ' + onclick + htmlClass + '>' + img + '<br/>' + toSpan(span) + '<br/>' + name + '</button>';
        r += '</tr>\n';

        return r;
    }

    var r = '';

    r += '<table>\n';
    {
        r += toButton(0, 'search-tabs-buttons-active', imgBtnSearchMine, 'Mine', 'span_search_mine');
        r += toButton(1, 'search-tabs-buttons', imgBtnSearchOnHold, 'On hold', 'span_search_onhold');
        r += toButton(2, 'search-tabs-buttons', imgBtnSearchExpected, 'Expected', 'span_search_expected');
    }
    r += '</table>\n';

    return r;
}
function widGetHTMLSearchResults()
{
    var tabs = [];
    var item;

    item = {};
    item.title = 'Mine';
    item.data = widGetHTMLSearchDiv('div_mine_search_results');
    tabs[tabs.length] = item;

    item = {};
    item.title = 'On hold';
    item.data = widGetHTMLSearchDiv('div_onhold_search_results');
    tabs[tabs.length] = item;

    item = {};
    item.title = 'To come';
    item.data = widGetHTMLSearchDiv('div_expected_search_results');
    tabs[tabs.length] = item;

    return widGetHTMLTabs(tabs, 'search_result_tabs');
}

function widGetHTMLSearchDiv(id)
{
    var r = '';

    r += '<div id="' + id + '" class="div-overflow">\n';
    r += '</div>\n';

    return r;
}


function widGetHTMLEmptyTab()
{
    var r = '';

    r += '<table style="width: 100%" border="0">\n';
    r += '<tr>\n';
    r += '<td />\n';
    r += '</tr>\n';
    r += '</table>\n';

    return r;
}

function widGetHTMLWelcomeTab()
{
    var r = '';

    r += '<table id="table_welcome">\n';
    r += '<tr>\n';
    r += '<td/>\n';
    r += gWelcome();
    r += '</tr>\n';
    r += '</table>\n';

    return r;
}

function widGetHTMLLogArea()
{
    var r = '';
    r += '<tr>\n';
    {
            r += '<td />\n';
            r += '<table style="width: 100%">\n';
        {
            r += '<tr>\n';
            {
                    r += '<td class="td-subscribe" style="text-align: left; width: 80px;"/>\n';
                    r += '<a href="hqclnt.html">HqClnt</a>\n';
                    r += '<td class="td-log" />\n';
                {
                    r += '<table style="width: 100%">\n';
                    {
                        r += '<tr>\n';
                         r += '<td class="td-info" />\n';
                         r += '<div id="div_log_area" >&nbsp</div>\n';
                         r += '</tr>\n';
                    }
                     r += '</table>\n';
                }
                    r += '<td class="td-subscribe" style="width: 160px;"/>\n';
                r += '<a href="http://hasq.org">Hasq Technology&nbsp;\u00A9&nbsp;2016</a>\n';
            }
                r += '</tr>\n';
        }
            r += '</table>\n';
    }
        r += '</tr>\n';

    return r;
}
