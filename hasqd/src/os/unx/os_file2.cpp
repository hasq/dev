// Hasq Technology Pty Ltd (C) 2013-2016

#include <dirent.h>
#include <sys/stat.h>
#include <unistd.h>
#include <cstdio>

#include <time.h>

#include "os_filesys.h"

const char * os::getCwd(char * buf, int sz)
{
    return getcwd(buf, sz);
}

bool os::makeDir(const string & s)
{
    return !mkdir(s.c_str(), S_IRWXU | S_IRGRP | S_IXGRP | S_IROTH | S_IXOTH);
}

bool os::rmDir(const string & s)
{
    return !rmdir(s.c_str());
}

bool os::rmFile(const string & s)
{
    return !unlink(s.c_str());
}

std::pair<int, int> os::isDirOrFile(const string & s) // 0 no, 1 file, 2 dir
{
    struct stat buf;
    int r = stat( s.c_str(), &buf );
    if (r) return std::pair<int, int>(0, 0);
    int sz = gl::x2i(buf.st_size);
    if ( S_ISDIR(buf.st_mode) ) return std::pair<int, int>(2, sz);
    if ( S_ISREG(buf.st_mode) ) return std::pair<int, int>(1, sz);
    return std::pair<int, int>(0, 0);
}

os::Dir os::FileSys::readDir(Path d)
{
    os::Dir r;

    DIR * dir = opendir(d.str().c_str());

    if ( !dir ) return r;

    struct dirent * de;

    while ( (de = readdir(dir)) )
    {

        struct stat st;
        std::string nm(de->d_name);

        if ( nm == "." || nm == ".." ) continue;

        string fnm = (d + nm).str();

        if ( -1 == stat(fnm.c_str(), &st) ) continue;

        gl::intint sz =  st.st_size;

        if ( S_ISDIR(st.st_mode) )
            r.dirs.push_back(nm);
        else
            r.files.push_back(std::pair<string, gl::intint>(nm, sz));
    }

    closedir(dir);

    return r;

}

bool os::rename(std::string old, std::string n)
{
    return !::rename(old.c_str(), n.c_str());
}

bool os::FileSys::truncate(const string & s, gl::intint size)
{
    return ::truncate(s.c_str(), size) == 0;
}

double os::FileSys::howold(const string & s)
{
    struct stat buf;
    int r = stat( s.c_str(), &buf );
    if (r) return -1;
    return difftime(time(0),buf.st_mtime);
}

