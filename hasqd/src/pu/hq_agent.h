// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _HQ_AGENT
#define _HQ_AGENT

#include <vector>
#include <string>

#include "hq_globalspace.h"

using std::string;

class Agent
{
        static string logfile;
        static string webpath;

        GlobalSpace * gs;

        void print(const string & s) const;

    public:
        Agent(GlobalSpace * g, string cmd1, string cmd2, const std::vector<string> & args);
};

#endif
