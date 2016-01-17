function widBody(tabs){
	var r = '';
    r += '<table width="100%" border="1" style="border-collapse:collapse;">\n';
    r += '<tr>\n';
    r += '<td>' + widClientTitle(glClientTitle) + '\n';
	r += '<td style="text-align:right">' + widClientLed('progress_led') + '\n';
    r += '</tr>\n';	
    r += '<tr>\n';
    r += '<td width="100%" colspan="2">' + widTokensInputArea() + '\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td width="100%" colspan="2">' + widMainTabs(tabs) + '\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td width="100%" colspan="2"><hr/>\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td width="100%" colspan="2">' + widLogArea() + '\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td width="100%" colspan="2"><hr/>\n';
    r += '</tr>\n';
    r += '</table>\n';
	
    return r;
}

function widClientTitle(text) {
    var r = '';
    r += '<table border="0" style="padding:0;border-collapse:collapse;border-spacing:0;">\n';
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

function widTokensInputArea(){
    var r = '';

    r += '<table border="0" style="border-collapse:collapse;border-spacing:0;">\n';
		r += '<tr>\n';
			r += '<td nowrap style="text-align:left">Token&nbsp\n';
			r += '<td style="text-align:left"><input type="text" nowrap id="tokens_value_input" size="64" oninput="widTokensValueOninput(this.id);" placeholder="Enter tokens value"></input>\n';
			r += '<td id="tokens_hashed_value_td" class="monospace">\n';
		r += '</tr>\n';
		r += '<tr>\n';
			r += '<td style="text-align:left">Password&nbsp\n';
			r += '<td tyle="text-align:left"><input type="password" id="tokens_password_input" class="password" size="64" placeholder="Enter tokens password" oninput="">\n';
			r += '<td style="text-align:left" nowrap>';
				r += '<input nowrap type="checkbox" id="show_hide_input" />';
				r += '<label for="show_hide_input" id="show_hide_label">Show Password</label>';
		r += '</tr>\n';
    r += '</table>\n';

    return r;
}

function widMainTabs(items) {
    var r = '';

    r += '<div id="main_tabs_div">\n';

    r += '\t<ul>\n';
    for (var i = 0; i < items.length; i++) {
        r += '\t<li><a href="#tabs-' + (i + 1) + '_div">' + items[i].title + '</a>\n';
	}
	
    r += '\t</ul>\n';

    for (var i = 0; i < items.length; i++) {
        r += '\t<div id="tabs-' + (i + 1) + '_div">' + items[i].data + '</div>\n';
	}
	
    r += '</div>\n';

    return r;
}

function widCreateTab() {
	var r = '';
	
	return r;
}

function widSearchTab() {
	var r = '';
	
	return r;	
}

function widSendTab() {
	var r = '';
	
	return r;	
}

function widReceiveTab() {
	var r = '';
	
	return r;	
}

function widSetTab() {
	var r = '';
	
	return r;	
}

function widLogArea(){
    var r = '';
    r += '<pre id="tokens_log_area_pre">&nbsp</pre>\n';
    return r;
}
