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
var glCL = {};
glCL.items = [];			// Commands list.
glCL.idx = 0;			// Contains number of current item of commands list
glCL.counter = 100;		// countdown timer to repeat a failed operation
var glVTL = {};			// The object contains information about a last records of specified range
glVTL.items = []			// The array which include the list of a last records of specified range.
glVTL.avail  = false;		// The objects property which indicate about presence of a known Hasq-tokens in range
glVTL.unavail  = false;	// The marker of mismatched tokens in the specified range

var imgOk = 'img/notification_ok.png';
var imgWarning = 'img/notification_warning.png';
var imgError = 'img/notification_error.png';
var imgLoading = 'img/loading.gif';

var imgPwdOk = 'img/pwd_ok.png';
var imgPwdWrong = 'img/pwd_wrong.png';
var imgPwdRcvng = 'img/pwd_rcvng.png';
var imgPwdSndng = 'img/pwd_sndng.png';
var imgNoDN = 'img/idx_nodn.png';
var imgNone = 'img/pwd_none.png';

var imgLogoBlue = 'img/logo_blue.png';
var imgLogoRed = 'img/logo_red.png';
var imgLogoBlink = 'img/logo_blink.gif';

var allImages = [imgOk,imgWarning,imgError,imgLoading,imgNone,imgPwdOk,imgPwdWrong,imgPwdRcvng,imgPwdSndng,
imgNoDN,imgLogoBlue,imgLogoRed,imgLogoBlink];
 

function docMainWrite() {
	document.write(docMain());
}

function docMainInit() {
	$(document).ready(function () {
		doc_init();
	});
}

function doc_init() {
	$('#main_tabs').tabs({
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
					//$('#hashcalc_select').get(0).selectedIndex = 0;
					$('#hashcalc_select').val(0);
					break;
				case 'r16': //r16
					widHashcalcOninput();
					$('#hashcalc_select').val(1);
					break;
				case 's22': //s22
					widHashcalcOninput();
					$('#hashcalc_select').val(2);
					break;
				case 's25': //s25
					widHashcalcOninput();
					$('#hashcalc_select').val(3);
					break;
				case 'smd': //s25
					widHashcalcOninput();
					$('#hashcalc_select').val(4);
					break;					
				case 'wrd': //wrd
					widHashcalcOninput();
					$('#hashcalc_select').val(5);
					break;
				default:
					break;
				}
				$('#hashcalc_select').selectmenu('refresh');
			}
			return true;
		}
	});

	$('#main_tabs').tabs().tabs('option', 'active', 2);

	$('#database_select').selectmenu({
		select: function (event, ui) {
			var db_table = widGetHTMLDatabaseTraitTable(glDataBase[this.selectedIndex]);
			var current_db = glDataBase[this.selectedIndex].name + '(' + glDataBase[this.selectedIndex].hash + ')';
			var pwdCheckBoxIsOn = document.getElementById('one_pwd_checkbox').checked + document.getElementById('three_pwd_checkbox').checked
				glCurrentDB = glDataBase[this.selectedIndex];

			$('#database_table').html(db_table);
			$('#current_db').html(current_db);
			widShowLastRecord();
			widTokenNameOninput();
			if (pwdCheckBoxIsOn) {
				widShowNewRecOninput();
			}
			return true;
		}
	});

	$('#hashcalc_select').selectmenu({
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

	$('#tokens_add_range_accordion').accordion({
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

	$('.warning-td').hide();
	$('.continue-button').hide();
	$('.verify-table').hide();
	
	$('#logo_span').find('img').attr('width', '28');
	$('#logo_span').find('img').attr('height', '28');
	$('#logo_span').find('img').attr('src', imgLogoBlue);

	$('#server_host').html('' + location.host);
	$('#tokens_verify_pre').hide();
	setTimeout(widRefreshButtonClick, 2000);
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
