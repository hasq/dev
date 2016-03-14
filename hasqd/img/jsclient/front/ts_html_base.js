// Hasq Technology Pty Ltd (C) 2013-2016

function widGetModalWindow()
{
	var r = '';
	r += '<div id="modal_window_div">\n';
		r += '<div id="modal_content_div">\n';
			r += '<div id="modal_content_header_div"></div>\n';
			r += '<div id="modal_content_body_div">\n';
				r += '<p></p>\n';
			r += '</div>\n';
			r += '<div id="modal_content_footer_div"></div>\n';					
		r += '</div>\n';
	r += '</div>\n';
	return r;
}

function widGetHTMLSpanImg(id, func) {
	var r = '';
	if (func) {
		r += '<span id="' + id + '" onclick="' + func +'" align="center"><img src=""></img></span>\n';
	} else {
		r += '<span id="' + id + '" align="center"><img src=""></img></span>\n';
	}

    return r;
}


function widGetHTMLSpan(id, func) {
	var r = '';
	if (arguments.length > 1) {
		r += '<span align="center" id="' + id + '" onclick="' + func +'"></span>\n';
	} else {
		r += '<span align="center" id="' + id + '"></span>\n';;
	}

    return r;
}

function widGetHTMLBody(tabs) {
	var r = '';
    r += '<table width="100%" id="body_table" border="0" nowrap>\n';
		r += '<tr>\n';
			r += '<td colspan="2" align="left" nowrap>\n';
				r += widGetHTMLTitleArea();
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td colspan="2" nowrap>\n';
				r += widGetHTMLInitialDataArea() + '\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td colspan="2" nowrap>\n';
				r += '<table width="100%" style="border: 1px solid #DDDDDD;">\n';
					r += '<tr>\n';
						r += '<td class="tab-area" />\n';
							r += widGetHTMLMainTabs(tabs) + '\n';
						r += '<td class="tab-button-area" width="74" align="right" />'
							r += widGetHTMLButtonsArea() + '\n';
					r += '</tr>\n';
				r += '</table>\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td />\n';
				r += widGetHTMLLogArea() + '\n';
			r += '<td class="td-subscribe" width="160" nowrap>\n';
				r += 'Powered by ' + '<a href="http://hasq.org">' + 'Hasq Technology' + '</a>' + '<sup>\u00A9</sup>' + '2016';
		r += '</tr>\n';		
    r += '</table>\n';

		r += widGetModalWindow();

    return r;
}

function widGetHTMLTitleArea() {
	var r = '';
	r += '<table width="100%" border="0">\n';
		r += '<tr>\n';
			r += '<td class="td-title"/>\n';
				r += '<span>' + glClientTitle + '</span>\n';
			r += '<td width="30" height="30" align="center" />\n';
				r += widGetHTMLSpanImg('logo_span', 'engSendPing()') + '\n';
		r += '</tr>\n';
	r += '</table>\n';
	
	return r;
}

function widGetHTMLInitialDataArea() {
	var r = '';
	r += '<table width="100%">\n';
		r += '<tr>\n';
			r += '<td class="td-subtitle" align="center"/>\n';
				r += '<b>Token name<b>\n';
		r += '</tr>\n';
		
		r += '<tr>\n';
			r += '<td align="center" nowrap>\n';
					r += '<textarea id="token_text_textarea" oninput="widTokenTextOninput();" style="overflow-x:hidden;" type="text" rows="2" maxlength="65536" placeholder="Enter token text" required></textarea>\n';
		r += '</tr>\n';
		
		r += '<tr>\n';
			r += '<td align="left" class="td-info">\n';
				r += '<table>\n';
					r += '<tr>\n';
						r += '<td width="20" title="Update token info"/>\n';
							r += widGetHTMLSpanImg('reload_span', 'widTokenTextOninput()');
						r += '<td class="td-info" nowrap/>\n';
							r += '<div>Token hash:&nbsp</div>\n';
						r += '<td id="token_hash_td" class="td-info" nowrap/>\n';
						r += '<td />\n';
							r += '&nbsp';
						r += '<td width="20" class="td-info" height="20" />\n';
							r += widGetHTMLSpanImg('token_pic_span');
					r += '</tr>\n';
				r += '</table>\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td class="td-subtitle"/>\n';
				r += 'Master key';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td align="center">\n';
				r += '<table border="0">\n';
					r += '<tr>\n';
						r += '<td width="20" align="center">\n';
							r += widGetHTMLSpanImg('password_eye_span', 'widPasswordEyeClick($(this))');
						r += '<td width="250"/>\n';
							r += '<input oninput="widPasswordOninput($(this));" id="password_input" type="password" class="password" placeholder="Enter token master key" required/>\n';
						r += '<td width="20">\n';
							r += widGetHTMLSpanImg('password_pic_span');						
					r += '</tr>\n';
					r += '<tr>\n';
						r += '<td width="20"/>&nbsp';
						r += '<td id="password_zxcvbn_td" class="td-info"/>\n';
						r += '<td/>\n';
					r += '</tr>\n';					
				r += '</table>\n';
		r += '</tr>\n';		
		
	r += '</table>\n';
	return r;
}

