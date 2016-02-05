// Hasq Technology Pty Ltd (C) 2013-2015

var glClientTitle = '&nbspHasq JavaScript Client';
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

var picYlw = '<img src="img/ylw_pnt.gif">';
var picRed = '<img src="img/red_pnt.gif">';
var picGrnYlw = '<img src="img/grn_ylw_pnt.gif">';
var picGrn = '<img src="img/grn_pnt.gif">';
var picYlwGrn = '<img src="img/ylw_grn_pnt.gif">';
var picGry = '<img src="img/gry_pnt.gif">';
var picGryGrn = '<img src="img/gry_grn_pnt.gif">';

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
		activate : function (event, ui) {
			if (ui.newTab.index() == 3) {
				if (glCurrentDB.hash != undefined && glCurrentDB.hash != '') {
					glHashCalcHash = glCurrentDB.hash;
				} else {
					glHashCalcHash = 'md5';
				}

				switch (glHashCalcHash) {
				case 'md5': //md5
					widHashcalcOninput();
					//$('#hashcalc_smenu').get(0).selectedIndex = 0;
					$('#hashcalc_smenu').val(0);
					break;
				case 'r16': //r16
					widHashcalcOninput();
					$('#hashcalc_smenu').val(1);
					break;
				case 's22': //s22
					widHashcalcOninput();
					$('#hashcalc_smenu').val(2);
					break;
				case 's25': //s25
					widHashcalcOninput();
					$('#hashcalc_smenu').val(3);
					break;
				case 'smd': //s25
					widHashcalcOninput();
					$('#hashcalc_smenu').val(4);
					break;					
				case 'wrd': //wrd
					widHashcalcOninput();
					$('#hashcalc_smenu').val(5);
					break;
				default:
					break;
				}
				$('#hashcalc_smenu').selectmenu('refresh');
			}
			return true;
		}
	});

	$('#tabs').tabs().tabs('option', 'active', 2);

	$('#database_smenu').selectmenu({
		select: function (event, ui) {
			var db_table = widGetHTMLDatabaseTraitTable(glDataBase[this.selectedIndex]);
			var current_db = glDataBase[this.selectedIndex].name + '(' + glDataBase[this.selectedIndex].hash + ')';
			var pwdCheckBoxIsOn = document.getElementById('onepass_checkbox').checked + document.getElementById('threepass_checkbox').checked
				glCurrentDB = glDataBase[this.selectedIndex];

			$('#database_table').html(db_table);
			$('#current_db').html(current_db);
			widShowLastRecord();
			widRawDNOninput();
			if (pwdCheckBoxIsOn) {
				widShowNewRecordOninput();
			}
			return true;
		}
	});

	$('#hashcalc_smenu').selectmenu({
		select : function (event, ui) {
			switch (this.selectedIndex) {
			case 0: //md5
				glHashCalcHash = 'md5';
				widHashcalcOninput();
				break;
			case 1: //r16
				glHashCalcHash = 'r16';
				widHashcalcOninput();
				break;
			case 2: //s22
				glHashCalcHash = 's22';
				widHashcalcOninput();
				break;
			case 3: //s25
				glHashCalcHash = 's25';
				widHashcalcOninput();
				break;
			case 4: //smd
				glHashCalcHash = 'smd';
				widHashcalcOninput();
				break;
			case 5: //wrd
				glHashCalcHash = 'wrd';
				widHashcalcOninput();
				break;
			default:
				break;
			}
		}
	});

	$('#tokens_history_select').selectmenu({
		disabled: true,
		width: '60px',
		select: function(event, data) {
			var d = +this.options[this.selectedIndex].text;
			widTokensHistorySelect(d);
		}
	});	
	
	$('button').button();

	var cmdinputHints = [
		'ping',
		'info db',
		'info sys',
		'info id'
	];

	$('#cmd_input').autocomplete({
		source : cmdinputHints
	});
	
	var progressbar = $('#tokens_progressbar');
	var progressbarLabel = $('.tokens-progressbar-label');
	
	progressbar.progressbar({
		value : 0,
		change: function (event, ui){
					var val = progressbar.progressbar('value');
					if (val > 0) {
						progressbarLabel.text(val + '%');
					} else {
						progressbarLabel.text('');
						progressbar.progressbar('value', 0);
					}
				},
		complete: function (event, ui) {
					progressbarLabel.text('Complete!');
				}
	});
	
	$('#tokens_tabs').tabs({
		activate : function (event, ui) {
			widShowProgressbar(0);
			switch (ui.newTab.index()) {
			case 0: 
				widShowTokensLog('Create');
				break;
			case 1: 
				widShowTokensLog('Verify');
				break;
			case 2: 
				widShowTokensLog('Update');
				break;
			case 3:
				widShowTokensLog('Keys generation for Sender');
				break;
			case 4: 
				widShowTokensLog('Keys generation for Receiver');
				break;
			default:
				widShowTokensLog('&nbsp');
				break;
			}
		}
	})

	$('#tokens_tabs').tabs().tabs('option', 'active', 0);

	$('#tokens_range_gen_accordion').accordion({
		icons: { "header": "ui-icon-plus", "activeHeader": "ui-icon-minus" },
		active : 'false',
		heightStyle : 'content',
		collapsible : 'true',
		header : 'h3',
	});

	$('#tokens_send_accordion').accordion({
		icons: { "header": "ui-icon-plus", "activeHeader": "ui-icon-minus" },
		active : 0,
		heightStyle : 'content',
		collapsible : 'true',
		header : 'h3',
	});

	$('#tokens_receive_accordion').accordion({
		icons: { "header": "ui-icon-plus", "activeHeader": "ui-icon-minus" },
		active : 0,
		heightStyle : 'content',
		collapsible : 'true',
		header : 'h3',
	});

	$('#main_help_accordion').accordion({
		icons: { "header": "ui-icon-plus", "activeHeader": "ui-icon-minus" },
		active : 'false',
		heightStyle : 'content',
		collapsible : 'true',
		header : 'h3',
	});
	
	$('#tokens_tab_help_accordion').accordion({
		icons: { 'header': 'ui-icon-plus', 'activeHeader': 'ui-icon-minus' },
		active : 'false',
		heightStyle : 'content',
		collapsible : 'false',
		header : 'h2',
	});
	
	//$( '#progressbar' ).progressbar({value: false});

	$('[data-class="hide"]').hide();

	$('#show_hide_input').click(function(){
		if ($('.password').attr('type') == 'password') {
			$('.password').attr('type', 'text');
		} else {
			$('.password').attr('type', 'password');
		}
	});
	
	$('#hasqd_led').html(picGry);

	$('#server_host').html('' + location.host);

	setTimeout(widServerRefreshButtonClick, 2000);

	widAnimateProgbar();
}

function docMain() {
	var tabs = [];
	var item;

	item = {};
	item.title = 'Server';
	item.data = widGetHTMLServerTab();
	tabs[tabs.length] = item;

	item = {};
	item.title = 'Database';
	item.data = widGetHTMLDatabaseTab();
	tabs[tabs.length] = item;

	item = {};
	item.title = 'Records';
	item.data = widGetHTMLRecordsTab();
	tabs[tabs.length] = item;

	item = {};
	item.title = 'Hash calc';
	item.data = widGetHTMLHashcalcTab();
	tabs[tabs.length] = item;

	item = {};
	item.title = 'Command';
	item.data = widGetHTMLCommandTab();
	tabs[tabs.length] = item;

	item = {};
	item.title = 'Tokens';
	item.data = widGetHTMLTokensTab();
	tabs[tabs.length] = item;

	item = {};
	item.title = 'Help';
	item.data = widHelpTab();
	tabs[tabs.length] = item;

	var body = widGetHTMLBody(tabs);

	return body;
}
