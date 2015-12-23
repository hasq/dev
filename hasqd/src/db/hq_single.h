// Hasq Technology Pty Ltd (C) 2013-2015

#ifndef _HQ_SINGLE
#define _HQ_SINGLE

#include <string>
#include <vector>
#include <set>

using std::string;

#include "gl_err.h"

#include "hq_access.h"
#include "hq_record.h"

#include "hq_dbslice.h"
#include "hq_dbindex.h"

#include "hq_traits.h"

namespace db
{

class Single
{
    public:

        virtual er::Code isvalid(const Record * r1, const Record * r2) const = 0;
        virtual void conflict(const string & sdn, bool state) = 0;
        virtual string get1conflict() const = 0;

        virtual er::Code addRecord(const Record & r) = 0;
        virtual er::Code getLast(const Dn & dn, Record & r) const = 0;
        virtual er::Code getFirst(const Dn & dn, Record & r) const = 0;
        virtual er::Code getRecord(const Dn & dn, gl::intint n, Record & r) const = 0;
        typedef std::vector<Record *> vr;
        virtual er::Code getRange(const Dn & dn, gl::intint b, gl::intint e, gl::intint max,
                                  gl::intint & would_be_count, vr & r) const = 0;
        virtual er::Code getLastData(const Dn & dn, gl::intint from, int max, string & data) const = 0;

        virtual ~Single() {}

        static Single * create(const Traits & t);

        virtual er::Code load() = 0;

        virtual bool isMy(const string & uNorT) const = 0;

        virtual er::Code makeFromPasswd(const string & uN, gl::intint N,
                                        const string & rawDn, const string & passwd,
                                        const string & data) = 0;

        virtual string makeFromPasswdStr(const string & uN, gl::intint N,
                                         const string & rawDn, const string & passwd,
                                         const string & data) const = 0;

        virtual er::Code makeFromURF(const string & uNorT, gl::intint N,
                                     const string & hashOrRawDn, const string & keysAndData) = 0;

        virtual string getClock() const = 0;
        virtual void cutIndexAt(const string & sdn, gl::intint N) = 0;

        const Traits traits;

    protected:

        Single(const Traits & t): traits(t) {}

        static const int DB_SEGMENTS = 256;

        mutable hq::AccessController ac[DB_SEGMENTS];

    private:
        void operator=(const Single &);

};


template <class H>
class SingleT : public Single
{
    public:
        SingleT(const Traits & t): Single(t), slice(&traits), index(&traits) {}

        er::Code isvalid(const Record * r1, const Record * r2) const;
        void conflict(const string & sdn, bool state);
        string get1conflict() const;

        er::Code addRecord(const Record & r);
        er::Code addRecord(const RecordT<H> & r);

        typedef typename H::BaseType T;

        er::Code getLast(const Dn & dn, Record & r) const;
        er::Code getLast(const DnT<T> & dn, RecordT<H> & r) const;

        er::Code getFirst(const Dn & dn, Record & r) const;
        er::Code getFirst(const DnT<T> & dn, RecordT<H> & r) const;

        er::Code getRecord(const Dn & dn, gl::intint n, Record & r) const;
        er::Code getRecord(const DnT<T> & dn, gl::intint n, RecordT<H> & r) const;

        er::Code getRange(const Dn & dn, gl::intint b, gl::intint e, gl::intint max,
                          gl::intint & would_be_count, vr & r) const;
        er::Code getRange(const DnT<T> & dn, gl::intint b, gl::intint e, gl::intint max,
                          gl::intint & would_be_count, vr & r) const;

        er::Code getLastData(const Dn & dn, gl::intint from, int max, string & data) const;
        er::Code getLastData(const DnT<T> & dn, gl::intint from, int max, string & data) const;

        er::Code load();

        bool isMy(const string & uNorT) const;

        er::Code makeFromPasswd(const string & uN, gl::intint N,
                                const string & rawDn, const string & passwd,
                                const string & data);

        string makeFromPasswdStr(const string & uN, gl::intint N,
                                 const string & rawDn, const string & passwd,
                                 const string & data) const;

        er::Code makeFromURF(const string & uNorT, gl::intint N,
                             const string & hashOrRawDn, const string & keysAndData);

        string getClock() const { return slice.getClock(); }

        void cutIndexAt(const string & sdn, gl::intint N) { index.cutIndexAt(sdn, N); }

    private:
        int getDbSegment(const H & dn) const;

        Slice<H> slice;
        Index<H> index;

        std::set<string> conflicts;
};


} // db

#endif
