// Hasq Technology Pty Ltd (C) 2013-2015

#include <windows.h>
#include <iostream>
#include <cstdio>

#include "gl_except.h"
#include "gl_utils.h"
#include "os_thread.h"

typedef HANDLE TypeThr;

inline TypeThr & native(os::PlaceholderThread & p) { return *gl::p2p<TypeThr>(&p); }

void os::PlaceholderThread::check()
{
    int s1 = sizeof(TypeThr);
    int s2 = sizeof(PlaceholderThread);
    if ( s1 > s2 )
        throw gl::ex("os::PlaceholderThread $1:$2", gl::tos(s1), gl::tos(s2));
}


void os::Thread::sleep(unsigned long msec)
{
    Sleep(msec);
}

DWORD WINAPI thread_func(LPVOID data)
{
    os::Thread::run(*gl::p2p<os::Blockable>(data));
    return 0;
}

std::string GetLastErrorAsStr(int k)
{
    //Get the error message, if any.
    DWORD errorMessageID = k;
    if (errorMessageID == 0)
        return "No error message has been recorded";

    char messageBufferC[1000];
    FormatMessageA(
        //FORMAT_MESSAGE_ALLOCATE_BUFFER |
        FORMAT_MESSAGE_FROM_SYSTEM |
        FORMAT_MESSAGE_IGNORE_INSERTS,
        NULL, errorMessageID,
        MAKELANGID(LANG_NEUTRAL, SUBLANG_DEFAULT),
        messageBufferC, 1000, NULL);

    std::string message = messageBufferC;

    return message;
}


void os::Thread::start(Blockable & object)
{
    HANDLE han = CreateThread(NULL, 0, thread_func, &object, 0, NULL);

    if ( han == NULL )
    {
        int k = GetLastError();
        throw gl::ex("Thread creation failed [" + gl::tos(k)
                     + "]\nMessage:\n" + GetLastErrorAsStr(k) );
    }

    native(placeholder) = han;
}

void os::Thread::join()
{
    WaitForSingleObject(native(placeholder), INFINITE);
    CloseHandle(native(placeholder));
}



