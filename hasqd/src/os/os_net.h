// ================================

#ifndef _OS_TCPLINK
#define _OS_TCPLINK

#include <vector>
#include <string>
#include <list>

#include "gl_defs.h"
#include "gl_protocol.h"

#include "os_ipaddr.h"
#include "os_thread.h"
#include "os_timer.h"

using std::string;

namespace os
{
namespace net
{

void openNetwork();
void closeNetwork();
int getLastError();

struct NetInitialiser
{
    static int  pid_;
    static char hostname_[100];
    static char ips_[16][16];
    static int  ips_size_;

    NetInitialiser();
    ~NetInitialiser();
    static string str();

    static void findip();
    static int findpid();
    static string list_ips(bool all);
};

class Selector;

class Socket
{
        void init();

    protected:
        PlaceholderSocket   data;
        gl::ProtocolReadBuffer request;
        IpAddr              addr;

        enum State
        {
            Uninited = 0, Created, OptReused,
            Bound, Listened, Connected,
            Requested, OptAdded
        };

        State state;

        Socket(const gl::Protocol * p, IpAddr il) :
            request(p), addr(il), state(Uninited) { init(); }

        // inheritable non-virtual for code sharing
        bool send_fd(const char *, int sz);
        int recv_fd(string & str);

    public:
        const PlaceholderSocket & getData() const { return data; }

        virtual gl::PacketStatus tryReadMessage() { return gl::PKT_ERROR; }
        virtual Socket * returnSocketConnected(gl::NetworkLimits nl) { return this; }
        virtual const string & getReceivedMessage(string * raw = 0) const;

        virtual ~Socket() = 0;

        virtual bool send_msg(const string & s);

        const IpAddr & getAddr() const { return addr; }
        void setAddr(string newaddr) { addr.reset_ip(newaddr.c_str()); }

        string stateStr() const;

        gl::ProtocolReadBuffer & accessRequest() { return request; }
};


class TcpSocket : public Socket
{
    protected:
        gl::NetworkLimits netLimits;

        TcpSocket(const gl::Protocol * p, IpAddr il, gl::NetworkLimits nl) :
            Socket(p, il), netLimits(nl) {}

        gl::PacketStatus tryReadMessage();
        const string & getReceivedMessage(string * raw = 0) const { return request.getMsg(raw); }

    public:
        gl::PacketStatus recv_msg(string & str);
        string recvMsgOrEmpty();
        bool send_msg(const string & s);
};

// This object is returned as a result of TcpAcceptor::returnSocketConnected()
class TcpReader : public TcpSocket
{
        string fromName;

    public:
        TcpReader(const gl::Protocol * p, PlaceholderSocket d, IpAddr il, string nm, gl::NetworkLimits nl) :
            TcpSocket(p, il, nl), fromName(nm) { data = d; }
};

class TcpClient : public TcpSocket
{
        void init(gl::intint tryTime);

    public:

        TcpClient(const gl::Protocol * p, IpAddr il,
                  gl::NetworkLimits nl, const gl::ProxyData * px);

        bool isConnected() const { return state == Connected; }
};


class TcpAcceptor : public Socket
{
        void init();

    public:
        TcpAcceptor(const gl::Protocol * p, IpAddr il) : Socket(p, il) { init(); }

        Socket * returnSocketConnected(gl::NetworkLimits nl);
};

class Multicast : public Socket
{
        void init();

    public:
        Multicast(const gl::Protocol * p, IpAddr il) : Socket(p, il) { init(); }

        bool send_msg(const string & s);
        gl::PacketStatus tryReadMessage();
        const string & getReceivedMessage(string * raw = 0) const { return request.getMsg(0); }
};

class Selector
{
        gl::NetworkLimits netLimits;
        std::vector<Socket *> acceptors;

        struct Reader
        {
            Socket * socket;
            Timer timer;
            bool own;
            Reader(Socket * s, bool o): socket(s), own(o) {}
        };

        static const size_t MAXREADERS = 10000;
        std::list<Reader> readers;

        void cleanReaders();

        struct WaitActivityResult
        {
            Socket * socket;
            int acceptor_index;
            int code;
            std::list<Reader>::iterator listitr;

            WaitActivityResult(): socket(0), acceptor_index(-1), code(0) {}
        };

        WaitActivityResult waitActivity(gl::intint delay);
        bool addOwnReader(Socket * s);

    public:
        Selector( gl::NetworkLimits nl ) : netLimits(nl) {}
        ~Selector();
        void addExternalReader(Socket * s);

        void addAcceptor(Socket * s) { acceptors.push_back(s); }

        Socket * wait(gl::intint delay);
        const gl::NetworkLimits & getNetLimits() const { return netLimits; }

};

}
} // os net

#endif
