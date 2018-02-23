// Hasq Technology Pty Ltd (C) 2013-2016

#ifndef _OS_SEMAPHORE
#define _OS_SEMAPHORE

#include "os_place.h"

namespace os
{

class Semaphore
{
        PlaceholderSemaphore placeholder;
    public:
        Semaphore(int x = 0);
        ~Semaphore();

        void down();
        void up();

        int value() const;
};

} // os

#endif
