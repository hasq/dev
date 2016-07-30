// implementation for GCC, UNIX or Windows-cygwin

#include <dirent.h>
#include <sys/stat.h>
#include <unistd.h>

#include "readdir.h"

std::map<std::string, std::pair<unsigned long, long> >
readdir()
{

    std::map<std::string, std::pair<unsigned long, long> > r;

    DIR * dir = opendir(".");

    if ( !dir ) return r;

    struct dirent * de;

    while ( de = readdir(dir) )
    {

        struct stat st;
        std::string nm(de->d_name);

        if ( nm == "." || nm == ".." ) continue;

        if ( -1 == stat(nm.c_str(), &st) ) continue;

        long sz;
        unsigned long tm;

        sz = st.st_size;
        tm = st.st_mtime;

        // I do not know how to learn if an entry is a directory
        // so let's hack
        std::string cwd = dir::getd();
        if ( dir::setd(nm) )
        {
            dir::setd(cwd);
            sz = -1L;
        }

        r[nm] = std::pair<unsigned long, long>(tm, sz);

    }

    closedir(dir);

    return r;
}

#ifdef _O_BINARY
void setmode2binary(FILE * f) { setmode( fileno(f), _O_BINARY ); }
#else
void setmode2binary(FILE * f) {}
#endif

namespace dir
{

bool setd(std::string s) { return !chdir(s.c_str()); }
std::string getd()
{
    int size = 100;
    char * p = new char[size];
    char * r = getcwd(p, size);
    while ( !r )
    {
        delete[] p;
        if ( size > 1000000L ) return "";
        size *= 2;
        p = new char[size];
        r = getcwd(p, size);
    }

    std::string rr(r);
    delete[] p;
    return rr;

}

bool make(std::string s)
{
    return !mkdir(s.c_str(), S_IRWXU | S_IRGRP | S_IXGRP | S_IROTH | S_IXOTH);
}

bool remove(std::string s)
{
    return !rmdir(s.c_str());
}

bool rename(std::string old, std::string n)
{
    return !::rename(old.c_str(), n.c_str());
}

} //dir

