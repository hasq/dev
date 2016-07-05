// Hasq Technology Pty Ltd (C) 2013-2016

#include "sg_cout.h"
#include "hq_agent.h"

string Agent::logfile;
string Agent::webpath;

void Agent::print(const string & s) const
{
    if ( !gs->config->dbg.agt ) return;

    os::Cout out;
    out << os::prmpt("agt", gs->config->dbg.id) << s << os::endl;
}

Agent::Agent(GlobalSpace * g, string cmd1, string cmd2, const std::vector<string> & args)
    : gs(g)
{
    if ( gs->config->dbg.agt )
    {
        string s = cmd1 + (cmd2.empty() ? "" : " " + cmd2);
        for ( size_t i = 0; i < args.size(); i++ )
            s += " " + args[i];

        print(s);
    }

    if ( cmd1 == "config" ) {}
}

