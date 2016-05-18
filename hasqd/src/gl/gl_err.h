// Hasq Technology Pty Ltd (C) 2013-2015

#ifndef _ER_ERR
#define _ER_ERR

#include <string>

using std::string;

namespace er
{

enum CodeType
{
    OK         =   0,

    NOT_IMPLEMENTED,

    HASH_INIT_FAIL,
    RECORD_INIT_FAIL,
    REQ_BAD_SIGN,

    DB_GUESS_FAIL,
    DB_SEGMENT_FAULT1,
    DB_SEGMENT_FAULT2,
    DB_SEGMENT_FAULT3,
    DB_SEGMENT_FAULT4,
    DB_SEGMENT_FAULT5,
    DB_ADD_BAD_TYPE,
    DB_BAD_DBNAME,
    DB_BAD_HASHTYPE,
    DB_BAD_DN,

    REQ_EMPTY_MSG,
    REQ_MSG_HEAD,
    REQ_MSG_BAD,
    REQ_HASHTYPE_BAD,
    REQ_REC_BAD,
    REQ_RANGE_BAD,
    REQ_DN_BAD,
    REQ_N_BAD,
    REQ_JOBID_BAD,
    REQ_FILE_BAD,
    REQ_PATH_BAD,
    REQ_FILE_RAW,
    REQ_CON_BAD,
    REQ_NOTE_BAD,
    REQ_PRX_IP_BAD,
    REQ_PRX_CMD_BAD,
    REQ_PRX_DEAD,
    REQ_BAD_CRYPT,
    REQ_ZERO_POLICY,
    REQ_ADD_ZERO,

    REC_INIT_BAD_N,
    REC_INIT_BAD_S,
    REC_INIT_BAD_KGO,

    JOB_QUEUE_FULL,
    CE_QUE_OVERFLOW,
    JOB_QUEUED,
    JOB_NOINFO,
    CON_HIN_BUSY,
    REQ_BUSY,

    INTERNAL_REC_NO,
    INTERNAL_REC_YES,

    DB_IDX_MISMATCH,
    DB_EMPTY,

    IDX_NODN,
    NOPREV_RECORD,
    RECORD_MISMATCH,
    DN_EXISTS,
    WRONG_SEQ_NUMBER,

    IR_NOT_INITED,
    IDX_NEG,
    IR_BAD_POS,
    IR_BAD_INTEGRITY,
    IDX_HIGH,
    NO_RECS,
    BAD_RANGE,

    IG_PATH_NOT_FOUND,
    IG_FILE_NOT_FOUND,
    IG_CANNOT_READ,
    IG_FILE_CORRUPTED,

    URF_BAD_FORMAT,

    DN_CONFLICT,

    FILE_CANT_CREATE,
    EXEC_FAILED,
    DISABLED,

    LAST_CODE_TYPE
};

string tos(CodeType e);
void enumerate_codes();

class Code
{
        CodeType x;
    public:
        Code(CodeType a): x(a) {}
        string str() const { return er::tos(x); }
        operator bool() const { return x != OK; }
        operator string() const { return str(); }
        bool operator==(CodeType a) const { return x == a; }
        bool operator!=(CodeType a) const { return x != a; }
    private:
        operator int() const;
};

} // er

#endif

