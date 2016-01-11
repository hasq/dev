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

var picYellow = '<img src="images/yellowpoint.gif">';
var picRed = '<img src="images/redpoint.gif">';
var picGRed = '<img src="images/greenredpoint.gif">';
var picGreen = '<img src="images/greenpoint.gif">';
var picRGreen = '<img src="images/redgreenpoint.gif">';
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
					$('#hashcalc_smenu').get(0).selectedIndex = 0;

					break;
				case 'r16': //r16
					widHashcalcOninput();
					$('#hashcalc_smenu').get(0).selectedIndex = 1;
					break;
				case 's22': //s22
					widHashcalcOninput();
					$('#hashcalc_smenu').get(0).selectedIndex = 2;
					break;
				case 's25': //s25
					widHashcalcOninput();
					$('#hashcalc_smenu').get(0).selectedIndex = 3;
					break;
				case 'wrd': //wrd
					widHashcalcOninput();
					$('#hashcalc_smenu').get(0).selectedIndex = 4;
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
		icons: { button: 'ui-icon-triangle-1-s' },
		select: function (event, ui) {
			var db_table = widDatabaseTraitTable(glDataBase[this.selectedIndex]);
			var current_db = glDataBase[this.selectedIndex].name + '(' + glDataBase[this.selectedIndex].hash + ')';
			var pwdCheckBoxIsOn = document.getElementById('onepass_checkbox').checked + document.getElementById('threepass_checkbox').checked
				glCurrentDB = glDataBase[this.selectedIndex];

			$('#database_table').html(db_table);
			$('#current_db').html(current_db);
			widCleanLastRecordData();
			widRawDNOninput();
			if (pwdCheckBoxIsOn) {
				widGetNewRecordOninput();
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
			case 4: //wrd
				glHashCalcHash = 'wrd';
				widHashcalcOninput();
				break;
			default:
				break;
			}
		}
	});

	$('#tokens_history_selectmenu').selectmenu({
		select: function( event, data ) {
			var d = +data.item.value;
			switch(d){
			case 0:
				$('#tokens_history_div').hide();
				break;
			default:
				$('#tokens_history_div').show();
				widTokensHistorySMenu(d);
				break;
		  }
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
			widPrintTokensProgressbar(0);
			switch (ui.newTab.index()) {
			case 0: 
				widPrintTokensLastOperation('Create');
				break;
			case 1: 
				widPrintTokensLastOperation('Verify');
				break;
			case 2: 
				widPrintTokensLastOperation('Update');
				break;
			case 3:
				widPrintTokensLastOperation('Keys generation for Sender');
				break;
			case 4: 
				widPrintTokensLastOperation('Keys generation for Receiver');
				break;
			default:
				widPrintTokensLastOperation('&nbsp');
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
		icons: { "header": "ui-icon-plus", "activeHeader": "ui-icon-minus" },
		active : 'false',
		heightStyle : 'content',
		collapsible : 'false',
		header : 'h2',
	});
	
	//$( '#progressbar' ).progressbar({value: false});

	$('[data-class="hide"]').hide();
	
	$('#progressbar').html('<img src="images/greypoint.gif">');

	$('#server_host').html('' + location.host);

	setTimeout(widServerRefreshBtnClk, 2000);

	widAnimateProgbar();
}

function docMain() {
	var tabs = [];
	var item;

	item = {};
	item.title = 'Server';
	item.data = widServerTab();
	tabs[tabs.length] = item;

	item = {};
	item.title = 'Database';
	item.data = widDatabaseTab();
	tabs[tabs.length] = item;

	item = {};
	item.title = 'Records';
	item.data = widRecordsTab();
	tabs[tabs.length] = item;

	item = {};
	item.title = 'Hash calc';
	item.data = widHashcalcTab();
	tabs[tabs.length] = item;

	item = {};
	item.title = 'Command';
	item.data = widCommandTab();
	tabs[tabs.length] = item;

	item = {};
	item.title = 'Tokens';
	item.data = widTokensTab();
	tabs[tabs.length] = item;

	item = {};
	item.title = 'Help';
	item.data = widHelpTab();
	tabs[tabs.length] = item;

	var body = widGlobalTable(tabs);

	return body;
}
