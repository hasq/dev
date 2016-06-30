// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _HQ_PUBLISHER
#define _HQ_PUBLISHER


#include <vector>

#include "hq_config.h"
#include "hq_globalspace.h"
#include "hq_worker.h"
#include "hq_chiefeditor.h"
#include "hq_secretary.h"
#include "hq_automachine.h"
#include "hq_servant.h"

class Publisher
{
        GlobalSpace globalSpace;

        std::vector<Worker> workers;

        ChiefEditor chiefEditor;
        Secretary secretary; // secretary has AutoMachine
        Servant servant;

    public:
        Publisher(const Config * c);
        ~Publisher() {}

        void run();

        bool * getStopFlag() { return &globalSpace.stopPublisher; }

        GlobalSpace * getGlobalSpace() { return &globalSpace; }
        Servant * getServant() { return &servant; }
};



#endif
