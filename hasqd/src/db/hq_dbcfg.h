// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _HQ_DBCFG
#define _HQ_DBCFG

#include "os_filesys.h"

namespace db
{

struct DbCfg
{
    os::Path dir_slice;
    os::Path dir_index;
    os::Path fil_trait;
    os::Path meta;

    DbCfg(os::Path ds, os::Path di, os::Path ft, os::Path m):
        dir_slice(ds), dir_index(di), fil_trait(ft), meta(m) {}

    DbCfg(): dir_slice("slice"), dir_index("index"),
        fil_trait("db.traits"), meta("meta") {}

    void addBase(os::Path b)
    {
        dir_slice = b + dir_slice;
        dir_index = b + dir_index;
    }
};

} //db

#endif

