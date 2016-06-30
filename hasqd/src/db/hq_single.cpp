// Hasq Technology Pty Ltd (C) 2013-2016

//#include <iostream> // debug only

#include <sstream>

#include "gl_err.h"
#include "gl_except.h"

#include "hq_single.h"

db::Single * db::Single::create(const Traits & t)
{
    const string & typ = t.sn();

    Single * r = 0;

    if (typ == Md5::name() )            r = new db::SingleT<Hash<Md5> >(t);
    else if (typ == Sha256::name() )    r = new db::SingleT<Hash<Sha256> >(t);
    else if (typ == Sha512::name() )    r = new db::SingleT<Hash<Sha512> >(t);
    else if (typ == Word::name() )      r = new db::SingleT<Hash<Word> >(t);
    else if (typ == RipeMd160::name() ) r = new db::SingleT<Hash<RipeMd160> >(t);
    else if (typ == Smd::name() )    r = new db::SingleT<Hash<Smd> >(t);
    else return 0;

    REPORT(r);
    return r;
}


template<class H>
er::Code db::SingleT<H>::addRecord(const Record & r)
{
    const RecordT<H> * x = dynamic_cast< const RecordT<H> * >(&r);

    if (x)
    {
        int seg = getDbSegment(x->dn());
        if (seg >= 0 && seg < DB_SEGMENTS)
        {
            hq::LockWrite lock(&ac[seg]);
            return addRecord(*x);
        }
        return er::DB_SEGMENT_FAULT1; // Never
    }

    return er::DB_ADD_BAD_TYPE; // Never
}

template<class H>
er::Code db::SingleT<H>::addRecord(const RecordT<H> & rec)
{
    RecordT<H> prev;
    er::Code e = index.getLast(rec.dn(), prev);

    if ( e == er::IDX_NODN )
    {
        if ( rec.n() == 0 )
            goto add;
        return er::NOPREV_RECORD;
    }
    else if ( rec.n() == 0 )
        return er::DN_EXISTS;

    if ( e )
        return e;

    e = rec.validate(prev, traits.mag());
    if ( e )
        return e;

add:

    RecordT<H> arec = rec;

    arec.trimData(traits.dls());
    if ( traits.skb() )
    {
        e = slice.addRecord(arec);

        if (e)
            return e;
    }

    e = index.addRecord(arec);
    return e;
}

template<class H>
er::Code db::SingleT<H>::getLast(const Dn & dn, Record & r) const
{
    const DnT<T> * dnh = dynamic_cast< const DnT<T> * >(&dn);
    if ( !dnh )
        return er::DB_BAD_HASHTYPE;

    RecordT<H> * rh = dynamic_cast< RecordT<H> * >(&r);
    if ( !rh )
        return er::DB_BAD_HASHTYPE;

    int seg = getDbSegment(dnh->getH());
    if (seg >= 0 && seg < DB_SEGMENTS)
    {
        hq::LockRead lock(&ac[seg]);
        return getLast(*dnh, *rh);
    }
    return er::DB_SEGMENT_FAULT2;
}

template<class H>
er::Code db::SingleT<H>::getLast(const DnT<T> & dn, RecordT<H> & r) const
{
    return index.getLast(dn.getH(), r);
}

template<class H>
er::Code db::SingleT<H>::getFirst(const Dn & dn, Record & r) const
{
    const DnT<T> * dnh = dynamic_cast< const DnT<T> * >(&dn);
    if ( !dnh )
        return er::DB_BAD_HASHTYPE;

    RecordT<H> * rh = dynamic_cast< RecordT<H> * >(&r);
    if ( !rh )
        return er::DB_BAD_HASHTYPE;

    int seg = getDbSegment(dnh->getH());
    if (seg >= 0 && seg < DB_SEGMENTS)
    {
        hq::LockRead lock(&ac[seg]);
        return getFirst(*dnh, *rh);
    }
    return er::DB_SEGMENT_FAULT2;
}

template<class H>
er::Code db::SingleT<H>::getFirst(const DnT<T> & dn, RecordT<H> & r) const
{
    return index.getFirst(dn.getH(), r);
}

template<class H>
er::Code db::SingleT<H>::getRecord(const Dn & dn, gl::intint n, Record & r) const
{
    const DnT<T> * dnh = dynamic_cast< const DnT<T> * >(&dn);
    if ( !dnh )
        return er::DB_BAD_HASHTYPE;

    RecordT<H> * rh = dynamic_cast< RecordT<H> * >(&r);
    if ( !rh )
        return er::DB_BAD_HASHTYPE;

    int seg = getDbSegment(dnh->getH());
    if (seg >= 0 && seg < DB_SEGMENTS)
    {
        hq::LockRead lock(&ac[seg]);
        return getRecord(*dnh, n, *rh);
    }
    return er::DB_SEGMENT_FAULT3;
}

template<class H>
er::Code db::SingleT<H>::getRecord(const DnT<T> & dn, gl::intint n, RecordT<H> & r) const
{
    return index.getRecord(dn.getH(), n, r);
}

template<class H>
er::Code db::SingleT<H>::getRange(const Dn & dn, gl::intint b, gl::intint e, gl::intint max,
                                  gl::intint & would_be_count, vr & r) const
{
    const DnT<T> * dnh = dynamic_cast< const DnT<T> * >(&dn);
    if ( !dnh )
        return er::DB_BAD_HASHTYPE;

    int seg = getDbSegment(dnh->getH());
    if (seg >= 0 && seg < DB_SEGMENTS)
    {
        hq::LockRead lock(&ac[seg]);
        return getRange(*dnh, b, e, max, would_be_count, r);
    }
    return er::DB_SEGMENT_FAULT4; // Never
}

