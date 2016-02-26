// Hasq Technology Pty Ltd (C) 2013-2016

var glClientTitle = 'TOKENSWAP';
var glRequiredDbHash = 'smd';
var glPassword = '';

var glCurrentDB = {}; //'smd.db';
var glLastRec = {};
var glTimerId, glPingTimerId;

var imgSrcPwdOk = 'img/pwd_ok.png';
var imgSrcPwdWrong = 'img/pwd_wrong.png';
var imgSrcPwdRcvng = 'img/pwd_rcvng.png';
var imgSrcPwdSndng = 'img/pwd_sndng.png';
var imgSrcPwdNone = 'img/pwd_none.png';

var imgSrcLoading = 'img/loading.gif';
var imgSrcReload = 'img/reload.png';

var imgSrcEyeOpen = 'img/eye_open.png';
var imgSrcEyeClosed = 'img/eye_closed.png';

var imgSrcLogoBlue = 'img/logo_blue.png';
var imgSrcLogoRed = 'img/logo_red.png';
var imgSrcLogoBlink = 'img/logo_blink.gif';

var imgTokCreate = '<img width="70px" height="70px" src="img/tok_create.png">';
var imgTokData = '<img width="70px" height="70px" src="img/tok_data.png">';
var imgTokSearch = '<img width="70px" height="70px" src="img/tok_search.png">';
var imgTokSend = '<img width="70px" height="70px" src="img/tok_send.png">';
var imgTokReceive = '<img width="70px" height="70px" src="img/tok_receive.png">';

var allImages = [imgSrcPwdOk,imgSrcPwdWrong,imgSrcPwdRcvng,imgSrcPwdSndng,imgSrcPwdNone,imgSrcLoading,
imgSrcReload,imgSrcEyeOpen,imgSrcEyeClosed,imgSrcLogoBlue,imgSrcLogoRed,imgSrcLogoBlink];
 
function newImage(arg) {
    if (document.images) {
        var result = new Image();
		//console.log(result);
        result.src = arg;
        return result;
    }
}

var preloadFlag = false;

function preloadImages(img) {
    var frame = [];
    //var arg = preloadImages.arguments;

    if (document.images) {
        for (i = 0; i < img.length; i++) { //for (i = 0; i < arg.length; i++) {
            frame[i] = newImage(img[i]); //frame[i] = newImage(arg[i]);
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
	
	$('#reload_span').find('img').attr('src', imgSrcReload);
	$('#token_pic_span').find('img').attr('src', imgSrcLoading);
	$('#token_pic_span').hide();
	$('#password_pic_span').find('img').attr('src', imgSrcPwdNone);
	$('#logo_span').find('img').attr('width', '28');
	$('#logo_span').find('img').attr('height', '28');
	$('#logo_span').find('img').attr('src', imgSrcLogoBlue);
	$('#password_eye_span').find('img').attr('src', imgSrcEyeOpen);
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
