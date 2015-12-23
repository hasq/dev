// Hasq Technology Pty Ltd (C) 2013-2015

#include <windows.h>

#include "gl_except.h"
#include "gl_utils.h"

#include "os_sem.h"

typedef HANDLE TypeSem;

inline TypeSem & native(os::PlaceholderSemaphore & p) { return *gl::p2p<TypeSem>(&p); }

void os::PlaceholderSemaphore::check()
{
    int s1 = sizeof(TypeSem);
    int s2 = sizeof(PlaceholderSemaphore);
    if ( s1 > s2 )
        throw gl::ex("os::PlaceholderSemaphore $1:$2", gl::tos(s1), gl::tos(s2));
}


os::Semaphore::Semaphore(int x)
{
    native(placeholder) = CreateSemaphore(NULL, x, 1024 * 1024, NULL);
}

os::Semaphore::~Semaphore()
{
    CloseHandle(native(placeholder));
}

void os::Semaphore::down()
{
    WaitForSingleObject(native(placeholder), INFINITE);
}


void os::Semaphore::up()
{
    ReleaseSemaphore(native(placeholder), 1, NULL);
}
