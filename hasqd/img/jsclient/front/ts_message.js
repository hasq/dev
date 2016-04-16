var gMsg =
{
    badAcceptKeys : 'Keys are not recognised',
    nonASCII : 'Warning: this data seems binary; please use file instead',
    noDn : 'No such token',
    badDataBase : 'Database is not accessible<br/>Please, reload the page',
    changeMasterKey : 'Change master key',
    changeTokenName : 'Change token name',
    createToken : 'Create token first',
    dataNotChanged : 'Token data is not changed',
    enterDate : 'Date "From" must be earlier than "To"',
    enterMasterKey : 'Enter master key',
    enterTokenName : 'Enter token name',
    noRecs : 'No such record',
    recordParseError : 'An error occurred while processing record',
    tokenIsLocked : 'Token is locked',
    fileLoadError : 'File reading error: maybe too big or not accesible',
    fileTooBig : 'File is too big. For big files use linux commnd<br/><br/><b>'+
	'sha256sum <i>FILE</i> | gawk \'{print $1}\' | tr -d \\n | md5sum</b><br/>',

    fileZero : 'File is empty'
};

var gDataErrorMsg =
{
    1 : 'Undefined token data',
    2 : 'Length before > 160', // FIXME kogda eto soobshenie pojavljaetsja
    2 : 'Data is too big',
    4 : 'Data is binary, use ASCII text only',
    5 : 'Convertation error'
}
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
    REQ_PATH_BAD : 'REQ_PATH_BAD'
};
