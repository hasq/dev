// Hasq Technology Pty Ltd (C) 2013-2015


#include <iostream> // debug only, can be removed later

const bool PDDG = false;

void os::net::NetInitialiser::findip()
{
    if ( gethostname( hostname_, 100 ) != 0)
    {
        throw gl::ex("failed gethostname: $1", gl::tos(getLastError()) );
    }

    struct hostent * he = gethostbyname(hostname_);

    char ** pptr;

    if ( !he || he->h_addrtype != AF_INET )
    {
        throw gl::ex("This hostname [$1] does not resolve in any IPv4 addresses", hostname_);
    }

    pptr = he->h_addr_list;

    while ( *pptr != 0 && ips_size_ < 16 )
    {
        struct in_addr addr;
        memcpy(&addr, *pptr, sizeof(addr));
        const char * ip = inet_ntoa(addr);

        int i;
        for ( i = 0; i < ips_size_; i++ )
            if ( strcmp(ip, ips_[i]) == 0 )
                break;

        if ( i == ips_size_)
            std::strncpy(ips_[ips_size_++], ip, 16);

        ++pptr;
    }
}


// ------------------------------------------------------
os::net::Socket::~Socket()
{
    OTYPE::fd_type & fd = native(data).fd;
    if ( fd != OTYPE::INVALID ) closeDescriptor(fd);

    const bool PDD = PDDG;

    if (PDD) std::cout << " [" << getAddr().str() << ":closed] ";
}

void os::net::Socket::init()
{
    native(data).fd = OTYPE::INVALID;
}

bool os::net::Socket::send_fd(const char * buf, int sz)
{
    for ( int i = 0; i < sz; )
    {
        int k = ::send( native(data).fd, buf + i, sz - i, 0);
        if ( k <= 0 ) return false;
        i += k;
    }
    return true;
}

// returns: 1+  - data received and appended to str
//          0   - no data received, str is not modified
//          -1  - error, str can be modified
int os::net::Socket::recv_fd(string & str)
{
    char buf[gl::NetworkLimits::bufferSize];
    int n;

    n = ::recv( native(data).fd, buf, sizeof(buf) - 1, 0);

    if ( n < 0 ) return -1;
    if ( n == 0 ) return 0;

    str += string(buf, n);

    if ( str.size() > gl::NetworkLimits::maxMsgSize )
        return -1;

    return n;
}

void os::net::TcpClient::init(gl::intint tryTime)
{
    unsigned short port = addr.getPort();

    if ( port == 0 ) return;

    OTYPE::fd_type & descr = native(data).fd;

    descr = ::socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
    if ( descr == OTYPE::INVALID ) return;

    state = Created;

    struct sockaddr_in & serverAddr = native(data).a;

    serverAddr.sin_family = AF_INET;
    serverAddr.sin_port = htons(port);

    addr.set(&serverAddr.sin_addr, sizeof(serverAddr.sin_addr));

    if ( !connectSocket(descr, (struct sockaddr *)&serverAddr, gl::ii2ul(tryTime)) )
    {
        closeDescriptor(descr);
        descr = OTYPE::INVALID;
        state = Uninited;
    }
    else
        state = Connected;

    // socket will be closed by dtor
}

// ------------------------------------------------------
//
//                           |             r1 (recv_fd())
//                           |     -1              0               1+
//  r2 (isPacketComplete())  |
//  -------------------------|---------------------------------------------
//          PKT_ERROR        |  PKT_ERROR      PKT_ERROR       PKT_ERROR
//       PKT_INCOMPLETE      |  PKT_ERROR      PKT_ERROR     PKT_INCOMPLETE
//        PKT_COMPLETE       | PKT_COMPLETE   PKT_COMPLETE    PKT_COMPLETE
//
gl::PacketStatus os::net::TcpSocket::tryReadMessage()
{
    const bool PDD = PDDG;
    int r1 = recv_fd(request.accessRaw());
    gl::PacketStatus r2 = request.extractMsg();

    if ( r2 == gl::PKT_COMPLETE )
        return gl::PKT_COMPLETE;
    if ( r2 == gl::PKT_INCOMPLETE && r1 > 0 )
    {
        if (PDD)
        {
            string raw = request.accessRaw();
            gl::replaceAll(raw, "\r", "\\r");
            gl::replaceAll(raw, "\n", "\\n");
            std::cout << "TcpSocket::tryReadMessage{" << raw << "}" << std::flush;
        }
        return gl::PKT_INCOMPLETE;
    }
    return gl::PKT_ERROR;
}

