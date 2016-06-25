// Hasq Technology Pty Ltd (C) 2013-2015

#include <sstream>

#include "gl_utils.h"

#include "sg_cout.h"
#include "sg_mutex.h"
#include "sg_client.h"

#include "hq_connector.h"

void Connector::update_neighbours()
{
    take_care_of_hints();
    populate_neighbours();
}

Connector::TalkStatus Connector::talk_ip(const string & ipport, const string & cmd, string & r)
{
    sgl::Client c(gs->config->netLimits, ipport);
    if ( !c.isok() )
        return Dead;

    r = c.ask(cmd);

    // Linux returns connected on localhost even if server is down, but reply is empty on error
    if ( r.empty() )
        return Dead;

    if ( r.size() >= 2 && r.substr(0, 2) == "OK" ) {}
    else if ( r == "DISABLED" )
        return Dead;
    else
        return ReplyErr;

    return ReplyOk;
}

Connector::TalkStatus Connector::talk(Connection & ctn, const string & cmd, string & r)
{
    Connector::TalkStatus k = talk_ip(ctn.ipport, cmd, r);
    if ( k == Dead || k == ReplyErr ) ctn.failed();
    else ctn.alive();

    return k;
}

bool Connector::isaliveName(const string & ipport, string & name)
{
    string r;

    TalkStatus k = talk_ip(ipport, "info id", r);
    if ( k != ReplyOk ) return false;
    std::istringstream in(r);
    in >> name >> name;
    return true;
}

bool Connector::isalivePing(const string & ipport)
{
    string r;
    TalkStatus k = talk_ip(ipport, "ping", r);
    if ( k != ReplyOk ) return false;
    return true;
}

void Connector::take_care_of_hints()
{

    while (1)
    {
        string ipport;

        bool hasone = false;

        {
            ConArea & ca = gs->conArea;
            sgl::Mutex mtx(ca.access2conArea);
            std::vector<Connection> & hints = ca.hints;

            if ( hints.empty() )
                return;

            Connection & con = hints.back();

            if ( gl::isin(ca.neighbours, con) ) hasone = true;
            else
            {
                const Connection * p = gl::findin(ca.otherfamily, con);
                if ( p && p->isAlive() )
                    hasone = true;
            }

            ipport = con.ipport;
            hints.pop_back();
        } // release

        if (hasone) continue;

        string name;
        if ( !isaliveName(ipport, name) )
        {
            gs->logger.add(Logger::Connect, "Conn hint dead: " + ipport);
            continue;
        }

        if ( name == gs->config->nodename )
        {
            gs->logger.add(Logger::Connect, "Conn hint self: " + ipport);
            continue;
        }

        {
            ConArea & ca = gs->conArea;
            sgl::Mutex mtx(ca.access2conArea);
            std::vector<Connection> & pot = ca.otherfamily;
            if ( pot.size() >= ca.max_otherfamily )
            {
                gs->logger.add(Logger::Overflow, "family" );
                continue;
            }

            Connection nc(ipport, name);
            Connection * pc = gl::findin(pot, nc);
            if ( !pc )
                pot.push_back(nc);
            else
                pc->alive();

            pc = gl::findin(pot, nc);
            if ( !pc ) throw gl::Never(__FUNCTION__);

            if ( gl::isin(gs->config->ipp_locks, ipport) )
                pc->locked = true;
        } // release

    }
}

void Connector::populate_neighbours()
{
    {
        ConArea & ca = gs->conArea;
        sgl::Mutex mtx(ca.access2conArea);
        std::vector<Connection> & pot = ca.otherfamily;

        if ( pot.empty() )
            return;

        std::vector<Connection> & clo = ca.neighbours;

        if ( clo.size() >= ca.max_neighbours )
            return;

        for ( size_t i = 0; i < pot.size(); i++ )
        {
            const Connection & c = pot[i];

            if ( !c.isAlive() )
                continue;

            if ( !gl::isin(clo, c) )
                clo.push_back(c);

            for ( size_t j = i + 1; j < pot.size(); j++ )
                pot[j - 1] = pot[j];

            pot.pop_back();
        }
    } // release
}


void Connector::sendNotification(const string & dbname, gl::intint N, const string & sdn)
{
    std::vector<Connection> nbs = getNbs_safe();
    for ( std::vector<Connection>::size_type i = 0; i < nbs.size(); i++ )
    {
        string cmd = "note " + dbname + " " + gl::tos(N)
                     + " " + sdn + " " + gs->config->nodename;

        string r;
        talk(nbs[i], cmd, r);
        updateNbs_safe(nbs[i]);

        if ( r.empty() )
            gs->logger.add(Logger::Connect, "Connector: notify fails on " + nbs[i].ipport);

        if ( r != "OK" )
            gs->logger.add(Logger::Connect, "Connector: notify " + nbs[i].ipport + "->[" + r + "]");
    }
}

