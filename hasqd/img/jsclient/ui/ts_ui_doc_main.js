// Hasq Technology Pty Ltd (C) 2013-2016

var glClientTitle = 'TOKENSWAP';
var glRequiredDbHash = 'smd';
var glPassword = '';

var glCurrentDB = {}; //'smd.db';
var glLastRec = {};
var glTimerId, glPingTimerId;

var imgNone = 'img/pwd_none.png';
var imgLoading = 'img/loading.gif';
var imgReload = 'img/reload.png';
var imgEyeOpen = 'img/eye_open.png';
var imgEyeClosed = 'img/eye_closed.png';

var imgLogoBlue = 'img/logo_blue.png';
var imgLogoRed = 'img/logo_red.png';
var imgLogoBlink = 'img/logo_blink.gif';

var imgPwdOk = 'img/pwd_ok.png';
var imgPwdWrong = 'img/pwd_wrong.png';
var imgPwdRcvng = 'img/pwd_rcvng.png';
var imgPwdSndng = 'img/pwd_sndng.png';

var imgTokCreate = '<img width="70px" height="70px" src="img/tok_create.png">';
var imgTokData = '<img width="70px" height="70px" src="img/tok_data.png">';
var imgTokSearch = '<img width="70px" height="70px" src="img/tok_search.png">';
var imgTokSend = '<img width="70px" height="70px" src="img/tok_send.png">';
var imgTokReceive = '<img width="70px" height="70px" src="img/tok_receive.png">';

var allImages = [imgPwdOk,imgPwdWrong,imgPwdRcvng,imgPwdSndng,imgNone,imgLoading,
imgReload,imgEyeOpen,imgEyeClosed,imgLogoBlue,imgLogoRed,imgLogoBlink];
 
function docMainWrite() {
    document.write(docMain());
}

function docMainInit() {
    $(document).ready(function () {
        docInit();
    });
}

function docInit() {
    $('#tabs_div').tabs({
        activate : function (event, ui) {
            widShowLog();
        },
	
    });

	$('#setdata_table').find('button').prop('disabled', true);
	
	$('#reload_span').find('img').attr('src', imgReload);
	$('#token_pic_span').find('img').attr('src', imgLoading);
	$('#token_pic_span').hide();
	$('#password_pic_span').find('img').attr('src', imgNone);
	$('#logo_span').find('img').attr('width', '28');
	$('#logo_span').find('img').attr('height', '28');
	$('#logo_span').find('img').attr('src', imgLogoBlue);
	$('#password_eye_span').find('img').attr('src', imgEyeOpen);
	$('#password_eye_span').find('img').attr('title', 'Unmask password');	
	
    $('button').button();
    $('#token_data_td').hide();
	$('#send_blocking_textarea').hide();
    $('#send_type_checkbox').click(function () {
		var jqObj0 = $('#send_simple_textarea');
		var jqObj1 = $('#send_blocking_textarea');
        if (this.checked) {
            jqObj1.show();
        } else {
            jqObj1.hide();
        }
		jqObj0.val('');
		jqObj1.val('');		
    });	
    $('#show_hide_checkbox').click(function () {
        if (this.checked) {
            $('.password').attr('type', 'text');
        } else {
            $('.password').attr('type', 'password');
        }
    });
    $('#from_datepicker_input').datepicker({
        dateFormat : 'yy/mm/dd',
        minDate : new Date(2016, 0, 1),
        maxDate : new Date(),
        showMonthAfterYear : true,
        showOtherMonths : true,
        selectOtherMonths : true,
        changeMonth : true,
        changeYear : true,
        onClose : function (selectedDate) {
            $('#to_datepicker_input').datepicker('option', 'minDate', selectedDate);
        }
    });
    $('#to_datepicker_input').datepicker({
        dateFormat : 'yy/mm/dd',
        minDate : new Date(2016, 0, 1),
        maxDate : new Date(),
        showMonthAfterYear : true,
        showOtherMonths : true,
        selectOtherMonths : true,
        changeMonth : true,
        changeYear : true,
        onClose : function (selectedDate) {
            $('#from_datepicker_input').datepicker('option', 'maxDate', selectedDate);
        }
    });

    widSetDefaultDb(glRequiredDbHash);
	widShowEmptyArea();
	
    var ping = function () {
        widSendPing(5000)
    }

    glPingTimerId = setTimeout(ping, 5000);
    window.onerror = engDoNothing();
}

function docMain() {
    var tabs = [];
    var item;


	item = {};
    item.title = 'Empty';
    item.data = widGetHTMLEmptyTab();
    tabs[tabs.length] = item;
	
	item = {};
    item.title = 'Give data';
    item.data = widGetHTMLSetDataTab();
    tabs[tabs.length] = item;
	
    item = {};
    item.title = 'Create token';
    item.data = widGetHTMLCreateTab();
    tabs[tabs.length] = item;
	
    item = {};
    item.title = 'Give away';
    item.data = widGetHTMLSendTab();
    tabs[tabs.length] = item;

    item = {};
    item.title = 'Receive';
    item.data = widGetHTMLReceiveTab();
    tabs[tabs.length] = item;
	
	item = {};
    item.title = 'Search';
    item.data = widGetHTMLSearchTab();
    tabs[tabs.length] = item;
	
    var body = widGetHTMLBody(tabs);

    return body;
}
