// Hasq Technology Pty Ltd (C) 2013-2016

#include <string.h>

#include <netinet/in.h>
#include <termios.h>
#include <net/if.h>
#include <sys/types.h>
#include <arpa/inet.h>
#include <sys/ioctl.h>
#include <sys/socket.h>
#include <netdb.h>
#include <errno.h>


#include "gl_except.h"
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
            memcpy(addr, &in, sizeof(in));
            return 1;
        }
        return 0;
    }
    return -1;
}

#define inet_pton inet_pton_my
#include "os_ipaddr.inc"


