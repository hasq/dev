// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _HQ_SL_FILE
#define _HQ_SL_FILE

#include <string>

#include "os_filesys.h"

#include "hq_traits.h"

using std::string;

namespace db
{

class SliceFile
{
        os::Path slice_dir;
        os::Path gmd_dir;
        string gmd;
        int n;
        const Traits * tr;

    public:
        SliceFile(const Traits * t): n(0), tr(t) {}
        bool empty() const { return n == 0; }
        os::Path dir() const { return slice_dir + gmd_dir; }
        os::Path file() const;
        string basename() const;
        void make_gmd_dir();
        void initFromFilename(const string & filename);
        void initCurTime();
        void advance();
        void write(const string & r);
};

} // db

#endif
