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
        r += '<span id="' + id + '" onclick="' + func + '" align="center"><img src=""></img></span>\n';
    else
        r += '<span id="' + id + '" align="center"><img src=""></img></span>\n';

    return r;
}

function widGetHTMLSpan(id, func)
{
    var r = '';

    if (func)
        r += '<span align="center" id="' + id + '" onclick="' + func + '"></span>\n';
    else
        r += '<span align="center" id="' + id + '"></span>\n'; ;

    return r;
}

function widGetHTMLBody(tabs)
{
    var r = '';

    r += '<table width="100%" id="body_table" border="0" nowrap>\n';
    {
        r += '<tr>\n';
        {
            r += '<td align="left" nowrap>\n';
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
            r += '<table width="100%" style="border: 1px solid #DDDDDD;">\n';
            {
                r += '<tr>\n';
                {
                    r += '<td class="tab-area" />\n';
                    r += widGetHTMLMainTabs(tabs) + '\n';
                    r += '<td class="tab-button-area" width="74" align="right" />'
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
            r += '<table width="100%" border="0">\n'; //style="border: 1px solid #DDDDDD;">\n';
            {
                r += '<tr>\n';

                {
                    r += '<td class="td-subscribe" width="160" style="text-align: left;"/>\n';
                    r += 'Powered by ' + '<a href="http://hasq.org">Hasq Technology</a>\n';
                    r += '<td class="td-log" />\n';
                    r += widGetHTMLLogArea() + '\n';
                    r += '<td class="td-subscribe" width="40" />\n';
                    r += '<a href="hqclnt.html">HqClnt</a>\n';
                    r += '<td class="td-subscribe" width="80"/>\n';
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

    r += '<table width="100%" border="0">\n';
    {
        r += '<tr>\n';
        {
            r += '<td class="td-title"/>\n';
            r += '<span>' + glClientTitle + '</span>\n';
            r += '<td width="30" height="30" align="center" />\n';
            r += widGetHTMLSpanImg('info_span', 'widModalWindow(\'FIX ME\')') + '\n';
            r += '<td width="30" height="30" align="center" />\n';
            r += '<td width="30" height="30" align="center" />\n';
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
    r += '<table width="100%">\n';
    {
        r += '<tr>\n';
        r += '<td class="td-subtitle" align="center"/>\n';
        r += '<b>Token name<b>\n';
        r += '</tr>\n';

        r += '<tr>\n';
        r += '<td align="center" nowrap>\n';
        r += '<textarea id="token_text_textarea" oninput="widTokenTextOninput(500);" style="overflow-x:hidden;" type="text" rows="2" maxlength="65536" placeholder="Enter token text" required></textarea>\n';
        r += '</tr>\n';

        r += '<tr>\n';
        {
            r += '<td align="left" class="td-info">\n';
            {
                r += '<table>\n';
                {
                    r += '<tr>\n';
                    {
                        r += '<td width="20" title="Update token info"/>\n';
                        r += widGetHTMLSpanImg('reload_span', 'widTokenTextOninput()');
                        r += '<td class="td-info" nowrap/>\n';
                        r += '<div>Token hash:&nbsp</div>\n';
                        r += '<td id="token_hash_td" class="td-info" nowrap/>\n';
                        r += '<td />\n';
                        r += '&nbsp';
                        r += '<td width="20" class="td-info" height="20" />\n';
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
            r += '<td align="center">\n';
            {
                r += '<table border="0">\n';
                {
                    r += '<tr>\n';
                    {
                        r += '<td width="20" align="center">\n';
                        r += widGetHTMLSpanImg('password_eye_span', 'widPasswordEyeClick($(this))');
                        r += '<td width="250"/>\n';
                        r += '<input oninput="widPasswordOninput($(this));" id="password_input" type="password" class="password" placeholder="Enter token master key" required/>\n';
                        r += '<td width="20">\n';
                        r += widGetHTMLSpanImg('password_pic_span');
                    }
                    r += '</tr>\n';
                    r += '<tr>\n';
                    {
                        r += '<td width="20"/>&nbsp';
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
    var r = '';
    r += '<table class="tab-buttons-table">\n';
    {
        r += '<tr>\n';
        {
            r += '<td style="padding: 0 0"/>\n';
            r += '<button id="show_send_tab_button" class="tab-button-off" onclick="return widShowKeysTabButtonClick($(this));">' + imgTabShowKeys + '</button>\n';
        }
        r += '</tr>\n';
        r += '<tr>\n';
        {
            r += '<td style="padding: 6px 0"/>\n';
            r += '<button id="show_receive_tab_button" class="tab-button-off" onclick="return widReceiveTabButtonClick($(this));">' + imgTabReceiveKeys + '</button>\n';
        }
        r += '</tr>\n';
        r += '<tr>\n';
        {
            r += '<td style="padding: 0 0"/>\n';
            r += '<button id="show_search_tab_button" class="tab-button-off" onclick="return widSearchTabButtonClick($(this));">' + imgTabSearchTokens + '</button>\n';
        }
        r += '</tr>\n';
    }
    r += '</table>\n';
    return r;
}

function widGetHTMLMainTabs(items)
{
    var r = '';

    r += '<div id="tabs" class="tabs-div">\n';
    r += '\t<ul>\n';

    for (var i = 0; i < items.length; i++)
        r += '\t<li><a href="#tabs_' + i + '_div">' + items[i].title + '</a>\n';

    r += '\t</ul>\n';

    for (var i = 0; i < items.length; i++)
        r += '\t<div id="tabs_' + i + '_div">' + items[i].data + '</div>\n';

    r += '</div>\n';

    return r;
}

function widGetHTMLWelcomeTab()
{
    var r = '';

    r += '<table width="100%" border="0">\n';
    {
        r += '<tr>\n';
        {
            r += '<td class="td-tab-subtitle" align="center">\n';
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

    r += '<table id="create_table" width="100%">\n';
    {
        r += '<tr>\n';
        {
            r += '<td class="td-tab-subtitle" align="center" colspan="2" >\n';
            r += 'Create new token';
        }
        r += '</tr>\n';
        r += '<tr>\n';
        {
            r += '<td align="center">\n'
                 r += '<button id="create_button" class="button-off" onclick="return widCreateButtonClick($(this));">' + imgBtnCreate + '</button>\n';
        }
        r += '</tr>\n';
    }
    r += '</table>\n';

    return r;
}

function widGetHTMLAssignDataTab()
{
    var r = '';

    r += '<table id="setdata_table" width="100%" border="0">\n';
    {
        r += '<tr>\n';
        {
            r += '<td class="td-tab-subtitle" />\n';
            r += 'Token data';
        }
        r += '</tr>\n';
        r += '<tr>\n';
        {
            r += '<td align="center" id="assign_data_textarea_td">\n';
            r += '<textarea id="assign_data_textarea" class="button-off" oninput="return widAssignDataTextareaOninput()" type="text" rows="5" cols="64" wrap="off"></textarea>\n';
        }
        r += '</tr>\n';
        r += '<tr>\n';
        {
            r += '<td class="td-button">\n'
                 r += '<button id="setdata_button" onclick="return widAssignDataButtonClick($(this));">' + imgBtnData + '</button>\n';
        }
        r += '</tr>\n';
    }
    r += '</table>\n';

    return r;
}

function widGetHTMLShowKeysTab()
{
    var r = '';

    r += '<table id="show_keys_table" width="100%" border="0">\n';
    {
        r += '<tr>\n';
        {
            r += '<td class="td-tab-subtitle" />\n';
            r += 'Show keys';
        }
        r += '</tr>\n';
        r += '<tr>\n';
        {
            r += '<td align="center" style="padding:0;"/>\n';
            {
                r += '<table>\n';
                {
                    r += '<tr>\n';
                    {
                        r += '<td class="td-button" />\n';
                        r += '<button id="show_instant_button" class="button-off" onclick="return widShowInstantButtonClick($(this))">' + imgBtnInstantKeys + '</button>\n';
                        r += '<td class="td-button" style="padding-left: 6px; padding-right: 6px"/>\n';
                        r += '<button id="show_on_hold_button" class="button-off" onclick="return widShowOnHoldButtonClick($(this))">' + imgBtnOnHoldKeys + '</button>\n';
                        r += '<td class="td-button" />\n';
                        r += '<button id="show_release_button" class="button-off" onclick="return widShowReleaseButtonClick($(this))">' + imgBtnReleaseKeys + '</button>\n';
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

    r += '<table id="receive_table" width="100%" border="0">\n';
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
            r += '<button id="receive_button" class="button-off" onclick="return widReceiveButtonClick($(this))">' + imgBtnReceiveKeys + '</button>\n';
        }
        r += '</tr>\n';
    }
    r += '</table>\n';

    return r;
}

function widGetHTMLSearchTab()
{
    var r = '';

    r += '<table id="search_table" align="center" border="0">\n';
    {
        r += '<tr>\n';
        {
            r += '<td class="td-tab-subtitle" align="center" />\n';
            r += 'Search for tokens';
        }
        r += '</tr>\n';
        r += '<tr>\n';
        {
            r += '<td>\n';
            {
                r += '<label for="from_date">From:</label>\n';
                r += '<input id="from_datepicker_input" name="from_date">\n';
                r += '<label for="to_date">to:</label>\n';
                r += '<input id="to_datepicker_input" name="to_date">\n';
                r += '<button id="search_button" class="button-off" onclick="return widSearchButtonClick($(this));">' + imgBtnSearch + '</button>\n';
            }
        }
        r += '</tr>\n';
    }
    r += '</table>\n';
    return r;
}

function widGetHTMLEmptyTab()
{
    var r = '';

    r += '<table width="100%" border="0">\n';
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

    r += '<table width="100%">\n';
    {
        r += '<tr>\n';
        r += '<td class="td-info" />\n';
        r += '<div id="log_area_div" >&nbsp</div>\n';
        r += '</tr>\n';
    }
    r += '</table>\n';

    return r;
}
