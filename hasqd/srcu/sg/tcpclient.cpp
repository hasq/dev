// Hasq Technology Pty Ltd (C) 2013-2015

#include <iostream>
#include <vector>
#include <sstream>
#include <fstream>

#include "gl_protocol.h"
#include "gl_utils.h"

#include "sg_cout.h"

#include "os_net.h"


const char * sip = "127.0.0.1";
const char * udp = "224.0.0.1";
const gl::ushort port = 13131;

gl::NetworkLimits nl;
gl::ProtHq prot(gl::ProtHq::Client);

void cmd_help(std::vector<string> cmd)
{
    std::cout << "help\n";
    std::cout << "open 127.0.0.1 13131\n";
    std::cout << "open\n";
    std::cout << "send 1 ccc\n";
    std::cout << "send 2 \"ccc bbb\"\n";
    std::cout << "recv\n";
    std::cout << "recv 1\n";
    std::cout << "close 1\n";
    std::cout << "sleep 1000\n";
    std::cout << "tunnel 13132 echo|ping - (13132 is listening port)\n";
    std::cout << "tunnel 13132 [127.0.0.1:]13131\n";
    std::cout << "quit\n";
    std::cout << "o,s,r,c,q\n";
    std::cout << "o,s,r,c,t,q\n";
}

void cmd_open(std::vector<string> cmd);
void cmd_send(std::vector<string> cmd);
void cmd_recv(std::vector<string> cmd);
void cmd_close(std::vector<string> cmd);
void cmd_sleep(std::vector<string> cmd);
void cmd_tunnel(std::vector<string> cmd);

void print_connections();
void print_tunnels();

int getidx(const string & s);
int areopen();

int main(int ac, char * av[])
try
{
    os::net::NetInitialiser netini;
    std::istream * input = &std::cin;
    std::ifstream ifinput;
    if ( ac > 1 )
    {
        ifinput.open(av[1]);
        if ( !ifinput ) throw gl::Exception(string("Open file error: ") + av[1]);
        input = &ifinput;
    }

    while (*input)
    {
        print_connections();
        print_tunnels();

        string cmd;
        std::cout << "> ";
        std::getline(*input, cmd);
        std::vector<string> toks = gl::tokenise(cmd);
        if ( toks.empty() ) continue;
        if ( toks[0] == "help" || toks[0] == "h" ) cmd_help(toks);
        else if ( toks[0] == "open" || toks[0] == "o") cmd_open(toks);
        else if ( toks[0] == "send" || toks[0] == "s" ) cmd_send(toks);
        else if ( toks[0] == "recv" || toks[0] == "r" ) cmd_recv(toks);
        else if ( toks[0] == "close" || toks[0] == "c" ) cmd_close(toks);
        else if ( toks[0] == "sleep" ) cmd_sleep(toks);
        else if ( toks[0] == "tunnel" || toks[0] == "t" ) cmd_tunnel(toks);
        else if ( toks[0] == "quit" || toks[0] == "q" ) break;

        else std::cout << "unknown command [" << toks[0] << "]\n";

    }

    while (1)
    {
        if ( !areopen() ) break;
        std::cout << "closing tunnels and connections " << areopen() << "\n";
        cmd_close(gl::tokenise("close 1"));
        print_connections();
        print_tunnels();
    }
}
catch (gl::Exception e)
{
    std::cout << "Error: " << e.str() << '\n';
}

std::vector<os::net::TcpClient *> conns;

void print_connections()
{
    auto sz = conns.size();
    for ( decltype(sz) i = 0; i < sz; i++ )
    {
        os::Cout() << '\t' << (i + 1) << '\t' << conns[i]->getAddr().str()
                   << " - " << conns[i]->stateStr() << os::endl;
    }
}

void cmd_open(std::vector<string> cmd)
{
    gl::ushort myport = port;
    string mysip = sip;

    if ( cmd.size() > 1u )
    {
        mysip = cmd[1];
    }

    if ( cmd.size() > 2u )
    {
        std::istringstream is(cmd[2]); is >> myport;
    }

    os::IpAddr ipaddr(mysip.c_str(), myport);

    conns.push_back( new os::net::TcpClient(&prot, ipaddr, nl, nullptr) );
}

void cmd_recv(std::vector<string> cmd)
{
    int idx = -1;
    if ( cmd.size() < 2 ) idx = getidx("1");
    else  idx = getidx(cmd[1]);

    if ( idx < 0 ) return;
    string msg;

    if ( conns[idx]->recv_msg(msg) == gl::PKT_COMPLETE )
    {
        std::cout << "[" << msg << "]\n";
    }
    else
    {
        std::cout << "incomplete or error message\n";
        delete conns[idx];
        conns.erase( conns.begin() + idx );
    }
}

void cmd_send(std::vector<string> cmd)
{
    if ( cmd.size() != 3 )
    {
        std::cout << "command format: send <idx> <message>\n";
        return;
    }

    int idx = getidx(cmd[1]);

    if ( idx < 0 ) return;

    if ( !conns[idx]->send_msg(cmd[2]) )
        os::Cout() << "Error sending [" << cmd[2] << "]" << os::endl;
    else
        os::Cout() << "Sent [" << cmd[2] << "]" << os::endl;
}

