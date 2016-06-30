// Hasq Technology Pty Ltd (C) 2013-2016

#include <iostream>

#include "gl_except.h"

#include "os_block.h"

void os::Blockable::runOnce()
try
{
    if ( *exitp ) return;
    Semaphore * sem = getMainSemaphore();
    if ( sem ) sem->down();
    if ( *exitp ) return;
    runOnceUnconditionally();
}
catch (gl::Exception e)
{
    std::cout << "ERROR: " << e.str() << std::endl;
    *exitp = true;
}


void os::Blockable::run(int mode)
{
    if ( mode == 0 ) runForever();
    if ( mode == 1 ) runOnce();
}
