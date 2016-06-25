// Hasq Technology Pty Ltd (C) 2013-2015

#include <sstream>
#include <algorithm>

#include "gl_utils.h"
#include "gl_err.h"

#include "os_sysinfo.h"
#include "sg_mutex.h"
#include "sg_cout.h"
#include "sg_client.h"

#include "hq_hash.h"
#include "hq_platform.h"

#include "hq_wkrtask.h"
#include "hq_plebfile.h"
#include "hq_connector.h"


string Worker2::process(bool * recog)
{
    bool en = encrypted;

    if ( gs->keyArea.empty() ) en = true; // allow encrypted if no keys

    if ( recog ) *recog = true;

    if ( !tok.next() ) return er::Code(er::REQ_EMPTY_MSG);

    gs->activity.push(tok.c_str()[0]);

    const cfg::PublicNetCmd & pn = gs->config->publicNetCmd;

    if ( tok.is("admin") && (en || pn.admin) )
        return admin();

    if ( gs->netdisabled )
        return er::Code(er::DISABLED);

    if ( ( tok.is("ping") || tok.is("p") ) && (en || pn.ping) )
        return er::Code(er::OK);

    else if ( ( tok.is("info") || tok.is("i") ) && (en || pn.info) )
        return info();

    else if ( ( tok.is("job") || tok.is("j") ) && (en || pn.job) )
        return job();

    else if ( ( tok.is("add") || tok.is("a") ) && (en || pn.add) )
        return add(false);

    else if ( ( tok.is("zero") || tok.is("z") ) && (en || pn.zero) )
        return zero();

    else if ( ( tok.is("last") || tok.is("l") ) && (en || pn.last) )
        return record(true, false, false);

    else if ( tok.is("first") && (en || pn.first) )
        return record(true, false, true);

    else if ( ( tok.is("record") || tok.is("r") ) && (en || pn.record) )
        return record(false, false, false);

    else if ( ( tok.is("data") || tok.is("d") ) && (en || pn.data) )
        return record(true, true, false);

    else if ( tok.is("lastdata") && (en || pn.lastdata) )
        return lastdata();

    else if ( tok.is("range")  && (en || pn.range) )
        return range();

    else if ( tok.is("debug") || tok.is("x") )
        return er::Code(er::NOT_IMPLEMENTED);

    else if ( tok.is("error") || tok.is("e") )
        return er::Code(er::OK);

    else if ( tok.is("slice") || tok.is("s") )
        return er::Code(er::OK);

    else if ( ( tok.is("list") || tok.is("t") ) && (en || pn.list) )
        return er::Code(er::OK);

    else if ( ( tok.is("conflict") || tok.is("k") ) && (en || pn.conflict) )
        return conflict();

    else if ( ( tok.is("file") || tok.is("f") ) && (en || pn.file) )
        return file(false, true);

    else if ( ( tok.is("html") || tok.is("h") ) && (en || pn.html) )
        return file(true, true);

    else if ( ( tok.is("connect") || tok.is("c") ) && (en || pn.connect) )
        return conn();

    else if ( ( tok.is("unlink") || tok.is("u") ) && (en || pn.unlink) )
        return conn();

    else if ( ( tok.is("note") || tok.is("n") ) && (en || pn.note) )
        return note();

    else if ( tok.is("quit")  && (en || pn.quit) )
        return quit();

    else if ( tok.is("proxy")  && (en || pn.proxy) )
        return proxy();

    else if ( tok.is("pleb")  && (en || pn.pleb) )
        return pleb();

    else if ( ( tok.c_str()[0] == '/' )  && (en || pn.file) )
        return file(true, false);

    if ( recog ) *recog = false;

    return er::Code(er::REQ_MSG_HEAD);
}

string Worker2::info()
{
    if ( !tok.next() ) return er::Code(er::REQ_MSG_BAD);

    if ( tok.is("db") )
        return info_db();

    else if ( tok.is("nbs") )
        return info_nbs();

    else if ( tok.is("fam") )
        return info_fam();

    else if ( tok.is("sys") )
        return info_sys();

    else if ( tok.is("id") )
        return info_id();

    else if ( tok.is("log") )
        return info_log();

    return er::Code(er::REQ_MSG_BAD);
}

