// Hasq Technology Pty Ltd (C) 2013-2015

#include <fstream>

#include "gl_except.h"
#include "gl_utils.h"

#include "os_net.h"

#include "sg_cout.h"

#include "hq_config.h"
#include "hq_logger.h"
#include "hq_platform.h"

Config::Config(int ac, const char * av[], const char * cfgfile)
    :
    createThreads(ALL)
    , seTimeout(6000)
    , reorgToutS(60 * 60 * 3)
    , cpuLoadCycle(0)

    , zeroLimit(-1) // no limit
    , wkrAreaJobSize(10)
    , cedAreaSize(10)
    , binAreaSize(10)
    , svtAreaSize(100)

    , dbcfg()
    , servantFile()
    , proxyIpport()
    , noSecretary(false)

    , quiet(false)
    , listDir(true)
    , webRoot()

    , logSize(100)
    , console(true)
    , ignoreLock(false)
    , ignoreLog(false)

    , dbgUdpW(false)
    , dbgUdpR(false)
    , dbgUdpA(false)

    , conCloseSize_ini(4)
    , conPotSize_ini(2000)
    , conHintSize_ini(10)
    , actQueSize(20)
    , lastdataMax(100)
    , rangeMax(100)

    , homevalid(false)
    , webhome("home/index.html")

    , xfwd("0.0.0.0")

    , nWorkers(4)
    , seIpLink("127.0.0.1", 13131)
    , amIpLink("224.0.0.1", 13131)

    , nodename("@host@port")

{
    loadFile(cfgfile, false);

    for ( int i = 1; i < ac; i += 1 )
    {
        if ( string(av[i])[0] == '-' )
        {
            string s = string(av[i]).substr(1);
            for ( size_t j = 0; j < s.size(); j++ )
                processOptionLetter(s[j]);
        }

        else if ( string(av[i]).find("=") != string::npos )
        {
            oneOption(av[i]);
        }

        else throw gl::ex("Unknown option [$1]", av[i]);
    }

    convert_nodename();
    setHomeValid();

    if ( reorgToutS * 1000 < seTimeout )
        os::Cout() << "Warning: reorganisation timeout is less than cycle timeout\n";
}

string Config::createThreadsStr() const
{
    switch (createThreads)
    {
        case ALL: return "all";
        case NONE: return "none";
        case SVT_ONLY: return "servant";
    }
    throw gl::ex("Bad createThread value");
}


cfg::Dbg::Dbg()
    : acceptQuit(false)
    , ced(false)
    , wkr(false)
    , svt(false)
    , sec(false)
    , prn(false)
    , evt(false)
    , pul(false)
    , id(0)
{}


void Config::convert_nodename()
{
    gl::replaceAll(nodename, "@host", os::net::NetInitialiser::hostname_);
    gl::replaceAll(nodename, "@port", gl::tos(seIpLink.getPort()));
}


void Config::processOptionLetter(char a)
{
    if ( a == '1' )
        processOptionKeyVal("threads", "none");
    else if ( a == '2' )
        processOptionKeyVal("threads", "svt");
    else if ( a == 'c' )
        processOptionKeyVal("console", "0");
    else if ( a == 'l' )
        processOptionKeyVal("lock", "0");
    else if ( a == 'n' )
        processOptionKeyVal("log", "0");
    else if ( a == 'q' )
        processOptionKeyVal("quiet", "1");
    else if ( a == 'x' )
        processOptionKeyVal("quit", "1");
    else if ( a == 'p' )
        processOptionKeyVal("tcp_port", "0");
    else if ( a == 'y' )
        processOptionKeyVal("cycle", "0");
    else if ( a == 'a' )
        processOptionKeyVal("let", "all");
    else
        throw gl::ex("Unknown option [$1]", string() + a);
}

