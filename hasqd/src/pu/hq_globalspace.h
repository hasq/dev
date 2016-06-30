// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _HQ_GLOBALSPACE
#define _HQ_GLOBALSPACE

#include "gl_queue.h"

#include "hq_config.h"
#include "hq_logger.h"

#include "hq_db.h"


#include "hq_gl_ced.h"
#include "hq_gl_svt.h"
#include "hq_gl_bin.h"
#include "hq_gl_con.h"
#include "hq_gl_wkr.h"
#include "hq_gl_key.h"


class GlobalSpace
{
    public:

        const Config * config;

        WkrArea wkrArea;
        CedArea cedArea;
        BinArea binArea;
        SvtArea svtArea;
        ConArea conArea;
        KeyArea keyArea;

        db::Database database;

        bool stopPublisher;
        int publisherState; // 0 - initialising, 1 - running, 2 - error

        gl::HttpHq protHttp;
        gl::Udp  protUdp;

        Logger logger;

        typedef gl::UnsafeFastQueue<char> ActivityQueueType;
        ActivityQueueType activity;

        int cpu_load; // percent
        bool netdisabled;

    public:
        GlobalSpace(const Config * c);

        void stopPublisherSignal();

    private:
        void operator=(const GlobalSpace &) const;
        GlobalSpace(const GlobalSpace &);

};

#endif
