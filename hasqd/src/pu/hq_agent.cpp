// Hasq Technology Pty Ltd (C) 2013-2016

#include <fstream>
#include <sstream>

#include "gl_utils.h"
#include "gl_protocol.h"
#include "gl_token.h"

#include "os_timer.h"
#include "os_exec.h"
#include "sg_cout.h"

#include "hq_logger.h"

#include "hq_agent.h"

string Agent::logfile;
string Agent::webpath;
string Agent::database;
Agent::Prot Agent::protocol = Agent::Hasq;

bool Agent::validCmd(string c)
{
    if ( c == "config" || c == "cf" ) return true;
    if ( c == "filesys" || c == "fs" ) return true;
    if ( c == "download" || c == "dl" ) return true;
    if ( c == "build" || c == "bd" ) return true;
    if ( c == "validate" || c == "vd" ) return true;
    return false;
}

bool Agent::sub3Cmd(string c) { return ( c == "download" || c == "dl" ); }
bool Agent::sub2Cmd(string c)
{
    return ( c == "config" || c == "cf" || c == "filesys" || c == "fs"
             || c == "validate" || c == "vd" || sub3Cmd(c) );
}

void Agent::print(const string & s, bool cmd) const
{
    string pf = ": ";
    if ( cmd ) pf = "> ";

    if ( gs->config->dbg.agt )
    {
        os::Cout out;
        out << os::prmpt("agt", gs->config->dbg.id) << pf << s << os::endl;
    }

    string ts = os::Timer::getHms() + " " + pf + s;

    if ( !logfile.empty() )
    {
        std::ofstream of(logfile.c_str(), std::ios::app);
        of << ts << '\n';
    }

    gs->logger.add(Logger::Agent, ts );
}

Agent::Agent(GlobalSpace * g, string cmd1, string cmd2,
             string cmd3, const std::vector<string> & args)
    : gs(g), as(args)
{
    if ( gs->config->dbg.agt )
    {
        string s = cmd1;
        s += (cmd2.empty() ? "" : " " + cmd2);
        s += (cmd3.empty() ? "" : " " + cmd3);

        for ( size_t i = 0; i < as.size(); i++ )
            s += " " + as[i];

        print(s, true);
    }

    try
    {
        if (false);
        else if ( cmd1 == "config"   || cmd1 == "cf")  config(cmd2);
        else if ( cmd1 == "filesys"  || cmd1 == "fs" ) filesys(cmd2);
        else if ( cmd1 == "download" || cmd1 == "dl" ) download(cmd2, cmd3);
        else if ( cmd1 == "build"    || cmd1 == "bd")  listfile();
        else if ( cmd1 == "validate" || cmd1 == "vd")  validate(cmd1);
        else throw gl::ex("Agent bad command: " + cmd1);
    }
    catch (gl::ex e)
    {
        print("Error: " + e.str());
        throw;
    }
}


void Agent::config(const string & s)
{
    if ( as.size() > 1 ) throw gl::ex("Agent too many arguments");

    string val;
    if ( !as.empty() ) val = as[0];

    if (false);
    else if ( s == "logfile" ) setshow(logfile, val);
    else if ( s == "webpath" ) setshow(webpath, val);
    else if ( s == "protocol" ) setshow_prot(val);
    else if ( s == "database" ) setshow(database, val);
    else throw gl::ex("Agent bad command: " + s);
}

void Agent::setshow(string & k, const string & v) const
{
    if ( v.empty() ) print(k);
    else k = v;
}

void Agent::setshow_prot(const string & v) const
{
    if ( v.empty() )
    {
        switch (protocol)
        {
            case Hasq: print("hasq"); return;
            case HttpGet: print("http_get"); return;
            case HttpPost: print("http_post"); return;
        }
        throw gl::Never("Bad prot enum");
    }

    if (false);
    else if ( v == "hasq" ) protocol = Hasq;
    else if ( v == "http_get" ) protocol = HttpGet;
    else if ( v == "http_post" ) protocol = HttpPost;
    else throw gl::ex("Invalid value $1, use (hasq|http_get|http_post)", v);
}