template<class H>
er::Code db::SingleT<H>::getRange(const DnT<T> & dn, gl::intint b, gl::intint e,
                                  gl::intint max, gl::intint & would_be_count, vr & r) const
{
    return index.getRange(dn.getH(), b, e, max, would_be_count, r);
}

template<class H>
er::Code db::SingleT<H>::getLastData(const Dn & dn, gl::intint from, int max, string & data) const
{
    const DnT<T> * dnh = dynamic_cast< const DnT<T> * >(&dn);
    if ( !dnh )
        return er::DB_BAD_HASHTYPE;

    int seg = getDbSegment(dnh->getH());
    if (seg >= 0 && seg < DB_SEGMENTS)
    {
        hq::LockRead lock(&ac[seg]);
        return getLastData(*dnh, from, max, data);
    }
    return er::DB_SEGMENT_FAULT5; // Never
}

template<class H>
er::Code db::SingleT<H>::getLastData(const DnT<T> & dn, gl::intint from, int max, string & data) const
{
    return index.getLastData(dn.getH(), from, max, data);
}

template<class H>
int db::SingleT<H>::getDbSegment(const H & dn) const
{
    const char * val = dn.accessVal();
    int seg;

    if (*val >= 0x30 && *val <= 0x39) seg = (*val - 0x30) * 16;            // 0-9
    else if (*val >= 0x61 && *val <= 0x66) seg = (*val - 0x61 + 10) * 16;  // a-f
    else return -1;
    val++;
    if (*val >= 0x30 && *val <= 0x39) seg += *val - 0x30;                  // 0-9
    else if (*val >= 0x61 && *val <= 0x66) seg += *val - 0x61 + 10;        // a-f
    else return -1;
    return seg;
}


template<class H>
er::Code db::SingleT<H>::load()
{
    er::Code r = slice.load();
    if ( r ) return r;

    RecordT<H> rec_last, rec_i;

    std::deque< RecordT<H> > recs = slice.getLastRecs();
    if ( recs.empty() ) return er::OK;

    rec_last = recs.back();

    H dn = rec_last.dn();

    r = index.getLast(dn, rec_i);
    if ( r ) return r;

    if ( rec_last == rec_i ) return er::OK;

    return er::DB_IDX_MISMATCH;
}

template<class H>
bool db::SingleT<H>::isMy(const string & uNorT) const
{
    string tr;
    string::size_type pos1, pos2;

    if ( uNorT[0] == '(' )
    {
        if ( uNorT.size() < 5 || uNorT[uNorT.size() - 1] != ')' )
            return false;
        tr = uNorT.substr(1, uNorT.size() - 2);

        pos1 = tr.find_first_of(',');
        if ( pos1 == tr.npos || pos1 == 0 )
            return false;
        if ( tr.substr(0, pos1) != traits.sn() )
            return false;

        pos2 = tr.find_first_of(',', ++pos1);
        if ( pos2 == pos1 || pos2 == tr.size() - 1 )
            return false;

        if ( pos2 == tr.npos )
        {
            if ( !traits.mag().empty() )
                return false;
            if ( gl::toi(tr.substr(pos1, tr.size() - pos1)) == traits.nG() )
                return true;
        }
        else
        {
            if ( gl::toi(tr.substr(pos1, pos2 - pos1)) != traits.nG() )
                return false;
            ++pos2;
            if ( tr.substr(pos2, tr.size() - pos2) == traits.mag() )
                return true;
        }
    }
    else
    {
        if ( uNorT == traits.un() || uNorT == traits.getAltName() )
            return true;
    }
    return false;
}

template<class H>
er::Code db::SingleT<H>::makeFromPasswd(const string & uN, gl::intint N,
                                        const string & rawDn, const string & passwd,
                                        const string & data)
{
    if ( !isMy(uN) ) throw gl::ex("direct call");

    RecordT<H> record = RecordT<H>::makeFromPasswd(N, traits.nG(), rawDn, passwd, traits.mag(), data);

    return addRecord(record);
}

template<class H>
string db::SingleT<H>::makeFromPasswdStr(const string & uN, gl::intint N,
        const string & rawDn, const string & passwd,
        const string & data) const
{
    if ( !isMy(uN) ) throw gl::ex("direct call");

    RecordT<H> record = RecordT<H>::makeFromPasswd(N, traits.nG(), rawDn, passwd, traits.mag(), data);

    return record.str();
}

template<class H>
er::Code db::SingleT<H>::makeFromURF(const string & uNorT, gl::intint N,
                                     const string & hashOrRawDn, const string & keysAndData)
{
    if ( !isMy(uNorT) ) throw gl::ex("direct call");

    RecordT<H> record = RecordT<H>::makeFromURF(N, traits.nG(), hashOrRawDn, traits.mag(), keysAndData);

    return addRecord(record);
}

template<class H>
er::Code db::SingleT<H>::isvalid(const Record * r1, const Record * r2) const
{
    const RecordT<H> * rh1 = dynamic_cast< const RecordT<H> * >(r1);
    if ( !rh1 ) return er::DB_BAD_HASHTYPE;

    const RecordT<H> * rh2 = dynamic_cast< const RecordT<H> * >(r2);
    if ( !rh2 ) return er::DB_BAD_HASHTYPE;;

    return rh2->validate(*rh1, traits.mag());
}

template<class H>
void db::SingleT<H>::conflict(const string & sdn, bool state)
{
    if ( state )
        conflicts.insert(sdn);
    else
        conflicts.erase(sdn);
}

template<class H>
string db::SingleT<H>::get1conflict() const
{
    if ( conflicts.empty() ) return "";
    return *conflicts.begin();
}

#include "hq_single.inc"
