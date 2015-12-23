// Hasq Technology Pty Ltd (C) 2013-2015

#include <windows.h>

#include "gl_except.h"
#include "os_sysinfo.h"

os::Info::Info()
{
    ULARGE_INTEGER avail, total, tfree;
    GetDiskFreeSpaceEx(NULL, &avail, &total, &tfree);

    long long a = (long long)avail.QuadPart;
    long long t = (long long)total.QuadPart;
    long long f = (long long)tfree.QuadPart;

    f = t - f;

    a /= 1024 * 1024;
    t /= 1024 * 1024;
    f /= 1024 * 1024;

    MEMORYSTATUSEX statex;

    statex.dwLength = sizeof (statex);

    GlobalMemoryStatusEx (&statex);

    long long mtot = (long long)statex.ullTotalPhys;
    long long muse = (long long)statex.ullAvailPhys;
    muse = mtot - muse;

    mtot /= 1024 * 1024;
    muse /= 1024 * 1024;

    diskUseMb = f;
    diskTotMb = t;
    memUseMb = muse;
    memTotMb = mtot;
}

static unsigned long long FileTmToInt64(const FILETIME & ft)
{
    return
        (((unsigned long long)(ft.dwHighDateTime)) << 32)
        | ((unsigned long long)ft.dwLowDateTime);
}

os::CpuIdle os::getCpuData()
{
    CpuIdle i = {};
    typedef decltype(i.idle) num;

    FILETIME idleTm, kernelTm, userTm;
    if ( !GetSystemTimes(&idleTm, &kernelTm, &userTm) ) return i;

    i.idle = FileTmToInt64(idleTm);
    i.busy = FileTmToInt64(kernelTm) + FileTmToInt64(userTm);

    return i;
}

std::string os::random8()
{
    HCRYPTPROV hProvider = 0;

    if (!::CryptAcquireContextW(&hProvider, 0, 0, PROV_RSA_FULL,
                                CRYPT_VERIFYCONTEXT | CRYPT_SILENT))
        throw gl::ex("os::random8 error, !::CryptAcquireContextW");

    BYTE pbBuffer[rand8sz] = {};

    if (!::CryptGenRandom(hProvider, rand8sz, pbBuffer))
    {
        ::CryptReleaseContext(hProvider, 0);
        throw gl::ex("os::random8 error, !::CryptGenRandom");
    }

    ///for (DWORD i = 0; i < rand8sz; ++i)
    /// random8buffer += static_cast<unsigned char>(pbBuffer[i]);

    string ret((char *)pbBuffer, rand8sz);

    if (!::CryptReleaseContext(hProvider, 0))
        throw gl::ex("os::random8 error, !::CryptReleaseContext");

    return ret;
}
