// Hasq Technology Pty Ltd (C) 2013-2015

#include <sstream>
#include <cstring>

#include "gl_defs.h"
#include "gl_except.h"

#include "os_place.h"

os::Placeholder::Placeholder(int size)
{
    std::memset(this, 0, size);

    size_t addr = gl::p2st(this);
    if ( addr % sizeof(int) )
    {
        std::ostringstream os;
        os << "Placeholder is not aligned: " << gl::p2p<void>(this)
           << " / " << sizeof(int);
        throw gl::Exception(os.str());
    }
}

string os::Placeholder::str(int size)
{
    std::ostringstream os;

    void ** q = gl::p2p<void *>(this);

    for ( int i = 0; i < size; i += 4 )
    {
        if (i) os << ' ';
        os << (*q++);
    }
    return os.str();
}


