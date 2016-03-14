// Hasq Technology Pty Ltd (C) 2013-2015

#ifndef _HQ_GL_WKR
#define _HQ_GL_WKR

#include <deque>

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
        struct Lrec
        {
            os::PlaceholderAddr ip;
            int counter;
            Lrec(os::PlaceholderAddr a): ip(a), counter(0) {}
            bool issame(os::PlaceholderAddr b) const;
        };

        string today;
        typedef std::deque<Lrec> dq;
        dq requests;
        int limit;
        int maxSz;

    public:

        ZeroPolicy(int sz, int zlim): limit(zlim), maxSz(sz) {}
        bool request(const os::net::Socket * s);
};

struct WkrArea
{
    os::Semaphore workerSemaphore;
    os::Semaphore mutex;
    JobQueue jobSockets;
    ZeroPolicy policy;

    WkrArea(int jsz, int zsz, int zlim):
        mutex(1), jobSockets(jsz), policy(zsz, zlim) {}

    ~WkrArea() {}
};


#endif
