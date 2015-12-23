// Hasq Technology Pty Ltd (C) 2013-2015

#include <iostream>
#include <cstdlib>

#include "gl_protocol.h"
#include "gl_utils.h"

#include "os_net.h"

#include "sg_cout.h"

const char * sip = "233.3.7.17";      // 224.0.0.0 - 239.255.255.255
gl::ushort port = 5555;

gl::NetworkLimits nl;

void server()
{
    gl::Udp udp;

    os::IpAddr linkUdp(sip, port);

    os::net::Multicast udpServer(&udp, linkUdp);

    os::net::Selector selector(nl);

    selector.addAcceptor(&udpServer);

    os::Cout() << "UDP Server listening on " << sip << ':' << port << os::endl;

    while (1)
    {
        os::net::Socket * s = selector.wait(3000);
        if ( !s ) { os::Cout() << '.' << os::flush; continue; }

        string packet = s->getReceivedMessage();

        if ( packet[0] == '_' ) continue;

        os::Cout() << "received [" << packet << "] from " << s->getAddr().str() << os::flush;

        s->send_msg("_" + packet);
        os::Cout() << ", reply sent\n" << os::flush;

        if ( packet == "bye" ) break;
    }
}


int main(int ac, char * av[])
try
{
    if ( ac > 1 ) port = static_cast<gl::ushort>(gl::toi(av[1]));
    os::net::NetInitialiser netini;
    server();

    return 1;
}
catch (gl::Exception e)
{
    std::cout << "Error: " << e.str() << '\n';
}
