// Hasq Technology Pty Ltd (C) 2013-2016

#include <iostream>

#include "gl_err.h"
#include "gl_defs.h"

#include "sg_mutex.h"
#include "sg_cout.h"

#include "hq_svttask.h"
#include "hq_globalspace.h"

ConArea::ConArea(size_t tn, size_t pn, size_t hn):
    access2conArea(1)
    , max_neighbours(tn)
    , max_otherfamily(pn)
    , max_hints(hn)
{}


er::Code ConArea::addHint_safe(const string & ipport)
{
    sgl::Mutex mutex_ca(access2conArea);

    std::vector<Connection> & v = hints;

    if ( v.size() > max_hints )
        return er::Code(er::CON_HIN_BUSY);

    v.push_back(Connection(ipport, "")); // name is not known

    return er::OK;
} // release mutex
