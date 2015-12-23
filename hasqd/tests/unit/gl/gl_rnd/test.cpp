#include <iostream>

#include "gl_rnd.h"
#include "os_timer.h"
#include "os_thread.h"

int main()
try
{
    void test01(); test01();
}
catch (const char * e)
{
    std::cout << "Error: " << e << "\n";
    return 1;
}
catch (...)
{
    std::cout << "Unknown error\n";
    return 2;
}

void test01()
{
    if ( false ) // no random seed
        gl::Rnd::seed = gl::ii2ul(os::Timer(0).get());

    gl::Rnd r;
    for ( int i = 0; i < 100; i++ )
    {
        std::cout << r() << " ";
    }
}
