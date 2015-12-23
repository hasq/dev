// Hasq Technology Pty Ltd (C) 2013-2015

#include <iostream>

#include "gl_err.h"
#include "gl_defs.h"

#include "sg_mutex.h"
#include "sg_cout.h"

#include "hq_svttask.h"
#include "hq_globalspace.h"

void SvtArea::translateVar(string & s)
{
    mss::iterator j = vars.find(s);

    if ( j != vars.end() )
        s = j->second;
}

bool SvtArea::addJob_safe(SvtJob j)
{
    if ( jobQueue.size() > maxLength )
    {
        svtSemaphore.up();
        return false;
    }

    {
        sgl::Mutex mutex_sa(access2svtArea);
        jobQueue.push_back(j);
    }

    svtSemaphore.up();
    return true;
}

SvtArea::~SvtArea()
{
    std::deque<SvtTask *> & q = taskQueue;

    while ( !q.empty() )
    {
        delete q.front();
        q.pop_front();
    }
}

