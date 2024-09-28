// Hasq Technology Pty Ltd (C) 2013-2015

#include <iostream>

#include "gl_protocol.h"

#include "os_net.h"

#include "sg_cout.h"

const char * sip = "127.0.0.1";
const char * udp = "224.0.0.1";
const gl::ushort port = 13131;

gl::NetworkLimits nl;

void client(const string & m)
{
    os::IpAddr linkTcp(sip, port);
    os::IpAddr linkUdp(udp, port);

    gl::ProtHq http(gl::ProtHq::Client);

    os::net::TcpClient tcpClient(&http, linkTcp, nl, nullptr);
    //os::net::Multicast udpClient(linkUdp);

    tcpClient.send_msg(m);
    //udpClient.send_str("Hello udp world!");

    string msg;
    switch ( tcpClient.recv_msg(msg) )
    {
        case gl::PKT_COMPLETE:
            os::Cout() << "client got [" << msg << "]\n" << os::flush;
            break;
        case gl::PKT_INCOMPLETE:
            os::Cout() << "client got incomplete message\n" << os::flush;
            break;
        case gl::PKT_ERROR:
            os::Cout() << "client got error\n" << os::flush;
            break;
        default:
            os::Cout() << "Really bad: urgent debug needed\n" << os::flush;
    }
}

void processUdpMessage(os::net::Multicast * soc)
{
    string packet = soc->getReceivedMessage();

    if ( packet == "hello" ) soc->send_msg("hi");
    os::Cout() << "UDP[" << packet << "]\n" << os::flush;
}

void server()
{
    gl::ProtHq http(gl::ProtHq::Server);
    gl::Udp amprot;

    os::IpAddr linkTcp(sip, port);
    os::IpAddr linkUdp(udp, port);

    os::net::TcpAcceptor tcpServer(&http, linkTcp);
    os::net::Multicast udpServer(&amprot, linkUdp);

    os::net::Selector select(nl);

    select.addAcceptor(&tcpServer);
    select.addAcceptor(&udpServer);

    os::Cout() << "Listening on " << sip << ':' << port << os::endl;

    while (1)
    {
        os::net::Socket * s = select.wait(400000);
        if ( !s ) { os::Cout() << '.' << os::flush; continue; }

        if ( s == &udpServer )
        {
            processUdpMessage(&udpServer);
            continue;
        }

        string packet = s->getReceivedMessage();

        os::Cout() << "server got [" << packet << "] from " << s->getAddr().str() << "\n" << os::flush;
        s->send_msg(packet + ":hehe");
        delete s;
        if ( packet == "bye" ) break;
    }
}

struct Proc : os::Blockable
{
    os::Semaphore * s;
    bool exit;

    Proc(os::Semaphore * s): Blockable(&exit), s(s), exit(false) {}
    void runOnceUnconditionally();
    os::Semaphore * getMainSemaphore() const { return s; }
};


void Proc::runOnceUnconditionally()
{
    os::Thread::yield();
    client("hello1");
    client("hello2");
    client("hello3");
    client("bye");
    exit = true;
}



int main(int ac, char * av[])
try
{
    os::net::NetInitialiser netini;
    //server(); return 0;

    if ( ac < 2 )
    {
        os::Semaphore sem;
        Proc w(&sem);
        os::Thread t(w);
        sem.up();
        server();
    }
    else if ( av[1] == string("server") )
        server();

    else client(av[1]);

    return 0;
}
catch (gl::Exception e)
{
    std::cout << "Error: " << e.str() << '\n';
}
