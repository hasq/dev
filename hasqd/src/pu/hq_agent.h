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
        static bool prot_html;

        GlobalSpace * gs;
        const std::vector<string> & as;

        void print(const string & s) const;

        void config(const string & s);
        void filesys(const string & s);
        void download(const string & srv, const string & date);

        void operator=(const Agent &);
        Agent(const Agent &);

    public:
        Agent(GlobalSpace * g, string cmd1, string cmd2, string cmd3,
              const std::vector<string> & args);

        static bool validCmd(string c);
        static bool sub2Cmd(string c);
        static bool sub3Cmd(string c);
};

#endif
