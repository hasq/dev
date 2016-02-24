// Hasq Technology Pty Ltd (C) 2013-2016

var glClientTitle = 'TOKENSWAP';
var glRequiredDbHash = 'smd';
var glPassword = '';

var glCurrentDB = {}; //'smd.db';
var glLastRec = {};
var glTimerId, glPingTimerId;

var picPwdOk = '<img src="img/pwd_ok.png">';
var picPwdWrong = '<img src="img/pwd_wrong.png">';
var picPwdRcvng = '<img src="img/pwd_rcvng.png">';
var picPwdSndng = '<img src="img/pwd_sndng.png">';

var picEyeOpen = '<img src="img/eye_open.png">';
var picEyeClosed = '<img src="img/eye_closed.png">';

var picLoading = '<img src="img/loading.gif">';
var picReload = '<img src="img/reload.png">';

var picLogoBlue = '<img width="28px" height="28px" src="img/logo_blue.png">';
var picLogoRed = '<img width="28px" height="28px" src="img/logo_red.png">';
var picLogoBlink = '<img width="28px" height="28px" src="img/logo_blink.gif">';

var picLoading = '<img src="img/loading.gif">';
var picReload = '<img src="img/reload.png">';

var picTokCreate = '<img width="70px" height="70px" src="img/tok_create.png">';
var picTokData = '<img width="70px" height="70px" src="img/tok_data.png">';
var picTokSearch = '<img width="70px" height="70px" src="img/tok_search.png">';
var picTokSend = '<img width="70px" height="70px" src="img/tok_send.png">';
var picTokReceive = '<img width="70px" height="70px" src="img/tok_receive.png">';

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

	$('#setdata_table').find('button, textarea').prop('disabled', true);
	
    $('#hasqd_logo').html(picLogoBlue);
	$('#pic_reload').html(picReload);
	$('#password_eye').html(picEyeOpen);
	$('#password_eye').attr('title', 'Unmask password');	
	
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
	
    var ping = function () {
        engSendPing(5000)
    }

    glPingTimerId = setTimeout(ping, 5000);
    window.onerror = engDoNothing();
}

function docMain() {
    var tabs = [];
    var item;


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
