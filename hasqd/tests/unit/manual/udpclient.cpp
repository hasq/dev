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

void client()
{
    gl::Udp udp;

    os::IpAddr linkUdp(sip, port);

    os::net::Multicast udpClient(&udp, linkUdp);

    os::net::Selector selector(nl);

    selector.addAcceptor(&udpClient);

    os::Cout() << "UDP Client\n\n" << os::flush;

    std::istream * input = &std::cin;

    while (1)
    {
        string msg;

        std::getline(*input, msg);
        if ( msg == "bye" ) return;

        udpClient.send_msg(msg);
        os::Cout() << "sent: [" << msg << "] to " << linkUdp.str() << os::flush;

A:

        os::net::Socket * s = selector.wait(3000);
        if ( !s ) { os::Cout() << " ... no reply received\n\n" << os::flush; continue; }

        string reply = s->getReceivedMessage();

        if ( reply == msg ) goto A;

        os::Cout() << "received: [" << reply << "] from " << s->getAddr().str() << "\n\n" << os::flush;
    }
}


int main(int ac, char * av[])
try
{
    if ( ac > 1 ) port = static_cast<gl::ushort>(gl::toi(av[1]));
    os::net::NetInitialiser netini;
    client();

    return 1;
}
catch (gl::Exception e)
{
    std::cout << "Error: " << e.str() << '\n';
}
