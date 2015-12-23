// Hasq Technology Pty Ltd (C) 2013-2015

#include <sstream>
#include <fstream>

#include "gl_except.h"
#include "gl_utils.h"

#include "sg_mutex.h"
#include "sg_cout.h"
#include "os_net.h"
#include "os_timer.h"
#include "os_filesys.h"

#include "hq_logger.h"


void Logger::Queue::add(size_t maxBq, const string & s)
{
    sgl::Mutex mtx(access);
    q.push_back(s);
    if (q.size() >= maxBq) q.pop_front();
}

void Logger::Queue::get(std::vector<string> & v)
{
    sgl::Mutex mtx(access);
    for ( size_t i = 0; i < q.size(); i++ )
    {
        v.push_back(q[i]);
    }
}


void Logger::add(MsgType t, const string & s)
{
    switch (t)
    {
        case Critical: return criticals.add(maxB, s);
        case Overflow: return overflows.add(maxB, s);
        case Write: return writes.add(maxB, s);
        case Read: return reads.add(maxB, s);
        case Connect: return conns.add(maxB, s);
        case Conflict: return conflicts.add(maxB, s);
    }

    throw gl::Never("MemLogger::add bad type");
}

void Logger::get(MsgType t, std::vector<string> & s)
{
    switch (t)
    {
        case Critical: return criticals.get(s);
        case Overflow: return overflows.get(s);
        case Write: return writes.get(s);
        case Read: return reads.get(s);
        case Connect: return conns.get(s);
        case Conflict: return conflicts.get(s);
    }

    throw gl::Never("MemLogger::get bad type");
}


Logger::~Logger()
{
    if ( criticals.q.empty() && overflows.q.empty() && writes.q.empty()
            && reads.q.empty() && conns.q.empty() ) return;

    if ( nologfile ) return;

    //if( criticals.empty() ) return;
    string file = "hq." + gl::tos(locker.id) + ".log";
    std::ofstream of(file.c_str(), std::ios::binary | std::ios::app );

    of << "\n" << os::Timer::getGmd() << ' ' << os::Timer::getHms() << '\n';

    of << "Critical : " << criticals.q.size() << "\n"; criticals.deflate(of);
    of << "Overflow : " << overflows.q.size() << "\n"; overflows.deflate(of);
    of << "Write    : " << writes.q.size()    << "\n"; writes.deflate(of);
    of << "Read     : " << reads.q.size()     << "\n"; reads.deflate(of);
    of << "Connect  : " << conns.q.size()     << "\n"; conns.deflate(of);
    of << "Conflict : " << conflicts.q.size() << "\n"; conflicts.deflate(of);
    of << "===============\n";
}

void Logger::Queue::deflate(std::ostream & of)
{
    sgl::Mutex mtx(access);
    while ( !q.empty() )
    {
        of << q.front() << '\n';
        q.pop_front();
    }
}

Locker::Locker(int id, bool ignlck): id(id), ok(false), ignore(ignlck)
{
    if ( ignore )
    {
        ok = true;
        return;
    }

    string file = "hq." + gl::tos(id) + ".lock";
    if ( os::Path(file).isfile() ) return;
    ok = true;
    std::ofstream of(file.c_str(), std::ios::binary);
    of << os::net::NetInitialiser::pid_ << '\n';
}

Locker::~Locker()
{
    if ( !ok || ignore ) return;
    string file = "hq." + gl::tos(id) + ".lock";
    os::FileSys::erase( os::Path(file) );
}