bool Config::getbool(const string & v)
{
    if ( v == "0" ) return false;
    else if ( v == "1" ) return true;
    else if ( v == "no" ) return false;
    else if ( v == "yes" ) return true;
    else if ( v == "n" ) return false;
    else if ( v == "y" ) return true;
    else if ( v == "N" ) return false;
    else if ( v == "Y" ) return true;
    throw gl::ex("Bad value [$1]", v);
}


void Config::processOptionKeyVal(const string & k, const string & v)
{
    if ( k == "threads" )
    {
        if ( v == "none" ) createThreads = NONE;
        else if ( v == "svt" ) createThreads = SVT_ONLY;
        else if ( v == "all" ) createThreads = ALL;
        else throw gl::ex("Bad value [$1]", v);
    }

    else if ( k == "info" )
    {
        if ( v == "ver" ) throw string(VERSION);
        else if ( v == "logo" ) throw string(LOGO);
        else if ( v == "lic" ) throw string(LICENCE);
        else throw gl::ex("Bad value [$1]", v);
    }

    else if ( k == "s" || k == "script" )
        servantFile = v;

    else if ( k == "console" )
        console = getbool(v);

    else if ( k == "lock" )
        ignoreLock = !getbool(v);

    else if ( k == "log"  )
        ignoreLog = !getbool(v);

    else if ( k == "quiet"  )
        quiet = getbool(v);

    else if ( k == "dsvt" )
        dbg.svt = getbool(v);

    else if ( k == "dprn" )
        dbg.prn = getbool(v);

    else if ( k == "devt" )
        dbg.evt = getbool(v);

    else if ( k == "dwkr" )
        dbg.wkr = getbool(v);

    else if ( k == "dced" )
        dbg.ced = getbool(v);

    else if ( k == "dsec" )
        dbg.sec = getbool(v);

    else if ( k == "dpul" )
        dbg.pul = getbool(v);

    else if ( k == "db" )
        dbcfg.addBase(v);

    else if ( k == "quit" )
        dbg.acceptQuit = getbool(v);

    else if ( k == "net_conntime" )
        netLimits.maxConnTime = gl::toi(v);

    else if ( k == "net_readtime" )
        netLimits.maxReadTime = gl::toi(v);

    else if ( k == "nodename" || k == "nn" )
        nodename = v;

    else if ( k == "proxy" )
        proxyIpport = v;

    else if ( k == "iplock" )
        ipp_locks.push_back(v);

    else if ( k == "tcp_port" || k == "p" )
        seIpLink.reset_port( gl::i2us(gl::toi(v)) );

    else if ( k == "id" )
    {
        if ( v == "port" )
            dbg.id = seIpLink.getPort();
        else
            dbg.id = gl::i2us(gl::toi(v));
    }

    else if ( k == "reorgS" )
        reorgToutS = gl::toi(v);

    else if ( k == "cpuloadcycle" )
        cpuLoadCycle = gl::toi(v);

    else if ( k == "cycle" )
        seTimeout = gl::toi(v);

    else if ( k == "lastdata_max" )
        lastdataMax = gl::toi(v);

    else if ( k == "range_max" )
        rangeMax = gl::toi(v);

    else if ( k == "nbs" )
        conCloseSize_ini = gl::toi(v);

    else if ( k == "zlim" )
        zeroLimit = gl::toi(v);

    else if ( k == "qwkr" )
        wkrAreaJobSize = gl::toi(v);

    else if ( k == "qced" )
        cedAreaSize = gl::toi(v);

    else if ( k == "qbin" )
        binAreaSize = gl::toi(v);

    else if ( k == "qsvt" )
        svtAreaSize = gl::toi(v);

    else if ( k == "skckey" )
        initial_skc_keys.push_back(v);

    else if ( k == "family" )
        family = v;

    else if ( k == "skcseed" )
        skc_seed = v;

    else if ( k == "webhome" )
        webhome = v;

    else if ( k == "webroot" )
        webRoot = v;

    else if ( k == "pleb" )
        plebDir = v;

    else if ( k == "xfwd" )
        xfwd = v;

    else if ( k == "config" )
        loadFile(v.c_str(), true);

    else if ( k == "workers" )
        nWorkers = gl::toi(v);

    else if ( k == "webdir" )
    {
        string::size_type i = v.find(":");
        string key_dir, val_dir;

        if ( i != string::npos )
        {
            key_dir = v.substr(0, i);
            val_dir = v.substr(i + 1);
        }
        else
            key_dir = val_dir = v;

        int idx = gl::findidx(vdirs, key_dir);

        if ( idx < 0 )
        {
            vdirs.push_back(key_dir);
            ddirs.push_back(val_dir);
        }
        else
            ddirs[idx] = val_dir;
    }

    else if ( k == "let" )
    {
        if ( v == "all" )
            publicNetCmd.all(true);
        else
            publicNetCmd.set(v, true);
    }

    else if ( k == "ban" )
    {
        if ( v == "all" )
            publicNetCmd.all(false);
        else
            publicNetCmd.set(v, false);
    }

    else
        throw gl::ex("Bad key [$1]", k);
}

