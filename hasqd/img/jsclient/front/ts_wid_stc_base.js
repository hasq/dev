// Hasq Technology Pty Ltd (C) 2013-2016

function widBody(tabs){
	var r = '';
    r += '<table width="100%" border="0" nowrap>\n';
		r += '<tr>\n';
			r += '<td nowrap>' + widClientTitle(glClientTitle) + '\n';
			r += '<td style="text-align:right">' + widClientLed('hasqd_led') + '\n';
		r += '</tr>\n';	
		r += '<tr>\n';
			r += '<td colspan="2" nowrap>' + widMainInputsArea() + '\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td width="100%" colspan="2" nowrap>' + widMainTabs(tabs) + '\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td width="100%" colspan="2" nowrap><hr/>\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td width="100%" colspan="2" nowrap>' + widLogArea() + '\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td width="100%" colspan="2" nowrap><hr/>\n';
		r += '</tr>\n';
    r += '</table>\n';
	
    return r;
}

function widClientTitle(text) {
    var r = '';
    r += '<table border="0">\n';
		r += '<tr>\n';
			r += '<td>\n';
				r += '<div style="font-size:20px">\n' + text + '</div>\n';
		r += '</tr>\n';
		r += '</table>\n';
    return r;
}

function widClientLed(span_id) {
    var r = '';
    r += '<span id="' + span_id + '"></span>\n';
    return r;
}


function widMainInputsArea(){
    var r = '';

    r += '<table width="100%" border="0" style="border: 1px solid #DDDDDD;">\n';
		r += '<tr>\n';
			r += '<td width="1%" style="text-align:right;" nowrap>\n'
				r += '&nbsp;' + '<b>Token</b>' + '&nbsp;\n';
			r += '<td width="40%" style="text-align:left" nowrap>\n';
				r += '<input type="text" id="token_input" oninput="widTokensValueOninput(this.id);" placeholder="Enter tokens value"/>\n';
			r += '<td width="15px" id="token_pic_td" style="text-align:left">\n'; //picGry;
			r += '<td id="tokens_hashed_value_td" class="monospace" nowrap>' + widStringsGrow('&nbsp',32) + '\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td style="text-align:left">\n';
				r += '&nbsp;' + '<b>Password</b>' + '&nbsp\n';
			r += '<td style="text-align:left">\n';
				r += '<input type="password" id="password_input" oninput="widTokensPasswordOninput(this.id);" class="password" placeholder="Enter tokens password" oninput=""/>\n'; // disabled/>\n';
			r += '<td width="15px" id="password_pic_td" style="text-align:left">\n'; //picGry;
			r += '<td id="password_zxcvbn_td" style="text-align:left; font-style: italic">\n';
				//r += '<input type="checkbox" id="show_hide_input"/>\n';
				//r += '<label for="show_hide_input" id="show_hide_label">Show password</label>\n';
		r += '<tr>\n';
			r += '<td>';
			r += '<td style="text-align:right">\n';
				r += '<input type="checkbox" id="show_hide_input"/>\n';
				r += '<label for="show_hide_input" id="show_hide_label">Show password</label>\n';
			r += '<td>';
			r += '<td>';
		r += '</tr>\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td colspan="4" style="text-align:left;">\n';
				r += '<table width="100%">\n';
					r += '<tr>\n';
						r += '<td>\n';
							r += '<pre id="tokens_data_pre"></pre>';
					r += '</tr>\n';
				r += '</table>\n';
		r += '</tr>\n';
    r += '</table>\n';

    return r;
}

function widMainTabs(items) {
    var r = '';

    r += '<div id="tabs">\n';
    r += '\t<ul>\n';

    for (var i = 0; i < items.length; i++) {
        r += '\t<li><a href="#tabs-' + (i + 1) + '">' + items[i].title + '</a>\n';
	}
	
    r += '\t</ul>\n';

    for (var i = 0; i < items.length; i++) {
        r += '\t<div id="tabs-' + (i + 1) + '">' + items[i].data + '</div>\n';
	}
	
    r += '</div>\n';

    return r;
}

function widCreateTab(){
	var r = '';
	
	r += '<table>\n';
		r += '<tr>\n';
			r += '<td>\n'
				r += '<button id="create_button" onclick="widCreateButtonClick()">Create';
		r += '</tr>\n';
	r += '</table>\n';
	
	return r;
}

function widSearchTab(){
	var r = '';
	
	return r;	
}

function widSendTab(){
	var r = '';
	
	return r;	
}

function widReceiveTab(){
	var r = '';
	
	return r;	
}

function widSetTab(){
	var r = '';
	
	return r;	
}

function widLogArea(){
    var r = '';
    r += '<pre id="tokens_log_pre">&nbsp</pre>\n';
    return r;
}
