// Hasq Technology Pty Ltd (C) 2013-2016

var gMaxFileSize = 10000000;

var gClientTitle = getHostName().name;
var gClientLink = getHostName().link;
var gRequiredDbHash = 'smd';
var gPassword = '';
var gNonASCII = false;

var gCurrentDB = null; //'smd.db';
var gTokInfo = {};
var gTimerId;
var gSearch =
{
    isOn : false,
    o : {},
    cache :
    {
        maxSlices: 1000,
        slices : [],
        blanks : {},
        lastSlice : "",
        lastBlank : ""
    }
};
var gAllWallets = { '': {} };
var gWallet = gAllWallets[''];

var imgMsgWait = 'img/msg_wait.gif';

var imgLockOpen = 'img/lock_open.png';
var imgLockClosed = 'img/lock_closed.png';

var imgEyeOpen = 'img/eye_open.png';
var imgEyeClosed = 'img/eye_closed.png';

var imgLogoWait = 'img/logo_wait.png';
var imgLogoFail = 'img/logo_fail.png';
var imgLogoAnim = 'img/logo_anim.gif';

var imgPwdDummy = 'img/pwd_dummy.png';
var imgPwdOk = 'img/pwd_good.png';
var imgPwdWrong = 'img/pwd_wrong.png';
var imgPwdRcvng = 'img/pwd_rcvng.png';
var imgPwdSndng = 'img/pwd_sndng.png';

var imgClkReload = 'img/clk_reload.png';
var imgClkInfo = 'img/clk_info.png';
var imgClkShield = 'img/clk_shield.png';

var imgBtnCreate = '<img width="40px" height="40px" src="img/btn_create.png"><br/>Create';
var imgBtnData = '<img width="40px" height="40px" src="img/btn_setdata.png"><br/>Set';
var imgBtnInstantKeys = '<img width="40px" height="40px" src="img/btn_show_keys1.png"><br/>Instant';
var imgBtnOnHoldKeys = '<img width="40px" height="40px" src="img/btn_show_keys2.png"><br/>On Hold';
var imgBtnReleaseKeys = '<img width="40px" height="40px" src="img/btn_show_keys3.png"><br/>Release';
var imgBtnReceiveKeys = '<img width="40px" height="40px" src="img/btn_accept.png"><br/>Accept';
var imgBtnStop = '<img width="40px" height="40px" src="img/btn_stop.gif"><br/>Stop';
var imgBtnStart = '<img width="40px" height="40px" src="img/btn_search.png"><br/>Search';
var imgTabShowKeys = '<img width="40px" height="40px" src="img/tab_send.png"><br/>Give';
var imgTabReceiveKeys = '<img width="40px" height="40px" src="img/tab_receive.png"><br/>Receive';
var imgTabSearchTokens = '<img width="40px" height="40px" src="img/tab_view.png"><br/>Lookup';

var imgBtnSearchMine = '<img width="24px" height="16px" src="img/pwd_good.png" title="Mine tokens">';
var imgBtnSearchOnHold = '<img width="24px" height="16px" src="img/pwd_sndng.png" title="Tokens on hold">';
var imgBtnSearchExpected = '<img width="24px" height="16px" src="img/pwd_rcvng.png" title="Tokens to come">';
var imgBtnStartPast = '<img width="24px" height="16px" src="img/pwd_wrong.png" title="Past tokens">';


var allImages = [
                    imgPwdOk, imgPwdWrong, imgPwdRcvng, imgPwdSndng, imgPwdDummy,
                    imgMsgWait, imgClkReload, imgEyeOpen, imgEyeClosed,
                    imgLockOpen, imgLockClosed, imgLogoWait, imgLogoFail, imgLogoAnim
                ];
var preloadImg = new Array();
var hasqLogo = HasqLogo('span_logo');

function docMainWrite(state, browser)
{
    document.write(docMain(state, browser));
}

function docMainInit()
{
    $(document).ready(function ()
    {
        docInit();
    });
}

function docInit()
{
    $('#div_modal_window').css('display', 'none');
    $('input, textarea').val('').attr('maxlength', '65536');
    $('input, select, textarea').attr('autocomplete', 'off');

    $('#div_tabs').tabs();
    $('#div_search_result_tabs').tabs();

    $('#span_info img').attr('src', imgClkInfo);
    $('#span_shield img').attr('src', imgClkShield);
    $('#span_logo img').attr('src', imgLogoWait);

    $('#span_reload img').attr('src', imgClkReload);
    $('#span_password_pic img').attr('src', imgPwdDummy);
    $('#span_token_lock img').hide();

    $('#span_password_eye img')
    .attr('src', imgEyeOpen)
    .attr('title', gTooltip.password_eye);

    $('#td_token_data').hide();

    widShowHidePassword();
    widDatePickerInit();
    widSetDefaultDb(gRequiredDbHash);
    widSetDivOverflowSize();
    widWelcomeTab().show();

    /*
        window.onbeforeunload  = function(e) {  return  };
    */

    engSendPing(0);
}

function docMain(state, browser)
{
    if ( !state )
    {
        var r = '<p>';

        if ( browser.name != 'unknown' )
        {
            r += '<h1>';
            r += 'Browser: ' + browser.name + '\n';
            r += 'v ' + browser.verFull + '\n';
            r += 'requires upgrade to v ' + browser.tVerFull;
            r += '</h1>';
        }
        else
        {
            r += 'This browser has not been tested<br/>';
            r += '' + navigator.userAgent;
        }

     r += '</p>';

        return r;
    }

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
    item.title = 'Welcome';
    item.data = widGetHTMLWelcomeTab();
    tabs[tabs.length] = item;

    var body = widGetHTMLBody(tabs);

    return body;
}