void Connector::sendNotification(int idx, gl::intint N, const string & sdn)
{
    db::Database & db = gs->database;
    sendNotification(db.getTraits(idx)->getAltName(), N, sdn);
}

er::Code Connector::notificationReceived(int idx,
        gl::intint N, const string & sdn, const string & from)
{
    db::Database & db = gs->database;
    string hashtype = db.getTraits(idx)->sn();

    db::Record * record = db::Record::create(hashtype);
    if ( !record )
        return er::REQ_HASHTYPE_BAD;

    gl::Remover<db::Record> rem_record(record);

    db::Dn * dn = db::Dn::create(hashtype, sdn, false);
    if ( !dn )
        return er::REQ_DN_BAD;

    gl::Remover<db::Dn> rem_dn(dn);

    er::Code k = db.getLast(idx, *dn, *record);

    gl::intint ik = 0; --ik;
    if ( k == er::OK ) ik = record->n();

    if ( N <= ik )
        return er::OK;  // uptodate

    for ( ++ik; ik <= N; ++ik )
    {

        db::Record * newrec = trygetrec(db.getTraits(idx)->getAltName(), ik, sdn, from);
        if ( !newrec )
        {
            gs->logger.add(Logger::Connect, "Connector: no match on notify: " + sdn);
            return er::OK;
        }

        // [CONFLICT:NCHK]
        if ( k == er::OK && ik == record->n() + 1 )
        {
            if ( !db.isvalid(idx, record, newrec) )
            {
                // [CONFLICT:CSET]
                db.conflict(idx, sdn, true);

                // [CONFLICT:ISVT]
                gs->svtArea.addJob_safe( SvtJob(gs, SvtJob::SetConfl, idx ) );

                // [CONFLICT:CSND]
                sendConflict(idx, sdn);

                gs->logger.add(Logger::Conflict, "Conflict on: " + sdn + " idx=" + gl::tos(idx));
                delete newrec;
                return er::DN_CONFLICT;
            }
        }

        CedArea::pcii kk = gs->cedArea.addJob_safe(newrec, idx);
        if ( kk.first == er::CE_QUE_OVERFLOW )
            gs->logger(Logger::Overflow, "Connector: update: " + sdn);

        if ( kk.first )
            return kk.first;
    }

    return er::OK;
}

er::Code Connector::notificationReceived(const string & dbname,
        gl::intint N, const string & sdn, const string & from)
{
    db::Database & db = gs->database;
    int idx = db.getDbIndex(dbname);

    if ( idx < 0 )
        return er::REQ_HASHTYPE_BAD;

    return notificationReceived(idx, N, sdn, from);
}

db::Record * Connector::trygetrec(Connection & con,
                                  const string & dbname, gl::intint N, const string & sdn)
{
    string r;
    string cmd = "record " + dbname + " " + gl::tos(N) + " " + sdn;

    const string & ipport = con.ipport;

    TalkStatus ts = talk(con, cmd, r);
    if ( r.size() < 5 )
    {
        gs->logger.add(Logger::Connect, "trygetrec1 received [" + r + "] from " + ipport);
        return 0;
    }

    if ( ts != ReplyOk )
        return 0;

    std::istringstream is(r.substr(3));

    const db::Traits * tr = gs->database.getTraits(dbname);
    if ( !tr )
    {
        gs->logger.add(Logger::Connect, "trygetrec2 received [" + r + "] from " + ipport);
        return 0;
    }

    db::Record * rec = db::Record::create( tr->sn() );

    if (!rec) throw gl::Never("trygetrec3 Record::create " + tr->sn());

    er::Code k = rec->init(is, tr->nG());

    if ( k )
    {
        gs->logger.add(Logger::Connect, "trygetrec4 received [" + r + "] from " + ipport);
        return 0;
    }

    if ( rec->n() == N )
        return rec;

    gs->logger.add(Logger::Connect, "XXX trygetrec received [" + r + "] N=" + gl::tos(N) );
    return 0;
}

db::Record * Connector::trygetrec(const string & dbname, gl::intint N,
                                  const string & sdn, const string & from)
{

    Connection cfrom = findInFamByName_safe(from);
    if ( !cfrom.ipport.empty() )
    {
        db::Record * r = trygetrec(cfrom, dbname, N, sdn);
        updateFam_safe(cfrom);
        if ( r ) return r;
    }

    std::vector<Connection> nbs = getNbs_safe();

    for ( std::vector<Connection>::size_type i = 0; i < nbs.size(); i++ )
    {
        db::Record * r = trygetrec(nbs[i], dbname, N, sdn);
        updateNbs_safe(nbs[i]);
        if ( r ) return r;
    }

    return 0;
}

