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
        const std::vector<string> & as;

        void print(const string & s) const;

        void config(const string & s);
        void filesys(const string & s);

        void operator=(const Agent &);
        Agent(const Agent &);

    public:
        Agent(GlobalSpace * g, string cmd1, string cmd2, const std::vector<string> & args);

        static bool validCmd(string c);
        static bool subCmd(string c);
};

#endif
