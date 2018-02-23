// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _SG_CLIENT
#define _SG_CLIENT

#include "gl_protocol.h"

#include "os_net.h"

namespace sgl
{

struct Link
{
    gl::Protocol * prot;
    gl::NetworkLimits nl;
    string tcpto;
    gl::ProxyData px;
};

class Client
{
        bool ok;
        ///gl::ProtHq prot;
        os::IpAddr addr;
        os::net::TcpClient tcpClient;

    public:
        ///Client(gl::Protocol * prot, gl::NetworkLimits nl, const string & link) throw ();
        Client(const Link & link) throw ();

        bool isok() const { return ok; }

        string recv() { return tcpClient.recvMsgOrEmpty(); }
        bool send(const string & s) { return tcpClient.send_msg(s); }

        string ask(const string & s) { if ( send(s) ) return recv(); return ""; }
};


} //sgl

#endif
