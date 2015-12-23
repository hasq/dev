// Hasq Technology Pty Ltd (C) 2013-2015

#ifndef _HQ_SL_HDT
#define _HQ_SL_HDT

#include "os_filesys.h"

#include "hq_traits.h"

namespace db
{

namespace SliceHdt
{

os::Path prepareHdt(const db::Traits * t, bool write);
void writeHead(const Traits * t, const string & s);
void writeLine(const Traits * t, gl::intint n, const string & s, const string & h);

inline os::Path path(const db::Traits * t) { return prepareHdt(t, false); }

} // hdt

} // db

#endif
