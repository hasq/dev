// Hasq Technology Pty Ltd (C) 2013-2016

var glClientTitle = 'TokenSwap';
var glRequiredDbHash = 'smd';
var glPassword = '';

var glCurrentDB = {}; //'smd.db';
var glLastRec = {};
var glTimerId;
var glSearch =
{
    isOn : false,
    o : {},
    result : []
};

var imgMsgWait = 'img/msg_wait.gif';

var imgLockOpen = 'img/lock_open.png';
var imgLockClosed = 'img/lock_closed.png';

var imgEyeOpen = 'img/eye_open.png';
var imgEyeClosed = 'img/eye_closed.png';

var imgLogoBlue = 'img/logo_blue.png';
var imgLogoRed = 'img/logo_red.png';
var imgLogoBlink = 'img/logo_blink.gif';

var imgPwdDummy = 'img/pwd_dummy.png';
var imgPwdOk = 'img/pwd_good.png';
var imgPwdWrong = 'img/pwd_wrong.png';
var imgPwdRcvng = 'img/pwd_rcvng.png';
var imgPwdSndng = 'img/pwd_sndng.png';

var imgClkReload = 'img/clk_reload.png';
var imgClkInfo = 'img/clk_info.png';

var imgBtnCreate = '<img width="40px" height="40px" src="img/btn_create.png"><br/>Create';
var imgBtnData = '<img width="40px" height="40px" src="img/btn_setdata.png"><br/>Set';
var imgBtnInstantKeys = '<img width="40px" height="40px" src="img/btn_show_keys1.png"><br/>Instant';
var imgBtnOnHoldKeys = '<img width="40px" height="40px" src="img/btn_show_keys2.png"><br/>On Hold';
var imgBtnReleaseKeys = '<img width="40px" height="40px" src="img/btn_show_keys3.png"><br/>Release';
var imgBtnReceiveKeys = '<img width="40px" height="40px" src="img/btn_accept.png"><br/>Accept';
var imgBtnStop = '<img width="40px" height="40px" src="img/btn_search.png"><br/>Start';
var imgBtnSearch = '<img width="40px" height="40px" src="img/btn_stop.gif"><br/>Stop';
var imgTabShowKeys = '<img width="40px" height="40px" src="img/tab_send.png"><br/>Give';
var imgTabReceiveKeys = '<img width="40px" height="40px" src="img/tab_receive.png"><br/>Receive';
var imgTabSearchTokens = '<img width="40px" height="40px" src="img/tab_view.png"><br/>Lookup';

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
    $('input, textarea').val('').attr('maxlength', '65536');;
    $('input, select, textarea').attr('autocomplete', 'off');

    $('#tabs_div').tabs();
    $('#search_inner_tabs_div').tabs();


    $('#info_span img').attr('src', imgClkInfo).attr('width', '28').attr('height', '28');
    $('#logo_span img').attr('width', '28').attr('height', '28').attr('src', imgLogoBlue);
    $('#reload_span img').attr('src', imgClkReload);
    $('#password_pic_span img').attr('src', imgPwdDummy);
    $('#token_pic_span img').hide();
    $('#password_eye_span img').attr('src', imgEyeOpen).attr('title', 'Unmask password');


    //$('button').button();

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

    $('#from_datepicker_input').attr('maxlength', '10').datepicker('setDate', new Date());
    $('#to_datepicker_input').attr('maxlength', '10').datepicker('setDate', new Date());

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
