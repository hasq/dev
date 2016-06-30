// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _HQ_DBINDEX
#define _HQ_DBINDEX

#include <vector>
#include <list>
#include <string>

#include <fstream>

#include "gl_err.h"

#include "hq_traits.h"
#include "hq_record.h"

using std::string;

namespace db
{
static const size_t MAX_NFILES_INDIR = 200;

os::Path findDnFile(const string & dnstr, int level, const string & index_dir);
os::Path makeDnFile(const string & dnstr, int level, const string & index_dir);

template <class H>
class Index
{
        const Traits * traits;

        os::Path findFile(const H & dn) const;
        os::Path findFile(const string & sdn) const;

        os::Path makeFilePath(const H & dn);

    public:

        Index(const Traits * c): traits(c) {}

        er::Code getLast(const H & dn, RecordT<H> & rec) const;
        er::Code getFirst(const H & dn, RecordT<H> & rec) const;
        er::Code getRecord(const H & dn, gl::intint N, RecordT<H> & rec) const;
        er::Code getRange(const H & dn, gl::intint b, gl::intint e, gl::intint max,
                          gl::intint & would_be_count, std::vector< Record *> & vr) const;

        er::Code getLastData(const H & dn, gl::intint from, int max, string & data) const;

        er::Code addRecord(const RecordT<H> & rec);

        bool cutIndexAt(const string & sdn, gl::intint N);
};

typedef struct
{
    gl::intint b, e;
    gl::intint bpos, epos;
} RangePos;

class IndexReader
{
        std::ifstream file;
        er::CodeType code;

        gl::intint       first_N;
        gl::intint       last_N;
        std::streamoff   last_N_pos;
        char      *      last_N_data;
        gl::intint       last_N_data_size;

        char      *      rdbuf;
        gl::intint       rdbuf_size;
        std::streamoff   rdbuf_pos;
        static const int X = 5;
        gl::intint       avg_size;

        char      *      rdata;

        er::CodeType readFirstN();
        er::CodeType calcAvg();
        er::CodeType find(gl::intint N, std::streamoff & pos);
        er::CodeType findEnd(std::streamoff from, std::streamoff & pos);
        er::CodeType read(std::streamoff from, std::streamoff to);
        bool getN(const char * data, gl::intint max, gl::intint & N);

    public:

        IndexReader(os::Path path, gl::intint initial_rdbuf_size = 2048);
        ~IndexReader();

        er::CodeType accessLast(const char *& data);
        er::CodeType accessFirst(const char *& data);
        er::CodeType accessRecord(gl::intint N, const char *& data);
        er::CodeType accessRange(gl::intint N1, gl::intint N2, gl::intint max,
                                 gl::intint & would_be_count, const char *& data, gl::intint & count);

        er::CodeType getRangePos(gl::intint N1, gl::intint N2, RangePos & info);

        gl::intint getFirstN();
        gl::intint getLastN();

        void release();
        void reinit(os::Path path, gl::intint initial_rdbuf_size = 2048);
};

class IndexGenerator
{
        class MetaNameGenerator
        {
                os::Path   meta_path;
                gl::intint n;
                string     short_name;

                os::Path dir() const { return meta_path + sub_dir(); }
                os::Path sub_dir() const;

            public:

                MetaNameGenerator() { init(""); };

                void init(const string & meta_dir);
                os::Path next();
        };

        er::CodeType processMeta(const string & meta_file, const string & index_dir_out,
                                 const db::TraitsData & traits);
        er::CodeType processSlice(const string & slice_base, const string & slice_file,
                                  const string & index_dir_out, const db::TraitsData & traits);

    public:

        IndexGenerator() {};
        ~IndexGenerator() {};

        er::CodeType generate(const string & slice_dir_in, const string & index_dir_out);
};

} // db

#endif
