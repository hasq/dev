// Hasq Technology Pty Ltd (C) 2013-2016

#include <iostream>

#include "gl_protocol.h"

#include "os_net.h"
#include "os_thread.h"

#include "sg_cout.h"
#include "sg_testing.h"

#include "hq_logger.h"
#include "hq_config.h"
#include "hq_console.h"
#include "hq_publisher.h"

#include "hq_platform.h"

int main(int ac, const char * av[]) try
{
    TRACE0

    sgl::testing();

    os::net::NetInitialiser netinit;

    Config cfg(ac, av, "hasqd.cfg");

    gl::Http_base::logo = LOGO;
    if (!cfg.quiet) os::Cout() << LOGO << os::endl;

    Publisher publ(&cfg);

    if ( cfg.console )
    {
        Console con(&publ);
        os::Thread conThread(con);
        publ.run();
    }
    else
        publ.run();

    return 0;
}
catch (gl::Exception e)
{
    std::cout << "Error: " << e.str() << '\n';

    return 0;
}
catch (string s)
{
    std::cout << s << '\n';
    return 0;
}
