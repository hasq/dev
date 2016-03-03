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
/*
var glCL = {};
glCL.items = [];			// Commands list.
glCL.idx = 0;			// Contains number of current item of commands list
glCL.counter = 100;		// countdown timer to repeat a failed operation
*/
var glCmdList = {
	items: [],
	idx: 0,
	counter: 100,
	clear: function () {
		this.items.length = 0;
		this.idx = 0;
		this.counter = 100;
	}
}
var glTokList = {
	fit: false,
	unfit: false,
	items: [],
	add: function (item) {
		this.items[this.items.length] = item;
		if (item.fit) this.fit = true;
		if (item.unfit) this.unfit = true;
	},
	clear: function () {
		this.items = [];
		this.fit = false;
		this.unfit = false;
	},
	state: function () {
		if (this.fit === true && this.unfit === false) { //contains only known tokens;
			return true; 
		} 
		if (this.fit === false && this.unfit === true) { //contains only unknown tokens
			return false;
		}
		if (this.fit === true && this.unfit === true) { //contains different tokens
			return undefined; 
		}	
		return null; //not contains any tokens		
	}
}

var imgMsgOk = 'img/msg_ok.png';
var imgMsgWarning = 'img/msg_warning.png';
var imgMsgError = 'img/msg_error.png';
var imgMsgLoading = 'img/msg_loading.gif';
var imgMsgBlink = 'img/msg_blink.gif';

var imgTknOk = 'img/tkn_ok.png';
var imgTknWrong = 'img/tkn_wrongpwd.png';
var imgTknRcvng = 'img/tkn_rcvng.png';
var imgTknSndng = 'img/tkn_sndng.png';
var imgTknNodn = 'img/tkn_nodn.png';
var imgPwdDummy = 'img/pwd_dummy.png';

var imgLogoBlue = 'img/logo_blue.png';
var imgLogoRed = 'img/logo_red.png';
var imgLogoBlink = 'img/logo_blink.gif';

var allImages = [
imgMsgOk,imgMsgWarning,imgMsgError,imgMsgLoading,imgMsgBlink,
imgPwdDummy,imgTknOk,imgTknWrong,imgTknRcvng,imgTknSndng,imgTknNodn,
imgLogoBlue,imgLogoRed,imgLogoBlink
];

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
			var pwdCheckBoxIsOn = document.getElementById('one_tkn_checkbox').checked + document.getElementById('three_tkn_checkbox').checked
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
