// Hasq Technology Pty Ltd (C) 2013-2016

#include <pthread.h>
#include <iostream>
#include <cstdio>
#include <unistd.h>

#include "gl_except.h"
#include "gl_utils.h"

#include "os_thread.h"

typedef pthread_t TypeThr;


inline TypeThr & native(os::PlaceholderThread & p) { return *gl::p2p<TypeThr>(&p); }

void os::PlaceholderThread::check()
{
    int s1 = sizeof(TypeThr);
    int s2 = sizeof(os::PlaceholderThread);
    if ( s1 > s2 )
        throw gl::ex("os::PlaceholderThread $1:$2", gl::tos(s1), gl::tos(s2));
}


void os::Thread::sleep(unsigned long msec)
{
    usleep(msec * 1000);
}

void * thread_func(void * data)
{
    os::Thread::run(*gl::p2p<os::Blockable>(data));
    return 0;
}

void os::Thread::start(Blockable & object)
{
    int k = pthread_create(&native(placeholder), NULL, thread_func, &object);
    if ( k )
        throw gl::ex("Thread creation failed [" + gl::tos(k) + "]" );
}

void os::Thread::join()
{
    pthread_join(native(placeholder), NULL);
}




