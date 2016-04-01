// Hasq Technology Pty Ltd (C) 2013-2016

function widGetModalWindow()
{
    var r = '';
    r += '<div id="modal_window">\n';
    {
        r += '<div id="modal_window_content">\n';
        {
            r += '<div id="modal_window_content_header"></div>\n';
            r += '<div id="modal_window_content_body">\n';
            {
                r += '<p></p>\n';
            }
            r += '</div>\n';
            r += '<div id="modal_window_content_footer"></div>\n';
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

    r += '<table id="body_table" style="width: 100%" border="0" nowrap>\n';
    {
        r += '<tr>\n';
        {
            r += '<td style="text-align:left;" nowrap>\n';
            r += widGetHTMLTitleArea();
        }
        r += '</tr>\n';
        r += '<tr>\n';
        {
            r += '<td nowrap>\n';
            r += widGetHTMLInitialDataArea() + '\n';
        }
        r += '</tr>\n';
        r += '<tr>\n';
        {
            r += '<td nowrap>\n';
            r += '<table style="border: 1px solid #DDDDDD; width: 100%;">\n';
            {
                r += '<tr>\n';
                {
                    r += '<td class="tab-area" />\n';
                    r += widGetHTMLTabs(tabs, 'tabs', 'tabs-div') + '\n';
                    r += '<td class="tab-button-area" />'
                    r += widGetHTMLButtonsArea() + '\n';
                }
                r += '</tr>\n';
            }
            r += '</table>\n';
        }
        r += '</tr>\n';
        r += '<tr>\n';
        {
            r += '<td />\n';
            r += '<table style="width: 100%" border="0">\n'; //style="border: 1px solid #DDDDDD;">\n';
            {
                r += '<tr>\n';

                {
                    r += '<td class="td-subscribe" style="text-align: left; width: 160px;"/>\n';
                    r += 'Powered by ' + '<a href="http://hasq.org">Hasq Technology</a>\n';
                    r += '<td class="td-log" />\n';
                    r += widGetHTMLLogArea() + '\n';
                    r += '<td class="td-subscribe" style="width: 40px;" />\n';
                    r += '<a href="hqclnt.html">HqClnt</a>\n';
                    r += '<td class="td-subscribe" style="width: 80px;"/>\n';
                    r += 'TokenSwap&nbsp;\u00A9&nbsp;2016\n';
                }
                r += '</tr>\n';
            }
            r += '</table>\n';
        }
        r += '</tr>\n';
    }
    r += '</table>\n';

    r += widGetModalWindow();

    return r;
}

function widGetHTMLTitleArea()
{
    var r = '';

    r += '<table style="width: 100%" border="0">\n';
    {
        r += '<tr>\n';
        {
            r += '<td class="td-title"/>\n';
            r += '<span>' + glClientTitle + '</span>\n';
            r += '<td style="width: 30px; height: 30px; text-align: center;"/>\n';
            r += widGetHTMLSpanImg('info_span', 'widModalWindow(\'FIXME\')') + '\n';
            r += '<td style="width: 30px; height: 30px; text-align: center;" />\n';
            r += '<td style="width: 30px; height: 30px; text-align: center;" />\n';
            r += widGetHTMLSpanImg('logo_span', 'engSendPing()') + '\n';
        }
        r += '</tr>\n';
    }
    r += '</table>\n';

    return r;
}

function widGetHTMLInitialDataArea()
{
    var r = '';
    r += '<table style="width: 100%">\n';
    {
        r += '<tr>\n';
        r += '<td class="td-subtitle"/>\n';
        r += '<b>Token name<b>\n';
        r += '</tr>\n';

        r += '<tr>\n';
        r += '<td style="text-align:center;" nowrap>\n';
        r += '<textarea id="token_text_textarea" oninput="widTokenTextOninput(500);" style="overflow-x:hidden;" type="text" rows="2" maxlength="65536" placeholder="Enter token text" required></textarea>\n';
        r += '</tr>\n';

        r += '<tr>\n';
        {
            r += '<td style="text-align:left;" class="td-info">\n';
            {
                r += '<table>\n';
                {
                    r += '<tr>\n';
                    {
                        r += '<td style="width: 20px;" title="Update token info"/>\n';
                        r += widGetHTMLSpanImg('reload_span', 'widTokenTextOninput()');
                        r += '<td class="td-info" nowrap/>\n';
                        r += '<div>Token hash:&nbsp</div>\n';
                        r += '<td id="token_hash_td" class="td-info" nowrap/>\n';
                        r += '<td />\n';
                        r += '&nbsp';
                        r += '<td style="width: 20px;" class="td-info" height="20" />\n';
                        r += widGetHTMLSpanImg('token_pic_span');
                    }
                    r += '</tr>\n';
                }
                r += '</table>\n';
            }
        }
        r += '</tr>\n';
        r += '<tr>\n';
        {
            r += '<td class="td-subtitle"/>\n';
            r += 'Master key';
        }
        r += '</tr>\n';
        r += '<tr>\n';
        {
            r += '<td />\n';
            {
                r += '<table style="margin: auto;" border="0">\n';
                {
                    r += '<tr>\n';
                    {
                        r += '<td style="width: 28px; text-align: right">\n';
                        r += widGetHTMLSpanImg('password_eye_span', 'widPasswordEyeClick($(this))');
                        r += '<td style="width: 250px; text-align: center"/>\n';
                        r += '<input oninput="widPasswordOninput($(this));" id="password_input" type="password" class="password" placeholder="Enter token master key" required/>\n';
                        r += '<td style="width: 28px; text-align: left;">\n';
                        r += widGetHTMLSpanImg('password_pic_span');
                    }
                    r += '</tr>\n';
                    r += '<tr>\n';
                    {
                        r += '<td style="width: 20px;"/>&nbsp';
                        r += '<td id="password_zxcvbn_td" class="td-info"/>\n';
                        r += '<td/>\n';
                    }
                    r += '</tr>\n';
                }
                r += '</table>\n';
            }
        }
        r += '</tr>\n';
    }
    r += '</table>\n';
    return r;
}

function widGetHTMLButtonsArea()
{
    var f = function (id, tabId, img)
    {
        var r = '';
        r += '<tr>\n';
        r += '<td style="padding: 0 0 6px 0"/>\n';
            r += '<button id="' + id + '" class="tab-button-off" onclick="return widTabButtonClick($(this),' + tabId + ')">' + img + '</button>\n';
        r += '</tr>\n';
        return r;
    }

    var r = '';

    r += '<table class="tab-buttons-table">\n';
    {
        r += f ('show_send_tab_button', 0, imgTabShowKeys);
        r += f ('show_receive_tab_button', 1, imgTabReceiveKeys);
        r += f ('show_search_tab_button', 2, imgTabSearchTokens);
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
        r += '<div id="' + id + '_div">\n';
    else
        r += '<div id="' + id + '_div" class="' + classId + '">\n';

    r += '\t<ul id="' + id + '_ul">\n';

    for (var i = 0; i < items.length; i++)
        r += '\t<li><a href="#' + id + '_' + i + '_div">' + items[i].title + '</a>\n';

    r += '\t</ul>\n';

        for (var i = 0; i < items.length; i++)
        r += '\t<div id="' + id + '_' + i + '_div">' + items[i].data + '</div>\n';

    r += '</div>\n';

            return r;
}

function widGetHTMLWelcomeTab()
{
    var r = '';

    r += '<table style="width: 100%;" border="0">\n';
    {
        r += '<tr>\n';
        {
            r += '<td class="td-tab-subtitle">\n';
            r += 'Welcome to TokenSwap';
        }
        r += '</tr>\n';
        r += '<tr>\n';
        {
            r += '<td class="welcome-p" />\n';
            {
                r += '<p>\n';
                r += 'This is a place where you can create your own tokens, ';
                r += 'associate data with them, pass the ownership to another person, or to receive ';
                r += 'the ownership from somebody else. A token is a hash taken from any text or file. ';
                r += 'The master key is a secure password to control your tokens. It is not shared if ';
                r += 'you pass your token to another person.';
                r += '</p>\n';
            }
        }
        r += '</tr>\n';
    }
    r += '</table>\n';

    return r;
}

function widGetHTMLCreateTab()
{
    var r = '';

    r += '<table id="create_table" style="width: 100%">\n';
    {
        r += '<tr>\n';
        {
            r += '<td class="td-tab-subtitle" colspan="2" />\n';
            r += 'Create new token';
        }
        r += '</tr>\n';
        r += '<tr>\n';
        {
            r += '<td style="text-align:center;" />\n'
            r += '<button id="create_button" class="show-keys-button-off" onclick="return widCreateButtonClick($(this));">' + imgBtnCreate + '</button>\n';
        }
        r += '</tr>\n';
    }
    r += '</table>\n';

    return r;
}

function widGetHTMLSetDataTab()
{
    var r = '';

    r += '<table id="set_data_table" border="0">\n';
    {
        r += '<tr>\n';
        {
            r += '<td class="td-tab-subtitle" />\n';
            r += 'Token data';
        }
        r += '</tr>\n';
        r += '<tr>\n';
        {
            r += '<td id="set_data_textarea_td">\n';
            r += '<textarea id="set_data_textarea" oninput="return widSetDataTextareaOninput()" type="text" wrap="off"></textarea>\n';
        }
        r += '</tr>\n';
        r += '<tr>\n';
        {
            r += '<td class="td-button">\n'
            r += '<button id="set_data_button" class="button-disabled" onclick="return widSetDataButtonClick($(this));">' + imgBtnData + '</button>\n';
        }
        r += '</tr>\n';
    }
    r += '</table>\n';

    return r;
}

function widGetHTMLShowKeysTab()
{
    var r = '';

    r += '<table id="show_keys_table" style="width: 100%">\n';
    {
        r += '<tr>\n';
        {
            r += '<td class="td-tab-subtitle" />\n';
            r += 'Show keys';
        }
        r += '</tr>\n';
        r += '<tr>\n';
        {
            r += '<td style="padding:0;"/>\n';
            {
                r += '<table style="margin:auto">\n';
                {
                    r += '<tr>\n';
                    {
                        r += '<td class="td-button" />\n';
                        r += '<button id="show_instant_button" class="show-keys-button-off" onclick="return widShowInstantButtonClick($(this))">' + imgBtnInstantKeys + '</button>\n';
                        r += '<td class="td-button" style="padding-left: 6px; padding-right: 6px"/>\n';
                        r += '<button id="show_on_hold_button" class="show-keys-button-off" onclick="return widShowOnHoldButtonClick($(this))">' + imgBtnOnHoldKeys + '</button>\n';
                        r += '<td class="td-button" />\n';
                        r += '<button id="show_release_button" class="show-keys-button-off" onclick="return widShowReleaseButtonClick($(this))">' + imgBtnReleaseKeys + '</button>\n';
                    }
                    r += '</tr>\n';
                }
                r += '</table>\n';
            }
        }
        r += '</tr>\n';

        r += '<tr>\n';
        {
            r += '<td id="show_keys_textarea_td" />\n';
            r += '<textarea id="show_keys_textarea" style="overflow-x:hidden;white-space:pre-wrap;" wrap="soft" rows="6" type="text" readonly></textarea>\n';

        }
        r += '</tr>\n';
    }
    r += '</table>\n';

    return r;
}

function widGetHTMLReceiveTab()
{
    var r = '';

    r += '<table id="receive_table" style="width: 100%" border="0">\n';
    {
        r += '<tr>\n';
        {
            r += '<td class="td-tab-subtitle" />\n';
            r += 'Paste keys';
        }
        r += '</tr>\n';
        r += '<tr>\n';
        {
            r += '<td id="receive_keys_textarea_td"/>\n';
            r += '<textarea id="receive_keys_textarea" oninput="return widReceiveTextareaOninput()" style="overflow-x:hidden; white-space:pre-wrap;" type="text" rows="6" cols="64" maxlength="65536" wrap="on"></textarea>\n';
            r += '</td>\n';
        }
        r += '</tr>\n';
        r += '<tr>\n';
        {
            r += '<td class="td-button" />\n';
            r += '<button id="receive_button" class="show-keys-button-off" onclick="return widReceiveButtonClick($(this))">' + imgBtnReceiveKeys + '</button>\n';
        }
        r += '</tr>\n';
    }
    r += '</table>\n';

    return r;
}

function widGetHTMLSearchTab()
{
    var r = '';

    r += '<table id="search_table" style="width:100%; margin: 0;" border="0">\n';
    {
        r += '<tr>\n';
        {
         r += '<td id="search_tab_buttons_td" rowspan="2"/>\n';
            r += widGetHTMLInSearchTabsButtons();

            r += '<td class="td-tab-subtitle" colspan="2"/>\n';
            r += 'Search for tokens';
        }
        r += '</tr>\n';
        r += '<tr>\n';
        {
             r += '<td id="search_tab_result_td" style="vertical-align: top;"/>\n';
            r += widGetHTMLInSearchTabs();

            r += '<td style="width: 12em; vertical-align: top;"/>\n';
            {
                r += '<table style="margin: 0 0 0 6px; height: 196px; border: 0" border="0">\n';
                {
                    r += '<tr>\n';
                    {
                        r += '<td style="text-align:left; width: 50px"/>\n';
                        r += '<label for="from_datepicker_input">From</label>\n';
                        r += '<td style="text-align:right;"/>\n';
                        r += '<input id="from_datepicker_input" type="text">\n';
                    }
                    r += '</tr>\n';
                    r += '<tr>\n';
                    {
                        r += '<td style="text-align: left;"/>\n';
                        r += '<label for="to_datepicker_input">To</label>\n';
                        r += '<td style="text-align: right; "/>\n';
                        r += '<input id="to_datepicker_input" type="text">\n';
                    }
                    r += '</tr>\n';
                    r += '<tr>\n';
                    {
                        r += '<td style="text-align: left;" colspan="2"/>\n';
                        r += '\u200c';
                    }
                    r += '<tr>\n';
                    {
                        r += '<td style="text-align: left;" colspan="2"/>\n';
                     r += '<label for="current_slice_span">\u200c</label>';
                        r += '<span id="current_slice_span"></span>';
                    }
                    r += '</tr>\n';
                    r += '<tr>\n';
                    {
                        r += '<td style="text-align: left;" colspan="2"/>\n';
                        r += '\u200c';
                    }
                    r += '<tr>\n';
                    {
                        r += '<td style="text-align: center;" colspan="2"/>\n';
                        {
                            r += '<button id="search_button" class="show-keys-button-off" '
                                 + 'onclick="return widSearchButtonClick($(this));">'
                             + imgBtnSearch + '</button>\n';
                        }
                    }
                    r += '</tr>\n';
                }
                r += '</table>\n';
            }
        }
        r += '</tr>\n';
    }
    r += '</table>\n';
    return r;
}

function widGetHTMLInSearchTabsButtons()
{
    var toSpan = function (data)
    {
        var r = '';

        r = '<span>(' + data + ')</span>';

        return r;
    }

    var toButton = function (tabId, btnClass, btnStyle, img, name, spanId)
    {
        var r = '';
        var onclick = 'onclick="return widSearchButtonsClick($(this),' + tabId + ')" ';
        var btnClass = 'class="' + btnClass + '" ';
        var btnStyle = 'style="' + btnStyle + '"';
        var span = '<span id="' + spanId + '" style="vertical-align:top; display:inline-block; max-width:25px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">0</span>';

        r += '<tr>\n';
        r += '<td style="padding: 0;"/>';
        r += '<button ' + onclick + btnClass + btnStyle + '>' + img + '<br/>' + toSpan(span) + '<br/>' + name + '</button>';
        r += '</tr>\n';

        return r;
    }

    var r = '';

    r += '<table border="0">\n';
    {
        r += toButton(0, 'search-tab-button-active', 'margin: 0 0 6px 0;', imgBtnSearchMine, 'Mine', 'search_mine_span');
        r += toButton(1, 'search-tab-button', 'margin: 0 0 6px 0;', imgBtnSearchOnHold, 'On hold', 'search_onhold_span');
        r += toButton(2, 'search-tab-button', 'margin: 0', imgBtnSearchToCome, 'To come', 'search_tocome_span');
        ///r += toButton(3, 'search-tab-button', imgBtnSearchPast, 'search_past_span');

    }
    r += '</table>\n';

    return r;
}
function widGetHTMLInSearchTabs()
{
    var tabs = [];
    var item;

    item = {};
    item.title = 'Mine';
    item.data = widGetHTMLMineTab();
    tabs[tabs.length] = item;

    item = {};
    item.title = 'On hold';
    item.data = widGetHTMLOnholdTab();
    tabs[tabs.length] = item;

    item = {};
    item.title = 'To come';
    item.data = widGetHTMLReceivableTab();
    tabs[tabs.length] = item;
    /*
        item = {};
        item.title = 'Past';
        item.data = widGetHTMLOldTab();
        tabs[tabs.length] = item;
    */
    return widGetHTMLTabs(tabs, 'search_inner_tabs');
}

function widGetHTMLMineTab()
{
    var r = '';

    r += '<div id="mine_search_results_div" class="div-overflow">\n';
    r += '</div>\n';

    return r;
}

function widGetHTMLOnholdTab()
{
    var r = '';
    r += '<div id="onhold_search_results_div" class="div-overflow">\n';
    r += '</div>\n';
    return r;
}

function widGetHTMLReceivableTab()
{
    var r = '';
    r += '<div id="receivable_search_results_div" class="div-overflow">\n';
    r += '</div>\n';
    return r;
}

function widGetHTMLOldTab()
{
    var r = '';
    r += '<div id="old_search_results_div" class="div-overflow">\n';
    r += '</div>\n';
    return r;
}

function widGetHTMLEmptyTab()
{
    var r = '';

    r += '<table style="width: 100%" border="0">\n';
    {
        r += '<tr>\n';
        r += '<td />\n';
        r += '</tr>\n';
    }
    r += '</table>\n';

    return r;
}

function widGetHTMLLogArea()
{
    var r = '';

    r += '<table style="width: 100%">\n';
    {
        r += '<tr>\n';
        r += '<td class="td-info" />\n';
        r += '<div id="log_area_div" >&nbsp</div>\n';
        r += '</tr>\n';
    }
    r += '</table>\n';

    return r;
}