void Agent::filesys(const string & s)
{
    if ( s == "mk" )
    {
        if ( as.size() != 1 ) throw gl::ex("Agent needs 1 argument");
        if ( os::FileSys::trymkdir(as[0]).isdir() ) print(er::Code(er::OK));
        else print(er::Code(er::FILE_CANT_CREATE));
        return;
    }

    if ( s == "rm" )
    {
        if ( as.size() != 1 ) throw gl::ex("Agent needs 1 argument");
        if ( os::FileSys::erase(as[0]) ) print(er::Code(er::OK));
        else print(er::Code(er::REQ_PATH_BAD));
        return;
    }

    if ( s == "mv" )
    {
        if ( as.size() != 2 ) throw gl::ex("Agent needs 1 argument");
        if ( os::rename(as[0], as[1]) ) print(er::Code(er::OK));
        else print(er::Code(er::FILE_CANT_CREATE));
        return;
    }

    if ( s == "cp" )
    {
        if ( as.size() != 2 ) throw gl::ex("Agent needs 1 argument");
        string file = gl::file2str(as[0]);
        if ( file.empty() ) return print(er::Code(er::REQ_PATH_BAD));
        std::ofstream of(as[1].c_str(), std::ios::binary);
        of << file;
        return print(string(er::Code(er::OK)) + " " + gl::tos(file.size()));
    }

    throw gl::ex("Agent bad command: " + s);
}

string Agent::fetch(const string & srv, const string & cmd)
{
    gl::ProtHq prot_0(gl::Protocol::Client);
    gl::HttpGet prot_1(gl::Protocol::Client);
    gl::HttpPost prot_2(gl::Protocol::Client);

    gl::Protocol * prot = 0;

    switch (protocol)
    {
        case Hasq:     prot = &prot_0; break;
        case HttpGet:  prot = &prot_1; break;
        case HttpPost: prot = &prot_2; break;
    }

    bool ok = false;
    os::net::TcpClient c(prot, os::IpAddr(srv, ok), gs->config->netLimits);
    if ( !ok ) throw gl::Never("Creating IpAddr failed: $1", srv);

    c.send_msg(cmd);
    string r = c.recvMsgOrEmpty();

    print("[" + cmd + "] -> {" + (r.size() < 20 ? r : (r.substr(0, 15) + "...")) + "}");

    return r;
}

void Agent::translateDate(string & s)
{
    string today = os::Timer::getGmd();
    if ( s == "today" ) s = today;
    if ( s.size() == 6 ) s = "20" + s;
}

void Agent::downlast(const string & srv, string num, string slice)
{
    size_t i = slice.find("-");
    if ( i == string::npos ) throw gl::ex("Bad returned slice name [$1]", slice);

    os::Path dir(as[0]);

    int n = gl::toi(slice.substr(i + 1));
    int k = gl::toi(num);
    int b = n + 1 - k;
    if ( b < 1 ) b = 1;

    for ( int j = b; j <= n; j++ )
    {
        string file = slice.substr(0, i + 1) + gl::tos(j);
        ///os::Cout() << "DOWNLAST s: " << file << '\n';
        string sget = "slice " + database + " get " + file;
        saveSlice((dir + file).str(), fetch(srv, sget));
    }

    ///os::Cout() << "DOWNLAST " << num << ' ' << n << '\n';
}

