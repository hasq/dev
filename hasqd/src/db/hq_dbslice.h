// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _HQ_DBSLICE
#define _HQ_DBSLICE

#include <deque>

#include "gl_err.h"

#include "os_filesys.h"

#include "hq_traits.h"
#include "hq_record.h"

#include "hq_sl_hdt.h"
#include "hq_sl_file.h"
#include "hq_sl_meta.h"

namespace db
{

template <class H>
class Slice
{
        const Traits * traits;

        SliceFile cur_slice;
        H cur_hash;
        SliceMeta cur_meta;

        static const int LAST_REC_MAX = 10;
        std::deque<RecordT<H> > last_recs;

        void createNewSlice();
        void createNewMeta();
        void lastMetaRec(string & sliceFile, string & hashStr, string & ymd, string & hms);
        void progressHash(const RecordT<H> & rec);

    public:
        Slice(const Traits * c): traits(c), cur_slice(c), cur_meta(c) {}

        er::Code load();
        std::deque< RecordT<H> > getLastRecs() const { return last_recs; }

        er::Code addRecord(const RecordT<H> & rec);
        string getClock() const { return cur_hash.str(); }
};

} // db

#endif
