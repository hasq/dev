// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _OS_SYSINFO
#define _OS_SYSINFO

#include <string>

#include "gl_defs.h"

namespace os
{

struct Info
{
    gl::intint diskUseMb;
    gl::intint diskTotMb;
    gl::intint memUseMb;
    gl::intint memTotMb;
    Info();
};

struct CpuIdle { unsigned long long idle, busy; };
CpuIdle getCpuData();

inline int cpuLoad(CpuIdle & i)
{
    CpuIdle k, j = getCpuData();
    k.idle = j.idle - i.idle;
    k.busy = j.busy - i.busy;
    if ( k.busy == 0 || k.busy < k.idle ) return 0;
    int r = int(((100000 * (k.busy - k.idle) / k.busy) + 500) / 1000);
    i = j;
    return r;
}

std::string random8();
const int rand8sz = 8;

} // os

#endif
