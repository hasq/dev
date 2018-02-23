// Hasq Technology Pty Ltd (C) 2013-2016

#include <algorithm>

#include "gl_except.h"

#include "os_filesys.h"

os::Path os::FileSys::cwd()
{
    const int PATHSZ = 1000;
    char p[PATHSZ];
    const char * r = os::getCwd(p, PATHSZ);
    if ( !r ) return Path("<path_too_long>");

    return Path(r);
}

os::Path os::FileSys::mkdir(os::Path d)
{
    if ( makeDir(d.str()) ) return d;
    throw gl::ex("Cannot create directory " + d.str());
}

os::Path os::FileSys::trymkdir(os::Path d)
{
    int sz = d.size();
    for ( int i = 0; i < sz; i++ )
    {
        makeDir(d.strP(i));
    }
    return d;
}

string os::Path::enumerate_strI(int i) const
{
    int n = 0;
    size_t pos = 0, pos0 = 0;

    while ( (pos = s.find( SL, pos )) != std::string::npos )
    {
        n++;
        if ( n > i ) break;
        pos++;
        pos0 = pos;
    }

    if ( n == 0 ) return str();
    if ( pos == std::string::npos ) return s.substr(pos0);
    return s.substr(pos0, pos - pos0);
}

string os::Path::strI(int i) const
{
    string r = enumerate_strI(i);
    if ( r.empty() ) throw gl::ex("Invalid path (i) [$1]", s);
    return r;
}

string os::Path::enumerate_strP(int i) const
{
    int n = 0;
    size_t pos = 0;

    while ( (pos = s.find( SL, pos )) != std::string::npos )
    {
        n++;
        if ( n > i ) break;
        pos++;
    }

    if ( n == 0 || pos == std::string::npos ) return str();
    return s.substr(0, pos);
}

string os::Path::strP(int i) const
{
    string r = enumerate_strP(i);
    if ( r.empty() && i ) throw gl::ex("Invalid path (p) [$1]", s);
    // && i is to support paths starting from / - unix root
    return r;
}

int os::Path::size() const
{
    int n = 1;
    size_t pos = 0;
    while ( (pos = s.find( SL, pos )) != std::string::npos )
    {
        n++;
        pos++;
    }
    return n;
}

bool os::FileSys::erase(Path x)
{
    if ( x.isfile() ) return rmFile(x.str());
    else if ( !x.isdir() ) return false;
    else
    {
        Dir d = readDir(x);

        for ( size_t i = 0; i < d.files.size(); i++ )
        {
            rmFile((x + d.files[i].first).str());
        }

        for ( size_t i = 0; i < d.dirs.size(); i++ )
        {
            erase(x + d.dirs[i]);
        }

        return rmDir(x.str());
    }
}

void os::FileSys::move(Path o, Path n)
{
    if ( !rename(o.str(), n.str()) )
        throw gl::ex("Failed to move files $1 -> $2", o.str(), n.str());
}

const os::Path & os::Path::operator+=(const Path & p)
{
    const string & ps = p.str();

    if ( empty() )
        s = ps;

    else if (!p.empty())
    {
        if ( ps[0] == SL )
            //if ( ps[0] == SL || s[s.size()-1] == SL )
            // FIX double slash should not be, but tests fail
        {
            if ( ps.size() > 1 )
                s += ps;
        }
        else
            s += SL + ps;
    }

    return *this;
}

os::Dir os::FileSys::readDirEx(Path d, bool dsort, bool fsort)
{
    if ( !dsort && !fsort ) return readDir(d);

    Dir r = readDir(d);

    if (dsort) std::sort( r.dirs.begin(), r.dirs.end() );
    if (fsort) std::sort( r.files.begin(), r.files.end() );

    return r;
}

