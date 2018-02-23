// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _HQ_CHIEFEDITOR
#define _HQ_CHIEFEDITOR

#include "os_block.h"
#include "os_sem.h"
#include "os_thread.h"

#include "hq_globalspace.h"

class ChiefEditor : public os::Blockable
{
        GlobalSpace * gs;

    public:
        ChiefEditor(GlobalSpace * g): Blockable(&g->stopPublisher), gs(g) {}

        void runOnceUnconditionally();

        os::Semaphore * getMainSemaphore() const { return &gs->cedArea.cedSemaphore; }

    private:
        CedJob extractJob() const;
        bool isEmpty() const;
};

#endif