string Worker2::info_db()
{
    db::Database & db = gs->database;

    db::Database::vtraits vt = db.getTraits();

    size_t sz = vt.size();

    string r = er::Code(er::OK).str() + gl::CRLF;

    for ( size_t i = 0; i < sz; i++ )
        r += vt[i]->str();

    return r;
}

string Worker2::info_nbs()
{
    string r = er::Code(er::OK).str() + gl::CRLF;

    ConArea & ca = gs->conArea;
    sgl::Mutex mutex_ca(ca.access2conArea);

    std::vector<Connection> v = ca.neighbours;

    std::sort(v.begin(), v.end() );

    for ( size_t i = 0; i < v.size(); i++ )
        r += v[i].ipport + gl::CRLF;

    return r;
}

string Worker2::info_fam()
{
    string rt = er::Code(er::OK).str() + gl::CRLF;

    ConArea & ca = gs->conArea;
    sgl::Mutex mutex_ca(ca.access2conArea);

    std::vector<Connection> v1 = ca.neighbours;
    std::vector<Connection> v2 = ca.otherfamily;

    struct A
    {
        string f(std::vector<Connection> & v, bool nb)
        {
            string r;

            std::sort(v.begin(), v.end() );

            for ( size_t i = 0; i < v.size(); i++ )
            {
                string n = v[i].name;
                if ( n.empty() ) n = "<unknown>";
                r +=
                    n
                    + " " + v[i].ipport
                    + " " + (nb ? "N" : "F")
                    + " " + (v[i].dead ? "D" : "A")
                    + " " + (v[i].locked ? "L" : "U")
                    + gl::CRLF;
            }
            return r;
        }

    } a;

    return rt + a.f(v1, true) + a.f(v2, false);
}


string Worker2::info_sys()
{
    string r = er::Code(er::OK).str() + gl::CRLF;

    os::Info info;

    std::stringstream os;
    os << "Dsk usg: " << info.diskUseMb << " M" << gl::CRLF;
    os << "Dsk tot: " << info.diskTotMb << " M" << gl::CRLF;
    os << "Mem usg: " << info.memUseMb << " M" << gl::CRLF;
    os << "Mem tot: " << info.memTotMb << " M" << gl::CRLF;
    os << "Cpu load: " << gs->cpu_load << " %" << gl::CRLF;
    r += os.str();

    return r;
}

string Worker2::info_id()
{
    string r = er::Code(er::OK).str() + gl::CRLF;

    r += gs->config->nodename + gl::CRLF;

    // family name
    r += "Family: [" + gs->config->family + "]" + gl::CRLF;

    // product version
    r += "Version: " VERSION; r += gl::CRLF;

    // hased shared keys
    std::vector<string> skeys = gs->keyArea.showSkcKeys(true);
    r += "SkcKeys: " + gl::tos(skeys.size()) + gl::CRLF;
    for ( size_t i = 0; i < skeys.size(); i++ )
        r += skeys[i] + gl::CRLF;

    // public keys
    r += "PublicKey: " + gs->keyArea.showPkcKey() + gl::CRLF;

    return r;
}

string Worker2::info_log()
{
    if ( !tok.next() ) return er::Code(er::REQ_MSG_BAD);

    Logger::MsgType mtype;

    if ( tok.is("connect") )
        mtype = Logger::Connect;

    else if ( tok.is("critical") )
        mtype = Logger::Critical;

    else if ( tok.is("conflict") )
        mtype = Logger::Conflict;

    else
        return er::Code(er::REQ_MSG_BAD);

    string r = er::Code(er::OK).str() + gl::CRLF;

    Logger & lg = gs->logger;
    std::vector<string> v;
    lg.get(mtype, v);

    for ( size_t i = 0; i < v.size(); i++ )
        r += v[i] + gl::CRLF;

    return r;
}

