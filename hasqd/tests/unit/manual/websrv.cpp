// Hasq Technology Pty Ltd (C) 2013-2015

#include <iostream>
#include <cstdlib>

#include "gl_protocol.h"
#include "gl_utils.h"

#include "os_net.h"

#include "sg_cout.h"

const char * sip = "127.0.0.1";
gl::ushort port = 13131;

gl::NetworkLimits nl;

void server()
{
    gl::Http http(gl::ProtHq::Server);

    os::IpAddr linkTcp(sip, port);

    os::net::TcpAcceptor tcpServer(&http, linkTcp);

    os::net::Selector selector(nl);

    selector.addAcceptor(&tcpServer);

    os::Cout() << "TCP Server listening on " << sip << ':' << port << os::endl;

    while (1)
    {
        os::net::Socket * s = selector.wait(4000);
        if ( !s ) { os::Cout() << '.' << os::flush; continue; }

        string packet = s->getReceivedMessage();

        os::Cout() << "server got [" << packet << "] from " << s->getAddr().str() << "\n" << os::flush;

        s->send_msg("[" + packet + "]");
        delete s;
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
