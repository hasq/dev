function widBody(tabs){
	var r = '';
    r += '<table width="100%" border="1" style="border-collapse:collapse;">\n';
    r += '<tr>\n';
    r += '<td>\n' + widClientTitle(glClientTitle);
    r += '</tr>\n';	
    r += '<tr>\n';
    r += '<td width="100%">' + widTokensInputArea() + '\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td width="100%">' + widMainTabs(tabs) + '\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td width="100%"><hr/>\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td width="100%">' + widLogArea() + '\n';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td width="100%"><hr/>\n';
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

function widClientLed(span_id){
    var r = '';
    r += '<span id="' + span_id + '"></span>\n';
    return r;
}

function widTokensInputArea(){
    var r = '';

    r += '<table border="1" style="border-collapse:collapse;border-spacing:0;">\n';
    r += '<tr>\n';
	r += '<td nowrap style="text-align:left">Token&nbsp\n';
    r += '<td tyle="text-align:left"><input type="text" nowrap id="tokens_name_input" size="64" oninput="" placeholder="Enter tokens value"></input>\n';
	r += '<td>';
    r += '</tr>\n';
    r += '<tr>\n';
    r += '<td style="text-align:left" calspan="2">Password&nbsp\n';
    r += '<td tyle="text-align:left"><input type="password" id="tokens_password_input" class="password" size="64" placeholder="Enter tokens password" oninput="">\n';
	r += '<td style="text-align:left" nowrap>';
		r += '<input nowrap type="checkbox" id="show_hide" />';
		r += '<label for="show_hide" id="show_hide_label">Show Password</label>';
    r += '</tr>\n';
    r += '</table>\n';

    return r;
}

function widMainTabs(items) {
    var r = '';

    r += '<div id="main_tabs">\n';

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

function widProgressBarArea(){
    var r = '';
    r += '<div id="tokens_progressbar" style="text-align:center">\n<div class="tokens-progressbar-label" style="text-align:center">\n</div>\n</div>\n';
    return r;
}