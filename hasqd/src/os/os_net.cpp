// ================================

#include <fstream> // debug only

#include "gl_utils.h"

#include "os_net.h"
#include "os_thread.h"

int    os::net::NetInitialiser::pid_ = -1;

char os::net::NetInitialiser::hostname_[100];
char os::net::NetInitialiser::ips_[16][16];
int os::net::NetInitialiser::ips_size_ = 0;
string os::net::NetInitialiser::xserv;
string os::net::NetInitialiser::xauth;

os::net::NetInitialiser::NetInitialiser()
{
    if ( pid_ > 0 ) throw gl::Never("NetInitialiser: double call");

    os::net::openNetwork();

    findip();
    pid_ = findpid();
}

string os::net::NetInitialiser::str()
{
    std::ostringstream os;

    os << "HOST: " << hostname_ << " =" << list_ips(true) << " pid:" << pid_ ;

    return os.str();
}

os::net::NetInitialiser::~NetInitialiser()
{
    os::net::closeNetwork();
}

const string & os::net::Socket::getReceivedMessage(string * raw) const
{
    throw gl::ex("getReceivedMessage called on abstract Socket");
}

bool os::net::TcpSocket::send_msg(const string & s)
{
    string raw = request.msg2raw(s);
    return send_fd(raw.c_str(), gl::st2i(raw.size()));
}

bool os::net::Socket::send_msg(const string & s)
{
    throw gl::ex("Socket::sendMsg called on abstract Socket");
}

os::net::Selector::~Selector()
{
    while ( !readers.empty() )
    {
        const Reader & r = readers.front();
        if ( r.own )
            delete r.socket;
        readers.pop_front();
    }
}

gl::PacketStatus os::net::TcpSocket::recv_msg(string & str)
{
    Selector sel(netLimits);
    sel.addExternalReader(this);
    Socket * s = sel.wait(netLimits.maxReadTime);
    if ( !s )
        return gl::PKT_INCOMPLETE;  // timeout
    if ( s != this ) throw gl::ex("Internal error: bad selector");

    gl::PacketStatus st = request.getStatus();
    if ( gl::PKT_COMPLETE == st )
        str = getReceivedMessage();

    return st;
}

string os::net::TcpSocket::recvMsgOrEmpty()
{
    string s;
    gl::PacketStatus st = recv_msg(s);

    if ( st == gl::PKT_COMPLETE )
        return s;
    return "";
}

//               r (recv_fd())
//       -1           0            1+
//  --------------------------------------------
//   PKT_ERROR   PKT_ERROR   PKT_COMPLETE
//
gl::PacketStatus os::net::Multicast::tryReadMessage()
{
    int r = recv_fd(request.accessRaw());

    if ( r > 0 )
        return request.extractMsg();

    return gl::PKT_ERROR;
}

// ------------------------------------------------------
void os::net::Selector::cleanReaders()
{
    std::list<Reader>::iterator iter = readers.begin();
    while ( iter != readers.end() )
    {
        if ( iter->timer.get() > netLimits.maxReadTime )
        {
            if ( iter->own )
                delete iter->socket;
            iter = readers.erase(iter);
        }
        else iter++;
    }
}

bool os::net::Selector::addOwnReader(Socket * s)
{
    if ( !s || readers.size() == MAXREADERS ) return false;
    readers.push_back( Reader( s, true ) );
    return true;
}

void os::net::Selector::addExternalReader(Socket * s)
{
    readers.push_back( Reader( s, false ) );
}

string os::net::Socket::stateStr() const
{
    switch (state)
    {
        case Uninited  : return "Uninited";
        case Created   : return "Created";
        case OptReused : return "OptReused";
        case Bound     : return "Bound";
        case Listened  : return "Listened";
        case Connected : return "Connected";
        case Requested : return "Requested";
        case OptAdded  : return "OptAdded";
    }
    return "Unknown:" + gl::tos(state);
}

string os::net::NetInitialiser::list_ips(bool all)
{
    if ( !all )
    {
        if ( !ips_size_ ) return "";
        return ips_[0];
    }

    string allips;
    for (int i = 0; i < ips_size_; i++)
    {
        allips += string(" ") + ips_[i] + ';';
    }

    return allips;
}
