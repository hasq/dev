#include <fstream>
#include <iostream>
#include <string>
#include <ctime>
#include <exception>

#include "gl_except.h"
#include "os_timer.h"
#include "os_thread.h"

#include "os.h"
#include "hqconf.h"
#include "bootut.h"
#include "hdmnt.h"

// Booter return codes
namespace Retcode
{
enum { HASQD = 0, RESTART = 1, HALT = 2, CONSOLE = 3 };
}


/*
                       [start]
                          |
                 <3.1 Timeout message>
                          |
                 <3.2 find cfg on HD>
                          |
                    [3.3 Timeout] - Yes -+ (Key pressed)
                          |              |
                          No             |
                          |              |
                   <HD cfg found ?>      |
                    |            |       |
                   Yes           No      |
                    |            |       |
          [3.4 Use HD cfg]   <ASK=Yes> --+
                               |         |
                               No    [3.5 If no HD cfg, Load CD cfg]
                               |         |
                 [3.10 Use CD cfg]   [3.6 Ask questions] < - - +
                               |         |                     |
                               |     [3.7 Console] - - - - - - +
                               |         |
                               +---- [3.8 Write cfg]
                                         |
                                     [3.9 Restart]
*/

using std::string;
using std::cout;

using debug::o;

bool need_stop()
{
    while (1)
    {
        string y = "yes/no";
        ask("Do you want to terminate hasqd installer and start unix shell?", y);

        if ( y == "y" || y == "yes" )
            return true;

        if ( y == "n" || y == "no" )
            return false;
    }
}

void f_35_39(string path_on_hd)
{

    HqConf cfg;

    if ( path_on_hd.empty() )
    {
        cfg = load_cfg_cd();
        cout << "Config loaded from cdrom\n";
        path_on_hd = writableHd();
    }
    else
    {
        cfg = load_cfg(path_on_hd);
        cout << "Config loaded from " << path_on_hd << '\n';
    }

    while (1)
    {
        ask_questions(cfg);
        run_console();

        string y = "no";
        ask("Do you want to review/change settings?", y);

        if ( y == "n" || y == "no" ) break;
    }

    write_cfg(cfg, path_on_hd);
}

const int WAIT_MSEC = 10000;

int xmain()
try
{
    cout << "Press any key to enter interactive mode ...\n";

    os::Timer timer;

    string path_on_hd;

    try
    {
        path_on_hd = find_cfg_on_hd();
    }
    catch (string e)
    {
        cout << "Error: " << e << '\n';
        cout << "Error in config search - possibly hasqd.conf is corrupted\n";
        return Retcode::CONSOLE;
    }
    catch (...)
    {
        cout << "Error in config search - possibly hasqd.conf is corrupted\n";
        return Retcode::CONSOLE;
    }


    int c = 0, cntr = 0;
    while (1)
    {
        c = os::kbhit();
        if (c) break;
        auto tget = timer.get();
        if ( tget > WAIT_MSEC ) break;
        cout << ("\\|/-"[(++cntr) % 4]);
        cout << ' ' << (WAIT_MSEC - tget);
        cout << "    \r" << std::flush;
        os::Thread::sleep(100);
    }
    o("xmain", __LINE__);

    // config not found
    string wrtHd = writableHd();
    if ( wrtHd.empty() )
    {
        if ( mnt::dvs.empty() )
        {
            cout << "No writable hard drives found\n";
            cout << "Please connect hard drive, create and format new partition\n";
            return Retcode::CONSOLE;
        }

        if ( formatHd() )
            return Retcode::RESTART;

        return Retcode::CONSOLE;
    }

    o("xmain", __LINE__);
    if (c) // user pressed a key
    {
        if ( need_stop() )
            return Retcode::CONSOLE;

        f_35_39(path_on_hd);
        return Retcode::RESTART;
    }

    o("xmain", __LINE__);
    if ( !path_on_hd.empty() )
    {
        o("xmain", __LINE__);
        start_hasq_srv_at(path_on_hd);
        cout << "proceeding with hasqd at '" << path_on_hd << "'\n";
        return Retcode::HASQD;
    }

    o("xmain", __LINE__);
    HqConf cfg;

    while (1)
    {
        cout << "No configuration found on hard drives\n";

        string a = "yes";
        ask("Use default CD configuration as is ?", a);
        if ( a == "y" || a == "yes" )
        {
            cfg = load_cfg_cd();
            write_cfg(cfg, wrtHd);
            return Retcode::RESTART;
        }

        if ( a == "n" || a == "no" ) break;
    }

    o("xmain", __LINE__);
    f_35_39("");
    return Retcode::RESTART;
}
catch (const char * e)
{
    cout << "Error: " << e << '\n';
    return Retcode::HALT;
}
catch (string e)
{
    cout << "Error: " << e << '\n';
    return Retcode::HALT;
}
catch (gl::Exception e)
{
    cout << "Error: " << e.str() << '\n';
    return Retcode::HALT;
}
catch (std::exception & e)
{
    cout << "Exception: " << e.what() << "\n";
    return Retcode::HALT;
}
catch (...)
{
    cout << "booter: Unknown exception\n";
    return Retcode::HALT;
}

int main(int ac, char * av[])
{
    if ( ac == 2 && string(av[1]) == "debug" ) debug::flag = true;

    int r = xmain();
    string s;
    switch (r)
    {
        case 0: s = "HASQD"; break;
        case 1: s = "RESTART"; break;
        case 2: s = "HALT"; break;
        case 3: s = "CONSOLE"; break;
    }

    cout << "booter returns: " << s << " (" << r << ")\n";
    return r;
}
