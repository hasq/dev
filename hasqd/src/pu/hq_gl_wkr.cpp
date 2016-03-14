// Hasq Technology Pty Ltd (C) 2013-2015

#include <iostream>
#include <cstring>

#include "gl_err.h"
#include "gl_defs.h"

#include "os_timer.h"

#include "sg_mutex.h"
#include "sg_cout.h"

#include "hq_svttask.h"
#include "hq_globalspace.h"

void JobQueue_dtor(std::queue<os::net::Socket *> & jobs)
{
    while ( !jobs.empty() )
    {
        os::net::Socket * s = jobs.front();
        string req = s->getReceivedMessage();

        delete s;
        jobs.pop();
        std::cout << "Job [" << req << "] discarded\n";
    }
}

JobQueue::~JobQueue()
{
    for ( msq::iterator i = mjobs.begin(); i != mjobs.end(); ++i )
    {
        que & jobs = i->second;
        JobQueue_dtor(jobs);
    }
}


er::Code JobQueue::add(os::net::Socket * s)
{
    if ( maxSize < size() ) return er::JOB_QUEUE_FULL;
    string ip = s->getAddr().strIp();
    mjobs[ip].push(s);
    return er::OK;
}

int JobQueue::size() const
{
    int sum = 0;
    for ( msq::const_iterator i = mjobs.begin(); i != mjobs.end(); ++i )
    {
        sum += static_cast<int>(i->second.size()); // this value cannot be big
    }
    return sum;
}

os::net::Socket * JobQueue::extractJob()
{
    if ( mjobs.empty() ) return 0;

    msq::iterator i = mjobs.upper_bound(lastip);
    if ( i == mjobs.end() ) i = mjobs.begin();

    que & jobs = i->second;

    os::net::Socket * s = jobs.front();
    jobs.pop();

    lastip = i->first;

    if ( jobs.empty() ) mjobs.erase(i);

    return s;
}

bool ZeroPolicy::request(const os::net::Socket * sk)
{
    if ( limit <= 0 )
        return (limit < 0);

    string now = os::Timer::getGmd();

    if ( now != today )
    {
        today = now;
        requests.clear();
    }

    os::PlaceholderAddr a = sk->getAddr().getPlaceholder();
    for ( dq::iterator i = requests.begin(); i != requests.end(); i++ )
    {
        if ( !i->issame(a) )
            continue;

        return ++(*i).counter < limit;
    }

    requests.push_front(Lrec(a));

    while ( (int)requests.size() > maxSz ) requests.pop_back();

    return true;
}

bool ZeroPolicy::Lrec::issame(os::PlaceholderAddr b) const
{
    return !memcmp(&ip, &b, sizeof(b));
}
