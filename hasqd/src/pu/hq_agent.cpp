// Hasq Technology Pty Ltd (C) 2013-2016

#include <fstream>

#include "os_timer.h"
#include "sg_cout.h"

#include "hq_logger.h"

#include "hq_agent.h"

string Agent::logfile;
string Agent::webpath;

bool Agent::validCmd(string c)
{
    if ( c == "config" ) return true;
    if ( c == "filesys" ) return true;
    return false;
}

bool Agent::subCmd(string c) { return ( c == "config" || c == "filesys" ); }


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

    if ( cmd1 == "config" ) config(cmd2);
    else if ( cmd1 == "filesys" ) filesys(cmd2);
    else throw gl::ex("Agent bad command: " + cmd1);
}


void Agent::config(const string & s)
{
    if ( as.size() > 1 ) throw gl::ex("Agent too many arguments");

    if ( s == "logfile" ) logfile = (as.empty() ? "" : as[0]);
    if ( s == "webpath" ) webpath = (as.empty() ? "" : as[0]);
    else throw gl::ex("Agent bad command: " + s);
}

void Agent::filesys(const string & s)
{
    print("filesys NA");
}

