// Hasq Technology Pty Ltd (C) 2013-2016

var glClientTitle = 'Tokenswap JavaScript Client';

var picYlw = '<img src="img/ylw_pnt.gif">';
var picRed = '<img src="img/red_pnt.gif">';
var picGrnYlw = '<img src="img/grn_ylw_pnt.gif">';
var picGrn = '<img src="img/grn_pnt.gif">';
var picYlwGrn = '<img src="img/ylw_grn_pnt.gif">';
var picGry = '<img src="img/gry_pnt.gif">';
var picGryGrn = '<img src="img/gry_grn_pnt.gif">';

function docMainWrite() {
	document.write(docMain());
}

function docMainInit() {
	$(document).ready(function () {
		docInit();
	});
}

function docInit() {
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
