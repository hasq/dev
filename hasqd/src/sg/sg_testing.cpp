// Hasq Technology Pty Ltd (C) 2013-2016

#include <fstream>

#include "gl_err.h"
#include "gl_except.h"
#include "gl_utils.h"

#include "os_block.h"
#include "os_thread.h"
#include "os_filesys.h"
#include "os_net.h"

#include "sg_testing.h"

void sgl::testing()
{
    TRACE
    er::enumerate_codes();
    testThreadReadFile();
}

void sgl::testThreadReadFile()
try
{
    struct ProcData
    {
        os::Semaphore sem_proc;
        os::Semaphore sem_main;
        bool exitf;
        string testfile;
        ProcData(): exitf(false),
            testfile("hqtest." + gl::tos( os::net::NetInitialiser::findpid() ) + ".tmp")
        {}
    } procData;

    struct Proc : os::Blockable
    {
        ProcData * data;
        Proc(ProcData * p): Blockable(&p->exitf), data(p) {}
        os::Semaphore * getMainSemaphore(void) const { return &data->sem_proc; }
        void runOnceUnconditionally()
        {
            try
            {
                std::ifstream in(data->testfile.c_str());
                string s;
                for ( int i = 0; i < 4; i++ ) in >> s;
                if ( s != "003" ) throw gl::ex("got C $1", s);

                char rdbuf[4];
                in.seekg(512 * 4);
                in.read(rdbuf, 4);
                s = string(rdbuf, 3);

                if ( s != "200" ) throw gl::ex("got D $1", s);

                data->sem_main.up();
                data->sem_proc.down();

                in.read(rdbuf, 4);
                s = string(rdbuf, 3);

                if ( s != "201" ) throw gl::ex("got E $1", s);
                data->sem_main.up();
            }
            catch (gl::ex e) { data->sem_main.up(); throw; } // Never
        }
    } proc(&procData);

    {

        os::Thread thread(proc);

        //os::Thread::sleep(10); procData.exitf = true; procData.sem.up();

        // first create file
        {
            std::ofstream of(procData.testfile.c_str(), std::ios::binary);
            for ( int i = 0; i < 1024; i++ )
            {
                string s = gl::tosHex(i, 3);
                of << s << '\n';
            }
        }

        // open file for reading and read something
        {
            std::ifstream in(procData.testfile.c_str());
            string s;
            for ( int i = 0; i < 4; i++ ) in >> s;
            if ( s != "003" ) throw gl::ex("got A $1", s);

            char rdbuf[4];
            in.seekg(256 * 4);
            in.read(rdbuf, 4);
            s = string(rdbuf, 3);

            if ( s != "100" ) throw gl::ex("got B $1", s);

            // now block and let other thread do reading
            procData.sem_proc.up();
            procData.sem_main.down();

            in.read(rdbuf, 4);
            s = string(rdbuf, 3);

            if ( s != "101" ) throw gl::ex("got C $1", s);

            procData.sem_proc.up();
            procData.sem_main.down();
        }

        procData.exitf = true; procData.sem_proc.up();

    } // finish thread

    os::Path(procData.testfile).erase();
}
catch (gl::ex e)
{
    throw gl::ex("Self-test mutlithreading file access failed ($1). "
                 "Possible reasons: file read/write problem or "
                 "unsupported operating system", e.str());
}
