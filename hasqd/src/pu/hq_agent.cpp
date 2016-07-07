// Hasq Technology Pty Ltd (C) 2013-2016

#include <fstream>

#include "gl_utils.h"
#include "gl_protocol.h"

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
    return false;
}

bool Agent::sub3Cmd(string c) { return ( c == "download" || c == "dl" ); }
bool Agent::sub2Cmd(string c)
{
    return ( c == "config" || c == "cf" || c == "filesys" || c == "fs" || sub3Cmd(c) );
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
        else if ( cmd1 == "config" || cmd1 == "cf") config(cmd2);
        else if ( cmd1 == "filesys" || cmd1 == "fs" ) filesys(cmd2);
        else if ( cmd1 == "download" || cmd1 == "dl" ) download(cmd2, cmd3);
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

void Agent::downlast(const string & srv, const string & num)
{
    os::Cout() << "DOWNLAST " << num << '\n';
}

void Agent::download(const string & srv, const string & date)
{
    const string ER01 = "Database $1 is not present on $2";

    if ( database.empty() )
        return print("Database is not set - try 'agent config database'");

    os::Path dir(as[0]);
    if ( !dir.isdir() )
        return print("Directory does not exist [" + dir.str() + "]");

    os::Cout() << "DOWNLOAD " << srv << ' ' << date << ' ' << dir.str() << '\n';

    string s = fetch(srv, "slice " + database);
    if ( s.size() < 4 || s.substr(0, 2) != "OK" ) throw gl::ex(ER01, database, srv);

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

    if ( date_fr.size() < 6 )
        return downlast(srv, date_fr);

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

    os::Cout() << "DOWNLOAD " << cur_slice << ' '
               << date_fr << ' ' << date_to << '\n';
}

void Agent::saveSlice(const string & file, const string & data)
{
    std::ofstream of(file.c_str(), std::ios::binary);

    if ( !of )
        throw gl::ex("cannot open $1 for writing", file);

    of << data;
}


