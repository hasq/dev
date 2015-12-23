// Hasq Technology Pty Ltd (C) 2013-2015

#include "sg_cout.h"

#include "hq_chiefeditor.h"

CedJob ChiefEditor::extractJob() const
{
    CedArea & ca = gs->cedArea;
    sgl::Mutex mutex_ca(ca.access2cedArea);
    if ( ca.cedQueue.empty() ) return CedJob(0, 0, 0);
    return ca.cedQueue.pop();
}

bool ChiefEditor::isEmpty() const
{
    CedArea & ca = gs->cedArea;
    sgl::Mutex mutex_ca(ca.access2cedArea);
    return ca.cedQueue.empty();
}

void ChiefEditor::runOnceUnconditionally()
{
    CedJob job = extractJob();
    if ( !job.record ) return;

    gl::Remover<db::Record> rem_record(job.record);

    gs->cedArea.cedActive = true;

    db::Database & db = gs->database;

    er::Code k = db.addRecord(job.dbIndex, *job.record);

    {
        BinArea & ba = gs->binArea;
        sgl::Mutex mutex_ba(ba.access2binArea);
        ba.queue.setStatus(job.id, k);
    }

    if ( gs->config->dbg.ced )
        os::Cout() << os::prmpt("ced", gs->config->dbg.id)
                   << "job:" << gl::ii2i(job.id)
                   << " [" << job.record->str()
                   << "] -> " << k.str() << os::endl;

    if (k == er::OK)
    {
        const string & dn = job.record->dnstr();
        SvtJob sjob( gs, SvtJob::Sendnote, job.dbIndex, job.record->n(), dn );
        gs->svtArea.addJob_safe( sjob );

        gs->activity.push('a');
    }

    if ( isEmpty() )
        gs->cedArea.cedActive = false;
}
