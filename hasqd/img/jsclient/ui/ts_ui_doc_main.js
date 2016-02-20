// Hasq Technology Pty Ltd (C) 2013-2016

var glClientTitle = '&nbspTokenswap Client';
var glRequiredDbHash = 'smd';
var glPassword = '';

var glCurrentDB = {}; //'smd.db';
var glLastRec = {};
var glTimerId, glPingTimerId;

var picYellow = '<img src="img/point_yellow.gif">';
var picRed = '<img src="img/point_red.gif">';
var picGreenYellow = '<img src="img/point_green_yellow.gif">';
var picGreen = '<img src="img/point_green.gif">';
var picYellowGreen = '<img src="img/point_yellow_green.gif">';
var picGray = '<img src="img/point_gray.gif">';
var picGreenGray = '<img src="img/point_green_gray.gif">';
var picPwdShown = '<img src="img/pwd_shown.png">';
var picPwdHidden = '<img src="img/pwd_hidden.png">';
var picLoading = '<img src="img/loading.gif">';
var picReload = '<img src="img/reload.gif">';

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
        }
    });
	
    $('#hasqd_led').html(picGray);
	$('#pic_reload').html(picReload);
	$('#password_eye').html(picPwdShown);
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
    item.title = 'Create token';
    item.data = widGetHTMLCreateTab();
    tabs[tabs.length] = item;

	item = {};
    item.title = 'Give data';
    item.data = widGetHTMLSetDataTab();
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