void cmd_sleep(std::vector<string> cmd)
{
    if ( cmd.size() != 2 )
    {
        std::cout << "command format: sleep <time>\n";
        return;
    }

    int tm;
    std::istringstream is(cmd[1]); is >> tm;

    os::Thread::sleep(tm);
}

// ================ Tunnels

class Tunnel: public os::Blockable
{
    protected:
        gl::ushort myport;
    public:
        bool exitf;

    public:
        Tunnel(gl::ushort p): os::Blockable(&exitf), myport(p), exitf(false) {}
        ~Tunnel() {}

        virtual string str() const = 0;
        virtual string ask(string msg) = 0;

        os::Semaphore * getMainSemaphore(void) const { return 0; }
        void runOnceUnconditionally(void);
};

class TunnelPlug : public Tunnel
{
        int typ;
    public:
        TunnelPlug(int t, gl::ushort prt): Tunnel(prt), typ(t) {}
        string str() const { return string() + "tunnel " + (typ ? "echo" : "ping") + " on " + gl::tos(myport); }
        string ask(string msg) { return (typ ? msg : "OK"); }
};

class TunnelTo : public Tunnel
{
        string ip;
        gl::ushort port2;
    public:
        TunnelTo(gl::ushort p, string ip, gl::ushort port2)
            : Tunnel(p), ip(ip), port2(port2) {}

        string str() const { return "tunnel to " + ip + ":" + gl::tos(port2) + " on " + gl::tos(myport); }
        string ask(string msg) { return "msg"; }
};

struct TunnelThread
{
    os::Thread * thread;
    Tunnel * tunnel;
};

std::vector<TunnelThread> tunnels;


int areopen()
{
    auto sz1 = conns.size();
    auto sz2 = tunnels.size();
    auto sz = sz1 + sz2;
    return (int)sz;
}

int getidx(const string & s)
{
    int idx = -1;
    std::istringstream is(s); is >> idx;
    --idx;
    auto sz1 = conns.size();
    auto sz2 = tunnels.size();
    auto sz = sz1 + sz2;
    if ( idx < 0 || (decltype(sz))(idx) >= sz )
    {
        std::cout << "index " << (idx + 1) << " out of bounds\n";
        return -1;
    }
    return idx;
}


void cmd_close(std::vector<string> cmd)
{
    if ( cmd.size() != 2 )
    {
        std::cout << "command format: close <index>\n";
        return;
    }

    int idx = getidx(cmd[1]);
    if ( idx < 0 ) return;

    if ( idx < (int)conns.size() )
    {
        delete conns[idx];
        conns.erase( conns.begin() + idx );
        return;
    }

    idx -= gl::st2i(conns.size());

    tunnels[idx].tunnel->exitf = true;
    delete tunnels[idx].thread;
    delete tunnels[idx].tunnel;
    tunnels.erase( tunnels.begin() + idx );
}


void print_tunnels()
{
    auto csz = conns.size();
    auto sz = tunnels.size();
    for ( decltype(sz) i = 0; i < sz; i++ )
    {
        os::Cout() << '\t' << (i + csz + 1) << '\t' << tunnels[i].tunnel->str() << os::endl;
    }
}

void cmd_tunnel(std::vector<string> cmd)
{
    if ( cmd.size() != 3u )
    {
        std::cout << "command format: tunnel <port> [ip:]port|echo|ping\n";
        return;
    }

    gl::ushort myport = gl::i2us(gl::toi(cmd[1]));


    Tunnel * t = 0;

    if ( cmd[2] == "echo" )
        t = new TunnelPlug(1, myport);

    else if ( cmd[2] == "ping" )
        t = new TunnelPlug(0, myport);

    else
    {
        string ip = "127.0.0.1";
        string sport = cmd[2];
        string::size_type i = cmd[2].find(':');

        if ( i != string::npos )
        {
            ip = cmd[2].substr(0, i);
            sport = cmd[2].substr(i + 1);
        }

        gl::ushort port2 = gl::i2us(gl::toi(sport));

        t = new TunnelTo(myport, ip, port2);
    }

    if (!t) return;
    TunnelThread tt;
    tt.tunnel = t;
    tt.thread = new os::Thread(*t);
    tunnels.push_back( tt );
}

void Tunnel::runOnceUnconditionally(void)
{
    os::Cout() << "Tunnel started: " << str() << os::endl;

    gl::Http http(gl::ProtHq::Server);

    os::IpAddr linkTcp("127.0.0.1", myport);

    os::net::TcpAcceptor tcpServer(&http, linkTcp);

    gl::NetworkLimits anl;
    os::net::Selector selector(anl);

    selector.addAcceptor(&tcpServer);

    while (!exitf)
    {
        os::net::Socket * s = selector.wait(400);
        if ( !s ) continue;

        string packet = s->getReceivedMessage();

        os::Cout() << "TunnelPlug got [" << packet << "] from " << s->getAddr().str() << "\n" << os::flush;

        s->send_msg("[" + ask(packet) + "]");
        delete s;
    }
}

