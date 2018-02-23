#include <iostream>
#include <sstream>

#include "gl_except.h"
#include "gl_utils.h"

#include "ma_skc.h"
#include "ma_utils.h"
#include "os_timer.h"

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

void test01()
{
    string a = "aaa";
    std::cout << ma::b64enc(a) << '\n';
    if ( ma::b64enc(a) != "YWFh" ) throw "bad base64";
}
