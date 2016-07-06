// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _HQ_LOGGER2
#define _HQ_LOGGER2

#include <string>
#include <deque>
#include <ostream>
#include <vector>

#include "os_ipaddr.h"
#include "os_sem.h"

using std::string;

struct Locker
{
    int id;
    bool ok;
    bool ignore;
    Locker(int id, bool ignlck);
    ~Locker();
};

class Logger
{
        struct Queue // mutex safe
        {
            os::Semaphore access;
            std::deque<string> q;
            Queue(): access(1) {}

            void add(size_t mx, const string & s);
            void deflate(std::ostream & of);
            void get(std::vector<string> & v);
        };


        Locker locker;

        size_t maxB;

        Queue criticals;
        Queue overflows;
        Queue writes;
        Queue reads;
        Queue conns;
        Queue conflicts;
        Queue agent;

        bool nologfile;

    public:

        enum MsgType { Critical, Overflow, Write, Read, Connect, Conflict, Agent };

        void add(MsgType t, const string & s);
        void operator()(MsgType t, const string & s) { add(t, s); }

        void get(MsgType t, std::vector<string> & v);

        Logger(int sz, int id, bool ignlck, bool ignlog)
            : locker(id, ignlck), maxB(sz), nologfile(ignlog) {}

        ~Logger();

        bool isOk() { return locker.ok; }
};



#endif
