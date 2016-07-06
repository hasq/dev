// Hasq Technology Pty Ltd (C) 2013-2016

#include <fstream>

#include "gl_utils.h"

#include "os_timer.h"
#include "os_exec.h"
#include "sg_cout.h"

#include "hq_logger.h"

#include "hq_agent.h"

string Agent::logfile;
string Agent::webpath;
bool Agent::prot_html = false;

bool Agent::validCmd(string c)
{
    if ( c == "config" ) return true;
    if ( c == "filesys" || c == "fs" ) return true;
    if ( c == "download" || c == "dl" ) return true;
    return false;
}

bool Agent::subCmd(string c)
{
    return ( c == "config"
             || c == "filesys" || c == "fs"
             || c == "download" || c == "dl" );
}


void Agent::print(const string & s) const
{
    if ( gs->config->dbg.agt )
    {
        os::Cout out;
        out << os::prmpt("agt", gs->config->dbg.id) << s << os::endl;
    }

    string ts = os::Timer::getHms() + " " + s;

    if ( !logfile.empty() )
    {
        std::ofstream of(logfile.c_str(), std::ios::app);
        of << ts << '\n';
    }

    gs->logger.add(Logger::Agent, ts );
}

Agent::Agent(GlobalSpace * g, string cmd1, string cmd2, const std::vector<string> & args)
    : gs(g), as(args)
{
    if ( gs->config->dbg.agt )
    {
        string s = cmd1 + (cmd2.empty() ? "" : " " + cmd2);

        for ( size_t i = 0; i < as.size(); i++ )
            s += " " + as[i];

        print(s);
    }

    if (false);
    else if ( cmd1 == "config" ) config(cmd2);
    else if ( cmd1 == "filesys" ) filesys(cmd2);
    else throw gl::ex("Agent bad command: " + cmd1);
}


void Agent::config(const string & s)
{
    if ( as.size() > 1 ) throw gl::ex("Agent too many arguments");

    if (false);
    else if ( s == "logfile" ) logfile = (as.empty() ? "" : as[0]);
    else if ( s == "webpath" ) webpath = (as.empty() ? "" : as[0]);
    else if ( s == "hasq" ) prot_html = false;
    else if ( s == "html" ) prot_html = true;
    else throw gl::ex("Agent bad command: " + s);
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

/*///
string Plebfile::del()
{
    if ( !tok.next() ) return err;

    os::Path dirname = root + tok.sub();

    if ( os::FileSys::erase(dirname) )
        return er::Code(er::OK);

    return er::Code(er::REQ_PATH_BAD);
}
*/
