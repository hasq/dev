// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _HQ_GL_CON
#define _HQ_GL_CON

#include "os_timer.h"

struct Connection
{
    string ipport;
    string name;
    unsigned dead;
    bool locked; // if locked, cannot be removed from close nbs
    os::Timer last_time_responded;

    Connection(): dead(0), locked(false), last_time_responded(0) {}
    Connection(const string & s, const string & n)
        : ipport(s), name(n), dead(0), locked(false) {}

    bool operator==(const Connection & c) const { return ipport == c.ipport; }
    bool operator<(const Connection & c) const { return ipport < c.ipport; }

    void failed() { ++dead; }
    void alive() { last_time_responded.init(); dead = 0; }
    bool isAlive() const { return (dead == 0); }
};

struct ConArea
{
    os::Semaphore access2conArea;

    size_t max_neighbours;
    size_t max_otherfamily;
    size_t max_hints;

    std::vector<Connection> neighbours;   // where to send notifications
    std::vector<Connection> otherfamily; // other family, not neighbours
    std::vector<Connection> hints; // someone hinted, maybe rubbish

    ConArea(size_t tn, size_t pn, size_t hn);
    er::Code addHint_safe(const string & hint);
};

#endif
