// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _HQ_SECRETARY
#define _HQ_SECRETARY

#include <string>

#include "os_block.h"

#include "hq_globalspace.h"
#include "hq_automachine.h"
#include "hq_alarms.h"

using std::string;

class Secretary : public os::Blockable
{
        GlobalSpace * gs;

        AutoMachine am;

        os::net::TcpAcceptor tcpAcceptor;
        os::net::Selector selector;

        Alarms alarms;

        void submitJob(os::net::Socket * s);

    public:

        Secretary(GlobalSpace * g);

        void runOnceUnconditionally();

        os::Semaphore * getMainSemaphore() const { return 0; }

};

#endif
