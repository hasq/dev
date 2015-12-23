// Hasq Technology Pty Ltd (C) 2013-2015

#include <iostream>

#include "os_net.h"
#include "sg_cout.h"

#include "hq_console.h"

typedef std::vector<string> vs;

void Console::runOnceUnconditionally()
{
    try
    {
        string cmd;
        std::getline(std::cin, cmd);
        if ( !std::cin ) cmd = "quit";

        vs toks = gl::tokenise(cmd);

        if ( toks.empty() ) {}
        else if ( toks[0][0] == '#' ) {}

        else if ( toks[0] == "." )
        {
            svt_mode = !svt_mode;
            if ( svt_mode )
                os::Cout() << "entering servant mode; use . to return to console" << os::endl;
        }

        else if ( svt_mode )
        {
            publisher->getServant()->addTask_safe(cmd);
            publisher->getGlobalSpace()->svtArea.svtSemaphore.up();
        }

        else if ( toks[0] == "help" )
        {
            os::Cout() << "help       - print help page" << os::endl;
            os::Cout() << "ips        - print interfaces" << os::endl;
            os::Cout() << ".<cmd>     - inject servant command <cmd>" << os::endl;
            os::Cout() << ".          - switch on/off servant mode" << os::endl;
            os::Cout() << "             servant mode: all commands are passed to servant" << os::endl;
            os::Cout() << "quit or q  - shutdown server" << os::endl;
        }

        else if ( toks[0][0] == '.' )
        {
            if ( toks[0].size() > 1 )
            {
                publisher->getServant()->addTask_safe(cmd.substr(1));
                publisher->getGlobalSpace()->svtArea.svtSemaphore.up();
            }
            else
                os::Cout() << "use . for svt command; for example .print [ a ]" << os::endl;
        }

        else if ( toks[0] == "quit" || toks[0] == "q" )
        {
            publisher->getGlobalSpace()->stopPublisherSignal();

            //if( !publisher->getGlobalSpace()->config->quiet )
            os::Cout() << "Bye" << os::endl;
            return;
        }

        else if ( toks[0] == "ips" )
        {
            os::Cout() << os::net::NetInitialiser::str() << os::endl;
        }

        else
            os::Cout() << "unknown command: " << toks[0] << ", try help" << os::endl;

        os::Cout() << (svt_mode ? "." : "") << "> " << os::flush;
    }
    catch (gl::Exception e)
    {
        os::Cout() << "Fatal error (gl::Exception): " << e.str() << os::endl;
    }
    catch (const char * e) { os::Cout() << "Fatal error (char*): " << e << os::endl; }
    catch (string * e) { os::Cout() << "Fatal error (string): " << e << os::endl; }

}

