// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _OS_FILESYS
#define _OS_FILESYS

#include <string>
#include <vector>

#include "gl_defs.h"

#include "os_place.h"

using std::string;

namespace os
{

const char * getCwd(char * buf, int size);
bool makeDir(const string & s);
std::pair<int, int> isDirOrFile(const string & s); // 0 no, 1 file, 2 dir; second size
inline bool isDir(const string & s) { return isDirOrFile(s).first == 2; }
inline bool isFile(const string & s) { return isDirOrFile(s).first == 1; }
inline int fileSize(const string & s) { std::pair<int, int> r = isDirOrFile(s); return r.first == 1 ? r.second : 0; }
bool rmDir(const string & s);
bool rmFile(const string & s);
bool rename(string old, string n);

class Path;

struct Dir
{
    typedef std::vector<string> vs;
    typedef std::vector< std::pair<string, gl::intint> > vpsii;
    vs dirs;
    vpsii files;
};

namespace FileSys
{
Path cwd();
Path mkdir(Path d);
Path trymkdir(Path d);
Dir readDir(Path d);
Dir readDirEx(Path d, bool dsort, bool fsort);
void move(Path o, Path n);
bool erase(Path x);
bool truncate(const string & s, gl::intint size);
double howold(const string & s);
};

class Path
{
        string s;
        static const char SL = '/';

        string enumerate_strI(int i) const;
        string enumerate_strP(int i) const;

    public:
        Path() {}
        bool empty() const { return s.empty(); }
        Path(const string & a): s(a) {}
        Path(const char * a): s(a) {}

        const string & str() const { return s; }
        string strI(int i) const; // str(1) ddd/bbb/ccc -> bbb
        string strP(int i) const; // str(1) ddd/bbb/ccc -> ddd/bbb

        int size() const;

        Path operator+(const Path & p) const { Path r(*this); return r += p; }
        const Path & operator+=(const Path & p);
        const Path & operator=(const string & x) { s = x; return *this; };
        Path & glue(const string & x) { s += x; return *this; }

        bool isdir() const { return os::isDir(s); }
        bool isfile() const { return os::isFile(s); }
        int filesize() const { return os::fileSize(s); }

        void mkdir() { FileSys::mkdir(s); }
        void erase() { FileSys::erase(*this); }

	double howold() const { return FileSys::howold(s); }
};



} // os

#endif
