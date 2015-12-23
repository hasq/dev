// Hasq Technology Pty Ltd (C) 2013-2015

#include "sg_client.h"


sgl::Client::Client(gl::NetworkLimits netLimits, const string & link) throw() :
    ok(false)
    , prot(gl::ProtHq::Client)
    , addr(link, ok)
    , tcpClient(&prot, addr, netLimits)
{
    if (ok) ok = tcpClient.isConnected();
}
