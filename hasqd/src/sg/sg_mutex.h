// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _OS_MUTEX
#define _OS_MUTEX

#include "os_sem.h"

namespace sgl
{

class Mutex
{
        os::Semaphore & sem;

    public:
        Mutex(os::Semaphore & s) : sem(s) { sem.down(); }
        ~Mutex() { sem.up(); }
    private:
        void operator=(const Mutex &);
        Mutex(const Mutex &);
};

} // sgl

#endif