string Worker2::job()
{
    if ( !tok.next() ) return er::Code(er::REQ_JOBID_BAD);

    gl::intint jid = gl::toii(tok.sub());

    BinArea & ba = gs->binArea;
    sgl::Mutex mutex_ba(ba.access2binArea);

    er::Code x = ba.queue.getStatus(jid);
    return x;
}

string Worker2::zero()
{
    // check zeroLimit as a short cut to avoid mutex call
    if (!encrypted && gs->config->zeroLimit >= 0 )
    {
        WkrArea & wa = gs->wkrArea;
        sgl::Mutex mutex_wa(wa.mutex);
        ZeroPolicy & z = wa.policy;

        if ( !z.request(sock) )
            return er::Code(er::REQ_ZERO_POLICY);
    }

    return add(true);
}

string Worker2::add(bool zr)
{
    if ( !tok.next() ) return er::Code(er::REQ_HASHTYPE_BAD);
    string signature = tok.sub();
    if ( signature == "*" ) signature.clear();

    if ( !tok.next() ) return er::Code(er::REQ_HASHTYPE_BAD);
    string hashtype = tok.sub();

    int dbIndex = gs->database.getDbIndex(hashtype);
    if ( dbIndex < 0 )
        return er::Code(er::REQ_HASHTYPE_BAD);

    const db::Traits * traits = gs->database.getTraits(dbIndex);

    hashtype = traits->sn();
    db::Record * record = db::Record::create(hashtype);
    if ( !record )
        return er::Code(er::REQ_HASHTYPE_BAD);

    er::Code rec_init = record->init(tok.end(), traits->nG(), traits->mag());

    if ( rec_init )
    {
        delete record;
        return rec_init;
    }

    // add to ce_queue
    // 0 check signature
    // 1 get mutex
    // 2 place job
    // 3 trasfer record
    // 4 semaphore ce
    // 5 place note in bin
    // 6 leave

    if( !zr && record->n()==0 )
       return er::Code(er::REQ_ADD_ZERO);

    if ( !record->checkSign(signature) )
    {
        delete record;
        return er::Code(er::REQ_BAD_SIGN);
    }

    gl::intint job_submitted_id;
    {
        CedArea::pcii k = gs->cedArea.addJob_safe(record, dbIndex);
        if ( k.first ) return k.first;
        job_submitted_id = k.second;
        record = 0; // now record is owned by ceQueue
    }

    BinArea & ba = gs->binArea;
    sgl::Mutex mutex_ba(ba.access2binArea);

    ba.queue.addJobId(job_submitted_id);
    return er::Code(er::OK).str() + " " + gl::tos(job_submitted_id);

}

string Worker2::record(bool last, bool dat, bool first)
{
    string hashtype, sdn;
    gl::intint n = -1ll;

    if ( !tok.next() ) return er::Code(er::REQ_HASHTYPE_BAD);
    hashtype = tok.sub();

    if ( !last )
    {
        if ( !tok.next() ) return er::Code(er::REQ_REC_BAD);
        n = gl::toii(tok.sub());
    }

    if ( !tok.next() ) return er::Code(er::REQ_DN_BAD);
    sdn = tok.sub();

    int dbIndex = gs->database.getDbIndex(hashtype);

    if ( dbIndex < 0 )
        return er::Code(er::REQ_HASHTYPE_BAD);

    hashtype = gs->database.getTraits(dbIndex)->sn();

    db::Record * record = db::Record::create(hashtype);
    if ( !record )
        return er::Code(er::REQ_HASHTYPE_BAD);
    gl::Remover<db::Record> rem_record(record);

    db::Dn * dn = db::Dn::create(hashtype, sdn, false);
    if ( !dn )
        return er::Code(er::REQ_DN_BAD);
    gl::Remover<db::Dn> rem_dn(dn);

    er::Code k = fetchRecord(dbIndex, dn, n, first, record);

    if (k)
        return k;

    string r;
    if ( dat )
    {
        r = record->data();

        if ( r.empty() )
            return er::Code(er::OK).str();
    }
    else
        r = record->str();

    return er::Code(er::OK).str() + " " + r;
}

