// Hasq Technology Pty Ltd (C) 2013-2016

#include <direct.h>
#include <io.h>
#include <fcntl.h>

#include <sys/types.h>
#include <sys/stat.h>
#include <cstdio>
#include <iostream>

#include <time.h>

#include "os_filesys.h"

const char * os::getCwd(char * buf, int sz)
{
    return _getcwd(buf, sz);
}

bool os::makeDir(const string & s)
{
    return !_mkdir(s.c_str());
}

std::pair<int, int> os::isDirOrFile(const string & s) // 0 no, 1 file, 2 dir
{
    struct _stat buf;
    int r = _stat( s.c_str(), &buf );
    if (r && s.size() )
    {
        // test unix case ".../aaa/"
        if ( s[ s.size() - 1 ] == '/' )
        {
            string u = s.substr(0, s.size() - 1);
            std::pair<int, int> k = isDirOrFile(u);
            if ( k.first == 2 ) return k;
        }

        return std::pair<int, int>(0, 0);
    }

    int sz = gl::x2i(buf.st_size);
    if ( buf.st_mode & _S_IFDIR ) return std::pair<int, int>(2, sz);
    if ( buf.st_mode & _S_IFREG ) return std::pair<int, int>(1, sz);


    return std::pair<int, int>(0, 0);
}


os::Dir os::FileSys::readDir(Path d)
{
    Dir dir;

    _finddata_t f;
    intptr_t handle;

    Path filemask(d + "*");

    if ( (handle = _findfirst(filemask.str().c_str(), &f) ) != -1L )

        do
        {

            std::string name(f.name);
            if ( name == "." || name == ".." ) continue;

            if ( !(f.attrib & _A_SUBDIR)  )
            {
                // file
                gl::intint sz =  f.size;
                dir.files.push_back(std::pair<string, gl::intint>(name, sz));
            }
            else
                dir.dirs.push_back(name);

        }
        while ( _findnext(handle, &f) != -1 );

    _findclose(handle);

    return dir;
}

bool os::rmDir(const string & s)
{
    return !_rmdir(s.c_str());
}

bool os::rmFile(const string & s)
{
    return !_unlink(s.c_str());
}

bool os::rename(std::string old, std::string n)
{
    return !::rename(old.c_str(), n.c_str());
}

bool os::FileSys::truncate(const string & s, gl::intint size)
{
    bool ret = false;
    int fd = _open(s.c_str(), _O_RDWR);

    if ( fd != -1 )
    {
        if ( _chsize_s(fd, size) == 0 )
            ret = true;
        _close(fd);
    }
    return ret;
}

double os::FileSys::howold(const string & s)
{
    struct _stat64 buf;
    int r = _stat64( s.c_str(), &buf );
    if (r) return -1;
    return difftime(time(0),buf.st_mtime);
}


//#ifdef _O_BINARY
struct Setmode2binary
{
    Setmode2binary()
    {
        std::ios_base::sync_with_stdio(true);
        _setmode( _fileno(stdout), _O_BINARY );
    }
} Setmode2binary_dummy;
//#endif
