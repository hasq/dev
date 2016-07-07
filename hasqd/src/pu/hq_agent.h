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
        static string database;
        static enum Prot { Hasq, HttpGet, HttpPost } protocol;

        GlobalSpace * gs;
        const std::vector<string> & as;

        void print(const string & s, bool cmd = false) const;
        void setshow(string & k, const string & v) const;
        void setshow_prot(const string & v) const;
        static void translateDate(string & v);

        void config(const string & s);
        void filesys(const string & s);
        void download(const string & srv, const string & date);
        string fetch(const string & srv, const string & cmd);
        void downlast(const string & srv, const string & num);

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
