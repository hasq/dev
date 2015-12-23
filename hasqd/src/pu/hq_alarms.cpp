// Hasq Technology Pty Ltd (C) 2013-2015

#include "sg_cout.h"

#include "hq_globalspace.h"
#include "hq_alarms.h"

void Alarms::trigger()
{
    for ( size_t i = 0; i < alarms.size(); i++ )
    {
        Alarm & a = alarms[i];

        if ( a.period == 0 ) continue;
        if ( a.timer.get() < a.period ) continue;

        a.timer.init();
        (this->*a.does)();
    }
}


Alarms::Alarms(GlobalSpace * g): gs(g)
{
    cpuMonitor.idle = cpuMonitor.busy = 0;
    alarms.push_back( Alarm(gs->config->seTimeout, &Alarms::pulse) );
    alarms.push_back( Alarm(gs->config->reorgToutS * 1000, &Alarms::reorg) );

    int cpuLoadCycle = gs->config->cpuLoadCycle;
    if ( cpuLoadCycle == 0 ) cpuLoadCycle = gs->config->seTimeout;
    alarms.push_back( Alarm(cpuLoadCycle, &Alarms::cpuld) );
    os::cpuLoad(cpuMonitor);
}

void Alarms::pulse()
{
    if (gs->config->dbg.evt) os::Cout() << "(P)" << os::flush;
}

void Alarms::reorg()
{
    if (gs->config->dbg.evt) os::Cout() << "(R)" << os::flush;

    SvtJob sjob( gs, SvtJob::Reorg );
    gs->svtArea.addJob_safe( sjob );

    gs->activity.push('r');
}

void Alarms::cpuld()
{
    gs->cpu_load = os::cpuLoad(cpuMonitor);
}
