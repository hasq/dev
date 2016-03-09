// Hasq Technology Pty Ltd (C) 2013-2016

var glClientTitle = 'TokenSwap';
var glRequiredDbHash = 'smd';
var glPassword = '';

var glCurrentDB = {}; //'smd.db';
var glLastRec = {};
var glTimerId, glPingTimerId;

var imgPwdDummy = 'img/pwd_dummy.png';
var imgMsgLoading = 'img/msg_loading.gif';
var imgEyeOpen = 'img/eye_open.png';
var imgEyeClosed = 'img/eye_closed.png';
var imgLogoBlue = 'img/logo_blue.png';
var imgLogoRed = 'img/logo_red.png';
var imgLogoBlink = 'img/logo_blink.gif';
var imgTknOk = 'img/tkn_ok.png';
var imgTknWrong = 'img/tkn_wrongpwd.png';
var imgTknRcvng = 'img/tkn_rcvng.png';
var imgTknSndng = 'img/tkn_sndng.png';
var imgClkReload = 'img/clk_reload.png';
var imgBtnCreate = '<img width="40px" height="40px" src="img/btn_create.png"><br/>Create';
var imgBtnData = '<img width="40px" height="40px" src="img/btn_assign_data.png"><br/>Assign';
var imgBtnShowKeys = '<img width="40px" height="40px" src="img/btn_show_keys.png"><br/>Give away';
var imgBtnReceiveKeys = '<img width="40px" height="40px" src="img/btn_receive_keys.png"><br/>Receive';
var imgBtnSearch = '<img width="40px" height="40px" src="img/btn_search.png"><br/>View';
var imgTabShowKeys = '<img width="40px" height="40px" src="img/tab_send.png"><br/>Give away';
var imgTabReceiveKeys = '<img width="40px" height="40px" src="img/tab_receive.png"><br/>Receive';
var imgTabSearchTokens = '<img width="40px" height="40px" src="img/tab_view.png"><br/>View';

var allImages = [
    imgTknOk, imgTknWrong, imgTknRcvng, imgTknSndng, imgPwdDummy,
    imgMsgLoading, imgClkReload, imgEyeOpen, imgEyeClosed,
    imgLogoBlue, imgLogoRed, imgLogoBlink
];

var hasqLogo = HasqLogo('logo_span');
var preloadImg = new Array();

function docMainWrite() {
    document.write(docMain());
}

function docMainInit() {
    $(document).ready(function () {
        docInit();
    });
}

function docInit() 
{
	$('#modal_window_div').css('display', 'none');
	$('input, select, textarea').attr('autocomplete', 'off');
	
    $('#tabs_div').tabs(
	{
        activate : function (event, ui) 
		{
            widShowLog();
        },
    });

    $('#reload_span').find('img').attr('src', imgClkReload);
    $('#token_pic_span').find('img').attr('src', imgMsgLoading);
    $('#token_pic_span').hide();
    $('#password_pic_span').find('img').attr('src', imgPwdDummy);
    $('#logo_span').find('img').attr('width', '28');
    $('#logo_span').find('img').attr('height', '28');
    $('#logo_span').find('img').attr('src', imgLogoBlue);
    $('#password_eye_span').find('img').attr('src', imgEyeOpen);
    $('#password_eye_span').find('img').attr('title', 'Unmask password');

    $('button').button();

    $('#token_data_td').hide();
    $('#send_blocking_textarea').hide();
    $('#send_type_checkbox').click(function () 
	{
        var jqObj0 = $('#send_simple_textarea');
        var jqObj1 = $('#send_blocking_textarea');

        if (this.checked) 
		{
            jqObj1.show();
        } 
		else
		{
            jqObj1.hide();
        }

        jqObj0.val('');
        jqObj1.val('');
    });
	
    $('#show_hide_checkbox').click(function () 
	{
        if (this.checked) 
		{
            $('.password').attr('type', 'text');
        } 
		else
		{
            $('.password').attr('type', 'password');
        }
    });
	
    $('#from_datepicker_input').datepicker(
	{
        dateFormat : 'yy/mm/dd',
        minDate : new Date(2016, 0, 1),
        maxDate : new Date(),
        showMonthAfterYear : true,
        showOtherMonths : true,
        selectOtherMonths : true,
        changeMonth : true,
        changeYear : true,
        onClose : function (selectedDate) 
		{
            $('#to_datepicker_input').datepicker('option', 'minDate', selectedDate);
        }
    });
	
    $('#to_datepicker_input').datepicker(
	{
        dateFormat : 'yy/mm/dd',
        minDate : new Date(2016, 0, 1),
        maxDate : new Date(),
        showMonthAfterYear : true,
        showOtherMonths : true,
        selectOtherMonths : true,
        changeMonth : true,
        changeYear : true,
        onClose : function (selectedDate) 
		{
            $('#from_datepicker_input').datepicker('option', 'maxDate', selectedDate);
        }
    });

    widSetDefaultDb(glRequiredDbHash);
    widEmptyTab();

    var ping = function() 
	{
        widSendPing(5000)
    }

    glPingTimerId = setTimeout(ping, 5000);
    window.onerror = engDoNothing();
}

function docMain() 
{
    var tabs = [];
    var item;

    item = {};
    item.title = 'Empty';
    item.data = widGetHTMLEmptyTab();
    tabs[tabs.length] = item;

    item = {};
    item.title = 'Create token';
    item.data = widGetHTMLCreateTab();
    tabs[tabs.length] = item;

	item = {};
    item.title = 'Assign data';
    item.data = widGetHTMLSetDataTab();
    tabs[tabs.length] = item;
	
    item = {};
    item.title = 'Give token away';
    item.data = widGetHTMLSendTab();
    tabs[tabs.length] = item;

    item = {};
    item.title = 'Receive token';
    item.data = widGetHTMLReceiveTab();
    tabs[tabs.length] = item;

    item = {};
    item.title = 'View my tokens';
    item.data = widGetHTMLSearchTab();
    tabs[tabs.length] = item;

    var body = widGetHTMLBody(tabs);

    return body;
}
