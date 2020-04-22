// Hasq Technology Pty Ltd (C) 2013-2016

#include <iostream>
#include <fstream>

#include "gl_utils.h"

#include "sg_cout.h"
#include "sg_mutex.h"

const bool TEE = false;

os::manip::Flush os::flush;
os::manip::Endl os::endl;

os::Semaphore cout_sem(1);

string os::prmpt(const string & s1, unsigned short s2)
{
    if ( s2 ) return "<" + s1 + ":" + gl::tos(s2) + "> ";
    return "<" + s1 + "> ";
}

const os::Cout & os::operator<<(const os::Cout & o, const os::manip::Flush & f)
{
    sgl::Mutex m(cout_sem);
    std::cout << o.ref->so.str() << std::flush;
    if (TEE)
    {
        std::ofstream of("hq.cout.log", std::ios::app);
        of << o.ref->so.str() << std::flush;
    }
    o.ref->so.str("");
    return o;
}

const os::Cout & os::operator<<(const os::Cout & o, const os::manip::Endl & f)
{
    return o << '\n' << os::flush;
}

const os::Cout & os::operator<<(const os::Cout & o, const char * c) { o.ref->so << c; return o; }
const os::Cout & os::operator<<(const os::Cout & o, void * p) { o.ref->so << p; return o; }
const os::Cout & os::operator<<(const os::Cout & o, const string & s) { o.ref->so << s; return o; }
const os::Cout & os::operator<<(const os::Cout & o, char c) { o.ref->so << c; return o; }
const os::Cout & os::operator<<(const os::Cout & o, int i) { o.ref->so << i; return o; }
const os::Cout & os::operator<<(const os::Cout & o, size_t i) { o.ref->so << i; return o; }
