// Hasq Technology Pty Ltd (C) 2013-2016

#include <netinet/in.h>
#include <termios.h>
#include <net/if.h>
#include <sys/types.h>
#include <arpa/inet.h>
#include <sys/ioctl.h>
#include <sys/socket.h>
#include <netdb.h>
#include <errno.h>
#include <cstring>
#include <fcntl.h>
#include <unistd.h>

#include <string>

#include "gl_except.h"
#include "gl_utils.h"

#include "os_net.h"
#include "os_timer.h"


struct __attribute__((__may_alias__)) soctype
{
    typedef int fd_type;

    struct sockaddr_in a;
    fd_type fd;

    static const fd_type INVALID = -1;
};

typedef soctype OTYPE;

inline OTYPE & native(os::PlaceholderSocket & p) { return *gl::p2p<OTYPE>(&p); }
inline const OTYPE & native(const os::PlaceholderSocket & p) { return *gl::cp2cp<OTYPE>(&p); }
inline OTYPE::fd_type getDescr(const os::PlaceholderSocket & p) { return native(p).fd; }

void os::PlaceholderSocket::check()
{
    int s1 = sizeof(OTYPE);
    int s2 = sizeof(PlaceholderSocket);
    if ( s1 > s2 )
        throw gl::ex("os::PlaceholderSocket $1:$2", gl::tos(s1), gl::tos(s2));
}

void os::net::openNetwork() {}
void os::net::closeNetwork() {}

int os::net::getLastError() { return errno; }

int os::net::NetInitialiser::findpid() { return ::getpid(); }

bool setReuse(OTYPE::fd_type descr)
{
    int reuse = 1;
    return setsockopt(descr, SOL_SOCKET, SO_REUSEADDR, &reuse, sizeof(reuse)) >= 0;
}

int getnameinfo(const struct sockaddr *, socklen_t, char *, int, char *, int, int)
{
    return 1;
}

void closeDescriptor(OTYPE::fd_type d) { ::close(d); }

bool connectSocket(OTYPE::fd_type descr, struct sockaddr * addr, unsigned long tryTime)
{
    int            flags;
    struct timeval tv;
    fd_set         wset;
    int            r;
    bool           ret = false;

    flags = fcntl(descr, F_GETFL);
    if ( flags < 0 || fcntl(descr, F_SETFL, flags | O_NONBLOCK) < 0 )
        return false;

    r = ::connect(descr, addr, sizeof(*addr));

    if ( r == 0 )
    {
        ret = true;
        goto done;
    }

    if ( !(r == -1 && os::net::getLastError() == EINPROGRESS) )
        goto done;

    FD_ZERO(&wset);
    FD_SET(descr, &wset);

    tv.tv_sec = tryTime / 1000;
    tv.tv_usec = tryTime % 1000;

    r = select(descr + 1, NULL, &wset, NULL, &tv);

    if ( r > 0 && FD_ISSET(descr, &wset) )
        ret = true;

done:

    if ( fcntl(descr, F_SETFL, flags) < 0 )
        return false;
    return ret;
}

#include "os_net.inc"
