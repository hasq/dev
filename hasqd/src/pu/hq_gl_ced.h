// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _HQ_GL_CED
#define _HQ_GL_CED

#include <queue>

struct CedJob
{
    const db::Record * record;
    int dbIndex;
    gl::intint id;
    CedJob(const db::Record * r, int i, gl::intint id): record(r), dbIndex(i), id(id) {}
};


class CedQueue
{
        std::queue<CedJob> jobs;
        gl::intint jobCntr;
        unsigned szMax;
    public:
        std::pair<er::Code, gl::intint> addJob(const db::Record * r, int dbIndex);
        CedJob pop() { CedJob j = jobs.front(); jobs.pop(); return j; }
        bool empty() const { return jobs.empty(); }

        ~CedQueue();
        CedQueue(unsigned s): jobCntr(1000), szMax(s) {}
};

struct CedArea
{
    os::Semaphore cedSemaphore;
    os::Semaphore access2cedArea;
    CedQueue cedQueue;
    bool cedActive;

    CedArea(unsigned sz): access2cedArea(1), cedQueue(sz), cedActive(false) {}
    ~CedArea() {}

    typedef std::pair<er::Code, gl::intint> pcii;
    pcii addJob_safe(const db::Record * r, int dbIndex);
};

#endif
