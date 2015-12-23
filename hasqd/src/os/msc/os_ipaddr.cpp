// Hasq Technology Pty Ltd (C) 2013-2015

#include <cstring>
#include <sstream>

#include <winsock2.h>
#include <ws2tcpip.h>


#include "gl_except.h"
#include "gl_defs.h"
#include "gl_utils.h"

#include "os_ipaddr.h"


int inet_aton_my(const char * cp, struct in_addr * addr)
{
    addr->s_addr = inet_addr(cp);
    return (addr->s_addr == INADDR_NONE) ? 0 : 1;
}

int inet_pton_my(int family, const char * str, void * addr)
{
    if ( family == AF_INET )
    {
        struct in_addr in;
        if ( inet_aton_my(str, &in) )
        {
            std::memcpy(addr, &in, sizeof(in));
            return 1;
        }
        return 0;
    }
    return -1;
}

int inet_ntop_my(int family, void * addr, char * str, int sz)
{
    using gl::c2u;
    const char * p = (const char *) addr;
    if (family == AF_INET)
    {
        std::ostringstream os;
        os << c2u(p[0]) << '.' << c2u(p[1]) << '.' << c2u(p[2]) << '.' << c2u(p[3]);
        string s = os.str();

        if ( gl::st2i(s.size()) >= sz - 1 )
        {
            //errno = ENOSPC;
            return 0;
        }

        std::strcpy(str, s.c_str());
        return gl::st2i(s.size());
    }
    //errno = EAFNOSUPPORT;
    return 0;
}

#define inet_pton inet_pton_my
#define inet_ntop inet_ntop_my
#include "os_ipaddr.inc"


