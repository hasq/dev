// Hasq Technology Pty Ltd (C) 2013-2016

#include "sg_client.h"


sgl::Client::Client(gl::Protocol * prot,
                    gl::NetworkLimits netLimits, const string & link) throw() :
    ok(false)
    ///, prot(gl::ProtHq::Client)
    , addr(link, ok)
    , tcpClient(prot, addr, netLimits, 0)
{
    if (ok) ok = tcpClient.isConnected();
}
