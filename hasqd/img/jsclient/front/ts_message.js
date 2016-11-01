// Hasq Technology Pty Ltd (C) 2013-2016

var gMsg = {
    badAsgmtKeys: 'Keys are not recognised',
    badTokenName: 'Bad token name',
    nonASCII: 'Warning: this data seems binary; please use file instead',
    noDn: 'No such token',
    badDataBase: 'Database is not accessible<br/>Please, reload the page',
    changeMasterKey: 'Master key does not match token',
    changeTokenName: 'Release keys can be used only on tokens in ' +
        '"On Hold" state',
    createToken: 'Token does not exist',
    dataNotChanged: 'Token data has not been changed',
    enterDate: 'Date "From" must be earlier than "To"',
    enterMasterKey: 'Master key is absent',
    enterTokenName: 'Token is not specified',
    noRecs: 'No such record',
    recordParseError: 'An error occurred while processing record',
    tokenIsHeld: 'Token is held',
    tokenIsAvailable: 'Token is available',
    fileLoadError: 'File reading error: maybe too big or not accesible.' +
        'Use linux commnd<br/><br/><b>sha256sum <i>FILE</i> |' + 
        ' gawk \'{print $1}\' | tr -d \\n | md5sum</b><br/>',
    fileTooBig: 'File is too big. For big files use linux command<br/><br/>' +
        '<b>sha256sum <i>FILE</i> | gawk \'{print $1}\' |' +
        ' tr -d \\n | md5sum</b><br/>',
    fileZero: 'File is empty',
    fail: 'Server refused connection',
    unexpected: 'Unexpected server reply : ',
    unknownError: 'Unknown error!\nContact Hasq team, please!',
    askExit: 'Do you realy wont to leave this page?'
};

var gTooltip = {
    refresh_token: 'Reload token',
    password_eye: 'Show password'
};

var gDataErrorMsg = [
    'OK',
    'Bad token data',
    'Data is too big',
    'Data is binary, use ASCII text only',
    'Data expands over the limit',
    'Data cannot be convered to acceptable text'
];
