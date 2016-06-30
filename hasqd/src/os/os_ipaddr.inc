// Hasq Technology Pty Ltd (C) 2013-2016


typedef struct in_addr TypeIpa;

inline TypeIpa & native(os::PlaceholderAddr & p) { return *gl::p2p<TypeIpa>(&p); }
inline const TypeIpa & native(const os::PlaceholderAddr & p) { return *gl::cp2cp<TypeIpa>(&p); }

void os::PlaceholderAddr::check()
{
    int s1 = sizeof(TypeIpa);
    int s2 = sizeof(PlaceholderAddr);
    if ( s1 > s2 )
        throw gl::ex("os::PlaceholderThread $1:$2", gl::tos(s1), gl::tos(s2));
}

void os::IpAddr::set(void * data, int sz) const
{
    memcpy(data, &native(ip), sz);
    if ( sizeof(TypeIpa) != sz )
        throw gl::ex("os::os::IpAddr::set $1:$2", gl::tos(sizeof(TypeIpa)), gl::tos(sz));
}

int name2tcpip(const char * name, TypeIpa * addr)
{
    struct hostent * he = gethostbyname(name);

    char ** pptr;

    if ( !he ) return -1;

    if ( he->h_addrtype != AF_INET ) return -2;

    pptr = he->h_addr_list;

    if ( *pptr == 0 ) return -3;

    memcpy(addr, *pptr, sizeof(*addr));
    return 0;
}

bool os::IpAddr::initip(const char * s) throw()
{
    if ( 1 ==::inet_pton(AF_INET, s, &native(ip)) ) {}
    else if ( 0 ==::name2tcpip( s, &native(ip) ) ) {}
    else
        return false;
    return true;
}

string os::IpAddr::strIp() const
{
    char buf[256];

    strcpy(buf, "zzz.zzz.zzz.zzz______");

    const void * p = &native(ip);
    ::inet_ntop(AF_INET, (void *)p, buf, 200);

    return string(buf);
}

