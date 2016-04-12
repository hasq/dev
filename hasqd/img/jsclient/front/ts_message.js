var gMsg =
{
    badAcceptKeys : 'Keys are not recognised',
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
    fileLoadError : 'File loading error',
    fileTooBig : 'File size must be less than 20Mb',
    fileZero : 'File is empty'
};

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
};

function gHelp(x)
{
    var p_ = '';
    p_ += '<p> This is a place where you can create your own tokens, ';
    p_ += 'associate data with them, pass the ownership to another person, or to receive ';
    p_ += 'the ownership from somebody else. A token is a hash taken from any text or file. ';
    p_ += 'The master key is a secure password to control your tokens. It is not shared if ';
    p_ += 'you pass your token to another person.<p>';

    var o =
    {
        span_password_pic: 'FIXME (ts_message.js)<br\>span_password_pic',
        span_token_pic: 'FIXME (ts_message.js)<br\>span_token_pic',
        span_info: p_,
        token_name: 'FIXME (ts_message.js)<br\>token_name',
//        token_hash: 'FIXME (ts_message.js)<br\>token_hash',
        master_key: 'FIXME (ts_message.js)<br\>master_key',
        welcome_to_tokenswap: 'FIXME (ts_message.js)<br\>welcome_to_tokenswap',
        token_data: 'FIXME (ts_message.js)<br\>token_data',
        create_new_token: 'FIXME (ts_message.js)<br\>create_new_token',
        show_keys: 'FIXME (ts_message.js)<br\>show_keys',
        paste_keys: 'FIXME (ts_message.js)<br\>paste_keys',
        search_for_tokens: 'FIXME (ts_message.js)<br\>search_for_tokens'
    };

    if (o[x]) return o[x];

    var r = "";

    if ( x == "span_password_pic" )
    {
     // INCLUDEFILE
     // file
    }
    else if (x == 'token_hash')
    {
     // INCLUDEFILE
     // file
        r += 'sha256sum &lt;file&gt; | gawk \'{print $1}\' | tr -d \\n | md5sum'
    }

    return r;
}
