// testing random8 from sysinfo

#include <iostream>
#include <sstream>
//#include <cstring>

#include "gl_except.h"
#include "gl_utils.h"

///#include "ma_skc.h"
///#include "ma_utils.h"
///#include "os_sysinfo.h"

void test01();

void test01()
{

}




int main()
try
{
    test01();
}
catch (const char * e)
{
    std::cout << "Error: " << e << "\n";
    return 1;
}
catch (string e)
{
    std::cout << "Error: " << e << "\n";
    return 2;
}
catch (gl::Exception e)
{
    std::cout << "Error: " << e.str() << "\n";
    return 2;
}
catch (...)
{
    std::cout << "Unknown error\n";
    return 3;
}

