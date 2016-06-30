// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _HQ_DB
#define _HQ_DB

#include <vector>
#include <string>

using std::string;

#include "gl_err.h"

#include "hq_single.h"

namespace db
{

class Database
{
        std::vector<Single *> dbs;

        DbCfg config;

    public:

        const DbCfg * cfg() const { return &config; }

        Database(DbCfg c);
        ~Database();

        er::Code initFromDisk();

        typedef std::vector<const Traits *> vtraits;
        vtraits getTraits() const;

        void conflict(int idx, const string & sdn, bool state); // true-set, false-release
        bool isvalid(int idx, const Record * r1, const Record * r2) const;
        string get1conflict(int idx) const;

        er::Code addRecord(int idx, const Record & r);
        er::Code getLast(int idx, const Dn & dn, Record & r) const;
        er::Code getFirst(int idx, const Dn & dn, Record & r) const;
        er::Code getRecord(int idx, const Dn & dn, gl::intint n, Record & r) const;

        er::Code getRange(int idx, const Dn & dn, gl::intint b, gl::intint e, gl::intint max,
                          gl::intint & would_be_count, std::vector<Record *> & r) const;

        Record * getLast(int idx, const string & sdn) const;
        Record * getFirst(int idx, const string & sdn) const;
        Record * getRecord(int idx, gl::intint n, const string & sdn) const;

        std::vector<Record *> getRange(int idx, const string & sdn, gl::intint b, gl::intint e,
                                       gl::intint max, gl::intint & would_be_count) const;

        er::Code getLastData(int idx, const Dn & dn, gl::intint from, int max, string & data) const;

        void cutIndexAt(int idx, const string & sdn, gl::intint N);

        void addSingle(const Traits & t) { dbs.push_back( Single::create(t) ); }

        bool eraseDisk() const;

        er::Code addRecordPwd(const string & uN, gl::intint N,
                              const string & rawDn, const string & passwd,
                              const string & data);

        er::Code addRecordURF(const string & uNorT, gl::intint N,
                              const string & hashOrRawDn, const string & keysAndData);

        string makeFromPasswdStr(const string & uN, gl::intint N,
                                 const string & rawDn, const string & passwd,
                                 const string & data);

        er::Code getLastRaw(const string & uN, const string & rawDn, string & rec) const;
        er::Code getFirstRaw(const string & uN, const string & rawDn, string & rec) const;

        er::Code getRecordRaw(const string & uN, const string & rawDn,
                              gl::intint n, string & rec) const;

        er::Code getRangeRaw(const string & uN, const string & rawDn, gl::intint b, gl::intint e, gl::intint max,
                             gl::intint & would_be_count, string & recs) const;

        er::Code getLastDataRaw(const string & uN, const string & rawDn, gl::intint from, int max, string & data) const;

        const Traits * getTraits(const string & uN) const { return getTraits(getDbIndex(uN)); }
        const Traits * getTraits(int i) const { return i < 0 ? 0 : &dbs[i]->traits; }

        int getDbIndex(const string & uNorT) const;

        std::vector<string> getClocks() const ;
};

} // db

#endif
