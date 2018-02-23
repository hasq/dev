// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _GL_HTTP
#define _GL_HTTP

/*
            Class hierarchy
            ---------------

               Protocol
              /        \
             /          \
            /(v)         \(v)
       ProtHq          Http_base
        \               /  \
         \             /    \
          \     HttpGet    HttpPost
           \       |  \   / |
            \      |   \ /  |
             \     |    X   |
              \    |   / \  |
               \   |  /   \ |
                HttpHq     Http

Http class is
    1. for test web server
    2. not part of product server
    3. can throw up


                Sequence of events/calls
                ------------------------

           |       Send       |        Recv
  --------------------------------------------------
   Server  |   3 - reply      |  2 - request received
           |       (msg2raw)  |      (extrMsgServer)
  --------------------------------------------------
   Client  |  1 - request     |  4 - reply received
           |      (msg2raw)   |      (extrMsgClient)
  --------------------------------------------------

*/

#include <string>

#include "gl_defs.h"

using std::string;

namespace gl
{
const char CR = '\r';
const char LF = '\n';
const char CRLF[]                = "\r\n";
const char LF2[]                 = "\n\n";
const char CRLF2[]               = "\r\n\r\n";
const char GET[]                 = "GET /";
const char GETH[]                = "GET http";
const char POST[]                = "POST /";
const char HTTP[]                = " HTTP";
const char DIGITS[]              = "0123456789";
const char CONTENT_LENGTH[]      = "Content-Length: ";
const char HTTP_HEADER_VER10[]   = "HTTP/1.0";
const char HTTP_HEADER_OK10[]    = "HTTP/1.0 200 OK";
const char HTTP_HEADER_VER11[]   = "HTTP/1.1";
const char HTTP_HEADER_OK11[]    = "HTTP/1.1 200 OK";
const char XFWD[]                = "X-Forwarded-For: ";

const char HQCOMMAND[]           = "command=";                 // reserved word

const int CRLF2_length = sizeof(CRLF2) - 1;                    // 4 (-1 to compensate for trailing 0)
const int GET_length = sizeof(GET) - 1;                        // 5
const int CONTENT_LENGTH_length = sizeof(CONTENT_LENGTH) - 1;  // 16
const int XFWD_length = sizeof(XFWD) - 1;                      // 17
const int HQCOMMAND_length = sizeof(HQCOMMAND) - 1;            // 8

struct NetworkLimits
{
    gl::intint maxReadGap;
    gl::intint maxReadTime;
    gl::intint maxConnTime;
    static const int bufferSize = 1024; // for socket reading
    static const size_t maxMsgSize = 1024 * 1024; // 1Mb
    NetworkLimits(): maxReadGap(1000), maxReadTime(30000), maxConnTime(10000) {}
};

enum ProtocolPacketStatus
{
    PRT_PKT_NO_INFO = -3,
    PRT_PKT_BAD_PROTOCOL = -2,
    PRT_PKT_ERROR = -1,
    PRT_PKT_INCOMPLETE = 0,
    PRT_PKT_COMPLETE = 1
};

enum PacketStatus
{
    PKT_ERROR = -1,
    PKT_INCOMPLETE = 0,
    PKT_COMPLETE = 1
};

struct ProxyData
{
    string remote;
    string auth64;
    bool is() const { return !remote.empty(); }
};

struct PacketMetaData
{
    enum Format { Hq, HttpGet, HttpPost } format;
    const char * mime;
    string ip;
    ProxyData proxy;

    PacketMetaData( Format f = Hq ):
        format(f), mime("text/plain"), proxy() {}

    void resolveMime(const string & filename);
};

typedef PacketMetaData Pmd;

class Protocol
{
    public:
        enum Side { Server, Client }; // test only Server

    protected:
        Side side;

    public:
        Protocol(Side s): side(s) {}

        virtual string msg2raw(const string & s, const Pmd * p) const = 0;
        virtual ProtocolPacketStatus extractMsg(string & msg, const string & raw, Pmd * p) const = 0;
};

class Http_base : virtual public Protocol
{
    protected:
        Http_base(Side s): Protocol(s) {}

        static string httpHeaderHead(const char * mime);
        static string httpHeader(size_t sz, const char * mime);

        ProtocolPacketStatus extrMsgClient(string & msg, const string & raw, Pmd * p) const;

        // extractMsg intentionally not in the base class (with virtual extrMsg*)
        // because direct call is required for each particular subclass

    public:
        static const char * logo;
};

class HttpGet : public Http_base
{
        ProtocolPacketStatus extrMsgServer(string & msg, const string & raw, Pmd * p) const;
        string httpProxyHead(string s, const Pmd * p) const;

    public:
        HttpGet(Side s): Protocol(s), Http_base(s) {}

        string msg2raw(const string & s, const Pmd * p) const;
        ProtocolPacketStatus extractMsg(string & msg, const string & raw, Pmd * p) const;
};

class HttpPost : public Http_base
{
        ProtocolPacketStatus extrMsgServer(string & msg, const string & raw, Pmd * p) const;

    public:
        HttpPost(Side s): Protocol(s), Http_base(s) {}

        string msg2raw(const string & s, const Pmd * p) const;
        ProtocolPacketStatus extractMsg(string & msg, const string & raw, Pmd * p) const;
};

class Http: public HttpGet, public HttpPost
{
    public:
        Http(Side s): Protocol(s), HttpGet(s), HttpPost(s) {}

        string msg2raw(const string & s, const Pmd * p) const;
        ProtocolPacketStatus extractMsg(string & msg, const string & raw, Pmd * p) const;
};

class ProtHq : virtual public Protocol
{
        string msg2rawHq(const string & s) const;

    public:
        ProtHq(Side s): Protocol(s) {}

        string msg2raw(const string & s, const Pmd * p) const { return msg2rawHq(s); }
        ProtocolPacketStatus extractMsg(string & msg, const string & raw, Pmd * p) const;
};

class HttpHq : public ProtHq, public HttpGet, public HttpPost
{
    public:
        HttpHq(Side s): Protocol(s), ProtHq(s), HttpGet(s), HttpPost(s) {}

        string msg2raw(const string & s, const Pmd * p) const;
        ProtocolPacketStatus extractMsg(string & msg, const string & raw, Pmd * p) const;
};

class Udp : public Protocol
{
    public:
        Udp(): Protocol(Server) {}

        string msg2raw(const string & s, const Pmd * p) const { return s; }
        ProtocolPacketStatus extractMsg(string & msg, const string & raw, Pmd * p) const
        { msg = raw; return PRT_PKT_COMPLETE; }
};

class ProtocolReadBuffer
{
        PacketStatus status;
        string raw;
        string msg;
        Pmd meta;

    public:
        const Protocol * protocol;

        ProtocolReadBuffer(const Protocol * p): status(PKT_INCOMPLETE), protocol(p) {}

        string msg2raw(const string & s) const;
        PacketStatus extractMsg();

        const string & getMsg(string * r) const { if (r) *r = raw; return msg; }

        PacketStatus getStatus() const { return status; }
        string & accessRaw() { return raw; }

        Pmd & accessPmd() { return meta; }
};

} //gl

#endif


