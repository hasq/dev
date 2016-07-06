// Hasq Technology Pty Ltd (C) 2013-2016

#include <fstream>

#include "gl_utils.h"
#include "gl_except.h"

#include "os_timer.h"

#include "hq_sl_file.h"

void db::SliceFile::make_gmd_dir()
{
    string year = gmd.substr(0, 4);
    string mon = gmd.substr(4, 2);
    string day = gmd.substr(6, 2);

    gmd_dir = os::Path(year) + mon + day;
}

string db::SliceFile::basename() const
{
    return gmd + "-" + gl::tos(n);
}

os::Path db::SliceFile::file() const
{
    os::Path r = dir() + gmd;
    r.glue("-" + gl::tos(n) + "." + tr->sn() + ".txt");
    return r;
}

void db::SliceFile::initFromFilename(const string & filename)
{
    string::size_type i = filename.find("-");
    string::size_type j = filename.find(".");
    if ( i == string::npos || i < 8 || j == string::npos || j < i )
        throw gl::ex("Bad slice filename " + filename);

    gmd = filename.substr(i - 8, 8);
    ++i;
    n = gl::toi( filename.substr(i, j - i) );
    make_gmd_dir();
    slice_dir = tr->getSlicePath();
}

void db::SliceFile::initCurTime()
{
    slice_dir = tr->getSlicePath();
    gmd = os::Timer::getGmd();
    n = 1;
    make_gmd_dir();
}


void db::SliceFile::advance()
{
    string newgmd = os::Timer::getGmd();
    if ( newgmd == gmd )
    {
        ++n;
    }
    else
    {
        gmd = newgmd;
        n = 1;
        make_gmd_dir();
    }
}


void db::SliceFile::write(const string & r)
{
    std::ofstream of(file().str().c_str(), std::ios::app | std::ios::binary);

    if ( !of )
        throw gl::ex("Cannot open file for write " + file().str());

    of << r << '\n';

    if ( !of )
        throw gl::ex("Failed to write " + file().str());
}

