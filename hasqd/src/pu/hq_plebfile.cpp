// Hasq Technology Pty Ltd (C) 2013-2015

#include "ma_utils.h"
#include "os_exec.h"
#include "hq_plebfile.h"

Plebfile::Plebfile(GlobalSpace * g, gl::Token & t):
    gs(g), tok(t), err(er::REQ_MSG_BAD), root(gs->config->plebDir)
{
}


string Plebfile::process()
{
    if (false);

    else if ( tok.is("put") )
        return put(false);

    else if ( tok.is("mkdir") )
        return mkdir();

    else if ( tok.is("del") )
        return del();

    else if ( tok.is("app") )
        return put(true);

    else if ( tok.is("get") )
        return get();

    else if ( tok.is("list") )
        return list();

    else if ( tok.is("exec") )
        return exec();

    else if ( tok.is("clean") )
        return clean();

    return err;
}

string Plebfile::put(bool app)
{
    if ( !tok.next() ) return err;

    string filename = tok.sub();

    if ( !tok.next() ) return err;

    string data = ma::b64dec(tok.sub());

    filename = (root + filename).str();

    auto flags = std::ios::binary | std::ios::binary; //workaround MS bug
    if ( app ) flags = flags | std::ios::app;

    std::ofstream of(filename.c_str(), flags);

    if ( !of )
        return er::Code(er::FILE_CANT_CREATE);

    of << data;

    return er::Code(er::OK);
}

string Plebfile::mkdir()
{
    if ( !tok.next() ) return err;

    os::Path dirname = root + tok.sub();

    if ( os::FileSys::trymkdir(dirname).isdir() )
        return er::Code(er::OK);

    return er::Code(er::FILE_CANT_CREATE);
}

string Plebfile::del()
{
    if ( !tok.next() ) return err;

    os::Path dirname = root + tok.sub();

    if ( os::FileSys::erase(dirname) )
        return er::Code(er::OK);

    return er::Code(er::REQ_PATH_BAD);
}

string Plebfile::get()
{
    if ( !tok.next() ) return err;

    string filename = tok.sub();

    os::Path x = root;
    x += filename;
    if ( !x.isfile() )
        return er::Code(er::REQ_PATH_BAD);

    return er::Code(er::OK).str() + ' ' + ma::b64enc(gl::file2str(x.str()));
}

string Plebfile::list()
{
    if ( tok.next() )
    {
        string filename = tok.sub();

        os::Path x = root;
        x += filename;

        if ( x.isdir() )
            return er::Code(er::OK).str() + gl::CRLF + filename + '/';

        if ( x.isfile() )
            return er::Code(er::OK).str() + gl::CRLF + filename;

        return er::Code(er::REQ_PATH_BAD);
    }

    os::Dir dir = os::FileSys::readDirEx(root, true, true);
    string r = er::Code(er::OK).str() + gl::CRLF;

    for ( size_t i = 0; i < dir.dirs.size(); i++ )
        r += dir.dirs[i] + '/' + gl::CRLF;

    for ( size_t i = 0; i < dir.files.size(); i++ )
        r += dir.files[i].first + gl::CRLF;

    return r;
}

string Plebfile::exec()
{
    if ( !tok.next() ) return err;

    string path = tok.sub();

    if ( path == "." )
        path = root.str();
    else
        path = (root + path).str();

    string cmd;
    if ( tok.next() ) cmd = tok.sub();
    while ( tok.next() ) cmd += " " + tok.sub();

    if ( !os::execInShell(cmd, path) )
        return er::Code(er::EXEC_FAILED);

    return er::Code(er::OK);
}

string Plebfile::clean()
{
    os::Path dirname = root;

    os::FileSys::erase(dirname);
    os::FileSys::trymkdir(dirname);

    return er::Code(er::OK);
}