string Worker2::lastdata()
{
    string hashtype, sdn, from, data;

    if ( !tok.next() ) return er::Code(er::REQ_HASHTYPE_BAD);
    hashtype = tok.sub();

    if ( !tok.next() ) return er::Code(er::REQ_DN_BAD);
    sdn = tok.sub();

    if ( !tok.next() ) return er::Code(er::REQ_N_BAD);
    from = tok.sub();

    int dbIndex = gs->database.getDbIndex(hashtype);

    if ( dbIndex < 0 )
        return er::Code(er::REQ_HASHTYPE_BAD);

    hashtype = gs->database.getTraits(dbIndex)->sn();

    db::Dn * dn = db::Dn::create(hashtype, sdn, false);
    if ( !dn )
        return er::Code(er::REQ_DN_BAD);
    gl::Remover<db::Dn> rem_dn(dn);

    er::Code k = gs->database.getLastData(dbIndex, *dn, gl::toii(from), gs->config->lastdataMax, data);

    if (k)
        return k;

    return er::Code(er::OK).str() + " " + data;
}

string Worker2::range()
{
    string hashtype, sdn;
    gl::intint begin = 0, end = 0;

    if ( !tok.next() ) return er::Code(er::REQ_HASHTYPE_BAD);
    hashtype = tok.sub();
    if ( !tok.next() ) return er::Code(er::REQ_RANGE_BAD);
    begin = gl::toii(tok.sub());
    if ( !tok.next() ) return er::Code(er::REQ_RANGE_BAD);
    end = gl::toii(tok.sub());
    if ( !tok.next() ) return er::Code(er::REQ_DN_BAD);
    sdn = tok.sub();

    int dbIndex = gs->database.getDbIndex(hashtype);

    if ( dbIndex < 0 )
        return er::Code(er::REQ_HASHTYPE_BAD);

    hashtype = gs->database.getTraits(dbIndex)->sn();

    db::Dn * dn = db::Dn::create(hashtype, sdn, false);
    if ( !dn )
        return er::Code(er::REQ_DN_BAD);

    db::Database & db = gs->database;

    std::vector<db::Record *> records;
    gl::intint would_be_count;

    int rmax = gs->config->rangeMax;

    if (encrypted)
        rmax = 0;

    er::Code k = db.getRange(dbIndex, *dn, begin, end,
                             rmax, would_be_count, records);

    delete dn;

    if (k)
    {
        if ( gs->config->dbg.wkr )
        {
            string pr = os::prmpt("wkr", gs->config->dbg.id);
            os::Cout() << pr << "Getrange error [" << sdn
                       << "] -> " << k.str() << os::endl;
        }
        return k;
    }

    typedef std::vector<db::Record *>::size_type vri;

    vri sz = records.size();
    if ( gs->config->dbg.wkr )
        os::Cout() << os::prmpt("wkr", gs->config->dbg.id) << "range OK [" << sz << "]" << os::endl;

    string r;

    for ( vri i = 0; i < sz; i++ )
    {
        r += records[i]->str() + gl::CRLF;
        delete records[i];
    }

    return er::Code(er::OK).str() + " " + gl::tos(would_be_count) + gl::CRLF + r;
}

er::Code Worker2::fetchRecord(int dbIndex, db::Dn * dn, gl::intint n, bool first, db::Record * record)
{
    db::Database & db = gs->database;
    er::Code k = er::OK;

    if ( first )
        k = db.getFirst(dbIndex, *dn, *record);
    else if ( n == -1 )
        k = db.getLast(dbIndex, *dn, *record);
    else
        k = db.getRecord(dbIndex, *dn, n, *record);

    if (k)
    {
        if ( gs->config->dbg.wkr )
            os::Cout() << os::prmpt("wkr", gs->config->dbg.id)
                       << "No such record [ "
                       << "dbidx=" << dbIndex << ' '
                       << dn->str() << ' ' << gl::ii2i(n)
                       << " ] -> " << k.str() << os::endl;

        return k;
    }

    if ( gs->config->dbg.wkr )
        os::Cout() << os::prmpt("wkr", gs->config->dbg.id)
                   << "Record fetched [" << record->str() << "]" << os::endl;

    return er::OK;

}

