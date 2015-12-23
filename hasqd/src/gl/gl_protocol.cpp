// Hasq Technology Pty Ltd (C) 2013-2015

#include "gl_protocol.h"
#include "gl_utils.h"
#include "gl_except.h"

const char * gl::Http_base::logo = "";

string gl::Http_base::httpHeaderHead(const char * mime)
{
    string r = HTTP_HEADER_OK; r += CRLF;
    r += "Server: "; r += logo; r += CRLF;
    r += "Access-Control-Allow-Origin: *"; r += CRLF;
    r += "Content-Type: "; r += mime; r += CRLF;
    r += CONTENT_LENGTH;
    return r;
}

string gl::Http_base::httpHeader(size_t sz, const char * mime)
{
    return httpHeaderHead(mime) + tos(sz) + CRLF2;
}

// Http_base::httpHeader() + packet + CRLF2
gl::ProtocolPacketStatus gl::Http_base::extrMsgClient(string & msg, const string & raw, Pmd * p) const
{
    size_t pos, pos_body, pos_clen, clen;

    if ( raw.length() == 0 )
        return PRT_PKT_NO_INFO;

    if ( raw.find(HTTP_HEADER_OK) != 0 )
        return PRT_PKT_BAD_PROTOCOL;

    pos = raw.find(CRLF2);
    if ( pos == raw.npos )
        return PRT_PKT_INCOMPLETE;
    pos_body = pos + CRLF2_length;

    pos_clen = raw.find(CONTENT_LENGTH);
    if ( pos_clen == raw.npos || pos_clen > pos_body )
        return PRT_PKT_ERROR;
    pos_clen += CONTENT_LENGTH_length;

    pos = raw.find_first_not_of(DIGITS, pos_clen);
    clen = gl::toi(raw.substr(pos_clen, pos - pos_clen).c_str());
    if ( clen == 0 )
        return PRT_PKT_ERROR;

    if ( raw.size() < pos_body + clen )
        return PRT_PKT_INCOMPLETE;

    msg = raw.substr(pos_body, clen);
    return PRT_PKT_COMPLETE;
}

// "GET /" + packet + " HTTP" + ... + CRLF2
// "GET /" + packet + CRLF2
gl::ProtocolPacketStatus gl::HttpGet::extrMsgServer(string & msg, const string & raw, Pmd * p) const
{
    size_t pos_crlf2, pos_http, pos_xfwd, pos_crlf, pos;
    string ip;

    if (raw.length() == 0)
        return PRT_PKT_NO_INFO;

    if (raw.find(GET) == 0)
    {
        // CRLF2 must be present at the end
        pos_crlf2 = raw.find(CRLF2);

        if ( pos_crlf2 == raw.npos )
            return PRT_PKT_INCOMPLETE;

        if ( pos_crlf2 != raw.length() - CRLF2_length )
            return PRT_PKT_ERROR;

        pos = GET_length;

        pos_http = raw.find(HTTP);
        // response from another publisher to our earlier request
        // must not contain HTTP
        if ( pos_http == raw.npos )
        {
            if ( pos_crlf2 == pos )
                msg = "";
            else
                msg = raw.substr(pos, pos_crlf2 - pos);
        }
        // request from user must contain HTTP
        else
        {
            msg = raw.substr(pos, pos_http - pos);

            pos_xfwd = raw.find(XFWD, pos_http);
            if ( pos_xfwd != raw.npos )
            {
                pos_crlf = raw.find(CRLF, pos_xfwd);
                pos = pos_xfwd + XFWD_length;
                ip = raw.substr(pos, pos_crlf - pos);
            }
        }
        if ( !replaceHexCodes(msg) )
            return PRT_PKT_ERROR;

        if (p)
        {
            *p = Pmd(Pmd::HttpGet);
            p->ip = ip;
        }

        return PRT_PKT_COMPLETE;

    }
    return PRT_PKT_BAD_PROTOCOL;
}

