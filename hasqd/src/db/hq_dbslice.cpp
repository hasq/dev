// Hasq Technology Pty Ltd (C) 2013-2016

#include <fstream>
#include <sstream>

#include "gl_except.h"

#include "hq_dbslice.h"

template <class H>
er::Code db::Slice<H>::load()
{
    // find last meta file
    SliceMeta m(traits);
    m.init();

    while (1)
    {
        if ( ! m.file().isfile() ) break;
        cur_meta = m;
        m.next();
    }

    if ( cur_meta.empty() )
    {
        cur_hash.init0();
        return er::OK;
    }

    string sliceFile, hashStr, ymd, hms;
    lastMetaRec(sliceFile, hashStr, ymd, hms);

    if (cur_hash.init(hashStr, false))
        throw gl::ex("Bad hash in meta file " + hashStr);

    cur_slice.initFromFilename(sliceFile);

    os::Path hdt = SliceHdt::path(traits);

    std::ifstream in_hdt(hdt.str().c_str());
    if ( !in_hdt )
        throw gl::ex("Cannot open " + hdt.str());

    std::ifstream in_sl(cur_slice.file().str().c_str());

    if ( !in_sl )
        throw gl::ex("Cannot open " + cur_slice.file().str());

    {
        string value;
        std::getline(in_hdt, value);
        std::istringstream is(value);

        is >> value;
        if ( value != sliceFile )
            throw gl::ex("Hdt header mismatch: $1 $2", value, sliceFile);

        is >> value;
        if ( value != hashStr )
            throw gl::ex("Hdt header mismatch: $1 $2", value, hashStr);

        is >> value;
        if ( value != ymd )
            throw gl::ex("Hdt header mismatch: $1 $2", value, ymd);

        is >> value;
        if ( value != hms )
            throw gl::ex("Hdt header mismatch: $1 $2", value, hms);
    }

    while (1)
    {
        string line_s, line_h;
        std::getline(in_hdt, line_h);
        std::getline(in_sl, line_s);

        if ( !in_hdt && !in_sl )
            break;

        if ( !in_hdt )
            throw gl::ex("Short hdt");

        if ( !in_sl )
            throw gl::ex("Short slice");

        RecordT<H> rec;
        er::Code r = rec.init(line_s, traits->nG());

        if ( r )
            throw gl::ex("Slice corrupted " + r.str());

        std::istringstream is(line_h);
        string sn, sdn, shash;
        is >> sn >> sdn >> shash;

        if ( gl::tos(rec.n()) != sn )
            throw gl::ex("N mismatch $1 $2", sn, gl::tos(rec.n()));

        if ( rec.dn().str() != sdn )
            throw gl::ex("DN mismatch $1 $2", sdn, rec.dn().str());

        progressHash(rec);

        if ( cur_hash.str() != shash )
            throw gl::ex("Hash mismatch $1 $2", cur_hash.str(), shash);

        last_recs.push_back(rec);
    }

    return er::OK;
}


template <class H>
void db::Slice<H>::createNewSlice()
{

    if ( cur_slice.empty() )
    {
        cur_slice.initCurTime();
    }
    else
    {
        cur_slice.advance();
    }

    os::Path p = cur_meta.file();
    if ( cur_meta.empty() || p.filesize() > traits->skb() * 1024 )
    {
        createNewMeta();
        p = cur_meta.file();
    }

    string meta_line = cur_meta.write(cur_slice.file().str(), cur_hash.str());

    SliceHdt::writeHead(traits, meta_line);

}



template <class H>
er::Code db::Slice<H>::addRecord(const RecordT<H> & rec)
{
    os::Path p = cur_slice.file();

    if ( cur_slice.empty() || p.filesize() > traits->skb() * 1024 )
    {
        createNewSlice();
        os::FileSys::trymkdir(cur_slice.dir());
        p = cur_slice.file();
    }

    cur_slice.write(rec.str());

    progressHash(rec);

    SliceHdt::writeLine(traits, rec.n(), rec.dn().str(), cur_hash.str());

    return er::OK;
}

template <class H>
void db::Slice<H>::progressHash(const RecordT<H> & rec)
{
    cur_hash.init( cur_hash.str() + ' ' + rec.strCore(), true );
}

template <class H>
void db::Slice<H>::createNewMeta()
{

    if ( cur_meta.empty() )
    {
        cur_meta.init();
    }
    else
        cur_meta.next();

    os::FileSys::trymkdir( cur_meta.dir() );
}

template <class H>
void db::Slice<H>::lastMetaRec(string & sliceFile, string & hashStr, string & ymd, string & hms)
{
    os::Path metaFile = cur_meta.file();
    std::ifstream in(metaFile.str().c_str());
    if ( !in )
        throw gl::ex("Cannot open for reading " + metaFile.str());
    while (1)
    {
        string line;
        std::getline(in, line);
        if ( !in ) break;
        std::istringstream is(line);
        is >> sliceFile >> hashStr >> ymd >> hms;
    }
}

#include <iostream>
template <class H>
er::Code db::Slice<H>::getSlice(string & data, const string & name, bool body) const
{
//    std::cout << "AAA name=[" << name << "] body=" << (body) << '\n';

    if ( name.empty() ) // request for current slice
    {
        data = cur_slice.basename();
        return er::Code(er::OK);
    }

//    std::cout << "AAA NA";

    return er::Code(er::OK);
}

#include "hq_dbslice.inc"
