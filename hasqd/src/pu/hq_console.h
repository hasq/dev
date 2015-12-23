// Hasq Technology Pty Ltd (C) 2013-2015

#ifndef _HQ_CONSOLE
#define _HQ_CONSOLE

#include "os_block.h"

#include "hq_publisher.h"

class Console : public os::Blockable
{
        Publisher * publisher;
        bool svt_mode;

    public:

        Console(Publisher * p)
            : os::Blockable(p->getStopFlag()), publisher(p), svt_mode(false) {}

        void runOnceUnconditionally();
        os::Semaphore * getMainSemaphore() const { return 0; }
};


#endif