void Connector::assignNeighbour(const string & ipport)
{
    string name;
    if ( !isaliveName(ipport, name) )
        return;

    Connection c(ipport, name);
    c.locked = true;
    c.alive();

    {
        ConArea & ca = gs->conArea;
        sgl::Mutex mtx(ca.access2conArea);
        ca.neighbours.push_back(c);
    } // release
}


std::vector<Connection> Connector::getNbs_safe()
{
    std::vector<Connection> nbs;
    {
        ConArea & ca = gs->conArea;
        sgl::Mutex mtx(ca.access2conArea);
        nbs = ca.neighbours;
    } // release

    return nbs;
}

std::vector<Connection> Connector::getFamily_safe()
{
    std::vector<Connection> fam;
    {
        ConArea & ca = gs->conArea;
        sgl::Mutex mtx(ca.access2conArea);
        fam = ca.neighbours;
        const std::vector<Connection> & p = ca.otherfamily;
        fam.insert( fam.end(), p.begin(), p.end() );
    } // release

    return fam;
}

void Connector::updateCon(const Connection & c, std::vector<Connection> & nbs)
{
    for ( size_t i = 0; i < nbs.size(); i++ )
    {
        if ( nbs[i] == c )
        {
            if ( c.isAlive() )
                nbs[i].alive();
            else
                nbs[i].failed();
        }
    }
}

void Connector::updateNbs_safe(const Connection & c)
{
    ConArea & ca = gs->conArea;
    sgl::Mutex mtx(ca.access2conArea);
    std::vector<Connection> & nbs = ca.neighbours;

    updateCon(c, nbs);
    // release mutex
}


void Connector::unlinkNbs_safe(const Connection & c)
{
    ConArea & ca = gs->conArea;
    sgl::Mutex mtx(ca.access2conArea);

    std::vector<Connection> & nbs = ca.neighbours;

    std::vector<Connection> newnbs;

    for ( size_t i = 0; i < nbs.size(); i++ )
    {
        if ( nbs[i] == c ) continue;
        newnbs.push_back(nbs[i]);
    }

	nbs.swap(newnbs);


    std::vector<Connection> & fam = ca.otherfamily;

    std::vector<Connection> newfam;

    for ( size_t i = 0; i < fam.size(); i++ )
    {
        if ( fam[i] == c ) continue;
        newfam.push_back(fam[i]);
    }

	fam.swap(newfam);

    // release mutex
}

void Connector::updateFam_safe(const Connection & c)
{
    ConArea & ca = gs->conArea;
    sgl::Mutex mtx(ca.access2conArea);
    std::vector<Connection> & nbs = ca.neighbours;
    std::vector<Connection> & pot = ca.otherfamily;

    updateCon(c, nbs);
    updateCon(c, pot);
    // release mutex
}

void Connector::sendConflict(const string & dbname, const string & sdn)
{
    std::vector<Connection> nbs = getNbs_safe();
    string r;

    for ( std::vector<Connection>::size_type i = 0; i < nbs.size(); i++ )
    {
        string cmd = "conflict " + dbname + " " + sdn;

        talk(nbs[i], cmd, r);
    }
}

void Connector::sendConflict(int idx, const string & sdn)
{
    db::Database & db = gs->database;
    sendConflict(db.getTraits(idx)->getAltName(), sdn);
}

std::vector<db::Record *> Connector::getRangeFrom(
    const string & ipport, int idx,
    const string & sdn, gl::intint beg,
    gl::intint end, bool * alive)
{
    db::Database & db = gs->database;
    const string & dbname = db.getTraits(idx)->getAltName();

    string cmd = "range " + dbname + " " + gl::tos(beg)
                 + " " + gl::tos(end) + " " + sdn;

    string rs;

    string typ = db.getTraits(idx)->sn();

    std::vector<db::Record *> v;

    if ( talk_ip(ipport, cmd, rs) == Dead )
    {
        if (alive) *alive = false;
        return v;
    }

    if (alive) *alive = true;

    if ( talk_ip(ipport, cmd, rs) == ReplyErr )
        return v;

    std::istringstream is(rs);

    string line;
    std::getline(is, line); // get ok

    while (1)
    {
        std::getline(is, line);
        size_t sz = line.size();
        if ( sz < 2 || !is ) break;
        if ( line[sz - 1] == '\r' ) line.resize(sz - 1);

        db::Record * r = db::Record::create(typ);
        er::Code e = r->init(line, db.getTraits(idx)->nG());

        if ( e != er::OK )
        {
            gs->logger(Logger::Critical, "Connector::getRange bad reply from " + ipport);
            return std::vector<db::Record *>();
        }

        v.push_back(r);
    }

    return v;
}

