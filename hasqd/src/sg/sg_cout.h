// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _OS_COUT
#define _OS_COUT

#include <string>
#include <sstream>

#include "gl_defs.h"

#include "sg_mutex.h"

using std::string;

namespace os
{

struct Oref
{
    std::ostringstream so;
    int ref;
    Oref(): ref(1) {}
};

class Cout
{
        Oref * ref;
        void operator=(const Cout &);

    public:
        struct Flush {};
        struct Endl {};

        Cout(): ref(new Oref) { REPORT(ref); }
        void destroy()
        {
            (*this) << Flush();
            delete ref;
        }

        ~Cout()
        {
            if (!--ref->ref)
                destroy();
        }

        Cout(const Cout & c): ref(c.ref)
        {
            ++ref->ref;
        }

        friend const Cout & operator<<(const Cout & o, const char *);
        friend const Cout & operator<<(const Cout & o, void *);
        friend const Cout & operator<<(const Cout & o, const Flush & f);
        friend const Cout & operator<<(const Cout & o, const string & s);
        friend const Cout & operator<<(const Cout & o, char c);
        friend const Cout & operator<<(const Cout & o, int i);
        friend const Cout & operator<<(const Cout & o, size_t i);
        friend const Cout & operator<<(const Cout & o, const Endl & f);
};

string prmpt(const string & s1, unsigned short s2);

extern Cout::Flush flush;
extern Cout::Endl endl;

} // os

#endif
