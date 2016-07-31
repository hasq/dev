// Hasq Technology Pty Ltd (C) 2013-2016

#include "hq_globalspace.h"

#include "hq_netenv.h"

sgl::Link NetEnv::link(const string & addr) const
{
    sgl::Link r;
    r.prot = clntProtocol;
    r.nl = gs->config->netLimits;

    r.tcpto = addr;
    if ( !proxy.is() ) return r;

    if ( addr == gs->config->seIpLink.str() ) return r;

    if ( addr == proxy.remote ) return r;

    r.tcpto = proxy.remote;

    r.px.remote = addr;
    r.px.auth64 = proxy.auth64;

    return r;
}

string Drop::process(const string & cmd, const string & data)
{
    //const string & dropdir = gs->config->dropDir;

    if ( cmd == "get" || cmd == "GET" )
    {
        //cleandir();
        //gl::file2str(data);
    }

    return "";
}

