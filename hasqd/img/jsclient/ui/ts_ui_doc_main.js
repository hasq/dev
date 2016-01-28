// Hasq Technology Pty Ltd (C) 2013-2016

var glClientTitle = 'Tokenswap JavaScript Client';
var glRequiredDbHash = 'smd';
var glPassword = '';

var glCurrentDB = {}; //'smd.db';
var glLastRec = {};
var glTimerId, glPingTimerId;


var picYlw = '<img src="img/ylw_pnt.gif">';
var picRed = '<img src="img/red_pnt.gif">';
var picGrnYlw = '<img src="img/grn_ylw_pnt.gif">';
var picGrn = '<img src="img/grn_pnt.gif">';
var picYlwGrn = '<img src="img/ylw_grn_pnt.gif">';
var picGry = '<img src="img/gry_pnt.gif">';
var picGryGrn = '<img src="img/gry_grn_pnt.gif">';
var picL12 = '<img src="img/loading12.gif">';

function newImage(arg) {
	if (document.images) {
		result = new Image();
		result.src = arg;
		return result;
	}
}

var preloadFlag = false;

function preloadImages() {
	frame = []; //new Array();
	arg = preloadImages.arguments;
	if (document.images) {
		for (i = 0; i < arg.length; i++) {
			frame[i] = newImage(arg[i]);
		}
		preloadFlag = true;
	}
}

function docMainWrite(){
	document.write(docMain());
}

function docMainInit(){
	$(document).ready(function(){
		docInit();
	});
}

function docInit(){
	$('#tabs').tabs();
	$('#hasqd_led').html(picGry);
	$('button').button();
	$('#tokens_data_pre').hide();
	$('#show_hide_input').click(function(){
		if ($('.password').attr('type') == 'password') {
			$('.password').attr('type', 'text');
		} else {
			$('.password').attr('type', 'password');
		}
	});
	
	widDisableUI(true);
	
	widSetDefaultDb(glRequiredDbHash);

	var ping = function(){ widPing(5000) }
	
	glPingTimerId = setTimeout(ping, 5000);

}

function docMain(){
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
