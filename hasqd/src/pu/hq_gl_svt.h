// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _HQ_GL_SVT
#define _HQ_GL_SVT

#include <map>

#include "hq_svtjob.h"

class SvtTask;
struct SvtArea
{
    os::Semaphore svtSemaphore;
    os::Semaphore access2svtArea;

    size_t maxLength;

    std::deque<SvtJob> jobQueue;
    std::deque<SvtTask *> taskQueue;

    typedef std::map<string, string> mss;
    mss vars;

    SvtArea(size_t x): access2svtArea(1), maxLength(x) {}
    ~SvtArea();
    static void clearX(std::deque<SvtTask *> & q);

    bool addJob_safe(SvtJob j);

    void translateVar(string & var);
};

#endif