string gl::HttpGet::msg2raw(const string & s, const Pmd * p) const
{
    if (side == Server)
    {
        const char * m = Pmd().mime;
        if ( p ) m = p->mime;
        return Http_base::httpHeader(s.size(), m) + s + CRLF2;
    }

    return GET + s + CRLF2;
}

gl::ProtocolPacketStatus gl::HttpGet::extractMsg(string & msg, const string & raw, Pmd * p) const
{
    if (side == Server)
        return extrMsgServer(msg, raw, p);

    return extrMsgClient(msg, raw, p);
}

// "POST /" + ... + CONTENT_LENGTH + http_packet_length + ... + CRLF2 + http_packet
// where http_packet is: [...&]HQCOMMAND + hq_packet[&...]
gl::ProtocolPacketStatus gl::HttpPost::extrMsgServer(string & msg, const string & raw, Pmd * p) const
{
    size_t pos_crlf2, pos_body, pos_clen, pos_xfwd, pos;
    size_t clen, len;
    string s;

    if (raw.length() == 0)
        return PRT_PKT_NO_INFO;

    if (raw.find(POST) == 0)
    {
        pos_crlf2 = raw.find(CRLF2);
        if ( pos_crlf2 == raw.npos )
            return PRT_PKT_INCOMPLETE;
        pos_body = pos_crlf2 + CRLF2_length;

        pos_clen = raw.find(CONTENT_LENGTH);
        if ( pos_clen == raw.npos || pos_clen >= pos_body )
            return PRT_PKT_ERROR;
        pos_clen += CONTENT_LENGTH_length;

        pos = raw.find_first_not_of(DIGITS, pos_clen);
        clen = gl::toi(raw.substr(pos_clen, pos - pos_clen).c_str());
        if ( clen == 0 )
            return PRT_PKT_ERROR;

        len = raw.length() - pos_body;
        if ( len == clen )
        {
            s = raw.substr(pos_body, len);
            pos = s.find(HQCOMMAND);
            if ( pos == s.npos || (pos > 0 && s[pos - 1] != '&') )
                return PRT_PKT_ERROR;

            pos_body = pos + HQCOMMAND_length;

            pos = s.find('&', pos_body);
            if ( pos == s.npos )
                s = s.substr(pos_body, s.length() - pos_body);
            else
                s = s.substr(pos_body, pos - pos_body);

            if ( !replaceHexCodes(s) )
                return PRT_PKT_ERROR;

            msg = s;

            if (p)
            {
                *p = Pmd(Pmd::HttpPost);
                pos_xfwd = raw.find(XFWD);
                if ( pos_xfwd != raw.npos && pos_xfwd < pos_crlf2 )
                {
                    pos_xfwd = pos_xfwd + XFWD_length;
                    pos = raw.find(CRLF, pos_xfwd);
                    p->ip = raw.substr(pos_xfwd, pos - pos_xfwd);
                }
            }
            return PRT_PKT_COMPLETE;
        }
        if ( len < clen )
            return PRT_PKT_INCOMPLETE;
    }
    return PRT_PKT_BAD_PROTOCOL;
}

string gl::HttpPost::msg2raw(const string & s, const Pmd * p) const
{
    if (side == Server)
    {
        const char * m = Pmd().mime;
        if ( p ) m = p->mime;
        return Http_base::httpHeader(s.size(), m) + s + CRLF2;
    }

    string ret = POST;
    string cmd = HQCOMMAND + s;

    return ret + " " + HTTP_HEADER_VERSION + CRLF + CONTENT_LENGTH + gl::tos(cmd.length()) + CRLF2 + cmd;
}

gl::ProtocolPacketStatus gl::HttpPost::extractMsg(string & msg, const string & raw, Pmd * p) const
{
    if (side == Server)
        return extrMsgServer(msg, raw, p);

    return extrMsgClient(msg, raw, p);
}

string gl::Http::msg2raw(const string & s, const Pmd * p) const
{
    if ( !p )
        throw Never("Http::msg2raw Pmd must be supplied");

    if ( p->format == Pmd::HttpGet )
        return HttpGet::msg2raw(s, p);

    if ( p->format == Pmd::HttpPost )
        return HttpPost::msg2raw(s, p);

    throw Never("Http::msg2raw bad Pmd format");
}

