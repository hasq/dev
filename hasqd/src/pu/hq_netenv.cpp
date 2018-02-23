// Hasq Technology Pty Ltd (C) 2013-2016

#include <cctype>

#include "os_filesys.h"

#include "hq_globalspace.h"

#include "hq_netenv.h"

sgl::Link NetEnv::link(const string & addr) const
{
    sgl::Link r;
    r.prot = clntProtocol;
    r.nl = gs->config->netLimits;

    r.tcpto = addr;
    if ( !proxy.is() ) return r;

    if ( addr == gs->config->seIpLink.str() ) return r;

    if ( addr == proxy.remote ) return r;

    r.tcpto = proxy.remote;

    r.px.remote = addr;
    r.px.auth64 = proxy.auth64;

    return r;
}

string Drop::process(const string & c, const string & data)
{
    os::Path f(gs->config->dropDir);

    if ( !f.isdir() )
        os::FileSys::trymkdir(f);

    if ( c == "get" || c == "GET" )
    {
        cleandir();

        f += data;
        string r = gl::file2str(f.str());

        if ( r.empty() )
            return er::Code(er::OK).str();

        f.erase();

        return er::Code(er::OK).str() + " " + r;
    }

    // check file name
    for ( size_t i = 0; i < c.size(); i++ )
    {
        if ( std::isalnum(c[i]) ) continue;
        if ( c[i] == '.' || c[i] == '-' || c[i] == '_' ) continue;
        return er::Code(er::REQ_FILE_BAD).str();
    }

    if ( c.size()    > DROP_MAX_FILENAME )
        return er::Code(er::REQ_FILE_BAD).str();

    if ( data.size() > DROP_MAX_FILESIZE )
        return er::Code(er::REQ_FILE_RAW).str();

    cleandir();

    f += c;

    {
        std::ofstream of(f.str().c_str(), std::ios::binary);
        of << data;
    }

    if ( !f.isfile() )
        return er::Code(er::REQ_BUSY).str();

    return er::Code(er::OK).str();
}

void Drop::cleandir()
{
    os::Path dd(gs->config->dropDir);

    os::Dir dir = os::FileSys::readDir(dd);

    for ( size_t i = 0; i < dir.files.size(); i++ )
    {
        os::Path file = dd + dir.files[i].first;

        if ( file.howold() > gs->config->dropTimeout )
            file.erase();
    }
}

