// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _OS_THREADABLE
#define _OS_THREADABLE

#include "os_sem.h"

namespace os
{

class Blockable
{
    protected:

        bool * exitp;

    public:
        Blockable(bool * exitptr): exitp(exitptr) {}

        virtual void runOnceUnconditionally() = 0;
        virtual Semaphore * getMainSemaphore() const = 0;

        void runOnce();
        void runForever() { while (isGoing()) runOnce(); }

        void run(int mode);

        bool isGoing() const { return !*exitp; }

        virtual ~Blockable() {}
};

} // os

#endif
