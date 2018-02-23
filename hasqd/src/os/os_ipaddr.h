// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _OS_IPADDR
#define _OS_IPADDR

#include <string>

#include "os_place.h"

using std::string;

namespace os
{

class IpAddr
{
        PlaceholderAddr ip;
        gl::ushort port;

        bool initip(const char * s) throw();

    public:

        IpAddr(const char * s, unsigned short p, bool & ok) throw() : port(p) { ok = initip(s); }
        IpAddr(const string & s, bool & ok) throw() ;
        IpAddr(const char * s, unsigned short p);

        string strIp() const;
        string str() const;

        unsigned short getPort() const { return port; }

        void set(void * data, int sz) const;

        void reset_port(unsigned short p) { port = p; }
        void reset_ip(const char * s) { initip(s); }
        PlaceholderAddr getPlaceholder() const { return ip; }
};

} // os

#endif
