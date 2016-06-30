// Hasq Technology Pty Ltd (C) 2013-2016

#include <iostream>

#include "gl_err.h"
#include "gl_defs.h"

#include "sg_mutex.h"
#include "sg_cout.h"

#include "hq_svttask.h"
#include "hq_globalspace.h"

er::Code BinQueue::getStatus(gl::intint jid) const
{
    int i = findJob(jid);

    if ( i < 0 )
        return er::JOB_NOINFO;

    return bos[i].status;
}

int BinQueue::findJob(gl::intint jid) const
{
    size_t sz = bos.size();

    for ( size_t i = 0; i < sz; i++ )
        if ( bos[i].id == jid )
            return static_cast<int>(i); // cannot be big

    return -1;
}

void BinQueue::addJobId(gl::intint jobId)
{
    int i = findJob(jobId);

    if ( i >= 0 ) return; // this job maybe present already
    // this may happen if Ced is too quick and adds record
    // faster than Wkr tries to add this job

    bos.push_front(BinObject(jobId));

    while ( bos.size() > szMax ) // while cos szMax may change (if)
        bos.pop_back();
}

void BinQueue::setStatus(gl::intint jobId, er::Code status)
{
    int i = findJob(jobId);

    if ( i < 0 )
    {
        // job is not found - maybe Wkr is too slow
        addJobId(jobId);
        setStatus(jobId, status);
    }
    else
        bos[i].status = status;
}

