#ifndef READDIR_H
#define READDIR_H

#include <string>
#include <map>
#include <stdio.h> // FILE*

// returns name, time, size( -1L for a subdirectory )
std::map<std::string, std::pair<unsigned long, long> > readdir();
typedef std::map<std::string, std::pair<unsigned long, long> > msul;

void setmode2binary(FILE *);

namespace dir
{

bool setd(std::string s);
std::string getd();
bool make(std::string);
bool remove(std::string);
bool rename(std::string, std::string);
bool up();


class in
{
        std::string cwd;
    public:
        in(std::string s)
        {
            cwd = getd();
            if ( !setd(s) )
                throw std::string("cannot get into ") + s;
        }

        ~in()
        {
            if ( !setd(cwd) )
                throw std::string("cannot return to ") + cwd;
        }
};

} //dir


#endif
