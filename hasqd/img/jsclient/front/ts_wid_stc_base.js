// Hasq Technology Pty Ltd (C) 2013-2016

function widBody(tabs){
	var r = '';
    r += '<table width="100%" border="1" nowrap>\n';
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

    r += '<table width="100%" border="0">\n';
		r += '<tr>\n';
			r += '<td width="1%" style="text-align:left" nowrap>\n'
				r += '&nbsp;' + 'Token' + '&nbsp;\n';
			//r += '<td width="1%" style="text-align:right">' + picGry;
			r += '<td width="40%" style="text-align:left" nowrap>\n';
				r += '<input type="text" id="tokens_raw_value_input" oninput="widTokensValueOninput(this.id);" placeholder="Enter tokens value"/>\n';
			r += '<td id="tokens_hashed_value_td" class="monospace" nowrap>' + widStringsGrow('&nbsp',32) + '\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td style="text-align:left">\n';
				r += '&nbsp;' + 'Password' + '&nbsp\n';
			//r += '<td style="text-align:right">' + picGry;
			r += '<td style="text-align:left">\n';
				r += '<input type="password" id="tokens_password_input" oninput="widTokensPasswordOninput(this.id);" class="password" placeholder="Enter tokens password" oninput="" disabled/>\n';
			r += '<td style="text-align:left">\n';
				r += '<input type="checkbox" id="show_hide_input"/>\n';
				r += '<label for="show_hide_input" id="show_hide_label">Show password</label>\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td colspan="3" style="text-align:left;">\n';
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
