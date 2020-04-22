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

namespace manip
{
struct Flush {};
struct Endl {};
} // manip

class Cout;

} // os

// ::
const os::Cout & operator<<(const os::Cout & o, const char *);
const os::Cout & operator<<(const os::Cout & o, void *);
const os::Cout & operator<<(const os::Cout & o, const os::manip::Flush & f);
const os::Cout & operator<<(const os::Cout & o, const string & s);
const os::Cout & operator<<(const os::Cout & o, char c);
const os::Cout & operator<<(const os::Cout & o, int i);
const os::Cout & operator<<(const os::Cout & o, size_t i);
const os::Cout & operator<<(const os::Cout & o, const os::manip::Endl & f);


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

        Cout(): ref(new Oref) { REPORT(ref); }
        void destroy()
        {
            (*this) << manip::Flush();
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

        friend const Cout & ::operator<<(const Cout & o, const char *);
        friend const Cout & ::operator<<(const Cout & o, void *);
        friend const Cout & ::operator<<(const Cout & o, const manip::Flush & f);
        friend const Cout & ::operator<<(const Cout & o, const string & s);
        friend const Cout & ::operator<<(const Cout & o, char c);
        friend const Cout & ::operator<<(const Cout & o, int i);
        friend const Cout & ::operator<<(const Cout & o, size_t i);
        friend const Cout & ::operator<<(const Cout & o, const manip::Endl & f);
};

string prmpt(const string & s1, unsigned short s2);

extern manip::Flush flush;
extern manip::Endl endl;

} // os

#endif
