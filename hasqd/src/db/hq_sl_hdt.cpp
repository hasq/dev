// Hasq Technology Pty Ltd (C) 2013-2015

#include <fstream>

#include "gl_except.h"

#include "os_timer.h"

#include "hq_sl_hdt.h"


os::Path db::SliceHdt::prepareHdt(const db::Traits * t, bool write)
{
    os::Path p = t->getMetaPath();
    if ( write && !p.isdir() )
        os::FileSys::trymkdir(p);

    p += string("hdt.txt");
    return p;
}

void db::SliceHdt::writeHead(const Traits * t, const string & s)


{
    os::Path p = prepareHdt(t, true);
    std::ofstream of(p.str().c_str(), std::ios::binary);
    of << s << '\n';

    if ( !of )
        throw gl::ex("Failed to write " + p.str());
}

void db::SliceHdt::writeLine(const Traits * t, gl::intint n, const string & s, const string & h)
{
    os::Path p = prepareHdt(t, true);
    std::ofstream of(p.str().c_str(), std::ios::app | std::ios::binary);
    of << n << ' ' << s << ' ' << h << ' '
       << os::Timer::getGmd() << ' ' << os::Timer::getHms() << '\n';
}

