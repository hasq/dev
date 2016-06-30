// Hasq Technology Pty Ltd (C) 2013-2016

#include <sstream>
#include <fstream>

#include "gl_except.h"
#include "gl_utils.h"
#include "os_timer.h"

#include "hq_sl_meta.h"

os::Path db::SliceMeta::file() const
{
    os::Path r = dir() + gl::tos(n);
    r.glue(string(".meta.") + tr->sn() + ".txt");
    return r;
}

os::Path db::SliceMeta::sub_dir() const
{
    if ( n < 10 ) return "";
    string s = gl::tos(n);
    os::Path r;
    for ( string::size_type i = 0; i < s.size() - 1; i++ )
    {
        r += s.substr(i, 1);
    }
    return r;
}

string db::SliceMeta::write(const string & sfile, const string & hash)
{
    std::ostringstream os;
    string s = sfile;
    string::size_type pos = s.find_last_of('/');

    if (pos != s.npos )
        s = s.substr(pos + 1);
    os << s << ' ' << hash << ' ' << os::Timer::getGmd() << ' ' << os::Timer::getHms();

    {
        std::ofstream of( file().str().c_str(), std::ios::app | std::ios::binary);

        if ( !of )
            throw gl::ex("Cannot open file for write " + file().str());

        of << os.str() << '\n';

        if ( !of )
            throw gl::ex("Failed to write " + file().str());
    }

    return os.str();
}
