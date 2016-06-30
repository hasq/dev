// Hasq Technology Pty Ltd (C) 2013-2016

#include <winsock2.h>
#include <ws2tcpip.h>
#include <errno.h>
#include <process.h>

#include "gl_except.h"
#include "gl_utils.h"

#include "os_net.h"
#include "os_timer.h"

struct soctype
{
    typedef SOCKET fd_type;
    static const fd_type INVALID = INVALID_SOCKET;
    fd_type fd;
    struct sockaddr_in a;
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
        throw gl::ex("os::PlaceholderSocket $1:$2", gl::tos(s1), gl::tos(s2) );
}


void os::net::openNetwork()
{
    WSADATA wsaData;
    if ( WSAStartup( MAKEWORD(2, 2), &wsaData ) != NO_ERROR )
        throw gl::ex("Error at WSAStartup()");
}

void os::net::closeNetwork()
{
    WSACleanup();
}

int os::net::getLastError() { return WSAGetLastError(); }

int os::net::NetInitialiser::findpid() { return ::_getpid(); }

void closeDescriptor(OTYPE::fd_type d) { ::closesocket(d); }

bool setReuse(OTYPE::fd_type descr)
{
    char reuse = 1;
    return setsockopt(descr, SOL_SOCKET, SO_REUSEADDR, &reuse, sizeof(reuse)) >= 0;
}

bool connectSocket(OTYPE::fd_type descr, struct sockaddr * addr, unsigned long tryTime)
{
    unsigned long  nonblock;
    struct timeval tv;
    fd_set         wset;
    int            r;
    bool           ret = false;

    nonblock = 1;
    if ( ioctlsocket(descr, FIONBIO, &nonblock) < 0 )
        return false;

    r = ::connect(descr, addr, sizeof(*addr));

    if ( r == 0 )
    {
        ret = true;
        goto done;
    }

    if ( !(r == SOCKET_ERROR && os::net::getLastError() == WSAEWOULDBLOCK) )
        goto done;

    FD_ZERO(&wset);
    FD_SET(descr, &wset);

    tv.tv_sec = tryTime / 1000;
    tv.tv_usec = tryTime % 1000;

    r = select(0, NULL, &wset, NULL, &tv);

    if ( r > 0 && FD_ISSET(descr, &wset) )
        ret = true;

done:

    nonblock = 0;
    if ( ioctlsocket(descr, FIONBIO, &nonblock) < 0 )
        return false;
    return ret;
}

#include "os_net.inc"
