// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _HQ_ALARMS
#define _HQ_ALARMS

#include <vector>

#include "os_timer.h"
#include "os_sysinfo.h"
#include "gl_defs.h"
#include "hq_config.h"

class GlobalSpace;

class Alarms
{
        GlobalSpace * gs;
        os::CpuIdle cpuMonitor;

    public:

        typedef void (Alarms::*function)();

        struct Alarm
        {
            gl::intint period;
            os::Timer timer;
            function does;
            Alarm(gl::intint p, function d): period(p), does(d) {}
        };

        std::vector<Alarm> alarms;

        Alarms(GlobalSpace * gs);

        void trigger();

        void pulse();
        void reorg();
        void cpuld();
};

#endif
