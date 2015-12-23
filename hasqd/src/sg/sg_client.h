// Hasq Technology Pty Ltd (C) 2013-2015

#ifndef _SG_CLIENT
#define _SG_CLIENT

#include "gl_protocol.h"

#include "os_net.h"

namespace sgl
{

class Client
{
        bool ok;
        gl::ProtHq prot;
        os::IpAddr addr;
        os::net::TcpClient tcpClient;

    public:
        Client(gl::NetworkLimits nl, const string & link) throw ();

        bool isok() const { return ok; }

        string recv() { return tcpClient.recvMsgOrEmpty(); }
        bool send(const string & s) { return tcpClient.send_msg(s); }

        string ask(const string & s) { if ( send(s) ) return recv(); return ""; }
};


} //sgl

#endif
