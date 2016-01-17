// Hasq Technology Pty Ltd (C) 2013-2015

var glClientTitle = 'Tokenswap JavaScript Client';

var picYellow = '<img src="images/yellowpoint.gif">';
var picRed = '<img src="images/redpoint.gif">';
var picGreen = '<img src="images/greenpoint.gif">';
var picGrey = '<img src="images/greypoint.gif">';
var picBlink = '<img src="images/blinkpoint.gif">';

function docMainWrite() {
	document.write(docMain());
}

function docMainInit() {
	$(document).ready(function () {
		doc_init();
	});
}

function doc_init() {
	$('#main_tabs').tabs();
	
	$('button').button();
	
	$('#show_hide').click(function() {
		if ($('.password').attr('type') == 'password') {
			$('.password').attr('type', 'text');
		} else {
			$('.password').attr('type', 'password');
		}
	});
}

function docMain() {
    var tabs = [];
    var item;

    item = {};
    item.title = 'Create token';
    item.data = widCreateTab();
    tabs[tabs.length] = item;

    item = {};
    item.title = 'Set data';
    item.data = widSetTab();
    tabs[tabs.length] = item;	

    item = {};
    item.title = 'Search';
    item.data = widSearchTab();
    tabs[tabs.length] = item;

    item = {};
    item.title = 'Send';
    item.data = widSendTab();
    tabs[tabs.length] = item;

    item = {};
    item.title = 'Receive';
    item.data = widReceiveTab();
    tabs[tabs.length] = item;

	var body = widBody(tabs);

	return body;
}
