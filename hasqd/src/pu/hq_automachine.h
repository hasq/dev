// Hasq Technology Pty Ltd (C) 2013-2015

#ifndef _HQ_AUTOMACHINE
#define _HQ_AUTOMACHINE

#include <string>

#include "hq_globalspace.h"

using std::string;

class AutoMachine
{

        GlobalSpace * gs;

    public:
        AutoMachine(GlobalSpace * g): gs(g) {}

        void processMessage(const string & msg);
};

#endif