gl::ProtocolPacketStatus gl::Http::extractMsg(string & msg, const string & raw, Pmd * p) const
{
    gl::ProtocolPacketStatus k = HttpGet::extractMsg(msg, raw, p);

    if ( k != PRT_PKT_NO_INFO && k != PRT_PKT_BAD_PROTOCOL )
        return k;
    return HttpPost::extractMsg(msg, raw, p);
}

string gl::ProtHq::msg2rawHq(const string & s) const
{
    return s + CRLF2;
}

// Server: line + CRLF2
// Server informal: line + CR|LF + ...
// Client: line + {[ CRLF + line ]} + CRLF2
gl::ProtocolPacketStatus gl::ProtHq::extractMsg(string & msg, const string & raw, Pmd * p) const
{
    if (p)
        *p = Pmd(Pmd::Hq);

    size_t sz = raw.size();

    if ( sz == 0 )
        return PRT_PKT_NO_INFO;

    if ( side == Server )
    {
        size_t i = raw.find_first_of(CRLF);
        if ( i != string::npos )
        {
            msg = raw.substr(0, i);
            return PRT_PKT_COMPLETE;
        }
        return PRT_PKT_INCOMPLETE;
    }

    string endl = CRLF2;
    size_t pos = raw.rfind(endl);

    if ( pos == string::npos )
        return PRT_PKT_INCOMPLETE;

    if ( pos + endl.size() != sz )
        return PRT_PKT_ERROR;

    msg = raw.substr(0, pos);
    return PRT_PKT_COMPLETE;
}

string gl::HttpHq::msg2raw(const string & s, const Pmd * p) const
{
    if (!p || p->format == Pmd::Hq )
        return ProtHq::msg2raw(s, p);

    if ( p->format == Pmd::HttpGet )
        return HttpGet::msg2raw(s, p);

    if ( p->format == Pmd::HttpPost )
        return HttpPost::msg2raw(s, p);

    return ProtHq::msg2raw(s, p);
}

gl::ProtocolPacketStatus gl::HttpHq::extractMsg(string & msg, const string & raw, Pmd * p) const
{
    gl::ProtocolPacketStatus k = HttpGet::extractMsg(msg, raw, p);

    if ( k != PRT_PKT_NO_INFO && k != PRT_PKT_BAD_PROTOCOL )
        return k;

    k = HttpPost::extractMsg(msg, raw, p);

    if ( k != PRT_PKT_NO_INFO && k != PRT_PKT_BAD_PROTOCOL )
        return k;

    return ProtHq::extractMsg(msg, raw, p);
}

string gl::ProtocolReadBuffer::msg2raw(const string & s) const
{
    return protocol->msg2raw(s, &meta);
}

gl::PacketStatus gl::ProtocolReadBuffer::extractMsg()
{
    gl::ProtocolPacketStatus k = protocol->extractMsg(msg, raw, &meta);

    switch (k)
    {
        case PRT_PKT_INCOMPLETE : status = PKT_INCOMPLETE; break;
        case PRT_PKT_COMPLETE   : status = PKT_COMPLETE; break;
        default                 : status = PKT_ERROR;
    }
    return status;
}

void gl::PacketMetaData::resolveMime(const string & f)
{
    string::size_type i = f.rfind(".");

    mime = "application/octet-stream";

    if ( i == string::npos ) return;

    else if ( gl::isSufx(f, ".txt") ) mime = "text/plain";
    else if ( gl::isSufx(f, ".html") ) mime = "text/html";
    else if ( gl::isSufx(f, ".css") ) mime = "text/css";
    else if ( gl::isSufx(f, ".js") ) mime = "application/javascript";
    else if ( gl::isSufx(f, ".gif") ) mime = "image/gif";
    else if ( gl::isSufx(f, ".png") ) mime = "image/png";
    else if ( gl::isSufx(f, ".jpg") ) mime = "image/jpeg";
    else if ( gl::isSufx(f, ".pdf") ) mime = "application/pdf";
}


