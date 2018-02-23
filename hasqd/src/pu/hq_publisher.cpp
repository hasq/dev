// Hasq Technology Pty Ltd (C) 2013-2016

#include "os_thread.h"

#include "sg_mutex.h"
#include "sg_cout.h"

#include "hq_publisher.h"

void Publisher::run()
try
{

    if ( globalSpace.stopPublisher ) return;

    const Config * cfg = globalSpace.config;

    if ( !globalSpace.config->quiet )
        os::Cout() << "Starting with threads: " << cfg->createThreadsStr() << os::endl;

    if ( cfg->createThreads == Config::ALL )
    {
        os::Thread ceThread(chiefEditor);
        os::Thread svThread(servant);

        std::vector<os::Thread> wt(workers.size());

        for ( std::vector<os::Thread>::size_type i = 0; i < wt.size(); i++ )
            wt[i].go( workers[i] );

        globalSpace.svtArea.svtSemaphore.up();

        if (!cfg->noSecretary)
        {
            globalSpace.publisherState = 1; // started
            secretary.runForever();
        }
        else
            globalSpace.stopPublisher = true;

        // finished, let CE and workers to finish
        globalSpace.svtArea.svtSemaphore.up();
        globalSpace.cedArea.cedSemaphore.up();
        for ( std::vector<os::Thread>::size_type i = 0; i < wt.size(); i++ )
            globalSpace.wkrArea.workerSemaphore.up();
    }
    else
    {
        if ( cfg->createThreads == Config::SVT_ONLY )
        {
            os::Thread svThread(servant);
            while ( !globalSpace.stopPublisher )
            {
                if (!cfg->noSecretary) secretary.runOnce();

                size_t wsz = workers.size();

                for ( size_t i = 0; i < wsz; i++ )
                    workers[i].runOnceUnconditionally();

                chiefEditor.runOnceUnconditionally();
            }
        }
        else
        {
            while ( !globalSpace.stopPublisher )
            {
                if (!cfg->noSecretary) secretary.runOnce();

                size_t wsz = workers.size();

                for ( size_t i = 0; i < wsz; i++ )
                    workers[i].runOnceUnconditionally();

                chiefEditor.runOnceUnconditionally();
                servant.runOnceUnconditionally();
            }
        }
    }
}
catch (gl::ex e)
{
    globalSpace.publisherState = 2;
    globalSpace.stopPublisher = true;

    globalSpace.svtArea.svtSemaphore.up();
    globalSpace.cedArea.cedSemaphore.up();
    for ( int i = 0; i < globalSpace.config->getnWorkers(); i++ )
        globalSpace.wkrArea.workerSemaphore.up();

    throw;
}


Publisher::Publisher(const Config * c): globalSpace(c),
    workers(c->getnWorkers(), Worker(&globalSpace)), chiefEditor(&globalSpace),
    secretary(&globalSpace), servant(&globalSpace)
{
    if ( !globalSpace.logger.isOk() )
        throw gl::ex("Lock file present. Possible reasons:\n"
                     "1. Another instance is running on the same port: exit forst or use different port\n"
                     "2. Previous run crushed: run check integrity of the database (for more detail see doc)\n"
                     "3. None of the above: remove hq.*.lock file");

    for ( int i = 0; i < c->getnWorkers(); i++ )
    {
        workers[i].id() = i;
    }

    db::Database & db = globalSpace.database;

    er::Code k = db.initFromDisk();

    if ( globalSpace.config->quiet ) return;

    os::Cout() << "Database: " << k.str() << os::endl;
}