// ------------------------------------------------------
void os::net::TcpAcceptor::init()
{
    unsigned short port = addr.getPort();

    if ( port == 0u ) return;

    OTYPE::fd_type & descr = native(data).fd;

    descr = ::socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
    if ( descr == OTYPE::INVALID )
    {
        throw gl::ex("tcp socket failed on $1 error=$2", addr.str(), gl::tos(getLastError()));
    }

    state = Created;

    if ( !setReuse(descr) )
    {
        throw gl::ex("tcp socket reuse failed on " + addr.str());
    }


    state = OptReused;

    struct sockaddr_in & serverAddr = native(data).a;

    serverAddr.sin_family = AF_INET;
    serverAddr.sin_port = htons(port);
    serverAddr.sin_addr.s_addr = htonl(INADDR_ANY);

    if (::bind(descr, (struct sockaddr *)&serverAddr, sizeof(struct sockaddr_in)) < 0)
    {
        throw gl::ex("tcp socket bind failed on " + addr.str());
    }

    state = Bound;

    const int LISTEN_NUMBER = SOMAXCONN; //128
    if (::listen(descr, LISTEN_NUMBER) < 0)
    {
        throw gl::ex("tcp socket listen failed on " + addr.str());
    }

    state = Listened;
}

os::net::Socket * os::net::TcpAcceptor::returnSocketConnected(gl::NetworkLimits nl)
{
    if ( state != Listened ) return 0;

    int error;
    struct sockaddr_in fromAddr;
    socklen_t fromAddrSize;
    const int MAXHOSTNAMELEN = 127;
    char hostname[MAXHOSTNAMELEN + 1];

    fromAddrSize = sizeof(struct sockaddr_in);

    OTYPE::fd_type fd = ::accept(getDescr(data), (struct sockaddr *)&fromAddr,  &fromAddrSize);

    if (fd == OTYPE::INVALID) return 0;

    error = getnameinfo((struct sockaddr *)&fromAddr, fromAddrSize, hostname,
                        MAXHOSTNAMELEN, 0, 0, 0);

    string addrip = "0.0.0.0";
    string addrnm = "<unknown>";
    unsigned short port = 0;

    addrip = inet_ntoa(fromAddr.sin_addr);
    port = ntohs(fromAddr.sin_port);

    if (!error)
    {
        addrip = inet_ntoa(fromAddr.sin_addr);
        addrnm = hostname;
        port = ntohs(fromAddr.sin_port);
    }

    PlaceholderSocket retSocData;
    native(retSocData).fd = fd;
    native(retSocData).a = fromAddr;

    IpAddr il(addrip.c_str(), port);
    TcpReader * pr = new TcpReader(request.protocol, retSocData, il, addrnm, nl);
    REPORT(pr);
    return pr;
}


// ------------------------------------------------------
void os::net::Multicast::init()
{
    unsigned short port = addr.getPort();

    OTYPE::fd_type & descr = native(data).fd;

    descr = ::socket(AF_INET, SOCK_DGRAM, IPPROTO_UDP);
    if ( descr == OTYPE::INVALID )
    {
        throw gl::ex("udp socket failed on $1 descriptor=$2", addr.str(), gl::tos(descr));
    }

    state = Created;

    if ( !setReuse(descr) )
    {
        throw gl::ex("socket reuse failed on " + addr.str());
    }

    state = OptReused;

    struct sockaddr_in & serverAddr = native(data).a;

    serverAddr.sin_family = AF_INET;
    serverAddr.sin_port = htons(port);
    serverAddr.sin_addr.s_addr = htonl(INADDR_ANY);

    if (::bind(descr, (struct sockaddr *)&serverAddr, sizeof(struct sockaddr_in)) < 0)
    {
        throw gl::ex("udp socket bind failed on " + addr.str());
    }

    state = Bound;

    // join multicast group on first interface
    struct ip_mreq group;
    const string & strIp = addr.strIp();

    group.imr_multiaddr.s_addr = inet_addr(strIp.c_str());
    group.imr_interface.s_addr = htonl(INADDR_ANY);
    if (setsockopt(descr, IPPROTO_IP, IP_ADD_MEMBERSHIP, (char *)&group, sizeof(group)) < 0)
        throw gl::ex("udp socket join multicast group failed on " + addr.str());

    serverAddr.sin_addr.s_addr = inet_addr(strIp.c_str());

    state = OptAdded;

    return;
}

bool os::net::Multicast::send_msg(const string & s)
{
    string raw = request.msg2raw(s);
    struct sockaddr_in & destAddr = native(data).a;

    size_t ret = ::sendto( native(data).fd, raw.c_str(), gl::st2i(raw.length()), 0,
                           (struct sockaddr *)&destAddr, sizeof(destAddr) );
    if ( ret != raw.length() ) return false;
    return true;
}

