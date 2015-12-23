#include <cstdio>

#define TEST_MEMORY 1
#include "gl_defs.h"

void func()
{
    TRACE
    void * p = new char;
    REPORT(p);
}

int main()
{

    gl::intint a = 0;

    TRACE0
    func();

    return gl::ii2i(a);
}
