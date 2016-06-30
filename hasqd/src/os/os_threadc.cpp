// Hasq Technology Pty Ltd (C) 2013-2016

#include <exception>
#include <iostream>

#include "gl_defs.h"

#include "os_thread.h"

void os::Thread::run(Blockable & object, int mode) try
{
    TRACE0

    object.run(mode);
}
catch (gl::Exception e)
{
    std::cout << "ERROR: " << e.str() << std::endl;
    throw;
}


os::Thread::~Thread()
{
    if (!started)
        return;

    if ( std::uncaught_exception() )
        return;

    join();
}