function widGetHTMLButtonsArea() {
	var r = '';
	r += '<table class="tab-buttons-table">\n';
		r += '<tr>\n';
			r += '<td style="padding: 0 0"/>\n';
				r += '<button id="show_send_tab_button" class="tab-button-off" onclick="return widShowKeysTabButtonClick($(this));">' + imgTabShowKeys + '</button>\n';
		r += '</tr>\n';		
		r += '<tr>\n';
			r += '<td style="padding: 6px 0"/>\n';
				r += '<button id="show_receive_tab_button" class="tab-button-off" onclick="return widReceiveTabButtonClick($(this));">' + imgTabReceiveKeys + '</button>\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td style="padding: 0 0"/>\n';
				r += '<button id="show_search_tab_button" class="tab-button-off" onclick="return widSearchTabButtonClick($(this));">' + imgTabSearchTokens + '</button>\n';
		r += '</tr>\n';		
	r += '</table>\n';
	return r;	
}

function widGetHTMLMainTabs(items) {
    var r = '';

    r += '<div id="tabs_div" class="tabs-div">\n';
    r += '\t<ul>\n';

    for (var i = 0; i < items.length; i++) {
        r += '\t<li><a href="#tabs_' + (i + 1) + '_div">' + items[i].title + '</a>\n';
	}
	
    r += '\t</ul>\n';

    for (var i = 0; i < items.length; i++) {
        r += '\t<div id="tabs_' + (i + 1) + '_div">' + items[i].data + '</div>\n';
	}
	
    r += '</div>\n';

    return r;
}

function widGetHTMLWelcomeTab() {
	var r ='';
	r += '<table width="100%" border="0">\n';
		r += '<tr>\n';
			r += '<td class="td-subsubtitle" align="center">\n';
				r += 'Welcome to TokenSwap';
		r += '</tr>\n';		
		r += '<tr>\n';
			r += '<td class="welcome-p" />\n';
				r += '<p>\n';
					r += 'This is a place where you can create your own tokens, ';
					r += 'associate data with them, pass the ownership to another person, or to receive ';
					r += 'the ownership from somebody else. A token is a hash taken from any text or file. ';
					r += 'The master key is a secure password to control your tokens. It is not shared if ';
					r += 'you pass your token to another person.';
				r += '</p>\n';
		r += '</tr>\n';
	r += '</table>\n';	
	return r;
}

function widGetHTMLCreateTab() {
	var r = '';
	
	r += '<table id="create_table" width="100%">\n';
		r += '<tr>\n';
			r += '<td class="td-subsubtitle" align="center" colspan="2" >\n';
				r += 'Create new token';
		r += '</tr>\n';	
		r += '<tr>\n';
			r += '<td align="center">\n'
				r += '<button id="create_button" class="button-off" onclick="return widButtonClick(this);" data-onclick="widCreateButtonClick()">' + imgBtnCreate + '</button>\n';
		r += '</tr>\n';
	r += '</table>\n';
	
	return r;
}

function widGetHTMLAssignDataTab() {
	var r = '';
	
	r += '<table id="setdata_table" width="100%" border="0">\n';
		r += '<tr>\n';
			r += '<td class="td-subsubtitle" align="center" />\n';
				r += 'Token data';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td align="center">\n';
				r += '<textarea id="setdata_textarea" class="button-off" oninput="return widAssignDataTextareaOninput()" type="text" rows="3" cols="64" wrap="off"></textarea>\n';
		r += '</tr>\n';
		r += '<tr>\n';				
			r += '<td width="74" align="center">\n'
				r += '<button id="setdata_button" onclick="return widButtonClick(this);" data-onclick="widAssignDataButtonClick()">' + imgBtnData;
		r += '</tr>\n';
	r += '</table>\n';
	
	return r;
}

