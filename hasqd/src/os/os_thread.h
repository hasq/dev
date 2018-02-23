// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _OS_THREAD
#define _OS_THREAD

#include "gl_except.h"

#include "os_block.h"
#include "os_place.h"

namespace os
{

class Thread
{
        PlaceholderThread placeholder;
        Blockable * started;

        void start(Blockable & object);
        void join();

    public:
        Thread(): started(0) {}
        Thread(Blockable & object): started(&object) { start(object); }

        void go(Blockable & object) { started = &object; start(object); }

        static void sleep(unsigned long msec);
        static void yield() { sleep(1); }

        ~Thread();

        // mode 0-runForever, 1-runOnce, 2-do not run
        static void run(Blockable & object, int mode = 0);

};

} // os

#endif
