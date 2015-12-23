// Hasq Technology Pty Ltd (C) 2013-2015

#ifndef _HQ_SL_META
#define _HQ_SL_META

#include <string>

#include "os_filesys.h"

#include "hq_traits.h"

using std::string;


namespace db
{

class SliceMeta
{
        os::Path meta_dir;
        gl::intint n;
        const Traits * tr;
    public:
        SliceMeta(const Traits * t): n(0), tr(t) {}
        bool empty() const { return meta_dir.empty(); }
        os::Path file() const;
        os::Path dir() const { return meta_dir + sub_dir(); }
        os::Path sub_dir() const;
        void next() { ++n; }
        void init() { meta_dir = tr->getMetaPath(); n = 0; }
        string write(const string & file, const string & hash);
};

} // db

#endif