void Connector::checkConflict(int idx, const string & sdn)
{
    db::Database & db = gs->database;
    const db::Traits * tr = db.getTraits(idx);
    if ( !tr ) return;
    const string & hashtype = tr->sn();
    const string & dbname = tr->getAltName();

    db::Record * last_record =  db.getLast(idx, sdn);
    if ( !last_record ) return;

    gl::Remover<db::Record> rem_record_515(last_record);

    gl::intint lN = last_record->n();

    std::vector<Connection> nbs = getNbs_safe();
    string r;

    for ( std::vector<Connection>::size_type i = 0; i < nbs.size(); i++ )
    {
        string cmd = "record " + dbname + " " + gl::tos(lN) + " " + sdn;

        const string & ipport = nbs[i].ipport;

        TalkStatus ts = talk(nbs[i], cmd, r); // assume that only Servant does this - hence thread safe

        if ( ts == Dead )
            continue;

        if ( ts == ReplyErr )
        {
            // hmm at this point we did not get proper reply
            // this however may be when out chain is longer
            cmd = "last " + dbname + " " + sdn;
            ts = talk(nbs[i], cmd, r);
            if ( ts != ReplyOk )
                continue; // last did not work either - fuck it
        }

        if ( r.size() < 5 )
        {
            gs->logger.add(Logger::Connect, "checkConflict [" + r + "] from " + ipport);
            continue;
        }

        std::istringstream is(r.substr(3));

        db::Record * nbrec = db::Record::create( hashtype );
        gl::Remover<db::Record> rem_record_552(nbrec);

        if (!nbrec) throw gl::Never("checkConflict Record::create " + hashtype);

        er::Code k = nbrec->init(is, tr->nG());

        gl::intint rN = nbrec->n();
        if ( k || rN > lN )
        {
            gs->logger.add(Logger::Connect, "checkConflict received [" + r + "] from " + ipport);
            continue;
        }

        db::Record * rec_2chk = last_record;

        db::Record * intl_record = 0;
        if ( rN < lN )
        {
            intl_record = db.getRecord(idx, rN, sdn);
            if ( !intl_record ) continue;

            rec_2chk = intl_record;
        }

        gl::Remover<db::Record> rem_record_576(intl_record);

        if ( !nbrec->same(rec_2chk, true) )
        {
            // it is really a conflict
            db.conflict(idx, sdn, true);

            // [CONFLICT:ISVT]
            gs->svtArea.addJob_safe( SvtJob(gs, SvtJob::SetConfl, idx ) );

            // [CONFLICT:CSND]
            sendConflict(idx, sdn);

            gs->logger.add(Logger::Conflict, "checkConflict: " + sdn);
            return;
        }

    }
}

std::vector<Connector::FamNode> Connector::askFamNodes(Connection & ctn)
{
    string r;

    TalkStatus ts = talk(ctn, "info fam", r);

    std::vector<FamNode> famNodes;

    if ( ts == Dead ) return famNodes;
    if ( ts != ReplyOk )
    {
        gs->logger.add(Logger::Connect, "askFamNodes bad reply [" + r + "]");
        return famNodes;
    }

    string line;
    std::istringstream inr(r);
    std::getline(inr, line); // get OK
    while (1)
    {
        std::getline(inr, line);
        if ( !inr ) break;

        std::istringstream inl(line);

        string name, ip, nf, da, lu;
        inl >> name >> ip >> nf >> da >> lu;

        FamNode fn;
        Connection & con = fn.connection;
        con.name = name;
        con.ipport = ip;

        if ( nf == "N" ) fn.neighbour = true;
        else if ( nf == "F" ) fn.neighbour = false;
        else
        {
            gs->logger.add(Logger::Connect, "askFamNodes unexpected NF [" + line + "]");
            continue;
        }

        if ( da == "D" ) fn.dead = true;
        else if ( da == "A" ) fn.dead = false;
        else
        {
            gs->logger.add(Logger::Connect, "askFamNodes unexpected DA [" + line + "]");
            continue;
        }

        famNodes.push_back(fn);
    }

    return famNodes;
}


Connection Connector::findInFamByName_safe(const string & name)
{
    std::vector<Connection> nbs = getFamily_safe();

    for ( size_t i = 0; i < nbs.size(); i++ )
        if ( nbs[i].name == name ) return nbs[i];

    return Connection();
}

