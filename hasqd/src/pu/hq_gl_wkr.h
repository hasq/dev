// Hasq Technology Pty Ltd (C) 2013-2015

#ifndef _HQ_GL_WKR
#define _HQ_GL_WKR

#include "os_net.h"

class JobQueue
{
        int maxSize;
        typedef std::queue<os::net::Socket *> que;
        typedef std::map<string, que> msq;
        msq mjobs;
        string lastip;

    public:

        JobQueue(int m): maxSize(m) {}
        ~JobQueue();

        int size() const;
        er::Code add(os::net::Socket * s);
        bool empty() const { return mjobs.empty(); }
        os::net::Socket * extractJob();

};

class ZeroPolicy
{
        string today;
        typedef std::map<string, int> msi;
        msi requests;
        int limit;

    public:

        ZeroPolicy(int zl): limit(zl) {}
        bool request(const string & ip);
};

struct WkrArea
{
    os::Semaphore workerSemaphore;
    os::Semaphore mutex;
    JobQueue jobSockets;
    ZeroPolicy policy;

    WkrArea(int sz, int zl): mutex(1), jobSockets(sz), policy(zl) {}
    ~WkrArea() {}
};


#endif
