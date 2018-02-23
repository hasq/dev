// Hasq Technology Pty Ltd (C) 2013-2016

#include <iostream>

#include "gl_err.h"
#include "gl_defs.h"

#include "os_filesys.h"

#include "sg_mutex.h"
#include "sg_cout.h"

#include "hq_svttask.h"
#include "hq_globalspace.h"


void GlobalSpace::stopPublisherSignal()
{
    SvtTask * t = new SvtTaskQuit(this);
    {
        sgl::Mutex mutex_sa(svtArea.access2svtArea);
        svtArea.taskQueue.push_back(t);
    }

    svtArea.svtSemaphore.up();
}

GlobalSpace::GlobalSpace(const Config * c) :
    config(c)
    , wkrArea(c->wkrAreaJobSize, c->wkrAreaLimSize, c->zeroLimit)
    , cedArea(c->cedAreaSize)
    , binArea(c->binAreaSize)
    , svtArea(c->svtAreaSize)
    , conArea(c->conCloseSize_ini, c->conPotSize_ini, c->conHintSize_ini)
    , keyArea(c->initial_skc_keys, c->skc_seed)
    , database(c->dbcfg)
    , stopPublisher(false)
    , publisherState(0)
    , protHttp(gl::ProtHq::Server)
    , logger(c->logSize, c->seIpLink.getPort(), c->ignoreLock, c->ignoreLog)
    , activity(c->actQueSize)
    , cpu_load(0)
    , netdisabled(false)
    , agent(this)
    , netenv(this, c->clntProt, c->pxData)
{
    os::Path d(c->dropDir);
    if ( !d.isdir() ) d.mkdir();
    d.erase();
}



