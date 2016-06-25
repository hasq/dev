// Hasq Technology Pty Ltd (C) 2013-2015

#ifndef _HQ_WKRTASK
#define _HQ_WKRTASK

#include <istream>
#include <string>

#include "gl_token.h"

#include "hq_record.h"
#include "hq_globalspace.h"

using std::string;

struct Worker2
{
        GlobalSpace * gs;
        gl::Token tok;
        const char ** mime;
        bool encrypted;
        const os::net::Socket * sock;

    private:
        string info();
        string info_db();
        string info_nbs();
        string info_fam();
        string info_log();
        string info_sys();
        string info_id();
        string job();
        string add(bool zr);
        string zero();
        string record(bool last, bool dat, bool first);
        string lastdata();
        string range();
        string file(bool html, bool argument);
        string conn();
        string unlink();
        string note();
        string conflict();
        string quit();
        string proxy();
        string pleb();
        string admin();

        er::Code fetchRecord(int dbIndex, db::Dn * dn,
                             gl::intint n, bool first, db::Record * record);


    public:

        Worker2(GlobalSpace * g, const string * s,
                const char ** m, bool e, const os::net::Socket * t)
            : gs(g), tok(s), mime(m), encrypted(e), sock(t) {}

        string process(bool *);
        static string proxy(GlobalSpace * gs, const string & ipport, const string & cmd);

    private:
        // forbid
        Worker2(const Worker2 &);
        void operator=(const Worker2 &);
};

#endif

