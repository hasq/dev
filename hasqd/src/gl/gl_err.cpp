// Hasq Technology Pty Ltd (C) 2013-2016

#include "gl_err.h"
#include "gl_utils.h"
#include "gl_except.h"


void er::enumerate_codes()
{
    for ( int i = er::OK; i < er::LAST_CODE_TYPE; i++ )
        er::tos(static_cast<er::CodeType>(i));
}

string er::tos(CodeType e)
{

#define IFF(x) if( e==x ) return #x;

    IFF( OK )

    IFF( NOT_IMPLEMENTED )

    IFF( HASH_INIT_FAIL )
    IFF( RECORD_INIT_FAIL )
    IFF( REQ_BAD_SIGN )

    IFF( DB_GUESS_FAIL )
    IFF( DB_SEGMENT_FAULT1 )
    IFF( DB_SEGMENT_FAULT2 )
    IFF( DB_SEGMENT_FAULT3 )
    IFF( DB_SEGMENT_FAULT4 )
    IFF( DB_SEGMENT_FAULT5 )
    IFF( DB_ADD_BAD_TYPE )
    IFF( DB_BAD_DBNAME )
    IFF( DB_BAD_HASHTYPE )
    IFF( DB_BAD_DN )

    IFF( REQ_EMPTY_MSG )
    IFF( REQ_MSG_HEAD )
    IFF( REQ_MSG_BAD )
    IFF( REQ_HASHTYPE_BAD )
    IFF( REQ_REC_BAD )
    IFF( REQ_RANGE_BAD )
    IFF( REQ_DN_BAD )
    IFF( REQ_N_BAD )
    IFF( REQ_JOBID_BAD )
    IFF( REQ_FILE_BAD )
    IFF( REQ_PATH_BAD )
    IFF( REQ_FILE_RAW )
    IFF( REQ_CON_BAD )
    IFF( REQ_NOTE_BAD )
    IFF( REQ_PRX_IP_BAD )
    IFF( REQ_PRX_CMD_BAD )
    IFF( REQ_PRX_DEAD )
    IFF( REQ_BAD_CRYPT )
    IFF( REQ_ZERO_POLICY )
    IFF( REQ_ADD_ZERO )
    IFF( REQ_SLICE_BAD )

    IFF( REC_INIT_BAD_N )
    IFF( REC_INIT_BAD_S )
    IFF( REC_INIT_BAD_KGO )

    IFF( JOB_QUEUE_FULL )
    IFF( CE_QUE_OVERFLOW )
    IFF( JOB_QUEUED )
    IFF( JOB_NOINFO )
    IFF( CON_HIN_BUSY )
    IFF( REQ_BUSY )

    IFF( INTERNAL_REC_NO )
    IFF( INTERNAL_REC_YES )

    IFF( DB_IDX_MISMATCH )
    IFF( DB_EMPTY )

    IFF( IDX_NODN )
    IFF( NOPREV_RECORD )
    IFF( RECORD_MISMATCH )
    IFF( DN_EXISTS )
    IFF( WRONG_SEQ_NUMBER )

    IFF( IR_NOT_INITED )
    IFF( IDX_NEG )
    IFF( IR_BAD_POS )
    IFF( IR_BAD_INTEGRITY )
    IFF( IDX_HIGH )
    IFF( NO_RECS )
    IFF( BAD_RANGE )

    IFF( IG_PATH_NOT_FOUND )
    IFF( IG_FILE_NOT_FOUND )
    IFF( IG_CANNOT_READ )
    IFF( IG_FILE_CORRUPTED )

    IFF( URF_BAD_FORMAT )

    IFF( DN_CONFLICT )

    IFF( FILE_CANT_CREATE )
    IFF( EXEC_FAILED )
    IFF( DISABLED )

#undef IFF

    throw gl::Never("ERR" + gl::tos(e));
}

