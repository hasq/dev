 // Hasq Technology Pty Ltd (C) 2013-2016

var gMsg =
{
    badAcceptKeys : 'Keys are not recognised',
    badTokenName: 'Bad token name',
    nonASCII : 'Warning: this data seems binary; please use file instead',
    noDn : 'No such token',
    badDataBase : 'Database is not accessible<br/>Please, reload the page',
    changeMasterKey : 'Master key does not match token',
//FIXME change name "changeTokenName"
    changeTokenName : 'Release keys can be used only on tokens in "On Hold" state',
    createToken : 'Token does not exist',
    dataNotChanged : 'Token data has not been changed',
    enterDate : 'Date "From" must be earlier than "To"',
    enterMasterKey : 'Master key is absent',
    enterTokenName : 'Token is not specified',
    noRecs : 'No such record',
    recordParseError : 'An error occurred while processing record',
    ///tokenIsLocked : 'Token is locked',

    fileLoadError : 'File reading error: maybe too big or not accesible.' +
      'Use linux commnd<br/><br/><b>'+
      'sha256sum <i>FILE</i> | gawk \'{print $1}\' | tr -d \\n | md5sum</b><br/>',

    fileTooBig : 'File is too big. For big files use linux command<br/><br/><b>'+
      'sha256sum <i>FILE</i> | gawk \'{print $1}\' | tr -d \\n | md5sum</b><br/>',

    fileZero : 'File is empty',
    fail: 'Server refused connection',
    unexpected: 'Unexpected server reply : '
};

var gTooltip =
{
    refresh_token : 'Reload token',
    password_eye : 'Show password'
};

var gDataErrorMsg = [
                        'OK',
                        'Bad token data',
                        'Data is too big',
                        'Data is binary, use ASCII text only',
                        'Data expands over the limit',
                        'Data cannot be convered to acceptable text'
                    ];

var gResponse =
{
    OK : 'OK',
    IDX_NODN : 'IDX_NODN',
    JOB_QUEUED : 'JOB_QUEUED',
    NO_RECS : 'NO_RECS',
    URF_BAD_FORMAT : 'URF_BAD_FORMAT',
    REQ_MSG_HEAD : 'REQ_MSG_HEAD',
    REQ_DN_BAD : 'REQ_DN_BAD',
    REC_INIT_BAD_N : 'REC_INIT_BAD_N',
    REC_INIT_BAD_S : 'REC_INIT_BAD_S',
    REC_INIT_BAD_KGO : 'REC_INIT_BAD_KGO',
    RECORD_MISMATCH : 'RECORD_MISMATCH',
    WRONG_SEQ_NUMBER : 'WRONG_SEQ_NUMBER',
    REQ_HASHTYPE_BAD : 'REQ_HASHTYPE_BAD',
    REQ_BAD_SIGN : 'REQ_BAD_SIGN',
    CE_QUE_OVERFLOW : 'CE_QUE_OVERFLOW',
    BUSY : 'BUSY',
    REQ_JOBID_BAD : 'REQ_JOBID_BAD',
    JOB_NOINFO : 'JOB_NOINFO',
    REQ_PATH_BAD : 'REQ_PATH_BAD',
    REQ_BAD_CRYPT : 'REQ_BAD_CRYPT'
};
