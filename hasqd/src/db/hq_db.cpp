// Hasq Technology Pty Ltd (C) 2013-2016

#include "gl_except.h"

#include "hq_db.h"


db::Database::Database(DbCfg c): config(c)
{
}

db::Database::~Database()
{
    size_t sz = dbs.size();

    for ( size_t i = 0; i < sz; i++ ) delete dbs[i];
}

db::Database::vtraits db::Database::getTraits() const
{
    size_t sz = dbs.size();

    std::vector<const Traits *> r;

    for ( size_t i = 0; i < sz; i++ )
    {
        r.push_back( &dbs[i]->traits );
    }

    return r;
}

er::Code db::Database::addRecord(int idx, const Record & r)
{
    return dbs[idx]->addRecord(r);
}

bool db::Database::isvalid(int idx, const Record * r1, const Record * r2 ) const
{
    return ( dbs[idx]->isvalid(r1, r2) == er::OK );
}

void db::Database::conflict(int idx, const string & sdn, bool state)
{
    dbs[idx]->conflict(sdn, state);
}

string db::Database::get1conflict(int idx) const { return dbs[idx]->get1conflict(); }


er::Code db::Database::getLast(int idx, const Dn & dn, Record & r) const
{
    return dbs[idx]->getLast(dn, r);
}

er::Code db::Database::getFirst(int idx, const Dn & dn, Record & r) const
{
    return dbs[idx]->getFirst(dn, r);
}

er::Code db::Database::getRecord(int idx, const Dn & dn, gl::intint n, Record & r) const
{
    return dbs[idx]->getRecord(dn, n, r);
}

er::Code db::Database::getRange(int idx, const Dn & dn, gl::intint b, gl::intint e, gl::intint max,
                                gl::intint & would_be_count, std::vector<Record *> & r) const
{
    return dbs[idx]->getRange(dn, b, e, max, would_be_count, r);
}

er::Code db::Database::initFromDisk()
{
    using namespace os;

    Path dslice(config.dir_slice);

    if ( !dslice.isdir() ) return er::DB_EMPTY;

    Path dindex(config.dir_index);

    if ( !dindex.isdir() )
    {
        db::IndexGenerator ig;
        er::Code code(ig.generate(config.dir_slice.str(), config.dir_index.str()));

        if ( code != er::OK )
        {
            if ( code == er::IG_CANNOT_READ )
                throw gl::ex("Cannot load traits file - possibly corrupted");

            throw gl::ex("Database index regeneration error: " + code.str() + "\n");
        }
    }

    const Dir dslices = FileSys::readDirEx(dslice, true, false);

    const Dir::vs & ds = dslices.dirs;

    for ( size_t i = 0; i < ds.size(); i++ )
    {
        Path p = dslice + ds[i] + config.fil_trait;

        Traits t(*this);

        if ( t.load(p.str()) )
        {
            addSingle(t);
        }
    }

    if ( dbs.empty() ) return er::DB_EMPTY;

    for ( std::vector<Single *>::iterator i = dbs.begin(); i != dbs.end(); ++i )
    {
        er::Code r = (*i)->load();
        if ( r ) return r;
    }

    return er::OK;
}

bool db::Database::eraseDisk() const
{
    bool r1 = true;
    if ( config.dir_index.isdir() ) os::FileSys::erase(config.dir_index);

    bool r2 = true;
    if ( config.dir_slice.isdir() ) os::FileSys::erase(config.dir_slice);

    return r1 && r2;
}


er::Code db::Database::addRecordPwd(const string & uN, gl::intint N,
                                    const string & rawDn, const string & passwd,
                                    const string & data)
{
    for ( std::vector<Single *>::iterator i = dbs.begin(); i != dbs.end(); ++i )
    {
        if ( (*i)->isMy(uN) )
        {
            return (*i)->makeFromPasswd(uN, N, rawDn, passwd, data);
        }
    }

    return er::DB_BAD_DBNAME;
}

