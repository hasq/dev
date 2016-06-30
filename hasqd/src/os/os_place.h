// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _OS_PLACEHOLD
#define _OS_PLACEHOLD

#include <string>

using std::string;

namespace os
{


struct Placeholder
{
    Placeholder(int size); // init to 0 and check alignment
    string str(int size);
};

struct PlaceholderSemaphore : Placeholder
{
    int placeholder[ sizeof(void *) ]; // must be int for alignment

    void check();
    PlaceholderSemaphore(): Placeholder(sizeof(*this)) { check(); }
    string str() { return Placeholder::str(sizeof(*this)); }
};

struct PlaceholderThread : Placeholder
{
    int placeholder[2];
    void check();
    PlaceholderThread(): Placeholder(sizeof(*this)) { check(); }
    string str() { return Placeholder::str(sizeof(*this)); }
};

struct PlaceholderSocket : Placeholder
{
    int placeholder[8];
    void check();
    PlaceholderSocket(): Placeholder(sizeof(*this)) { check(); }
    string str() { return Placeholder::str(sizeof(*this)); }
};

struct PlaceholderAddr : Placeholder
{
    int placeholder[1];
    void check();
    PlaceholderAddr(): Placeholder(sizeof(*this)) { check(); }
    string str() { return Placeholder::str(sizeof(*this)); }
};

} // os

#endif
