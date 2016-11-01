// Hasq Technology Pty Ltd (C) 2013-2015

var gClientTitle = getHostName().name;
var gClientLink = getHostName().link;
var gDataBase = {};
var gCurrentDB = {}; //The object which contains selected database properties
var gHashCalcHash = ''; // Current calc hash-function
var gPassword = ''; // The specified password
var gSkc = null;
var gIv = null;
var gSalt = null;
var gCiferHash = 's22';
var hasqLogo = HasqLogo('span_logo');
var preloadImg = [];

var glCmdList = {
    items: [],
    idx: 0,
    counter: 100,
    clear: function () {
        this.items.length = 0;
        this.idx = 0;
        this.counter = 100;
    }
};
var glTokList = {
    fit: false,
    unfit: false,
    items: [],
    add: function (item) {
        this.items[this.items.length] = item;
        if (item.fit)
            this.fit = true;
        if (item.unfit)
            this.unfit = true;
    },
    clear: function () {
        this.items = [];
        this.fit = false;
        this.unfit = false;
    },
    status: function () {
        //contains only known tokens;
        if (this.fit === true && this.unfit === false)
            return true;

        //contains only unknown tokens
        if (this.fit === false && this.unfit === true)
            return false;

        //contains different tokens
        if (this.fit === true && this.unfit === true)
            return undefined;
        //not contains any tokens
        return null;
    }
};

var imgMsgOk = 'img/msg_ok.png';
var imgMsgWarning = 'img/msg_warning.png';
var imgMsgError = 'img/msg_error.png';
var imgMsgWait = 'img/msg_wait.gif';
var imgMsgBlink = 'img/msg_blink.gif';

var imgPwdOk = 'img/pwd_good.png';
var imgPwdWrong = 'img/pwd_wrong.png';
var imgPwdRcvng = 'img/pwd_rcvng.png';
var imgPwdSndng = 'img/pwd_sndng.png';
var imgPwdDummy = 'img/pwd_dummy.png';

var imgTknNodn = 'img/tkn_nodn.png';

var imgSkcOn = 'img/lock_closed.png';
var imgSkcOff = 'img/lock_open.png';

var imgLogoWait = 'img/logo_wait.png';
var imgLogoFail = 'img/logo_fail.png';
var imgLogoAnim = 'img/logo_anim.gif';

