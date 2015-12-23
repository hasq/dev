#include <iostream>
#include <sstream>
//#include <cstring>

#include "gl_except.h"
#include "gl_utils.h"

#include "ma_skc.h"
#include "ma_utils.h"
#include "os_sysinfo.h"

int main()
try
{
    void test01();
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

void test01()
{
    string x = os::random8();
    std::cout << "-" << ma::toHex(x) << "-" << std::endl;

    const int sz = os::rand8sz;

    for ( int k = 0; k < 1000; k++ )
    {

        if ( x.size() != sz ) throw gl::ex("bad");

        string x = os::random8();
        int count = 0;

        for ( int j = 0; j < sz; j++ )
            for ( int i = j + 1; i < sz; i++ )
                if ( x[i] == x[j] ) count++;

        if (count > 1) std::cout << k << " count=" << count << '\n';
        if (count > 4) throw gl::ex("count");
    }

}

