// Hasq Technology Pty Ltd (C) 2013-2016

var glClientTitle = '&nbspTokenswap Client';
var glRequiredDbHash = 'smd';
var glPassword = '';

var glCurrentDB = {}; //'smd.db';
var glLastRec = {};
var glTimerId, glPingTimerId;

var picYlw = '<img src="img/ylw_pnt.gif">';
var picRed = '<img src="img/red_pnt.gif">';
var picGrnYlw = '<img src="img/grn_ylw_pnt.gif">';
var picGrn = '<img src="img/grn_pnt.gif">';
var picYlwGrn = '<img src="img/ylw_grn_pnt.gif">';
var picGry = '<img src="img/gry_pnt.gif">';
var picGryGrn = '<img src="img/gry_grn_pnt.gif">';
var picL12 = '<img src="img/loading12.gif">';

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
    $('#hasqd_led').html(picGry);
    $('button').button();
    $('#tokens_data_pre').hide();
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
    window.onerror = engDoNothing();
    var ping = function () {
        engSendPing(5000)
    }

    glPingTimerId = setTimeout(ping, 5000);

}

function docMain() {
    var tabs = [];
    var item;

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
    item.title = 'Give data';
    item.data = widGetHTMLSetDataTab();
    tabs[tabs.length] = item;
	
	item = {};
    item.title = 'Search';
    item.data = widGetHTMLSearchTab();
    tabs[tabs.length] = item;
	
    var body = widGetHTMLBody(tabs);

    return body;
}
