// Hasq Technology Pty Ltd (C) 2013-2015

#ifndef _HQ_ACCESS
#define _HQ_ACCESS

#include "os_sem.h"

namespace hq
{

// code inlined intentionally
class AccessController
{
        os::Semaphore in, out, write;
        int in_ctr, out_ctr;
        bool wait;

    public:

        AccessController() : in(1), out(1), write(0), in_ctr(0), out_ctr(0), wait(false) {}

        void acquireRead()
        {
            in.down();
            in_ctr++;
            in.up();
        }

        void releaseRead()
        {
            out.down();
            out_ctr++;
            if (wait && (in_ctr == out_ctr)) write.up();
            out.up();
        }

        void acquireWrite()
        {
            in.down();
            out.down();
            if (in_ctr == out_ctr) out.up();
            else
            {
                wait = true;
                out.up();
                write.down();
                wait = false;
            }
        }

        void releaseWrite()
        {
            in.up();
        }

};

class LockRead
{
    public:
        LockRead(AccessController * ac) : ac(ac) { ac->acquireRead(); }
        ~LockRead() { ac->releaseRead(); }

    private:
        AccessController * ac;
};

class LockWrite
{
    public:
        LockWrite(AccessController * ac) : ac(ac) { ac->acquireWrite(); }
        ~LockWrite() { ac->releaseWrite(); }

    private:
        AccessController * ac;
};

} // hq

#endif