string Worker2::file(bool html, bool arg)
{
    if ( arg )
    {
        if ( !tok.next() )
            return er::Code(er::REQ_FILE_BAD);
    }

    string file = tok.sub();

    if ( file.find("./") != string::npos
            || file.find("/.") != string::npos
            || file.find("\\.") != string::npos
            || file.find(".\\") != string::npos )
        return er::Code(er::REQ_FILE_BAD);

    os::Path path;
    if ( gs->config->webRoot.empty() )
        path = gs->config->dbcfg.dir_slice;
    else
        path = gs->config->webRoot;

    if (html) goto html_label;

    path += file;

    if ( path.isfile() )
        goto serve_file;

    if ( path.isdir() && gs->config->listDir )
    {
        os::Dir dir = os::FileSys::readDirEx(path, true, true);
        string r = er::Code(er::OK).str() + gl::CRLF;

        for ( size_t i = 0; i < dir.dirs.size(); i++ )
            r += dir.dirs[i] + gl::CRLF;

        for ( size_t i = 0; i < dir.files.size(); i++ )
            r += dir.files[i].first + gl::CRLF;

        return r;
    }

    return er::Code(er::REQ_PATH_BAD);

html_label:
    {

        bool isdir = false;
        string::size_type lastpos = file.size() - 1;

        if ( file[ lastpos ] == '/' )
        {
            isdir = true;
            path += file.substr(0, lastpos);
        }
        else
            path += file;

        if ( !isdir && path.isfile() )
            goto serve_file;

        else if ( isdir && path.isdir() && gs->config->listDir )
        {
            os::Dir dir = os::FileSys::readDirEx(path, true, true);
            string r = "<html><head><title>" LOGO "</title></head><body><h2>" LOGO "</h2><ul>\n";
            for ( size_t i = 0; i < dir.dirs.size(); i++ )
            {
                r += "<li><a href=\"" + dir.dirs[i] + "/\">" + dir.dirs[i] + "/</a></li>\n";
            }
            for ( size_t i = 0; i < dir.files.size(); i++ )
            {
                r += "<li><a href=\"" + dir.files[i].first + "\">" + dir.files[i].first + "</a></li>\n";
            }
            r += "</ul></body></html>";

            *mime = "text/html";
            return r;
        }

        return er::Code(er::REQ_PATH_BAD);

    }

serve_file:
    file = path.str();

    if (mime)
    {
        gl::Pmd pmd;
        pmd.resolveMime(file);
        *mime = pmd.mime;     // safe because pmd.mime points to statically allocated c-string
    }

    return gl::file2str(path.str());

}

string Worker2::conn()
{
    if ( !tok.next() ) return er::Code(er::REQ_CON_BAD);

    const string & ipport = tok.sub();

    if ( ipport.find(":") == string::npos )
        return er::Code(er::REQ_CON_BAD);

    er::Code k = gs->conArea.addHint_safe(ipport);
    if ( k )
    {
        gs->logger.add(Logger::Overflow, "Connection hints");
        return k;
    }

    if ( gs->svtArea.addJob_safe(SvtJob(gs, SvtJob::Conupdate)) )
        return er::Code(er::OK);

    return er::Code(er::CON_HIN_BUSY);
}

string Worker2::unlink()
{
    if ( !tok.next() ) return er::Code(er::REQ_CON_BAD);

    const string & ipport = tok.sub();

    if ( ipport.find(":") == string::npos )
        return er::Code(er::REQ_CON_BAD);

    Connection c(ipport,"");
    Connector(gs).unlinkNbs_safe(c);

    return er::Code(er::OK);
}

