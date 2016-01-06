// Hasq Technology Pty Ltd (C) 2013-2015

#include "gl_utils.h"
#include "gl_except.h"

#include "sg_cout.h"

#include "hq_svtjob.h"
#include "hq_connector.h"
#include "hq_conflict.h"
#include "hq_reorgan.h"

namespace
{
inline void prn(GlobalSpace * gs, const string & s)
{
    if ( gs->config->dbg.svt )
        os::Cout() << os::prmpt("svt", gs->config->dbg.id) << s << os::endl;
}
}

void SvtJob::init(SvtJob::Type t)
{
    if ( t == None )
    {
        process_ptr = &SvtJob::none_proc;
        text_ptr = &SvtJob::none_text;
    }

    else if ( t == Conupdate )
    {
        process_ptr = &SvtJob::conupdate_proc;
        text_ptr = &SvtJob::conupdate_text;
    }

    else if ( t == Noterecv )
    {
        process_ptr = &SvtJob::noterecv_proc;
        text_ptr = &SvtJob::noterecv_text;
    }

    else if ( t == Sendnote )
    {
        process_ptr = &SvtJob::sendnote_proc;
        text_ptr = &SvtJob::sendnote_text;
    }

    else if ( t == SetConfl )
    {
        process_ptr = &SvtJob::setconfl_proc;
        text_ptr = &SvtJob::setconfl_text;
    }

    else if ( t == ChkConfl )
    {
        process_ptr = &SvtJob::chkconfl_proc;
        text_ptr = &SvtJob::chkconfl_text;
    }

    else if ( t == Reorg )
    {
        process_ptr = &SvtJob::reorg_proc;
        text_ptr = &SvtJob::reorg_text;
    }

    else
        throw gl::Never("Bad SvtJob type: $1", gl::tos(t) );
}

void SvtJob::conupdate_proc()
{
    Connector(gs).update_neighbours();
}

void SvtJob::noterecv_proc()
{
    const int & db = i_arg1;
    const gl::intint & N = n_arg1;
    const string & dn = s_arg1;
    const string & from = s_arg2;
    er::Code k = Connector(gs).notificationReceived(db, N, dn, from);

    if ( k )
        gs->logger.add(Logger::Connect, "SvtTaskNoteRecv::process: error: " + k.str() );
}

void SvtJob::sendnote_proc()
{
    const int & db = i_arg1;
    const gl::intint & N = n_arg1;
    const string & dn = s_arg1;
    Connector(gs).sendNotification(db, N, dn);
}




void SvtJob::setconfl_proc()
{
    const int & idx = i_arg1;
    db::Database & db = gs->database;

    // before starting conflict resolution lets open family nodes 
    // just in case if no reorg is run before
    Reorganiser(gs).discoverNet().updateFamily_safe();

    while (1)
    {
        const string sdn = db.get1conflict(idx);
        if ( sdn.empty() ) break;

        Conflictor c(gs, idx, sdn);
        prn(gs, "conflict detected for " + sdn + " on " + gl::tos(idx));

        if ( c.empty() )
        {
            db.conflict(idx, sdn, false);
            prn(gs, "conflict abandoned");
            continue;
        }

        // [CONFLICT:TREE]
        c.tree();

        // [CONFLICT:VOTE]
        c.vote();

        if ( c.iwin() )
        {
            db.conflict(idx, sdn, false);
            prn(gs, "conflict resolved without change");
            continue;
        }

        // [CONFLICT:VCUT]
        c.cut();

        // [CONFLICT:CRLS]
        db.conflict(idx, sdn, false);

        // [CONFLICT:VADD]
        c.addrecords();

        // [CONFLICT:CSND]
        c.sendconflict();

        prn(gs, "conflict resolved with modifications");
    }
}

void SvtJob::chkconfl_proc()
{
    const int & idx = i_arg1;
    const string & sdn = s_arg1;

    Connector(gs).checkConflict(idx, sdn);
}

void SvtJob::reorg_proc()
{
    Reorganiser r(gs);
    r.discoverNet();
    r.reorgNbs();
}
