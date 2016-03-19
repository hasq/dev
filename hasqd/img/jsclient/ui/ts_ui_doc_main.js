// Hasq Technology Pty Ltd (C) 2013-2016

var glClientTitle = 'TokenSwap';
var glRequiredDbHash = 'smd';
var glPassword = '';

var glCurrentDB = {}; //'smd.db';
var glLastRec = {};
var glTimerId;
var glSearch = { isOn : false, o : {}, result : {} };


var imgMsgWait = 'img/msg_wait.gif';

var imgLockOpen = 'img/lock_open.png';
var imgLockClosed = 'img/lock_closed.png';

var imgEyeOpen = 'img/eye_open.png';
var imgEyeClosed = 'img/eye_closed.png';

var imgLogoBlue = 'img/logo_blue.png';
var imgLogoRed = 'img/logo_red.png';
var imgLogoBlink = 'img/logo_blink.gif';

var imgPwdDummy = 'img/pwd_dummy.png';
var imgPwdOk = 'img/pwd_ok.png';
var imgPwdWrong = 'img/pwd_wrong.png';
var imgPwdRcvng = 'img/pwd_rcvng.png';
var imgPwdSndng = 'img/pwd_sndng.png';

var imgClkReload = 'img/clk_reload.png';
var imgClkInfo = 'img/clk_info.png';

var imgBtnCreate = '<img width="40px" height="40px" src="img/btn_create.png"><br/>Create';
var imgBtnData = '<img width="40px" height="40px" src="img/btn_assign_data.png"><br/>Set';
var imgBtnInstantKeys = '<img width="40px" height="40px" src="img/btn_show_keys.png"><br/>Instant';
var imgBtnOnHoldKeys = '<img width="40px" height="40px" src="img/btn_show_keys.png"><br/>On Hold';
var imgBtnReleaseKeys = '<img width="40px" height="40px" src="img/btn_show_keys.png"><br/>Release';
var imgBtnReceiveKeys = '<img width="40px" height="40px" src="img/btn_receive_keys.png"><br/>Accept';
var imgBtnSearch = '<img width="40px" height="40px" src="img/btn_search.png"><br/>Start';
var imgBtnStop  = '<img width="40px" height="40px" src="img/btn_stop.png"><br/>Stop';
var imgTabShowKeys = '<img width="40px" height="40px" src="img/tab_send.png"><br/>Give away';
var imgTabReceiveKeys = '<img width="40px" height="40px" src="img/tab_receive.png"><br/>Receive';
var imgTabSearchTokens = '<img width="40px" height="40px" src="img/tab_view.png"><br/>View';

var allImages = [
    imgPwdOk, imgPwdWrong, imgPwdRcvng, imgPwdSndng, imgPwdDummy,
    imgMsgWait, imgClkReload, imgEyeOpen, imgEyeClosed,
    imgLockOpen, imgLockClosed, imgLogoBlue, imgLogoRed, imgLogoBlink
];
var preloadImg = new Array();
var hasqLogo = HasqLogo('logo_span');

function docMainWrite()
{
    document.write(docMain());
}

function docMainInit()
{
    $(document).ready(function ()
    {
        docInit();
    }
    );
}

function docInit()
{
    $('#modal_window').css('display', 'none');
    $('input, select, textarea').attr('autocomplete', 'off');
	$('input, textarea').attr('maxlength', '65536');
	
    $('#tabs').tabs();

    $('#info_span img').attr('src', imgClkInfo);
    $('#info_span img').attr('width', '28');
    $('#info_span img').attr('height', '28');

    $('#logo_span img').attr('width', '28');
    $('#logo_span img').attr('height', '28');
    $('#logo_span img').attr('src', imgLogoBlue);

    $('#reload_span img').attr('src', imgClkReload);
    $('#password_pic_span img').attr('src', imgPwdDummy);
    $('#token_pic_span img').hide();

    $('#password_eye_span img').attr('src', imgEyeOpen);
    $('#password_eye_span img').attr('title', 'Unmask password');

    $('button').button();

    $('#token_data_td').hide();

    $('#show_hide_checkbox').click(function ()
    {
        if (this.checked)
            $('.password').attr('type', 'text');
        else
            $('.password').attr('type', 'password');
    }
    );

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
    }
    );

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
    }
    );

    widSetDefaultDb(glRequiredDbHash);
    widEmptyTab();

    engSendPing(0);
}

function docMain()
{
    var tabs = [];
    var item;

    item = {};
    item.title = 'Welcome';
    item.data = widGetHTMLWelcomeTab();
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
    item.data = widGetHTMLShowKeysTab();
    tabs[tabs.length] = item;

    item = {};
    item.title = 'Receive token';
    item.data = widGetHTMLReceiveTab();
    tabs[tabs.length] = item;

    item = {};
    item.title = 'View my tokens';
    item.data = widGetHTMLSearchTab();
    tabs[tabs.length] = item;

    item = {};
    item.title = 'Empty';
    item.data = widGetHTMLEmptyTab();
    tabs[tabs.length] = item;

    var body = widGetHTMLBody(tabs);

    return body;
}