string Worker2::note()
{
    if ( !tok.next() ) return er::Code(er::REQ_NOTE_BAD);

    int dbidx = gs->database.getDbIndex(tok.sub());
    if ( dbidx < 0 )
        return er::Code(er::REQ_HASHTYPE_BAD);

    if ( !tok.next() ) return er::Code(er::REQ_NOTE_BAD);
    gl::intint N = gl::toii(tok.sub());

    if ( !tok.next() ) return er::Code(er::REQ_NOTE_BAD);
    string sdn = tok.sub();

    string from;

    if ( tok.next() ) from = tok.sub();

    if ( gs->svtArea.addJob_safe( SvtJob(gs, SvtJob::Noterecv, dbidx, N, sdn, from) ) )
        return er::Code(er::OK);

    return er::Code(er::REQ_BUSY);
}

string Worker2::quit()
{
    while (1)
    {
        if ( gs->cedArea.cedActive ) {}
        else if ( !gs->activity.empty() ) { gs->activity.pop_some(); }
        else break;
        os::Thread::sleep(10);
    }

    if ( gs->config->dbg.acceptQuit )
        gs->stopPublisherSignal();

    return er::Code(er::OK);
}

string Worker2::conflict()
{
    string hashtype, sdn;

    if ( !tok.next() ) return er::Code(er::REQ_HASHTYPE_BAD);
    hashtype = tok.sub();

    if ( !tok.next() ) return er::Code(er::REQ_DN_BAD);
    sdn = tok.sub();

    int dbIndex = gs->database.getDbIndex(hashtype);

    if ( dbIndex < 0 )
        return er::Code(er::REQ_HASHTYPE_BAD);

    gs->svtArea.addJob_safe( SvtJob(gs, SvtJob::ChkConfl, dbIndex, 0, sdn ) );

    return er::Code(er::OK);
}

string Worker2::proxy()
{
    string cmd, ipport;

    if ( !tok.next() )
        return er::Code(er::REQ_PRX_IP_BAD);

    ipport = tok.sub();

    if ( !tok.next() )
        return er::Code(er::REQ_PRX_CMD_BAD);

    cmd = tok.sub();

    while ( tok.next() )
        cmd += " " + tok.sub();

    return er::Code(er::OK).str() + " " + proxy(gs, ipport, cmd);

}

string Worker2::proxy(GlobalSpace * gs, const string & ipport, const string & cmd)
{
    sgl::Client c(gs->config->netLimits, ipport);
    if ( !c.isok() )
        return er::Code(er::REQ_PRX_DEAD);

    return c.ask(cmd);
}

string Worker2::pleb()
{
    if ( !tok.next() ) return er::Code(er::REQ_MSG_BAD);
    return Plebfile(gs, tok).process();
}

string Worker2::admin()
{
    if ( !tok.next() ) return er::Code(er::REQ_MSG_BAD);

    string cmd = tok.sub();

    if ( cmd == "reorg" )
    {
        SvtJob sjob( gs, SvtJob::Reorg );

        if ( gs->svtArea.addJob_safe( sjob ) )
            return er::Code(er::OK);

        return er::Code(er::REQ_BUSY);
    }

    ///string subcmd;
    if ( cmd == "enable" || cmd == "disable" )
    {
        if ( !tok.next() ) return er::Code(er::REQ_MSG_BAD);
        if ( "net" != tok.sub() ) return er::Code(er::REQ_MSG_BAD);

        gs->netdisabled = (cmd == "disable");
        return er::Code(er::OK);
    }

    if ( cmd == "skc" ) // show, add, pop
    {
        KeyArea & ka = gs->keyArea;
        if ( !tok.next() ) return er::Code(er::REQ_MSG_BAD);
        string subcmd = tok.sub();

        string r = er::Code(er::OK).str() + gl::CRLF;

        if ( subcmd == "show" )
        {
            std::vector<string> skeys = ka.showSkcKeys(true);
            for ( size_t i = 0; i < skeys.size(); i++ )
                r += skeys[i] + gl::CRLF;
            return r;
        }

        if ( subcmd == "pop" )
            ka.popSkcKey();

        else if ( subcmd == "add" )
        {
            if ( !tok.next() ) return er::Code(er::REQ_MSG_BAD);
            ka.addSkcKey(tok.sub());
        }
    }

    return er::Code(er::OK);
}


