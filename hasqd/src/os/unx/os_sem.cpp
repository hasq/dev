// Hasq Technology Pty Ltd (C) 2013-2015

//#include <cstdio> // debug printf

#include <unistd.h>
#include <errno.h>

#include <semaphore.h>

#include "gl_except.h"
#include "gl_utils.h"

#include "os_sem.h"

typedef sem_t TypeSem;

inline TypeSem & native(os::PlaceholderSemaphore & p) { return *gl::p2p<TypeSem>(&p); }

void os::PlaceholderSemaphore::check()
{
    int s1 = sizeof(TypeSem);
    int s2 = sizeof(os::PlaceholderSemaphore);
    if ( s1 > s2 )
        throw gl::ex("os::PlaceholderSemaphore $1:$2", gl::tos(s1), gl::tos(s2));
}


os::Semaphore::Semaphore(int x)
{
    //string bef = placeholder.dump();

    int k = sem_init(&native(placeholder), 0, x);

    if ( k )
    {
        //string aft = placeholder.dump();
        //std::printf("INITSEM: k:%d p:%p before:%s after:%s\n",k,&native(placeholder),bef.c_str(),aft.c_str());
        k = errno;
        std::perror("Init semaphore failed");
        std::printf("INITSEM: k:%d p:%p\n", k, &native(placeholder));
        throw gl::ex("Init semaphore error: errno=$1", gl::tos(k));
    }
}

os::Semaphore::~Semaphore()
{
    //string bef = placeholder.dump();

    //std::printf("DELSEM: p:%p val:%s\n",&native(placeholder),bef.c_str());

    sem_destroy(&native(placeholder));
}

void os::Semaphore::down()
{
    //int e0 = errno;
    //string bef = placeholder.dump();

    int k = sem_wait(&native(placeholder));

    //string aft = placeholder.dump();

    //std::printf("SEMWAIT %p, before:%s after:%s\n",   &native(placeholder),bef.c_str(),aft.c_str());


    if (k)
    {
        //int e = errno;

        //int a=-13;
        //int k1 = sem_getvalue(&native(placeholder),&a);

        //std::printf("sem_wait: %p return:%d errno:%d(%d) val:%d res:%d\n"
        //  ,&native(placeholder),k,e,e0,a,k1);

        throw gl::ex("Wait semaphore error: errno=$1", gl::tos(k));
    }

}


void os::Semaphore::up()
{
    int k = sem_post(&native(placeholder));
    if ( k ) throw gl::ex("Post semaphore error: errno=$1", gl::tos(k));
}