void Agent::download(const string & srv, const string & date)
{
    if ( database.empty() )
        return print("Database is not set - try 'agent config database'");

    os::Path dir(as[0]);
    if ( !dir.isdir() )
        return print("Directory does not exist [" + dir.str() + "]");

    ///os::Cout() << "DOWNLOAD " << srv << ' ' << date << ' ' << dir.str() << '\n';

    string s = fetch(srv, "slice " + database);
    if ( s.size() < 4 || s.substr(0, 2) != "OK" )
        return print("Database " + database + " is not present on " + srv);

    string cur_slice = s.substr(3);

    if ( date.empty() ) throw gl::Never("bad date");

    string date_fr, date_to; // 8 digit dates

    date_fr = date_to = date;

    size_t i = date.find(":");
    if ( i != string::npos )
    {
        date_fr = date.substr(0, i);
        date_to = date.substr(i + 1);
    }

    translateDate(date_fr);
    translateDate(date_to);

    if ( date_fr.size() < 6 ) // "today" has been translated
        return downlast(srv, date_fr, cur_slice);

    string cur_date = date_fr;
    int n = 1;

    while (1)
    {
        string file = cur_date + "-" + gl::tos(n);
        string schk = "slice " + database + " check " + file;
        string sget = "slice " + database + " get " + file;

        s = fetch(srv, schk);

        if ( s != "OK" )
        {
            cur_date = gl::nextDay(cur_date);
            if ( cur_date > date_to ) break;
            n = 1;
            continue;
        }

        s = fetch(srv, sget);
        saveSlice((dir + file).str(), s);

        n++;
    }

    ///os::Cout() << "DOWNLOAD " << cur_slice << ' ' << date_fr << ' ' << date_to << '\n';
}

void Agent::saveSlice(const string & file, const string & data)
{
    std::ofstream of(file.c_str(), std::ios::binary);

    if ( !of )
        throw gl::ex("cannot open $1 for writing", file);

    of << data;
}

void Agent::listfile()
{
    if ( as.size() != 4 ) throw gl::ex("Agent list requires 4 arguments");

    string outFile = as[2];
    os::Path ouDir(as[1]);
    os::Path inDir(as[0]);

    if ( !ouDir.isdir() ) return print("Directory " + ouDir.str() + " not accessible");
    if ( !inDir.isdir() ) return print("Directory " + inDir.str() + " not accessible");

    std::vector<string> srvs = gl::tokenise(as[3]);

    // validate and convert self
    for ( size_t i = 0; i < srvs.size(); i++ )
    {
        string & s = srvs[i];

        if ( s == "self" ) s = gs->config->seIpLink.str();

        if ( s.find(":") == string::npos )
            throw gl::ex("Bad address $1, expecting ip:port", s);

        bool ok = false;
        os::IpAddr p(s, ok);

        if (!ok)
            throw gl::ex("Address $1 does not DNS resolve", s);
    }

    // build index directory
    os::Dir dir = os::FileSys::readDirEx(inDir, true, true);
    for ( size_t i = 0; i < dir.files.size(); i++ )
    {
        string file = dir.files[i].first;
        std::ifstream in((inDir + file).str().c_str());
        for ( string line; std::getline(in, line); )
        {
            std::istringstream is(line);
            string dn; is >> dn >> dn;

            string sof = (ouDir + dn).str();
            std::ofstream of(sof.c_str(), std::ios::app | std::ios::binary);
            of << line << '\n';
        }
    }

    // build list
    std::ofstream oflist(outFile.c_str(), std::ios::binary);
    dir = os::FileSys::readDirEx(ouDir, true, true);

    for ( size_t i = 0; i < dir.files.size(); i++ )
    {
        string file = dir.files[i].first;
        std::ifstream in((ouDir + file).str().c_str());

        string last, sn;
        for ( string line; std::getline(in, line); )
        {
            std::istringstream is(line);
            string dn; is >> sn >> dn;

            if ( dn != file ) { last = ""; break; }
            last = dn;
        }

        if ( last.empty() ) continue;

        oflist << sn << ' ' << last;

        for ( size_t j = 0; j < srvs.size(); j++ ) oflist << ' ' << srvs[j];

        oflist << '\n';
    }

    ///os::Cout() << "LIST " << inDir.str() << ' ' << ouDir.str() << ' ' << outFile << '\n';
}


void Agent::validate(const string & cmd)
{
    if ( as.size() != 2 )
    {
        if ( cmd != "push" || as.size() != 3 )
            throw gl::ex("Agent list requires 2 (check,notify) or 3 (push) arguments");
    }

    string inFile = as[0];
    string ouFile = as[1];

    std::ifstream in(inFile.c_str());

    for ( string line; std::getline(in, line); )
    {
        std::istringstream is(line);
        string sn, dn;
        is >> sn >> dn;

        os::Cout() << "VALIDATE " << sn << ' ' << dn << '\n';
    }


    os::Cout() << "VALIDATE " << inFile << ' ' << ouFile << '\n';
}

