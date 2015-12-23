// Hasq Technology Pty Ltd (C) 2013-2015

#include "gl_defs.h"
#include "gl_utils.h"
#include "gl_except.h"

#include "os_ipaddr.h"

os::IpAddr::IpAddr(const char * s, unsigned short p) : port(p)
{
    if (!initip(s))
        throw gl::ex("Cannot convert [$1] to net", s);
}


os::IpAddr::IpAddr(const string & s, bool & ok) throw() : port(0)
{
    ok = false;
    size_t i = s.find(":");

    if ( i == string::npos ) return;

    ok = initip( s.substr(0, i).c_str() );
    if ( !ok ) return;

    port = gl::i2us(gl::toi( s.substr(i + 1) ));

    if ( port == 0xFFFF ) port = 0;
}

string os::IpAddr::str() const { return strIp() + ":" + gl::tos(port); }

