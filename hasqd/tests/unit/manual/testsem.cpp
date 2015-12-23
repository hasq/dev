// Hasq Technology Pty Ltd (C) 2013-2015

#include "gl_except.h"

#include "os_sem.h"
#include "os_thread.h"
#include "os_block.h"
#include "os_place.h"

#include "sg_cout.h"

bool gexit = false;

struct Wrkr : os::Blockable
{
    os::Semaphore * s;
    int n;

    Wrkr(os::Semaphore * s, int n): Blockable(&gexit), s(s), n(n) {}
    void runOnceUnconditionally();
    os::Semaphore * getMainSemaphore() const { return s; }
};

void Wrkr::runOnceUnconditionally()
{
    os::Cout() << "[worker " << n << "] " << os::flush;
}

int main() try
{
    os::Semaphore sem;

    Wrkr w1(&sem, 1), w2(&sem, 2), w3(&sem, 3);

    os::Thread t1(w1), t2(w2), t3(w3);

    os::Thread::yield();
    os::Cout() << "\n" << os::flush;

    for ( int i = 1; i < 15; i++ )
    {
        os::Cout() << "[start step] " << os::flush;
        sem.up();
        os::Thread::sleep(1000 / i / i);
        os::Cout() << "[end step]\n" << os::flush;
    }

    // finishing threads
    gexit = true;
    for ( int i = 0; i < 3; i++ )
    {
        sem.up();
        os::Thread::yield();
    }

    return 1;
}
catch (gl::Exception e)
{
    os::Cout() << "Error: " << e.str() << os::endl;
}
