// Hasq Technology Pty Ltd (C) 2013-2015

#include "gl_except.h"

#include "os_thread.h"
#include "os_block.h"

#include "sg_cout.h"

bool gexit = false;

struct Proc : os::Blockable
{
    os::Semaphore * s;
    int id;

    Proc(os::Semaphore * s, int n): Blockable(&gexit), s(s), id(n) {}
    void runOnceUnconditionally();
    os::Semaphore * getMainSemaphore() const { return 0; }
};


int Procptr = 1;
int Procmax = 10;

void Proc::runOnceUnconditionally()
{
    sgl::Mutex m(*s);
    if ( (Procptr % 3) != id )
    {
        os::Cout() << "(" << id << ") " << os::flush;
        os::Thread::yield();
        return;
    }

    os::Cout() << "[P" << id << "] " << os::flush;

    Procptr += 2;
}


int main() try
{
    os::Semaphore sem;

    Proc w1(&sem, 0), w2(&sem, 1), w3(&sem, 2);

    os::Thread t1(w1), t2(w2), t3(w3);

    // go
    sem.up();

    while ( Procptr < Procmax ) os::Thread::yield();
    gexit = true;
    os::Thread::yield();

    return 1;
}
catch (gl::Exception e)
{
    os::Cout() << "Error: " << e.str() << os::endl;
}