er::Code db::Database::addRecordURF(const string & uNorT, gl::intint N,
                                    const string & hashOrRawDn, const string & keysAndData)
{
    for ( std::vector<Single *>::iterator i = dbs.begin(); i != dbs.end(); ++i )
    {
        if ( (*i)->isMy(uNorT) )
        {
            return (*i)->makeFromURF(uNorT, N, hashOrRawDn, keysAndData);
        }
    }

    return er::DB_BAD_DBNAME;
}

string db::Database::makeFromPasswdStr(const string & uN, gl::intint N,
                                       const string & rawDn, const string & passwd,
                                       const string & data)
{
    for ( std::vector<Single *>::iterator i = dbs.begin(); i != dbs.end(); ++i )
    {
        if ( (*i)->isMy(uN) )
        {
            return (*i)->makeFromPasswdStr(uN, N, rawDn, passwd, data);
        }
    }

    return "";
}

er::Code db::Database::getLastRaw(const string & uN, const string & rawDn, string & rec) const
{
    int dbIndex = getDbIndex(uN);

    if ( dbIndex < 0 )
    {
        return er::DB_BAD_DBNAME;
    }

    string hashtype = getTraits(dbIndex)->sn();

    db::Dn * dn = db::Dn::create(hashtype, rawDn, true);
    if ( !dn )
    {
        return er::DB_BAD_DN;
    }

    db::Record * r = db::Record::create(hashtype);
    if ( !r )
    {
        delete dn;
        return er::DB_BAD_HASHTYPE;
    }

    er::Code code = getLast(dbIndex, *dn, *r);

    if ( code == er::OK )
    {
        rec = r->str();
    }

    delete dn;
    delete r;

    return code;
}

er::Code db::Database::getFirstRaw(const string & uN, const string & rawDn, string & rec) const
{
    int dbIndex = getDbIndex(uN);

    if ( dbIndex < 0 )
    {
        return er::DB_BAD_DBNAME;
    }

    string hashtype = getTraits(dbIndex)->sn();

    db::Dn * dn = db::Dn::create(hashtype, rawDn, true);
    if ( !dn )
    {
        return er::DB_BAD_DN;
    }

    db::Record * r = db::Record::create(hashtype);
    if ( !r )
    {
        delete dn;
        return er::DB_BAD_HASHTYPE;
    }

    er::Code code = getFirst(dbIndex, *dn, *r);

    if ( code == er::OK )
    {
        rec = r->str();
    }

    delete dn;
    delete r;

    return code;
}

er::Code db::Database::getRecordRaw(const string & uN, const string & rawDn, gl::intint n, string & rec) const
{
    int dbIndex = getDbIndex(uN);

    if ( dbIndex < 0 )
    {
        return er::DB_BAD_DBNAME;
    }

    string hashtype = getTraits(dbIndex)->sn();

    db::Dn * dn = db::Dn::create(hashtype, rawDn, true);
    if ( !dn )
    {
        return er::DB_BAD_DN;
    }

    db::Record * r = db::Record::create(hashtype);
    if ( !r )
    {
        delete dn;
        return er::DB_BAD_HASHTYPE;
    }

    er::Code code = getRecord(dbIndex, *dn, n, *r);

    if ( code == er::OK )
    {
        rec = r->str();
    }

    delete dn;
    delete r;

    return code;
}

er::Code db::Database::getRangeRaw(const string & uN, const string & rawDn, gl::intint b, gl::intint e,
                                   gl::intint max, gl::intint & would_be_count, string & recs) const
{
    int dbIndex = getDbIndex(uN);

    if ( dbIndex < 0 )
    {
        return er::DB_BAD_DBNAME;
    }

    string hashtype = getTraits(dbIndex)->sn();

    db::Dn * dn = db::Dn::create(hashtype, rawDn, true);
    if ( !dn )
    {
        return er::DB_BAD_DN;
    }

    std::vector<Record *> vr;

    er::Code code = getRange(dbIndex, *dn, b, e, max, would_be_count, vr);

    if ( code == er::OK )
    {
        for ( unsigned int i = 0; i < vr.size(); i++ ) recs += vr[i]->str() + "\n";
    }

    for ( unsigned int i = 0; i < vr.size(); i++ ) delete vr[i];

    return code;
}