os::net::Selector::WaitActivityResult os::net::Selector::waitActivity(gl::intint delay)
{
    WaitActivityResult res;

    fd_set rset;
    struct timeval tv;

    os::Timer timer;
    gl::intint waitingTime = delay;
    gl::intint elapsedTime;

start:

    FD_ZERO(&rset);

    const bool PDD = false;

    if (PDD) std::cout << "(";

    int max = 0;

    size_t sz = acceptors.size();
    for ( size_t i = 0; i < sz; ++i )
    {
        OTYPE::fd_type descr = getDescr(acceptors[i]->getData());
        if ( descr == OTYPE::INVALID ) continue;
        FD_SET( (descr), (&rset) );
        const int descri = gl::x2i(descr);
        if ( max < descri ) max = descri;

        if (PDD && i) std::cout << ",";
        if (PDD) std::cout << descr;
    }

    for ( std::list<Reader>::iterator i = readers.begin(); i != readers.end(); ++i )
    {
        OTYPE::fd_type descr = getDescr(i->socket->getData());
        if ( descr == OTYPE::INVALID ) continue;
        FD_SET( (descr), (&rset));
        const int descri = gl::x2i(descr);
        if ( max < descri ) max = descri;

        if (PDD) std::cout << "," << descr;
    }

    if (PDD) std::cout << ")" << std::flush;

    tv.tv_sec = gl::ii2ul(waitingTime / 1000);
    tv.tv_usec = gl::ii2ul(1000 * (waitingTime % 1000));

    ::select(max + 1, &rset, NULL, NULL, &tv);

    for ( int i = gl::st2i(sz) - 1; i >= 0; i-- )
    {
        OTYPE::fd_type descr = getDescr(acceptors[i]->getData());
        if ( descr == OTYPE::INVALID ) continue;
        if ( FD_ISSET(descr, &rset) )
        {
            res.acceptor_index = i;

            res.socket = acceptors[i]->returnSocketConnected(netLimits);
            if ( !res.socket ) continue;
            if ( res.socket == acceptors[i] )
            {
                res.code = 1;
                if (PDD)
                {
                    std::cout << "acceptor:" << i << ' ';
                    std::cout << ((void *)res.socket) << ' ';
                    std::cout << ((void *)acceptors[i]) << ' ';

                }
            }
            else res.code = 2;
            return res;
        }
    }

    for ( std::list<Reader>::iterator i = readers.begin(); i != readers.end(); ++i )
    {
        OTYPE::fd_type descr = getDescr(i->socket->getData());
        if ( descr == OTYPE::INVALID ) continue;
        if ( FD_ISSET(descr, &rset) )
        {
            res.socket = i->socket;
            res.code = 3;
            res.listitr = i;
            return res;
        }
    }

    elapsedTime = timer.get();
    if ( elapsedTime < delay )
    {
        waitingTime = delay - elapsedTime;
        goto start;
    }

    return res;
}

os::net::Socket * os::net::Selector::wait(gl::intint delay)
{
    const bool PDD = PDDG;

    os::Timer timer;
    gl::intint waitingTime;
    gl::intint elapsedTime = 0;

    while ( 1 )
    {
        waitingTime = delay - elapsedTime;
        WaitActivityResult wres = waitActivity(waitingTime);

        if ( wres.socket == 0 ) return 0;

        if ( wres.code == 1 ) // data on acceptor's socket (this is UDP)
        {
            gl::PacketStatus status = wres.socket->tryReadMessage();

            switch (status)
            {
                case gl::PKT_COMPLETE :
                    if (PDD) std::cout << "\n-> udp message received - "
                                           << wres.socket->getAddr().str() << '\n';
                    return wres.socket;

                case gl::PKT_ERROR :
                    if (PDD) std::cout << "\n-> udp message error - "
                                           << wres.socket->getAddr().str() << '\n';
                    break;

                default:
                    throw gl::Never("os::net::Selector::wait [$1]", gl::tos(status));
            }
        }

        else if ( wres.code == 2 ) // acceptor created new socket
        {
            if (PDD) std::cout << "\n-> new connection - ";

            cleanReaders();

            if ( addOwnReader( wres.socket ) )
            {
                if (PDD) std::cout << wres.socket->getAddr().str();
            }
            else
            {
                if (PDD) std::cout << "busy\n";
                delete wres.socket; // this socket is definitely owned
            }
        }

        else if ( wres.code == 3 ) // data on reading socket
        {
            Socket * soc = wres.socket;
            gl::PacketStatus status = soc->tryReadMessage();

            switch (status)
            {
                case gl::PKT_COMPLETE :
                    if (PDD) std::cout << "\n-> message received - "
                                           << wres.socket->getAddr().str() << '\n';
                    readers.erase( wres.listitr );
                    return soc;

                case gl::PKT_INCOMPLETE :
                    if (PDD) std::cout << "\n-> message incomplete - "
                                           << wres.socket->getAddr().str() << '\n';
                    break;

                case gl::PKT_ERROR :
                    if (PDD) std::cout << "\n-> message error - "
                                           << wres.socket->getAddr().str() << '\n';

                    {
                        bool own =  wres.listitr->own;
                        readers.erase( wres.listitr );
                        if ( !own )
                            return soc;
                        delete soc;
                    }
                    break;

                default:
                    throw gl::Never("os::net::Selector::wait [$1]", gl::tos(status));
            }
        }
        elapsedTime = timer.get();
        if ( elapsedTime > delay ) return 0;
    }
}


