// testing random8 from sysinfo

#include <iostream>
#include <fstream>
//#include <cstring>

#include "gl_except.h"
#include "gl_utils.h"

///#include "ma_skc.h"
///#include "ma_utils.h"
#include "os_filesys.h"

void test01();

void test01()
{
    const char file[] = "old.tmp";

    {
        std::ofstream of(file);
        of << "hello\n";
    }

    os::Path pfile(file);

    std::cout << "Tmp file : " << pfile.howold() << " sec\n";

    double secs = os::Path("makefile").howold();
    std::cout << "makefile : " << secs << " sec\n";
    std::cout << "makefile : " << secs/60 << " min\n";
    std::cout << "makefile : " << secs/60/60 << " hours\n";
    std::cout << "makefile : " << secs/60/60/24 << " days\n";
    std::cout << "makefile : " << secs/60/60/24/30 << " months\n";
    std::cout << "makefile : " << secs/60/60/24/365 << " years\n";

    pfile.erase();
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