function widGetHTMLShowKeysTab() {
	var r = '';
	
	r += '<table id="send_table" width="100%" border="0">\n';
		r += '<tr>\n';
			r += '<td class="td-subsubtitle" align="center" >\n';
				r += 'Give token away';
		r += '</tr>\n';	
		r += '<tr>\n';
			r += '<td align="center" />\n';
				r += '<table>\n';
					r += '<tr>\n';
						r += '<td align="center" style="padding-right: 3px"/>\n';
							r += '<button id="show_keys_button" class="button-off" onclick="return widButtonClick(this)" data-onclick="widShowKeysButtonClick()">' + imgBtnShowKeys + '</button>\n';
						r += '<td align="center" style="padding-left: 3px"/>\n';
							r += '<button id="show_keys_button2" class="button-off">' + imgBtnShowKeys + '</button>\n';
					r += '</tr>\n';
				r += '</table>\n';
		r += '</tr>\n';
/*		
		r += '<tr>\n';
			r += '<td align="center" />\n';
				r += '<input type="checkbox" id="send_type_checkbox">\n';
				r += '<label for="send_type_checkbox" style="font:italic 10px consolas">2-step transfer</label>\n';	
		r += '</tr>\n';			
*/
		r += '<tr>\n';				
			r += '<td rowspan="2" />\n';
				r += '<table width="100%">\n';
					r += '<tr>\n';
						r += '<td />\n';
							r += '<textarea id="send_simple_textarea" class="textarea-transkeys" style="overflow-x:hidden;" wrap="on" rows="3" type="text" readonly></textarea>\n';
					r += '</tr>\n';
					r += '<tr>\n';
						r += '<td />\n';
							r += '<textarea id="send_blocking_textarea" class="textarea-transkeys" style="overflow-x:hidden;" wrap="on" rows="3" type="text" readonly></textarea>\n';
					r += '</tr>\n';					
				r += '</table>\n';
		r += '</tr>\n';
	r += '</table>\n';
	
	return r;	
}

function widGetHTMLReceiveTab() {
	var r = '';
	
	r += '<table id="receive_table" width="100%" border="0" >\n';
		r += '<tr>\n';
			r += '<td class="td-subsubtitle" align="center" />\n';
				r += 'Receive token';
		r += '</tr>\n';	
		r += '<tr>\n';
			r += '<td align="center">\n'
				r += '<textarea id="receive_textarea" oninput="return widReceiveTextareaOninput()" style="overflow-x:hidden;" type="text" rows="3" cols="64" maxlength="65536" wrap="on" required></textarea>\n';
		r += '</tr>\n';	
		r += '<tr>\n';				
			r += '<td width="74" style="text-align: center">\n';
				r += '<button id="receive_button" class="button-off" onclick="return widButtonClick(this)" data-onclick="widReceiveButtonClick()">' + imgBtnReceiveKeys + '</button>\n';
		r += '</tr>\n';
	r += '</table>\n';

	return r;	
}

function widGetHTMLSearchTab() {
	var r = '';
	r += '<table id="search_table" align="center" border="0">\n';
		r += '<tr>\n';
			r += '<td class="td-subsubtitle" align="center" />\n';
				r += 'View my token';
		r += '</tr>\n';	
		r += '<tr>\n';
			r += '<td>\n';	
				r += '<label for="from_date">From:</label>\n';
				r += '<input id="from_datepicker_input" name="from_date">\n';
				r += '<label for="to_date">to:</label>\n';
				r += '<input id="to_datepicker_input" name="to_date">\n';
		r += '</tr>\n';		
		r += '<tr>\n';				
			r += '<td>\n';
				r += '<button id="search_button" class="button-off" onclick="return widButtonClick(this);" data-onclick="widSearchButtonClick()">' + imgBtnSearch + '</button>\n';
		r += '</tr>\n';		
	r += '</table>\n';	
	return r;	
}


function widGetHTMLEmptyTab() {
	var r ='';
	r += '<table width="100%" border="0">\n';
		r += '<tr>\n';
			r += '<td />\n';
		r += '</tr>\n';
	r += '</table>\n';	
	return r;
}


function widGetHTMLLogArea() {
    var r = '';
	r += '<table width="100%">\n';
		r += '<tr>\n';
			r += '<td class="td-info" />\n';
				r += '<div id="log_area_div" >&nbsp</div>\n';
		r += '</tr>\n';		
	r += '</table>\n';
    return r;
}
