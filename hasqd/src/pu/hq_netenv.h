// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _HQ_NETENV
#define _HQ_NETENV

#include <string>

using std::string;

class GlobalSpace;

class NetEnv
{
        GlobalSpace * gs;
    public:
        NetEnv(GlobalSpace * g) : gs(g) {}
};


#endif
