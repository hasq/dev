// Hasq Technology Pty Ltd (C) 2013-2016

#include "sg_cout.h"
#include "hq_agent.h"

Agent::Agent(GlobalSpace * g, string cmd1, string cmd2, const std::vector<string> & args)
    : gs(g)
{
    if ( gs->config->dbg.agt )
    {
        string sargs;

        for ( size_t i = 0; i < args.size(); i++ )
            sargs += " " + args[i];

        os::Cout out;
        out << os::prmpt("agt", gs->config->dbg.id)
            << "cmd1=[" << cmd1 << "] cmd2=[" << cmd2
            << "] args={" << sargs << " }" << os::endl;
    }

}

