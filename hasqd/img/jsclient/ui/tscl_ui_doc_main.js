// Hasq Technology Pty Ltd (C) 2013-2015

var glClientTitle = 'Tokenswap JavaScript Client';
var glDataBase = {};
var glCurrentDB = {}; //The object which contains selected database properties
var glHashCalcHash = ''; // Current calc hash-function
var glPassword = ''; // The specified password
var glS1Key = '';
var glS2Key = '';
var glS3Key = '';
var glS4Key = '';
var glCRL = {};
glCRL.items = [];			// The array of a commands.
glCRL.idx = 0;			// contains a number of current array element to perform
glCRL.counter = 100;		// countdown timer to repeat a failed operation
var glVTL = {};			// The object contains information about a last records of a specified range
glVTL.items = []			// The array which include the list of a last records of specified range.
glVTL.known  = false;		// The objects property which indicate about presence of a known Hasq-tokens in a range
glVTL.unknown  = false;	// The marker of mismatched tokens in the specified range

var picYellow = '<img src="images/yellowpoint.gif">';
var picRed = '<img src="images/redpoint.gif">';
var picGreen = '<img src="images/greenpoint.gif">';
var picGrey = '<img src="images/greypoint.gif">';
var picBlink = '<img src="images/blinkpoint.gif">';

function newImage(arg) {
	if (document.images) {
		result = new Image();
		result.src = arg;
		return result;
	}
}

preloadFlag = false;

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

function docMainWrite() {
	document.write(docMain());
}

function docMainInit() {
	$(document).ready(function () {
		doc_init();
	});
}

function doc_init() {
	$('#tabs').tabs({
		
	})
}

function docMain() {
    var r = '';
    var tabs = [];
    var item;

    item = {};
    item.title = 'Create token';
    item.data = widCreateTab();
    tabs[tabs.length] = item;

    item = {};
    item.title = 'Search';
    item.data = widSearchTab();
    tabs[tabs.length] = item;

    item = {};
    item.title = 'Send token';
    item.data = widSendTab();
    tabs[tabs.length] = item;

    item = {};
    item.title = 'Receive token';
    item.data = widReceiveTab();
    tabs[tabs.length] = item;

    item = {};
    item.title = 'Attach data';
    item.data = widDataTab();
    tabs[tabs.length] = item;

    r += '<table width="100%" border="0" style="border-collapse:collapse;">\n';
    r += '<tr>\n';
    r += '<td>\n' + widClientTitle(glClientTitle);
    r += '<td style="text-align:right;">&nbsp' + widClientLed('progress_led');
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

	var body = widTokenswapClient(tabs);

	return body;
}