void Config::setHomeValid()
{
    homevalid = false;

    string::size_type i = webhome.rfind("/");

    if ( i == string::npos )
        return;

    string homedir = webhome.substr(0, i);

    if ( gl::findidx(vdirs, homedir) < 0  )
        return;

    homevalid = true;
}

void Config::loadFile(const char * cfgfile, bool forced)
{
    if ( !cfgfile ) return;

    std::ifstream in(cfgfile);
    if ( !in )
    {
        if ( forced )
            throw gl::ex("Cannot open config file [" + string(cfgfile) + "]");
        return;
    }

    while (1)
    {
        string line;
        std::getline(in, line);
        if ( !in ) break;
        oneOption(line);
    }
}

void Config::oneOption(const string & s)
{
    size_t n = s.find("=");

    if ( n < 1 || n + 1 >= s.size() )
        throw gl::ex("Unknown option [$1]", s);

    string key = s.substr(0, n);
    string val = s.substr(n + 1);

    processOptionKeyVal(key, val);
}

void cfg::PublicNetCmd::all(bool v)
{
    admin = quit = conflict = add = v;
}

void cfg::PublicNetCmd::set(string s, bool v)
{
    if ( s == "admin" )         admin = v;
    else if ( s == "quit" )     quit = v;
    else if ( s == "add" )      add = v;
    else if ( s == "conflict" ) conflict = v;
    else if ( s == "connect" )  connect = v;
    else if ( s == "pleb" )     pleb = v;
    else if ( s == "file" )     file = v;
    else if ( s == "data" )     data = v;
    else if ( s == "/" )        file = v;
    else if ( s == "first" )    first = v;
    else if ( s == "html" )     html = v;
    else if ( s == "info" )     info = v;
    else if ( s == "job" )      job = v;
    else if ( s == "last" )     last = v;
    else if ( s == "lastdata" ) lastdata = v;
    else if ( s == "list" )     list = v;
    else if ( s == "note" )     note = v;
    else if ( s == "range" )    range = v;
    else if ( s == "record" )   record = v;
    else if ( s == "zero" )     zero = v;
    else if ( s == "ping" )     ping = v;
    else if ( s == "proxy" )    proxy = v;

    else
        throw gl::ex("");
}

cfg::PublicNetCmd::PublicNetCmd()
    : admin(false)
    , quit(false)
    , add(true)
    , conflict(false)
    , connect(false)
    , pleb(false)
    , file(true)
    , data(true)
    , first(true)
    , html(true)
    , info(true)
    , job(true)
    , last(true)
    , lastdata(true)
    , list(true)
    , note(true)
    , range(true)
    , record(true)
    , zero(true)
    , ping(true)
    , proxy(true)
{}
