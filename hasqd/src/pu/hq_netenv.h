// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _HQ_NETENV
#define _HQ_NETENV

#include <string>

#include "sg_client.h"

using std::string;

class GlobalSpace;

class NetEnv
{
        GlobalSpace * gs;

    public:
        gl::Protocol * clntProtocol;
        gl::ProxyData proxy;

    public:
        NetEnv(GlobalSpace * g, gl::Protocol * p, gl::ProxyData x) :
            gs(g), clntProtocol(p), proxy(x) {}

        sgl::Link link(const string & addr) const;
};

class Drop
{
        GlobalSpace * gs;
    public:
        Drop(GlobalSpace * g): gs(g) {}
        string process(const string & cmd, const string & data);
        void cleandir();
};

#endif
