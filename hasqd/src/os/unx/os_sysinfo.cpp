// Hasq Technology Pty Ltd (C) 2013-2015

#include <cstdio>
#include <cstring>
#include <sys/statvfs.h>
#include <unistd.h>
#include <utility>
#include <fstream>
#include <string>

#include "gl_except.h"
#include "os_sysinfo.h"

//#include <sys/types.h>
//#include <sys/stat.h>
#include <fcntl.h>
//#include <unistd.h>
//#include <iostream>

typedef std::pair<long long, long long> pll;

pll getSystemMemory()
{
    long long mb = 1024 * 1024;

    long long pages = 0;
    long long avpages = 0;
    long long page_size = 0;

// workaround for systems where not supported
#ifdef _SC_PHYS_PAGES
    pages = sysconf(_SC_PHYS_PAGES);
#endif
#ifdef _SC_AVPHYS_PAGES
    avpages = sysconf(_SC_AVPHYS_PAGES);
#endif
#ifdef _SC_PAGESIZE
    page_size = sysconf(_SC_PAGESIZE);
#endif

    if ( avpages < 0 ) avpages = 0;
    if ( pages < 0 ) pages = 0;
    long long used = pages - avpages;
    if ( used < 0 || avpages == 0 ) used = 0;
    used *= page_size;
    pages *= page_size;
    used /= mb;
    pages /= mb;
    return pll(used, pages);
}

pll getSystemDisk()
{
    struct statvfs fiData;

    if ((statvfs(".", &fiData)) < 0 )
        return pll(0, 0);

    long long mb = 1024 * 1024;
    long long bsz = fiData.f_bsize;
    long long tot = fiData.f_blocks;
    long long fre = fiData.f_bfree;
    long long used = tot - fre;
    if ( used < 0 ) used = 0;
    used *= bsz; used /= mb;
    tot *= bsz; tot /= mb;
    return pll(used, tot);
}

os::Info::Info()
{
    pll d = getSystemDisk();
    pll m = getSystemMemory();

    diskUseMb = d.first;
    diskTotMb = d.second;
    memUseMb = m.first;
    memTotMb = m.second;
}

os::CpuIdle os::getCpuData()
{
    CpuIdle i {};
    typedef decltype(i.idle) num;

    std::ifstream in("/proc/stat");
    if ( !in) return i;
    std::string x;
    num u, n, s, d;
    in >> x >> u >> n >> s >> d;
    i.idle = d;
    i.busy = u + n + s + d;

    return i;
}

std::string os::random8()
{
    std::string random8buffer;

    int randomData = open("/dev/random", O_RDONLY);

    if (randomData < 0)
        throw gl::ex("os::random8 error, unable to open /dev/random");

    char buf;

    for (int i = 0; i < rand8sz; i++)
    {
        ssize_t result = read(randomData, &buf, sizeof(buf));
        if (result < 0)
        {
            close(randomData);
            throw gl::ex("os::random8 error, unable to read /dev/random");
        }
        random8buffer += buf;
    }
    close(randomData);

    return random8buffer;
}