var allImages = [
    imgMsgOk, imgMsgWarning, imgMsgError, imgMsgWait, imgMsgBlink,
    imgPwdDummy, imgPwdOk, imgPwdWrong, imgPwdRcvng, imgPwdSndng,
    imgTknNodn, imgLogoWait, imgLogoFail, imgLogoAnim, imgSkcOn, imgSkcOff
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
    $('textarea').prop('maxlength', '66435');
    $('#textarea_tokens_names')
        .prop('maxlength', '16511')
        .prop('placeholder', 'Enter tokens \[raw names\] or hashes here');
    $('#input_tokens_password').prop('placeholder', 'Enter a password');
    $('#input_tokens_data').prop('placeholder', 'Enter a new data');
    $('#input_cmd')
        .prop('placeholder', 'Enter a command')
        .prop('value', 'ping');

    $('#div_main_tabs').tabs({
        activate: function (event, ui) {
            if (ui.newTab.index() == 3) {
                if (gCurrentDB.hash != undefined && gCurrentDB.hash != '') {
                    gHashCalcHash = gCurrentDB.hash;
                } else {
                    gHashCalcHash = 'md5';
                }

                switch (gHashCalcHash) {
                    case 'md5': //md5
                        widHashcalcOninput();
                        //$('#select_hashcalc').get(0).selectedIndex = 0;
                        $('#select_hashcalc').val(0);
                        break;
                    case 'r16': //r16
                        widHashcalcOninput();
                        $('#select_hashcalc').val(1);
                        break;
                    case 's22': //s22
                        widHashcalcOninput();
                        $('#select_hashcalc').val(2);
                        break;
                    case 's25': //s25
                        widHashcalcOninput();
                        $('#select_hashcalc').val(3);
                        break;
                    case 'smd': //s25
                        widHashcalcOninput();
                        $('#select_hashcalc').val(4);
                        break;
                    case 'wrd': //wrd
                        widHashcalcOninput();
                        $('#select_hashcalc').val(5);
                        break;
                    default:
                        break;
                }
                
                $('#select_hashcalc').selectmenu('refresh');
            }
            return true;
        }
    });

    $('#div_main_tabs').tabs().tabs('option', 'active', 2);

    $('#database_select').selectmenu({
        select: function (event, ui) {
            var db_table =
                widGetHTMLDatabaseTraitTable(gDataBase[this.selectedIndex]);
            var current_db = gDataBase[this.selectedIndex].name +
                '(' + gDataBase[this.selectedIndex].hash + ')';
            var pwdCheckBoxIsOn = $('#one_pwd_checkbox').is(':checked') +
                $('#three_pwd_checkbox').is(':checked');
            /*
            var pwdCheckBoxIsOn =
                document.getElementById('one_pwd_checkbox').checked +
                document.getElementById('three_pwd_checkbox').checked;
            */
            
            gCurrentDB = gDataBase[this.selectedIndex];

            $('#div_database_table').html(db_table);
            $('#current_db').html(current_db);

            widShowLastRecord();
            widTokenNameOninput();

            if (pwdCheckBoxIsOn)
                widShowNewRecOninput();

            return true;
        }
    });

    $('#select_hashcalc').selectmenu({
        select: function (event, ui) {
            switch (this.selectedIndex) {
                case 0: //md5
                    gHashCalcHash = 'md5';
                    widHashcalcOninput();
                    break;
                case 1: //r16
                    gHashCalcHash = 'r16';
                    widHashcalcOninput();
                    break;
                case 2: //s22
                    gHashCalcHash = 's22';
                    widHashcalcOninput();
                    break;
                case 3: //s25
                    gHashCalcHash = 's25';
                    widHashcalcOninput();
                    break;
                case 4: //smd
                    gHashCalcHash = 'smd';
                    widHashcalcOninput();
                    break;
                case 5: //wrd
                    gHashCalcHash = 'wrd';
                    widHashcalcOninput();
                    break;
                default:
                break;
            }
        }
    });

    $('#select_records_history').selectmenu({
        disabled: true,
        select: function (event, data) {
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

    $('#input_cmd').autocomplete({
        source: cmdinputHints
    });

    var progressbar = $('#div_progressbar_main');
    var progressbarLabel = $('#div_progressbar_label');

    progressbar.progressbar({
        value: 0,
        change: function (event, ui) {
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

    $('#div_tokens_tabs').tabs({
        activate: function (event, ui) {
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

    $('#div_tokens_tabs').tabs().tabs('option', 'active', 0);

    $('#div_add_range_accordion').accordion({
        icons: {
            "header": "ui-icon-plus",
            "activeHeader": "ui-icon-minus"
        },
        active: 'false',
        heightStyle: 'content',
        collapsible: 'true',
        header: 'h3',
    });

    $('#div_tokens_send').accordion({
        icons: {
            'header': 'ui-icon-plus',
            'activeHeader': 'ui-icon-minus'
        },
        active: 0,
        heightStyle: 'content',
        collapsible: 'true',
        header: 'h3',
    });

    $('#div_tokens_receive').accordion({
        icons: {
            'header': 'ui-icon-plus',
            'activeHeader': 'ui-icon-minus'
        },
        active: 0,
        heightStyle: 'content',
        collapsible: 'true',
        header: 'h3',
    });

    $('#main_help_accordion').accordion({
        icons: {
            'header': 'ui-icon-plus',
            'activeHeader': 'ui-icon-minus'
        },
        active: 'false',
        heightStyle: 'content',
        collapsible: 'true',
        header: 'h3',
    });

    $('#tokens_tab_help_accordion').accordion({
        icons: {
            'header': 'ui-icon-plus',
            'activeHeader': 'ui-icon-minus'
        },
        active: 'false',
        heightStyle: 'content',
        collapsible: 'false',
        header: 'h2',
    });

    $('.td-warning').hide();
    $('.continue-button').hide();
    $('.verify-table').hide();

    $('#span_logo img').attr('width', '28');
    $('#span_logo img').attr('height', '28');
    $('#span_logo img').attr('src', imgLogoWait);
    $('#span_skc img').attr('src', imgSkcOff);

    $('#server_host').html('' + location.host);
    $('#div_table_verify').hide();

    $('#td_label_records_encrypt').hide();
    $('#td_input_records_encrypt').hide();
    $('#td_tokens_encrypt').hide();

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
    item.title = 'Admin';
    item.data = widGetHTMLCommandTab();
    tabs[tabs.length] = item;

    item = {};
    item.title = 'Tokens';
    item.data = widGetHTMLTokensTabs();
    tabs[tabs.length] = item;

    item = {};
    item.title = 'Help';
    item.data = widHelpTab();
    tabs[tabs.length] = item;

    var body = widGetHTMLMainBody(tabs);

    return body;
}
