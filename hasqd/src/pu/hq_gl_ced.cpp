// Hasq Technology Pty Ltd (C) 2013-2015

#include <iostream>

#include "gl_err.h"
#include "gl_defs.h"

#include "sg_mutex.h"
#include "sg_cout.h"

#include "hq_svttask.h"
#include "hq_globalspace.h"

std::pair<er::Code, gl::intint> CedArea::addJob_safe(const db::Record * r, int dbIndex)
{
    typedef std::pair<er::Code, gl::intint> pci;
    pci kk(er::OK, 0);
    {
        sgl::Mutex mutex_ca(access2cedArea);

        kk = cedQueue.addJob(r, dbIndex);

        if ( kk.first )
        {
            delete r;
            return kk;
        }

    }

    cedSemaphore.up();
    return kk;
}

CedQueue::~CedQueue()
{
    while ( !jobs.empty() )
    {
        delete jobs.front().record;
        jobs.pop();
    }
}

std::pair<er::Code, gl::intint> CedQueue::addJob(const db::Record * r, int dbIndex)
{
    typedef std::pair<er::Code, gl::intint> pci;
    if ( jobs.size() >= szMax ) return pci(er::CE_QUE_OVERFLOW, 0);

    if ( jobCntr > gl::MAX_JOBID ) jobCntr = 1;

    jobs.push(CedJob(r, dbIndex, jobCntr));
    return pci(er::OK, jobCntr++);
}

