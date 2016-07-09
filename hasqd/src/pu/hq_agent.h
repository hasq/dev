// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _HQ_AGENT
#define _HQ_AGENT

#include <vector>
#include <string>

#include "hq_globalspace.h"

using std::string;

class Agent
{
        typedef std::vector<string> vecstr;

        static string logfile;
        static string webpath;
        static string database;
        static string logcomm;
        static enum Prot { Hasq, HttpGet, HttpPost } protocol;

        static bool islogc(char x)
        {
            const string & m = logcomm;
            return ( !m.empty() && ( m[0] == 'a' || m[0] == x ) );
        }


        GlobalSpace * gs;
        const vecstr & as;

        void print(const string & s, bool cmd = false) const;
        void setshow(string & k, const string & v) const;
        void setshow_prot(const string & v) const;
        static void translateDate(string & v);

        void config(const string & s);
        void filesys(const string & s);
        void download(const string & srv, const string & date);
        string fetch(const string & srv, const string & cmd);
        void downlast(const string & srv, string num, string slice);
        void saveSlice(const string & file, const string & data);
        void build();
        void validate(const string & s);
        std::vector<gl::intint> enquire(const string & dn, const vecstr & srvs);

        void dragging(string cmd, string dn, string srv,
                      gl::intint srvN, gl::intint maxN);
        void report();

        void operator=(const Agent &);
        Agent(const Agent &);

    public:
        Agent(GlobalSpace * g, string cmd1, string cmd2, string cmd3,
              const vecstr & args);

        static bool validCmd(string c);
        static bool sub2Cmd(string c);
        static bool sub3Cmd(string c);
};

#endif
