// Hasq Technology Pty Ltd (C) 2013-2015

#ifndef _HQ_WORKER
#define _HQ_WORKER

#include "os_block.h"
#include "os_thread.h"

#include "hq_globalspace.h"

// WorkerCore does not
class WorkerCore
{
        friend class Worker;

        GlobalSpace * gs;

        int id;

        string decrypt(const string & msg);

    public:
        WorkerCore(GlobalSpace * g): gs(g) {}

        string process(const string & msg, const char ** mime,
                       const os::net::Socket * sock);

        string process(const string & msg, const char ** mime,
                       bool encrypted, const os::net::Socket * sock);
};

class Worker : public os::Blockable
{

        GlobalSpace * gs;
        WorkerCore workerCore;

        os::net::Socket * grabJob();

    public:

        Worker(GlobalSpace * g) : Blockable(&g->stopPublisher), gs(g), workerCore(g) {}

        void runOnceUnconditionally();

        os::Semaphore * getMainSemaphore() const { return &gs->wkrArea.workerSemaphore; }

        int & id() { return workerCore.id; }

};


#endif
