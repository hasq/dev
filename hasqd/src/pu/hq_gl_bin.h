// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _HQ_GL_BIN
#define _HQ_GL_BIN


struct BinObject
{
    gl::intint id;
    er::Code status;
    BinObject(gl::intint x): id(x), status(er::JOB_QUEUED) {}
};

class BinQueue
{
        std::deque<BinObject> bos;

        unsigned szMax;
        int findJob(gl::intint jid) const;
    public:
        void addJobId(gl::intint jobId);
        void setStatus(gl::intint jobId, er::Code status);
        er::Code getStatus(gl::intint jid) const;
        BinQueue(unsigned sz): szMax(sz) {}
};

struct BinArea
{
    os::Semaphore access2binArea;
    BinQueue queue;
    BinArea(int sz): access2binArea(1), queue(sz) {}
};

#endif