er::Code db::Database::getLastDataRaw(const string & uN, const string & rawDn, gl::intint from, int max, string & data) const
{
    int dbIndex = getDbIndex(uN);

    if ( dbIndex < 0 )
    {
        return er::DB_BAD_DBNAME;
    }

    string hashtype = getTraits(dbIndex)->sn();

    db::Dn * dn = db::Dn::create(hashtype, rawDn, true);
    if ( !dn )
    {
        return er::DB_BAD_DN;
    }

    string   s;
    er::Code code = getLastData(dbIndex, *dn, from, max, s);

    if ( code == er::OK )
    {
        data = s;
    }

    delete dn;

    return code;
}

int db::Database::getDbIndex(const string & uNorT) const
{
    int sz = gl::st2i(dbs.size());
    for ( int i = 0; i < sz; i++ )
    {
        if ( dbs[i]->isMy(uNorT) )
        {
            return i;
        }
    }

    return -1;
}

std::vector<string> db::Database::getClocks() const
{
    std::vector<string> r;
    size_t sz = dbs.size();
    for ( size_t i = 0; i < sz; i++  )
    {
        r.push_back( dbs[i]->getClock() );
    }

    return r;
}

db::Record * db::Database::getLast(int idx, const string & sdn) const
{
    const Traits * traits = getTraits(idx);
    if ( !traits ) return 0;

    string hashtype = traits->sn();

    db::Record * record = db::Record::create(hashtype);
    if ( !record ) return 0;

    db::Dn * dn = db::Dn::create(hashtype, sdn, false);
    if ( !dn )
    {
        delete record;
        return 0;
    }

    gl::Remover<db::Dn> rem_dn(dn);

    er::Code e = getLast(idx, *dn, *record);

    if ( e != er::OK )
    {
        delete record;
        return 0;
    }

    return record;
}

db::Record * db::Database::getFirst(int idx, const string & sdn) const
{
    const Traits * traits = getTraits(idx);
    if ( !traits ) return 0;

    string hashtype = traits->sn();

    db::Record * record = db::Record::create(hashtype);
    if ( !record ) return 0;

    db::Dn * dn = db::Dn::create(hashtype, sdn, false);
    if ( !dn )
    {
        delete record;
        return 0;
    }

    gl::Remover<db::Dn> rem_dn(dn);

    er::Code e = getFirst(idx, *dn, *record);

    if ( e != er::OK )
    {
        delete record;
        return 0;
    }

    return record;
}


std::vector<db::Record *> db::Database::getRange(int idx, const string & sdn,
        gl::intint b, gl::intint e, gl::intint max, gl::intint & would_be_count) const
{
    std::vector<Record *> vr;
    const Traits * traits = getTraits(idx);
    if ( !traits ) return vr;

    string hashtype = traits->sn();

    db::Dn * dn = db::Dn::create(hashtype, sdn, false);
    if ( !dn ) return vr;

    gl::Remover<db::Dn> rem_dn(dn);

    er::Code k = getRange(idx, *dn, b, e, max, would_be_count, vr);

    if ( k != er::OK )
        return vr;

    return vr;
}

db::Record * db::Database::getRecord(int idx, gl::intint N, const string & sdn ) const
{
    gl::intint would_be_count;
    std::vector<Record *> vr = getRange(idx, sdn, N, N, 1, would_be_count);

    if ( vr.empty() )
        return 0;

    if ( vr.size() == 1)
        return vr[0];

    throw gl::Never("getRange bad return");
}


er::Code db::Database::getLastData(int idx, const Dn & dn, gl::intint from, int max, string & data) const
{
    return dbs[idx]->getLastData(dn, from, max, data);
}

void db::Database::cutIndexAt(int idx, const string & sdn, gl::intint N)
{
    dbs[idx]->cutIndexAt(sdn, N);
}

